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

    var data = {"OkPercent": 97.69173492181683, "KoPercent": 2.308265078183172};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8207607994842038, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4294964e-9813-4678-b949-93b407d886b9"], "isController": false}, {"data": [0.4017857142857143, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/09294d1f-dd62-4120-8f69-de9e373967ca"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4294964e-9813-4678-b949-93b407d886b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/009f8565-59fc-4b23-8834-7e78ccc876fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.425, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=568c9aec-bc16-404f-b456-91786996f2ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1458b036-0aec-498f-a3a8-196c6aebe345"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=009f8565-59fc-4b23-8834-7e78ccc876fc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.36153846153846153, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/042d9eaf-81ea-4687-aae3-f8c2e9ca6637"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d278f264-3783-41de-bc91-bd9384c880f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7678571428571429, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9193548387096774, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/568c9aec-bc16-404f-b456-91786996f2ef"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/297c260b-6211-424e-8e3e-d2ce2080b463"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.15, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=297c260b-6211-424e-8e3e-d2ce2080b463"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/18c60426-6bc1-4321-bd0f-4fe37adc171d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18c60426-6bc1-4321-bd0f-4fe37adc171d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1458b036-0aec-498f-a3a8-196c6aebe345"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/081043d4-f2a9-49bd-871d-92b08b7f2308"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f647d085-b79a-4e12-bbce-a033a90187f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e645381b-1060-4838-9482-8e1a1b9c2caa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e645381b-1060-4838-9482-8e1a1b9c2caa"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f647d085-b79a-4e12-bbce-a033a90187f1"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/68f2ad2c-4a81-45b6-88d9-09cf4b14623e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43da95ee-fec2-465d-8f8a-53f0dfd24859"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09294d1f-dd62-4120-8f69-de9e373967ca"], "isController": false}, {"data": [0.35, 500, 1500, "register"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1343, 31, 2.308265078183172, 275.44527177959793, 77, 1998, 89.0, 792.6000000000015, 967.0, 1295.8799999999987, 5.292277137205142, 710.5970465593796, 3.8853115111460954], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/4294964e-9813-4678-b949-93b407d886b9", 3, 0, 0.0, 404.6666666666667, 257, 608, 349.0, 608.0, 608.0, 608.0, 0.018733257151420917, 0.02582530730347252, 0.012013188993586981], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1329.8392857142856, 980, 1810, 1313.0, 1626.3000000000002, 1710.9499999999998, 1810.0, 0.24815215271992483, 298.61103946810135, 1.2201621962351774], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 95.88888888888889, 82, 242, 85.5, 115.1000000000002, 242.0, 242.0, 0.08768297732420781, 0.0680741864968215, 0.031168558345714494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 225.2222222222222, 163, 489, 170.0, 415.2000000000001, 489.0, 489.0, 0.09257925813154483, 0.1434797682175407, 0.2082129213642068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09294d1f-dd62-4120-8f69-de9e373967ca", 3, 0, 0.0, 515.3333333333334, 326, 822, 398.0, 822.0, 822.0, 822.0, 0.026728439059158945, 0.026806745032965075, 0.017140307599786173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 362.46666666666664, 163, 1045, 326.0, 1039.6, 1045.0, 1045.0, 0.0790155713352578, 12.710143352354136, 0.17501228856750037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 84.35714285714286, 80, 101, 82.0, 96.5, 101.0, 101.0, 0.07598949173885669, 0.05647265938795892, 0.0381431628454808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 116.85714285714285, 79, 244, 82.0, 244.0, 244.0, 244.0, 0.07599402904057538, 0.028487159044646493, 0.042884465327724254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 138.78571428571428, 79, 869, 81.0, 484.5, 869.0, 869.0, 0.0759944415494181, 4.903300677775426, 0.044209936001823866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 167.57142857142856, 80, 626, 83.0, 436.0, 626.0, 626.0, 0.0759944415494181, 1.6150833190843756, 0.04428414932364947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 85.0, 83, 88, 84.0, 88.0, 88.0, 88.0, 0.02929401425642027, 0.008639445610780198, 0.018108506859681673], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 928.1785714285714, 631, 1461, 862.5, 1289.9, 1369.8999999999999, 1461.0, 0.25204221707135943, 301.5301156693746, 0.4976849247248914], "isController": false}, {"data": ["deleteBook", 12, 3, 25.0, 431.4166666666667, 82, 1032, 422.0, 922.2000000000004, 1032.0, 1032.0, 0.084921483012165, 0.01776799583530894, 0.05670416407184358], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 3, 25.0, 431.4166666666667, 82, 1032, 422.0, 922.2000000000004, 1032.0, 1032.0, 0.08353521009105339, 0.01747794800977362, 0.05577851552710718], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 6, 30.0, 885.4499999999999, 285, 1473, 858.5, 1436.7, 1471.45, 1473.0, 0.09791969605726344, 0.03071465466171193, 0.04417861286958565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4294964e-9813-4678-b949-93b407d886b9", 1, 0, 0.0, 865.0, 865, 865, 865.0, 865.0, 865.0, 865.0, 1.1560693641618498, 0.20886018786127167, 0.7970556358381503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 98.22222222222223, 77, 236, 82.0, 236.0, 236.0, 236.0, 0.052178147791704835, 0.014063641396982945, 0.030725999139060562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 112.86666666666667, 79, 244, 82.0, 240.4, 244.0, 244.0, 0.11196620113608372, 0.029959706163366153, 0.06385572408542275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/009f8565-59fc-4b23-8834-7e78ccc876fc", 3, 0, 0.0, 404.0, 262, 628, 322.0, 628.0, 628.0, 628.0, 0.023655388303199, 0.027959868140923032, 0.01516963377516342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 115.22222222222223, 78, 242, 80.0, 242.0, 242.0, 242.0, 0.05217724028778647, 0.014063396796317447, 0.030674510403561967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 81.46666666666667, 78, 86, 81.0, 84.8, 86.0, 86.0, 0.11196536538030902, 0.08320863579532731, 0.05620136504441293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 112.99999999999999, 78, 243, 82.0, 241.8, 243.0, 243.0, 0.11196787268506424, 0.030178840684646217, 0.06593420627841184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 138.13333333333333, 79, 243, 83.0, 241.8, 243.0, 243.0, 0.11196703690433536, 0.030178615415621644, 0.06582437130508778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 85.2777777777778, 79, 155, 81.0, 90.2000000000001, 155.0, 155.0, 0.08539385543769096, 0.02301631259844014, 0.050202247044423776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 102.8888888888889, 78, 244, 80.5, 237.70000000000002, 244.0, 244.0, 0.08539304521087338, 0.023016094216993216, 0.050285162365387354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 83.61111111111111, 80, 107, 82.0, 89.00000000000003, 107.0, 107.0, 0.08539385543769096, 0.06346164451961211, 0.04286371259274721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 98.44444444444444, 78, 241, 81.0, 241.0, 241.0, 241.0, 0.052177845286891185, 0.01396165000840643, 0.02975767739018013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 112.27777777777779, 79, 243, 82.0, 240.3, 243.0, 243.0, 0.08539385543769096, 0.022849527724538396, 0.04870118317930812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 99.0, 79, 244, 80.0, 244.0, 244.0, 244.0, 0.05217663530271145, 0.038775800259143955, 0.02619022514218133], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 83.77777777777777, 81, 87, 84.0, 87.0, 87.0, 87.0, 0.04999750012499375, 0.03935350107494626, 0.017772548872556374], "isController": false}, {"data": ["deleteAccount", 11, 2, 18.181818181818183, 432.6363636363637, 80, 831, 398.0, 790.4000000000001, 831.0, 831.0, 0.07496149704924289, 0.014727431904294614, 0.05101028718771722], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1217.6499999999996, 884, 1998, 1111.5, 1819.3000000000004, 1989.85, 1998.0, 0.1001181394044973, 0.05181895887146833, 0.04605043326124827], "isController": false}, {"data": ["goToProfile", 12, 3, 25.0, 260.1666666666667, 80, 822, 167.5, 757.8000000000002, 822.0, 822.0, 0.08474217194186687, 0.18903545533028263, 0.0547638010571586], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 216.55555555555554, 161, 480, 164.0, 480.0, 480.0, 480.0, 0.05215184298818471, 0.08082517072485267, 0.11729071718924744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=568c9aec-bc16-404f-b456-91786996f2ef", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1458b036-0aec-498f-a3a8-196c6aebe345", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 92.16666666666666, 80, 244, 83.0, 103.60000000000022, 244.0, 244.0, 0.09261927304161693, 0.06883131521940476, 0.046490533538467875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=009f8565-59fc-4b23-8834-7e78ccc876fc", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 599.6666666666667, 474, 728, 633.0, 728.0, 728.0, 728.0, 0.03138091726421163, 9.227031620196758, 0.017896929377245695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 91.0, 78, 243, 82.0, 105.30000000000021, 243.0, 243.0, 0.09261831990367696, 0.024782636380476057, 0.05282138557006576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 888.5, 635, 967, 957.0, 967.0, 967.0, 967.0, 0.03133061105135087, 28.191338897345254, 0.017837642815368707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 135.83333333333331, 82, 243, 83.0, 243.0, 243.0, 243.0, 0.031473923854086885, 0.0556940918199272, 0.017427455884050067], "isController": false}, {"data": ["addBook", 65, 14, 21.53846153846154, 796.5538461538465, 420, 2379, 673.0, 1416.2, 1545.0999999999997, 2379.0, 0.3208925750394945, 77.99932350291272, 1.1711807612559242], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 82.375, 79, 86, 82.0, 86.0, 86.0, 86.0, 0.07976310358236038, 0.05927707209587525, 0.04003733910286449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 101.1875, 78, 242, 81.5, 239.2, 242.0, 242.0, 0.07976389885937624, 0.028830676821608038, 0.04507166599365877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/042d9eaf-81ea-4687-aae3-f8c2e9ca6637", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 1.1960147471910112, 2.234755383895131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 140.43749999999997, 78, 861, 82.0, 425.6000000000005, 861.0, 861.0, 0.07976389885937624, 4.505886209631989, 0.04646402897423626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d278f264-3783-41de-bc91-bd9384c880f4", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 144.92857142857144, 79, 364, 83.0, 329.6, 333.3, 364.0, 0.2527760223887334, 0.18785405570100208, 0.12219153426017876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 105.62500000000001, 79, 471, 81.5, 200.10000000000028, 471.0, 471.0, 0.07976310358236038, 1.4859675357936928, 0.04654145936568392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 109.83333333333334, 81, 243, 84.0, 243.0, 243.0, 243.0, 0.03147375875363915, 0.02339016641749941, 0.017673253206389173], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 533.232142857143, 383, 736, 485.5, 660.7000000000002, 717.3, 736.0, 0.2524569470742043, 74.23072479938689, 0.1269680934992336], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 122.83928571428571, 78, 328, 82.5, 244.60000000000002, 250.35, 328.0, 0.25309933697012976, 0.4478671861229249, 0.12308932598742639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 513.0625000000001, 78, 948, 715.0, 942.4, 948.0, 948.0, 0.07167302764787042, 36.28492957705075, 0.038671238061961336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 99.0, 78, 246, 81.5, 234.3, 246.0, 246.0, 0.09261831990367696, 0.024963531536537926, 0.05444944197462258], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 779.1071428571429, 551, 1216, 762.5, 971.3, 1086.75, 1216.0, 0.25255372403995763, 227.24828483324688, 0.12677013101224432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 86.39999999999999, 81, 98, 85.0, 94.4, 98.0, 98.0, 0.07748694345002867, 0.05788819505788275, 0.02754418692950238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 399.00000000000006, 81, 689, 546.0, 669.4, 689.0, 689.0, 0.07167334871323941, 11.86277038490828, 0.03874140479763478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 113.55555555555556, 79, 325, 82.5, 252.1000000000001, 325.0, 325.0, 0.09261784334206341, 0.02496340308829053, 0.05453960892115649], "isController": false}, {"data": ["deleteBooks", 12, 3, 25.0, 430.58333333333337, 83, 865, 418.0, 831.4000000000001, 865.0, 865.0, 0.08384923906815545, 0.017543651826515926, 0.05631573649328507], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 186, 14, 7.526881720430108, 142.9731182795698, 80, 1266, 88.0, 256.0000000000001, 347.05000000000007, 1123.3199999999993, 0.8111750262759653, 1.6380186981840146, 0.3933345385569807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 85.85714285714285, 82, 94, 85.0, 93.0, 94.0, 94.0, 0.07736174351266523, 0.0599100220757261, 0.027499682264267716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/568c9aec-bc16-404f-b456-91786996f2ef", 3, 0, 0.0, 252.0, 171, 398, 187.0, 398.0, 398.0, 398.0, 0.03982900082313268, 0.03320379918881602, 0.025541383991396934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 223.99999999999997, 161, 942, 166.5, 507.3000000000004, 942.0, 942.0, 0.07972971626187225, 6.077371343956488, 0.17803902582744496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 96.8, 81, 245, 84.0, 161.00000000000006, 245.0, 245.0, 0.10666211574972802, 0.08655880682424216, 0.03791504895791113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 362.8, 88, 907, 293.0, 889.5000000000001, 906.35, 907.0, 0.09796478166099287, 0.060175632485121595, 0.044294622958046585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 81.9375, 80, 84, 82.0, 83.3, 84.0, 84.0, 0.07167334871323941, 0.05326505700271014, 0.03597666136582525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/297c260b-6211-424e-8e3e-d2ce2080b463", 3, 0, 0.0, 318.66666666666663, 160, 593, 203.0, 593.0, 593.0, 593.0, 0.026145613637552072, 0.03090323018162486, 0.01676655562043541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 132.18749999999997, 77, 245, 83.0, 245.0, 245.0, 245.0, 0.07167270658537787, 0.07973063661041853, 0.03748993502421194], "isController": false}, {"data": ["login", 20, 0, 0.0, 2114.7499999999995, 1322, 3344, 2114.5, 3219.6, 3338.0, 3344.0, 0.09794079478954971, 35.284118211478656, 0.1964937195465341], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=297c260b-6211-424e-8e3e-d2ce2080b463", 1, 0, 0.0, 690.0, 690, 690, 690.0, 690.0, 690.0, 690.0, 1.4492753623188406, 0.26183197463768115, 0.9992074275362319], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 270.71428571428567, 161, 951, 174.0, 649.0, 951.0, 951.0, 0.07595568528304343, 6.599980019246628, 0.16943797540120878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18c60426-6bc1-4321-bd0f-4fe37adc171d", 3, 0, 0.0, 254.66666666666666, 184, 347, 233.0, 347.0, 347.0, 347.0, 0.042082818987767924, 0.035082714657445856, 0.026986703582650658], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 105.44444444444444, 82, 246, 87.0, 245.1, 246.0, 246.0, 0.09561803781162184, 0.07740952475179151, 0.033989224378349954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 205.83333333333331, 161, 326, 165.5, 326.0, 326.0, 326.0, 0.08535983914412534, 0.13229107882981145, 0.19197627885636784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18c60426-6bc1-4321-bd0f-4fe37adc171d", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1458b036-0aec-498f-a3a8-196c6aebe345", 3, 0, 0.0, 242.66666666666669, 161, 394, 173.0, 394.0, 394.0, 394.0, 0.02270972430394695, 0.026842125308473755, 0.014563202108976396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/081043d4-f2a9-49bd-871d-92b08b7f2308", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 1.9237104668674698, 3.5944559487951806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f647d085-b79a-4e12-bbce-a033a90187f1", 3, 0, 0.0, 682.3333333333334, 288, 928, 831.0, 928.0, 928.0, 928.0, 0.019749445369742533, 0.027226204798456912, 0.01266484615182057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 106.75, 82, 246, 86.0, 240.4, 246.0, 246.0, 0.07805487257542053, 0.06471541681301955, 0.02774606798579401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 606.1874999999999, 162, 1030, 797.5, 1023.7, 1030.0, 1030.0, 0.07164638924587698, 48.26269837793694, 0.15082299591615583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e645381b-1060-4838-9482-8e1a1b9c2caa", 3, 0, 0.0, 517.3333333333334, 164, 891, 497.0, 891.0, 891.0, 891.0, 0.022312297794801234, 0.026372380629206795, 0.01430834201033803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 96.25000000000001, 81, 249, 85.0, 148.2000000000001, 249.0, 249.0, 0.07339584212554359, 0.056982123525202294, 0.02608992825556432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e645381b-1060-4838-9482-8e1a1b9c2caa", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f647d085-b79a-4e12-bbce-a033a90187f1", 1, 0, 0.0, 753.0, 753, 753, 753.0, 753.0, 753.0, 753.0, 1.3280212483399734, 0.23992571381142097, 0.9156083997343958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, 45.45454545454545, 596.2727272727273, 80, 1197, 720.0, 1167.8000000000002, 1197.0, 1197.0, 0.048367806388068105, 31.568452881512066, 0.07398161721058463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 258.8, 159, 327, 319.0, 326.4, 327.0, 327.0, 0.11189771057284169, 0.17341959636630835, 0.2516605736809125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68f2ad2c-4a81-45b6-88d9-09cf4b14623e", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.8247767857142858, 3.4095982142857144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 93.8, 80, 245, 82.0, 156.20000000000005, 245.0, 245.0, 0.07904971700201313, 0.0587469088266914, 0.039679252479526125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 148.6, 79, 301, 82.0, 268.0, 301.0, 301.0, 0.07905221662415414, 0.036983673740961696, 0.04419924715939035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43da95ee-fec2-465d-8f8a-53f0dfd24859", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.8188100961538461, 1.5299479166666665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 246.66666666666669, 79, 956, 82.0, 862.4000000000001, 956.0, 956.0, 0.07905096679332389, 9.50249232876243, 0.04556752994714125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09294d1f-dd62-4120-8f69-de9e373967ca", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["register", 20, 6, 30.0, 885.4499999999999, 285, 1473, 858.5, 1436.7, 1471.45, 1473.0, 0.0971001053536143, 0.030457572108965738, 0.043808836595087705], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 187.13333333333335, 79, 643, 82.0, 538.6, 643.0, 643.0, 0.07905138339920949, 3.1176301054018447, 0.04564496870882741], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 19.35483870967742, 0.4467609828741623], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.67741935483871, 0.22338049143708116], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.451612903225806, 0.14892032762472077], "isController": false}, {"data": ["401/Unauthorized", 20, 64.51612903225806, 1.4892032762472078], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1343, 31, "401/Unauthorized", 20, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 186, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
