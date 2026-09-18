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

    var data = {"OkPercent": 97.82958199356914, "KoPercent": 2.170418006430868};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7508591065292096, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.09433962264150944, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/70abc65d-6265-4310-9412-4d34d519dacd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d68e7b80-0169-49ec-bd0c-5435064ff100"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b870d925-466c-4ab9-9cbc-60956078acb6"], "isController": false}, {"data": [0.71875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/db954e50-0296-4a24-8000-c1fb7773d86a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f22b7b05-2274-49f1-a0f4-7813853c42d7"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=336b897d-e6cf-4d7b-b24f-e5bfa8af09e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ddc1ede5-dc86-4d6a-88c3-d948d4632c23"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a62de1e-5002-4b91-b5e0-6db3bd0b8d4c"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d65a387-1b3e-4138-ad40-8589e63fe16c"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/93197425-7a74-4124-bc27-cc0424dbaf54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b870d925-466c-4ab9-9cbc-60956078acb6"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=91f767c7-637c-4b86-b9a2-49af72f840f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/11fc50b1-2b3c-4291-987b-a02e0237046c"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ab1d0c5-4fb8-4246-b093-f6f43234a30d"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/91f767c7-637c-4b86-b9a2-49af72f840f8"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/641bdc0e-eacd-4dbb-ba8a-d8d7d1be0e31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3584905660377358, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d68e7b80-0169-49ec-bd0c-5435064ff100"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70abc65d-6265-4310-9412-4d34d519dacd"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f22b7b05-2274-49f1-a0f4-7813853c42d7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/336b897d-e6cf-4d7b-b24f-e5bfa8af09e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93197425-7a74-4124-bc27-cc0424dbaf54"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "addBook"], "isController": true}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db954e50-0296-4a24-8000-c1fb7773d86a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4716981132075472, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9316770186335404, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ddc1ede5-dc86-4d6a-88c3-d948d4632c23"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/206af27d-e38d-45a5-9ee9-d8d523aa7f4f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11fc50b1-2b3c-4291-987b-a02e0237046c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4d65a387-1b3e-4138-ad40-8589e63fe16c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=641bdc0e-eacd-4dbb-ba8a-d8d7d1be0e31"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1244, 27, 2.170418006430868, 410.19051446945326, 99, 2975, 130.0, 1108.0, 1416.75, 1967.4499999999991, 4.8921678123672745, 699.4737398686115, 3.573587228010807], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 1858.88679245283, 1309, 3293, 1807.0, 2263.8, 2459.7, 3293.0, 0.24166814859399297, 290.80726904590097, 1.1882803986042525], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/70abc65d-6265-4310-9412-4d34d519dacd", 3, 0, 0.0, 431.0, 287, 713, 293.0, 713.0, 713.0, 713.0, 0.06205141994332638, 0.028076651601960823, 0.039792088961052394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d68e7b80-0169-49ec-bd0c-5435064ff100", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 559.5, 116, 1105, 539.5, 989.0, 1105.0, 1105.0, 0.09041182586682339, 0.017809918823096346, 0.06083373830297002], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 559.5, 116, 1105, 539.5, 989.0, 1105.0, 1105.0, 0.0898536028085669, 0.017699956356821492, 0.06045813704599863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 165.8, 106, 352, 112.5, 334.5, 351.15, 352.0, 0.10109894553799803, 0.03464416014578468, 0.05723345578943112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 143.1, 106, 327, 111.5, 320.9, 326.7, 327.0, 0.10120791648322731, 0.07521408637083593, 0.050801629953494964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 179.6, 105, 824, 111.0, 342.8, 799.9499999999996, 824.0, 0.10121355047013694, 1.513923426255807, 0.05916643682756247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 199.9, 106, 1445, 110.5, 340.8, 1389.7999999999993, 1445.0, 0.10109536831570062, 4.574175448800251, 0.058998625102990906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b870d925-466c-4ab9-9cbc-60956078acb6", 3, 0, 0.0, 913.6666666666666, 235, 2000, 506.0, 2000.0, 2000.0, 2000.0, 0.05260481509407494, 0.03381982741236914, 0.033734207596135296], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 241.00000000000003, 111, 671, 225.5, 442.80000000000024, 671.0, 671.0, 0.08934005617256031, 0.14983980734654448, 0.05773513884003104], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/db954e50-0296-4a24-8000-c1fb7773d86a", 3, 0, 0.0, 404.0, 211, 683, 318.0, 683.0, 683.0, 683.0, 0.022048123704672733, 0.022112717817088765, 0.014138933495509532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 126.19999999999999, 108, 311, 113.0, 197.00000000000006, 311.0, 311.0, 0.08636324380343727, 0.06418205911564039, 0.043350300112272214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 182.73333333333335, 109, 332, 114.0, 329.0, 332.0, 332.0, 0.08636374104695885, 0.040404286664286866, 0.04828722709057829], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 783.1428571428572, 649, 890, 862.0, 890.0, 890.0, 890.0, 0.06876835869575895, 20.220180780962956, 0.03921945456867503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1126.7142857142858, 814, 1615, 1073.0, 1615.0, 1615.0, 1615.0, 0.06828202426938235, 61.44028546458601, 0.038875410301806544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 204.14285714285717, 101, 348, 122.0, 348.0, 348.0, 348.0, 0.06930075537823363, 0.12262985229038996, 0.03837258622993991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 168.75, 100, 340, 117.0, 340.0, 340.0, 340.0, 0.04003823651587266, 0.02975497850447177, 0.020097317938631395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 167.125, 107, 342, 111.0, 342.0, 342.0, 342.0, 0.040039238453684615, 0.018230756766631297, 0.02241454437849092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 271.00000000000006, 101, 962, 112.5, 962.0, 962.0, 962.0, 0.0400418437266944, 4.513158633584596, 0.023110087541480848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f22b7b05-2274-49f1-a0f4-7813853c42d7", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.8727732487922706, 3.330691425120773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 226.375, 109, 806, 112.5, 806.0, 806.0, 806.0, 0.04004024044164385, 1.481088102918433, 0.02314826400532535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=336b897d-e6cf-4d7b-b24f-e5bfa8af09e7", 1, 0, 0.0, 816.0, 816, 816, 816.0, 816.0, 816.0, 816.0, 1.2254901960784315, 0.22140203737745098, 0.8449180453431373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 112.85714285714286, 110, 121, 112.0, 121.0, 121.0, 121.0, 0.06929663911300302, 0.05149877184081572, 0.03891168700193041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 1063.9166666666667, 106, 1375, 1254.5, 1368.4, 1375.0, 1375.0, 0.09533797311469158, 71.49201258957797, 0.04922071138017606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ddc1ede5-dc86-4d6a-88c3-d948d4632c23", 3, 0, 0.0, 311.3333333333333, 222, 470, 242.0, 470.0, 470.0, 470.0, 0.016515549389750448, 0.022768018120310273, 0.0105910261386095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 261.4, 108, 1289, 112.0, 1222.4, 1289.0, 1289.0, 0.08636324380343727, 10.381480391945187, 0.049782562541382386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 719.5833333333334, 103, 997, 876.5, 994.6, 997.0, 997.0, 0.09534024550113217, 23.36528100544234, 0.049314990267349944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 205.93333333333334, 107, 844, 111.0, 703.0000000000001, 844.0, 844.0, 0.08636573007830493, 3.406093462114233, 0.04986833724378167], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 483.8571428571429, 118, 1407, 453.5, 1111.5, 1407.0, 1407.0, 0.08974819221498538, 0.017679191881634956, 0.06096316237371147], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9a62de1e-5002-4b91-b5e0-6db3bd0b8d4c", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.7143980704697986, 1.3348538870246085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 445.0, 215, 1085, 230.5, 1085.0, 1085.0, 1085.0, 0.040015205778195714, 6.0382759901887715, 0.08871535245893439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d65a387-1b3e-4138-ad40-8589e63fe16c", 1, 0, 0.0, 1407.0, 1407, 1407, 1407.0, 1407.0, 1407.0, 1407.0, 0.7107320540156361, 0.12840374022743425, 0.4900164356787491], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 739.5909090909091, 234, 1922, 719.5, 1374.1999999999998, 1853.149999999999, 1922.0, 0.09606944947838657, 0.05901140988467299, 0.04343765147313767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 112.24999999999999, 108, 127, 110.5, 123.70000000000002, 127.0, 127.0, 0.09533115660525751, 0.07084668962558688, 0.0478517719678734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 184.33333333333334, 107, 336, 112.5, 335.7, 336.0, 336.0, 0.095333428666762, 0.14483109101164657, 0.04769774735052513], "isController": false}, {"data": ["login", 22, 0, 0.0, 3219.7727272727275, 1755, 4847, 3386.0, 4562.0, 4810.549999999999, 4847.0, 0.09656873718818174, 36.889802005282746, 0.19665249410711227], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/93197425-7a74-4124-bc27-cc0424dbaf54", 3, 0, 0.0, 1065.0, 206, 2399, 590.0, 2399.0, 2399.0, 2399.0, 0.030788177339901475, 0.025666836643062397, 0.019743720494663382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 114.8, 109, 127, 113.0, 122.8, 127.0, 127.0, 0.08988602452090749, 0.07276905696077375, 0.031951672778916335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 1178.3333333333335, 223, 1492, 1366.0, 1488.7, 1492.0, 1492.0, 0.09524565441701723, 94.98036488510994, 0.19390179776172714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b870d925-466c-4ab9-9cbc-60956078acb6", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.33832221441947563, 1.2911107209737827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 390.3, 219, 1556, 225.0, 673.3000000000001, 1511.8999999999994, 1556.0, 0.10103408384818618, 6.192348412565104, 0.2259354966835562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 720.076923076923, 111, 1726, 924.0, 1565.9999999999998, 1726.0, 1726.0, 0.11324633691656358, 72.9658262844748, 0.1718346423811349], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=91f767c7-637c-4b86-b9a2-49af72f840f8", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11fc50b1-2b3c-4291-987b-a02e0237046c", 3, 0, 0.0, 307.0, 203, 491, 227.0, 491.0, 491.0, 491.0, 0.09038322487346348, 0.04189639069655338, 0.05796059667992287], "isController": false}, {"data": ["register", 24, 9, 37.5, 1225.2500000000002, 275, 2975, 1158.5, 2489.0, 2875.25, 2975.0, 0.09724867296081689, 0.03024775618947283, 0.04387586612099356], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 131.93750000000003, 108, 322, 117.5, 193.20000000000013, 322.0, 322.0, 0.08512041879246045, 0.06608470013672467, 0.03025764886763243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 458.99999999999994, 224, 1601, 238.0, 1417.4, 1601.0, 1601.0, 0.08630709214145157, 13.883029571327057, 0.1911623425614794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ab1d0c5-4fb8-4246-b093-f6f43234a30d", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.8919998254189945, 1.6667030377094973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 416.6666666666667, 213, 1957, 431.0, 545.4000000000001, 1818.2999999999981, 1957.0, 0.10696658058403753, 0.16577730799498785, 0.24057034676273284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91f767c7-637c-4b86-b9a2-49af72f840f8", 3, 0, 0.0, 612.0, 308, 1051, 477.0, 1051.0, 1051.0, 1051.0, 0.018465401991801363, 0.02182548002351261, 0.01184141989708616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/641bdc0e-eacd-4dbb-ba8a-d8d7d1be0e31", 3, 0, 0.0, 641.3333333333334, 229, 1075, 620.0, 1075.0, 1075.0, 1075.0, 0.021306515532449825, 0.02518358004502777, 0.013663357942358774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 111.87499999999999, 103, 128, 108.5, 128.0, 128.0, 128.0, 0.046282904252241824, 0.03439579114839456, 0.023231848423488573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 108.625, 99, 114, 109.0, 114.0, 114.0, 114.0, 0.04628531424835543, 0.012384937601610729, 0.0263970932822652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 110.125, 105, 113, 111.0, 113.0, 113.0, 113.0, 0.04628718886330235, 0.012475843873311963, 0.027211804390339864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 109.375, 105, 116, 109.5, 116.0, 116.0, 116.0, 0.04628424310798693, 0.0124750499001996, 0.02725527206456652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 121.0, 118, 124, 121.0, 124.0, 124.0, 124.0, 0.05971218725741924, 0.01761043022630919, 0.03691192825580701], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1266.075471698113, 801, 2031, 1130.0, 1764.8, 1904.4999999999998, 2031.0, 0.2422779613909498, 289.8486712710907, 0.47840433391845744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1225.2500000000002, 275, 2975, 1158.5, 2489.0, 2875.25, 2975.0, 0.09884923021161972, 0.03074558576406336, 0.04459799253688312], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 112.57142857142857, 109, 118, 113.0, 118.0, 118.0, 118.0, 0.036743478032649206, 0.009903515563487482, 0.021637028568054172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 203.85714285714286, 106, 336, 114.0, 336.0, 336.0, 336.0, 0.03674424952494935, 0.009903723504771504, 0.021601599818378423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 182.5, 102, 340, 111.5, 338.6, 340.0, 340.0, 0.08172688916812243, 0.022027950596095497, 0.048046471952353224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 177.25, 100, 460, 110.0, 448.8, 460.0, 460.0, 0.08181381221684751, 0.02205137907407218, 0.04817746949878813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 202.57142857142858, 107, 337, 110.0, 337.0, 337.0, 337.0, 0.036744635283248644, 0.009832060612900517, 0.020955924809977745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 150.75, 106, 526, 112.0, 386.70000000000016, 526.0, 526.0, 0.08181506726732563, 0.06080201776409649, 0.041067328686919306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 208.28571428571428, 107, 340, 115.0, 340.0, 340.0, 340.0, 0.03674251371283101, 0.027305715757289455, 0.01844301957851088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 141.5, 106, 335, 110.5, 313.3, 335.0, 335.0, 0.08171979304462412, 0.021866428998268562, 0.04660581947076219], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 113.85714285714286, 112, 118, 113.0, 118.0, 118.0, 118.0, 0.03863710376270194, 0.030411626594470477, 0.013734282978147957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d68e7b80-0169-49ec-bd0c-5435064ff100", 3, 0, 0.0, 343.0, 230, 496, 303.0, 496.0, 496.0, 496.0, 0.02226080762210053, 0.026311520988231456, 0.014275322596203791], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 595.7857142857142, 114, 1715, 493.5, 1395.0, 1715.0, 1715.0, 0.08667549931278712, 0.016735336362848404, 0.05898480547541512], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70abc65d-6265-4310-9412-4d34d519dacd", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 0.5593314628482972, 2.13452979876161], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1619.727272727273, 868, 2666, 1520.5, 2442.1, 2637.4999999999995, 2666.0, 0.09629778777718444, 0.04984162843936303, 0.04429322074516979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 415.7142857142857, 217, 674, 232.0, 674.0, 674.0, 674.0, 0.03672054094602605, 0.05690966648568686, 0.08258535722529102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f22b7b05-2274-49f1-a0f4-7813853c42d7", 3, 0, 0.0, 595.0, 345, 978, 462.0, 978.0, 978.0, 978.0, 0.07246201782565638, 0.0327871760343953, 0.046468155962416366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/336b897d-e6cf-4d7b-b24f-e5bfa8af09e7", 3, 0, 0.0, 441.6666666666667, 219, 671, 435.0, 671.0, 671.0, 671.0, 0.02479072496343368, 0.02486335404047499, 0.01589769797459777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93197425-7a74-4124-bc27-cc0424dbaf54", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["addBook", 54, 8, 14.814814814814815, 1206.8518518518522, 550, 2908, 941.5, 2077.0, 2363.25, 2908.0, 0.24815150108681164, 77.97392628521798, 0.9015148012030753], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 210.6981132075472, 108, 727, 115.0, 450.8, 458.6, 727.0, 0.24319958885503468, 0.1807371944518373, 0.11756230125316619], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db954e50-0296-4a24-8000-c1fb7773d86a", 1, 0, 0.0, 547.0, 547, 547, 547.0, 547.0, 547.0, 547.0, 1.8281535648994516, 0.3302816499085923, 1.2604261882998171], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 690.7735849056603, 528, 1004, 652.0, 918.2, 969.3999999999999, 1004.0, 0.2434475852755551, 71.58167329161806, 0.12243701798526453], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 169.47169811320762, 107, 446, 115.0, 334.2, 336.9, 446.0, 0.24391254124653114, 0.4316108640026508, 0.11862152884841067], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1052.1509433962262, 689, 1644, 998.0, 1372.8, 1545.1, 1644.0, 0.24311592042311345, 218.75613254892136, 0.12203279599363312], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 126.33333333333334, 110, 327, 116.0, 128.4, 307.1999999999997, 327.0, 0.1092742627889914, 0.08163555764997893, 0.038843585600774284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 8, 4.968944099378882, 196.6024844720496, 103, 1897, 118.0, 329.20000000000005, 439.80000000000007, 1707.8999999999987, 0.6592578640045206, 1.4778678356891906, 0.31540120805932503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 143.0, 113, 329, 117.0, 329.0, 329.0, 329.0, 0.04746732171570635, 0.03675936144585462, 0.01687314951612999], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ddc1ede5-dc86-4d6a-88c3-d948d4632c23", 1, 0, 0.0, 657.0, 657, 657, 657.0, 657.0, 657.0, 657.0, 1.5220700152207, 0.2749833523592085, 1.0493959284627092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 115.84999999999998, 111, 124, 116.0, 122.7, 123.95, 124.0, 0.10103918804908484, 0.08199566920780224, 0.03591627387682313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/206af27d-e38d-45a5-9ee9-d8d523aa7f4f", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.5496315619621343, 1.0269874139414803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 225.75, 214, 242, 224.0, 242.0, 242.0, 242.0, 0.04625159712546324, 0.07168094202940445, 0.10402092595697444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 373.875, 218, 867, 231.0, 723.5000000000001, 867.0, 867.0, 0.08167474055508196, 0.12657989576261236, 0.18368840576011108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11fc50b1-2b3c-4291-987b-a02e0237046c", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 0.8856081495098039, 3.379672181372549], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 118.375, 114, 123, 118.0, 123.0, 123.0, 123.0, 0.04219409282700422, 0.03498318829113924, 0.014998681434599157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 117.16666666666667, 110, 130, 116.0, 127.60000000000001, 130.0, 130.0, 0.09584817648844231, 0.07441337920733558, 0.03407103148612598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d65a387-1b3e-4138-ad40-8589e63fe16c", 3, 0, 0.0, 728.3333333333333, 213, 1715, 257.0, 1715.0, 1715.0, 1715.0, 0.029551409602238028, 0.024020139901298292, 0.018950610975393526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=641bdc0e-eacd-4dbb-ba8a-d8d7d1be0e31", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 183.42857142857144, 107, 1622, 111.0, 124.0, 1472.3999999999978, 1622.0, 0.10702927505504363, 0.07954031085633613, 0.0537236790803637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 162.04761904761904, 103, 336, 111.0, 330.0, 335.4, 336.0, 0.10703036604385187, 0.028638984664077553, 0.061040755634384276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 200.99999999999997, 105, 459, 116.0, 336.4, 446.79999999999984, 459.0, 0.10703091154659668, 0.028848175377793633, 0.06292246948344843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 184.33333333333334, 103, 440, 113.0, 336.0, 429.79999999999984, 440.0, 0.10703145705490204, 0.028848322409329063, 0.06302731308994719], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 33.333333333333336, 0.7234726688102894], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 14.814814814814815, 0.3215434083601286], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.407407407407407, 0.1607717041800643], "isController": false}, {"data": ["401/Unauthorized", 12, 44.44444444444444, 0.9646302250803859], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1244, 27, "401/Unauthorized", 12, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
