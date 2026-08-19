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

    var data = {"OkPercent": 98.43283582089552, "KoPercent": 1.5671641791044777};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7463070006422607, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/14142b55-152a-4f88-968d-c63335536b69"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=573134c4-c3c8-44d7-bfbd-2668039bcf65"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aa0b1a31-2c89-44cc-813c-16b323430b38"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/04e6ba7e-d7fc-45a6-81d2-0b66dd603174"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/383136bb-7ffd-4da9-8f0d-fd69cc746e25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15177029-54cb-4c7f-b69e-154057720ba9"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a88889a6-f197-4ebf-94b3-c58221ddc52a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7725efe2-9aa0-4376-8b58-635ad3299bed"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e6ede02e-eae5-4f09-a2de-5247d6d5c8ee"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ccf3221f-4f6c-44f2-a7d5-d6d7a7887b95"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/573134c4-c3c8-44d7-bfbd-2668039bcf65"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9807905d-b1d9-48b8-a2fe-721b3fec55d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/634f4fa5-57b1-48d6-8091-605079ea2e7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a2f36caf-e2c4-45dc-932f-3df24a67fb22"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5487e964-0525-492f-9998-e5c24f258885"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a2ed6596-ddfd-4067-90cf-1e4d2eef708b"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/15177029-54cb-4c7f-b69e-154057720ba9"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=383136bb-7ffd-4da9-8f0d-fd69cc746e25"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04e6ba7e-d7fc-45a6-81d2-0b66dd603174"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2807017543859649, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14142b55-152a-4f88-968d-c63335536b69"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa0b1a31-2c89-44cc-813c-16b323430b38"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2903225806451613, 500, 1500, "addBook"], "isController": true}, {"data": [0.9035087719298246, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.43859649122807015, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9281767955801105, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a88889a6-f197-4ebf-94b3-c58221ddc52a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ccf3221f-4f6c-44f2-a7d5-d6d7a7887b95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9807905d-b1d9-48b8-a2fe-721b3fec55d1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=634f4fa5-57b1-48d6-8091-605079ea2e7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/16b25ec2-69ac-4b78-8c62-61a9298d141b"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7725efe2-9aa0-4376-8b58-635ad3299bed"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2ed6596-ddfd-4067-90cf-1e4d2eef708b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5487e964-0525-492f-9998-e5c24f258885"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1340, 21, 1.5671641791044777, 439.6895522388065, 124, 3815, 141.0, 1279.0, 1510.95, 2142.979999999998, 5.326591617375819, 735.8231438045577, 3.8969373154077624], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2147.228070175438, 1519, 3003, 2127.0, 2533.2000000000003, 2743.3999999999983, 3003.0, 0.2521644111960999, 303.439923833629, 1.2398904398167605], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/14142b55-152a-4f88-968d-c63335536b69", 3, 0, 0.0, 526.0, 329, 627, 622.0, 627.0, 627.0, 627.0, 0.03100326567731801, 0.02584614693997768, 0.01988165149229052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=573134c4-c3c8-44d7-bfbd-2668039bcf65", 1, 0, 0.0, 312.0, 312, 312, 312.0, 312.0, 312.0, 312.0, 3.205128205128205, 0.5790514823717948, 2.209785657051282], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 596.7142857142857, 132, 1485, 532.0, 1096.5, 1485.0, 1485.0, 0.07475158446662075, 0.01411499296534196, 0.05055221898743639], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 596.7142857142857, 132, 1485, 532.0, 1096.5, 1485.0, 1485.0, 0.07651067597182222, 0.014447154007793159, 0.051741838975084845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 165.7142857142857, 125, 392, 129.0, 382.8, 391.2, 392.0, 0.10205966116192494, 0.04190786867837599, 0.057389575091610696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 164.66666666666669, 127, 470, 131.0, 351.2000000000001, 461.39999999999986, 470.0, 0.1020423038236709, 0.07583417305645855, 0.05122045328649106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 273.14285714285717, 127, 999, 130.0, 877.2000000000005, 999.0, 999.0, 0.10206164523372117, 2.8829377229560937, 0.0592654280149496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 272.5238095238095, 124, 1392, 130.0, 978.0000000000006, 1365.2999999999997, 1392.0, 0.10206114920854009, 8.771060363702196, 0.05916547089070223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aa0b1a31-2c89-44cc-813c-16b323430b38", 1, 0, 0.0, 709.0, 709, 709, 709.0, 709.0, 709.0, 709.0, 1.4104372355430184, 0.2548153208744711, 0.9724303596614952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04e6ba7e-d7fc-45a6-81d2-0b66dd603174", 3, 0, 0.0, 365.6666666666667, 219, 508, 370.0, 508.0, 508.0, 508.0, 0.02082711412564304, 0.024616943811917275, 0.013355929305832286], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 298.14285714285717, 131, 622, 261.0, 518.5, 622.0, 622.0, 0.0748438970147977, 0.1533475018844624, 0.04838018928823454], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/383136bb-7ffd-4da9-8f0d-fd69cc746e25", 3, 0, 0.0, 482.6666666666667, 371, 626, 451.0, 626.0, 626.0, 626.0, 0.047878961984104185, 0.031062100011171757, 0.030703631220275144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 129.8421052631579, 126, 137, 129.0, 136.0, 137.0, 137.0, 0.1401572712116965, 0.10415984706259865, 0.07035238027618358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 839.0, 627, 1045, 781.0, 1045.0, 1045.0, 1045.0, 0.029686451697174442, 8.728802481935794, 0.016930554483544802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 183.94736842105263, 125, 399, 131.0, 387.0, 399.0, 399.0, 0.1401572712116965, 0.048582475177409594, 0.07931391632610908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1279.0, 1113, 1391, 1379.0, 1391.0, 1391.0, 1391.0, 0.02962699611886351, 26.6584231864575, 0.01686771361064202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 234.6, 129, 395, 136.0, 395.0, 395.0, 395.0, 0.029848786049871352, 0.05281835968981142, 0.016527599306911188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 147.93333333333334, 126, 398, 129.0, 245.60000000000008, 398.0, 398.0, 0.07325256017697819, 0.05443867020964883, 0.03676935149508476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 179.53333333333333, 125, 390, 129.0, 389.4, 390.0, 390.0, 0.07325220244955365, 0.026935445275721292, 0.041366510680171116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 261.86666666666673, 126, 1379, 129.0, 780.8000000000004, 1379.0, 1379.0, 0.07325363338021566, 4.412677739258576, 0.042645442036841695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 230.79999999999998, 125, 1154, 127.0, 697.4000000000003, 1154.0, 1154.0, 0.07316073902101176, 1.452516927565991, 0.04266280855541682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 129.6, 127, 132, 129.0, 132.0, 132.0, 132.0, 0.02984807330686804, 0.022182015416529866, 0.016760392726024538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15177029-54cb-4c7f-b69e-154057720ba9", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.31148976293103453, 1.1887122844827587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 837.9999999999999, 129, 1636, 1287.0, 1632.0, 1636.0, 1636.0, 0.14478928899942084, 68.99100662890079, 0.07853288526726399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 217.52631578947364, 126, 1027, 131.0, 393.0, 1027.0, 1027.0, 0.1398817630991909, 6.6602369178341885, 0.0816024882388886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 607.2941176470587, 127, 1288, 769.0, 1163.1999999999998, 1288.0, 1288.0, 0.1447831233978044, 22.555976375865505, 0.07867093084902527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 210.36842105263156, 125, 650, 131.0, 389.0, 650.0, 650.0, 0.1401583051172535, 2.2047990618614497, 0.08190068723674213], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 648.2857142857142, 144, 1943, 528.5, 1579.5, 1943.0, 1943.0, 0.07651234854653864, 0.014447469832274, 0.05236207112096056], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 463.2, 256, 1511, 272.0, 1079.6000000000004, 1511.0, 1511.0, 0.07311509290491137, 5.937164508349744, 0.16319041211322116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a88889a6-f197-4ebf-94b3-c58221ddc52a", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7725efe2-9aa0-4376-8b58-635ad3299bed", 2, 0, 0.0, 277.0, 225, 329, 277.0, 329.0, 329.0, 329.0, 0.02293341283583116, 0.026404779036567325, 0.014254997333990757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 577.0952380952381, 159, 1895, 578.0, 1043.0, 1811.7999999999988, 1895.0, 0.0917904380589382, 0.05638299369050012, 0.04150290314578944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 130.41176470588235, 127, 135, 131.0, 134.2, 135.0, 135.0, 0.14479668841456142, 0.10760769519871216, 0.07268115023934041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 191.9411764705882, 125, 403, 132.0, 397.4, 403.0, 403.0, 0.1447868226957603, 0.15386926814519564, 0.07613617732979032], "isController": false}, {"data": ["login", 21, 0, 0.0, 3107.7619047619055, 1796, 5156, 2973.0, 5006.2, 5146.3, 5156.0, 0.09192302978306165, 26.31019299869338, 0.17498461793943584], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 150.26315789473685, 127, 396, 134.0, 165.0, 396.0, 396.0, 0.14050032906656018, 0.11374489530876797, 0.04994347634787882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6ede02e-eae5-4f09-a2de-5247d6d5c8ee", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ccf3221f-4f6c-44f2-a7d5-d6d7a7887b95", 3, 0, 0.0, 469.0, 259, 789, 359.0, 789.0, 789.0, 789.0, 0.025727664099617513, 0.025803038115534364, 0.016498534595132328], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/573134c4-c3c8-44d7-bfbd-2668039bcf65", 3, 0, 0.0, 435.3333333333333, 290, 509, 507.0, 509.0, 509.0, 509.0, 0.10264481472610941, 0.047646974544085945, 0.06582366048516783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 985.5882352941179, 260, 1769, 1419.0, 1761.0, 1769.0, 1769.0, 0.1446242322154731, 91.70475680797304, 0.30567321782536194], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9807905d-b1d9-48b8-a2fe-721b3fec55d1", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/634f4fa5-57b1-48d6-8091-605079ea2e7c", 3, 0, 0.0, 343.3333333333333, 228, 485, 317.0, 485.0, 485.0, 485.0, 0.04286694101508916, 0.027559312664323276, 0.027489542252514862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2f36caf-e2c4-45dc-932f-3df24a67fb22", 1, 0, 0.0, 327.0, 327, 327, 327.0, 327.0, 327.0, 327.0, 3.058103975535168, 0.9765625, 1.8247085244648318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 477.33333333333337, 257, 1522, 275.0, 1380.2000000000005, 1520.8, 1522.0, 0.1019773901557826, 11.762079957861486, 0.2268646004307331], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1043.5714285714287, 128, 1520, 1262.0, 1520.0, 1520.0, 1520.0, 0.041445132565216876, 35.41944509408045, 0.07459892583097491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5487e964-0525-492f-9998-e5c24f258885", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.7314334514170041, 2.791308198380567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2ed6596-ddfd-4067-90cf-1e4d2eef708b", 3, 0, 0.0, 388.6666666666667, 223, 483, 460.0, 483.0, 483.0, 483.0, 0.027986118885033023, 0.02806810946770402, 0.017946827540206725], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1327.2272727272727, 196, 3082, 1221.5, 2977.1, 3073.6, 3082.0, 0.09315165936978669, 0.029308370100011007, 0.042027408817227975], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 151.3125, 128, 382, 134.0, 227.30000000000015, 382.0, 382.0, 0.0836710681134789, 0.06495947182638254, 0.029742449993463198], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15177029-54cb-4c7f-b69e-154057720ba9", 3, 0, 0.0, 530.0, 404, 771, 415.0, 771.0, 771.0, 771.0, 0.016749015995310274, 0.023089870683639, 0.010740742679284258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 415.94736842105266, 254, 1158, 270.0, 526.0, 1158.0, 1158.0, 0.13975109594280502, 9.004708439679014, 0.31242156239886437], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=383136bb-7ffd-4da9-8f0d-fd69cc746e25", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 497.71428571428567, 255, 1616, 510.0, 1132.0, 1616.0, 1616.0, 0.07683484350388839, 6.676372282310424, 0.17139915563995192], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04e6ba7e-d7fc-45a6-81d2-0b66dd603174", 1, 0, 0.0, 594.0, 594, 594, 594.0, 594.0, 594.0, 594.0, 1.6835016835016834, 0.3041482533670034, 1.1606954966329968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 130.72727272727275, 127, 138, 128.0, 137.6, 138.0, 138.0, 0.06381583909126246, 0.04742563823090891, 0.03203255985635635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 154.8181818181818, 127, 387, 132.0, 337.60000000000014, 387.0, 387.0, 0.06372267890142101, 0.017050794940419296, 0.036341840310966676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 130.54545454545453, 125, 141, 130.0, 140.2, 141.0, 141.0, 0.06381769026374111, 0.017200861828898968, 0.03751782181520717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 154.99999999999997, 125, 390, 131.0, 340.20000000000016, 390.0, 390.0, 0.06381806051112465, 0.017200961622139063, 0.03758036180489078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 144.0, 144, 144, 144.0, 144.0, 144.0, 144.0, 6.944444444444444, 2.048068576388889, 4.292805989583334], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1484.315789473684, 1001, 2438, 1418.0, 2005.0, 2208.9999999999986, 2438.0, 0.23960754805812795, 286.6539285391506, 0.47313131071634246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1327.2272727272727, 196, 3082, 1221.5, 2977.1, 3073.6, 3082.0, 0.09468922565733691, 0.029792135629403586, 0.0427211154821188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 215.33333333333334, 127, 388, 131.5, 388.0, 388.0, 388.0, 0.03259452411994785, 0.008785242829204693, 0.0191938457464146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 173.66666666666669, 126, 390, 129.5, 390.0, 390.0, 390.0, 0.032594347053742645, 0.008785195104329072, 0.019161911060891674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14142b55-152a-4f88-968d-c63335536b69", 1, 0, 0.0, 1216.0, 1216, 1216, 1216.0, 1216.0, 1216.0, 1216.0, 0.8223684210526315, 0.14857241981907895, 0.5669844777960527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 254.31249999999994, 125, 1376, 130.0, 681.6000000000007, 1376.0, 1376.0, 0.08164598301763554, 4.612205699718832, 0.04756037975587851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 263.75, 126, 1002, 131.5, 572.9000000000004, 1002.0, 1002.0, 0.08175069104881026, 1.5229958147478246, 0.04770120888834388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 144.9375, 126, 375, 130.5, 206.30000000000018, 375.0, 375.0, 0.08174943797261394, 0.06075324443081954, 0.04103438585734723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 173.83333333333331, 129, 381, 132.0, 381.0, 381.0, 381.0, 0.03264027156705944, 0.008733822665404576, 0.018615154878088586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 128.62499999999997, 125, 133, 129.0, 132.3, 133.0, 133.0, 0.08175069104881026, 0.029548803246524317, 0.046194329695427576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 132.0, 127, 141, 131.5, 141.0, 141.0, 141.0, 0.03263831847383223, 0.02425562535018196, 0.01638290595268532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 176.33333333333331, 131, 384, 134.0, 384.0, 384.0, 384.0, 0.0322318977604203, 0.025370028901268323, 0.011457432407024404], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 562.1538461538462, 128, 1121, 495.0, 988.1999999999998, 1121.0, 1121.0, 0.07225634327321236, 0.013537208542923047, 0.049176868243337134], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/aa0b1a31-2c89-44cc-813c-16b323430b38", 3, 0, 0.0, 355.6666666666667, 222, 478, 367.0, 478.0, 478.0, 478.0, 0.04162619675315665, 0.026761633654780077, 0.026693882683502153], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1777.0952380952378, 1007, 3815, 1612.0, 2696.8, 3704.3999999999983, 3815.0, 0.09156311314584696, 0.04739106442119032, 0.04211545536298234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 351.16666666666663, 259, 521, 274.5, 521.0, 521.0, 521.0, 0.032569223169745365, 0.05047593473670497, 0.07324894624992535], "isController": false}, {"data": ["addBook", 62, 11, 17.741935483870968, 1246.3870967741932, 673, 2491, 1047.5, 2115.3, 2238.0, 2491.0, 0.2905233168391063, 85.21326007577036, 1.0571556302950218], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 221.7017543859649, 126, 713, 131.0, 523.2, 576.8999999999997, 713.0, 0.24086610380061357, 0.17900303221901068, 0.11643429822392942], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 818.7719298245615, 621, 1157, 765.0, 1032.8, 1127.1999999999998, 1157.0, 0.2408538904241564, 70.81904088653246, 0.12113257184418022], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 206.21052631578945, 126, 524, 133.0, 392.8, 398.0, 524.0, 0.24148449415353332, 0.4273143587951195, 0.11744070125826131], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1259.631578947368, 871, 1922, 1283.0, 1572.4, 1711.599999999999, 1922.0, 0.24035521971418813, 216.27204919823612, 0.12064705364559834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 152.42857142857142, 131, 382, 134.5, 261.5, 382.0, 382.0, 0.07805400221896377, 0.058311827829596964, 0.02774575860127228], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 11, 6.077348066298343, 194.6243093922653, 127, 653, 138.0, 356.00000000000006, 428.10000000000014, 605.4400000000004, 0.7586108619663529, 1.606371106618356, 0.36557754752843746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 157.0909090909091, 129, 381, 135.0, 334.8000000000002, 381.0, 381.0, 0.06681771519860048, 0.05174457827391618, 0.02375160969950251], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a88889a6-f197-4ebf-94b3-c58221ddc52a", 3, 0, 0.0, 458.6666666666667, 263, 650, 463.0, 650.0, 650.0, 650.0, 0.02624809701296656, 0.031024362061875515, 0.016832275753757852], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 160.19047619047623, 128, 390, 135.0, 342.8000000000002, 390.0, 390.0, 0.10744490890206652, 0.08719406181407938, 0.03819330746128146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ccf3221f-4f6c-44f2-a7d5-d6d7a7887b95", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9807905d-b1d9-48b8-a2fe-721b3fec55d1", 3, 0, 0.0, 345.3333333333333, 239, 495, 302.0, 495.0, 495.0, 495.0, 0.018139821746018307, 0.024995398909796712, 0.011632633085825543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=634f4fa5-57b1-48d6-8091-605079ea2e7c", 1, 0, 0.0, 1943.0, 1943, 1943, 1943.0, 1943.0, 1943.0, 1943.0, 0.514668039114771, 0.09298201878538342, 0.35483948790530107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16b25ec2-69ac-4b78-8c62-61a9298d141b", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 311.27272727272725, 255, 524, 267.0, 522.6, 524.0, 524.0, 0.06367251489068587, 0.09867996204249851, 0.14320097831372028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7725efe2-9aa0-4376-8b58-635ad3299bed", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 464.81249999999994, 255, 1752, 386.0, 888.200000000001, 1752.0, 1752.0, 0.08159019285881837, 6.219185559364514, 0.18219353002519098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2ed6596-ddfd-4067-90cf-1e4d2eef708b", 1, 0, 0.0, 865.0, 865, 865, 865.0, 865.0, 865.0, 865.0, 1.1560693641618498, 0.20886018786127167, 0.7970556358381503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 144.66666666666669, 128, 215, 133.0, 201.20000000000002, 215.0, 215.0, 0.07291145147256828, 0.060450998340049286, 0.025917742515639504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 149.35294117647055, 129, 380, 133.0, 207.99999999999983, 380.0, 380.0, 0.14234637058621585, 0.11051305138285311, 0.05059968641931891], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5487e964-0525-492f-9998-e5c24f258885", 3, 0, 0.0, 1513.6666666666667, 415, 3005, 1121.0, 3005.0, 3005.0, 3005.0, 0.06201935003721161, 0.0280621408045977, 0.0397715232986025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 129.7857142857143, 127, 136, 129.0, 134.5, 136.0, 136.0, 0.07688843488098769, 0.05714072162542152, 0.038594390164870776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 172.92857142857142, 126, 469, 130.0, 433.5, 469.0, 469.0, 0.07689181321880115, 0.02882370286257236, 0.04339109716379055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 354.28571428571433, 125, 1488, 376.0, 949.5, 1488.0, 1488.0, 0.0768926578496419, 4.96125524002867, 0.04473247533942616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 265.3571428571429, 126, 874, 131.0, 696.5, 874.0, 874.0, 0.07689223553190204, 1.634163820967414, 0.044807319728899946], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 28.571428571428573, 0.44776119402985076], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.761904761904762, 0.07462686567164178], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.761904761904762, 0.07462686567164178], "isController": false}, {"data": ["401/Unauthorized", 13, 61.904761904761905, 0.9701492537313433], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1340, 21, "401/Unauthorized", 13, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
