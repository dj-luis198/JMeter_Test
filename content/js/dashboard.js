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

    var data = {"OkPercent": 97.15355805243446, "KoPercent": 2.846441947565543};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.793213828425096, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.39655172413793105, 500, 1500, "see books"], "isController": true}, {"data": [0.5625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a816a920-2ebe-4f9b-bf30-957d1e3dda78"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/99a94416-9145-4b63-9c02-453a0f562875"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/526b07df-4d2a-4885-ae76-b996241c934b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8afeb865-1b42-4e08-8471-41e9cce317ec"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e8c48675-e845-459e-b879-260637a66755"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/52d72e4e-9a2b-4cc0-b34a-75fce6482a2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a1f93fd-130f-4756-8fc6-069d6ab2e105"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b96f1f29-feb0-4b4d-8d90-6010b4eaa3f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/77b51b21-d053-4810-8204-019dbf5cf635"], "isController": false}, {"data": [0.6739130434782609, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7a1f93fd-130f-4756-8fc6-069d6ab2e105"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8afeb865-1b42-4e08-8471-41e9cce317ec"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7b37ae1a-4c54-4004-9259-f32e4ca0e27d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6451034c-8646-4dc9-8074-0426554a96ed"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69297789-d363-42d2-bf1c-3a0cd14c523b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ca02dce4-8825-48a4-8bc2-ddc1511d4d41"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a816a920-2ebe-4f9b-bf30-957d1e3dda78"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/69297789-d363-42d2-bf1c-3a0cd14c523b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8e74b408-ad4e-432f-b8bd-a7bee435b264"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8c48675-e845-459e-b879-260637a66755"], "isController": false}, {"data": [0.33035714285714285, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99a94416-9145-4b63-9c02-453a0f562875"], "isController": false}, {"data": [0.8448275862068966, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=526b07df-4d2a-4885-ae76-b996241c934b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52d72e4e-9a2b-4cc0-b34a-75fce6482a2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d84ca3e-43e9-4d6d-995a-313a9d475110"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77b51b21-d053-4810-8204-019dbf5cf635"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6451034c-8646-4dc9-8074-0426554a96ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b37ae1a-4c54-4004-9259-f32e4ca0e27d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca02dce4-8825-48a4-8bc2-ddc1511d4d41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1335, 38, 2.846441947565543, 305.0419475655433, 77, 1998, 93.0, 855.4000000000001, 1016.2, 1520.2400000000016, 5.166688597679441, 753.399071392945, 3.776515864346365], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1324.2413793103456, 947, 1810, 1290.0, 1595.5, 1747.95, 1810.0, 0.24360228986152468, 293.1336917848278, 1.1977905561062274], "isController": true}, {"data": ["deleteBook", 16, 4, 25.0, 428.1875, 83, 711, 446.5, 698.4, 711.0, 711.0, 0.07614080338065167, 0.01593082726982873, 0.050841088194844314], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 428.1875, 83, 711, 446.5, 698.4, 711.0, 711.0, 0.07529695235585339, 0.015754269572501554, 0.0502776280989402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 91.0, 78, 238, 79.0, 161.0, 238.0, 238.0, 0.1039130692951725, 0.038952904184727744, 0.05863955989103972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 80.64285714285715, 79, 87, 80.0, 84.5, 87.0, 87.0, 0.10391229802047072, 0.07722388554060372, 0.05215910271730659], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a816a920-2ebe-4f9b-bf30-957d1e3dda78", 1, 0, 0.0, 718.0, 718, 718, 718.0, 718.0, 718.0, 718.0, 1.392757660167131, 0.2516212569637883, 0.9602411211699164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 129.14285714285717, 77, 625, 80.0, 428.5, 625.0, 625.0, 0.1039130692951725, 2.208428161740692, 0.060553137618015555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 156.57142857142856, 79, 691, 80.0, 463.0, 691.0, 691.0, 0.1039130692951725, 6.704661718889169, 0.06045166001128199], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 281.625, 77, 1194, 197.0, 764.9000000000004, 1194.0, 1194.0, 0.07575793445991695, 0.11671179343888938, 0.048957825321142616], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/99a94416-9145-4b63-9c02-453a0f562875", 3, 0, 0.0, 665.0, 282, 1194, 519.0, 1194.0, 1194.0, 1194.0, 0.11976047904191617, 0.05418849800399202, 0.07679952594810378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/526b07df-4d2a-4885-ae76-b996241c934b", 3, 0, 0.0, 327.3333333333333, 202, 410, 370.0, 410.0, 410.0, 410.0, 0.06586313640255549, 0.029801354036312542, 0.04223645140398252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 89.10526315789475, 79, 236, 81.0, 83.0, 236.0, 236.0, 0.0868515843557441, 0.06454497626437622, 0.043595424178566856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 110.94736842105263, 77, 241, 80.0, 237.0, 241.0, 241.0, 0.08685198136796442, 0.04383668056298368, 0.0483810533545435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 576.7499999999999, 390, 636, 622.0, 636.0, 636.0, 636.0, 0.036924213052709313, 10.856944636758055, 0.02105834025662328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8afeb865-1b42-4e08-8471-41e9cce317ec", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 950.6249999999999, 856, 1223, 929.0, 1223.0, 1223.0, 1223.0, 0.036831734222205856, 33.14125919642364, 0.0209696299331504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 94.875, 79, 188, 81.0, 188.0, 188.0, 188.0, 0.03697660767357051, 0.06543126279737281, 0.02047435210050242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 7, 0, 0.0, 82.42857142857143, 78, 97, 80.0, 97.0, 97.0, 97.0, 0.03874553042631154, 0.02879428579533504, 0.019448440077269657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 7, 0, 0.0, 100.71428571428571, 78, 234, 79.0, 234.0, 234.0, 234.0, 0.03874595934995351, 0.010367571154186779, 0.02209730494177036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 7, 0, 0.0, 101.42857142857143, 77, 234, 80.0, 234.0, 234.0, 234.0, 0.03874617381533573, 0.010443304661164709, 0.022778512340656358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 7, 0, 0.0, 146.85714285714286, 79, 236, 82.0, 236.0, 236.0, 236.0, 0.038745744886945446, 0.010443189051559517, 0.022816097819168074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8c48675-e845-459e-b879-260637a66755", 3, 0, 0.0, 300.3333333333333, 177, 386, 338.0, 386.0, 386.0, 386.0, 0.021821038390480208, 0.030067856610319896, 0.01399330912410352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52d72e4e-9a2b-4cc0-b34a-75fce6482a2e", 3, 0, 0.0, 473.0, 375, 532, 512.0, 532.0, 532.0, 532.0, 0.023287586164068806, 0.027525138464106064, 0.014933771075265476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 101.5, 79, 238, 80.5, 238.0, 238.0, 238.0, 0.03697694949410911, 0.027479940004899447, 0.020763423788196032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 457.49999999999994, 77, 998, 234.5, 940.3000000000001, 995.15, 998.0, 0.08844743789884266, 35.82643368459865, 0.048576991283505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 213.63157894736844, 79, 934, 80.0, 915.0, 934.0, 934.0, 0.08685237838381436, 12.359174689559888, 0.04988119223174043], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a1f93fd-130f-4756-8fc6-069d6ab2e105", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 337.5, 78, 710, 234.5, 652.4000000000001, 707.25, 710.0, 0.08844743789884266, 11.716029204791198, 0.048663365734578086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 209.0, 79, 690, 80.0, 656.0, 690.0, 690.0, 0.0868515843557441, 4.051910320596624, 0.0499655522046589], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 324.0, 81, 718, 377.0, 581.5000000000001, 718.0, 718.0, 0.07539097287338557, 0.015773941345823106, 0.050634903900069264], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 7, 0, 0.0, 230.14285714285714, 160, 332, 164.0, 332.0, 332.0, 332.0, 0.038728166995856086, 0.06002109474846055, 0.08710055526509429], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b96f1f29-feb0-4b4d-8d90-6010b4eaa3f6", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 1.2928580465587045, 2.4157072368421053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77b51b21-d053-4810-8204-019dbf5cf635", 3, 0, 0.0, 291.3333333333333, 182, 399, 293.0, 399.0, 399.0, 399.0, 0.07012950582074898, 0.031731775094674834, 0.04497237189676937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 671.5652173913044, 135, 1489, 604.0, 1198.6, 1430.999999999999, 1489.0, 0.09688085760620038, 0.05950982366630863, 0.043804528390303486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 96.35000000000002, 79, 239, 81.0, 220.70000000000033, 238.85, 239.0, 0.08844665561083472, 0.06573037589828634, 0.04439607517965727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 103.25000000000001, 78, 238, 80.0, 237.8, 238.0, 238.0, 0.08844743789884266, 0.08344635718171084, 0.047099988170155184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a1f93fd-130f-4756-8fc6-069d6ab2e105", 3, 0, 0.0, 373.0, 176, 698, 245.0, 698.0, 698.0, 698.0, 0.029976318708220505, 0.024697286019044955, 0.019223095004946095], "isController": false}, {"data": ["login", 23, 0, 0.0, 2597.1304347826085, 1430, 3600, 2587.0, 3478.2000000000003, 3580.2, 3600.0, 0.09875398236168002, 41.225938444603315, 0.20595689791199734], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 96.05263157894736, 81, 293, 83.0, 99.0, 293.0, 293.0, 0.08600009052641108, 0.0696231201624949, 0.030570344679310187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8afeb865-1b42-4e08-8471-41e9cce317ec", 3, 0, 0.0, 256.0, 174, 387, 207.0, 387.0, 387.0, 387.0, 0.030049280820545695, 0.024757399009375375, 0.01926988385952963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 555.0999999999999, 159, 1081, 473.5, 1020.5, 1078.0, 1081.0, 0.08841498457158518, 47.674141082961995, 0.18866756131579182], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b37ae1a-4c54-4004-9259-f32e4ca0e27d", 3, 0, 0.0, 282.6666666666667, 175, 433, 240.0, 433.0, 433.0, 433.0, 0.02857768844604056, 0.02866141214265982, 0.018326186926660125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6451034c-8646-4dc9-8074-0426554a96ed", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, 50.0, 565.6249999999999, 77, 1304, 511.0, 1204.6000000000001, 1304.0, 1304.0, 0.07363600800791588, 44.056984490415815, 0.10741580757990657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 249.35714285714286, 161, 771, 164.0, 543.5, 771.0, 771.0, 0.1038506331179669, 9.023842007488373, 0.23166456801845575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69297789-d363-42d2-bf1c-3a0cd14c523b", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.3481003131021195, 1.3284260597302504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca02dce4-8825-48a4-8bc2-ddc1511d4d41", 3, 0, 0.0, 502.3333333333333, 235, 691, 581.0, 691.0, 691.0, 691.0, 0.03950019091758943, 0.02539481675203097, 0.02533052607670937], "isController": false}, {"data": ["register", 26, 9, 34.61538461538461, 1018.9999999999999, 256, 1998, 987.0, 1667.3000000000002, 1953.5499999999997, 1998.0, 0.1042936910339516, 0.03254477107534818, 0.04705438013445864], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a816a920-2ebe-4f9b-bf30-957d1e3dda78", 3, 0, 0.0, 430.33333333333337, 190, 911, 190.0, 911.0, 911.0, 911.0, 0.024664967524459427, 0.024737228171503742, 0.015817052741922223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 341.7368421052631, 160, 1017, 164.0, 996.0, 1017.0, 1017.0, 0.08681943841531678, 16.513239250382693, 0.1917515464712468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 90.11111111111111, 81, 118, 87.5, 107.20000000000002, 118.0, 118.0, 0.08189225708709241, 0.06357846131273288, 0.029110138261427384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 251.28571428571428, 159, 476, 165.0, 458.20000000000005, 475.7, 476.0, 0.1076613895496678, 0.16685412618683865, 0.2421329884110204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69297789-d363-42d2-bf1c-3a0cd14c523b", 3, 0, 0.0, 753.6666666666666, 204, 1110, 947.0, 1110.0, 1110.0, 1110.0, 0.04169794012175799, 0.026807757728018237, 0.026739889986934648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 101.55555555555554, 79, 242, 80.0, 242.0, 242.0, 242.0, 0.05930064769485205, 0.044070110249787506, 0.02976614542495503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 131.22222222222223, 78, 236, 80.0, 236.0, 236.0, 236.0, 0.0593002569677802, 0.01586745157145681, 0.03381967780193714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 114.44444444444444, 78, 242, 79.0, 242.0, 242.0, 242.0, 0.0593010384270729, 0.015983483013546993, 0.0348625245440409], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 85.0, 81, 90, 84.5, 90.0, 90.0, 90.0, 0.02823164061121502, 0.00832612838338568, 0.017451785651268658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 114.77777777777777, 78, 240, 80.0, 240.0, 240.0, 240.0, 0.05930064769485205, 0.015983377699003088, 0.03492020562499588], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 895.448275862069, 623, 1459, 854.0, 1252.3, 1405.5, 1459.0, 0.24582625170065148, 294.09366006679693, 0.485410821229216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, 34.61538461538461, 1018.9999999999999, 256, 1998, 987.0, 1667.3000000000002, 1953.5499999999997, 1998.0, 0.1023400444785578, 0.03193513707661727, 0.04617294975497432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 79.16666666666667, 77, 81, 79.5, 81.0, 81.0, 81.0, 0.03570259736395823, 0.009622965695754366, 0.021024088096158994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 106.5, 79, 238, 80.5, 238.0, 238.0, 238.0, 0.03570238491931261, 0.009622908435283477, 0.020989097384205263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e74b408-ad4e-432f-b8bd-a7bee435b264", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 1.7545930631868132, 3.2784598214285716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 197.0, 78, 927, 81.5, 810.9000000000002, 927.0, 927.0, 0.07993676114007585, 8.011066869876275, 0.04623078742150654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 186.44444444444449, 79, 608, 111.5, 477.5000000000002, 608.0, 608.0, 0.08010253123998719, 2.6361694357666705, 0.04640488436309587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 107.72222222222223, 80, 238, 82.0, 235.3, 238.0, 238.0, 0.08023750300890636, 0.059629628700954826, 0.04027546537751745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 106.16666666666667, 78, 237, 80.5, 237.0, 237.0, 237.0, 0.03570238491931261, 0.009553177214737944, 0.02036151639929547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 123.94444444444446, 78, 238, 80.5, 237.1, 238.0, 238.0, 0.08018245964149531, 0.03483621618972952, 0.044980828596628775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 81.0, 79, 84, 80.5, 84.0, 84.0, 84.0, 0.03570174760054504, 0.026532255785170683, 0.01792060377605484], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 453.625, 79, 1110, 421.5, 970.7000000000002, 1110.0, 1110.0, 0.07588728840489663, 0.015359023947182448, 0.05163522284776536], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 107.5, 81, 237, 82.0, 237.0, 237.0, 237.0, 0.0343762712058623, 0.027057885343676775, 0.012219690155208865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1369.0434782608695, 940, 1977, 1289.0, 1895.6000000000001, 1966.3999999999999, 1977.0, 0.09766786132862262, 0.05055074853922851, 0.04492340106033326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 188.5, 160, 318, 163.0, 318.0, 318.0, 318.0, 0.03568454859046033, 0.05530408067681694, 0.08025538613655288], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8c48675-e845-459e-b879-260637a66755", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["addBook", 56, 13, 23.214285714285715, 918.8749999999999, 408, 2841, 771.0, 1505.7, 1749.1999999999991, 2841.0, 0.24949432845928343, 80.96448162123419, 0.9050478118567724], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 131.10344827586204, 78, 334, 81.0, 321.1, 325.15, 334.0, 0.24639854539893202, 0.18311454399276098, 0.11910867184811655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99a94416-9145-4b63-9c02-453a0f562875", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 0.9409586588541666, 3.590901692708333], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 495.6206896551722, 385, 722, 467.0, 635.1, 708.25, 722.0, 0.24636296060316448, 72.43889043750663, 0.12390324678772432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=526b07df-4d2a-4885-ae76-b996241c934b", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 0.8325532834101382, 3.1772033410138247], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 111.05172413793106, 79, 325, 82.0, 236.1, 240.34999999999997, 325.0, 0.2466919880396919, 0.43652918196086105, 0.11997325199586578], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 762.2758620689656, 541, 1098, 769.5, 934.3, 1078.7, 1098.0, 0.24620295613342505, 221.53385270748967, 0.1235823432154106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 92.76190476190474, 80, 237, 85.0, 102.0, 223.69999999999982, 237.0, 0.11023969258874294, 0.08235680159217613, 0.03918676572490472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 13, 7.647058823529412, 163.59411764705894, 80, 1892, 85.0, 333.8000000000001, 442.89999999999975, 1712.369999999998, 0.7006322175421822, 1.605859668003363, 0.33269968404578015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 118.88888888888889, 82, 242, 84.0, 242.0, 242.0, 242.0, 0.05791431255710995, 0.04484965806424628, 0.020586728291785178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52d72e4e-9a2b-4cc0-b34a-75fce6482a2e", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d84ca3e-43e9-4d6d-995a-313a9d475110", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 1.5887360074626864, 2.96855565920398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 96.07142857142858, 80, 246, 83.0, 174.5, 246.0, 246.0, 0.09575202960105601, 0.07770501620945072, 0.03403685427225037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 269.1111111111111, 160, 478, 312.0, 478.0, 478.0, 478.0, 0.059269015475798485, 0.09185539800790254, 0.13329740492262102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 340.99999999999994, 161, 1034, 268.5, 1009.7, 1034.0, 1034.0, 0.079907307523273, 10.731960647870693, 0.17744173702949023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 7, 0, 0.0, 88.42857142857143, 82, 101, 83.0, 101.0, 101.0, 101.0, 0.039546458614631054, 0.032788030628732194, 0.014057530210669635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 88.85000000000001, 80, 115, 85.0, 106.50000000000001, 114.6, 115.0, 0.08543686002452038, 0.06633037472606806, 0.03037013383684123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77b51b21-d053-4810-8204-019dbf5cf635", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6451034c-8646-4dc9-8074-0426554a96ed", 3, 0, 0.0, 306.3333333333333, 202, 466, 251.0, 466.0, 466.0, 466.0, 0.025465812147192395, 0.02554041901871737, 0.016330615211578456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b37ae1a-4c54-4004-9259-f32e4ca0e27d", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca02dce4-8825-48a4-8bc2-ddc1511d4d41", 1, 0, 0.0, 368.0, 368, 368, 368.0, 368.0, 368.0, 368.0, 2.717391304347826, 0.49093495244565216, 1.8735139266304348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 95.52380952380952, 78, 241, 80.0, 204.4000000000001, 240.29999999999998, 241.0, 0.10770611616873958, 0.08004331484805745, 0.05406342159251186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 106.00000000000001, 78, 320, 80.0, 237.6, 311.7999999999999, 320.0, 0.10770777342387625, 0.028820244060685635, 0.06142708953080442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 128.14285714285717, 77, 314, 80.0, 236.6, 306.2999999999999, 314.0, 0.10770887828896754, 0.02903090860132328, 0.06332103977535006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 124.38095238095237, 78, 240, 81.0, 238.4, 239.9, 240.0, 0.10770832585358847, 0.02903075970272502, 0.06342589891573619], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 23.68421052631579, 0.6741573033707865], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.526315789473685, 0.299625468164794], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.526315789473685, 0.299625468164794], "isController": false}, {"data": ["401/Unauthorized", 21, 55.26315789473684, 1.5730337078651686], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1335, 38, "401/Unauthorized", 21, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
