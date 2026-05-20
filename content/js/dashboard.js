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

    var data = {"OkPercent": 98.29123328380386, "KoPercent": 1.7087667161961366};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7413239074550129, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/61334478-b72d-4be5-a300-cf82e31ef9ed"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a2a324a-2f6a-4757-b0fb-d8fc77b62e7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5cf8477f-16e6-438d-94b2-f8a9ecaeaccc"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b85d6ff8-acb1-4782-91b0-4b88bc7c72af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/90a58fe8-56e9-432b-bb8b-ed9c144382ee"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e181b5d-78ef-4ac8-a0a6-4f45723104ad"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7d4b4d8-4833-4980-9062-a2a8e6f6db12"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b9a64def-d44a-47fe-bac3-ba90334f77e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f335615a-ce69-4598-84a5-89ebc54b3318"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/608637e7-40ce-4bc2-97b8-8e05cd864f6b"], "isController": false}, {"data": [0.34375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/624a08ae-6800-4131-87f5-3d283bae361c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.175, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5cf8477f-16e6-438d-94b2-f8a9ecaeaccc"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a2a324a-2f6a-4757-b0fb-d8fc77b62e7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61334478-b72d-4be5-a300-cf82e31ef9ed"], "isController": false}, {"data": [0.2413793103448276, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.175, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ff599b0-e2fc-4489-a73c-d45d130fb59b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b85d6ff8-acb1-4782-91b0-4b88bc7c72af"], "isController": false}, {"data": [0.31451612903225806, 500, 1500, "addBook"], "isController": true}, {"data": [0.9051724137931034, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e238833d-c255-41be-89d0-465986c87cf6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.33620689655172414, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9313186813186813, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=624a08ae-6800-4131-87f5-3d283bae361c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f335615a-ce69-4598-84a5-89ebc54b3318"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1300023b-ee6f-4d84-a95d-db09f5baee8b"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=608637e7-40ce-4bc2-97b8-8e05cd864f6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9a64def-d44a-47fe-bac3-ba90334f77e5"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3ff599b0-e2fc-4489-a73c-d45d130fb59b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5e181b5d-78ef-4ac8-a0a6-4f45723104ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c7d4b4d8-4833-4980-9062-a2a8e6f6db12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1346, 23, 1.7087667161961366, 476.6084695393766, 136, 3155, 161.5, 1336.8999999999999, 1638.2999999999997, 2067.5299999999997, 5.241412611321607, 720.8113640584052, 3.850280409246849], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2392.5517241379316, 1687, 3031, 2427.5, 2889.3, 2979.7, 3031.0, 0.265153766326386, 319.06911848658916, 1.3037589975130404], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/61334478-b72d-4be5-a300-cf82e31ef9ed", 2, 0, 0.0, 247.0, 244, 250, 247.0, 250.0, 250.0, 250.0, 0.07187780772686433, 0.042221192722371965, 0.04467795372866128], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 516.1538461538461, 151, 956, 501.0, 902.8, 956.0, 956.0, 0.09641127566950214, 0.019112782188387634, 0.06481978044186029], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 516.1538461538461, 151, 956, 501.0, 902.8, 956.0, 956.0, 0.09445340540854731, 0.01872464970501475, 0.06350345390673817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 161.14285714285714, 142, 440, 148.0, 149.8, 410.9999999999996, 440.0, 0.11596123581545598, 0.031028690052182558, 0.06613414230100223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 149.09523809523805, 142, 155, 150.0, 153.8, 154.9, 155.0, 0.11595931484610543, 0.08617679550574826, 0.058206140459861506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 199.95238095238093, 138, 442, 148.0, 438.8, 441.7, 442.0, 0.11596827991429391, 0.03125707544564953, 0.068289914832343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 188.66666666666666, 137, 442, 147.0, 438.2, 441.8, 442.0, 0.11596059548526748, 0.0312550042518885, 0.06817214695520608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a2a324a-2f6a-4757-b0fb-d8fc77b62e7e", 3, 0, 0.0, 349.3333333333333, 261, 482, 305.0, 482.0, 482.0, 482.0, 0.047072114479382414, 0.030262834015878995, 0.03018621924621854], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5cf8477f-16e6-438d-94b2-f8a9ecaeaccc", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 272.30769230769226, 149, 449, 264.0, 409.4, 449.0, 449.0, 0.09730903102661027, 0.22831657715483364, 0.06289414835884577], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 163.82352941176472, 139, 440, 147.0, 208.79999999999978, 440.0, 440.0, 0.1524048590255054, 0.11326181417813438, 0.07650009525303689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 162.64705882352942, 139, 446, 145.0, 213.1999999999998, 446.0, 446.0, 0.1524048590255054, 0.04078020641893406, 0.08691839616298355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1088.3333333333333, 818, 1320, 1156.5, 1320.0, 1320.0, 1320.0, 0.05811250581125058, 17.087006225302183, 0.03314228847047884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1488.8333333333333, 1315, 1859, 1434.0, 1859.0, 1859.0, 1859.0, 0.05811588307084326, 52.29277374397047, 0.033087460771778925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 294.8333333333333, 144, 455, 290.5, 455.0, 455.0, 455.0, 0.05878261210333983, 0.10401766907348807, 0.032548575256439144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 174.23076923076923, 145, 443, 152.0, 328.9999999999999, 443.0, 443.0, 0.08496010142929032, 0.06313929412860345, 0.04264598841274924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 237.0, 138, 454, 149.0, 448.8, 454.0, 454.0, 0.08495788049693825, 0.03254846683701811, 0.047903684721305476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 341.61538461538464, 144, 1481, 150.0, 1075.3999999999996, 1481.0, 1481.0, 0.08496287775802572, 5.901888351017593, 0.049387225667938926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 268.3076923076923, 144, 856, 155.0, 685.9999999999999, 856.0, 856.0, 0.08480436285829843, 1.9391990431784674, 0.049377900880008346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 149.5, 141, 159, 149.0, 159.0, 159.0, 159.0, 0.0587739748839214, 0.043678705944007995, 0.033002964412358206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 201.41176470588232, 140, 446, 149.0, 445.2, 446.0, 446.0, 0.1524034927294569, 0.04107750389973643, 0.08959658459290337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1068.5, 139, 1717, 1412.5, 1711.4, 1717.0, 1717.0, 0.09671706028495264, 54.40113863559429, 0.051664289038934656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 183.23529411764707, 139, 443, 150.0, 442.2, 443.0, 443.0, 0.1524034927294569, 0.04107750389973643, 0.08974541612877199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 782.2500000000001, 144, 1393, 975.5, 1339.8, 1393.0, 1393.0, 0.0967193988889359, 17.783972499954665, 0.05175999081165711], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 597.6923076923076, 151, 1681, 471.0, 1514.9999999999998, 1681.0, 1681.0, 0.09500632157447399, 0.01883426101525217, 0.06446041890479635], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b85d6ff8-acb1-4782-91b0-4b88bc7c72af", 3, 0, 0.0, 355.0, 267, 530, 268.0, 530.0, 530.0, 530.0, 0.047083934961391176, 0.03925193926957122, 0.03019379943813171], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90a58fe8-56e9-432b-bb8b-ed9c144382ee", 1, 0, 0.0, 345.0, 345, 345, 345.0, 345.0, 345.0, 345.0, 2.898550724637681, 0.9256114130434784, 1.7295063405797102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 563.6923076923077, 298, 1629, 586.0, 1332.5999999999997, 1629.0, 1629.0, 0.08472146190141029, 7.917841769635829, 0.1888731088377519], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e181b5d-78ef-4ac8-a0a6-4f45723104ad", 1, 0, 0.0, 1266.0, 1266, 1266, 1266.0, 1266.0, 1266.0, 1266.0, 0.7898894154818326, 0.14270463072669826, 0.5445917259083728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 629.9999999999999, 167, 1369, 516.0, 1185.2, 1360.1, 1369.0, 0.08830723854434348, 0.05424341117616411, 0.03992797992776468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 184.0625, 144, 429, 150.5, 427.6, 429.0, 429.0, 0.09671472179405809, 0.0718749055520295, 0.04854625683803306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 301.75, 143, 611, 293.5, 492.0000000000001, 611.0, 611.0, 0.09672056823333837, 0.11667390811546018, 0.05008406377512468], "isController": false}, {"data": ["login", 20, 0, 0.0, 3141.05, 1589, 5165, 2954.0, 4467.5, 5130.2, 5165.0, 0.08973519145003095, 32.327970276900366, 0.18003122784662462], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7d4b4d8-4833-4980-9062-a2a8e6f6db12", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9a64def-d44a-47fe-bac3-ba90334f77e5", 3, 0, 0.0, 383.6666666666667, 246, 572, 333.0, 572.0, 572.0, 572.0, 0.018031230090516777, 0.02485750632595656, 0.01156299585882749], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 161.2941176470588, 146, 289, 152.0, 187.39999999999992, 289.0, 289.0, 0.16641867021693163, 0.13472761485335577, 0.05915663667867491], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f335615a-ce69-4598-84a5-89ebc54b3318", 3, 0, 0.0, 888.3333333333334, 262, 1675, 728.0, 1675.0, 1675.0, 1675.0, 0.021232324090194914, 0.025095888271971914, 0.013615780747944003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/608637e7-40ce-4bc2-97b8-8e05cd864f6b", 3, 0, 0.0, 953.6666666666666, 268, 1821, 772.0, 1821.0, 1821.0, 1821.0, 0.016559764188957948, 0.0228289717904417, 0.010619380030028372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1254.1875, 298, 1868, 1559.0, 1868.0, 1868.0, 1868.0, 0.09662769349695623, 72.3063544220758, 0.20186600909508165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/624a08ae-6800-4131-87f5-3d283bae361c", 3, 0, 0.0, 441.3333333333333, 364, 511, 449.0, 511.0, 511.0, 511.0, 0.016550080543725313, 0.022815622103735906, 0.010613170140344684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 395.85714285714283, 292, 597, 302.0, 595.0, 596.9, 597.0, 0.11586398671426286, 0.1795665497222023, 0.26058082168256574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 1143.4444444444443, 149, 2000, 1479.0, 2000.0, 2000.0, 2000.0, 0.08017674518048676, 63.95332530266722, 0.13808217225528277], "isController": false}, {"data": ["register", 20, 6, 30.0, 1253.05, 184, 2067, 1232.5, 2019.1000000000001, 2064.95, 2067.0, 0.09001386213476877, 0.02823481691180442, 0.040611722955335126], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5cf8477f-16e6-438d-94b2-f8a9ecaeaccc", 3, 0, 0.0, 951.3333333333334, 264, 1986, 604.0, 1986.0, 1986.0, 1986.0, 0.02094138506320808, 0.02475200819157179, 0.013429208520351536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 402.29411764705884, 290, 887, 301.0, 649.3999999999997, 887.0, 887.0, 0.15220018801199697, 0.2358805648193742, 0.34230179003088773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 160.7647058823529, 149, 195, 157.0, 183.79999999999998, 195.0, 195.0, 0.08699924259482918, 0.06754335728797772, 0.030925512016130682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 586.8333333333333, 286, 1639, 591.0, 971.2000000000011, 1639.0, 1639.0, 0.14550510480409357, 9.883792638553194, 0.32517612180393995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 148.42857142857142, 144, 152, 150.0, 152.0, 152.0, 152.0, 0.031799102356767764, 0.02363195009130885, 0.01596165880017444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a2a324a-2f6a-4757-b0fb-d8fc77b62e7e", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 193.2857142857143, 141, 464, 145.0, 464.0, 464.0, 464.0, 0.03180011357183418, 0.015332197614991482, 0.01775447189097104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 313.85714285714283, 145, 1283, 152.0, 1283.0, 1283.0, 1283.0, 0.03179939126879571, 4.094939105585336, 0.01830416969518012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 293.14285714285717, 142, 1146, 149.0, 1146.0, 1146.0, 1146.0, 0.031799535726778384, 1.3430778799022391, 0.018335307081302328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 153.0, 151, 155, 153.0, 155.0, 155.0, 155.0, 0.9442870632672333, 0.2784909112370161, 0.5837243271954674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61334478-b72d-4be5-a300-cf82e31ef9ed", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 0.6569602272727272, 2.5071022727272725], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1664.0862068965516, 1102, 2429, 1580.0, 2170.0000000000005, 2366.4, 2429.0, 0.24470921794309247, 292.75729934898914, 0.48320511589934856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 6, 30.0, 1253.05, 184, 2067, 1232.5, 2019.1000000000001, 2064.95, 2067.0, 0.09048504508417371, 0.028382613751012302, 0.04082430745008619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 197.27272727272728, 138, 428, 149.0, 424.0, 428.0, 428.0, 0.09462040015827412, 0.02550315473015982, 0.05571884892132743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 176.63636363636365, 142, 466, 148.0, 404.2000000000002, 466.0, 466.0, 0.09462202800812029, 0.025503593486563673, 0.05562740318446135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 146.64705882352945, 137, 158, 146.0, 154.0, 158.0, 158.0, 0.08695919056339325, 0.023438219331539587, 0.05112249288980736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ff599b0-e2fc-4489-a73c-d45d130fb59b", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 180.4705882352941, 142, 429, 148.0, 427.4, 429.0, 429.0, 0.08696052503695822, 0.023438579013867644, 0.05120819980203692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 149.23529411764707, 144, 161, 149.0, 157.0, 161.0, 161.0, 0.08695874574797309, 0.06462461475996828, 0.04364921417427556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 202.72727272727272, 143, 452, 149.0, 449.6, 452.0, 452.0, 0.09461714462660634, 0.02531747815204115, 0.05396134029486143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 199.64705882352942, 139, 452, 148.0, 445.6, 452.0, 452.0, 0.0869538530786779, 0.02326694896831811, 0.04959086933393349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 205.45454545454547, 145, 475, 150.0, 467.0, 475.0, 475.0, 0.09462202800812029, 0.07031969073650346, 0.04749582265251351], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 572.0, 152, 808, 572.0, 800.8000000000001, 808.0, 808.0, 0.08071617258585265, 0.015220272600528323, 0.05493343208834752], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 157.9090909090909, 149, 171, 158.0, 169.0, 171.0, 171.0, 0.09959167413604222, 0.07838954038442386, 0.035401727915546265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1583.45, 1017, 3155, 1534.0, 2053.0000000000005, 3100.649999999999, 3155.0, 0.08972029697418299, 0.04643726308234081, 0.04126783190902362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 439.3636363636364, 289, 915, 302.0, 909.6, 915.0, 915.0, 0.09449522369596591, 0.14644914063036904, 0.2125219728240327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b85d6ff8-acb1-4782-91b0-4b88bc7c72af", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["addBook", 62, 10, 16.129032258064516, 1348.3870967741939, 729, 3096, 1152.0, 2393.4, 2541.0, 3096.0, 0.30606854948190493, 77.88844865823498, 1.117443315610977], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 281.70689655172424, 144, 779, 155.5, 581.3, 600.6999999999999, 779.0, 0.24647603020606246, 0.1831721279168101, 0.1191461278828134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e238833d-c255-41be-89d0-465986c87cf6", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 1.1364268238434163, 2.123415258007117], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 937.4482758620691, 683, 1357, 882.0, 1240.0, 1334.25, 1357.0, 0.24638493823384477, 72.44535259065266, 0.12391429999065437], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 238.56896551724137, 140, 582, 151.0, 451.0, 460.29999999999995, 582.0, 0.24685367960946045, 0.43681530024642806, 0.12005188715381963], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1380.8448275862067, 952, 1869, 1328.0, 1718.2, 1765.05, 1869.0, 0.24554941682013506, 220.94579688459177, 0.12325429711479434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 154.66666666666663, 146, 175, 152.5, 165.10000000000002, 175.0, 175.0, 0.14427701186277653, 0.10778507233889066, 0.05128596906059634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 10, 5.4945054945054945, 210.29670329670338, 139, 921, 155.0, 342.9000000000001, 433.04999999999995, 662.0399999999961, 0.7544229079272439, 1.5338869179129844, 0.36396630589776324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 158.57142857142858, 148, 196, 153.0, 196.0, 196.0, 196.0, 0.030507735890172152, 0.02362561968838527, 0.010844546742209632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=624a08ae-6800-4131-87f5-3d283bae361c", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.3421667850378788, 1.305782433712121], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 170.33333333333334, 145, 494, 151.0, 180.4, 463.09999999999957, 494.0, 0.11301806674524113, 0.09171681002470251, 0.04017439091334743], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f335615a-ce69-4598-84a5-89ebc54b3318", 1, 0, 0.0, 873.0, 873, 873, 873.0, 873.0, 873.0, 873.0, 1.1454753722794961, 0.20694623424971365, 0.7897515750286369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 464.57142857142856, 295, 1428, 303.0, 1428.0, 1428.0, 1428.0, 0.03177730464901967, 5.473170804714845, 0.07030639989241114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1300023b-ee6f-4d84-a95d-db09f5baee8b", 1, 0, 0.0, 339.0, 339, 339, 339.0, 339.0, 339.0, 339.0, 2.949852507374631, 0.9419939159292035, 1.7601170722713864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=608637e7-40ce-4bc2-97b8-8e05cd864f6b", 1, 0, 0.0, 1681.0, 1681, 1681, 1681.0, 1681.0, 1681.0, 1681.0, 0.5948839976204641, 0.10747415972635335, 0.41014463117192146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9a64def-d44a-47fe-bac3-ba90334f77e5", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 369.52941176470586, 289, 598, 302.0, 595.6, 598.0, 598.0, 0.08688852202624034, 0.13466023872621427, 0.1954143224867495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ff599b0-e2fc-4489-a73c-d45d130fb59b", 3, 0, 0.0, 463.0, 245, 808, 336.0, 808.0, 808.0, 808.0, 0.021575748858283287, 0.029743911593369057, 0.013836010823834012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 183.76923076923077, 145, 481, 156.0, 363.7999999999999, 481.0, 481.0, 0.08507909083174628, 0.07053920714468026, 0.030242958069097308], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e181b5d-78ef-4ac8-a0a6-4f45723104ad", 3, 0, 0.0, 427.0, 279, 652, 350.0, 652.0, 652.0, 652.0, 0.022184262484193713, 0.026221047226597453, 0.014226236033158078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 189.25000000000003, 145, 455, 152.0, 437.5, 455.0, 455.0, 0.0999531469623614, 0.07760034358894269, 0.0355302202092769], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7d4b4d8-4833-4980-9062-a2a8e6f6db12", 3, 0, 0.0, 332.0, 241, 481, 274.0, 481.0, 481.0, 481.0, 0.03210822612753387, 0.02676730700280412, 0.02059023615600317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 165.0, 137, 443, 149.0, 183.8000000000004, 443.0, 443.0, 0.1460304067758109, 0.10852455034803914, 0.07330041902613944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 308.77777777777777, 140, 468, 429.0, 445.50000000000006, 468.0, 468.0, 0.14602922206988309, 0.05125917246051126, 0.0826009477702149], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 319.3333333333333, 144, 1484, 149.0, 569.6000000000015, 1484.0, 1484.0, 0.14568175012342482, 7.319567398548847, 0.08494940594219672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 319.4444444444445, 136, 1214, 151.5, 526.4000000000011, 1214.0, 1214.0, 0.14567821301392037, 2.4167629845823893, 0.08508960727581741], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 26.08695652173913, 0.4457652303120357], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.1485884101040119], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.3478260869565215, 0.07429420505200594], "isController": false}, {"data": ["401/Unauthorized", 14, 60.869565217391305, 1.0401188707280833], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1346, 23, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
