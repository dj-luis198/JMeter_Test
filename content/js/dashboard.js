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

    var data = {"OkPercent": 98.71309613928842, "KoPercent": 1.2869038607115821};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7553816046966731, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2f3f2500-dc87-4b12-b138-7edd1be45021"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35135eda-d8bb-42f5-a0e8-5e1eaa063f71"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e788d1c9-cdfe-4bda-b202-37d73bdbdd78"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85dec1f6-d186-47b3-94fb-5f92e912ac53"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b31d404-4e13-4d3b-bc0a-3a78d3b937db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4335d1d8-b7ee-4493-b89f-0b596e47c9c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bde7981a-c7a9-4f50-a78d-7f67c864d9b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec6fbb36-e865-416d-b6d3-3940c94def22"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ac1b275-bf6c-48a0-97e1-02d52f7a69ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/36dfa69b-39e7-452b-8358-6b2ede0ea12d"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa8aad26-39d9-4749-8148-c4d4e2c215ec"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ab6392f-8017-46e0-8178-4f2dc3a1d127"], "isController": false}, {"data": [0.46875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/42856e03-1a07-4da0-be5b-c99ca82a6d84"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a0100b5-4008-4255-9710-ae517a167ece"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e788d1c9-cdfe-4bda-b202-37d73bdbdd78"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/85dec1f6-d186-47b3-94fb-5f92e912ac53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2767857142857143, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b31d404-4e13-4d3b-bc0a-3a78d3b937db"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f3f2500-dc87-4b12-b138-7edd1be45021"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/35135eda-d8bb-42f5-a0e8-5e1eaa063f71"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f345ddd8-07ee-49f4-af6b-71122c576e63"], "isController": false}, {"data": [0.3253968253968254, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ec6fbb36-e865-416d-b6d3-3940c94def22"], "isController": false}, {"data": [0.9017857142857143, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bde7981a-c7a9-4f50-a78d-7f67c864d9b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42856e03-1a07-4da0-be5b-c99ca82a6d84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/965bb70e-08c7-4077-b18e-685ebe51e0ff"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ab6392f-8017-46e0-8178-4f2dc3a1d127"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9ac1b275-bf6c-48a0-97e1-02d52f7a69ee"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e67d2a06-7582-4a0e-b4bd-c4bcc64c5fb1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a0100b5-4008-4255-9710-ae517a167ece"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1321, 17, 1.2869038607115821, 444.7910673732015, 124, 2847, 153.0, 1241.8, 1542.0, 2094.0599999999995, 5.143239812803202, 711.3548399587587, 3.7549988173663187], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2275.303571428571, 1612, 3257, 2223.5, 2761.8, 2898.2, 3257.0, 0.25225338852877716, 303.54625400902705, 1.2403279406663994], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2f3f2500-dc87-4b12-b138-7edd1be45021", 3, 0, 0.0, 510.33333333333337, 325, 853, 353.0, 853.0, 853.0, 853.0, 0.03784963601266701, 0.030986925316359874, 0.02427206476072722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35135eda-d8bb-42f5-a0e8-5e1eaa063f71", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 562.6153846153848, 140, 1389, 432.0, 1222.6, 1389.0, 1389.0, 0.107284626113078, 0.021268338965776203, 0.07213021362019592], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 562.6153846153848, 140, 1389, 432.0, 1222.6, 1389.0, 1389.0, 0.11108357757478915, 0.022021451413752148, 0.07468434640131934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e788d1c9-cdfe-4bda-b202-37d73bdbdd78", 3, 0, 0.0, 403.3333333333333, 255, 637, 318.0, 637.0, 637.0, 637.0, 0.016462440940993125, 0.022694803836297486, 0.010556968962811346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 132.9333333333333, 126, 143, 132.0, 140.0, 143.0, 143.0, 0.0902423910623936, 0.03318287921356764, 0.05096110026531263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 152.53333333333333, 127, 389, 135.0, 245.00000000000009, 389.0, 389.0, 0.09024130525023914, 0.0670640950150703, 0.04529690517443644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85dec1f6-d186-47b3-94fb-5f92e912ac53", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 269.59999999999997, 124, 1224, 140.0, 813.0000000000002, 1224.0, 1224.0, 0.09023641941887746, 1.791533661944294, 0.05262028702701077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 320.6666666666667, 131, 1371, 143.0, 786.6000000000004, 1371.0, 1371.0, 0.09024021946421373, 5.435921595161319, 0.05253437776360672], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 243.84615384615384, 134, 353, 234.0, 340.59999999999997, 353.0, 353.0, 0.10599439045072076, 0.2392915727325354, 0.06850779262605179], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1b31d404-4e13-4d3b-bc0a-3a78d3b937db", 3, 0, 0.0, 352.6666666666667, 297, 457, 304.0, 457.0, 457.0, 457.0, 0.02904781269970371, 0.029132913713472375, 0.018627666347140727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 151.5625, 127, 396, 134.5, 221.70000000000016, 396.0, 396.0, 0.1233882411006231, 0.09169770652106854, 0.06193511320871121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 165.125, 126, 401, 133.5, 382.8, 401.0, 401.0, 0.12338538654328127, 0.03301523038365144, 0.0703682282629651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 872.6666666666666, 768, 1038, 812.0, 1038.0, 1038.0, 1038.0, 0.11681333229499259, 34.346998262401684, 0.06662010357448797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1388.0, 1145, 1518, 1501.0, 1518.0, 1518.0, 1518.0, 0.1135718341851221, 102.19213603776264, 0.06466052668938103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 312.3333333333333, 136, 403, 398.0, 403.0, 403.0, 403.0, 0.11849745230477544, 0.20968494489868467, 0.06561333540703874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4335d1d8-b7ee-4493-b89f-0b596e47c9c9", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.6751288319238901, 1.2614792547568712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 20, 0, 0.0, 177.85000000000002, 129, 424, 137.0, 417.6, 423.8, 424.0, 0.0929035614580285, 0.06904258815386688, 0.046633232997486965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 20, 0, 0.0, 226.45000000000002, 129, 412, 135.0, 403.0, 411.55, 412.0, 0.09290485613683026, 0.03183624415860717, 0.05259467295168018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 20, 0, 0.0, 226.39999999999998, 126, 1450, 133.5, 398.70000000000005, 1397.499999999999, 1450.0, 0.09290054068114677, 4.203391109244069, 0.054216174913137995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 20, 0, 0.0, 235.54999999999998, 128, 772, 139.0, 419.6, 754.3999999999997, 772.0, 0.0929074456026906, 1.3896830781862608, 0.054310934509541595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 135.0, 129, 139, 137.0, 139.0, 139.0, 139.0, 0.11974613818704347, 0.08899102652376961, 0.06724026314213867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 974.6249999999998, 130, 1863, 1310.0, 1784.6000000000001, 1863.0, 1863.0, 0.07379903600009224, 41.51027312850257, 0.03942194598833053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 208.06250000000003, 127, 543, 134.0, 446.4000000000001, 543.0, 543.0, 0.1233825321180154, 0.03325544810993384, 0.07253543392094264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 659.4999999999999, 131, 1181, 770.0, 1168.4, 1181.0, 1181.0, 0.07380005719504433, 13.569751288041624, 0.03949456185828544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 169.0625, 131, 415, 134.5, 401.7, 415.0, 415.0, 0.12338348357842949, 0.033255704558248576, 0.07265648495878221], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 529.0, 138, 1234, 470.0, 1122.3999999999999, 1234.0, 1234.0, 0.11135285148955852, 0.022074832863652718, 0.07555130368492283], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bde7981a-c7a9-4f50-a78d-7f67c864d9b1", 1, 0, 0.0, 955.0, 955, 955, 955.0, 955.0, 955.0, 955.0, 1.0471204188481678, 0.18917702879581152, 0.721940445026178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec6fbb36-e865-416d-b6d3-3940c94def22", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 20, 0, 0.0, 502.34999999999997, 273, 1847, 405.0, 838.9000000000001, 1796.6999999999994, 1847.0, 0.09284102830722953, 5.690198518779419, 0.20761393625070793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ac1b275-bf6c-48a0-97e1-02d52f7a69ee", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36dfa69b-39e7-452b-8358-6b2ede0ea12d", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 1.2572281003937007, 2.349132627952756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 584.8000000000001, 200, 1602, 467.0, 1433.000000000001, 1595.6499999999999, 1602.0, 0.08934833789754426, 0.05488291458745639, 0.04039871137359667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 133.375, 128, 146, 132.5, 143.2, 146.0, 146.0, 0.07380141883227706, 0.05484656223765902, 0.03704485281229532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 281.0, 129, 403, 381.5, 400.9, 403.0, 403.0, 0.07371403561309345, 0.08892115477643915, 0.038170768929533985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa8aad26-39d9-4749-8148-c4d4e2c215ec", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 1.4784071180555556, 2.7624059606481484], "isController": false}, {"data": ["login", 20, 0, 0.0, 2697.2000000000007, 1535, 3978, 2640.5, 3800.8000000000006, 3970.2999999999997, 3978.0, 0.09355499630457764, 16.919928142453855, 0.1644247332513168], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 141.75, 129, 184, 139.0, 157.40000000000003, 184.0, 184.0, 0.12414552959707018, 0.10050453519137809, 0.044129856223958534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ab6392f-8017-46e0-8178-4f2dc3a1d127", 3, 0, 0.0, 314.0, 216, 462, 264.0, 462.0, 462.0, 462.0, 0.02375654294787023, 0.028079429506418226, 0.015234501825294382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1126.25, 268, 1995, 1444.5, 1918.7, 1995.0, 1995.0, 0.0736699127471971, 55.12708239807077, 0.15390464926214978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42856e03-1a07-4da0-be5b-c99ca82a6d84", 3, 0, 0.0, 1075.0, 207, 2584, 434.0, 2584.0, 2584.0, 2584.0, 0.021635031442912362, 0.02557187472956211, 0.013874027325044714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 502.8666666666667, 264, 1510, 526.0, 1161.4, 1510.0, 1510.0, 0.0901631953836444, 7.321521485138099, 0.20124119969645057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, 57.142857142857146, 730.2857142857143, 134, 1658, 137.0, 1658.0, 1658.0, 1658.0, 0.12010569300984866, 61.59900623262757, 0.16154282733090836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a0100b5-4008-4255-9710-ae517a167ece", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1131.1904761904764, 219, 2069, 1112.0, 1934.2, 2058.0, 2069.0, 0.08925763152749559, 0.028341290367826448, 0.040270532974319304], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 22, 0, 0.0, 169.09090909090907, 129, 428, 144.5, 326.39999999999986, 422.2999999999999, 428.0, 0.1092310136638068, 0.08480337486594376, 0.038828211888306326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 412.50000000000006, 263, 798, 285.0, 718.2, 798.0, 798.0, 0.12325991664548136, 0.19102879659802632, 0.277214441439984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e788d1c9-cdfe-4bda-b202-37d73bdbdd78", 1, 0, 0.0, 735.0, 735, 735, 735.0, 735.0, 735.0, 735.0, 1.3605442176870748, 0.2458014455782313, 0.938031462585034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 547.1176470588235, 265, 1557, 532.0, 1299.3999999999999, 1557.0, 1557.0, 0.10049597720514775, 14.281911213651492, 0.2229927683538168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85dec1f6-d186-47b3-94fb-5f92e912ac53", 3, 0, 0.0, 313.3333333333333, 234, 430, 276.0, 430.0, 430.0, 430.0, 0.04743457980868052, 0.030495864297572933, 0.03041865957783224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 138.14285714285714, 133, 146, 135.0, 146.0, 146.0, 146.0, 0.06821348873015717, 0.05069381340200158, 0.03423997383525468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 209.28571428571428, 132, 395, 138.0, 395.0, 395.0, 395.0, 0.06804638819492373, 0.04740843507888521, 0.03717489622925801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 517.0, 131, 1470, 145.0, 1470.0, 1470.0, 1470.0, 0.06750696768345019, 17.36810750846248, 0.03802917627033647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 491.2857142857143, 133, 1200, 397.0, 1200.0, 1200.0, 1200.0, 0.06764592191727871, 5.6959225212601465, 0.038173514809625046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 143.0, 138, 148, 143.0, 148.0, 148.0, 148.0, 0.5091649694501018, 0.15016388747454176, 0.31474748599796337], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1566.6249999999998, 1056, 2627, 1386.0, 2188.9000000000005, 2331.05, 2627.0, 0.2544783647947359, 304.44459528851485, 0.5024953648583556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1131.1904761904764, 219, 2069, 1112.0, 1934.2, 2058.0, 2069.0, 0.08941116362242943, 0.02839004023502363, 0.040339802337463274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 138.0, 132, 145, 138.5, 145.0, 145.0, 145.0, 0.03933033548776171, 0.010600754486935773, 0.02316034404210968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 183.16666666666666, 131, 416, 138.0, 416.0, 416.0, 416.0, 0.03933085111961823, 0.010600893465834602, 0.023122238646494313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b31d404-4e13-4d3b-bc0a-3a78d3b937db", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 22, 0, 0.0, 207.04545454545456, 126, 1241, 133.5, 385.8, 1112.8999999999983, 1241.0, 0.10899452550224181, 4.485926894708811, 0.06365109985384824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 22, 0, 0.0, 198.1363636363636, 128, 998, 135.0, 411.5, 911.5999999999988, 998.0, 0.10912914938788468, 1.4866036993541538, 0.06383628953451458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f3f2500-dc87-4b12-b138-7edd1be45021", 1, 0, 0.0, 1234.0, 1234, 1234, 1234.0, 1234.0, 1234.0, 1234.0, 0.8103727714748784, 0.14640523703403566, 0.5587140397082658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 22, 0, 0.0, 173.31818181818178, 129, 406, 135.5, 401.8, 405.55, 406.0, 0.10912860806460414, 0.08110045970426147, 0.054777445844928246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 185.33333333333334, 130, 427, 140.0, 427.0, 427.0, 427.0, 0.03933110894061658, 0.010524144384500922, 0.022431023067695396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 22, 0, 0.0, 207.0, 127, 432, 136.5, 403.1, 427.79999999999995, 432.0, 0.10898318686653523, 0.03660186398402901, 0.06173843354007113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 184.66666666666669, 132, 399, 144.0, 399.0, 399.0, 399.0, 0.03933110894061658, 0.029229466702938692, 0.019742373042457934], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 148.33333333333334, 142, 155, 148.0, 155.0, 155.0, 155.0, 0.03807928106317353, 0.02997255911808385, 0.013535994440424965], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 459.07692307692304, 134, 853, 457.0, 774.9999999999999, 853.0, 853.0, 0.11116241684196125, 0.021569450323226106, 0.07564756116070666], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1411.7000000000003, 799, 2847, 1252.5, 2378.400000000001, 2825.5999999999995, 2847.0, 0.09272094241565872, 0.047990331523729605, 0.0426480115993899], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 373.33333333333337, 266, 826, 287.5, 826.0, 826.0, 826.0, 0.03929350281930882, 0.06089725485765928, 0.08837200878209787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35135eda-d8bb-42f5-a0e8-5e1eaa063f71", 3, 0, 0.0, 601.0, 322, 1007, 474.0, 1007.0, 1007.0, 1007.0, 0.017850555152265236, 0.024608431337839604, 0.011447133349597172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f345ddd8-07ee-49f4-af6b-71122c576e63", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 1.0334496359223302, 1.931002224919094], "isController": false}, {"data": ["addBook", 63, 5, 7.936507936507937, 1328.809523809524, 684, 2802, 1071.0, 2341.2, 2505.6, 2802.0, 0.27718503200827155, 90.5362485425787, 1.00767019518446], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ec6fbb36-e865-416d-b6d3-3940c94def22", 3, 0, 0.0, 280.3333333333333, 209, 417, 215.0, 417.0, 417.0, 417.0, 0.029305174316945227, 0.02443051804221899, 0.0187927061863223], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 233.75000000000003, 131, 603, 142.0, 546.2, 574.8, 603.0, 0.25584210886995457, 0.19013266098636272, 0.12367367567444092], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 834.2321428571425, 627, 1193, 788.5, 1121.9, 1147.25, 1193.0, 0.2557673248108007, 75.204085768832, 0.12863298073980697], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 182.92857142857136, 129, 525, 138.0, 402.90000000000003, 410.79999999999995, 525.0, 0.2563656506651773, 0.4536470302786145, 0.12467782620240069], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1326.6249999999998, 899, 2100, 1239.0, 1702.1000000000001, 1775.6499999999996, 2100.0, 0.25515434559744843, 229.58832868208225, 0.12807552112996926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 158.58823529411765, 131, 398, 138.0, 237.19999999999987, 398.0, 398.0, 0.10033642212123, 0.07495836222923921, 0.03566646255090598], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 5, 2.7472527472527473, 199.1428571428572, 128, 637, 144.0, 355.4000000000002, 419.19999999999993, 632.02, 0.7493875198155353, 1.5604693901447306, 0.36323388250674243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 138.71428571428572, 134, 148, 137.0, 148.0, 148.0, 148.0, 0.06925413298772223, 0.053631374471937235, 0.024617680085479387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bde7981a-c7a9-4f50-a78d-7f67c864d9b1", 3, 0, 0.0, 320.6666666666667, 229, 459, 274.0, 459.0, 459.0, 459.0, 0.020054012139362018, 0.0237031634368566, 0.012860157524265354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42856e03-1a07-4da0-be5b-c99ca82a6d84", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 184.13333333333333, 129, 428, 140.0, 405.8, 428.0, 428.0, 0.08808554868488276, 0.07148348726282966, 0.03131165988407942], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/965bb70e-08c7-4077-b18e-685ebe51e0ff", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.6237030029296875, 1.1653900146484375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 735.4285714285714, 270, 1605, 539.0, 1605.0, 1605.0, 1605.0, 0.06741334976935004, 23.117427660058553, 0.14668610719204137], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ab6392f-8017-46e0-8178-4f2dc3a1d127", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ac1b275-bf6c-48a0-97e1-02d52f7a69ee", 3, 0, 0.0, 718.6666666666666, 275, 1223, 658.0, 1223.0, 1223.0, 1223.0, 0.03154375118289067, 0.026296727467247073, 0.020228251897882365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 22, 0, 0.0, 432.9090909090909, 265, 1647, 280.0, 817.5, 1523.2499999999982, 1647.0, 0.10891035192895085, 6.083601342010683, 0.24367530977569418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 20, 0, 0.0, 144.29999999999998, 133, 172, 144.0, 153.8, 171.1, 172.0, 0.09364128831684466, 0.0776381384580089, 0.03328655170637838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e67d2a06-7582-4a0e-b4bd-c4bcc64c5fb1", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.5764186597472923, 1.0770391471119132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 158.81249999999997, 131, 415, 139.5, 237.90000000000018, 415.0, 415.0, 0.07565405292946678, 0.05873532429582626, 0.026892651627271395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 135.41176470588238, 125, 166, 134.0, 148.39999999999998, 166.0, 166.0, 0.10115434963703439, 0.07517427741580388, 0.05077474190765203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 257.5882352941176, 125, 422, 141.0, 410.8, 422.0, 422.0, 0.10100830050563567, 0.04487581549348497, 0.05660828238355823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a0100b5-4008-4255-9710-ae517a167ece", 3, 0, 0.0, 351.3333333333333, 303, 416, 335.0, 416.0, 416.0, 416.0, 0.025614535395018824, 0.025689577979183923, 0.0164259878672484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 359.1176470588235, 127, 1422, 137.0, 1164.3999999999999, 1422.0, 1422.0, 0.10058219340180811, 10.671454089405737, 0.05811441298456951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 288.29411764705884, 126, 1080, 136.0, 841.5999999999998, 1080.0, 1080.0, 0.1005940969017018, 3.503688696773888, 0.058219527015432315], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 23.529411764705884, 0.3028009084027252], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.764705882352942, 0.1514004542013626], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 11.764705882352942, 0.1514004542013626], "isController": false}, {"data": ["401/Unauthorized", 9, 52.94117647058823, 0.6813020439061317], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1321, 17, "401/Unauthorized", 9, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
