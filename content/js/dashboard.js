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

    var data = {"OkPercent": 98.06985294117646, "KoPercent": 1.9301470588235294};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7215686274509804, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.031914893617021274, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d1746432-b213-4199-834b-7f405d6993bc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c093e329-3a28-4b0d-a889-bc8c98f82865"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6ec26cb7-10a0-4de9-95e3-32e0861c68e0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0bd3ff22-e8de-45eb-aa32-c6b012fd7d54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e595652-22b0-43f5-a681-fb67e629320c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4411294d-960b-43c5-a5af-354844cd13b3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/56a0e462-5413-4fc8-8784-cd1b992b3134"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b989bf92-ac89-41d2-afea-b16f74b80d86"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b989bf92-ac89-41d2-afea-b16f74b80d86"], "isController": false}, {"data": [0.5952380952380952, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dd2e9f95-665d-40f9-8a3b-9259357da307"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a715195c-3119-4f6d-a55a-db2afc32d04f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e41f9e02-962a-4340-8d67-52692a3eb8ee"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1447e00c-d9da-4b17-9a33-0388d68846e6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f68b16a2-00f8-4e20-98b6-64696a0a522e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0dc479cc-5047-46ee-b35c-8ef8e62d0270"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cb2e7255-da0a-4d1c-b042-8c74f9058b57"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1746432-b213-4199-834b-7f405d6993bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3404255319148936, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0bd3ff22-e8de-45eb-aa32-c6b012fd7d54"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ec26cb7-10a0-4de9-95e3-32e0861c68e0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.16304347826086957, 500, 1500, "addBook"], "isController": true}, {"data": [0.9893617021276596, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4787234042553192, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8489208633093526, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5e595652-22b0-43f5-a681-fb67e629320c"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd2e9f95-665d-40f9-8a3b-9259357da307"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0dc479cc-5047-46ee-b35c-8ef8e62d0270"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a715195c-3119-4f6d-a55a-db2afc32d04f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8de53184-63f6-4eaa-9cfb-54f5f39c0061"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/e41f9e02-962a-4340-8d67-52692a3eb8ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb2e7255-da0a-4d1c-b042-8c74f9058b57"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1447e00c-d9da-4b17-9a33-0388d68846e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1088, 21, 1.9301470588235294, 828.7297794117651, 112, 42952, 232.0, 1254.4, 1706.6499999999999, 18022.46999999992, 4.216841787041738, 624.059061310622, 3.0652600959060203], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 47, 0, 0.0, 4682.340425531915, 1370, 28492, 2055.0, 18874.800000000003, 21707.199999999983, 28492.0, 0.20734440346573965, 249.50445945562169, 1.0195108119628897], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d1746432-b213-4199-834b-7f405d6993bc", 3, 0, 0.0, 12317.333333333334, 198, 36431, 323.0, 36431.0, 36431.0, 36431.0, 0.013868663754247277, 0.019119072590897533, 0.008893641795529667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c093e329-3a28-4b0d-a889-bc8c98f82865", 2, 0, 0.0, 959.5, 357, 1562, 959.5, 1562.0, 1562.0, 1562.0, 0.014128085220610051, 0.01985382288325963, 0.0087817639090999], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 1642.4615384615386, 122, 11555, 815.0, 7820.999999999996, 11555.0, 11555.0, 0.06571796880924095, 0.013028073894800698, 0.04418388077243889], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 1642.4615384615386, 122, 11555, 815.0, 7820.999999999996, 11555.0, 11555.0, 0.06587114590458819, 0.013058440057257228, 0.04428686567353247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 206.06666666666666, 113, 346, 117.0, 344.2, 346.0, 346.0, 0.08240988479098106, 0.03855452031953059, 0.046076568397457385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 146.53333333333333, 114, 341, 116.0, 339.8, 341.0, 341.0, 0.08251097395953662, 0.06131919060860094, 0.04141664122578303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 223.06666666666666, 114, 715, 115.0, 694.6, 715.0, 715.0, 0.08251324337556179, 3.2541590112713092, 0.04764387731105843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 310.8, 114, 1240, 116.0, 1235.8, 1240.0, 1240.0, 0.08240988479098106, 9.90625832683211, 0.04750371874605119], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ec26cb7-10a0-4de9-95e3-32e0861c68e0", 3, 0, 0.0, 342.0, 218, 571, 237.0, 571.0, 571.0, 571.0, 0.03880531374096159, 0.03235039338886805, 0.024884917991436963], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 460.21428571428567, 114, 1708, 248.5, 1635.0, 1708.0, 1708.0, 0.06959841713314177, 0.10954856882040626, 0.04498457960070394], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0bd3ff22-e8de-45eb-aa32-c6b012fd7d54", 1, 0, 0.0, 786.0, 786, 786, 786.0, 786.0, 786.0, 786.0, 1.272264631043257, 0.22985249681933842, 0.8771668256997455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e595652-22b0-43f5-a681-fb67e629320c", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 0.7889260371179039, 3.0107123362445414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 129.58823529411762, 113, 345, 116.0, 163.39999999999984, 345.0, 345.0, 0.11759904260544138, 0.0873953822487704, 0.05902920693280944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 155.76470588235293, 113, 348, 116.0, 344.8, 348.0, 348.0, 0.1176014831622347, 0.0522478096723761, 0.06590763268214393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 861.4, 673, 921, 899.0, 921.0, 921.0, 921.0, 0.034465644645417445, 10.134043892860097, 0.019656187961839638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1146.4, 796, 1305, 1246.0, 1305.0, 1305.0, 1305.0, 0.03441535200022026, 30.96699422553413, 0.0195938966954379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 209.6, 115, 351, 118.0, 351.0, 351.0, 351.0, 0.034601597209727206, 0.06122860756252508, 0.01915928282999543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 6, 0, 0.0, 161.66666666666669, 115, 388, 117.0, 388.0, 388.0, 388.0, 0.08099570722751694, 0.0601930988282621, 0.040656048354437216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4411294d-960b-43c5-a5af-354844cd13b3", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 1.1915520055970148, 2.226416744402985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56a0e462-5413-4fc8-8784-cd1b992b3134", 1, 0, 0.0, 6807.0, 6807, 6807, 6807.0, 6807.0, 6807.0, 6807.0, 0.14690759512266782, 0.04691287461436756, 0.08765677794916997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 6, 0, 0.0, 153.83333333333334, 114, 341, 116.5, 341.0, 341.0, 341.0, 0.0807526143658901, 0.021607633140872936, 0.046054225380546696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 6, 0, 0.0, 116.0, 113, 121, 116.0, 121.0, 121.0, 121.0, 0.0810011745170305, 0.021832347819043377, 0.047619831112551136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 6, 0, 0.0, 192.33333333333331, 116, 343, 118.5, 343.0, 343.0, 343.0, 0.0807526143658901, 0.021765353090806315, 0.047552564904913795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 166.0, 114, 343, 116.0, 343.0, 343.0, 343.0, 0.034658200823478855, 0.02575672932291739, 0.019461392063965178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 704.1764705882352, 113, 1366, 1019.0, 1355.6, 1366.0, 1366.0, 0.07738563995648197, 36.873675090985024, 0.041973530128050475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b989bf92-ac89-41d2-afea-b16f74b80d86", 3, 0, 0.0, 977.0, 260, 1408, 1263.0, 1408.0, 1408.0, 1408.0, 0.02267230955259976, 0.02273873233449214, 0.014539208925332527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 289.1176470588236, 114, 1250, 116.0, 1067.6, 1250.0, 1250.0, 0.11760229670367679, 12.477233470824252, 0.06794829390197503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 548.5882352941178, 115, 1028, 676.0, 1020.8, 1028.0, 1028.0, 0.0773057579147454, 12.043578065741725, 0.04200569646803634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 249.2941176470588, 113, 913, 117.0, 905.0, 913.0, 913.0, 0.1176014831622347, 4.096055334956695, 0.06806266905213204], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 1252.6923076923076, 119, 5961, 515.0, 4813.799999999999, 5961.0, 5961.0, 0.06589117818495147, 0.01306241130033706, 0.04470621404495806], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 6, 0, 0.0, 355.3333333333333, 232, 730, 237.5, 730.0, 730.0, 730.0, 0.08062348830959419, 0.12495066010481053, 0.1813241148212846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b989bf92-ac89-41d2-afea-b16f74b80d86", 1, 0, 0.0, 996.0, 996, 996, 996.0, 996.0, 996.0, 996.0, 1.004016064257028, 0.18138962098393574, 0.6922220130522089], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 1913.3809523809523, 160, 22278, 680.0, 5149.600000000003, 20648.199999999975, 22278.0, 0.09233975754217948, 0.056720417474639545, 0.041751277091825294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 142.7058823529412, 114, 347, 116.0, 339.8, 347.0, 347.0, 0.07738387866207827, 0.05750891763851714, 0.038843079719051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 231.76470588235293, 115, 458, 141.0, 375.5999999999999, 458.0, 458.0, 0.07730505484111538, 0.08215438387871292, 0.04065087729868855], "isController": false}, {"data": ["login", 21, 0, 0.0, 4676.047619047619, 1381, 36538, 2742.0, 7826.800000000003, 33741.899999999965, 36538.0, 0.08820564516129031, 25.246203842983448, 0.167908207062752], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dd2e9f95-665d-40f9-8a3b-9259357da307", 3, 0, 0.0, 454.33333333333337, 233, 844, 286.0, 844.0, 844.0, 844.0, 0.06690604161555788, 0.030273241486206207, 0.04290524153081023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 1035.5882352941176, 116, 15697, 119.0, 3240.999999999989, 15697.0, 15697.0, 0.10068763733497593, 0.08151372202216313, 0.03579130858391722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a715195c-3119-4f6d-a55a-db2afc32d04f", 1, 0, 0.0, 1892.0, 1892, 1892, 1892.0, 1892.0, 1892.0, 1892.0, 0.5285412262156448, 0.0954884051268499, 0.36440440010570824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e41f9e02-962a-4340-8d67-52692a3eb8ee", 1, 0, 0.0, 3093.0, 3093, 3093, 3093.0, 3093.0, 3093.0, 3093.0, 0.3233107015842225, 0.05841062479793081, 0.2229075735531846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 875.9411764705883, 232, 1484, 1144.0, 1472.0, 1484.0, 1484.0, 0.07726324496539061, 48.99183892772251, 0.16330115877824086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1447e00c-d9da-4b17-9a33-0388d68846e6", 3, 0, 0.0, 1169.3333333333333, 300, 1708, 1500.0, 1708.0, 1708.0, 1708.0, 0.03897116134060795, 0.025054701708235903, 0.024991272083658093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f68b16a2-00f8-4e20-98b6-64696a0a522e", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.5524843209342561, 1.0323177984429066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0dc479cc-5047-46ee-b35c-8ef8e62d0270", 1, 0, 0.0, 1230.0, 1230, 1230, 1230.0, 1230.0, 1230.0, 1230.0, 0.8130081300813008, 0.14688135162601626, 0.5605309959349594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 488.80000000000007, 232, 1358, 241.0, 1352.6, 1358.0, 1358.0, 0.08235558947385758, 13.247405927612181, 0.1824101243157623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 876.625, 114, 1477, 1188.0, 1477.0, 1477.0, 1477.0, 0.047903331077884824, 35.82295536981372, 0.07931065422477442], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb2e7255-da0a-4d1c-b042-8c74f9058b57", 3, 0, 0.0, 389.0, 326, 514, 327.0, 514.0, 514.0, 514.0, 0.04592492805094605, 0.029525303678586738, 0.02945055607433715], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1398.6190476190482, 486, 3618, 1207.0, 2705.8, 3534.299999999999, 3618.0, 0.10805248263442244, 0.03412818368922048, 0.04875024118857731], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 446.7647058823529, 231, 1365, 240.0, 1184.1999999999998, 1365.0, 1365.0, 0.117504752030413, 16.699100624243993, 0.2607339186970796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 8, 0, 0.0, 2472.0, 117, 18928, 119.5, 18928.0, 18928.0, 18928.0, 0.06533545673567724, 0.05072430478990567, 0.023224713136510273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 381.5625, 232, 1152, 250.5, 827.2000000000003, 1152.0, 1152.0, 0.08381834469246525, 6.389025698508033, 0.18716906487539878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1746432-b213-4199-834b-7f405d6993bc", 1, 0, 0.0, 5961.0, 5961, 5961, 5961.0, 5961.0, 5961.0, 5961.0, 0.16775708773695688, 0.03030767698372756, 0.1156606483811441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 119.55555555555557, 116, 128, 117.0, 128.0, 128.0, 128.0, 0.0537307017229645, 0.039930726573414045, 0.026970293638284914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 141.0, 114, 341, 115.0, 341.0, 341.0, 341.0, 0.05365894375350273, 0.014357959559042725, 0.03060236635941953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 166.77777777777777, 115, 342, 116.0, 342.0, 342.0, 342.0, 0.05365894375350273, 0.014462762183561285, 0.03154558998008657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 140.77777777777777, 114, 340, 116.0, 340.0, 340.0, 340.0, 0.05373166406963624, 0.014482362581269143, 0.031640813900381495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 230.5, 119, 342, 230.5, 342.0, 342.0, 342.0, 0.01347164219318335, 0.003973081974942745, 0.008327685066684628], "isController": false}, {"data": ["https://demoqa.com/books", 47, 0, 0.0, 1314.7872340425529, 902, 2748, 1190.0, 1831.2, 2118.399999999999, 2748.0, 0.21815920051615537, 260.99424822687627, 0.43077920258170527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1398.6190476190482, 486, 3618, 1207.0, 2705.8, 3534.299999999999, 3618.0, 0.1033606993089599, 0.03264629230405765, 0.04663344050853464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 206.2, 115, 346, 116.0, 346.0, 346.0, 346.0, 0.03251588400933856, 0.008764046861892034, 0.019147537165655426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 206.0, 114, 345, 116.0, 345.0, 345.0, 345.0, 0.032468164964252554, 0.008751185088021194, 0.019087729793437532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0bd3ff22-e8de-45eb-aa32-c6b012fd7d54", 3, 0, 0.0, 857.0, 214, 1756, 601.0, 1756.0, 1756.0, 1756.0, 0.07423170188548522, 0.03440948681150097, 0.047603011951304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 8, 0, 0.0, 312.125, 114, 1011, 228.0, 1011.0, 1011.0, 1011.0, 0.07657774076520307, 8.631158301146753, 0.04419672342991701], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ec26cb7-10a0-4de9-95e3-32e0861c68e0", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 8, 0, 0.0, 313.0, 114, 1018, 227.5, 1018.0, 1018.0, 1018.0, 0.07657260997741108, 2.8324200952850416, 0.04426854014319078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 162.2, 114, 344, 116.0, 344.0, 344.0, 344.0, 0.03251567255417111, 0.008700482695159066, 0.018544094503550712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 8, 0, 0.0, 172.25, 114, 346, 115.5, 346.0, 346.0, 346.0, 0.07706832106662556, 0.05727440657392779, 0.038684684597896035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 116.8, 116, 118, 117.0, 118.0, 118.0, 118.0, 0.03251503820516989, 0.024164007884896765, 0.016321025036579416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 8, 0, 0.0, 201.125, 114, 347, 115.5, 347.0, 347.0, 347.0, 0.07706683621370633, 0.035090246469375565, 0.04314312876904996], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 4106.166666666666, 117, 36431, 1053.5, 26342.600000000035, 36431.0, 36431.0, 0.0642855994900009, 0.012079707781771818, 0.043751665733632615], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 3493.4, 116, 16993, 118.0, 16993.0, 16993.0, 16993.0, 0.030966271537041856, 0.0243738426356013, 0.011007541835432845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1806.2380952380954, 887, 7453, 1284.0, 2893.8, 6998.799999999994, 7453.0, 0.1016496282527881, 0.05261162399802509, 0.0467548583076789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 369.6, 231, 463, 458.0, 463.0, 463.0, 463.0, 0.03244309481170028, 0.05028046041618001, 0.07296528061654857], "isController": false}, {"data": ["addBook", 46, 9, 19.565217391304348, 5580.782608695652, 602, 43426, 1805.0, 26452.9, 35240.649999999994, 43426.0, 0.21492113328848023, 84.73408492217285, 0.7762830514245533], "isController": true}, {"data": ["https://demoqa.com/books-0", 47, 0, 0.0, 243.3191489361702, 114, 1381, 118.0, 466.0, 472.4, 1381.0, 0.21908459928494517, 0.16281580083578445, 0.10590515297465611], "isController": false}, {"data": ["https://demoqa.com/books-3", 47, 0, 0.0, 744.0212765957447, 564, 1141, 684.0, 931.4000000000002, 1031.6, 1141.0, 0.2189019505561041, 64.36444169232166, 0.11009228958632189], "isController": false}, {"data": ["https://demoqa.com/books-1", 47, 0, 0.0, 182.36170212765956, 114, 473, 122.0, 347.6, 389.19999999999965, 473.0, 0.21948360644254433, 0.3883831004627835, 0.1067410507894405], "isController": false}, {"data": ["https://demoqa.com/books-2", 47, 0, 0.0, 1069.6170212765956, 787, 1704, 1026.0, 1361.2, 1488.9999999999989, 1704.0, 0.21867279570843007, 196.7621659642191, 0.10976349315833307], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 2577.5625, 117, 21716, 119.0, 18993.700000000004, 21716.0, 21716.0, 0.07808877717855488, 0.05833780716952585, 0.027758120012689427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 139, 9, 6.474820143884892, 1349.388489208633, 114, 42952, 122.0, 1269.0, 9948.0, 34317.19999999988, 0.5697795486034253, 1.3316499345163433, 0.27079500003074347], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 3866.4444444444443, 118, 20611, 120.0, 20611.0, 20611.0, 20611.0, 0.045859405254468744, 0.03551416832694698, 0.016301585461549434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e595652-22b0-43f5-a681-fb67e629320c", 3, 0, 0.0, 324.3333333333333, 214, 438, 321.0, 438.0, 438.0, 438.0, 0.07285797551972023, 0.032966336579560905, 0.04672207414513309], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 1531.0, 116, 21268, 120.0, 8593.000000000007, 21268.0, 21268.0, 0.0775859393588298, 0.0629628082101441, 0.02757937688145903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 287.8888888888889, 232, 459, 243.0, 459.0, 459.0, 459.0, 0.05362121970401086, 0.0831024176467434, 0.12059537986165726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 8, 0, 0.0, 543.5, 232, 1134, 459.5, 1134.0, 1134.0, 1134.0, 0.07631912843555326, 11.516521078985528, 0.16920263801837385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd2e9f95-665d-40f9-8a3b-9259357da307", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 0.8521889740566038, 3.252137382075472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 6, 0, 0.0, 4104.666666666667, 118, 18714, 233.0, 18714.0, 18714.0, 18714.0, 0.06672894701721607, 0.05532507423595356, 0.023720055385026025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0dc479cc-5047-46ee-b35c-8ef8e62d0270", 3, 0, 0.0, 309.6666666666667, 218, 420, 291.0, 420.0, 420.0, 420.0, 0.04860818561845815, 0.03125037975145014, 0.031171264866003433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 123.76470588235293, 116, 162, 120.0, 142.79999999999998, 162.0, 162.0, 0.0775108971202422, 0.06017691719784428, 0.027552701710711093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a715195c-3119-4f6d-a55a-db2afc32d04f", 3, 0, 0.0, 1091.6666666666665, 213, 2617, 445.0, 2617.0, 2617.0, 2617.0, 0.04733877203225348, 0.03098902036356177, 0.030357220346204222], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8de53184-63f6-4eaa-9cfb-54f5f39c0061", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.7002981085526315, 1.308508086622807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e41f9e02-962a-4340-8d67-52692a3eb8ee", 3, 0, 0.0, 1355.3333333333335, 525, 2803, 738.0, 2803.0, 2803.0, 2803.0, 0.025008127641483482, 0.02508139364043314, 0.01603711310342528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb2e7255-da0a-4d1c-b042-8c74f9058b57", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1447e00c-d9da-4b17-9a33-0388d68846e6", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 135.06250000000003, 115, 344, 118.0, 201.90000000000015, 344.0, 344.0, 0.0838693106466848, 0.06232865761926478, 0.042098462570699206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 159.18749999999997, 112, 352, 116.0, 344.3, 352.0, 352.0, 0.0838706295539131, 0.03031505543324422, 0.047392229517219685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 230.375, 113, 1011, 120.5, 545.5000000000005, 1011.0, 1011.0, 0.08387018991356128, 4.737851804322984, 0.048856023714296204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 195.43749999999997, 114, 908, 117.0, 512.5000000000005, 908.0, 908.0, 0.08387018991356128, 1.5624815714914742, 0.048937928196633666], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 23.80952380952381, 0.45955882352941174], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.523809523809524, 0.18382352941176472], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.761904761904762, 0.09191176470588236], "isController": false}, {"data": ["401/Unauthorized", 13, 61.904761904761905, 1.1948529411764706], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1088, 21, "401/Unauthorized", 13, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 139, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
