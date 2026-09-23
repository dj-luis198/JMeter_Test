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

    var data = {"OkPercent": 99.01738473167045, "KoPercent": 0.982615268329554};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.765625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80ce008e-dd4b-41d3-b70a-efa6f5715df5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/551d3fba-d978-4f26-a30d-4cb3506e740d"], "isController": false}, {"data": [0.008928571428571428, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8647bfc-fb7e-4569-9bda-aabfde596ba3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9f8dbbd2-10fe-465f-b3ee-8af313730e6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a43c9bd6-246f-47fb-8376-944214b113c9"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/15f467e6-ad1a-4faf-b2e5-9af5d4838421"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7261c664-530d-4468-ba52-09295fb0d60a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb9b8d9c-88d4-4fd9-9e61-cfc8da696705"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72c6de67-1294-4e91-ad6f-f6e2569e3730"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4185274-0470-4990-a2ee-0d9b11a2d711"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da4f6195-8233-436e-94ce-9fe54dff9d6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f1d77a8-eb56-493c-8bf9-32abff34ebc1"], "isController": false}, {"data": [0.6590909090909091, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4f68f5d3-fc22-4485-ac2b-f0a6f5bac3d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f08c2a4d-6bb5-4236-bb67-8b86995be5cb"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2353c0e5-94b8-45c6-85d7-00369f4ff2c7"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7eea1829-aa44-4dac-9839-e9da4526572e"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f8dbbd2-10fe-465f-b3ee-8af313730e6b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/80ce008e-dd4b-41d3-b70a-efa6f5715df5"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.33035714285714285, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.25806451612903225, 500, 1500, "addBook"], "isController": true}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7261c664-530d-4468-ba52-09295fb0d60a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4732142857142857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9222222222222223, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c4185274-0470-4990-a2ee-0d9b11a2d711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8647bfc-fb7e-4569-9bda-aabfde596ba3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/72c6de67-1294-4e91-ad6f-f6e2569e3730"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f68f5d3-fc22-4485-ac2b-f0a6f5bac3d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f08c2a4d-6bb5-4236-bb67-8b86995be5cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f8290c7a-3d4e-4f99-884e-0842073d526d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/da4f6195-8233-436e-94ce-9fe54dff9d6b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2353c0e5-94b8-45c6-85d7-00369f4ff2c7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a43c9bd6-246f-47fb-8376-944214b113c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f4143141-c0ef-4df5-a7c0-310f6367382e"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7f1d77a8-eb56-493c-8bf9-32abff34ebc1"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1323, 13, 0.982615268329554, 434.0158730158731, 114, 2777, 139.0, 1225.8000000000004, 1472.0, 1921.9599999999998, 5.130014657184735, 727.006170352451, 3.740548593850574], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80ce008e-dd4b-41d3-b70a-efa6f5715df5", 1, 0, 0.0, 812.0, 812, 812, 812.0, 812.0, 812.0, 812.0, 1.2315270935960592, 0.22249268780788176, 0.8490802032019704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/551d3fba-d978-4f26-a30d-4cb3506e740d", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 1.4384501689189189, 2.68774634009009], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2019.5, 1471, 2595, 2021.5, 2445.5, 2494.75, 2595.0, 0.2421213287272633, 291.353777430509, 1.190508681779073], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c8647bfc-fb7e-4569-9bda-aabfde596ba3", 3, 0, 0.0, 316.3333333333333, 230, 474, 245.0, 474.0, 474.0, 474.0, 0.02447281478158013, 0.028926038565077295, 0.015693829791573195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f8dbbd2-10fe-465f-b3ee-8af313730e6b", 3, 0, 0.0, 336.6666666666667, 235, 474, 301.0, 474.0, 474.0, 474.0, 0.024893786510886882, 0.024966717526055497, 0.0159637888757966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a43c9bd6-246f-47fb-8376-944214b113c9", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 690.3846153846155, 463, 1356, 636.0, 1197.1999999999998, 1356.0, 1356.0, 0.06799910031959577, 0.01228499371008322, 0.04621813849847525], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 690.3846153846155, 463, 1356, 636.0, 1197.1999999999998, 1356.0, 1356.0, 0.06990901073372197, 0.012630045884510315, 0.04751628073307664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 202.20000000000002, 120, 371, 125.0, 363.2, 371.0, 371.0, 0.10336843265891174, 0.04835973678951431, 0.057794798155907164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 155.20000000000002, 116, 362, 124.0, 350.6, 362.0, 362.0, 0.10336629569651656, 0.07681811623539951, 0.051885035144540535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 263.6666666666667, 115, 794, 123.0, 763.4, 794.0, 794.0, 0.10336772032829587, 4.076618307801507, 0.05968543695258178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 322.20000000000005, 116, 1458, 122.0, 1377.6000000000001, 1458.0, 1458.0, 0.10337341924813066, 12.426225298060027, 0.05958777695461907], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 278.57142857142856, 219, 539, 241.0, 459.5, 539.0, 539.0, 0.07180555056905899, 0.15291737296828758, 0.04642116648116899], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/15f467e6-ad1a-4faf-b2e5-9af5d4838421", 1, 0, 0.0, 624.0, 624, 624, 624.0, 624.0, 624.0, 624.0, 1.6025641025641024, 0.5117563100961539, 0.9562174479166666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 137.2777777777778, 115, 360, 122.5, 158.40000000000032, 360.0, 360.0, 0.0807511652841768, 0.0600113640441978, 0.04053329976178406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 149.11111111111111, 116, 366, 122.0, 359.7, 366.0, 366.0, 0.08075188981853257, 0.021607439267849533, 0.04605381216213185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 979.5, 912, 1107, 949.5, 1107.0, 1107.0, 1107.0, 0.04536947768388817, 13.340132847501842, 0.025874780241592468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1168.0, 1020, 1435, 1108.5, 1435.0, 1435.0, 1435.0, 0.045300626281158336, 40.7615831577934, 0.02579127453312042], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7261c664-530d-4468-ba52-09295fb0d60a", 3, 0, 0.0, 404.0, 292, 596, 324.0, 596.0, 596.0, 596.0, 0.04014505747434062, 0.025809403812442292, 0.02574406354962598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 239.25, 121, 359, 238.5, 359.0, 359.0, 359.0, 0.04567722191136335, 0.08082727158534218, 0.025291977366936544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb9b8d9c-88d4-4fd9-9e61-cfc8da696705", 2, 0, 0.0, 349.5, 219, 480, 349.5, 480.0, 480.0, 480.0, 0.016576875259013676, 0.027835875984251968, 0.01030388779527559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 137.9375, 115, 359, 124.0, 203.60000000000016, 359.0, 359.0, 0.07819066794378092, 0.05810849443868875, 0.039248050120218154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 168.37499999999997, 115, 367, 123.0, 366.3, 367.0, 367.0, 0.07819372495357248, 0.020922930309842633, 0.0445948587625843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 150.31249999999997, 115, 358, 122.0, 347.5, 358.0, 358.0, 0.0781929606787149, 0.021075446432934873, 0.04596890852401012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72c6de67-1294-4e91-ad6f-f6e2569e3730", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 182.12499999999997, 116, 370, 124.0, 367.9, 370.0, 370.0, 0.07818990372868104, 0.02107462248937106, 0.04604346869960416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 123.25, 114, 130, 124.5, 130.0, 130.0, 130.0, 0.04579436042451372, 0.034032722932670845, 0.025714606683686907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 162.38888888888886, 115, 370, 122.0, 368.2, 370.0, 370.0, 0.08075225209058608, 0.02176525544629078, 0.04747349195169221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 824.8421052631578, 119, 1636, 1097.0, 1491.0, 1636.0, 1636.0, 0.08160881031535364, 38.65870920364834, 0.04428586653523353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 162.11111111111114, 116, 368, 122.5, 365.3, 368.0, 368.0, 0.08075188981853257, 0.021765157802651352, 0.047552138242749155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 550.1578947368421, 114, 1093, 721.0, 1092.0, 1093.0, 1093.0, 0.08160810926896316, 12.639626374452368, 0.04436518152435358], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 589.7499999999999, 398, 1130, 498.5, 1034.6000000000004, 1130.0, 1130.0, 0.09004277031590005, 0.01626749268402491, 0.06208026937795452], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4185274-0470-4990-a2ee-0d9b11a2d711", 1, 0, 0.0, 1130.0, 1130, 1130, 1130.0, 1130.0, 1130.0, 1130.0, 0.8849557522123894, 0.15987970132743365, 0.6101355088495576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 352.625, 236, 727, 252.0, 573.0000000000001, 727.0, 727.0, 0.0781421699103807, 0.12110510121852947, 0.17574357158555348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da4f6195-8233-436e-94ce-9fe54dff9d6b", 1, 0, 0.0, 801.0, 801, 801, 801.0, 801.0, 801.0, 801.0, 1.2484394506866416, 0.2255481429463171, 0.8607404806491885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f1d77a8-eb56-493c-8bf9-32abff34ebc1", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 832.7727272727273, 185, 2655, 576.5, 2187.0999999999995, 2624.9999999999995, 2655.0, 0.09807286814102878, 0.06024202544990928, 0.04434349409110969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 160.52631578947364, 115, 365, 124.0, 344.0, 365.0, 365.0, 0.0816035527609918, 0.06064482778429175, 0.0409611583194822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 211.73684210526315, 115, 384, 124.0, 376.0, 384.0, 384.0, 0.08152512046409248, 0.08626008068841529, 0.042891197217847996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f68f5d3-fc22-4485-ac2b-f0a6f5bac3d5", 3, 0, 0.0, 564.6666666666666, 402, 753, 539.0, 753.0, 753.0, 753.0, 0.03678589383591039, 0.030666886104741702, 0.023589912388262847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f08c2a4d-6bb5-4236-bb67-8b86995be5cb", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["login", 22, 0, 0.0, 3060.7272727272725, 1945, 4861, 3078.5, 4288.7, 4796.349999999999, 4861.0, 0.09903575190643822, 21.680002262066605, 0.17928249441798488], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 130.2777777777778, 123, 167, 126.5, 146.30000000000004, 167.0, 167.0, 0.07900697017047949, 0.06396169753059325, 0.02808450892778763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2353c0e5-94b8-45c6-85d7-00369f4ff2c7", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 0.30466115092748736, 1.1626528246205734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1001.3684210526318, 244, 1761, 1224.0, 1609.0, 1761.0, 1761.0, 0.08147757436972808, 51.362711593776396, 0.17227297372777056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7eea1829-aa44-4dac-9839-e9da4526572e", 2, 0, 0.0, 235.0, 231, 239, 235.0, 239.0, 239.0, 239.0, 0.0226510827217541, 0.02577003063558938, 0.014079506008199691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 551.1333333333333, 248, 1585, 472.0, 1498.6000000000001, 1585.0, 1585.0, 0.10327591192630231, 16.612569184103084, 0.22874673174770385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1292.0, 1135, 1566, 1233.5, 1566.0, 1566.0, 1566.0, 0.04523351803686532, 54.11501328734592, 0.10199628237023634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f8dbbd2-10fe-465f-b3ee-8af313730e6b", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80ce008e-dd4b-41d3-b70a-efa6f5715df5", 3, 0, 0.0, 400.33333333333337, 225, 743, 233.0, 743.0, 743.0, 743.0, 0.018364011434657785, 0.025316272274015537, 0.01177640056193875], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1255.4999999999998, 216, 1995, 1319.5, 1822.7, 1970.5499999999997, 1995.0, 0.10554444140604385, 0.03354484199517374, 0.04761868352499244], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 342.50000000000006, 241, 730, 255.0, 521.2000000000003, 730.0, 730.0, 0.08070699326096607, 0.12508007646987612, 0.18151191941406722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 146.52941176470588, 121, 418, 126.0, 212.3999999999998, 418.0, 418.0, 0.0939159065923442, 0.07291322826261097, 0.03338416992149735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 534.4375, 242, 1475, 366.5, 1472.9, 1475.0, 1475.0, 0.16031582216967427, 36.16314569389197, 0.3528631090748775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 164.08333333333334, 120, 364, 124.0, 362.5, 364.0, 364.0, 0.05513844344174164, 0.0409769096280912, 0.027676913993217974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 121.0, 118, 124, 120.5, 123.7, 124.0, 124.0, 0.055138696796901206, 0.0216552206007361, 0.03106038893458253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 301.66666666666663, 120, 1304, 126.0, 1022.600000000001, 1304.0, 1304.0, 0.05484059666569172, 4.125688256628857, 0.03184753400116993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 231.33333333333331, 119, 943, 123.0, 771.4000000000005, 943.0, 943.0, 0.05493122153303884, 1.3595387923142066, 0.03195380627589206], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1385.4107142857142, 952, 2080, 1265.5, 1936.3000000000002, 1977.5, 2080.0, 0.24196231436953694, 289.47104769682124, 0.4777810543507849], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1255.4999999999998, 216, 1995, 1319.5, 1822.7, 1970.5499999999997, 1995.0, 0.09972213786132277, 0.03169435844669172, 0.044991823917901484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 262.0, 117, 365, 344.0, 365.0, 365.0, 365.0, 0.027154137747509965, 0.007318888689758546, 0.01599018072436378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 166.8, 116, 358, 119.0, 358.0, 358.0, 358.0, 0.027189576603913124, 0.007328440569023459, 0.015984497183159863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 298.8823529411765, 116, 1454, 122.0, 1345.1999999999998, 1454.0, 1454.0, 0.09591568447125068, 10.17635218194077, 0.05541819591060658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 281.7058823529412, 115, 1075, 124.0, 977.3999999999999, 1075.0, 1075.0, 0.09611361760349175, 3.3476337675407355, 0.055626418735936316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 136.52941176470588, 117, 357, 124.0, 172.99999999999983, 357.0, 357.0, 0.0965645732981914, 0.07176332058586295, 0.04847088933131873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 214.4, 119, 367, 122.0, 367.0, 367.0, 367.0, 0.02715384281183473, 0.007265774346135465, 0.015486175978624495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 136.1764705882353, 115, 365, 122.0, 174.59999999999982, 365.0, 365.0, 0.09656786448688381, 0.04290302527237818, 0.05411972000999762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 122.8, 118, 128, 123.0, 128.0, 128.0, 128.0, 0.02718972445933233, 0.02020642608745303, 0.013647967160250797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 226.0, 119, 372, 141.0, 372.0, 372.0, 372.0, 0.027377158688962625, 0.02154881826494519, 0.009731724377717185], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 663.6666666666667, 460, 1479, 558.5, 1261.2000000000007, 1479.0, 1479.0, 0.09194134142417139, 0.016610496253390335, 0.06258116696547603], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1632.590909090909, 1086, 2777, 1507.5, 2274.7, 2712.949999999999, 2777.0, 0.09885596685629039, 0.05116568597054092, 0.04546988319268826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 386.6, 240, 495, 469.0, 495.0, 495.0, 495.0, 0.027135569304244003, 0.04205483250569847, 0.06102853135515034], "isController": false}, {"data": ["addBook", 62, 9, 14.516129032258064, 1364.7096774193549, 597, 2996, 1035.5, 2249.6, 2411.7999999999997, 2996.0, 0.2774483699908263, 97.43797703918958, 1.0062266811916856], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 210.37500000000003, 116, 514, 125.5, 483.3, 494.75, 514.0, 0.2431051473173781, 0.1806670088950437, 0.11751664836142789], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 783.2142857142858, 573, 1241, 721.0, 997.4000000000002, 1092.8, 1241.0, 0.24300071164494125, 71.45027760661657, 0.12221227196986792], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7261c664-530d-4468-ba52-09295fb0d60a", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 176.6964285714286, 115, 490, 124.0, 360.0, 371.9, 490.0, 0.24351743541352303, 0.4309117118840857, 0.11842937776946727], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1173.5535714285713, 828, 1603, 1140.0, 1466.4, 1556.75, 1603.0, 0.242499826785838, 218.20177041112382, 0.1217235458671101], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 146.56249999999997, 122, 361, 127.0, 246.2000000000001, 361.0, 361.0, 0.15747101549121117, 0.11764192075271146, 0.055976025037891466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 9, 5.0, 220.81111111111113, 116, 1661, 130.0, 411.8000000000001, 484.79999999999995, 1650.47, 0.7332841761348592, 1.560480604124316, 0.3540347879688436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 151.08333333333334, 124, 375, 127.0, 309.9000000000002, 375.0, 375.0, 0.057564448196793655, 0.04457871818364978, 0.020462362444954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4185274-0470-4990-a2ee-0d9b11a2d711", 3, 0, 0.0, 692.3333333333333, 237, 1479, 361.0, 1479.0, 1479.0, 1479.0, 0.03617072582589824, 0.023254291505907885, 0.023195419881842295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8647bfc-fb7e-4569-9bda-aabfde596ba3", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72c6de67-1294-4e91-ad6f-f6e2569e3730", 3, 0, 0.0, 382.6666666666667, 284, 460, 404.0, 460.0, 460.0, 460.0, 0.05720278386881495, 0.03625449876060635, 0.0366827748117075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 128.4666666666667, 120, 147, 128.0, 139.20000000000002, 147.0, 147.0, 0.10303683910454117, 0.08361680985925167, 0.03662637640044237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 468.4166666666667, 243, 1664, 257.5, 1384.700000000001, 1664.0, 1664.0, 0.054809787201001194, 5.542162464487825, 0.12209986286134494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 479.47058823529403, 239, 1811, 254.0, 1513.3999999999996, 1811.0, 1811.0, 0.09584700562678304, 13.621226068200782, 0.21267706148585408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f68f5d3-fc22-4485-ac2b-f0a6f5bac3d5", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 142.1875, 120, 379, 126.5, 211.00000000000017, 379.0, 379.0, 0.08073590779959329, 0.06693826730649874, 0.02869909222563668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f08c2a4d-6bb5-4236-bb67-8b86995be5cb", 3, 0, 0.0, 418.66666666666663, 250, 752, 254.0, 752.0, 752.0, 752.0, 0.06672449456195369, 0.03097302384288606, 0.04278881975489869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8290c7a-3d4e-4f99-884e-0842073d526d", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 1.064453125, 1.9889322916666667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 141.73684210526318, 121, 373, 129.0, 154.0, 373.0, 373.0, 0.0823751799247351, 0.06395338675797306, 0.029281802238870683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da4f6195-8233-436e-94ce-9fe54dff9d6b", 3, 0, 0.0, 391.0, 309, 521, 343.0, 521.0, 521.0, 521.0, 0.046223537025053156, 0.029717280476718743, 0.0296420468552587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2353c0e5-94b8-45c6-85d7-00369f4ff2c7", 3, 0, 0.0, 403.0, 228, 507, 474.0, 507.0, 507.0, 507.0, 0.022353861629596513, 0.026421507674825824, 0.014334995901792033], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a43c9bd6-246f-47fb-8376-944214b113c9", 3, 0, 0.0, 645.0, 380, 1060, 495.0, 1060.0, 1060.0, 1060.0, 0.03531904874028726, 0.02944403770308453, 0.022649259771603484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 122.375, 116, 129, 123.0, 126.2, 129.0, 129.0, 0.16251574371267216, 0.12077586031771828, 0.0815752854182749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 167.18749999999997, 116, 370, 123.0, 365.8, 370.0, 370.0, 0.16252234682268812, 0.08925635233829027, 0.09012927509954495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4143141-c0ef-4df5-a7c0-310f6367382e", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.6094197280534351, 1.13870169370229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 380.56250000000006, 117, 1352, 124.5, 1351.3, 1352.0, 1352.0, 0.1605152539652284, 27.116134588905386, 0.09177898554359494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f1d77a8-eb56-493c-8bf9-32abff34ebc1", 3, 0, 0.0, 697.0, 226, 1155, 710.0, 1155.0, 1155.0, 1155.0, 0.029645147583426387, 0.024713939766000968, 0.01901072289692382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 305.8125, 117, 977, 123.0, 949.7, 977.0, 977.0, 0.16111978248829362, 8.91801536302301, 0.09228198479432052], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 30.76923076923077, 0.30234315948601664], "isController": false}, {"data": ["401/Unauthorized", 9, 69.23076923076923, 0.6802721088435374], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1323, 13, "401/Unauthorized", 9, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
