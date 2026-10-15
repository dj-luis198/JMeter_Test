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

    var data = {"OkPercent": 97.22846441947566, "KoPercent": 2.7715355805243447};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7654440154440154, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6318c374-f9d7-4bba-b2ae-e0c2c99715d3"], "isController": false}, {"data": [0.14545454545454545, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01336bdf-6dc3-4423-8661-76c591dd63f8"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2f7f58cd-8e25-4313-8afe-6aa88fc39b0a"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/896f787a-6fd7-43a9-9c88-4cbbaa64d59c"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bfba5883-eb06-475e-9cb4-d45c9108af2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5fe0d6d7-b786-42d9-a883-4406ce87351f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eaf86e37-a90c-4d1e-8b38-dbd82cd61e7f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=855a4cc5-b6c2-430f-af75-7679d1ed285d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2f7d7491-49b1-4302-a836-75d1b9b2d418"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/779116a4-7987-4783-bcf2-e95255a2a93a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d70f6cc1-6d0d-4171-8268-7a4fb81cdab6"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d9a809f-6c49-4ab2-8b0f-f08d7c677981"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=467874be-b03a-49c1-9685-392bfaa40aa3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f7f58cd-8e25-4313-8afe-6aa88fc39b0a"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=896f787a-6fd7-43a9-9c88-4cbbaa64d59c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.43636363636363634, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/01336bdf-6dc3-4423-8661-76c591dd63f8"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eaf86e37-a90c-4d1e-8b38-dbd82cd61e7f"], "isController": false}, {"data": [0.20634920634920634, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6318c374-f9d7-4bba-b2ae-e0c2c99715d3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/bfba5883-eb06-475e-9cb4-d45c9108af2e"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5fe0d6d7-b786-42d9-a883-4406ce87351f"], "isController": false}, {"data": [0.856353591160221, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d9a809f-6c49-4ab2-8b0f-f08d7c677981"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f7d7491-49b1-4302-a836-75d1b9b2d418"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/855a4cc5-b6c2-430f-af75-7679d1ed285d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/01a5b28a-756f-4c57-91e2-44c045025695"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d70f6cc1-6d0d-4171-8268-7a4fb81cdab6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/467874be-b03a-49c1-9685-392bfaa40aa3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1335, 37, 2.7715355805243447, 371.88464419475656, 95, 4810, 113.0, 1020.2000000000003, 1288.2, 1986.400000000006, 5.255305496616528, 719.2472326916907, 3.8490891726436747], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6318c374-f9d7-4bba-b2ae-e0c2c99715d3", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 0.8562277843601896, 3.267550355450237], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1698.709090909091, 1282, 3840, 1621.0, 2050.4, 2083.2, 3840.0, 0.24876071932554183, 299.34300491924324, 1.2231545134805695], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01336bdf-6dc3-4423-8661-76c591dd63f8", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f7f58cd-8e25-4313-8afe-6aa88fc39b0a", 3, 0, 0.0, 866.3333333333334, 221, 2151, 227.0, 2151.0, 2151.0, 2151.0, 0.0799744081893794, 0.03618633703881424, 0.05128567191831947], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 528.0, 101, 818, 545.0, 803.6, 818.0, 818.0, 0.08114775383017399, 0.01589671818196572, 0.054637374356227814], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 528.0, 101, 818, 545.0, 803.6, 818.0, 818.0, 0.08177105195732641, 0.016018821311171563, 0.05505704553012173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 155.38888888888889, 95, 306, 102.0, 303.3, 306.0, 306.0, 0.10152914168391723, 0.044110534212500496, 0.056955909560096794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 113.11111111111111, 96, 307, 102.5, 128.8000000000003, 307.0, 307.0, 0.10152570574466285, 0.07545025592938323, 0.05096114526636397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 220.11111111111111, 96, 793, 102.5, 763.3000000000001, 793.0, 793.0, 0.1015331505736623, 3.341449815830146, 0.05882004024661274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 204.16666666666666, 98, 985, 102.0, 875.2000000000002, 985.0, 985.0, 0.10152799634499213, 10.174887702280431, 0.0587179058722665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/896f787a-6fd7-43a9-9c88-4cbbaa64d59c", 3, 0, 0.0, 563.3333333333334, 197, 1017, 476.0, 1017.0, 1017.0, 1017.0, 0.0535886534957665, 0.034452340707727486, 0.03436511959201172], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 319.7647058823529, 102, 1929, 234.0, 636.9999999999989, 1929.0, 1929.0, 0.08995660916499101, 0.14422615819134302, 0.058140039620594774], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bfba5883-eb06-475e-9cb4-d45c9108af2e", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 116.21428571428572, 99, 294, 102.0, 205.0, 294.0, 294.0, 0.09856517270026331, 0.07325009416494177, 0.049475096453061855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 129.14285714285717, 97, 304, 100.5, 301.5, 304.0, 304.0, 0.09856586664038244, 0.02637406978463358, 0.056213345818343106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 600.8571428571428, 501, 798, 584.0, 798.0, 798.0, 798.0, 0.06767077202683629, 19.897453856992325, 0.03859348717155508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1064.857142857143, 860, 1354, 1043.0, 1354.0, 1354.0, 1354.0, 0.06737895851381269, 60.627705310304165, 0.03836126251323515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 211.28571428571428, 100, 299, 291.0, 299.0, 299.0, 299.0, 0.06787023211619383, 0.12009849667435862, 0.037580489853400297], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5fe0d6d7-b786-42d9-a883-4406ce87351f", 3, 0, 0.0, 371.6666666666667, 234, 564, 317.0, 564.0, 564.0, 564.0, 0.02311479578077928, 0.02745634433726028, 0.014822964742231501], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eaf86e37-a90c-4d1e-8b38-dbd82cd61e7f", 1, 0, 0.0, 1022.0, 1022, 1022, 1022.0, 1022.0, 1022.0, 1022.0, 0.9784735812133072, 0.17677501223091976, 0.674611668297456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 101.6, 96, 105, 102.0, 104.4, 105.0, 105.0, 0.07414583992407466, 0.05510252361545002, 0.037217736055639036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 142.33333333333331, 95, 305, 103.0, 303.8, 305.0, 305.0, 0.07414437392490658, 0.019839412554125392, 0.042285463254048285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 127.60000000000001, 97, 304, 100.0, 297.4, 304.0, 304.0, 0.07414474041926379, 0.019984324566129696, 0.04358899778554375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 142.8, 97, 306, 103.0, 305.4, 306.0, 306.0, 0.07414474041926379, 0.019984324566129696, 0.04366140475860944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 128.42857142857142, 96, 291, 102.0, 291.0, 291.0, 291.0, 0.06799483239273815, 0.05053131586999388, 0.038180692017406676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 797.3125, 96, 1481, 1055.0, 1455.1000000000001, 1481.0, 1481.0, 0.08076647383671037, 45.42929786486255, 0.043143809754570876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 143.07142857142856, 97, 305, 101.0, 304.5, 305.0, 305.0, 0.0985644787699153, 0.02656620716845374, 0.057945133026844745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 543.0625, 98, 912, 685.5, 907.8, 912.0, 912.0, 0.08068298143787159, 14.835327137972941, 0.04317800178511097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 185.71428571428572, 97, 305, 102.0, 304.5, 305.0, 305.0, 0.09856656059027288, 0.02656676828409699, 0.058042613316342334], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 450.3076923076923, 103, 1022, 451.0, 924.8, 1022.0, 1022.0, 0.07441242802028597, 0.014097667027280741, 0.05089582009650719], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 273.4, 202, 409, 211.0, 409.0, 409.0, 409.0, 0.07410847504520617, 0.11485366200853729, 0.16667169729405254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 641.095238095238, 110, 1748, 441.0, 1475.2000000000003, 1728.4999999999998, 1748.0, 0.11166411434405309, 0.06859055461172793, 0.05048875482548494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 102.50000000000001, 97, 118, 101.5, 109.60000000000001, 118.0, 118.0, 0.08076280469029988, 0.06002001403253732, 0.040539142198060686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 125.62500000000001, 97, 305, 101.0, 298.0, 305.0, 305.0, 0.08076484306381432, 0.09742653554157875, 0.0418218340181519], "isController": false}, {"data": ["login", 21, 0, 0.0, 3489.4285714285716, 2092, 6768, 3333.0, 5262.6, 6624.299999999997, 6768.0, 0.11209625331618082, 44.8527687857974, 0.23108905346724387], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=855a4cc5-b6c2-430f-af75-7679d1ed285d", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.33832221441947563, 1.2911107209737827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 106.64285714285715, 98, 128, 105.0, 119.0, 128.0, 128.0, 0.09592260416167069, 0.07765609262697755, 0.034097488198093884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f7d7491-49b1-4302-a836-75d1b9b2d418", 3, 0, 0.0, 490.66666666666663, 212, 827, 433.0, 827.0, 827.0, 827.0, 0.037701230316816006, 0.02423825842308321, 0.024176895743531098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/779116a4-7987-4783-bcf2-e95255a2a93a", 2, 0, 0.0, 405.5, 234, 577, 405.5, 577.0, 577.0, 577.0, 0.016350021255027634, 0.02765452813838658, 0.01016287942268075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d70f6cc1-6d0d-4171-8268-7a4fb81cdab6", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 914.25, 198, 1582, 1157.5, 1560.3, 1582.0, 1582.0, 0.0806394710050702, 60.34239212265768, 0.16846483237069965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d9a809f-6c49-4ab2-8b0f-f08d7c677981", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 0.8562277843601896, 3.267550355450237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=467874be-b03a-49c1-9685-392bfaa40aa3", 1, 0, 0.0, 779.0, 779, 779, 779.0, 779.0, 779.0, 779.0, 1.2836970474967906, 0.23191792362002567, 0.8850489409499358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 374.0, 201, 1081, 216.5, 978.4000000000002, 1081.0, 1081.0, 0.10146504247439417, 13.627274860344642, 0.22531272723941803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 798.0909090909092, 102, 1457, 1135.0, 1406.0000000000002, 1457.0, 1457.0, 0.07073227192057409, 53.85621997897323, 0.11831831210293475], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1328.7727272727273, 305, 3095, 1349.0, 2251.0, 2973.3499999999985, 3095.0, 0.08878951637964783, 0.027794019420688765, 0.040059332585348925], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 108.64999999999999, 102, 126, 106.0, 121.60000000000001, 125.8, 126.0, 0.09446572547315521, 0.07334008960074061, 0.03357961335178564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 331.57142857142856, 202, 599, 387.5, 503.5, 599.0, 599.0, 0.09849444209933868, 0.15264714805825244, 0.22151630874489942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f7f58cd-8e25-4313-8afe-6aa88fc39b0a", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 0.6429326067615658, 2.453569839857651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 278.93333333333334, 200, 716, 207.0, 528.8000000000001, 716.0, 716.0, 0.09139653911771875, 0.14164678474591763, 0.20555295858213501], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=896f787a-6fd7-43a9-9c88-4cbbaa64d59c", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 103.45454545454545, 100, 115, 102.0, 113.0, 115.0, 115.0, 0.048906495227170665, 0.03634554967566101, 0.024548768112075903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 119.9090909090909, 96, 303, 102.0, 264.0000000000001, 303.0, 303.0, 0.048909104652145104, 0.013087006518249764, 0.027893473746926505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 119.72727272727272, 99, 301, 102.0, 262.40000000000015, 301.0, 301.0, 0.048909539583379645, 0.013182649340832795, 0.0287534597941353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 146.8181818181818, 97, 401, 101.0, 381.6000000000001, 401.0, 401.0, 0.04890932211679546, 0.013182590726792526, 0.02880109495744889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 2.8633191747572817, 6.001592839805825], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1177.7818181818186, 771, 3398, 1103.0, 1612.4, 1666.3999999999999, 3398.0, 0.24215633613060591, 289.70316517593756, 0.47816417153914564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01336bdf-6dc3-4423-8661-76c591dd63f8", 3, 0, 0.0, 360.6666666666667, 222, 505, 355.0, 505.0, 505.0, 505.0, 0.0227826760531292, 0.022849422174378603, 0.01460998431792465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1328.7727272727273, 305, 3095, 1349.0, 2251.0, 2973.3499999999985, 3095.0, 0.0920648471305061, 0.028819304952251823, 0.04153706970145881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 147.0, 99, 307, 102.0, 307.0, 307.0, 307.0, 0.04291436200648484, 0.011566761634560366, 0.025270859658115583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 166.44444444444446, 96, 303, 103.0, 303.0, 303.0, 303.0, 0.042873067139223134, 0.011555631377368737, 0.025204674236144853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 232.20000000000002, 97, 1117, 102.0, 844.3000000000013, 1106.35, 1117.0, 0.093905531035778, 8.472415617076722, 0.054399180674241716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 218.54999999999998, 97, 800, 103.0, 741.7000000000011, 799.55, 800.0, 0.09382227246926148, 2.781445560799178, 0.054442572559799965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 121.24999999999997, 98, 299, 103.0, 279.50000000000045, 299.0, 299.0, 0.09390420831709573, 0.06978623293877916, 0.04713551081541719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 146.77777777777777, 99, 307, 103.0, 307.0, 307.0, 307.0, 0.042873067139223134, 0.011471894918112442, 0.024451046102838197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 161.55, 96, 308, 102.0, 305.7, 307.9, 308.0, 0.09381655111594787, 0.03919406305410401, 0.052716839367301184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 103.0, 98, 107, 103.0, 107.0, 107.0, 107.0, 0.042913134279965286, 0.03189149920610702, 0.0215403818553732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 129.88888888888889, 103, 321, 106.0, 321.0, 321.0, 321.0, 0.04410424282816007, 0.0347148630073213, 0.015677680067822525], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 717.2307692307693, 108, 2151, 507.0, 1706.5999999999995, 2151.0, 2151.0, 0.07284708835791456, 0.013647884492535976, 0.049578922815708075], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 2027.4761904761904, 1034, 4810, 1814.0, 4298.600000000001, 4798.3, 4810.0, 0.1129548449560283, 0.05846295686200683, 0.051954816381141924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 296.77777777777777, 203, 411, 212.0, 411.0, 411.0, 411.0, 0.04285081726030919, 0.06641039745323309, 0.0963724923344649], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eaf86e37-a90c-4d1e-8b38-dbd82cd61e7f", 3, 0, 0.0, 417.33333333333337, 235, 771, 246.0, 771.0, 771.0, 771.0, 0.048684701643920095, 0.031299572183184306, 0.031220332759935736], "isController": false}, {"data": ["addBook", 63, 23, 36.507936507936506, 1003.2698412698415, 524, 2394, 828.0, 1799.8000000000002, 2082.2, 2394.0, 0.2895260504510632, 78.11624402708907, 1.052915840406807], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6318c374-f9d7-4bba-b2ae-e0c2c99715d3", 3, 0, 0.0, 381.0, 251, 507, 385.0, 507.0, 507.0, 507.0, 0.07372275329909321, 0.033357626004472514, 0.04727663541641069], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bfba5883-eb06-475e-9cb4-d45c9108af2e", 3, 0, 0.0, 1145.6666666666667, 505, 1929, 1003.0, 1929.0, 1929.0, 1929.0, 0.09855453350854139, 0.04459335988830486, 0.06320066113666228], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 208.87272727272725, 98, 2187, 104.0, 411.0, 416.2, 2187.0, 0.24299081936504288, 0.18058204446952894, 0.11746138240790648], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 647.0181818181817, 481, 911, 598.0, 816.4, 907.6, 911.0, 0.24485362205285277, 71.99509478895844, 0.12314415562228435], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 147.19999999999996, 97, 420, 104.0, 306.8, 312.4, 420.0, 0.24493867626232488, 0.43342664197981706, 0.11912056716663846], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 967.3454545454546, 669, 1307, 999.0, 1197.0, 1274.6, 1307.0, 0.2445466105839773, 220.04347007055168, 0.12275093539078548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 118.6, 103, 309, 105.0, 190.20000000000007, 309.0, 309.0, 0.09974200069154454, 0.0745142876260074, 0.03545516430832247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5fe0d6d7-b786-42d9-a883-4406ce87351f", 1, 0, 0.0, 674.0, 674, 674, 674.0, 674.0, 674.0, 674.0, 1.483679525222552, 0.26804757047477745, 1.0229274851632046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 23, 12.707182320441989, 165.06629834254133, 98, 1119, 109.0, 309.8, 446.80000000000007, 738.5200000000032, 0.7557158842293368, 1.5828183453162314, 0.36405604797125773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 127.0909090909091, 104, 308, 109.0, 269.40000000000015, 308.0, 308.0, 0.05061799976071491, 0.03919929083031926, 0.017993117102441628], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 140.2222222222222, 100, 311, 106.5, 306.5, 311.0, 311.0, 0.10086802539632728, 0.08185676670346483, 0.03585543090260072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 288.90909090909093, 204, 502, 212.0, 483.00000000000006, 502.0, 502.0, 0.048883891868831186, 0.07576048476155771, 0.10994101852921702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d9a809f-6c49-4ab2-8b0f-f08d7c677981", 3, 0, 0.0, 529.3333333333334, 314, 780, 494.0, 780.0, 780.0, 780.0, 0.07821462091980394, 0.03539007912712483, 0.05015716250391073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 395.24999999999994, 201, 1216, 304.0, 966.5000000000009, 1205.5499999999997, 1216.0, 0.09377080539744756, 11.349042116571177, 0.2084935251258873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f7d7491-49b1-4302-a836-75d1b9b2d418", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 107.93333333333334, 102, 130, 103.0, 124.0, 130.0, 130.0, 0.07848472164085392, 0.06507180534480954, 0.027898865895772288], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/855a4cc5-b6c2-430f-af75-7679d1ed285d", 3, 0, 0.0, 1142.3333333333333, 243, 2695, 489.0, 2695.0, 2695.0, 2695.0, 0.020196172152171427, 0.02784205373191601, 0.012951321334563056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 111.50000000000001, 103, 132, 108.0, 127.80000000000001, 132.0, 132.0, 0.08237147475829121, 0.06395051018832179, 0.029280485167986328], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01a5b28a-756f-4c57-91e2-44c045025695", 2, 0, 0.0, 221.5, 206, 237, 221.5, 237.0, 237.0, 237.0, 0.04009221208780195, 0.03543305853462965, 0.024920598626841737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d70f6cc1-6d0d-4171-8268-7a4fb81cdab6", 3, 0, 0.0, 521.3333333333333, 210, 1040, 314.0, 1040.0, 1040.0, 1040.0, 0.02736452280832976, 0.02744469230874479, 0.017548212868622928], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/467874be-b03a-49c1-9685-392bfaa40aa3", 3, 0, 0.0, 532.0, 295, 887, 414.0, 887.0, 887.0, 887.0, 0.028483266081177308, 0.028566713149774506, 0.01826563612627581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 116.2, 97, 302, 103.0, 185.60000000000008, 302.0, 302.0, 0.09162767400095294, 0.06809439444797381, 0.045992797301259575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 126.46666666666664, 95, 299, 102.0, 297.2, 299.0, 299.0, 0.09162879343204809, 0.024517860742559742, 0.05225704625421492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 126.46666666666667, 95, 301, 102.0, 293.2, 301.0, 301.0, 0.09151642719868217, 0.024666537018394802, 0.05380164958360026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 159.26666666666665, 96, 413, 101.0, 344.6, 413.0, 413.0, 0.09145393465311523, 0.024649693324472463, 0.053854221284988756], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 18.91891891891892, 0.5243445692883895], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.108108108108109, 0.2247191011235955], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 2.7027027027027026, 0.0749063670411985], "isController": false}, {"data": ["401/Unauthorized", 26, 70.27027027027027, 1.9475655430711611], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1335, 37, "401/Unauthorized", 26, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 23, "401/Unauthorized", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
