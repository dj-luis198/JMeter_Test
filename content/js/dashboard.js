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

    var data = {"OkPercent": 97.95918367346938, "KoPercent": 2.0408163265306123};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7551679586563308, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/78afb4ab-1c5a-41b5-a244-1c39e492399b"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cdada9f2-74e4-40e0-88a4-19e5af44d6a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d71314e5-b929-4733-b7a7-bca01a3f9f04"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/72d0658a-5541-457d-93ee-c63813d4947e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f407fbdd-429e-4f72-a6e1-da26984d057f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f407fbdd-429e-4f72-a6e1-da26984d057f"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ce636723-0d3f-4036-b2db-4f3322342f30"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c677ec7-2046-4fca-a944-53d8b46aaff3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed8b6361-34a6-434c-84a9-3b4ef0b19548"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eb0b9c39-df45-4b94-a64d-ca1ceefda339"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ca1b446-ff7d-4c1c-b66a-0d13cdfb24d9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/004adc65-a6b2-49c8-96b8-8414195c40b1"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b5118c6-f728-4fff-be16-ea2af13a836a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a418d93-70c4-4949-a2c3-8b892ca8892a"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/efe9534f-a941-4912-9a6b-5ed43d627395"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.34545454545454546, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72d0658a-5541-457d-93ee-c63813d4947e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59f0b3f2-f517-41a7-864b-b78c78ae23a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78afb4ab-1c5a-41b5-a244-1c39e492399b"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.28688524590163933, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9209039548022598, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cdada9f2-74e4-40e0-88a4-19e5af44d6a0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d71314e5-b929-4733-b7a7-bca01a3f9f04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb0b9c39-df45-4b94-a64d-ca1ceefda339"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8c677ec7-2046-4fca-a944-53d8b46aaff3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=004adc65-a6b2-49c8-96b8-8414195c40b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ed8b6361-34a6-434c-84a9-3b4ef0b19548"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=efe9534f-a941-4912-9a6b-5ed43d627395"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59f0b3f2-f517-41a7-864b-b78c78ae23a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ca1b446-ff7d-4c1c-b66a-0d13cdfb24d9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6a418d93-70c4-4949-a2c3-8b892ca8892a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3b5118c6-f728-4fff-be16-ea2af13a836a"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1323, 27, 2.0408163265306123, 436.2645502645501, 142, 2163, 163.0, 1147.0, 1331.6, 1777.6, 5.110199541124939, 696.4494880143997, 3.73674892040758], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2161.7454545454557, 1737, 2797, 2109.0, 2557.0, 2589.4, 2797.0, 0.2530608864492797, 304.5165086641721, 1.2442984016329328], "isController": true}, {"data": ["deleteBook", 16, 2, 12.5, 545.9375, 145, 1056, 515.5, 937.0000000000001, 1056.0, 1056.0, 0.09440140658095807, 0.01840320389523804, 0.06359879918460785], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 545.9375, 145, 1056, 515.5, 937.0000000000001, 1056.0, 1056.0, 0.09341429238673517, 0.018210769646193368, 0.06293377437529192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 260.4375, 145, 458, 151.0, 452.4, 458.0, 458.0, 0.1601248974199876, 0.07290843107623947, 0.08964023188086707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 169.875, 144, 431, 153.0, 246.2000000000002, 431.0, 431.0, 0.16011207845491843, 0.11898954267987591, 0.08036875813069148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 297.81249999999994, 143, 1050, 152.0, 1033.9, 1050.0, 1050.0, 0.1601152830037627, 5.9226627546833726, 0.09256664798655032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 314.1875, 143, 1325, 150.5, 1118.5000000000002, 1325.0, 1325.0, 0.16011207845491843, 18.04640201265886, 0.09240843590513359], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78afb4ab-1c5a-41b5-a244-1c39e492399b", 3, 0, 0.0, 324.0, 237, 441, 294.0, 441.0, 441.0, 441.0, 0.01820896609490513, 0.02510252975648543, 0.011676973700183304], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 267.625, 143, 479, 251.5, 401.30000000000007, 479.0, 479.0, 0.0953982279779153, 0.19431915663494675, 0.06166181849890889], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cdada9f2-74e4-40e0-88a4-19e5af44d6a0", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 150.6923076923077, 143, 163, 152.0, 159.4, 163.0, 163.0, 0.07491025175606918, 0.05567060701793813, 0.03760143496349566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 148.3076923076923, 142, 152, 150.0, 152.0, 152.0, 152.0, 0.07491284178984066, 0.02004503774454721, 0.042723730083268505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 975.5, 728, 1052, 1013.5, 1052.0, 1052.0, 1052.0, 0.05478951693909232, 16.10993716327276, 0.031247146379326088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1175.0, 985, 1356, 1187.0, 1356.0, 1356.0, 1356.0, 0.054795521379385925, 49.305106457423875, 0.031197059535333978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 255.83333333333331, 148, 453, 168.5, 453.0, 453.0, 453.0, 0.05506607929515419, 0.09744114812775331, 0.030490690390969164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d71314e5-b929-4733-b7a7-bca01a3f9f04", 3, 0, 0.0, 519.6666666666666, 244, 836, 479.0, 836.0, 836.0, 836.0, 0.06403005143747464, 0.04116515351204832, 0.0410609379335368], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72d0658a-5541-457d-93ee-c63813d4947e", 3, 0, 0.0, 667.6666666666666, 326, 1142, 535.0, 1142.0, 1142.0, 1142.0, 0.020865065620631375, 0.02478405743804814, 0.01338026669031374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 193.57142857142858, 148, 451, 151.5, 447.5, 451.0, 451.0, 0.074497408554431, 0.055363796787033195, 0.037394207028298376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 149.4285714285714, 144, 155, 150.5, 155.0, 155.0, 155.0, 0.07449661572517134, 0.019933664754586862, 0.042486351155761784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 234.28571428571428, 144, 449, 151.5, 448.5, 449.0, 449.0, 0.074497408554431, 0.02007937964943648, 0.04379632807594479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 210.64285714285717, 144, 442, 151.5, 437.5, 442.0, 442.0, 0.07449978714346531, 0.020080020753512135, 0.04387048012452108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f407fbdd-429e-4f72-a6e1-da26984d057f", 1, 0, 0.0, 570.0, 570, 570, 570.0, 570.0, 570.0, 570.0, 1.7543859649122808, 0.3169544956140351, 1.2095668859649125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 148.66666666666666, 142, 155, 149.0, 155.0, 155.0, 155.0, 0.05521709521267785, 0.041035360797702966, 0.031005693112587655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 743.5909090909093, 143, 1481, 445.5, 1463.5, 1478.6, 1481.0, 0.1426108150856313, 58.348903537558506, 0.07826882624816875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 193.92307692307693, 143, 449, 151.0, 438.59999999999997, 449.0, 449.0, 0.07491284178984066, 0.020191351888667993, 0.04404055738035555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 565.2727272727271, 143, 1194, 443.5, 1138.3999999999999, 1190.7, 1194.0, 0.14260896621463945, 19.080861917247905, 0.0784070781043379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 196.30769230769232, 145, 464, 151.0, 453.59999999999997, 464.0, 464.0, 0.0749119784253502, 0.020191119184957675, 0.04411320604539666], "isController": false}, {"data": ["deleteBooks", 16, 2, 12.5, 563.3125, 159, 974, 576.0, 883.0000000000001, 974.0, 974.0, 0.093135343116425, 0.018156389521109706, 0.06338251194751823], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f407fbdd-429e-4f72-a6e1-da26984d057f", 3, 0, 0.0, 347.3333333333333, 243, 455, 344.0, 455.0, 455.0, 455.0, 0.05657281864640103, 0.0363708713628392, 0.03627879320749024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 430.1428571428571, 300, 893, 305.0, 890.5, 893.0, 893.0, 0.07443601427044731, 0.11536128383515613, 0.16740834068832047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce636723-0d3f-4036-b2db-4f3322342f30", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.7080619456762749, 1.3230148281596452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 600.2857142857143, 156, 1147, 553.0, 1040.8000000000002, 1139.6, 1147.0, 0.09003176835254725, 0.0553027170837424, 0.04070772338596619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 176.86363636363632, 144, 456, 151.0, 347.79999999999984, 452.09999999999997, 456.0, 0.14260896621463945, 0.1059818586809967, 0.0715830162444577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 209.95454545454547, 145, 605, 150.0, 443.7, 580.8499999999997, 605.0, 0.1426108150856313, 0.13552078876745363, 0.07588860312706625], "isController": false}, {"data": ["login", 21, 0, 0.0, 2587.1428571428573, 1534, 3557, 2634.0, 3366.2, 3539.2999999999997, 3557.0, 0.09002597892534703, 30.894534699656187, 0.17848202936776042], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c677ec7-2046-4fca-a944-53d8b46aaff3", 1, 0, 0.0, 844.0, 844, 844, 844.0, 844.0, 844.0, 844.0, 1.1848341232227488, 0.2140569460900474, 0.8168875888625593], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed8b6361-34a6-434c-84a9-3b4ef0b19548", 1, 0, 0.0, 639.0, 639, 639, 639.0, 639.0, 639.0, 639.0, 1.5649452269170578, 0.28272936228482004, 1.0789563771517996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 155.3846153846154, 150, 170, 154.0, 167.6, 170.0, 170.0, 0.07215928329179548, 0.0584180135243149, 0.025650370232630428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb0b9c39-df45-4b94-a64d-ca1ceefda339", 3, 0, 0.0, 547.6666666666666, 251, 1024, 368.0, 1024.0, 1024.0, 1024.0, 0.05652378709373528, 0.03516176990108337, 0.03624735044747998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 935.4090909090909, 296, 1636, 889.5, 1618.2, 1633.6, 1636.0, 0.1424713600186508, 77.59556408135114, 0.3038520491590952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ca1b446-ff7d-4c1c-b66a-0d13cdfb24d9", 3, 0, 0.0, 370.3333333333333, 308, 470, 333.0, 470.0, 470.0, 470.0, 0.026910173839723002, 0.026831335439801943, 0.017256849760499453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/004adc65-a6b2-49c8-96b8-8414195c40b1", 3, 0, 0.0, 596.3333333333334, 260, 899, 630.0, 899.0, 899.0, 899.0, 0.033662477558348294, 0.02806302246970377, 0.02158694036131059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 579.5000000000001, 296, 1475, 589.0, 1269.2000000000003, 1475.0, 1475.0, 0.15986731013258995, 24.1239029418083, 0.35443238362159407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 854.7, 142, 1512, 1146.5, 1508.8, 1512.0, 1512.0, 0.09119095385737734, 65.46741063286522, 0.14754411362392852], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b5118c6-f728-4fff-be16-ea2af13a836a", 1, 0, 0.0, 610.0, 610, 610, 610.0, 610.0, 610.0, 610.0, 1.639344262295082, 0.2961705942622951, 1.130251024590164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a418d93-70c4-4949-a2c3-8b892ca8892a", 1, 0, 0.0, 582.0, 582, 582, 582.0, 582.0, 582.0, 582.0, 1.7182130584192439, 0.31041935137457044, 1.1846273625429553], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 945.7499999999999, 177, 1632, 1042.0, 1511.0, 1628.0, 1632.0, 0.09491343104143762, 0.029660447200449257, 0.042822270645648614], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 372.0, 294, 617, 304.0, 610.6, 617.0, 617.0, 0.07484598998215211, 0.11599666611491738, 0.1683303856727503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 153.53333333333333, 146, 165, 152.0, 160.8, 165.0, 165.0, 0.1262562496843594, 0.09802120947174385, 0.04488015125498712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/efe9534f-a941-4912-9a6b-5ed43d627395", 3, 0, 0.0, 416.33333333333337, 226, 723, 300.0, 723.0, 723.0, 723.0, 0.019326534687908674, 0.026643188282322018, 0.012393643663795603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 544.5, 298, 1471, 443.5, 1187.5000000000005, 1471.0, 1471.0, 0.09738099231231166, 13.078766007000612, 0.2162437074296287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 173.3846153846154, 144, 447, 151.0, 329.7999999999999, 447.0, 447.0, 0.06359020515178493, 0.047257955195808915, 0.03191930219532955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 173.0769230769231, 146, 455, 149.0, 334.5999999999999, 455.0, 455.0, 0.06358958304799547, 0.01701518140151441, 0.03626593408205991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 170.07692307692304, 142, 436, 147.0, 323.5999999999999, 436.0, 436.0, 0.06359113833029238, 0.017139799003086615, 0.03738463405745704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 198.6153846153846, 142, 499, 150.0, 475.0, 499.0, 499.0, 0.06359176046451336, 0.017139966687700865, 0.03744710113291167], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 293.5, 159, 428, 293.5, 428.0, 428.0, 428.0, 0.0845880561664693, 0.02494686812722044, 0.052289296438842836], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1394.1818181818182, 1144, 2161, 1195.0, 1924.4, 1962.0, 2161.0, 0.24290925793429968, 290.6039214111261, 0.4796508979913613], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 945.7499999999999, 177, 1632, 1042.0, 1511.0, 1628.0, 1632.0, 0.09298541291334922, 0.029057941535421627, 0.04195240309176498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 147.0, 143, 151, 149.0, 151.0, 151.0, 151.0, 0.03492790879624455, 0.00941416291773779, 0.02056789941810104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 146.6, 143, 150, 146.0, 150.0, 150.0, 150.0, 0.034929372808181855, 0.009414557514705267, 0.02053465081106004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72d0658a-5541-457d-93ee-c63813d4947e", 1, 0, 0.0, 974.0, 974, 974, 974.0, 974.0, 974.0, 974.0, 1.026694045174538, 0.18548671714579057, 0.7078574178644764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 169.13333333333335, 145, 451, 150.0, 271.60000000000014, 451.0, 451.0, 0.12714234857346285, 0.03426883613894116, 0.07474579476682093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 267.6666666666667, 143, 460, 152.0, 456.4, 460.0, 460.0, 0.12681986506366358, 0.03418191675544057, 0.07468005725916907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 147.8, 143, 151, 149.0, 151.0, 151.0, 151.0, 0.034927664806186386, 0.009345879059467843, 0.019919683834778174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 169.79999999999998, 144, 453, 150.0, 275.4000000000001, 453.0, 453.0, 0.12714558169103624, 0.09449002701843612, 0.06382112205975843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59f0b3f2-f517-41a7-864b-b78c78ae23a4", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 148.8, 145, 152, 149.0, 152.0, 152.0, 152.0, 0.03492693285646428, 0.02595644131227472, 0.01753168309396742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 222.33333333333331, 143, 437, 148.0, 432.2, 437.0, 437.0, 0.126843458260046, 0.033940534729738875, 0.07234040978893248], "isController": false}, {"data": ["deleteAccount", 16, 2, 12.5, 617.8125, 142, 1142, 534.5, 1059.4, 1142.0, 1142.0, 0.09205877953073037, 0.017631863413539547, 0.0626498652201931], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 155.6, 151, 162, 153.0, 162.0, 162.0, 162.0, 0.034242822704361166, 0.02695284677706553, 0.012172253383190884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78afb4ab-1c5a-41b5-a244-1c39e492399b", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1314.0, 771, 2163, 1152.0, 2081.6000000000004, 2162.7, 2163.0, 0.09209153021040722, 0.047664561534683424, 0.042358506571388475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 299.4, 295, 304, 299.0, 304.0, 304.0, 304.0, 0.034890374443498524, 0.05407326586116422, 0.0784692698665792], "isController": false}, {"data": ["addBook", 61, 11, 18.0327868852459, 1343.655737704918, 743, 3926, 1162.0, 2251.0, 2379.9, 3926.0, 0.2658287975386868, 74.00973495833897, 0.9682681172130683], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 266.3999999999999, 147, 634, 152.0, 604.4, 612.1999999999999, 634.0, 0.24403446654065614, 0.18135764554437436, 0.11796587982189921], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 836.9272727272728, 712, 1173, 743.0, 1051.4, 1086.9999999999995, 1173.0, 0.24362046589092007, 71.63250593271204, 0.12252396477912483], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 224.14545454545453, 144, 612, 153.0, 451.8, 456.0, 612.0, 0.2442392834463495, 0.43218904453592316, 0.1187804327698067], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1122.9999999999995, 991, 1516, 1041.0, 1345.0, 1379.7999999999997, 1516.0, 0.24360320138898114, 219.1945888185577, 0.12227738819720345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 172.6666666666667, 145, 453, 154.0, 213.60000000000036, 453.0, 453.0, 0.09778622843949476, 0.07305318823848975, 0.03475994839060166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 11, 6.214689265536723, 228.71751412429373, 143, 2124, 158.0, 364.20000000000044, 466.5, 1501.559999999999, 0.7358994187641879, 1.5343337225908649, 0.35539969446661845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 178.76923076923077, 145, 434, 154.0, 328.3999999999999, 434.0, 434.0, 0.06149159693677245, 0.047619957393418504, 0.021858341098618332], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdada9f2-74e4-40e0-88a4-19e5af44d6a0", 3, 0, 0.0, 658.6666666666666, 258, 1275, 443.0, 1275.0, 1275.0, 1275.0, 0.05244480184605702, 0.03371695431183679, 0.03363159493383214], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d71314e5-b929-4733-b7a7-bca01a3f9f04", 1, 0, 0.0, 755.0, 755, 755, 755.0, 755.0, 755.0, 755.0, 1.3245033112582782, 0.23929014900662252, 0.9131829470198676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 173.125, 149, 445, 156.0, 246.20000000000022, 445.0, 445.0, 0.14598406948841708, 0.1184694938914791, 0.05189277470096076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 397.92307692307696, 299, 886, 305.0, 792.3999999999999, 886.0, 886.0, 0.06354264933744568, 0.0984786957993421, 0.1429089076407592], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb0b9c39-df45-4b94-a64d-ca1ceefda339", 1, 0, 0.0, 686.0, 686, 686, 686.0, 686.0, 686.0, 686.0, 1.4577259475218658, 0.2633586916909621, 1.0050337099125364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 441.06666666666666, 294, 897, 304.0, 726.0000000000001, 897.0, 897.0, 0.12666137503588737, 0.19630039275581376, 0.28486440108168815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c677ec7-2046-4fca-a944-53d8b46aaff3", 3, 0, 0.0, 345.3333333333333, 250, 475, 311.0, 475.0, 475.0, 475.0, 0.030637254901960783, 0.02554101881638072, 0.01964693755106209], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=004adc65-a6b2-49c8-96b8-8414195c40b1", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 628.0, 1.5923566878980893, 0.2876816281847134, 1.0978552945859872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 185.42857142857144, 151, 453, 162.5, 320.5, 453.0, 453.0, 0.07417729433020553, 0.06150051063119579, 0.026367710093940247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed8b6361-34a6-434c-84a9-3b4ef0b19548", 3, 0, 0.0, 510.66666666666663, 322, 828, 382.0, 828.0, 828.0, 828.0, 0.023976790466828112, 0.028339754617530234, 0.0153757412824386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=efe9534f-a941-4912-9a6b-5ed43d627395", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59f0b3f2-f517-41a7-864b-b78c78ae23a4", 3, 0, 0.0, 308.0, 224, 464, 236.0, 464.0, 464.0, 464.0, 0.0570928329463708, 0.026502076751798425, 0.03661226591938492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 181.86363636363637, 150, 451, 154.5, 359.4999999999998, 449.2, 451.0, 0.13913835411976017, 0.10802245266133724, 0.049459336816008496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ca1b446-ff7d-4c1c-b66a-0d13cdfb24d9", 1, 0, 0.0, 567.0, 567, 567, 567.0, 567.0, 567.0, 567.0, 1.763668430335097, 0.3186315035273369, 1.2159667107583776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a418d93-70c4-4949-a2c3-8b892ca8892a", 3, 0, 0.0, 368.6666666666667, 222, 594, 290.0, 594.0, 594.0, 594.0, 0.03043615002992888, 0.02537336595919527, 0.019517973814765593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 166.55555555555554, 145, 444, 150.5, 183.9000000000004, 444.0, 444.0, 0.09791602069291903, 0.07276766772198379, 0.04914925257437538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 213.27777777777777, 145, 447, 150.5, 440.7, 447.0, 447.0, 0.09776445284494557, 0.04247492070216602, 0.054843991016533054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b5118c6-f728-4fff-be16-ea2af13a836a", 3, 0, 0.0, 452.33333333333337, 253, 799, 305.0, 799.0, 799.0, 799.0, 0.01612833856608318, 0.02223421674067782, 0.010342717114317663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 356.55555555555554, 145, 1320, 153.5, 1040.1000000000004, 1320.0, 1320.0, 0.09746324823347863, 9.76752857906706, 0.05636709126350272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 297.77777777777777, 147, 749, 150.0, 725.6, 749.0, 749.0, 0.09761441222566283, 3.2124843749152654, 0.05654984232560914], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 29.62962962962963, 0.6046863189720333], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.407407407407407, 0.15117157974300832], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.407407407407407, 0.15117157974300832], "isController": false}, {"data": ["401/Unauthorized", 15, 55.55555555555556, 1.1337868480725624], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1323, 27, "401/Unauthorized", 15, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
