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

    var data = {"OkPercent": 97.98206278026906, "KoPercent": 2.0179372197309418};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.813222079589217, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.49122807017543857, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf007df8-e73c-4cb9-96b2-cfc7e406c2a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2f3bf39-f1c1-4ee6-b481-2664b284bd1c"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cca3dcdd-83ce-47e6-8734-ec8c9466119a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/09caf1de-7441-4f49-b8cf-a183382ef9b8"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/65b6486d-dd12-4ed2-bbc8-c01437c5fafb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f73641a-d85c-4526-965a-51ebdef4b5fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4828c874-a725-4621-903e-a7e85643b107"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ed380b9-faaa-4b9c-9b77-012c2c9000e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b3ac5ad-1378-4f2b-a973-967aa13fc7a2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cda7e7bb-66e5-43bd-ba48-eb031dd039e9"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b8404fbe-f115-44b0-b166-d3f63cbcc7b8"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ec7b342-b6f8-411b-9ad1-075bd673565d"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a2f3bf39-f1c1-4ee6-b481-2664b284bd1c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8f73641a-d85c-4526-965a-51ebdef4b5fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09caf1de-7441-4f49-b8cf-a183382ef9b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4828c874-a725-4621-903e-a7e85643b107"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8b3ac5ad-1378-4f2b-a973-967aa13fc7a2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/02e3ce05-15e8-493b-9a4a-9a33904932a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf007df8-e73c-4cb9-96b2-cfc7e406c2a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de06cc1a-4b4d-490e-9f5e-e29f9713b711"], "isController": false}, {"data": [0.38524590163934425, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8ed380b9-faaa-4b9c-9b77-012c2c9000e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8245614035087719, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9301675977653632, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/362b6e76-496c-41dd-a134-67a2f7500c88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cca3dcdd-83ce-47e6-8734-ec8c9466119a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/60cdfee4-1456-40c9-b9e2-7d2d40327a62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02e3ce05-15e8-493b-9a4a-9a33904932a3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cda7e7bb-66e5-43bd-ba48-eb031dd039e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8404fbe-f115-44b0-b166-d3f63cbcc7b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bb8079da-0b21-410b-824b-239887e914b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1338, 27, 2.0179372197309418, 280.5979073243646, 81, 3445, 93.0, 695.700000000001, 839.05, 1487.2699999999993, 5.2917167626400055, 741.5401403461764, 3.8629078166526924], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1210.631578947368, 985, 1581, 1168.0, 1433.8, 1446.4, 1581.0, 0.2583264975005778, 310.85469991355126, 1.2701893700345794], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bf007df8-e73c-4cb9-96b2-cfc7e406c2a4", 3, 0, 0.0, 258.3333333333333, 164, 388, 223.0, 388.0, 388.0, 388.0, 0.04789195574783289, 0.03078991295637043, 0.03071196380964544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2f3bf39-f1c1-4ee6-b481-2664b284bd1c", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 491.7857142857143, 86, 1720, 399.0, 1211.0, 1720.0, 1720.0, 0.09598639735626037, 0.019691405875053133, 0.06425651893331687], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 491.7857142857143, 86, 1720, 399.0, 1211.0, 1720.0, 1720.0, 0.09589369498955444, 0.01967238818110209, 0.06419446085482379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 132.17647058823533, 81, 253, 84.0, 249.8, 253.0, 253.0, 0.0774844005670035, 0.04127041372111997, 0.04304194355945105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 86.41176470588235, 83, 115, 84.0, 94.99999999999999, 115.0, 115.0, 0.0774815753371588, 0.05758152229646273, 0.03889211887040978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 176.76470588235296, 82, 679, 84.0, 598.9999999999999, 679.0, 679.0, 0.07748404740200546, 4.037707597424795, 0.04445273330674567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 198.76470588235293, 82, 736, 84.0, 602.3999999999999, 736.0, 736.0, 0.0774851069066578, 12.320946553223154, 0.04437767209670142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cca3dcdd-83ce-47e6-8734-ec8c9466119a", 3, 0, 0.0, 1334.0, 187, 3445, 370.0, 3445.0, 3445.0, 3445.0, 0.027714393932395356, 0.02779558844586917, 0.017772576838157177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09caf1de-7441-4f49-b8cf-a183382ef9b8", 3, 0, 0.0, 310.0, 249, 408, 273.0, 408.0, 408.0, 408.0, 0.03568242640499554, 0.029746970710674992, 0.022882285162057685], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 202.3571428571429, 82, 370, 186.5, 346.0, 370.0, 370.0, 0.09517593952248872, 0.160025170636863, 0.06150984093721107], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/65b6486d-dd12-4ed2-bbc8-c01437c5fafb", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.6336030505952381, 1.1838882688492063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f73641a-d85c-4526-965a-51ebdef4b5fa", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 95.68749999999999, 83, 252, 85.0, 140.7000000000001, 252.0, 252.0, 0.10120241114744558, 0.07520999500313096, 0.05079886653299515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 94.68750000000001, 82, 248, 84.0, 136.0000000000001, 248.0, 248.0, 0.10120241114744558, 0.036579631275340134, 0.05718578627948311], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 472.6, 402, 572, 413.0, 572.0, 572.0, 572.0, 0.03777490688485453, 11.107076869102393, 0.021543501582768597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 707.6, 578, 756, 734.0, 756.0, 756.0, 756.0, 0.037682098742171544, 33.90641868627015, 0.021453773014341808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 148.8, 82, 250, 84.0, 250.0, 250.0, 250.0, 0.03786673937080626, 0.06700637865224701, 0.020967227757077295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 19, 0, 0.0, 94.21052631578947, 83, 250, 84.0, 102.0, 250.0, 250.0, 0.09783123596894115, 0.07270465876207444, 0.04910669461722242], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4828c874-a725-4621-903e-a7e85643b107", 3, 0, 0.0, 433.6666666666667, 186, 568, 547.0, 568.0, 568.0, 568.0, 0.040052869788120324, 0.025385070793447352, 0.02568494579511622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 19, 0, 0.0, 109.57894736842105, 82, 247, 84.0, 247.0, 247.0, 247.0, 0.0978317397057839, 0.03391124859045059, 0.05536222523440999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 19, 0, 0.0, 135.42105263157893, 81, 724, 85.0, 255.0, 724.0, 724.0, 0.09783224344781422, 4.658119150983471, 0.05707216093404047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ed380b9-faaa-4b9c-9b77-012c2c9000e9", 1, 0, 0.0, 332.0, 332, 332, 332.0, 332.0, 332.0, 332.0, 3.0120481927710845, 0.5441688629518072, 2.0766660391566263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 19, 0, 0.0, 118.26315789473685, 82, 406, 84.0, 256.0, 406.0, 406.0, 0.09783224344781422, 1.5389772186035733, 0.05716770023428248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 115.4, 83, 243, 83.0, 243.0, 243.0, 243.0, 0.03786673937080626, 0.028141199864437073, 0.021263061658411717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 509.7142857142857, 83, 820, 651.0, 788.0, 820.0, 820.0, 0.0848927319693901, 49.11386223463442, 0.04521769679954401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 116.3125, 81, 575, 84.0, 249.50000000000034, 575.0, 575.0, 0.1012004908223805, 5.71684562220908, 0.058951262476123006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 396.6428571428571, 83, 584, 564.5, 580.0, 584.0, 584.0, 0.08489736514963162, 16.0555864550802, 0.04530307222340135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 137.0625, 83, 577, 85.0, 346.0000000000002, 577.0, 577.0, 0.10120305127199584, 1.8853886315766168, 0.05905158509279054], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 373.0, 84, 803, 387.0, 697.0, 803.0, 803.0, 0.09608653278609766, 0.019711948446143497, 0.06477932054810503], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 19, 0, 0.0, 239.5263157894737, 167, 810, 172.0, 497.0, 810.0, 810.0, 0.0977889405854984, 6.300923027880142, 0.21861276576717997], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b3ac5ad-1378-4f2b-a973-967aa13fc7a2", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cda7e7bb-66e5-43bd-ba48-eb031dd039e9", 1, 0, 0.0, 591.0, 591, 591, 591.0, 591.0, 591.0, 591.0, 1.6920473773265652, 0.30569215313028764, 1.1665873519458545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 582.9545454545455, 93, 1110, 617.5, 1018.9999999999999, 1102.1999999999998, 1110.0, 0.09511868217389424, 0.058427393640019025, 0.04300776352198539], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 85.28571428571429, 83, 92, 84.5, 90.0, 92.0, 92.0, 0.08497775403796079, 0.06315241291297671, 0.04265484919483578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 118.57142857142857, 81, 254, 83.5, 250.5, 254.0, 254.0, 0.08498084895868109, 0.10479153514868614, 0.043877528180256524], "isController": false}, {"data": ["login", 22, 0, 0.0, 2396.681818181819, 1462, 3596, 2299.5, 3431.0, 3572.5999999999995, 3596.0, 0.09277141965573368, 25.352183007702138, 0.17493474374003762], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 88.43750000000003, 85, 98, 87.0, 96.6, 98.0, 98.0, 0.10341061122134396, 0.08371816084227943, 0.036759240707587106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 597.0, 169, 906, 739.0, 875.5, 906.0, 906.0, 0.08484694217680891, 65.30110319016927, 0.17686704938698086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8404fbe-f115-44b0-b166-d3f63cbcc7b8", 3, 0, 0.0, 324.6666666666667, 269, 383, 322.0, 383.0, 383.0, 383.0, 0.05706351168850931, 0.03668633970859567, 0.03659346289920682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 322.3529411764706, 167, 823, 176.0, 800.6, 823.0, 823.0, 0.07745156998888342, 16.450441174963096, 0.17069332965438377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, 54.54545454545455, 425.1818181818182, 82, 977, 144.0, 949.6000000000001, 977.0, 977.0, 0.06722237160527024, 36.56495972768828, 0.0931946515436701], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ec7b342-b6f8-411b-9ad1-075bd673565d", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 1.7076788101604279, 3.1908004679144386], "isController": false}, {"data": ["register", 24, 6, 25.0, 964.7916666666665, 144, 1848, 878.5, 1809.5, 1842.75, 1848.0, 0.09837073470642485, 0.031029050107592993, 0.04438210882262527], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 234.56249999999997, 169, 830, 172.0, 481.4000000000003, 830.0, 830.0, 0.10114675129278192, 7.709877780350347, 0.22586395524888422], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 100.46666666666667, 84, 259, 88.0, 169.00000000000006, 259.0, 259.0, 0.1168661181750187, 0.0907310194815819, 0.04154225294502618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2f3bf39-f1c1-4ee6-b481-2664b284bd1c", 3, 0, 0.0, 387.6666666666667, 258, 455, 450.0, 455.0, 455.0, 455.0, 0.027682171758648372, 0.027763271871222534, 0.017751913530122815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f73641a-d85c-4526-965a-51ebdef4b5fa", 3, 0, 0.0, 492.3333333333333, 270, 812, 395.0, 812.0, 812.0, 812.0, 0.0382955909009676, 0.0246203750095739, 0.024558044946258524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 253.43750000000003, 167, 493, 175.5, 396.4000000000001, 493.0, 493.0, 0.11904673328323451, 0.1844991852739191, 0.26773889331180567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 98.0, 81, 250, 85.0, 186.39999999999995, 250.0, 250.0, 0.05842276510453181, 0.0434176994575671, 0.029325489515360695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 120.76923076923077, 81, 247, 84.0, 245.8, 247.0, 247.0, 0.058380786434101564, 0.015621421370062333, 0.03329529226319855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 96.53846153846155, 81, 247, 83.0, 185.79999999999995, 247.0, 247.0, 0.058423815344790395, 0.015747043979650537, 0.03434681331793341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 108.07692307692305, 82, 246, 84.0, 244.4, 246.0, 246.0, 0.058423815344790395, 0.015747043979650537, 0.034403867825106065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 86.66666666666667, 84, 90, 86.0, 90.0, 90.0, 90.0, 0.02332651680675536, 0.006879500073867303, 0.01441961439323842], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 791.3859649122808, 649, 1230, 675.0, 1072.0, 1079.4, 1230.0, 0.25193370165745854, 301.4002935082873, 0.4974706491712707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 964.7916666666665, 144, 1848, 878.5, 1809.5, 1842.75, 1848.0, 0.10035878264796648, 0.03165613944852849, 0.0452790601400005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 115.0, 81, 335, 84.0, 335.0, 335.0, 335.0, 0.039397222495814045, 0.01061878262582488, 0.023199731606421747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 125.125, 82, 256, 84.0, 256.0, 256.0, 256.0, 0.039397222495814045, 0.01061878262582488, 0.023161257756328178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09caf1de-7441-4f49-b8cf-a183382ef9b8", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.5392957089552238, 2.058069029850746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4828c874-a725-4621-903e-a7e85643b107", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 182.53333333333333, 82, 740, 84.0, 638.6, 740.0, 740.0, 0.11671244388076657, 14.029671585771977, 0.06727682149220751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 172.2, 82, 586, 85.0, 574.6, 586.0, 586.0, 0.11685064151002189, 4.6083580342606085, 0.06747059502294167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 103.5, 81, 246, 83.5, 246.0, 246.0, 246.0, 0.039397416514412066, 0.010541886840770417, 0.022468839105875632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 84.6, 83, 88, 84.0, 88.0, 88.0, 88.0, 0.1168661181750187, 0.08685069915155198, 0.05866131322456993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 125.625, 83, 256, 84.5, 256.0, 256.0, 256.0, 0.03939702847912696, 0.02927845573497619, 0.019775461560811777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 106.4, 81, 254, 83.0, 249.2, 254.0, 254.0, 0.11684882099539616, 0.054666382009955515, 0.06533187986383217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 92.875, 85, 133, 85.5, 133.0, 133.0, 133.0, 0.039326533120314616, 0.030954282905247633, 0.013979353570111834], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 658.7142857142858, 84, 3445, 401.5, 2433.0, 3445.0, 3445.0, 0.10086164663842541, 0.020100566716377048, 0.06863179150096539], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1258.0909090909088, 676, 2309, 1111.0, 1879.6, 2246.2999999999993, 2309.0, 0.09469370889432183, 0.04901139229881891, 0.043555407118384355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 263.25, 166, 581, 169.5, 581.0, 581.0, 581.0, 0.03938073789657634, 0.06103245218932289, 0.08856820251544463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b3ac5ad-1378-4f2b-a973-967aa13fc7a2", 3, 0, 0.0, 385.33333333333337, 187, 677, 292.0, 677.0, 677.0, 677.0, 0.02252184619080508, 0.02662005973919702, 0.014442720376264977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02e3ce05-15e8-493b-9a4a-9a33904932a3", 3, 0, 0.0, 909.6666666666666, 178, 1421, 1130.0, 1421.0, 1421.0, 1421.0, 0.02129955696921504, 0.025175355258860613, 0.013658895582471884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf007df8-e73c-4cb9-96b2-cfc7e406c2a4", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de06cc1a-4b4d-490e-9f5e-e29f9713b711", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 1.064453125, 1.9889322916666667], "isController": false}, {"data": ["addBook", 61, 9, 14.754098360655737, 877.1311475409835, 432, 2218, 712.0, 1447.6000000000006, 1641.4, 2218.0, 0.2841782589655912, 90.29243718961678, 1.032566508194583], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8ed380b9-faaa-4b9c-9b77-012c2c9000e9", 3, 0, 0.0, 251.66666666666669, 162, 415, 178.0, 415.0, 415.0, 415.0, 0.0733066171439742, 0.034028397150816146, 0.04700977727006158], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 154.03508771929828, 83, 359, 86.0, 333.2, 336.2, 359.0, 0.25258679901624087, 0.18771343169078059, 0.12210006397757739], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 471.7543859649122, 402, 661, 413.0, 589.4, 605.4, 661.0, 0.2525700106345268, 74.26396924018522, 0.12702495652029422], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 127.03508771929823, 82, 351, 87.0, 250.2, 260.09999999999957, 351.0, 0.2529275251707261, 0.4475631597747614, 0.12300576907716952], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 634.8070175438597, 562, 839, 579.0, 743.4, 765.5999999999997, 839.0, 0.2523698413612032, 227.08282687567242, 0.1266778305270102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 99.74999999999999, 84, 246, 87.0, 158.50000000000009, 246.0, 246.0, 0.12592575102904952, 0.0940753901730692, 0.044762669311107436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 9, 5.027932960893855, 167.41340782122913, 83, 1692, 90.0, 282.0, 417.0, 1279.1999999999941, 0.7395410713843051, 1.599888591132944, 0.35582264002735065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 124.61538461538461, 84, 250, 89.0, 248.8, 250.0, 250.0, 0.05946309400200345, 0.04604905619491088, 0.021137271696024664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 91.94117647058823, 84, 151, 87.0, 110.99999999999997, 151.0, 151.0, 0.0795924864692773, 0.06459116821872016, 0.028292641674625914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/362b6e76-496c-41dd-a134-67a2f7500c88", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.8064038825757576, 1.5067668876262625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 233.30769230769232, 165, 498, 172.0, 431.5999999999999, 498.0, 498.0, 0.058357985841454824, 0.09044348001014531, 0.13124847792272504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cca3dcdd-83ce-47e6-8734-ec8c9466119a", 1, 0, 0.0, 803.0, 803, 803, 803.0, 803.0, 803.0, 803.0, 1.2453300124533002, 0.22498637920298878, 0.8585966687422166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60cdfee4-1456-40c9-b9e2-7d2d40327a62", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.8895617603550294, 3.5306490384615383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02e3ce05-15e8-493b-9a4a-9a33904932a3", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.5089128521126761, 1.9421214788732395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 279.8, 166, 824, 172.0, 723.2, 824.0, 824.0, 0.11663439781660408, 18.761364260401844, 0.2583345604243937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cda7e7bb-66e5-43bd-ba48-eb031dd039e9", 3, 0, 0.0, 800.3333333333334, 200, 1826, 375.0, 1826.0, 1826.0, 1826.0, 0.023765764623867165, 0.028090329215254454, 0.015240415465175234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 19, 0, 0.0, 112.84210526315789, 85, 373, 88.0, 250.0, 373.0, 373.0, 0.0964780436283869, 0.07999009671923873, 0.03429492957102815], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8404fbe-f115-44b0-b166-d3f63cbcc7b8", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 93.85714285714286, 85, 117, 89.0, 114.5, 117.0, 117.0, 0.08477963350975572, 0.0658201256252498, 0.03013651034917098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb8079da-0b21-410b-824b-239887e914b8", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.8337752937336814, 1.557910411227154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 94.68749999999999, 83, 245, 84.0, 135.1000000000001, 245.0, 245.0, 0.11912650490280022, 0.08853053733499117, 0.05979592140628839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 124.875, 82, 251, 84.0, 248.9, 251.0, 251.0, 0.11926680730211027, 0.03191318867263498, 0.06801935103948477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 124.49999999999999, 81, 254, 84.0, 253.3, 254.0, 254.0, 0.11927303087680587, 0.032147809103514086, 0.07011949666780971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 136.50000000000003, 83, 270, 84.5, 254.60000000000002, 270.0, 270.0, 0.1192659182730295, 0.03214589203452749, 0.07023178585804374], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 22.22222222222222, 0.4484304932735426], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.11111111111111, 0.2242152466367713], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 11.11111111111111, 0.2242152466367713], "isController": false}, {"data": ["401/Unauthorized", 15, 55.55555555555556, 1.1210762331838564], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1338, 27, "401/Unauthorized", 15, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
