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

    var data = {"OkPercent": 99.153194765204, "KoPercent": 0.8468052347959969};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8123342175066313, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.34210526315789475, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e73ec7c-0940-41a1-8e51-bf7754f4a82b"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ff2ccffa-0123-40b1-a604-d7557dd32a00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb17490a-8236-4d46-9617-aca8fea1205d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db9614f0-23ce-4989-b238-7f835fdc1527"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/db9614f0-23ce-4989-b238-7f835fdc1527"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=788ba140-0d99-4de3-a4d3-396ad53fe6fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f9da1600-af76-4618-b671-6992ec18a979"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ddcfe877-d8e8-47e2-9931-78bc8a1ff7bc"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0d26ed7-20fc-4873-87a4-bcef29dc259b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/de90e86d-dd12-4991-a620-a9523fb1fbfb"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f8317d3-f174-4a7c-9b60-017591477aeb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ad24d20-97e0-4fe9-ae57-00968d1ecbd8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65371699-c481-4be6-b647-60863d09907b"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c6e6ad4-35dc-4cc5-b5f9-2c7fe8d19ebe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a1ba2a9a-706d-4740-9539-18731e923bf0"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1e73ec7c-0940-41a1-8e51-bf7754f4a82b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e8399fa-99b9-4fa8-9931-7753d347a08f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=695d3a35-b5ce-476c-8606-012c59169a92"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.13157894736842105, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.423728813559322, 500, 1500, "addBook"], "isController": true}, {"data": [0.9824561403508771, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7719298245614035, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9857142857142858, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb17490a-8236-4d46-9617-aca8fea1205d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a0d26ed7-20fc-4873-87a4-bcef29dc259b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ddcfe877-d8e8-47e2-9931-78bc8a1ff7bc"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/788ba140-0d99-4de3-a4d3-396ad53fe6fd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de90e86d-dd12-4991-a620-a9523fb1fbfb"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/695d3a35-b5ce-476c-8606-012c59169a92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e8399fa-99b9-4fa8-9931-7753d347a08f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5f8317d3-f174-4a7c-9b60-017591477aeb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ad24d20-97e0-4fe9-ae57-00968d1ecbd8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/65371699-c481-4be6-b647-60863d09907b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1299, 11, 0.8468052347959969, 335.72594303310257, 81, 6610, 115.0, 894.0, 1084.0, 1924.0, 5.137981908291572, 722.5959195328846, 3.755495290924876], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1421.5614035087722, 1025, 2161, 1416.0, 1716.8, 1897.4999999999989, 2161.0, 0.23730126019458703, 285.5527563048759, 1.1668084424606893], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e73ec7c-0940-41a1-8e51-bf7754f4a82b", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 517.2307692307692, 93, 743, 535.0, 725.0, 743.0, 743.0, 0.09342839073190363, 0.01770030058788018, 0.0631582097503306], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 517.2307692307692, 93, 743, 535.0, 725.0, 743.0, 743.0, 0.09237087617328776, 0.017499951150017408, 0.062443322917924926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 125.375, 82, 259, 84.0, 249.9, 259.0, 259.0, 0.108836133596354, 0.02912216855996191, 0.06207060744167064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 84.625, 82, 89, 84.0, 87.6, 89.0, 89.0, 0.108836133596354, 0.08088310319025917, 0.05463063737160738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 115.3125, 81, 258, 83.5, 256.6, 258.0, 258.0, 0.10883761427949498, 0.029335138223770135, 0.06409089981497605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 126.56249999999997, 83, 253, 85.5, 250.2, 253.0, 253.0, 0.108836133596354, 0.02933473913339229, 0.06398374260254405], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 316.30769230769226, 89, 1008, 204.0, 865.9999999999999, 1008.0, 1008.0, 0.09368356574064064, 0.20814895011350126, 0.060557923918134984], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ff2ccffa-0123-40b1-a604-d7557dd32a00", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 1.557736280487805, 2.9106326219512195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 87.74999999999999, 82, 101, 85.0, 98.9, 101.0, 101.0, 0.12332927374473923, 0.09165388410131499, 0.061905514360152306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 94.37500000000001, 82, 246, 84.0, 135.40000000000012, 246.0, 246.0, 0.12334353487153, 0.04458254476984867, 0.06969692662601469], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 627.6666666666666, 492, 745, 646.0, 745.0, 745.0, 745.0, 0.08502919335638569, 25.001406081713057, 0.04849321183606372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 816.3333333333334, 723, 985, 741.0, 985.0, 985.0, 985.0, 0.08508224617129892, 76.55715466357063, 0.04844038038854226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 190.33333333333334, 84, 244, 243.0, 244.0, 244.0, 244.0, 0.08625646923519263, 0.15263351782633697, 0.04776115044565842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 99.38461538461537, 84, 250, 86.0, 189.99999999999994, 250.0, 250.0, 0.08397553082224964, 0.062407596636457015, 0.042151780119762026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 111.6923076923077, 82, 259, 87.0, 253.0, 259.0, 259.0, 0.08397715821296607, 0.022470450537453814, 0.04789322304333221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 97.61538461538461, 83, 245, 84.0, 183.39999999999995, 245.0, 245.0, 0.08397715821296607, 0.02263446842458851, 0.04936938402754451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 123.07692307692308, 82, 259, 85.0, 254.6, 259.0, 259.0, 0.08397661574238559, 0.022634322211814863, 0.04945107352798682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb17490a-8236-4d46-9617-aca8fea1205d", 3, 0, 0.0, 247.33333333333331, 164, 401, 177.0, 401.0, 401.0, 401.0, 0.06383793675788398, 0.028885003936672767, 0.04093773939226284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 139.33333333333334, 83, 251, 84.0, 251.0, 251.0, 251.0, 0.08665260968776177, 0.06439710544178388, 0.048657471260217786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db9614f0-23ce-4989-b238-7f835fdc1527", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 633.5625, 84, 1107, 815.5, 1081.1000000000001, 1107.0, 1107.0, 0.0856677803478112, 48.18617089450548, 0.04576198813501242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 145.93750000000003, 82, 901, 85.0, 443.2000000000005, 901.0, 901.0, 0.12334353487153, 6.967712721825639, 0.07185001811608169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 402.5, 84, 702, 487.5, 674.0, 702.0, 702.0, 0.0856677803478112, 15.751891216643108, 0.04584564807675833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 140.75, 82, 646, 85.0, 370.2000000000003, 646.0, 646.0, 0.12334068238232528, 2.297807402560861, 0.07196880637054624], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 488.53846153846143, 111, 912, 528.0, 816.3999999999999, 912.0, 912.0, 0.09238860066804065, 0.01750330911093739, 0.06319097123516453], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 248.53846153846155, 168, 509, 177.0, 438.19999999999993, 509.0, 509.0, 0.08392998947647055, 0.13007509111245974, 0.18876051344171063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db9614f0-23ce-4989-b238-7f835fdc1527", 3, 0, 0.0, 572.6666666666666, 486, 661, 571.0, 661.0, 661.0, 661.0, 0.02773463501220324, 0.027815888825715552, 0.017785556957695434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=788ba140-0d99-4de3-a4d3-396ad53fe6fd", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9da1600-af76-4618-b671-6992ec18a979", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 1.6985954122340425, 3.173828125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 836.1052631578946, 240, 2151, 780.0, 1452.0, 2151.0, 2151.0, 0.08765980613341821, 0.053845720759687556, 0.039635244374777966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 106.375, 83, 260, 84.5, 252.3, 260.0, 260.0, 0.08566686298656101, 0.06366453391872356, 0.04300074958505113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 214.81249999999997, 84, 436, 248.0, 365.30000000000007, 436.0, 436.0, 0.08566594564495748, 0.10333872984173217, 0.04435973406077999], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ddcfe877-d8e8-47e2-9931-78bc8a1ff7bc", 3, 0, 0.0, 334.6666666666667, 242, 452, 310.0, 452.0, 452.0, 452.0, 0.029260870413358564, 0.0293465956196477, 0.01876429515439986], "isController": false}, {"data": ["login", 19, 0, 0.0, 4065.0526315789475, 1856, 8198, 3090.0, 7902.0, 8198.0, 8198.0, 0.08711560240439062, 16.577903019988447, 0.1542478097876672], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 92.74999999999999, 85, 120, 89.5, 107.4, 120.0, 120.0, 0.12641525832167944, 0.10234204018425025, 0.044936673856534486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0d26ed7-20fc-4873-87a4-bcef29dc259b", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de90e86d-dd12-4991-a620-a9523fb1fbfb", 3, 0, 0.0, 842.0, 184, 1733, 609.0, 1733.0, 1733.0, 1733.0, 0.02237770583759753, 0.022443265522668614, 0.014350286621115602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 751.4999999999999, 171, 1192, 901.0, 1166.8, 1192.0, 1192.0, 0.0856265185327896, 64.07419211714243, 0.17888332985475602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f8317d3-f174-4a7c-9b60-017591477aeb", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ad24d20-97e0-4fe9-ae57-00968d1ecbd8", 3, 0, 0.0, 279.3333333333333, 168, 476, 194.0, 476.0, 476.0, 476.0, 0.018105227582710715, 0.02495951784270178, 0.011610448677714878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 253.75000000000003, 166, 346, 254.5, 341.8, 346.0, 346.0, 0.1087732417825215, 0.16857727998912267, 0.24463357014174514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 613.2, 87, 1069, 828.0, 1069.0, 1069.0, 1069.0, 0.14137872532941242, 101.49799595656846, 0.22874635949782277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65371699-c481-4be6-b647-60863d09907b", 1, 0, 0.0, 912.0, 912, 912, 912.0, 912.0, 912.0, 912.0, 1.0964912280701753, 0.1980965597587719, 0.7559793037280701], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1244.0, 130, 3455, 1258.0, 2180.8999999999996, 3280.3999999999974, 3455.0, 0.09027196481034681, 0.02854658546293105, 0.04072817162341819], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 133.45, 83, 426, 90.5, 272.90000000000003, 418.44999999999993, 426.0, 0.09704027171276079, 0.07533888282387191, 0.03449478408539544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 266.1875, 167, 984, 180.5, 531.8000000000004, 984.0, 984.0, 0.12324662419793407, 9.394433308651912, 0.27521368364902443], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c6e6ad4-35dc-4cc5-b5f9-2c7fe8d19ebe", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 1.8784466911764706, 3.5098805147058822], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1ba2a9a-706d-4740-9539-18731e923bf0", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 1.7450051229508197, 3.2605447404371586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 327.56250000000006, 167, 948, 188.0, 877.3000000000001, 948.0, 948.0, 0.08676224974513588, 13.092383240380235, 0.19235546629286596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 117.89999999999999, 82, 259, 85.0, 257.7, 259.0, 259.0, 0.04779977629704693, 0.03552307593950461, 0.023993247086603636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e73ec7c-0940-41a1-8e51-bf7754f4a82b", 3, 0, 0.0, 1128.6666666666667, 248, 2731, 407.0, 2731.0, 2731.0, 2731.0, 0.018361426315596195, 0.021702584294247977, 0.011774742787019695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 84.7, 81, 89, 84.0, 88.9, 89.0, 89.0, 0.04779954781627766, 0.01279011338052742, 0.027260679613970853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 133.2, 82, 249, 86.0, 248.7, 249.0, 249.0, 0.047800004780000474, 0.012883595038359502, 0.028101174685117466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 132.4, 81, 248, 83.5, 248.0, 248.0, 248.0, 0.04779977629704693, 0.01288353345506343, 0.028147719831171193], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e8399fa-99b9-4fa8-9931-7753d347a08f", 3, 0, 0.0, 273.6666666666667, 194, 425, 202.0, 425.0, 425.0, 425.0, 0.05059960532307848, 0.03286009525375702, 0.032448314611479366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 111.0, 111, 111, 111.0, 111.0, 111.0, 111.0, 9.00900900900901, 2.656953828828829, 5.569045608108108], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 976.7017543859648, 653, 1808, 979.0, 1322.6000000000001, 1439.8, 1808.0, 0.23726273726273725, 283.84871963973524, 0.4685012253371628], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=695d3a35-b5ce-476c-8606-012c59169a92", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1244.0, 130, 3455, 1258.0, 2180.8999999999996, 3280.3999999999974, 3455.0, 0.08938256958636184, 0.028265333173528133, 0.040326901512596845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 102.44444444444446, 81, 253, 84.0, 253.0, 253.0, 253.0, 0.06622321638803862, 0.017849226292088533, 0.03899667918162821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 83.33333333333333, 82, 85, 83.0, 85.0, 85.0, 85.0, 0.06630664613616438, 0.017871713216388054, 0.038981055638643514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 224.55000000000004, 82, 903, 85.0, 743.2, 895.0999999999999, 903.0, 0.09523219991143406, 12.875332977898987, 0.05475851494907458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 179.54999999999998, 82, 650, 86.0, 508.50000000000006, 643.05, 650.0, 0.09523174645499824, 4.222012059315093, 0.05485125396402144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 103.65, 82, 255, 86.0, 234.6000000000003, 254.7, 255.0, 0.09523083955508152, 0.07077213759904008, 0.04780141751104678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 102.77777777777777, 82, 247, 84.0, 247.0, 247.0, 247.0, 0.06622614019338033, 0.017720666418931847, 0.03776959557903722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 126.14999999999998, 81, 265, 86.0, 247.8, 264.15, 265.0, 0.09523129300288075, 0.046936751541556555, 0.05311190569721211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 86.33333333333333, 83, 98, 85.0, 98.0, 98.0, 98.0, 0.06630664613616438, 0.04927671651330185, 0.03328282823631688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 125.55555555555556, 86, 250, 90.0, 250.0, 250.0, 250.0, 0.06439656837842286, 0.05068714268848518, 0.022890967665767502], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 536.8461538461539, 87, 966, 452.0, 946.0, 966.0, 966.0, 0.08836744543310245, 0.01655561965971736, 0.06014190622174791], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 2386.736842105263, 996, 6610, 1615.0, 5227.0, 6610.0, 6610.0, 0.085746263268106, 0.044380390168062674, 0.03943993163991985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 190.88888888888889, 168, 337, 172.0, 337.0, 337.0, 337.0, 0.06618279688499636, 0.10257040884422776, 0.14884666135365882], "isController": false}, {"data": ["addBook", 59, 2, 3.389830508474576, 918.4237288135595, 436, 1642, 763.0, 1531.0, 1609.0, 1642.0, 0.2928403027670927, 96.10397730797867, 1.0651377729867229], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 157.77192982456137, 83, 581, 88.0, 334.6, 364.399999999999, 581.0, 0.23815791122977223, 0.17699040082603193, 0.11512516216673561], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 531.1403508771929, 404, 794, 494.0, 684.0, 756.5999999999998, 794.0, 0.2382873410895166, 70.06439016469, 0.1198417779893565], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 142.4912280701755, 81, 348, 88.0, 253.2, 276.99999999999966, 348.0, 0.23853664048343426, 0.42209803960545206, 0.11600707711010767], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 815.8771929824561, 562, 1474, 816.0, 1018.6, 1075.4999999999998, 1474.0, 0.23787862347569882, 214.04360354945163, 0.11940391842432539], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 116.87500000000001, 84, 325, 89.0, 275.30000000000007, 325.0, 325.0, 0.08646124914889708, 0.0645926324208069, 0.030734272158397007], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 2, 1.1428571428571428, 153.1257142857143, 83, 633, 93.0, 303.8, 382.79999999999995, 528.1200000000013, 0.7199660998819256, 1.5337367114828422, 0.346764922325943], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 104.89999999999999, 86, 250, 87.5, 234.60000000000005, 250.0, 250.0, 0.04892463648995088, 0.0378879265005186, 0.01739117937728723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb17490a-8236-4d46-9617-aca8fea1205d", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.050372456395349, 4.008448401162791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0d26ed7-20fc-4873-87a4-bcef29dc259b", 3, 0, 0.0, 775.6666666666666, 353, 1008, 966.0, 1008.0, 1008.0, 1008.0, 0.028372550503139894, 0.023228178553189073, 0.018194636878641143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 119.125, 85, 357, 91.5, 281.4000000000001, 357.0, 357.0, 0.10703987904493668, 0.08686537059213123, 0.03804933200425483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ddcfe877-d8e8-47e2-9931-78bc8a1ff7bc", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 253.59999999999997, 166, 507, 174.0, 505.8, 507.0, 507.0, 0.047780363226321246, 0.0740502308986053, 0.10745915674825961], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/788ba140-0d99-4de3-a4d3-396ad53fe6fd", 3, 0, 0.0, 1136.6666666666667, 180, 2429, 801.0, 2429.0, 2429.0, 2429.0, 0.02857659957516122, 0.028660320081729078, 0.018325488659852736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de90e86d-dd12-4991-a620-a9523fb1fbfb", 1, 0, 0.0, 673.0, 673, 673, 673.0, 673.0, 673.0, 673.0, 1.4858841010401187, 0.2684458580980683, 1.0244474368499257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 338.8499999999999, 166, 986, 181.5, 962.4000000000003, 985.55, 986.0, 0.09519185919220188, 17.20778311695034, 0.21043536294276113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/695d3a35-b5ce-476c-8606-012c59169a92", 3, 0, 0.0, 435.6666666666667, 244, 653, 410.0, 653.0, 653.0, 653.0, 0.019585825085524772, 0.02700064102773353, 0.012559920383621028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e8399fa-99b9-4fa8-9931-7753d347a08f", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f8317d3-f174-4a7c-9b60-017591477aeb", 3, 0, 0.0, 1165.6666666666667, 204, 2925, 368.0, 2925.0, 2925.0, 2925.0, 0.03426730784607126, 0.02856724459433219, 0.021974803534101684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 88.84615384615384, 84, 99, 88.0, 96.6, 99.0, 99.0, 0.08815352275038991, 0.07308822345222757, 0.031335822540177666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ad24d20-97e0-4fe9-ae57-00968d1ecbd8", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.3421667850378788, 1.305782433712121], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 102.375, 86, 252, 91.5, 152.6000000000001, 252.0, 252.0, 0.08787153182047845, 0.06822057402078162, 0.0312355835768107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65371699-c481-4be6-b647-60863d09907b", 3, 0, 0.0, 568.3333333333334, 292, 916, 497.0, 916.0, 916.0, 916.0, 0.02839242111639, 0.023669593254907157, 0.018207379426851657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 98.1875, 83, 257, 85.0, 154.8000000000001, 257.0, 257.0, 0.0868017881168352, 0.06450796948917148, 0.0435704288008333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 156.125, 82, 253, 87.0, 250.9, 253.0, 253.0, 0.08680414272771168, 0.03952385893241755, 0.04859421369009836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 195.625, 81, 865, 84.5, 793.6, 865.0, 865.0, 0.08680555555555555, 9.783946143256294, 0.050099690755208336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 182.06250000000003, 81, 736, 86.0, 564.5000000000002, 736.0, 736.0, 0.0868046136652163, 3.2109018117750456, 0.050183917275203174], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 45.45454545454545, 0.3849114703618168], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 9.090909090909092, 0.07698229407236336], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 9.090909090909092, 0.07698229407236336], "isController": false}, {"data": ["401/Unauthorized", 4, 36.36363636363637, 0.30792917628945343], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1299, 11, "406/Not Acceptable", 5, "401/Unauthorized", 4, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
