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

    var data = {"OkPercent": 98.93373952779893, "KoPercent": 1.0662604722010662};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7358923884514436, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/26a27f2d-c8be-45af-8be1-ce029eea9ba9"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e8fa04f-6d3b-4eb9-8d0b-bb7bc87fdd85"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2b9916c5-b0d9-4df1-8bbe-0214f6303c76"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/647f423c-411c-42c6-91ba-893640708adc"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f57dca96-c0f9-4e39-972f-3bb7ed4c10e0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/9eacbb79-7d04-4b0b-9904-648e5ab77a71"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db3c3f30-4b6e-413a-9b7c-a004e144163f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c388648-7af5-4a81-8c97-9ad2e60cfc00"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a51238b9-32c7-4aa5-b835-a54e7b225044"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b8219d99-0c30-4d6e-9724-f1f59093ba67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e201b72-e6eb-4121-9ecc-829e29424801"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/628e66bd-c37a-43ab-81e5-2b3864e7a08a"], "isController": false}, {"data": [0.45, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e2df9be9-1222-40d3-a777-14c346245854"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/82672a24-abc8-447c-b218-895b43e228d6"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2af6ee61-5e37-401e-a06b-93b443da5e5b"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "register"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b9916c5-b0d9-4df1-8bbe-0214f6303c76"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2df9be9-1222-40d3-a777-14c346245854"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.22321428571428573, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=647f423c-411c-42c6-91ba-893640708adc"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.225, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8219d99-0c30-4d6e-9724-f1f59093ba67"], "isController": false}, {"data": [0.29838709677419356, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f57dca96-c0f9-4e39-972f-3bb7ed4c10e0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26a27f2d-c8be-45af-8be1-ce029eea9ba9"], "isController": false}, {"data": [0.33035714285714285, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9472222222222222, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/23c1cc98-c89a-4610-9803-70eee472d5b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd64adb0-21db-4715-b666-d2cf2eee01da"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a51238b9-32c7-4aa5-b835-a54e7b225044"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/db3c3f30-4b6e-413a-9b7c-a004e144163f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0e201b72-e6eb-4121-9ecc-829e29424801"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c388648-7af5-4a81-8c97-9ad2e60cfc00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=628e66bd-c37a-43ab-81e5-2b3864e7a08a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1313, 14, 1.0662604722010662, 485.4676313785221, 140, 3757, 157.0, 1366.600000000005, 1710.1999999999998, 2229.319999999999, 5.080247009115813, 688.3772822480094, 3.7123370587188336], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/26a27f2d-c8be-45af-8be1-ce029eea9ba9", 3, 0, 0.0, 632.0, 258, 1037, 601.0, 1037.0, 1037.0, 1037.0, 0.027582909629193752, 0.02766371893474803, 0.01768825910465875], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2350.2142857142862, 1705, 2946, 2318.0, 2772.7000000000003, 2902.8, 2946.0, 0.24391412480563093, 293.5100237884328, 1.1993238460901872], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3e8fa04f-6d3b-4eb9-8d0b-bb7bc87fdd85", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.2050412735849056, 2.2516214622641506], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 608.9999999999999, 148, 960, 540.0, 949.2, 960.0, 960.0, 0.0664170068409517, 0.012582909499164678, 0.04489833567921608], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 608.9999999999999, 148, 960, 540.0, 949.2, 960.0, 960.0, 0.0663566619536422, 0.012571476971686122, 0.04485754213648034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b9916c5-b0d9-4df1-8bbe-0214f6303c76", 3, 0, 0.0, 406.6666666666667, 344, 512, 364.0, 512.0, 512.0, 512.0, 0.017260028076312335, 0.0237943420908798, 0.011068442483833107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 224.9, 143, 578, 145.0, 435.3, 570.8999999999999, 578.0, 0.13068051880165962, 0.034967248194975334, 0.07452873337907152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 189.29999999999998, 142, 431, 147.0, 428.8, 430.9, 431.0, 0.13067795724217238, 0.09711516158329413, 0.06559420900632482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 224.0, 142, 564, 145.0, 433.9, 557.4999999999999, 564.0, 0.1306813726771386, 0.03522271372938501, 0.07695397238702595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 188.59999999999997, 141, 432, 144.5, 430.3, 431.95, 432.0, 0.13068308046157265, 0.03522317403065825, 0.07682735784947922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/647f423c-411c-42c6-91ba-893640708adc", 3, 0, 0.0, 585.3333333333334, 263, 889, 604.0, 889.0, 889.0, 889.0, 0.06290626965820927, 0.02846344883623401, 0.04034028360243238], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 315.0714285714286, 144, 677, 275.5, 573.0, 677.0, 677.0, 0.07008094348973064, 0.16829007816528088, 0.04530134649269907], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 171.18749999999997, 143, 571, 144.0, 276.3000000000003, 571.0, 571.0, 0.09690274598156426, 0.07201463837106484, 0.04864063616652737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 163.81250000000003, 140, 434, 145.0, 235.9000000000002, 434.0, 434.0, 0.09690274598156426, 0.0441219778456097, 0.05424755774798018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 1198.6666666666667, 1142, 1302, 1152.0, 1302.0, 1302.0, 1302.0, 0.02609557940884814, 7.672966800986413, 0.014882635131608705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1486.0, 1172, 1703, 1583.0, 1703.0, 1703.0, 1703.0, 0.025968629895086737, 23.36661882758128, 0.014784874246909732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 247.0, 142, 445, 154.0, 445.0, 445.0, 445.0, 0.02632433333625826, 0.04658173047392575, 0.014576071290682065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 145.81818181818184, 143, 148, 146.0, 147.8, 148.0, 148.0, 0.05773581142434247, 0.042907180169848264, 0.028980670968859402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 222.45454545454544, 143, 434, 145.0, 433.4, 434.0, 434.0, 0.05764927230895817, 0.01542568419204545, 0.03287810061370271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 195.54545454545453, 143, 429, 144.0, 428.2, 429.0, 429.0, 0.057736417507781294, 0.015561768781394179, 0.03394269857391049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 221.09090909090907, 142, 427, 144.0, 427.0, 427.0, 427.0, 0.05765078300245278, 0.01553868760612985, 0.03394865444382717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 143.33333333333334, 142, 145, 143.0, 145.0, 145.0, 145.0, 0.026323871364015268, 0.019562955183609003, 0.014781470736629667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 912.4, 140, 1887, 843.5, 1830.2000000000003, 1884.8, 1887.0, 0.08643640009680877, 38.899461028528336, 0.04710108520900322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 340.6875, 142, 1559, 146.5, 1554.1, 1559.0, 1559.0, 0.09690157222800941, 10.921878879848105, 0.05592659100268901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 641.3500000000001, 142, 1297, 640.0, 1151.3, 1289.75, 1297.0, 0.08643789437289308, 12.719454333779929, 0.04718631147895237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 295.74999999999994, 141, 1132, 148.0, 838.7000000000003, 1132.0, 1132.0, 0.09690274598156426, 3.584431627542183, 0.05602190002059183], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 747.75, 147, 1901, 540.0, 1885.1000000000001, 1901.0, 1901.0, 0.06974068090151454, 0.01326366953668941, 0.04766861807387863], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f57dca96-c0f9-4e39-972f-3bb7ed4c10e0", 3, 0, 0.0, 376.3333333333333, 294, 462, 373.0, 462.0, 462.0, 462.0, 0.02407839926801666, 0.02845985278065381, 0.01544090057226329], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9eacbb79-7d04-4b0b-9904-648e5ab77a71", 2, 0, 0.0, 510.0, 469, 551, 510.0, 551.0, 551.0, 551.0, 0.01273836668662344, 0.02176966963045998, 0.007917939839878731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 446.27272727272725, 288, 580, 571.0, 579.8, 580.0, 580.0, 0.05760519494121652, 0.08927680114424864, 0.12955543354455237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db3c3f30-4b6e-413a-9b7c-a004e144163f", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c388648-7af5-4a81-8c97-9ad2e60cfc00", 3, 0, 0.0, 383.0, 262, 497, 390.0, 497.0, 497.0, 497.0, 0.020166982616060983, 0.02780181359994084, 0.012932602784388066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a51238b9-32c7-4aa5-b835-a54e7b225044", 3, 0, 0.0, 502.0, 290, 677, 539.0, 677.0, 677.0, 677.0, 0.01919950849258259, 0.026468072417346118, 0.012312184808068914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 740.9999999999999, 183, 2755, 555.0, 1267.9000000000003, 2681.1499999999987, 2755.0, 0.08178286648947045, 0.050235764669801675, 0.036977995297485175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 160.65, 143, 428, 145.5, 156.4, 414.4499999999998, 428.0, 0.08643415877954969, 0.06423476057738019, 0.04338589610614115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 187.20000000000002, 142, 433, 144.0, 431.0, 432.9, 433.0, 0.08643677366098633, 0.08804058098477416, 0.045666303272064064], "isController": false}, {"data": ["login", 20, 0, 0.0, 3214.0, 1914, 6518, 2754.5, 4612.5, 6423.149999999999, 6518.0, 0.08168766720444381, 14.773657354698061, 0.14356767057406009], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b8219d99-0c30-4d6e-9724-f1f59093ba67", 3, 0, 0.0, 318.3333333333333, 245, 462, 248.0, 462.0, 462.0, 462.0, 0.06573469477190061, 0.029743237543275344, 0.042154084863490954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 150.93749999999997, 146, 159, 149.5, 159.0, 159.0, 159.0, 0.09802239811796995, 0.07935602347636435, 0.03484389933099713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e201b72-e6eb-4121-9ecc-829e29424801", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/628e66bd-c37a-43ab-81e5-2b3864e7a08a", 3, 0, 0.0, 370.3333333333333, 262, 523, 326.0, 523.0, 523.0, 523.0, 0.03285187091404856, 0.027066434011541955, 0.021067117741105354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 1103.4, 288, 2035, 1274.5, 1977.1000000000004, 2032.75, 2035.0, 0.0863800289373097, 51.737208669855534, 0.18322013950374674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2df9be9-1222-40d3-a777-14c346245854", 3, 0, 0.0, 571.6666666666666, 288, 915, 512.0, 915.0, 915.0, 915.0, 0.019709093775868186, 0.027170576868750577, 0.012638969641425888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82672a24-abc8-447c-b218-895b43e228d6", 2, 0, 0.0, 292.0, 288, 296, 292.0, 296.0, 296.0, 296.0, 0.01994515083520319, 0.028427683246073296, 0.012397547369733234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 479.75, 287, 1006, 311.5, 863.7, 998.8999999999999, 1006.0, 0.13055341593012781, 0.20233229597764926, 0.2936176922725433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 1061.4, 143, 1847, 1445.0, 1847.0, 1847.0, 1847.0, 0.04209143944304607, 30.218102054904072, 0.06810263366136594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2af6ee61-5e37-401e-a06b-93b443da5e5b", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 1.2282151442307692, 2.294921875], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1476.6818181818182, 309, 3508, 1336.5, 2554.9, 3371.649999999998, 3508.0, 0.0899659356252837, 0.028593576841132427, 0.04059009986218854], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b9916c5-b0d9-4df1-8bbe-0214f6303c76", 1, 0, 0.0, 1848.0, 1848, 1848, 1848.0, 1848.0, 1848.0, 1848.0, 0.5411255411255411, 0.09776193858225107, 0.3730806953463203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 566.8125, 288, 1705, 297.0, 1699.4, 1705.0, 1705.0, 0.09681655078935744, 14.60957260409292, 0.21464626409134643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 150.99999999999997, 144, 164, 149.0, 163.2, 164.0, 164.0, 0.09105858280706829, 0.07069489583165946, 0.03236848060720005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2df9be9-1222-40d3-a777-14c346245854", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 386.2777777777778, 287, 581, 295.0, 578.3, 581.0, 581.0, 0.0870481956843439, 0.13490770171001343, 0.19577343228617577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 176.77777777777777, 142, 426, 144.0, 426.0, 426.0, 426.0, 0.07777595340356214, 0.05780029349620194, 0.0390398828607724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 145.33333333333334, 143, 150, 145.0, 150.0, 150.0, 150.0, 0.07777595340356214, 0.03379068114451636, 0.04363082455473267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 300.44444444444446, 141, 1555, 143.0, 1555.0, 1555.0, 1555.0, 0.07683901372857047, 7.700618193877638, 0.044439229945017415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 253.11111111111111, 141, 1127, 145.0, 1127.0, 1127.0, 1127.0, 0.07712082262210797, 2.5380415863324766, 0.04467752517137961], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 147.0, 147, 147, 147.0, 147.0, 147.0, 147.0, 6.802721088435374, 2.0062712585034013, 4.205197704081633], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1642.8928571428569, 1126, 2350, 1566.5, 2168.3, 2304.8, 2350.0, 0.240108391788293, 287.2531117618811, 0.47412028144133633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1476.6818181818182, 309, 3508, 1336.5, 2554.9, 3371.649999999998, 3508.0, 0.08766372196255165, 0.027861871859546777, 0.03955140580732311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 288.57142857142856, 144, 581, 153.0, 581.0, 581.0, 581.0, 0.04383712628849839, 0.011815475444946833, 0.025814245265590362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 226.7142857142857, 144, 427, 148.0, 427.0, 427.0, 427.0, 0.043915231056851405, 0.01183652712079198, 0.02581735263303178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=647f423c-411c-42c6-91ba-893640708adc", 1, 0, 0.0, 1171.0, 1171, 1171, 1171.0, 1171.0, 1171.0, 1171.0, 0.8539709649871904, 0.15428186379163109, 0.588772950469684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 377.2352941176471, 140, 1567, 146.0, 1557.4, 1567.0, 1567.0, 0.08683127151627831, 9.21252456494979, 0.05016940078761071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 278.41176470588243, 143, 856, 147.0, 841.6, 856.0, 856.0, 0.0868308280085605, 3.0243145472283093, 0.050253940268051876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 179.70588235294122, 141, 443, 145.0, 429.4, 443.0, 443.0, 0.08682949751259028, 0.06452856211629024, 0.043584337618624416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 184.0, 142, 423, 144.0, 423.0, 423.0, 423.0, 0.04383904806638484, 0.011730370283388131, 0.025001957100360104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 219.8823529411765, 140, 580, 145.0, 463.1999999999999, 580.0, 580.0, 0.08683038450537327, 0.03857687234401177, 0.048662524772197936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 186.42857142857142, 143, 432, 147.0, 432.0, 432.0, 432.0, 0.04391550656536823, 0.03263642626586448, 0.022043525756444603], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 515.5, 143, 889, 515.0, 802.6000000000004, 889.0, 889.0, 0.07099835520477109, 0.013341080905584021, 0.04832025102355962], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 237.57142857142858, 148, 435, 168.0, 435.0, 435.0, 435.0, 0.043585736256483376, 0.03430674162375547, 0.015493367184921825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1744.75, 1187, 3757, 1535.5, 2609.9000000000005, 3701.149999999999, 3757.0, 0.08303096224582147, 0.04297500975613806, 0.03819099923611515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 477.57142857142856, 288, 860, 301.0, 860.0, 860.0, 860.0, 0.0437973558910572, 0.0678773474600662, 0.09850127989951635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8219d99-0c30-4d6e-9724-f1f59093ba67", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 0.6545799365942029, 2.4980185688405796], "isController": false}, {"data": ["addBook", 62, 6, 9.67741935483871, 1488.0806451612907, 744, 3638, 1211.0, 2522.5000000000005, 2958.2999999999997, 3638.0, 0.28137948562014675, 82.47022291665722, 1.0253855281878708], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 280.62499999999994, 143, 582, 147.5, 578.3, 581.15, 582.0, 0.24172731432320668, 0.17964305292964872, 0.11685060604490949], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f57dca96-c0f9-4e39-972f-3bb7ed4c10e0", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 913.4285714285712, 704, 1295, 853.0, 1153.9, 1275.0, 1295.0, 0.2411828295052737, 70.9157598981864, 0.12129800507345309], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 226.67857142857144, 142, 574, 149.0, 435.0, 438.0, 574.0, 0.24221767583489404, 0.42861174669221486, 0.11779726813064183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26a27f2d-c8be-45af-8be1-ce029eea9ba9", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1360.625, 978, 1987, 1299.5, 1721.8, 1732.8, 1987.0, 0.24075252360234561, 216.62954393518598, 0.12084648157383364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 164.16666666666669, 144, 436, 148.0, 181.3000000000004, 436.0, 436.0, 0.08434864104967198, 0.06301436562792877, 0.029983305998125584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 6, 3.3333333333333335, 235.7166666666666, 143, 2043, 151.0, 391.8, 458.84999999999997, 1426.5899999999983, 0.7207553516084857, 1.4620908649764954, 0.3492370942247475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 183.55555555555554, 146, 441, 150.0, 441.0, 441.0, 441.0, 0.08111542725298099, 0.06281692755040422, 0.028833999531333088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23c1cc98-c89a-4610-9803-70eee472d5b1", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.9364690249266862, 1.7497938049853372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 165.4, 146, 439, 149.0, 164.3, 425.2999999999998, 439.0, 0.13081984798733665, 0.10616337273191088, 0.04650236783924857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd64adb0-21db-4715-b666-d2cf2eee01da", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.730745852402746, 1.365399742562929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 479.77777777777777, 287, 1981, 290.0, 1981.0, 1981.0, 1981.0, 0.07674466198239989, 10.307201154154443, 0.17041878336261], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a51238b9-32c7-4aa5-b835-a54e7b225044", 1, 0, 0.0, 1901.0, 1901, 1901, 1901.0, 1901.0, 1901.0, 1901.0, 0.5260389268805892, 0.09503632956338769, 0.3626791820094687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 585.5294117647059, 288, 2011, 299.0, 1762.1999999999998, 2011.0, 2011.0, 0.08676479594961517, 12.330514580632567, 0.19252434358604006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db3c3f30-4b6e-413a-9b7c-a004e144163f", 3, 0, 0.0, 386.6666666666667, 236, 518, 406.0, 518.0, 518.0, 518.0, 0.027431581064893976, 0.027511947025045034, 0.017591215721953494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e201b72-e6eb-4121-9ecc-829e29424801", 3, 0, 0.0, 1117.0, 242, 2581, 528.0, 2581.0, 2581.0, 2581.0, 0.03208178716942391, 0.020625497936071692, 0.020573281485600625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 148.45454545454544, 144, 153, 149.0, 153.0, 153.0, 153.0, 0.059684971866674624, 0.04948490343242848, 0.021216142343231995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 152.0, 145, 175, 149.0, 166.3, 174.6, 175.0, 0.08573241199567908, 0.06655983157867663, 0.030475193326589052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c388648-7af5-4a81-8c97-9ad2e60cfc00", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 145.49999999999997, 142, 148, 145.5, 148.0, 148.0, 148.0, 0.08711138642611019, 0.0647380518264354, 0.04372583263966859], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=628e66bd-c37a-43ab-81e5-2b3864e7a08a", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 175.72222222222226, 142, 430, 144.0, 422.8, 430.0, 430.0, 0.08711138642611019, 0.023309101446049012, 0.04968071257114096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 208.16666666666666, 141, 435, 145.5, 428.7, 435.0, 435.0, 0.08711349436424087, 0.023479809027861797, 0.05121320664772754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 223.16666666666663, 141, 434, 145.0, 430.4, 434.0, 434.0, 0.08711433756805809, 0.023480036297640654, 0.05129877495462795], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 28.571428571428573, 0.30464584920030463], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.142857142857143, 0.07616146230007616], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.142857142857143, 0.07616146230007616], "isController": false}, {"data": ["401/Unauthorized", 8, 57.142857142857146, 0.6092916984006093], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1313, 14, "401/Unauthorized", 8, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
