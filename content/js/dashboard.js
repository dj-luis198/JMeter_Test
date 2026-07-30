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

    var data = {"OkPercent": 98.10606060606061, "KoPercent": 1.893939393939394};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7666232073011734, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03636363636363636, 500, 1500, "see books"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/57ebfcd9-aac0-4fd7-aa3d-b7036cb54373"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50f167e0-5a3e-45d8-aea0-76ae89732ee4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/df1fe4ff-2af2-4007-a8a9-ed0bda6739a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/86441a37-ece3-4bc5-85b4-4d14a43a470d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/263a9109-9151-4bc6-bd5a-7c77b4d7d037"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/29e36a22-e111-441a-b7f3-b1b6dccd294c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7fd49088-3097-4ed7-9108-1bc2cbc567be"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/47fc28eb-4b5a-48e8-9b6a-7d7d73d386fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb51dd55-9696-4f23-83a5-ba54c8d0e177"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b853b8b3-5d67-4038-8c7f-632b5838b2fb"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6022427-0fd3-4b71-949a-83bdd45abad3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1cb46e8b-f8e4-4552-a41c-bb0acd5b0483"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "register"], "isController": true}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86441a37-ece3-4bc5-85b4-4d14a43a470d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57ebfcd9-aac0-4fd7-aa3d-b7036cb54373"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84d234be-9d67-41c1-9c96-4babe09d89a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.34545454545454546, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.175, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.29365079365079366, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3ad59b2-eff6-4e39-b759-6521e1c83b03"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/50f167e0-5a3e-45d8-aea0-76ae89732ee4"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df1fe4ff-2af2-4007-a8a9-ed0bda6739a7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29e36a22-e111-441a-b7f3-b1b6dccd294c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9116022099447514, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3ad59b2-eff6-4e39-b759-6521e1c83b03"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/f6a59837-79de-4dfb-8a14-94daccf25049"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7fd49088-3097-4ed7-9108-1bc2cbc567be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84d234be-9d67-41c1-9c96-4babe09d89a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1cb46e8b-f8e4-4552-a41c-bb0acd5b0483"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47fc28eb-4b5a-48e8-9b6a-7d7d73d386fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b853b8b3-5d67-4038-8c7f-632b5838b2fb"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e6022427-0fd3-4b71-949a-83bdd45abad3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1320, 25, 1.893939393939394, 395.4696969696973, 103, 3511, 127.5, 1109.0, 1344.9, 1912.9599999999991, 5.111405404149532, 698.1932697529681, 3.7397345336423413], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1871.5636363636368, 1358, 2626, 1814.0, 2269.6, 2438.9999999999995, 2626.0, 0.24614007607965988, 296.1888277229246, 1.2102688311143432], "isController": true}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 574.642857142857, 121, 1109, 506.0, 1009.0, 1109.0, 1109.0, 0.07367025195226166, 0.014512052979435475, 0.049569144135847946], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 574.642857142857, 121, 1109, 506.0, 1009.0, 1109.0, 1109.0, 0.07493002071279858, 0.014760210553358202, 0.050416781514763885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 153.18749999999997, 105, 341, 113.0, 340.3, 341.0, 341.0, 0.09068752479737006, 0.024265997846171287, 0.05172022898600011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 146.125, 107, 344, 115.0, 327.90000000000003, 344.0, 344.0, 0.0906813570465082, 0.06739112569569604, 0.04551779054873556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 194.4375, 105, 342, 115.0, 341.3, 342.0, 342.0, 0.09068752479737006, 0.024443121918041148, 0.053402907668763815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57ebfcd9-aac0-4fd7-aa3d-b7036cb54373", 3, 0, 0.0, 330.3333333333333, 212, 451, 328.0, 451.0, 451.0, 451.0, 0.09509319132750095, 0.04302719269050336, 0.060980985323950805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 124.375, 108, 321, 111.0, 177.50000000000014, 321.0, 321.0, 0.09068289890557076, 0.02444187509564212, 0.05331162611440782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50f167e0-5a3e-45d8-aea0-76ae89732ee4", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 0.6429326067615658, 2.453569839857651], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 242.86666666666665, 112, 526, 227.0, 410.80000000000007, 526.0, 526.0, 0.0791598501240171, 0.1559181058367196, 0.0511652989603673], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/df1fe4ff-2af2-4007-a8a9-ed0bda6739a7", 3, 0, 0.0, 382.0, 203, 483, 460.0, 483.0, 483.0, 483.0, 0.023990595686490895, 0.02406088063479116, 0.015384594239058288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 141.18750000000003, 103, 340, 116.0, 323.90000000000003, 340.0, 340.0, 0.09438859785737883, 0.07014621383736845, 0.047378651658879604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 154.1875, 105, 344, 114.0, 341.2, 344.0, 344.0, 0.09438581381218403, 0.05183615433850292, 0.052343109393158206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 880.2, 682, 1021, 899.0, 1021.0, 1021.0, 1021.0, 0.03505647598280831, 10.307767923499757, 0.01999314645894536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1263.4, 971, 1684, 1192.0, 1684.0, 1684.0, 1684.0, 0.034864585948177276, 31.371215721574902, 0.01984966172635484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 251.6, 112, 346, 342.0, 346.0, 346.0, 346.0, 0.03525024146415403, 0.06237640384086632, 0.0195184442482181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 113.84615384615383, 109, 117, 114.0, 117.0, 117.0, 117.0, 0.08372674167723985, 0.062222705484745636, 0.042026899630958285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 128.0, 107, 341, 111.0, 250.19999999999993, 341.0, 341.0, 0.08372889870735463, 0.02240402172442887, 0.04775163754403818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 148.23076923076923, 106, 347, 114.0, 344.2, 347.0, 347.0, 0.08372782017840466, 0.022567264032460635, 0.049222800534569934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 164.6923076923077, 108, 346, 114.0, 343.2, 346.0, 346.0, 0.08373051655287904, 0.02256799078964318, 0.04930615379041608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86441a37-ece3-4bc5-85b4-4d14a43a470d", 3, 0, 0.0, 900.3333333333334, 229, 1940, 532.0, 1940.0, 1940.0, 1940.0, 0.04195510803440319, 0.034976247290399276, 0.026904805607999443], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 114.0, 110, 116, 115.0, 116.0, 116.0, 116.0, 0.035251235555806226, 0.026197451423797403, 0.019794394965418537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 23, 0, 0.0, 634.2608695652173, 106, 1921, 340.0, 1407.8000000000002, 1832.1999999999987, 1921.0, 0.10607583961333052, 41.51495431532658, 0.05839756014038907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 305.12500000000006, 109, 1295, 115.5, 1156.4, 1295.0, 1295.0, 0.09438692741055364, 15.944955783780198, 0.05396830663953043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 23, 0, 0.0, 441.1304347826086, 109, 1029, 123.0, 971.6000000000001, 1028.0, 1029.0, 0.106074371970539, 13.576762967591973, 0.058500340418025265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 298.43750000000006, 106, 899, 114.5, 892.7, 899.0, 899.0, 0.09438637060808419, 5.224306352350221, 0.05406016246254041], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 495.15384615384613, 143, 1028, 493.0, 935.1999999999999, 1028.0, 1028.0, 0.07000726998572929, 0.013263096071515119, 0.04788282701472846], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/263a9109-9151-4bc6-bd5a-7c77b4d7d037", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 1.1204769736842106, 2.0936129385964914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 298.30769230769226, 224, 457, 232.0, 455.8, 457.0, 457.0, 0.08366477455561133, 0.12966405978491716, 0.18816403886872352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 771.6500000000001, 191, 2223, 647.0, 1374.2000000000003, 2181.1499999999996, 2223.0, 0.08652951738161681, 0.053151432063512666, 0.03912418608172713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 23, 0, 0.0, 116.08695652173914, 109, 168, 114.0, 117.0, 157.79999999999984, 168.0, 0.10607535039455418, 0.07883138833032786, 0.053244853616016455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 23, 0, 0.0, 189.73913043478262, 103, 344, 115.0, 341.8, 343.8, 344.0, 0.1060738827653, 0.09765174618364617, 0.05662197920029516], "isController": false}, {"data": ["login", 20, 0, 0.0, 3200.5500000000006, 1789, 5917, 3179.0, 5005.700000000002, 5875.799999999999, 5917.0, 0.08797976465412954, 26.434246295227098, 0.16921498680303532], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/29e36a22-e111-441a-b7f3-b1b6dccd294c", 3, 0, 0.0, 401.0, 334, 454, 415.0, 454.0, 454.0, 454.0, 0.07204437933767201, 0.03259820549458466, 0.046200334405994095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 119.75, 110, 137, 118.5, 131.4, 137.0, 137.0, 0.0966206913210464, 0.07822124326674557, 0.03434563636802821], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7fd49088-3097-4ed7-9108-1bc2cbc567be", 3, 0, 0.0, 456.33333333333337, 231, 831, 307.0, 831.0, 831.0, 831.0, 0.02014585599742133, 0.027772688850611765, 0.012919054790013028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 23, 0, 0.0, 753.1739130434783, 221, 2036, 452.0, 1521.8000000000002, 1947.3999999999987, 2036.0, 0.10601960901812013, 55.23909276456502, 0.22664662425498178], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47fc28eb-4b5a-48e8-9b6a-7d7d73d386fc", 3, 0, 0.0, 385.0, 233, 487, 435.0, 487.0, 487.0, 487.0, 0.01827541043525936, 0.025194128643659955, 0.011719582863756815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb51dd55-9696-4f23-83a5-ba54c8d0e177", 1, 0, 0.0, 347.0, 347, 347, 347.0, 347.0, 347.0, 347.0, 2.881844380403458, 0.9202764769452451, 1.7195380043227666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 357.6249999999999, 221, 674, 269.5, 664.9, 674.0, 674.0, 0.09062280522893586, 0.1404476483382043, 0.20381281293187428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b853b8b3-5d67-4038-8c7f-632b5838b2fb", 3, 0, 0.0, 460.0, 229, 797, 354.0, 797.0, 797.0, 797.0, 0.03608458226081936, 0.03008223150063749, 0.023140178077413455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 903.7500000000001, 111, 1800, 1161.5, 1800.0, 1800.0, 1800.0, 0.0532102403107478, 39.791555638788935, 0.08809698356136138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6022427-0fd3-4b71-949a-83bdd45abad3", 1, 0, 0.0, 668.0, 668, 668, 668.0, 668.0, 668.0, 668.0, 1.4970059880239521, 0.27045518338323354, 1.0321154565868262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1cb46e8b-f8e4-4552-a41c-bb0acd5b0483", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1237.4545454545455, 225, 2254, 1204.0, 2064.0, 2228.6499999999996, 2254.0, 0.08795145079915886, 0.027531677514012264, 0.039681220966026755], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 508.375, 223, 1613, 343.0, 1333.7000000000003, 1613.0, 1613.0, 0.0943240502747188, 21.277091221304858, 0.20761193243450377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86441a37-ece3-4bc5-85b4-4d14a43a470d", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 116.93333333333332, 112, 121, 118.0, 121.0, 121.0, 121.0, 0.1038091019820618, 0.08059398054271398, 0.03690089172018602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 380.55555555555554, 225, 1345, 237.5, 740.200000000001, 1345.0, 1345.0, 0.09239202964757574, 6.275956185325579, 0.20647854195111434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 132.08333333333334, 109, 328, 115.0, 266.8000000000002, 328.0, 328.0, 0.058977333044999705, 0.04382983442113748, 0.02960385662610337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 146.33333333333334, 103, 328, 113.0, 327.1, 328.0, 328.0, 0.05898081157596729, 0.01578197497247562, 0.033637494101918845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57ebfcd9-aac0-4fd7-aa3d-b7036cb54373", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.8287342316513762, 3.162629013761468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 132.25, 107, 341, 114.0, 275.0000000000002, 341.0, 341.0, 0.05898081157596729, 0.015897171870084933, 0.034674266180402646], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84d234be-9d67-41c1-9c96-4babe09d89a4", 1, 0, 0.0, 796.0, 796, 796, 796.0, 796.0, 796.0, 796.0, 1.256281407035176, 0.22696490263819094, 0.8661471419597989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 158.41666666666666, 108, 452, 111.0, 418.4000000000001, 452.0, 452.0, 0.05898197117747675, 0.01589748441892928, 0.0347325474804868], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 143.0, 143, 143, 143.0, 143.0, 143.0, 143.0, 6.993006993006993, 2.0623907342657346, 4.3228256118881125], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1287.8363636363633, 858, 1989, 1233.0, 1737.6, 1918.4, 1989.0, 0.24007926980981356, 287.2182717511818, 0.4740627769096123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1237.4545454545455, 225, 2254, 1204.0, 2064.0, 2228.6499999999996, 2254.0, 0.0859270947658682, 0.026897987938960515, 0.03876788845881944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 156.8, 109, 339, 111.0, 339.0, 339.0, 339.0, 0.030864769100662357, 0.008319019796662901, 0.018175249773143946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 113.0, 110, 115, 113.0, 115.0, 115.0, 115.0, 0.030864007012302394, 0.008318814390034629, 0.018144660372466835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 256.4, 104, 940, 132.0, 581.8000000000002, 940.0, 940.0, 0.10169905216483383, 6.126182728195723, 0.0592052685193974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 266.40000000000003, 106, 877, 324.0, 556.6000000000001, 877.0, 877.0, 0.10169974168265614, 2.019123894862807, 0.05930498608408535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 196.8, 109, 325, 116.0, 325.0, 325.0, 325.0, 0.03086381649609264, 0.008258482148368539, 0.01760202034542783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 144.66666666666669, 108, 343, 116.0, 341.2, 343.0, 343.0, 0.10185927123086744, 0.07569814981122082, 0.0511285795045565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 159.2, 111, 337, 116.0, 337.0, 337.0, 337.0, 0.0308636259822349, 0.02293673766843824, 0.015492093510614003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 155.39999999999998, 106, 338, 114.0, 329.0, 338.0, 338.0, 0.10186203805565741, 0.03745552024338236, 0.057522872271795075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 123.8, 116, 139, 123.0, 139.0, 139.0, 139.0, 0.02936064264574623, 0.023110037082491663, 0.010436790940480105], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 574.1666666666666, 111, 954, 533.5, 917.1000000000001, 954.0, 954.0, 0.07034492461368912, 0.013218296788167985, 0.04787553747918963], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1726.5, 921, 3511, 1577.5, 2551.5, 3463.499999999999, 3511.0, 0.08915119150567448, 0.04614270654102292, 0.04100606562419207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 362.4, 227, 678, 233.0, 678.0, 678.0, 678.0, 0.0308413520848754, 0.047798072029977795, 0.06936292368307427], "isController": false}, {"data": ["addBook", 63, 12, 19.047619047619047, 1145.3174603174607, 584, 2914, 940.0, 1870.4, 2247.0, 2914.0, 0.2991708693050688, 86.34854459901607, 1.089104021829976], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d3ad59b2-eff6-4e39-b759-6521e1c83b03", 3, 0, 0.0, 327.3333333333333, 206, 557, 219.0, 557.0, 557.0, 557.0, 0.04260939963355916, 0.027393738371184684, 0.02732438713480194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50f167e0-5a3e-45d8-aea0-76ae89732ee4", 3, 0, 0.0, 481.3333333333333, 220, 698, 526.0, 698.0, 698.0, 698.0, 0.07867820613690008, 0.035599839365329136, 0.05045444859690532], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 213.12727272727275, 105, 515, 117.0, 462.8, 473.99999999999983, 515.0, 0.2411455730057261, 0.17921072368882576, 0.11656939320101017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df1fe4ff-2af2-4007-a8a9-ed0bda6739a7", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 734.418181818182, 504, 1028, 677.0, 975.2, 995.1999999999998, 1028.0, 0.2409596326898981, 70.8501326236342, 0.12118575276884525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29e36a22-e111-441a-b7f3-b1b6dccd294c", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 160.1090909090909, 105, 421, 116.0, 325.8, 342.4, 421.0, 0.24156074593958346, 0.42744928871340354, 0.11747778464639898], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1068.8545454545458, 741, 1619, 1056.0, 1404.0, 1464.6, 1619.0, 0.24060650337505304, 216.49815467799195, 0.12077318626443093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 131.50000000000003, 114, 336, 118.5, 150.6000000000003, 336.0, 336.0, 0.09461185486541464, 0.07068170798050996, 0.03363155778419036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 12, 6.629834254143646, 193.3425414364641, 105, 1266, 122.0, 374.00000000000006, 492.2000000000001, 892.0800000000031, 0.727963030739345, 1.4880344533138405, 0.35265815223074415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 118.49999999999999, 114, 131, 118.0, 127.4, 131.0, 131.0, 0.06259454384226175, 0.04847409498722028, 0.02225040425642898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 120.875, 111, 138, 119.5, 132.4, 138.0, 138.0, 0.08548606844228356, 0.06937394812064222, 0.03038762589159298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3ad59b2-eff6-4e39-b759-6521e1c83b03", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6a59837-79de-4dfb-8a14-94daccf25049", 2, 0, 0.0, 383.0, 227, 539, 383.0, 539.0, 539.0, 539.0, 0.030818065550025427, 0.027236669260520516, 0.01915595578378045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 314.1666666666667, 226, 781, 231.5, 682.6000000000004, 781.0, 781.0, 0.05894430745350768, 0.09135216399288738, 0.13256712897014472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 446.6666666666667, 226, 1057, 446.0, 829.0000000000001, 1057.0, 1057.0, 0.10162257376105145, 8.252057327834423, 0.22681814428711766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7fd49088-3097-4ed7-9108-1bc2cbc567be", 1, 0, 0.0, 1028.0, 1028, 1028, 1028.0, 1028.0, 1028.0, 1028.0, 0.9727626459143969, 0.17574325145914396, 0.6706742461089494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84d234be-9d67-41c1-9c96-4babe09d89a4", 2, 0, 0.0, 270.5, 226, 315, 270.5, 315.0, 315.0, 315.0, 0.013519725279182328, 0.026722581997133822, 0.008403618300976124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 122.69230769230771, 116, 136, 120.0, 134.0, 136.0, 136.0, 0.08617832283725554, 0.07145058211799801, 0.030633700696055685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 23, 0, 0.0, 150.82608695652172, 104, 348, 120.0, 335.20000000000005, 346.79999999999995, 348.0, 0.10830562906734725, 0.08408493662943464, 0.0384992665825336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1cb46e8b-f8e4-4552-a41c-bb0acd5b0483", 3, 0, 0.0, 468.3333333333333, 223, 647, 535.0, 647.0, 647.0, 647.0, 0.018801233360908477, 0.025919017995913868, 0.012056780508134668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 127.77777777777779, 109, 341, 115.0, 145.7000000000003, 341.0, 341.0, 0.09254974548819991, 0.06877964484035169, 0.04645563396575659], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47fc28eb-4b5a-48e8-9b6a-7d7d73d386fc", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 170.33333333333331, 106, 465, 115.5, 352.50000000000017, 465.0, 465.0, 0.09244944812815548, 0.032451602071894854, 0.05229372537891434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b853b8b3-5d67-4038-8c7f-632b5838b2fb", 1, 0, 0.0, 621.0, 621, 621, 621.0, 621.0, 621.0, 621.0, 1.6103059581320451, 0.29092441626409016, 1.1102304750402576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 222.16666666666666, 108, 1230, 114.5, 431.7000000000013, 1230.0, 1230.0, 0.09255355251385732, 4.6502184729820755, 0.05396948689338859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 194.77777777777777, 109, 678, 114.0, 376.50000000000045, 678.0, 678.0, 0.09245087263351447, 1.5337354999794552, 0.053999896634788234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6022427-0fd3-4b71-949a-83bdd45abad3", 3, 0, 0.0, 545.3333333333334, 322, 954, 360.0, 954.0, 954.0, 954.0, 0.02610557092883621, 0.026182052093666787, 0.016740877190692494], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 28.0, 0.5303030303030303], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.15151515151515152], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.0, 0.07575757575757576], "isController": false}, {"data": ["401/Unauthorized", 15, 60.0, 1.1363636363636365], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1320, 25, "401/Unauthorized", 15, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
