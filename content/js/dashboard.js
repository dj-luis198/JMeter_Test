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

    var data = {"OkPercent": 99.19282511210763, "KoPercent": 0.8071748878923767};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7475019215987702, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c811f2c-f469-4e1b-83a2-88bc391f4673"], "isController": false}, {"data": [0.010416666666666666, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6efe5494-0d82-4ff2-9b45-d5aad58a3de1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=424894b7-8b73-4470-87df-1e6ab5184101"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=668d9ff5-d2d9-4067-bf25-eab410f8ffec"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31451bb0-db85-4348-a8b5-da18c7efd090"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=575d82ee-5c2e-4bf4-b381-990313311a1c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/284eabaa-db59-4c07-9255-fa542eaffc24"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/56f9d980-78ae-43e5-b04d-c11d2b9f5442"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43a0c8de-1fbc-4536-aa14-bf555f27f7c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c230162-7cbc-44a9-ba5b-2e33965b8fa8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a1a3073-43ed-4561-8a89-8e5a020d9d24"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83ea5036-1bf4-47f0-b479-ef0933c49648"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e30962a2-50ab-4dfb-b4fc-f727c95cdb4d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d0af9c45-781d-4631-b192-e26a1b482c55"], "isController": false}, {"data": [0.8809523809523809, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d38a6ef-fac0-43b5-98da-5457330e6150"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0af9c45-781d-4631-b192-e26a1b482c55"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3229166666666667, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c811f2c-f469-4e1b-83a2-88bc391f4673"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/668d9ff5-d2d9-4067-bf25-eab410f8ffec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/575d82ee-5c2e-4bf4-b381-990313311a1c"], "isController": false}, {"data": [0.30612244897959184, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/424894b7-8b73-4470-87df-1e6ab5184101"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9895833333333334, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9657534246575342, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb101eab-9506-4a89-9251-d9eaf189c78e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3c230162-7cbc-44a9-ba5b-2e33965b8fa8"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/31451bb0-db85-4348-a8b5-da18c7efd090"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=284eabaa-db59-4c07-9255-fa542eaffc24"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d38a6ef-fac0-43b5-98da-5457330e6150"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/47f0e2ed-5b92-4b30-af72-1b0b2c9dcdc6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e30962a2-50ab-4dfb-b4fc-f727c95cdb4d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/83ea5036-1bf4-47f0-b479-ef0933c49648"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1115, 9, 0.8071748878923767, 626.9327354260098, 115, 40471, 222.0, 1250.0, 1610.8000000000002, 8884.319999999847, 4.3511006528602145, 647.0537382576379, 3.1613160811216865], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c811f2c-f469-4e1b-83a2-88bc391f4673", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 0.7687832446808511, 2.9338430851063833], "isController": false}, {"data": ["see books", 48, 0, 0.0, 3160.9166666666656, 1467, 27723, 2103.0, 4126.400000000001, 13461.249999999987, 27723.0, 0.22137770726487843, 266.3935975289866, 1.088512457108069], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6efe5494-0d82-4ff2-9b45-d5aad58a3de1", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.6464290232793523, 1.2078536184210527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=424894b7-8b73-4470-87df-1e6ab5184101", 1, 0, 0.0, 1166.0, 1166, 1166, 1166.0, 1166.0, 1166.0, 1166.0, 0.8576329331046312, 0.1549434498284734, 0.591297705831904], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 855.25, 126, 3546, 620.0, 2777.1000000000026, 3546.0, 3546.0, 0.07401924500370095, 0.014077390590303478, 0.05001479421107821], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 855.25, 126, 3546, 620.0, 2777.1000000000026, 3546.0, 3546.0, 0.07324486980724393, 0.01393011562007886, 0.04949154899166229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 217.14285714285714, 118, 381, 126.0, 379.2, 380.9, 381.0, 0.11457128516247299, 0.04704540773738079, 0.06442503628090697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 137.38095238095238, 119, 372, 125.0, 133.4, 348.19999999999965, 372.0, 0.11471272655763495, 0.08525037588902364, 0.057580411572875356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 226.66666666666666, 119, 992, 125.0, 642.2000000000003, 963.8999999999996, 992.0, 0.114717113061909, 3.2404170240195787, 0.06661423878367084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 240.61904761904762, 118, 1314, 123.0, 1005.6000000000006, 1299.1, 1314.0, 0.11456440974779464, 9.845581410969816, 0.06641368731008221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=668d9ff5-d2d9-4067-bf25-eab410f8ffec", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 279.1666666666667, 125, 540, 260.5, 484.20000000000016, 540.0, 540.0, 0.07582459244281561, 0.14237474132756225, 0.049013243633893595], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 168.9375, 120, 379, 125.0, 366.40000000000003, 379.0, 379.0, 0.12712234731414315, 0.09447276006451459, 0.06380945949166951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 200.4375, 119, 374, 125.5, 374.0, 374.0, 374.0, 0.12712436735764057, 0.0578825549614257, 0.07116605819117916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 829.25, 716, 1126, 737.5, 1126.0, 1126.0, 1126.0, 0.04782515124704082, 14.062182411104999, 0.027275281570577965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1456.25, 1350, 1618, 1428.5, 1618.0, 1618.0, 1618.0, 0.04761337935960005, 42.842602443161525, 0.02710800797524104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31451bb0-db85-4348-a8b5-da18c7efd090", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 253.25, 122, 384, 253.5, 384.0, 384.0, 384.0, 0.048328440078775355, 0.08551868498314547, 0.026759985863931277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 124.54545454545455, 120, 129, 125.0, 128.6, 129.0, 129.0, 0.05613848854774833, 0.041720107211754384, 0.02817888975931899], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=575d82ee-5c2e-4bf4-b381-990313311a1c", 1, 0, 0.0, 7311.0, 7311, 7311, 7311.0, 7311.0, 7311.0, 7311.0, 0.1367801942278758, 0.024711265558747093, 0.09430353234851593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 190.0, 124, 365, 128.0, 363.8, 365.0, 365.0, 0.056073241848989666, 0.015003972916624187, 0.031979270742001915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 168.90909090909093, 118, 372, 125.0, 370.6, 372.0, 372.0, 0.0560695262125035, 0.015112489486963835, 0.03296274880852257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 123.72727272727272, 119, 129, 123.0, 129.0, 129.0, 129.0, 0.05613820204649264, 0.01513099977034372, 0.033057945150424865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 277.5, 128, 466, 258.0, 466.0, 466.0, 466.0, 0.048400367842795604, 0.03596941399254634, 0.027177940927351048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 11, 0, 0.0, 1375.7272727272727, 115, 1858, 1435.0, 1809.6000000000001, 1858.0, 1858.0, 0.12452454265531607, 101.86432608874073, 0.06347833131452635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 282.25, 119, 1466, 125.0, 1013.8000000000004, 1466.0, 1466.0, 0.12687336452303546, 14.30003134664182, 0.07322476409483784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 11, 0, 0.0, 851.6363636363637, 119, 1006, 963.0, 1004.2, 1006.0, 1006.0, 0.12451890423364274, 33.28731675911252, 0.0635970575333937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 219.6875, 119, 954, 124.5, 704.8000000000003, 954.0, 954.0, 0.12688543830988597, 4.693491123967073, 0.07335564402290282], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 1118.8333333333333, 135, 7311, 521.5, 5467.500000000006, 7311.0, 7311.0, 0.07052103289806184, 0.013412081207907758, 0.048201998316310335], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 339.27272727272725, 244, 502, 255.0, 499.8, 502.0, 502.0, 0.05603382405379247, 0.08684148317711782, 0.12602138358973053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/284eabaa-db59-4c07-9255-fa542eaffc24", 3, 0, 0.0, 743.0, 354, 970, 905.0, 970.0, 970.0, 970.0, 0.0892140244446427, 0.04036702277931424, 0.0572108164570137], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 2933.809523809524, 218, 18784, 444.0, 17253.600000000002, 18654.699999999997, 18784.0, 0.08774532129411813, 0.05389824911523468, 0.03967390992107099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 11, 0, 0.0, 124.18181818181817, 121, 128, 124.0, 127.6, 128.0, 128.0, 0.12451185692455714, 0.09253273742147264, 0.062499115682834346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56f9d980-78ae-43e5-b04d-c11d2b9f5442", 1, 0, 0.0, 1093.0, 1093, 1093, 1093.0, 1093.0, 1093.0, 1093.0, 0.9149130832570906, 0.2921646271729186, 0.5459100526075022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43a0c8de-1fbc-4536-aa14-bf555f27f7c6", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.8064038825757576, 1.5067668876262625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 11, 0, 0.0, 170.9090909090909, 120, 378, 125.0, 377.8, 378.0, 378.0, 0.12451890423364274, 0.203338132499434, 0.06150773998188816], "isController": false}, {"data": ["login", 21, 0, 0.0, 6200.619047619048, 1403, 33516, 2462.0, 30155.200000000004, 33326.7, 33516.0, 0.08520548723337783, 19.53472890707733, 0.15546910819271048], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 128.18750000000003, 124, 133, 128.5, 132.3, 133.0, 133.0, 0.12386873011326248, 0.10028044654677205, 0.04403146265744876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c230162-7cbc-44a9-ba5b-2e33965b8fa8", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a1a3073-43ed-4561-8a89-8e5a020d9d24", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 0.9176320043103449, 1.7145968031609196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83ea5036-1bf4-47f0-b479-ef0933c49648", 1, 0, 0.0, 878.0, 878, 878, 878.0, 878.0, 878.0, 878.0, 1.1389521640091116, 0.2057677249430524, 0.7852541287015945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 11, 0, 0.0, 1501.3636363636363, 243, 1980, 1562.0, 1932.2000000000003, 1980.0, 1980.0, 0.12434296049285029, 135.25152735191884, 0.2507281304753292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e30962a2-50ab-4dfb-b4fc-f727c95cdb4d", 3, 0, 0.0, 393.3333333333333, 298, 449, 433.0, 449.0, 449.0, 449.0, 0.03589933825553149, 0.023079815447485254, 0.023021385534959974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0af9c45-781d-4631-b192-e26a1b482c55", 3, 0, 0.0, 408.6666666666667, 274, 540, 412.0, 540.0, 540.0, 540.0, 0.020169694361898104, 0.027805551960494293, 0.0129343417620245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 451.7142857142857, 242, 1438, 258.0, 1176.0000000000005, 1422.6999999999998, 1438.0, 0.11448259319428242, 13.204431030029875, 0.2546843738756174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 1197.8333333333333, 124, 2085, 1559.5, 2085.0, 2085.0, 2085.0, 0.07130717944451706, 56.87847808195572, 0.1229422122161083], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1376.142857142857, 465, 3505, 1138.0, 2657.6, 3420.999999999999, 3505.0, 0.09931801628815468, 0.03153568709149554, 0.04480949563000728], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d38a6ef-fac0-43b5-98da-5457330e6150", 1, 0, 0.0, 883.0, 883, 883, 883.0, 883.0, 883.0, 883.0, 1.1325028312570782, 0.20460256228765572, 0.7808076160815401], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0af9c45-781d-4631-b192-e26a1b482c55", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 499.3125, 247, 1827, 254.0, 1206.8000000000006, 1827.0, 1827.0, 0.1267457243122064, 19.125871005529284, 0.28100046935526035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 10, 0, 0.0, 505.0, 120, 1918, 135.0, 1907.8, 1918.0, 1918.0, 0.06980510414921538, 0.05419439238147093, 0.02481353311554141], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 540.3125000000001, 243, 1834, 487.0, 1389.5000000000005, 1834.0, 1834.0, 0.09621745144025498, 14.519168790215888, 0.21331803626195203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 186.25, 124, 367, 127.0, 367.0, 367.0, 367.0, 0.023679568084678138, 0.017597804016054746, 0.011886033198754455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 252.75, 122, 375, 257.0, 375.0, 375.0, 375.0, 0.02364513383145749, 0.00632692057599546, 0.013485115388253097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 0, 0.0, 248.0, 123, 373, 248.0, 373.0, 373.0, 373.0, 0.023680269007855928, 0.006382572506023669, 0.013921408147196552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 188.0, 123, 360, 134.5, 360.0, 360.0, 360.0, 0.023647230613704755, 0.006373667626350109, 0.013925078183656217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 135.0, 135, 135, 135.0, 135.0, 135.0, 135.0, 7.407407407407407, 2.1846064814814814, 4.578993055555555], "isController": false}, {"data": ["https://demoqa.com/books", 48, 0, 0.0, 1419.9166666666663, 961, 2280, 1262.0, 2105.1, 2195.8999999999996, 2280.0, 0.23518459540900072, 281.3625395036625, 0.4643977069501948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1376.142857142857, 465, 3505, 1138.0, 2657.6, 3420.999999999999, 3505.0, 0.09780452136330188, 0.03105511866948592, 0.04412664928695847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 157.625, 120, 371, 128.0, 371.0, 371.0, 371.0, 0.05254860746190226, 0.014163491854965843, 0.030944150683131895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 155.625, 120, 366, 126.0, 366.0, 366.0, 366.0, 0.052550678560636915, 0.014164050080796667, 0.030894051263186933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 10, 0, 0.0, 272.70000000000005, 120, 1352, 125.5, 1254.2000000000003, 1352.0, 1352.0, 0.06730199752328649, 6.072171559942524, 0.038987836846497606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 10, 0, 0.0, 235.39999999999998, 121, 746, 129.5, 707.9000000000001, 746.0, 746.0, 0.06757761288840233, 2.003399048338266, 0.039213493728797524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 189.62500000000003, 123, 378, 130.0, 378.0, 378.0, 378.0, 0.052546536526411204, 0.014060303718981123, 0.02996794661271889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 10, 0, 0.0, 125.3, 120, 128, 126.5, 127.9, 128.0, 128.0, 0.06786102062975027, 0.050431871776601515, 0.034063051370792616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 124.75, 122, 128, 124.0, 128.0, 128.0, 128.0, 0.05255136896316149, 0.03905428884859951, 0.02637832387408692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 10, 0, 0.0, 197.4, 120, 381, 127.5, 379.0, 381.0, 381.0, 0.06774471083170182, 0.028301940716603552, 0.03806670567632932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c811f2c-f469-4e1b-83a2-88bc391f4673", 3, 0, 0.0, 375.6666666666667, 222, 458, 447.0, 458.0, 458.0, 458.0, 0.09944971159583638, 0.044998404660876484, 0.06377471739706955], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 543.7272727272727, 124, 905, 480.0, 896.4000000000001, 905.0, 905.0, 0.07288243400826884, 0.013743101015053535, 0.0496019832304145], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 1293.25, 125, 9184, 129.5, 9184.0, 9184.0, 9184.0, 0.04975774199366833, 0.03916478520204753, 0.01768732234931179], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 2575.095238095238, 746, 13940, 1212.0, 10312.400000000003, 13678.899999999996, 13940.0, 0.09419617025284943, 0.048753877181650584, 0.04332655877841024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 317.0, 248, 500, 259.0, 500.0, 500.0, 500.0, 0.052502050861361775, 0.08136792452830188, 0.11807834290401968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/668d9ff5-d2d9-4067-bf25-eab410f8ffec", 3, 0, 0.0, 436.0, 214, 862, 232.0, 862.0, 862.0, 862.0, 0.03029568589432865, 0.024625106666060752, 0.019427897529891745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/575d82ee-5c2e-4bf4-b381-990313311a1c", 2, 0, 0.0, 238.5, 238, 239, 238.5, 239.0, 239.0, 239.0, 0.015840454937865817, 0.03132511840740066, 0.009846142156202727], "isController": false}, {"data": ["addBook", 49, 1, 2.0408163265306123, 2649.4285714285716, 636, 44149, 1094.0, 2342.0, 12820.5, 44149.0, 0.22044466838823454, 92.35788067195135, 0.7969371758001242], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/424894b7-8b73-4470-87df-1e6ab5184101", 3, 0, 0.0, 502.66666666666663, 316, 779, 413.0, 779.0, 779.0, 779.0, 0.029109821653826, 0.024267660564924604, 0.018667431203788158], "isController": false}, {"data": ["https://demoqa.com/books-0", 48, 0, 0.0, 224.35416666666666, 120, 510, 128.0, 500.5, 508.0, 510.0, 0.23642757927712268, 0.1757044803026273, 0.11428872240446848], "isController": false}, {"data": ["https://demoqa.com/books-3", 48, 0, 0.0, 788.5625, 589, 1139, 738.5, 1050.1000000000001, 1108.35, 1139.0, 0.2358699177403662, 69.35358743403013, 0.11862598401981307], "isController": false}, {"data": ["https://demoqa.com/books-1", 48, 0, 0.0, 209.91666666666666, 122, 507, 129.0, 377.4, 443.34999999999974, 507.0, 0.23690951537197263, 0.4192187908730609, 0.11521576040551011], "isController": false}, {"data": ["https://demoqa.com/books-2", 48, 0, 0.0, 1193.7083333333333, 830, 1762, 1122.5, 1614.6, 1686.7999999999997, 1762.0, 0.23580966230091277, 212.18194864753332, 0.11836539689713786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 993.375, 123, 13653, 130.5, 4364.000000000009, 13653.0, 13653.0, 0.08814067251333127, 0.06584727975849455, 0.03133125468247323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 146, 1, 0.684931506849315, 702.2054794520548, 121, 40471, 133.0, 364.3, 459.60000000000014, 31125.050000000025, 0.5984170639035646, 1.3374283551830706, 0.28728053771462064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 132.0, 127, 144, 128.5, 144.0, 144.0, 144.0, 0.022781508249753675, 0.01764232035356901, 0.008098114260654626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 277.1904761904762, 121, 2528, 130.0, 372.0, 2312.399999999997, 2528.0, 0.11136329889909424, 0.09037392713393293, 0.039586172655537405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb101eab-9506-4a89-9251-d9eaf189c78e", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.9532416044776119, 1.781133395522388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c230162-7cbc-44a9-ba5b-2e33965b8fa8", 3, 0, 0.0, 342.3333333333333, 214, 531, 282.0, 531.0, 531.0, 531.0, 0.05328786102525844, 0.03488342725318839, 0.03417222858716118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 0, 0.0, 504.25, 276, 742, 499.5, 742.0, 742.0, 742.0, 0.023626977282661343, 0.03661720014412456, 0.05313762566598542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31451bb0-db85-4348-a8b5-da18c7efd090", 3, 0, 0.0, 437.0, 309, 522, 480.0, 522.0, 522.0, 522.0, 0.02785230849216886, 0.02793390705220451, 0.01786101814113693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 10, 0, 0.0, 446.9, 251, 1479, 255.5, 1380.7000000000003, 1479.0, 1479.0, 0.06724406907310776, 8.138522099343026, 0.14951298482973802], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=284eabaa-db59-4c07-9255-fa542eaffc24", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 0.6921994731800766, 2.6415828544061304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 1307.6363636363637, 123, 12809, 131.0, 10322.60000000001, 12809.0, 12809.0, 0.05247891301858708, 0.04351034878201213, 0.018654613612075873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d38a6ef-fac0-43b5-98da-5457330e6150", 3, 0, 0.0, 332.3333333333333, 222, 434, 341.0, 434.0, 434.0, 434.0, 0.05833851897946484, 0.03750604654441506, 0.03741109452784692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 11, 0, 0.0, 127.72727272727276, 123, 144, 127.0, 141.0, 144.0, 144.0, 0.1278385979592311, 0.09924969275155149, 0.04544262661832043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47f0e2ed-5b92-4b30-af72-1b0b2c9dcdc6", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.6625226919087137, 1.2379246628630707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 158.625, 120, 439, 124.5, 383.00000000000006, 439.0, 439.0, 0.09629041188223683, 0.07155957367420139, 0.04833327315182591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 169.4375, 117, 373, 124.0, 371.6, 373.0, 373.0, 0.09629620713314155, 0.04384580720295629, 0.05390800853425136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 356.125, 120, 1709, 127.0, 1262.4000000000005, 1709.0, 1709.0, 0.09629562757666034, 10.853582216153592, 0.05557687099395143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e30962a2-50ab-4dfb-b4fc-f727c95cdb4d", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83ea5036-1bf4-47f0-b479-ef0933c49648", 3, 0, 0.0, 377.3333333333333, 211, 558, 363.0, 558.0, 558.0, 558.0, 0.02414350901760062, 0.024214241954175618, 0.015482653894750396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 293.25, 119, 963, 125.0, 955.3, 963.0, 963.0, 0.09629446848462599, 3.5619314488706464, 0.05567023959267439], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 44.44444444444444, 0.35874439461883406], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 11.11111111111111, 0.08968609865470852], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 11.11111111111111, 0.08968609865470852], "isController": false}, {"data": ["401/Unauthorized", 3, 33.333333333333336, 0.26905829596412556], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1115, 9, "406/Not Acceptable", 4, "401/Unauthorized", 3, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 146, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
