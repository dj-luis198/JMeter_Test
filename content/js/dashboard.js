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

    var data = {"OkPercent": 97.23261032161555, "KoPercent": 2.767389678384443};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7948717948717948, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/73f71f5a-264e-4db9-8137-ec851b42480a"], "isController": false}, {"data": [0.3684210526315789, 500, 1500, "see books"], "isController": true}, {"data": [0.59375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.59375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/60a80fb3-8a76-46c5-b86a-83ee972f655b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/04b23768-68eb-44e8-abae-bf3c6641f8b4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1deab9d0-43cb-40d8-bd4e-a653cefef3d8"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8741150-0c7b-4b01-8361-c7f5cc6939c8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6bf4e0f9-ff45-4905-b16b-6bfbd9cbd92e"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.78125, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80aa02f8-653d-4083-8d26-60ffa03979e3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c8d2560b-330b-49c1-9c84-e25461f72090"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d805363-ff70-440d-98bd-ea751cede318"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6956521739130435, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0799d51-6a63-4ac6-9a04-25f78c8dc086"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36e0a67b-9d46-4214-bcad-4ae803a8a98b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04b23768-68eb-44e8-abae-bf3c6641f8b4"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/76cde08a-5d05-4ce5-a709-1b8c94409f22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dac61454-6d18-4494-bcd2-a966eb077680"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/75c2088b-0c52-4a41-ab03-fbe44ddab9c2"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8d2560b-330b-49c1-9c84-e25461f72090"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c8741150-0c7b-4b01-8361-c7f5cc6939c8"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1deab9d0-43cb-40d8-bd4e-a653cefef3d8"], "isController": false}, {"data": [0.4824561403508772, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73f71f5a-264e-4db9-8137-ec851b42480a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0799d51-6a63-4ac6-9a04-25f78c8dc086"], "isController": false}, {"data": [0.2711864406779661, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6bf4e0f9-ff45-4905-b16b-6bfbd9cbd92e"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8657142857142858, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b82eba6c-2e79-42b0-8d0a-acb78d6a205d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/80aa02f8-653d-4083-8d26-60ffa03979e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dac61454-6d18-4494-bcd2-a966eb077680"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6d805363-ff70-440d-98bd-ea751cede318"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76cde08a-5d05-4ce5-a709-1b8c94409f22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60a80fb3-8a76-46c5-b86a-83ee972f655b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f93172c5-81b1-4131-8d36-dcac187055d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/36e0a67b-9d46-4214-bcad-4ae803a8a98b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1337, 37, 2.767389678384443, 316.85489902767375, 79, 4128, 94.0, 870.2, 1049.999999999999, 1755.8599999999942, 5.14810921538503, 731.1707354947114, 3.7622889388329925], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/73f71f5a-264e-4db9-8137-ec851b42480a", 3, 0, 0.0, 487.33333333333337, 181, 980, 301.0, 980.0, 980.0, 980.0, 0.06421782686873877, 0.029056894318862915, 0.041181353818820106], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1384.6140350877192, 989, 2467, 1370.0, 1597.4, 1822.2999999999986, 2467.0, 0.2509045770277052, 301.92408062868105, 1.2336958450532183], "isController": true}, {"data": ["deleteBook", 16, 3, 18.75, 654.0000000000001, 85, 2453, 461.5, 1677.4000000000008, 2453.0, 2453.0, 0.08483248235749469, 0.0171435759939981, 0.056898446571442204], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 654.0000000000001, 85, 2453, 461.5, 1677.4000000000008, 2453.0, 2453.0, 0.08737821661059898, 0.017658036816265456, 0.05860590956627638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 115.66666666666667, 80, 248, 83.0, 246.8, 248.0, 248.0, 0.08578144032757072, 0.03154255045378382, 0.04844194097665029], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60a80fb3-8a76-46c5-b86a-83ee972f655b", 3, 0, 0.0, 283.0, 198, 433, 218.0, 433.0, 433.0, 433.0, 0.09350163627863488, 0.04230705547763752, 0.05996035920211937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 85.33333333333334, 80, 106, 83.0, 97.60000000000001, 106.0, 106.0, 0.08577947811765513, 0.06374822543704645, 0.043057277102026115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 162.99999999999997, 80, 649, 83.0, 407.8000000000002, 649.0, 649.0, 0.08578094976667582, 1.70307576530904, 0.05002213327214292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 157.4666666666667, 80, 882, 83.0, 499.2000000000002, 882.0, 882.0, 0.08578045921139164, 5.167273012395276, 0.049938077231006774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04b23768-68eb-44e8-abae-bf3c6641f8b4", 3, 0, 0.0, 324.3333333333333, 205, 416, 352.0, 416.0, 416.0, 416.0, 0.02378083581710952, 0.023850506234542455, 0.015250080260320882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1deab9d0-43cb-40d8-bd4e-a653cefef3d8", 3, 0, 0.0, 514.6666666666666, 223, 929, 392.0, 929.0, 929.0, 929.0, 0.055081244836133296, 0.03541193312218856, 0.03532228265858808], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 210.50000000000003, 83, 416, 197.5, 370.50000000000006, 416.0, 416.0, 0.08422027813746855, 0.12718372324690227, 0.0544316726805209], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 23, 0, 0.0, 97.52173913043478, 81, 248, 83.0, 181.8000000000002, 247.0, 248.0, 0.11993346300052667, 0.08913023959316484, 0.06020097654518624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 23, 0, 0.0, 96.52173913043477, 80, 250, 82.0, 179.4000000000002, 248.2, 250.0, 0.11982848896275418, 0.04771363661229232, 0.06746457895915932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 579.7142857142857, 409, 652, 633.0, 652.0, 652.0, 652.0, 0.09283573380016445, 27.29678817372218, 0.05294537943290629], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8741150-0c7b-4b01-8361-c7f5cc6939c8", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.014966643258427, 3.8733321629213484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 884.7142857142857, 739, 990, 943.0, 990.0, 990.0, 990.0, 0.09243120477473195, 83.16976053303095, 0.05262440662467649], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 130.85714285714286, 81, 249, 86.0, 249.0, 249.0, 249.0, 0.09323512566763009, 0.16498246846654857, 0.05162530884135378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 117.06666666666668, 81, 259, 84.0, 251.20000000000002, 259.0, 259.0, 0.06739755571531272, 0.050087441307961895, 0.03383041370866283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 104.33333333333333, 80, 246, 83.0, 244.2, 246.0, 246.0, 0.06735004512453023, 0.024765172842665804, 0.038033482513683284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6bf4e0f9-ff45-4905-b16b-6bfbd9cbd92e", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 0.6229795258620691, 2.3774245689655173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 172.46666666666664, 81, 946, 83.0, 526.0000000000002, 946.0, 946.0, 0.06735004512453023, 4.057055345180206, 0.039208600488512324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 152.73333333333332, 80, 648, 83.0, 405.60000000000014, 648.0, 648.0, 0.06740028128384055, 1.338150089754708, 0.039303666631468746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 83.0, 80, 87, 83.0, 87.0, 87.0, 87.0, 0.09324133521592029, 0.06929360947198764, 0.05235719506753337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 548.388888888889, 81, 1128, 724.5, 998.4000000000002, 1128.0, 1128.0, 0.08907231187185465, 44.53701611775855, 0.04811219276237982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 23, 0, 0.0, 175.73913043478262, 81, 1011, 83.0, 676.400000000001, 1001.1999999999998, 1011.0, 0.11993408839663768, 9.41359360008239, 0.06961187960181883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 390.05555555555554, 80, 728, 560.0, 661.4000000000001, 728.0, 728.0, 0.08917998999202334, 14.578393081862277, 0.04825744467124787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 23, 0, 0.0, 159.91304347826087, 81, 649, 84.0, 388.60000000000036, 615.3999999999995, 649.0, 0.11982848896275418, 3.0932763844097924, 0.06966760781959039], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 319.00000000000006, 84, 551, 353.0, 509.70000000000005, 551.0, 551.0, 0.0875378874919301, 0.017690304289903598, 0.05918317747486022], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80aa02f8-653d-4083-8d26-60ffa03979e3", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8d2560b-330b-49c1-9c84-e25461f72090", 3, 0, 0.0, 344.3333333333333, 208, 518, 307.0, 518.0, 518.0, 518.0, 0.029954469206805657, 0.03004222644080997, 0.019209083443166387], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d805363-ff70-440d-98bd-ea751cede318", 1, 0, 0.0, 551.0, 551, 551, 551.0, 551.0, 551.0, 551.0, 1.8148820326678765, 0.32788396098003625, 1.2512760889292196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 302.00000000000006, 164, 1028, 173.0, 713.0000000000002, 1028.0, 1028.0, 0.06732283994668031, 5.4668162215504905, 0.15026229960234644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 665.2173913043478, 102, 2889, 463.0, 1532.8, 2620.399999999996, 2889.0, 0.09991528921132084, 0.06137374698625079, 0.04517654189925933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 84.77777777777777, 80, 104, 83.0, 92.30000000000001, 104.0, 104.0, 0.08917998999202334, 0.06627536365618142, 0.044764174663964845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 128.05555555555557, 81, 248, 83.0, 248.0, 248.0, 248.0, 0.08918131552349431, 0.09827750004954516, 0.046700198428427035], "isController": false}, {"data": ["login", 23, 0, 0.0, 2949.4782608695655, 1171, 5538, 2931.0, 5132.000000000001, 5496.4, 5538.0, 0.0968257977603772, 35.38593582265092, 0.19495482997600405], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e0799d51-6a63-4ac6-9a04-25f78c8dc086", 2, 0, 0.0, 275.5, 197, 354, 275.5, 354.0, 354.0, 354.0, 0.015750511891636478, 0.026917378721058434, 0.009790235174830682], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36e0a67b-9d46-4214-bcad-4ae803a8a98b", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 23, 0, 0.0, 97.21739130434783, 83, 250, 87.0, 112.60000000000002, 223.39999999999964, 250.0, 0.11837974162334654, 0.09583672441968193, 0.04208029878017397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04b23768-68eb-44e8-abae-bf3c6641f8b4", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 634.611111111111, 165, 1211, 809.5, 1083.2000000000003, 1211.0, 1211.0, 0.08903486209489138, 59.23724328281429, 0.18758571151220765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76cde08a-5d05-4ce5-a709-1b8c94409f22", 3, 0, 0.0, 320.6666666666667, 176, 435, 351.0, 435.0, 435.0, 435.0, 0.06148674960546002, 0.028541700825972006, 0.03942997940193888], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dac61454-6d18-4494-bcd2-a966eb077680", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 286.9333333333333, 165, 963, 191.0, 588.0000000000002, 963.0, 963.0, 0.08573829243616783, 6.962206114140531, 0.19136496611908477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 646.090909090909, 81, 1074, 880.0, 1071.0, 1074.0, 1074.0, 0.08805847082462755, 67.04855148818815, 0.14730093281939208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75c2088b-0c52-4a41-ab03-fbe44ddab9c2", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.804157838983051, 3.3710716807909606], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 921.782608695652, 230, 1650, 959.0, 1474.6000000000001, 1616.5999999999995, 1650.0, 0.10065160976933277, 0.031556194231349914, 0.045411175501398185], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8d2560b-330b-49c1-9c84-e25461f72090", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 23, 0, 0.0, 295.6086956521739, 165, 1095, 169.0, 826.4000000000008, 1085.1999999999998, 1095.0, 0.11977669457984419, 12.629885904561409, 0.2667157246620214], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 89.26666666666665, 83, 113, 87.0, 106.4, 113.0, 113.0, 0.09700575567483671, 0.07531208570458514, 0.03448251471253961], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8741150-0c7b-4b01-8361-c7f5cc6939c8", 3, 0, 0.0, 343.6666666666667, 177, 555, 299.0, 555.0, 555.0, 555.0, 0.08098696109926301, 0.036644490861971225, 0.051934997840347705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 310.5, 165, 877, 325.5, 684.5, 877.0, 877.0, 0.08903020667726551, 7.736057978934817, 0.19860393481717012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 87.88888888888889, 81, 111, 83.0, 111.0, 111.0, 111.0, 0.08841559258094939, 0.0657072909708032, 0.044380482994734356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 145.44444444444446, 81, 326, 82.0, 326.0, 326.0, 326.0, 0.0884399198144727, 0.023664587919106955, 0.05043839176919147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 99.33333333333333, 81, 239, 82.0, 239.0, 239.0, 239.0, 0.08844078889183692, 0.023837556381002916, 0.05199351065711506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 100.0, 80, 238, 82.0, 238.0, 238.0, 238.0, 0.08844078889183692, 0.023837556381002916, 0.05207987861501724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 85.66666666666667, 84, 87, 86.0, 87.0, 87.0, 87.0, 0.04069231186587814, 0.012001052913569529, 0.025154524815528184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1deab9d0-43cb-40d8-bd4e-a653cefef3d8", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 955.9649122807018, 642, 2111, 881.0, 1248.4, 1444.4999999999984, 2111.0, 0.2508261862538449, 300.0753200509133, 0.4952837388723383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 921.782608695652, 230, 1650, 959.0, 1474.6000000000001, 1616.5999999999995, 1650.0, 0.09693638865591375, 0.03039140174232622, 0.043734972225617334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 105.42857142857143, 80, 241, 82.0, 241.0, 241.0, 241.0, 0.034465780403742, 0.009289604874446087, 0.020295767171344167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 82.57142857142857, 80, 89, 82.0, 89.0, 89.0, 89.0, 0.034465610706003416, 0.009289559135602483, 0.02026200941895904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73f71f5a-264e-4db9-8137-ec851b42480a", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 0.6498707284172661, 2.4800472122302155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 136.53333333333333, 80, 253, 83.0, 248.2, 253.0, 253.0, 0.09231848646918717, 0.024882717056148106, 0.054273172709424486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 169.73333333333335, 81, 257, 239.0, 252.2, 257.0, 257.0, 0.09231791829248778, 0.024882563914772098, 0.05436299290075208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 83.14285714285714, 81, 90, 82.0, 90.0, 90.0, 90.0, 0.03446595010315167, 0.009222334304944879, 0.019656362168203684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 116.26666666666668, 81, 249, 84.0, 245.4, 249.0, 249.0, 0.09231621380435116, 0.0686060924854602, 0.04633841200726221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 85.57142857142857, 82, 98, 84.0, 98.0, 98.0, 98.0, 0.034465610706003416, 0.02561360326881699, 0.017300120998911872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 131.53333333333333, 80, 330, 83.0, 284.40000000000003, 330.0, 330.0, 0.09241233150151557, 0.02472751839005397, 0.05270390780945809], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 88.0, 84, 98, 87.0, 98.0, 98.0, 98.0, 0.03366663300003367, 0.026499322459010877, 0.011967435949230719], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 748.0769230769231, 81, 3854, 501.0, 2704.3999999999987, 3854.0, 3854.0, 0.08933971081422838, 0.016737773345153664, 0.06080361928913079], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1529.1739130434785, 745, 4128, 1346.0, 2180.000000000001, 3777.999999999995, 4128.0, 0.10052227879635497, 0.052028132580144666, 0.046236321594807804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 192.42857142857142, 165, 325, 168.0, 325.0, 325.0, 325.0, 0.034451362059207125, 0.05339288241011886, 0.07748192072495509], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0799d51-6a63-4ac6-9a04-25f78c8dc086", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["addBook", 59, 20, 33.898305084745765, 883.9830508474575, 417, 2390, 698.0, 1578.0, 1741.0, 2390.0, 0.28085876136525917, 86.57020855399391, 1.0187777809182654], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 147.98245614035088, 82, 343, 85.0, 332.2, 334.2, 343.0, 0.2516334098534346, 0.18700490712740597, 0.12163919714594737], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 525.122807017544, 397, 803, 483.0, 725.0, 734.8999999999996, 803.0, 0.251240776818851, 73.87313036366001, 0.12635644537276197], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 130.94736842105263, 81, 343, 86.0, 250.0, 263.49999999999955, 343.0, 0.2519593152011033, 0.44584988197695236, 0.12253490133803657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bf4e0f9-ff45-4905-b16b-6bfbd9cbd92e", 3, 0, 0.0, 1401.6666666666667, 172, 3854, 179.0, 3854.0, 3854.0, 3854.0, 0.05694220366328177, 0.025764864287747935, 0.0365156709689665], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 800.859649122807, 555, 1776, 793.0, 1038.4, 1110.2999999999984, 1776.0, 0.25143250360607144, 226.23940871594084, 0.12620733091164132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 88.0, 83, 110, 85.0, 104.0, 110.0, 110.0, 0.09194375669055016, 0.06868845104323328, 0.032683132261094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 20, 11.428571428571429, 151.23428571428576, 83, 1871, 87.0, 286.20000000000005, 445.79999999999995, 1080.6000000000095, 0.7066024937011435, 1.5786020197727568, 0.3369374056180955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 85.0, 83, 88, 85.0, 88.0, 88.0, 88.0, 0.09061162849232318, 0.07017091933048074, 0.032209602315630505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b82eba6c-2e79-42b0-8d0a-acb78d6a205d", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 1.6047032035175879, 2.998390389447236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80aa02f8-653d-4083-8d26-60ffa03979e3", 3, 0, 0.0, 880.0, 416, 1723, 501.0, 1723.0, 1723.0, 1723.0, 0.027894262150275687, 0.027975983621419072, 0.017887922016941116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 88.93333333333334, 84, 105, 86.0, 100.2, 105.0, 105.0, 0.0845170414527916, 0.06858756000709942, 0.03004316707892201], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dac61454-6d18-4494-bcd2-a966eb077680", 3, 0, 0.0, 283.3333333333333, 195, 457, 198.0, 457.0, 457.0, 457.0, 0.02083260997882018, 0.02462343972431513, 0.013359453664803306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d805363-ff70-440d-98bd-ea751cede318", 3, 0, 0.0, 772.3333333333334, 175, 1541, 601.0, 1541.0, 1541.0, 1541.0, 0.046475600309837335, 0.02987933288148722, 0.029803689000774593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 234.44444444444446, 165, 408, 174.0, 408.0, 408.0, 408.0, 0.08834355828220859, 0.1369152607361963, 0.19868673312883436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 303.93333333333334, 164, 501, 327.0, 496.8, 501.0, 501.0, 0.09217609320846545, 0.14285494132991666, 0.2073061940030234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76cde08a-5d05-4ce5-a709-1b8c94409f22", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 0.8029513888888888, 3.064236111111111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60a80fb3-8a76-46c5-b86a-83ee972f655b", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.069018121301775, 4.0796042899408285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 86.86666666666667, 83, 94, 86.0, 94.0, 94.0, 94.0, 0.06836266851397789, 0.05667959528160862, 0.024300792323328078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f93172c5-81b1-4131-8d36-dcac187055d9", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.8247767857142858, 3.4095982142857144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 104.33333333333334, 83, 246, 86.0, 244.2, 246.0, 246.0, 0.084107826233231, 0.06529855649943227, 0.029897703856343834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36e0a67b-9d46-4214-bcad-4ae803a8a98b", 3, 0, 0.0, 1461.6666666666667, 300, 3583, 502.0, 3583.0, 3583.0, 3583.0, 0.028091728858633057, 0.028174028845523582, 0.018014552686037473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 94.21428571428574, 80, 246, 82.5, 167.0, 246.0, 246.0, 0.089171974522293, 0.06626940684713375, 0.04476015127388535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 127.92857142857143, 80, 245, 82.5, 244.5, 245.0, 245.0, 0.08917140655155062, 0.03342683724944427, 0.05032063888128101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 191.78571428571428, 81, 796, 87.0, 523.0, 796.0, 796.0, 0.08907665682581696, 5.747389189036572, 0.051820543940242283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 157.5, 79, 646, 83.5, 445.5, 646.0, 646.0, 0.08917254250027071, 1.8951528950821344, 0.0519634082064217], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 18.91891891891892, 0.5235602094240838], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.108108108108109, 0.2243829468960359], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 2.7027027027027026, 0.07479431563201197], "isController": false}, {"data": ["401/Unauthorized", 26, 70.27027027027027, 1.944652206432311], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1337, 37, "401/Unauthorized", 26, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 20, "401/Unauthorized", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
