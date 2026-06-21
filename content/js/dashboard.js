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

    var data = {"OkPercent": 97.97979797979798, "KoPercent": 2.0202020202020203};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7328447701532311, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f6bdd6a-fdeb-41c4-9599-36464ee30c6f"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f89a5270-bac5-4568-a360-b2f3f5f6579d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/61a645aa-1e1e-4a0e-a001-a3ea8b56b44d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fdc9e6f1-deb6-40c9-874a-56bf906ca361"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d4fb33d-eadb-4ad6-b6d9-c0d00326b46d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a03a1f7b-9d6b-4afc-ae91-f28f44ea3cdd"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6590909090909091, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4c217e39-2e4c-48ce-af86-f5284b8421b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dd6c4596-bd12-4416-8996-eff1fdcbea21"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b70dca40-3a63-493f-9b26-53738dacb9a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3df9c569-e806-4199-ad32-37d1b2faf7fc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b5e0fe4e-fcfc-4fd6-9f99-6d17163dd2d9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4165bf62-18fa-4d8a-82c5-cb529176bd20"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a03a1f7b-9d6b-4afc-ae91-f28f44ea3cdd"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fdc9e6f1-deb6-40c9-874a-56bf906ca361"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3640849a-698c-45ad-b916-0128aebed555"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c217e39-2e4c-48ce-af86-f5284b8421b7"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "addBook"], "isController": true}, {"data": [0.9017857142857143, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb3c6fc0-9ed8-4a0d-9d7a-07ea1f121ffe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4017857142857143, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9367469879518072, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dd1daa24-5f36-4ee5-8b8b-be46045f54c2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d4fb33d-eadb-4ad6-b6d9-c0d00326b46d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd1daa24-5f36-4ee5-8b8b-be46045f54c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f89a5270-bac5-4568-a360-b2f3f5f6579d"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b70dca40-3a63-493f-9b26-53738dacb9a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5e0fe4e-fcfc-4fd6-9f99-6d17163dd2d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61a645aa-1e1e-4a0e-a001-a3ea8b56b44d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3640849a-698c-45ad-b916-0128aebed555"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1f6bdd6a-fdeb-41c4-9599-36464ee30c6f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3df9c569-e806-4199-ad32-37d1b2faf7fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1287, 26, 2.0202020202020203, 466.8694638694638, 129, 2634, 154.0, 1305.2, 1564.3999999999996, 2023.1999999999962, 5.06920428853895, 738.376465286093, 3.7061648116674415], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2229.642857142856, 1567, 3202, 2148.5, 2745.2000000000003, 2833.6499999999996, 3202.0, 0.25517527351599634, 307.0624358145901, 1.2546948263213296], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f6bdd6a-fdeb-41c4-9599-36464ee30c6f", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 634.1428571428572, 139, 1927, 546.5, 1470.0, 1927.0, 1927.0, 0.1233208544373486, 0.02429255670557146, 0.08297662959700507], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 634.1428571428572, 139, 1927, 546.5, 1470.0, 1927.0, 1927.0, 0.12581781580271767, 0.024784424653102308, 0.08465671395319577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 183.25, 131, 397, 134.0, 396.3, 397.0, 397.0, 0.1302040949187852, 0.03483976758569057, 0.07425702288336967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 136.25, 132, 147, 134.0, 146.3, 147.0, 147.0, 0.1302040949187852, 0.09676300413398001, 0.06535635233228085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 170.75, 130, 395, 143.5, 392.9, 395.0, 395.0, 0.13020621409156755, 0.035094643641867804, 0.07667416708712423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 166.81250000000003, 131, 400, 133.0, 392.3, 400.0, 400.0, 0.13020621409156755, 0.035094643641867804, 0.07654701258117544], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 291.6, 132, 645, 251.0, 554.4000000000001, 645.0, 645.0, 0.09867187654174807, 0.17887489598339681, 0.0637705545852821], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f89a5270-bac5-4568-a360-b2f3f5f6579d", 3, 0, 0.0, 577.6666666666667, 237, 1248, 248.0, 1248.0, 1248.0, 1248.0, 0.06865302759851709, 0.031063707149068608, 0.044025541786809466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 171.0, 131, 446, 136.0, 410.79999999999995, 446.0, 446.0, 0.08257517984388434, 0.0613669061144492, 0.04144886957007476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 230.1176470588235, 129, 431, 144.0, 404.59999999999997, 431.0, 431.0, 0.08247142607649467, 0.029353915209671472, 0.04662705511516892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 991.1428571428572, 660, 1189, 1048.0, 1189.0, 1189.0, 1189.0, 0.07147378954032142, 21.015667278022832, 0.04076239559721456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1377.5714285714287, 1175, 1483, 1412.0, 1483.0, 1483.0, 1483.0, 0.07118957784580338, 64.05650728358368, 0.0405307850430697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 135.71428571428572, 131, 146, 132.0, 146.0, 146.0, 146.0, 0.07194392484943164, 0.12730702326872084, 0.03983613807580834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61a645aa-1e1e-4a0e-a001-a3ea8b56b44d", 3, 0, 0.0, 441.6666666666667, 339, 495, 491.0, 495.0, 495.0, 495.0, 0.046249190639163815, 0.03027575598156199, 0.029658497903370024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fdc9e6f1-deb6-40c9-874a-56bf906ca361", 3, 0, 0.0, 460.66666666666663, 227, 815, 340.0, 815.0, 815.0, 815.0, 0.08643789437289308, 0.038266776154666206, 0.05543055075345031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 185.99999999999997, 132, 397, 135.0, 396.3, 397.0, 397.0, 0.07832655319107272, 0.05820947947109995, 0.03931625814473768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 183.74999999999997, 131, 398, 134.0, 397.3, 398.0, 398.0, 0.07832732007969806, 0.028311425141111565, 0.0442599077940579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 255.18749999999997, 130, 1554, 134.0, 744.1000000000008, 1554.0, 1554.0, 0.07832770352964215, 4.424755111188623, 0.045627417143976105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 189.9375, 131, 775, 134.0, 506.2000000000003, 775.0, 775.0, 0.07832732007969806, 1.4592192326615134, 0.04570368530040975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d4fb33d-eadb-4ad6-b6d9-c0d00326b46d", 3, 0, 0.0, 352.0, 248, 433, 375.0, 433.0, 433.0, 433.0, 0.024335242297895816, 0.024406536953065428, 0.015605607853793864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 210.57142857142858, 131, 396, 140.0, 396.0, 396.0, 396.0, 0.0719527989638797, 0.05347273438624262, 0.04040318301194416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a03a1f7b-9d6b-4afc-ae91-f28f44ea3cdd", 3, 0, 0.0, 314.0, 233, 458, 251.0, 458.0, 458.0, 458.0, 0.07567158531971245, 0.034239421742968845, 0.04852637470046664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 307.94117647058823, 130, 1681, 133.0, 686.5999999999991, 1681.0, 1681.0, 0.08257878988069794, 4.3918036072965645, 0.048129848467920566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1150.642857142857, 135, 1865, 1232.5, 1858.5, 1865.0, 1865.0, 0.11292508227398852, 72.58740161906337, 0.059455812012002326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 233.47058823529412, 130, 781, 135.0, 474.59999999999974, 781.0, 781.0, 0.08247142607649467, 1.447352682383133, 0.048147811535812005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 865.8571428571429, 129, 1422, 1042.0, 1363.5, 1422.0, 1422.0, 0.11292690402826398, 23.726024458757482, 0.05956705135754271], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 449.35714285714295, 135, 745, 482.5, 730.5, 745.0, 745.0, 0.12617159336697908, 0.02485411409516943, 0.08570444867519827], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 459.75, 266, 1944, 273.0, 1138.3000000000009, 1944.0, 1944.0, 0.07827520583933036, 5.966501766390094, 0.17479105718003785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 694.4545454545454, 147, 1536, 623.5, 1411.3999999999999, 1527.3, 1536.0, 0.0987250999591637, 0.060642663939759735, 0.044638399688567185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 156.7142857142857, 131, 435, 134.0, 290.5, 435.0, 435.0, 0.11292508227398852, 0.08392186290088405, 0.05668309793831064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 252.3571428571429, 130, 433, 145.0, 431.0, 433.0, 433.0, 0.11292781492744389, 0.15136864478555814, 0.05762973591023852], "isController": false}, {"data": ["login", 22, 0, 0.0, 3082.863636363637, 1746, 5424, 3068.5, 4349.4, 5282.249999999998, 5424.0, 0.09892219769151563, 37.78883718502273, 0.2014450790703112], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4c217e39-2e4c-48ce-af86-f5284b8421b7", 3, 0, 0.0, 326.0, 244, 485, 249.0, 485.0, 485.0, 485.0, 0.03298261816022956, 0.02749625166287367, 0.02115096281759513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 143.58823529411765, 133, 204, 140.0, 159.99999999999997, 204.0, 204.0, 0.08257076800528454, 0.0668468424574032, 0.02935132768937849], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd6c4596-bd12-4416-8996-eff1fdcbea21", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 1.0898837457337884, 2.0364494453924915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b70dca40-3a63-493f-9b26-53738dacb9a1", 3, 0, 0.0, 755.3333333333334, 494, 1031, 741.0, 1031.0, 1031.0, 1031.0, 0.02029742493335679, 0.023990869118821128, 0.013016252317289347], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3df9c569-e806-4199-ad32-37d1b2faf7fc", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5e0fe4e-fcfc-4fd6-9f99-6d17163dd2d9", 3, 0, 0.0, 532.3333333333334, 320, 645, 632.0, 645.0, 645.0, 645.0, 0.01959414004585029, 0.023159610190912238, 0.01256525256846519], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4165bf62-18fa-4d8a-82c5-cb529176bd20", 1, 0, 0.0, 634.0, 634, 634, 634.0, 634.0, 634.0, 634.0, 1.5772870662460567, 0.5036844440063092, 0.941135153785489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1315.7142857142858, 270, 1997, 1421.0, 1993.0, 1997.0, 1997.0, 0.1128013407245069, 96.44253401161855, 0.2330776586873147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 357.25, 266, 537, 287.0, 535.6, 537.0, 537.0, 0.13006226731047488, 0.201571111544652, 0.29251308751564814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, 41.666666666666664, 982.8333333333334, 132, 1809, 1380.5, 1777.8000000000002, 1809.0, 1809.0, 0.11556129081961845, 80.6595803620439, 0.18374320475534714], "isController": false}, {"data": ["register", 24, 9, 37.5, 1106.7083333333333, 176, 2054, 1019.0, 1841.0, 2031.75, 2054.0, 0.10051177244134718, 0.03126269484625887, 0.04534808483193594], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a03a1f7b-9d6b-4afc-ae91-f28f44ea3cdd", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.5376906622023809, 2.051943824404762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 559.7058823529412, 266, 1814, 529.0, 1070.7999999999993, 1814.0, 1814.0, 0.08241585099214141, 5.920097983962846, 0.1841147764954841], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 185.0, 133, 420, 137.0, 416.7, 420.0, 420.0, 0.07481203476265881, 0.058081609019837666, 0.02659334048203888], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fdc9e6f1-deb6-40c9-874a-56bf906ca361", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 561.8125000000001, 264, 1573, 528.5, 1470.8000000000002, 1573.0, 1573.0, 0.08907198129488393, 13.440920659828537, 0.19747623587374047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 180.72727272727272, 132, 396, 134.0, 395.2, 396.0, 396.0, 0.09565051042590564, 0.07108402190831464, 0.048012072616128415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 226.27272727272728, 131, 396, 133.0, 394.8, 396.0, 396.0, 0.09565217391304348, 0.025594429347826086, 0.05455163043478261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 157.0909090909091, 130, 392, 132.0, 342.8000000000002, 392.0, 392.0, 0.09543640465035572, 0.025723093440916188, 0.05610616757765053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 251.09090909090904, 131, 397, 134.0, 396.6, 397.0, 397.0, 0.09543640465035572, 0.025723093440916188, 0.05619936719156689], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 135.5, 135, 136, 135.5, 136.0, 136.0, 136.0, 0.056039676090672196, 0.016527326347053714, 0.034641713833394046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3640849a-698c-45ad-b916-0128aebed555", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.32032635195035464, 1.2224346187943265], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1510.2142857142858, 1033, 2634, 1354.5, 2141.5, 2263.1499999999996, 2634.0, 0.2513419866788747, 300.69239668049045, 0.4963022432272311], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1106.7083333333333, 176, 2054, 1019.0, 1841.0, 2031.75, 2054.0, 0.10152498995325619, 0.03157784111339072, 0.04580522007656676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 192.11111111111111, 129, 396, 133.0, 396.0, 396.0, 396.0, 0.060121043701318655, 0.016204500060121044, 0.0354033099139601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 132.11111111111111, 130, 134, 132.0, 134.0, 134.0, 134.0, 0.06012064208845751, 0.01620439181290456, 0.035344361852784584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 219.25, 131, 914, 132.5, 757.1000000000006, 914.0, 914.0, 0.06909775605037227, 5.198262200432437, 0.04012708228966931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 254.91666666666663, 131, 1056, 133.5, 858.0000000000007, 1056.0, 1056.0, 0.06899247981969966, 1.7075526462928041, 0.04013332078053492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 191.66666666666669, 131, 393, 133.0, 393.0, 393.0, 393.0, 0.06012144531954548, 0.016087183610894007, 0.03428801178380328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 160.75, 131, 442, 135.0, 351.4000000000003, 442.0, 442.0, 0.06909337970266816, 0.051347716751689906, 0.03468163785856585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 201.88888888888886, 130, 465, 138.0, 465.0, 465.0, 465.0, 0.060121846943138095, 0.04468039601926571, 0.030178348953879865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 197.58333333333331, 130, 397, 132.5, 396.4, 397.0, 397.0, 0.06899168650177653, 0.02709585604309681, 0.03886396923545713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 166.66666666666666, 134, 392, 139.0, 392.0, 392.0, 392.0, 0.061415420729751674, 0.048340653425956885, 0.021831262837528915], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 570.2142857142857, 132, 1248, 526.0, 1031.5, 1248.0, 1248.0, 0.12129928866631433, 0.023420509976866493, 0.0825471442681754], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1580.5909090909088, 1097, 2430, 1447.0, 2312.1, 2415.1499999999996, 2430.0, 0.09978048293753743, 0.051644195270405105, 0.04589512447615246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 395.8888888888889, 264, 861, 271.0, 861.0, 861.0, 861.0, 0.06006807715410799, 0.09309378754254821, 0.13509451336514716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c217e39-2e4c-48ce-af86-f5284b8421b7", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 0.2523241096368715, 0.9629233589385475], "isController": false}, {"data": ["addBook", 55, 8, 14.545454545454545, 1385.1272727272722, 673, 3377, 1088.0, 2497.8, 2613.6, 3377.0, 0.2762042505323209, 91.22548236090606, 1.0025988701362942], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 243.21428571428572, 131, 766, 139.0, 534.0, 546.5999999999999, 766.0, 0.25237730406958403, 0.18755774257514987, 0.12199879444769932], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 852.1250000000001, 643, 1391, 788.5, 1058.2, 1154.1499999999999, 1391.0, 0.25240119169419795, 74.21433086641217, 0.12694005246339055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb3c6fc0-9ed8-4a0d-9d7a-07ea1f121ffe", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 189.99999999999994, 129, 441, 136.0, 405.0000000000001, 428.0, 441.0, 0.25313480332329835, 0.4479299449431803, 0.12310657427246345], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1265.3749999999998, 897, 1833, 1190.5, 1607.2, 1723.7499999999998, 1833.0, 0.2522488434840971, 226.97395277316073, 0.12661709526447842], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 138.4375, 132, 147, 136.5, 147.0, 147.0, 147.0, 0.08985129610494631, 0.06712523585965227, 0.03193932791230514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 8, 4.819277108433735, 214.68674698795184, 131, 1711, 143.5, 365.0000000000001, 410.95000000000005, 1340.4900000000068, 0.6704740978892183, 1.5159584068768024, 0.3197200291009992], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 136.99999999999997, 131, 149, 135.0, 148.4, 149.0, 149.0, 0.09490367277213628, 0.07349473877764069, 0.03373528993072032], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd1daa24-5f36-4ee5-8b8b-be46045f54c2", 3, 0, 0.0, 750.0, 331, 1293, 626.0, 1293.0, 1293.0, 1293.0, 0.03197407967940656, 0.026655474628567776, 0.020504211252744445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d4fb33d-eadb-4ad6-b6d9-c0d00326b46d", 1, 0, 0.0, 745.0, 745, 745, 745.0, 745.0, 745.0, 745.0, 1.3422818791946307, 0.24250209731543623, 0.9254404362416108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 144.3125, 134, 173, 143.5, 165.3, 173.0, 173.0, 0.1313790696719629, 0.10661719423574333, 0.04670115367245556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd1daa24-5f36-4ee5-8b8b-be46045f54c2", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.3109536359724613, 1.186666308089501], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f89a5270-bac5-4568-a360-b2f3f5f6579d", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.4817708333333333, 1.8385416666666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 458.45454545454544, 264, 789, 524.0, 788.8, 789.0, 789.0, 0.09532475410546383, 0.14773475074743272, 0.21438760615711253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 458.66666666666674, 267, 1194, 273.5, 1087.5000000000005, 1194.0, 1194.0, 0.06893580353295993, 6.970532861194887, 0.15356841519460004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b70dca40-3a63-493f-9b26-53738dacb9a1", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5e0fe4e-fcfc-4fd6-9f99-6d17163dd2d9", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61a645aa-1e1e-4a0e-a001-a3ea8b56b44d", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 156.0625, 133, 398, 136.5, 239.10000000000016, 398.0, 398.0, 0.0782683135624312, 0.06489238106885166, 0.02782193958664547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3640849a-698c-45ad-b916-0128aebed555", 3, 0, 0.0, 375.3333333333333, 335, 435, 356.0, 435.0, 435.0, 435.0, 0.016736308305114057, 0.023072352106822278, 0.010732593542016501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f6bdd6a-fdeb-41c4-9599-36464ee30c6f", 3, 0, 0.0, 355.3333333333333, 250, 561, 255.0, 561.0, 561.0, 561.0, 0.02383430391915404, 0.023904130981417186, 0.015284368073155424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 145.5, 134, 168, 145.5, 161.0, 168.0, 168.0, 0.12386420943668328, 0.09616410791226875, 0.04402985569819601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3df9c569-e806-4199-ad32-37d1b2faf7fc", 3, 0, 0.0, 484.66666666666663, 322, 792, 340.0, 792.0, 792.0, 792.0, 0.01746186038660559, 0.024072584224373264, 0.011197872708858402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 149.99999999999997, 130, 389, 132.5, 218.90000000000018, 389.0, 389.0, 0.08913847662343449, 0.06624451241253286, 0.044743336898872395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 229.93749999999997, 129, 396, 133.5, 395.3, 396.0, 396.0, 0.08914095971385752, 0.04058786373690045, 0.0499023976132508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 372.0625, 129, 1440, 138.5, 1337.8000000000002, 1440.0, 1440.0, 0.08913946984300311, 10.047004095540798, 0.051446705739467614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 317.6875, 129, 1059, 134.5, 1046.4, 1059.0, 1059.0, 0.08913996646108761, 3.297286488888146, 0.05153404311031628], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 34.61538461538461, 0.6993006993006993], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.538461538461538, 0.2331002331002331], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.6923076923076925, 0.1554001554001554], "isController": false}, {"data": ["401/Unauthorized", 12, 46.15384615384615, 0.9324009324009324], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1287, 26, "401/Unauthorized", 12, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
