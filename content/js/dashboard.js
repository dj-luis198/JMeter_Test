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

    var data = {"OkPercent": 98.14264487369985, "KoPercent": 1.8573551263001487};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7662835249042146, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0f32d87-8899-49b2-b450-0804018c9b93"], "isController": false}, {"data": [0.0603448275862069, 500, 1500, "see books"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0719cbc7-58b4-4d48-905f-6d55080cec87"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81ad2c8f-4cad-45a5-9d29-e69b4518f65d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7e2ac2e-1682-4a52-8130-3b832b3eb0d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db0c887b-6ab5-499c-bc8f-61a64981d7cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/96ed9e50-fa81-4c5a-9dd9-3f602ee76718"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d7e2ac2e-1682-4a52-8130-3b832b3eb0d1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/acc323bd-62fa-4c96-b6a5-4c4b7ec78a66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02d85826-58d2-4229-aa91-265cb7050a5d"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1632b255-c95f-4f0a-8132-5e778f3c0f07"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c002ee2-06f1-4a84-abdc-603368320117"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93772142-2a50-4795-9813-5a217d6e7575"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=213f2522-c2d0-4681-8898-108f1e9b85ea"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b29e856b-b75f-4372-81bd-dbd94f625cc8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d972f380-c2c8-4f77-9648-41c9cd794bf7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83388873-d3c2-4285-b682-dbf3d0e91f79"], "isController": false}, {"data": [0.17391304347826086, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db0c887b-6ab5-499c-bc8f-61a64981d7cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/213f2522-c2d0-4681-8898-108f1e9b85ea"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4051724137931034, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.17391304347826086, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0f32d87-8899-49b2-b450-0804018c9b93"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2cfe41d1-f81c-4c68-b24a-74aacec25e6f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0719cbc7-58b4-4d48-905f-6d55080cec87"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96ed9e50-fa81-4c5a-9dd9-3f602ee76718"], "isController": false}, {"data": [0.9827586206896551, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81ad2c8f-4cad-45a5-9d29-e69b4518f65d"], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9129213483146067, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acc323bd-62fa-4c96-b6a5-4c4b7ec78a66"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02d85826-58d2-4229-aa91-265cb7050a5d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c002ee2-06f1-4a84-abdc-603368320117"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b29e856b-b75f-4372-81bd-dbd94f625cc8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/83388873-d3c2-4285-b682-dbf3d0e91f79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/93772142-2a50-4795-9813-5a217d6e7575"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1346, 25, 1.8573551263001487, 392.48514115898956, 99, 2967, 129.0, 1063.4999999999998, 1326.2999999999997, 1818.1899999999994, 5.223330358182312, 736.9138199605146, 3.821084533499554], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0f32d87-8899-49b2-b450-0804018c9b93", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1800.9999999999998, 1314, 2528, 1767.0, 2226.5, 2324.9999999999995, 2528.0, 0.261329536545584, 314.466866449061, 1.2849552895576322], "isController": true}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 574.5333333333334, 115, 1015, 591.0, 908.8000000000001, 1015.0, 1015.0, 0.07989134776703684, 0.01565059019733163, 0.05379142699262337], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 574.5333333333334, 115, 1015, 591.0, 908.8000000000001, 1015.0, 1015.0, 0.07882871046740171, 0.015442421210703888, 0.05307594555038206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 155.8571428571429, 101, 337, 110.0, 331.5, 337.0, 337.0, 0.11091041607250372, 0.02967720117565041, 0.06325359666634978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 109.78571428571428, 103, 117, 109.5, 116.5, 117.0, 117.0, 0.11091480950381467, 0.08242790042226852, 0.055674035239219474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 205.49999999999997, 108, 334, 118.0, 333.0, 334.0, 334.0, 0.11091217340326083, 0.029894296737597643, 0.0653125396114905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 125.21428571428571, 101, 342, 108.5, 231.5, 342.0, 342.0, 0.11091041607250372, 0.02989382308204202, 0.06520319382387427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0719cbc7-58b4-4d48-905f-6d55080cec87", 3, 0, 0.0, 599.3333333333334, 341, 783, 674.0, 783.0, 783.0, 783.0, 0.017483332556296333, 0.024102185343722316, 0.011211642296843675], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 302.6, 107, 667, 272.0, 484.0000000000001, 667.0, 667.0, 0.08027013576355628, 0.1491111838373406, 0.05188293670967362], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 119.13636363636364, 103, 319, 109.5, 120.5, 289.4499999999996, 319.0, 0.11173922097446759, 0.08304057339997054, 0.05608785115319955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 119.36363636363637, 103, 325, 111.0, 115.0, 293.49999999999955, 325.0, 0.11173751841129566, 0.02989851566864747, 0.06372530346894205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 806.5, 633, 1019, 836.5, 1019.0, 1019.0, 1019.0, 0.043678294799371034, 12.842868926897095, 0.024910277502766292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1020.9999999999999, 846, 1230, 989.0, 1230.0, 1230.0, 1230.0, 0.043603066749028016, 39.234116106791184, 0.024824792885432944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 262.1666666666667, 106, 342, 337.0, 342.0, 342.0, 342.0, 0.04377708707262619, 0.07746492360898306, 0.024239851924002978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81ad2c8f-4cad-45a5-9d29-e69b4518f65d", 3, 0, 0.0, 318.6666666666667, 217, 467, 272.0, 467.0, 467.0, 467.0, 0.02908949869097256, 0.024250718146998935, 0.018654398574614563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 129.3571428571428, 102, 346, 113.0, 232.0, 346.0, 346.0, 0.06558759457496896, 0.04874234323393689, 0.032921898058138714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 159.2142857142857, 105, 343, 113.5, 334.5, 343.0, 343.0, 0.06558728730979686, 0.02458608272899333, 0.03701179927010719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 237.21428571428575, 99, 1179, 115.5, 759.0, 1179.0, 1179.0, 0.06558759457496896, 4.231831833700311, 0.03815572954486894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 181.85714285714286, 103, 853, 113.5, 589.5, 853.0, 853.0, 0.06552251868561827, 1.3925272006205918, 0.03818185833563442], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7e2ac2e-1682-4a52-8130-3b832b3eb0d1", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 0.7590926995798319, 2.8968618697478994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db0c887b-6ab5-499c-bc8f-61a64981d7cb", 3, 0, 0.0, 341.6666666666667, 230, 485, 310.0, 485.0, 485.0, 485.0, 0.06067102149776528, 0.026859566808906506, 0.03890687250996016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 184.66666666666666, 106, 343, 110.0, 343.0, 343.0, 343.0, 0.04385067383868799, 0.03258824491332184, 0.024623181110591398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 823.1875000000001, 108, 1492, 1105.5, 1398.2, 1492.0, 1492.0, 0.07868014064075139, 44.25578306717317, 0.042029332939932634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 118.45454545454545, 102, 330, 108.5, 114.0, 297.59999999999957, 330.0, 0.11173978850705484, 0.030117364871042128, 0.06569077410278029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 599.6250000000001, 104, 998, 829.5, 979.1, 998.0, 998.0, 0.07868362298742046, 14.467701448516321, 0.042108032614361725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 178.13636363636363, 102, 348, 112.0, 329.8, 345.45, 348.0, 0.11173695090176798, 0.030116600047742154, 0.06579822401734971], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 614.2857142857142, 111, 1379, 503.0, 1258.0, 1379.0, 1379.0, 0.07692349957966801, 0.014525105563766834, 0.05264344687333447], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/96ed9e50-fa81-4c5a-9dd9-3f602ee76718", 3, 0, 0.0, 341.0, 250, 435, 338.0, 435.0, 435.0, 435.0, 0.021531151988401886, 0.02544909273108309, 0.01380741191964574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 384.5, 215, 1291, 238.0, 986.5, 1291.0, 1291.0, 0.06548757840968093, 5.690379955129314, 0.14608626935976537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7e2ac2e-1682-4a52-8130-3b832b3eb0d1", 3, 0, 0.0, 724.3333333333334, 329, 1352, 492.0, 1352.0, 1352.0, 1352.0, 0.08001066808907854, 0.03620274369915989, 0.051308924523269774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acc323bd-62fa-4c96-b6a5-4c4b7ec78a66", 3, 0, 0.0, 422.0, 221, 724, 321.0, 724.0, 724.0, 724.0, 0.026320407088962976, 0.02639751765660642, 0.01687864647306545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02d85826-58d2-4229-aa91-265cb7050a5d", 3, 0, 0.0, 396.3333333333333, 247, 498, 444.0, 498.0, 498.0, 498.0, 0.05023947483002311, 0.032626221447231804, 0.03221737155440935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 720.090909090909, 122, 2472, 635.5, 1421.1999999999998, 2326.349999999998, 2472.0, 0.1002931294647538, 0.06160583831379897, 0.045347381779473644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 125.37500000000001, 106, 308, 113.5, 181.30000000000013, 308.0, 308.0, 0.07868284910596612, 0.058474265790664275, 0.03949510199264315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 167.6875, 102, 346, 115.0, 343.2, 346.0, 346.0, 0.07868014064075139, 0.0949117614516486, 0.04074232868628753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1632b255-c95f-4f0a-8132-5e778f3c0f07", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.6823417467948718, 1.274956597222222], "isController": false}, {"data": ["login", 22, 0, 0.0, 3121.2272727272734, 2073, 4943, 3039.5, 4565.5, 4905.049999999999, 4943.0, 0.09583133684714902, 31.398247606939062, 0.18792776985233262], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 138.3636363636364, 108, 353, 115.0, 277.0999999999999, 349.4, 353.0, 0.11942567109084494, 0.09668347786553755, 0.04245209402057379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c002ee2-06f1-4a84-abdc-603368320117", 3, 0, 0.0, 415.0, 362, 484, 399.0, 484.0, 484.0, 484.0, 0.03137287710198276, 0.02615427677675061, 0.020118674443654314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93772142-2a50-4795-9813-5a217d6e7575", 1, 0, 0.0, 932.0, 932, 932, 932.0, 932.0, 932.0, 932.0, 1.0729613733905579, 0.1938455606223176, 0.7397565718884119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 951.3125000000001, 227, 1601, 1223.5, 1508.6000000000001, 1601.0, 1601.0, 0.07863876301225782, 58.845265408897, 0.16428513063864505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=213f2522-c2d0-4681-8898-108f1e9b85ea", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b29e856b-b75f-4372-81bd-dbd94f625cc8", 1, 0, 0.0, 1137.0, 1137, 1137, 1137.0, 1137.0, 1137.0, 1137.0, 0.8795074758135445, 0.15889539357959542, 0.6063791776605101], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d972f380-c2c8-4f77-9648-41c9cd794bf7", 1, 0, 0.0, 729.0, 729, 729, 729.0, 729.0, 729.0, 729.0, 1.371742112482853, 0.4380465534979424, 0.8184906550068587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 333.1428571428571, 216, 452, 334.0, 447.5, 452.0, 452.0, 0.11081735716434213, 0.17174525958965917, 0.249230833544414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 865.3333333333334, 107, 1340, 996.0, 1340.0, 1340.0, 1340.0, 0.05856515373352855, 46.71474652269399, 0.10086220920774361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83388873-d3c2-4285-b682-dbf3d0e91f79", 1, 0, 0.0, 985.0, 985, 985, 985.0, 985.0, 985.0, 985.0, 1.0152284263959392, 0.1834152918781726, 0.6999524111675127], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1315.1304347826087, 196, 2292, 1310.0, 2001.6000000000004, 2261.1999999999994, 2292.0, 0.09491973092319755, 0.029759141182782386, 0.04282511297511452], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db0c887b-6ab5-499c-bc8f-61a64981d7cb", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 0.8685772235576924, 3.3146784855769234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 116.75, 111, 125, 116.5, 125.0, 125.0, 125.0, 0.0893260904761639, 0.0693498456333499, 0.03175263372394888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 309.5454545454545, 211, 645, 223.5, 455.4, 617.5499999999996, 645.0, 0.11167569378524764, 0.1730755137081914, 0.25116125272209505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/213f2522-c2d0-4681-8898-108f1e9b85ea", 3, 0, 0.0, 930.0, 232, 1362, 1196.0, 1362.0, 1362.0, 1362.0, 0.020255489237583385, 0.023941302546114998, 0.01298935996029924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 420.15, 215, 1342, 332.0, 1007.7000000000007, 1327.1499999999999, 1342.0, 0.1181914346667297, 14.30466086075867, 0.2627912680168068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 131.8181818181818, 103, 331, 114.0, 288.20000000000016, 331.0, 331.0, 0.052302747320672895, 0.03886952217874226, 0.02625352746369714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 148.72727272727272, 104, 333, 113.0, 329.0, 333.0, 333.0, 0.05230224994769775, 0.013994937974286312, 0.029828626923296374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 149.81818181818178, 104, 328, 111.0, 326.8, 328.0, 328.0, 0.05230224994769775, 0.014097090806215408, 0.030748002410658247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 168.0, 106, 329, 112.0, 327.0, 329.0, 329.0, 0.052304736907173355, 0.014097761119511568, 0.03080054331545462], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 111.0, 111, 111, 111.0, 111.0, 111.0, 111.0, 9.00900900900901, 2.656953828828829, 5.569045608108108], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1218.4137931034484, 839, 2052, 1128.5, 1759.2, 1863.5499999999997, 2052.0, 0.2632618138738976, 314.9526540081611, 0.5198392457549033], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1315.1304347826087, 196, 2292, 1310.0, 2001.6000000000004, 2261.1999999999994, 2292.0, 0.09281116962250066, 0.029098067106510906, 0.041873789419526665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 149.6, 100, 327, 105.0, 327.0, 327.0, 327.0, 0.048277460219372785, 0.01301228419975282, 0.028429012219025183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 155.6, 107, 334, 113.0, 334.0, 334.0, 334.0, 0.0483802299028525, 0.013039983841003213, 0.028442283595231644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 231.99999999999997, 106, 975, 112.0, 970.8, 975.0, 975.0, 0.08939046874127046, 10.075294447315493, 0.05159156936141684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 273.18749999999994, 105, 921, 112.0, 920.3, 921.0, 921.0, 0.08939246644988993, 3.3066264610081237, 0.05168001966634262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 114.31250000000001, 108, 146, 113.0, 125.00000000000003, 146.0, 146.0, 0.08939096816005453, 0.06643215504863427, 0.04487007581471487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 195.2, 110, 320, 115.0, 320.0, 320.0, 320.0, 0.04828072343836, 0.012918865451279921, 0.027535100085939686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 123.0, 105, 312, 110.0, 174.10000000000014, 312.0, 312.0, 0.08939296589099646, 0.04070260776042685, 0.050043474313489954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 201.6, 111, 321, 142.0, 321.0, 321.0, 321.0, 0.048363383115375684, 0.0359419282722665, 0.02427615129033506], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 595.6153846153846, 109, 1362, 485.0, 1184.3999999999999, 1362.0, 1362.0, 0.0791958574474566, 0.01483732485531526, 0.05389982485531526], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 160.8, 113, 338, 115.0, 338.0, 338.0, 338.0, 0.048260684915640326, 0.03798643754102158, 0.01715516534110652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0f32d87-8899-49b2-b450-0804018c9b93", 3, 0, 0.0, 303.3333333333333, 215, 454, 241.0, 454.0, 454.0, 454.0, 0.033326297781579445, 0.027782763222208642, 0.02137135632477588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1712.9999999999998, 1099, 2967, 1518.0, 2400.1, 2882.9999999999986, 2967.0, 0.09766665482828425, 0.05055012408104557, 0.04492284611730653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 403.0, 228, 653, 256.0, 653.0, 653.0, 653.0, 0.04821089373354803, 0.07471746909681712, 0.10842742994957141], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2cfe41d1-f81c-4c68-b24a-74aacec25e6f", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 1.2928580465587045, 2.4157072368421053], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0719cbc7-58b4-4d48-905f-6d55080cec87", 1, 0, 0.0, 692.0, 692, 692, 692.0, 692.0, 692.0, 692.0, 1.445086705202312, 0.2610752348265896, 0.9963195447976879], "isController": false}, {"data": ["addBook", 60, 12, 20.0, 1125.4833333333331, 557, 2864, 941.0, 1892.3999999999999, 2083.2999999999993, 2864.0, 0.28031488705646007, 84.93369987181434, 1.0190522874862764], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96ed9e50-fa81-4c5a-9dd9-3f602ee76718", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 202.75862068965523, 107, 563, 115.0, 450.6, 477.94999999999976, 563.0, 0.26464200324870873, 0.1966724262424486, 0.12792753086729572], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 667.0172413793106, 508, 991, 640.5, 889.0, 975.5, 991.0, 0.26439710621925816, 77.74152803862933, 0.1329731540067558], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 169.03448275862073, 101, 347, 116.0, 331.3, 337.4, 347.0, 0.26484018264840187, 0.4686429794520548, 0.1287992294520548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81ad2c8f-4cad-45a5-9d29-e69b4518f65d", 1, 0, 0.0, 1379.0, 1379, 1379, 1379.0, 1379.0, 1379.0, 1379.0, 0.7251631617113851, 0.13101092277012327, 0.4999660079767948], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1013.8103448275862, 725, 1604, 980.0, 1309.2, 1427.1499999999999, 1604.0, 0.26386184557712955, 237.4233524699516, 0.1324462779557076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 120.05, 113, 129, 119.5, 126.7, 128.9, 129.0, 0.12501875281292193, 0.09339779873230984, 0.044440259788968345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 12, 6.741573033707865, 188.005617977528, 105, 1287, 119.0, 326.4, 477.2999999999999, 1202.470000000001, 0.7650681899260291, 1.6634289614844042, 0.36658398127732006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 154.9090909090909, 105, 334, 119.0, 332.8, 334.0, 334.0, 0.05483358008444371, 0.04246389551461315, 0.0194916241706421], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 121.00000000000001, 111, 146, 117.0, 143.0, 146.0, 146.0, 0.11333004136546511, 0.09196998474091943, 0.04028528814163017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 323.18181818181824, 217, 665, 232.0, 620.8000000000002, 665.0, 665.0, 0.0522736669026902, 0.08101397399860286, 0.11756470202821827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acc323bd-62fa-4c96-b6a5-4c4b7ec78a66", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 409.6875, 220, 1087, 245.5, 1081.4, 1087.0, 1087.0, 0.08933357155619082, 13.480394508916605, 0.19805619221234588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02d85826-58d2-4229-aa91-265cb7050a5d", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.3231915250447227, 1.2333687388193202], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c002ee2-06f1-4a84-abdc-603368320117", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 131.07142857142858, 109, 310, 117.0, 218.5, 310.0, 310.0, 0.06614037822847721, 0.05483709093357144, 0.02351083757340401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b29e856b-b75f-4372-81bd-dbd94f625cc8", 3, 0, 0.0, 599.3333333333334, 213, 918, 667.0, 918.0, 918.0, 918.0, 0.03358823068396834, 0.028001125905482722, 0.021539327619602092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83388873-d3c2-4285-b682-dbf3d0e91f79", 3, 0, 0.0, 466.0, 339, 695, 364.0, 695.0, 695.0, 695.0, 0.02594370216629913, 0.02601970910623946, 0.016637074631383232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 118.625, 104, 165, 114.0, 140.50000000000003, 165.0, 165.0, 0.07938949478510256, 0.06163539878335599, 0.028220484474391926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93772142-2a50-4795-9813-5a217d6e7575", 2, 0, 0.0, 309.0, 267, 351, 309.0, 351.0, 351.0, 351.0, 0.03826725853359866, 0.03378281417419256, 0.023786240289683146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 121.70000000000002, 102, 324, 111.0, 120.60000000000001, 313.84999999999985, 324.0, 0.11842237709237538, 0.08800725485087663, 0.05944248225144623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 131.45, 100, 346, 109.0, 307.70000000000044, 345.15, 346.0, 0.1184202735508319, 0.04947284475102138, 0.06654201699330926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 261.15, 105, 1231, 110.0, 878.0000000000013, 1216.35, 1231.0, 0.11842658439966604, 10.684772580248815, 0.06860415025965029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 272.24999999999994, 101, 866, 215.5, 799.0000000000011, 865.15, 866.0, 0.1182704134733655, 3.506232665992525, 0.06862917938073611], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 28.0, 0.5200594353640416], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.1485884101040119], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.0, 0.07429420505200594], "isController": false}, {"data": ["401/Unauthorized", 15, 60.0, 1.1144130757800892], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1346, 25, "401/Unauthorized", 15, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
