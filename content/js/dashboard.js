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

    var data = {"OkPercent": 98.61751152073732, "KoPercent": 1.3824884792626728};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.768976897689769, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/aae7a712-6b2d-4b6d-8049-f6bc9389eb36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34e6a5a5-a027-453e-8e1c-ff9b8bf2640c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bad17c97-b0ea-49ec-916e-598396d0778d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c7809820-27d9-467e-b98e-b2c55280f0ee"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d0b9ba9f-9660-4b9a-a74a-5b332de985ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b8b29193-4f29-4037-9cdb-8eba370c2af8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/312225ec-fb39-4a5e-8f57-2b30541b3b41"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9f771461-128d-486d-8852-6e1def4d259e"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7809820-27d9-467e-b98e-b2c55280f0ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=206859c3-eabd-43ae-820d-7399d822d9e6"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aae7a712-6b2d-4b6d-8049-f6bc9389eb36"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7dca64ec-bc2b-418e-b68a-c060fac5f7ca"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b49f00a4-b495-4723-a9ab-8368309453be"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/aa5aee1c-1dcf-4aca-9836-5b6b67104080"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b30f7e34-0e2c-4005-bab5-f729f1f351ae"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bad17c97-b0ea-49ec-916e-598396d0778d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0b9ba9f-9660-4b9a-a74a-5b332de985ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8b29193-4f29-4037-9cdb-8eba370c2af8"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.35454545454545455, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/29b15ab4-244a-45ea-9c68-50c0f0f10635"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4772727272727273, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87d2e149-3eb3-483b-859e-d2197d664916"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2833333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34e6a5a5-a027-453e-8e1c-ff9b8bf2640c"], "isController": false}, {"data": [0.9636363636363636, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9457142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=312225ec-fb39-4a5e-8f57-2b30541b3b41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/206859c3-eabd-43ae-820d-7399d822d9e6"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b49f00a4-b495-4723-a9ab-8368309453be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b30f7e34-0e2c-4005-bab5-f729f1f351ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0086206f-9014-4512-9b71-e98ae2077792"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7dca64ec-bc2b-418e-b68a-c060fac5f7ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/310fbbb8-f506-4c62-9963-d37be6906846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aa5aee1c-1dcf-4aca-9836-5b6b67104080"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1302, 18, 1.3824884792626728, 425.8394777265748, 137, 2296, 157.0, 1142.0, 1316.0999999999995, 1772.7900000000002, 5.151416837457368, 732.3048788358668, 3.7573387659943185], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2118.618181818182, 1679, 2728, 2060.0, 2543.4, 2658.7999999999997, 2728.0, 0.25588417286604226, 307.9152253190992, 1.2581804788872295], "isController": true}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 508.076923076923, 151, 833, 473.0, 781.8, 833.0, 833.0, 0.08782774951525839, 0.016639241607382935, 0.05937213926440882], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 508.076923076923, 151, 833, 473.0, 781.8, 833.0, 833.0, 0.08618346470787121, 0.016327726712233412, 0.05826059186494388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 211.3529411764706, 137, 430, 145.0, 429.2, 430.0, 430.0, 0.0866453960713958, 0.03849468596140712, 0.0485588513368875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aae7a712-6b2d-4b6d-8049-f6bc9389eb36", 3, 0, 0.0, 1050.6666666666667, 424, 2296, 432.0, 2296.0, 2296.0, 2296.0, 0.02993504096111438, 0.024955611947074848, 0.01919662457467296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 146.41176470588238, 137, 157, 147.0, 153.8, 157.0, 157.0, 0.08664495446043129, 0.06439141635194161, 0.043491705656896175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 298.4117647058824, 141, 1031, 147.0, 1003.0, 1031.0, 1031.0, 0.08664672093129934, 3.017902104495945, 0.0501473870279665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 279.52941176470586, 138, 1289, 148.0, 1277.8, 1289.0, 1289.0, 0.08664318806158802, 9.192569502489718, 0.05006072986692626], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 288.35714285714283, 154, 432, 242.5, 430.0, 432.0, 432.0, 0.08116365491532891, 0.16317087739360314, 0.052465373193384], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/34e6a5a5-a027-453e-8e1c-ff9b8bf2640c", 3, 0, 0.0, 358.3333333333333, 246, 422, 407.0, 422.0, 422.0, 422.0, 0.0774453364999871, 0.035041997960606135, 0.04966383883625474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 163.33333333333331, 138, 428, 144.0, 262.4000000000001, 428.0, 428.0, 0.08788890841975742, 0.06531587822991738, 0.04411611223413606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 217.8, 138, 448, 143.0, 436.6, 448.0, 448.0, 0.08788787850379676, 0.023516873740273742, 0.05012355570919659], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 751.8, 707, 855, 739.0, 855.0, 855.0, 855.0, 0.043365886658918634, 12.751010560677548, 0.02473210723516453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1210.8, 993, 1283, 1269.0, 1283.0, 1283.0, 1283.0, 0.04316223822102519, 38.83745782240034, 0.024573813362165707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 313.6, 142, 441, 414.0, 441.0, 441.0, 441.0, 0.043488471206283213, 0.07695420881424335, 0.024080042162072834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bad17c97-b0ea-49ec-916e-598396d0778d", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7809820-27d9-467e-b98e-b2c55280f0ee", 3, 0, 0.0, 307.6666666666667, 225, 472, 226.0, 472.0, 472.0, 472.0, 0.05108295872496935, 0.03284142040423648, 0.032758277567770056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0b9ba9f-9660-4b9a-a74a-5b332de985ea", 3, 0, 0.0, 545.6666666666666, 226, 958, 453.0, 958.0, 958.0, 958.0, 0.03958984916267469, 0.03300442828958655, 0.025388021761220424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 146.57142857142858, 141, 153, 145.0, 152.0, 153.0, 153.0, 0.0855646349140381, 0.06358856168904589, 0.04294943588458553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 228.0, 141, 444, 144.5, 443.0, 444.0, 444.0, 0.08556620379424995, 0.03207538917343047, 0.04828617387663798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 225.78571428571428, 138, 992, 146.0, 717.5, 992.0, 992.0, 0.08557038775609994, 5.521158281150677, 0.049780764082440955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 245.14285714285714, 139, 997, 148.0, 712.0, 997.0, 997.0, 0.08556568082778684, 1.8184975239431111, 0.04986158605157166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8b29193-4f29-4037-9cdb-8eba370c2af8", 3, 0, 0.0, 649.3333333333333, 237, 1458, 253.0, 1458.0, 1458.0, 1458.0, 0.03184442934782609, 0.026070553323496944, 0.020421069601307743], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 145.4, 142, 149, 144.0, 149.0, 149.0, 149.0, 0.043591599027035514, 0.03239570982380276, 0.024477704531782635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 783.5882352941177, 139, 1382, 997.0, 1337.2, 1382.0, 1382.0, 0.08618198593712771, 45.6252720911045, 0.0463089554489828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 144.4, 140, 149, 144.0, 149.0, 149.0, 149.0, 0.0878853038194953, 0.023687835795098346, 0.051666946190757984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 595.8235294117648, 144, 1038, 710.0, 1010.0, 1038.0, 1038.0, 0.08618023836440046, 14.91535959971814, 0.046392176798759004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 213.73333333333335, 139, 598, 148.0, 505.00000000000006, 598.0, 598.0, 0.08788787850379676, 0.02368852975297647, 0.05175428782987251], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/312225ec-fb39-4a5e-8f57-2b30541b3b41", 3, 0, 0.0, 487.0, 258, 775, 428.0, 775.0, 775.0, 775.0, 0.018184352970414056, 0.025068598577377452, 0.011661189893136619], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 455.61538461538464, 160, 722, 440.0, 673.5999999999999, 722.0, 722.0, 0.08634202066895141, 0.016357765634547435, 0.059055295837650436], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9f771461-128d-486d-8852-6e1def4d259e", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 416.9285714285714, 286, 1141, 298.5, 868.0, 1141.0, 1141.0, 0.08548678618533535, 7.428161284179449, 0.19069945746421768], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 561.2727272727274, 148, 1199, 509.5, 1098.9999999999998, 1193.4499999999998, 1199.0, 0.10304884046634286, 0.06329855532551723, 0.04659337220304369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 145.17647058823528, 140, 150, 144.0, 150.0, 150.0, 150.0, 0.08618023836440046, 0.0640460560501062, 0.043258439960255704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 229.82352941176475, 137, 445, 145.0, 442.6, 445.0, 445.0, 0.08618198593712771, 0.0992023572040536, 0.04489305195759846], "isController": false}, {"data": ["login", 22, 0, 0.0, 2440.7272727272734, 1560, 4859, 2098.5, 3439.2, 4666.099999999997, 4859.0, 0.10513337602385571, 28.730406401726576, 0.19824510890861996], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 194.79999999999998, 140, 510, 153.0, 473.40000000000003, 510.0, 510.0, 0.08531307053115918, 0.06906692917024507, 0.03032613054037299], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7809820-27d9-467e-b98e-b2c55280f0ee", 1, 0, 0.0, 722.0, 722, 722, 722.0, 722.0, 722.0, 722.0, 1.3850415512465375, 0.25022723337950137, 0.9549212257617729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=206859c3-eabd-43ae-820d-7399d822d9e6", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 933.3529411764708, 285, 1526, 1149.0, 1482.8, 1526.0, 1526.0, 0.08611693666859163, 60.65836497022634, 0.18071793505516548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aae7a712-6b2d-4b6d-8049-f6bc9389eb36", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7dca64ec-bc2b-418e-b68a-c060fac5f7ca", 3, 0, 0.0, 358.3333333333333, 251, 512, 312.0, 512.0, 512.0, 512.0, 0.03245629219317985, 0.027057475360264843, 0.02081344258481911], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b49f00a4-b495-4723-a9ab-8368309453be", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.3006057612312812, 1.1471765806988352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa5aee1c-1dcf-4aca-9836-5b6b67104080", 3, 0, 0.0, 774.0, 230, 1646, 446.0, 1646.0, 1646.0, 1646.0, 0.04450840467041526, 0.028614615632835332, 0.028542173567942076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 512.6470588235295, 290, 1427, 303.0, 1419.8, 1427.0, 1427.0, 0.08657876375711092, 12.304076753665592, 0.19211155259914542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1013.0, 153, 1433, 1381.0, 1433.0, 1433.0, 1433.0, 0.06035263180583696, 51.577992305039444, 0.10863136935810665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b30f7e34-0e2c-4005-bab5-f729f1f351ae", 3, 0, 0.0, 354.6666666666667, 240, 569, 255.0, 569.0, 569.0, 569.0, 0.024847601378213624, 0.02492039708537636, 0.01593417145673204], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 913.0869565217391, 212, 1982, 898.0, 1544.8000000000009, 1938.7999999999993, 1982.0, 0.09233424998494551, 0.029230815552299325, 0.041658616692426584], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bad17c97-b0ea-49ec-916e-598396d0778d", 3, 0, 0.0, 326.0, 245, 414, 319.0, 414.0, 414.0, 414.0, 0.02688340666529263, 0.02696216664575735, 0.01723968461283414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 151.8421052631579, 146, 166, 151.0, 162.0, 166.0, 166.0, 0.09901454471548952, 0.0768716436023576, 0.03519657644183417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 435.6666666666667, 283, 856, 300.0, 787.6, 856.0, 856.0, 0.0878122457103718, 0.13609183002183597, 0.197491798702135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0b9ba9f-9660-4b9a-a74a-5b332de985ea", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8b29193-4f29-4037-9cdb-8eba370c2af8", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 562.0666666666666, 283, 1462, 571.0, 1436.2, 1462.0, 1462.0, 0.08876107294384974, 14.277767561008444, 0.19659768636866617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 145.5, 140, 152, 144.0, 152.0, 152.0, 152.0, 0.05629877761279108, 0.041839228284505876, 0.028259347356420526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 251.375, 139, 443, 144.0, 443.0, 443.0, 443.0, 0.05630194734360375, 0.025635530223589106, 0.03151864386203208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 362.125, 142, 1317, 147.5, 1317.0, 1317.0, 1317.0, 0.056189640035118525, 6.33319386523266, 0.0324297629499561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 319.375, 142, 708, 280.0, 708.0, 708.0, 708.0, 0.05619635004706444, 2.0787024394484326, 0.03248851487095913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 1.84326171875, 3.863525390625], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1402.3818181818187, 1106, 2111, 1186.0, 1943.0, 2035.6, 2111.0, 0.2556213457766706, 305.8119979073907, 0.5047523058207304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29b15ab4-244a-45ea-9c68-50c0f0f10635", 2, 0, 0.0, 226.0, 225, 227, 226.0, 227.0, 227.0, 227.0, 0.015621948838117555, 0.03070231644210115, 0.009710322690880686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 913.0869565217391, 212, 1982, 898.0, 1544.8000000000009, 1938.7999999999993, 1982.0, 0.09341960430704993, 0.029574412776552494, 0.042148298036969796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 174.3, 139, 426, 147.5, 398.80000000000007, 426.0, 426.0, 0.04882502575520109, 0.013159870223081543, 0.02875145559608033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 174.2, 139, 443, 145.0, 413.8000000000001, 443.0, 443.0, 0.04885173985471492, 0.013167070507716132, 0.02871947987552577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 233.99999999999994, 142, 1270, 145.0, 430.0, 1270.0, 1270.0, 0.09534227878082316, 4.539563635012193, 0.05561959622544936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 249.21052631578948, 140, 960, 149.0, 444.0, 960.0, 960.0, 0.09534658483587842, 1.4998758769376686, 0.05571522013770054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 201.5, 139, 430, 146.5, 429.9, 430.0, 430.0, 0.04882407222056762, 0.013064253699644071, 0.027844978688292474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 162.0526315789474, 140, 430, 148.0, 161.0, 430.0, 430.0, 0.0953437140892919, 0.07085602189643665, 0.0478580752362266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 147.20000000000002, 141, 151, 148.5, 150.9, 151.0, 151.0, 0.04885054663761687, 0.036303970694557076, 0.024520684542710034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 188.78947368421055, 138, 426, 146.0, 425.0, 426.0, 426.0, 0.09534514944097633, 0.033049326060338426, 0.0539550830255525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 208.7, 146, 448, 152.5, 445.7, 448.0, 448.0, 0.045943003110341316, 0.0361621684638038, 0.01633130188687914], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 550.3076923076924, 153, 1458, 472.0, 1184.7999999999997, 1458.0, 1458.0, 0.08554545095613493, 0.016026919672821553, 0.05822128798547043], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1184.9999999999998, 679, 2182, 1160.5, 1409.5, 2069.0499999999984, 2182.0, 0.10729404420514621, 0.05553305022336669, 0.04935106916076549], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87d2e149-3eb3-483b-859e-d2197d664916", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 353.8, 285, 593, 297.0, 591.2, 593.0, 593.0, 0.04878786548209729, 0.07561166261727384, 0.10972505293483405], "isController": false}, {"data": ["addBook", 60, 9, 15.0, 1293.6333333333334, 709, 2360, 1146.5, 2028.7, 2223.7999999999993, 2360.0, 0.27464730708315405, 94.19494741219297, 0.9961150280140254], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 263.38181818181823, 139, 714, 150.0, 594.6, 617.1999999999997, 714.0, 0.25680893881877226, 0.19085117425887274, 0.12414103976102761], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 836.4363636363636, 685, 1178, 736.0, 1034.4, 1056.1999999999996, 1178.0, 0.2563732048049, 75.38223460420639, 0.12893769577590183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34e6a5a5-a027-453e-8e1c-ff9b8bf2640c", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 0.7958769273127753, 3.037238436123348], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 205.8, 138, 579, 148.0, 429.4, 524.1999999999997, 579.0, 0.25739543895282174, 0.45546927283448535, 0.12517864120947778], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1132.8909090909094, 961, 1480, 1029.0, 1329.8, 1421.8, 1480.0, 0.25637798505549414, 230.68936161736053, 0.1286897307798086], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 170.80000000000004, 147, 434, 151.0, 269.6000000000001, 434.0, 434.0, 0.09252976374066992, 0.06912623951329344, 0.03289143945469126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 9, 5.142857142857143, 199.70857142857147, 140, 542, 153.0, 312.6, 408.3999999999997, 501.7200000000005, 0.7534659433393611, 1.6444604443834496, 0.3628577617755963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 153.5, 141, 167, 151.5, 167.0, 167.0, 167.0, 0.060592289631144436, 0.04692352116943119, 0.021538665454820874], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=312225ec-fb39-4a5e-8f57-2b30541b3b41", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 151.1764705882353, 145, 164, 150.0, 158.4, 164.0, 164.0, 0.08297985541980485, 0.06734009751353304, 0.029496745481258756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/206859c3-eabd-43ae-820d-7399d822d9e6", 3, 0, 0.0, 438.6666666666667, 329, 566, 421.0, 566.0, 566.0, 566.0, 0.03123730984287633, 0.02604125993086142, 0.02003173840835494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 581.125, 285, 1460, 567.0, 1460.0, 1460.0, 1460.0, 0.056129715773151755, 8.46994807343521, 0.12444188206445096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 473.4210526315789, 284, 1415, 299.0, 874.0, 1415.0, 1415.0, 0.0952724792907716, 6.138777607081252, 0.21298707271546624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b49f00a4-b495-4723-a9ab-8368309453be", 3, 0, 0.0, 328.3333333333333, 222, 505, 258.0, 505.0, 505.0, 505.0, 0.03660366768750229, 0.0297523952525043, 0.023473055125123536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 192.35714285714286, 146, 446, 151.0, 444.5, 446.0, 446.0, 0.08670394936489358, 0.07188637989335414, 0.030820544500802013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b30f7e34-0e2c-4005-bab5-f729f1f351ae", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0086206f-9014-4512-9b71-e98ae2077792", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 149.88235294117646, 143, 163, 148.0, 158.2, 163.0, 163.0, 0.08089074990483441, 0.06280092399838219, 0.02875413375523411], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7dca64ec-bc2b-418e-b68a-c060fac5f7ca", 1, 0, 0.0, 583.0, 583, 583, 583.0, 583.0, 583.0, 583.0, 1.7152658662092624, 0.3098868996569468, 1.182595411663808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/310fbbb8-f506-4c62-9963-d37be6906846", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 1.0609167358803988, 1.9823245431893688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 145.86666666666667, 139, 153, 144.0, 151.8, 153.0, 153.0, 0.08883992821733801, 0.06602264196620529, 0.04459347959346849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 220.86666666666667, 138, 442, 144.0, 434.8, 442.0, 442.0, 0.08884150675195451, 0.04156348095830372, 0.04967258203032457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 373.73333333333335, 141, 1317, 148.0, 1291.8, 1317.0, 1317.0, 0.08884045438931072, 10.67925884480757, 0.051210506716338346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 296.5333333333333, 138, 1030, 147.0, 988.6, 1030.0, 1030.0, 0.08884413776764297, 3.50383695619984, 0.051299391787840196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aa5aee1c-1dcf-4aca-9836-5b6b67104080", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 27.77777777777778, 0.38402457757296465], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.07680491551459294], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07680491551459294], "isController": false}, {"data": ["401/Unauthorized", 11, 61.111111111111114, 0.8448540706605223], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1302, 18, "401/Unauthorized", 11, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
