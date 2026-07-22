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

    var data = {"OkPercent": 98.75195007800312, "KoPercent": 1.24804992199688};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7314132618888145, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd2a44da-034f-4a8f-9102-0eb5ef99dde9"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/418b9b69-2c0d-4f96-baf5-56ee5acf766d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5f08fc9-133a-474d-98e0-fdcc8731e198"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce508198-572c-435c-8dd4-6d282731c20b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a46bca06-51f0-4772-b3d4-31a5b306750b"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3dbfe775-28b2-4dfc-b6b5-67bba311a738"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/18c97d6a-5c67-4795-bb91-da97f2362793"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6052631578947368, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f624607e-f3be-4478-8632-c76f29d3cda0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/60f6d75f-08a7-49ec-a8a7-580b34e80513"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f624607e-f3be-4478-8632-c76f29d3cda0"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=038a5c73-0f9c-4ced-a0c5-daba85a9cbf1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ee916cb5-eedd-409f-af13-6138c40d1123"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7861af60-c91c-4f6c-922a-84bab516b479"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/df213ef9-a920-4fa5-829b-1c3f419ca334"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ff751eee-7d41-4054-9386-6f43fb06d7f8"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18c97d6a-5c67-4795-bb91-da97f2362793"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/68e2e041-94a1-4ad8-b7d9-e96684942e14"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83020059-2973-4417-bfe4-077894cd26ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3148148148148148, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a46bca06-51f0-4772-b3d4-31a5b306750b"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ce508198-572c-435c-8dd4-6d282731c20b"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3f8aa15-85c0-4309-bbe8-547667d7a718"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3050847457627119, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c5f08fc9-133a-474d-98e0-fdcc8731e198"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd2a44da-034f-4a8f-9102-0eb5ef99dde9"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3dbfe775-28b2-4dfc-b6b5-67bba311a738"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4074074074074074, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9505813953488372, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/038a5c73-0f9c-4ced-a0c5-daba85a9cbf1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c3f8aa15-85c0-4309-bbe8-547667d7a718"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df213ef9-a920-4fa5-829b-1c3f419ca334"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/83020059-2973-4417-bfe4-077894cd26ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60f6d75f-08a7-49ec-a8a7-580b34e80513"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1282, 16, 1.24804992199688, 471.3689547581901, 125, 4594, 149.5, 1258.7, 1573.85, 2256.2700000000023, 5.022349848585163, 696.9123609500547, 3.666171387443734], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2185.0185185185187, 1572, 3234, 2117.0, 2760.0, 2885.5, 3234.0, 0.2391454535792103, 287.77269051644345, 1.175876326925121], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fd2a44da-034f-4a8f-9102-0eb5ef99dde9", 3, 0, 0.0, 336.6666666666667, 234, 449, 327.0, 449.0, 449.0, 449.0, 0.0196031025176918, 0.02702445936276848, 0.012570999986931265], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 753.7692307692308, 147, 1831, 516.0, 1702.1999999999998, 1831.0, 1831.0, 0.08554882863911555, 0.01620749292576994, 0.05783157368715451], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 753.7692307692308, 147, 1831, 516.0, 1702.1999999999998, 1831.0, 1831.0, 0.0858403106098624, 0.016262715096009087, 0.05802861742624337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 12, 0, 0.0, 194.75, 127, 395, 133.0, 391.1, 395.0, 395.0, 0.10175873005104896, 0.027228410189440836, 0.05803427573223886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/418b9b69-2c0d-4f96-baf5-56ee5acf766d", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.6261488970588235, 1.1699601715686274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 12, 0, 0.0, 176.66666666666666, 128, 393, 133.0, 392.4, 393.0, 393.0, 0.10175269008674417, 0.07561894253516827, 0.05107508076619775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 12, 0, 0.0, 225.58333333333331, 126, 510, 131.0, 477.60000000000014, 510.0, 510.0, 0.10154346060113728, 0.027369135865150284, 0.059795612053208776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 12, 0, 0.0, 270.08333333333337, 127, 520, 256.0, 483.40000000000015, 520.0, 520.0, 0.10154346060113728, 0.027369135865150284, 0.05969644851746547], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5f08fc9-133a-474d-98e0-fdcc8731e198", 1, 0, 0.0, 814.0, 814, 814, 814.0, 814.0, 814.0, 814.0, 1.2285012285012284, 0.22194602272727273, 0.8469940110565111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce508198-572c-435c-8dd4-6d282731c20b", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a46bca06-51f0-4772-b3d4-31a5b306750b", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.32032635195035464, 1.2224346187943265], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 331.49999999999994, 128, 620, 288.0, 596.0, 620.0, 620.0, 0.08587692609677103, 0.19912951850647756, 0.05551210059561782], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3dbfe775-28b2-4dfc-b6b5-67bba311a738", 3, 0, 0.0, 982.6666666666666, 296, 2162, 490.0, 2162.0, 2162.0, 2162.0, 0.02205363443895554, 0.022118244696100915, 0.014142467397377087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 182.6111111111111, 128, 514, 133.5, 410.50000000000017, 514.0, 514.0, 0.1111536513974484, 0.08260539913423656, 0.05579392267410985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18c97d6a-5c67-4795-bb91-da97f2362793", 3, 0, 0.0, 1482.0, 572, 2086, 1788.0, 2086.0, 2086.0, 2086.0, 0.021218808351722965, 0.02507991312666214, 0.013607113428676513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 203.94444444444446, 126, 399, 134.0, 396.3, 399.0, 399.0, 0.11115982930790655, 0.029743938701529683, 0.06339584015216546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 769.8, 625, 1053, 757.0, 1053.0, 1053.0, 1053.0, 0.040912177918879335, 12.029538720307988, 0.02333272646936087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1261.6, 1059, 1548, 1133.0, 1548.0, 1548.0, 1548.0, 0.040767405643839634, 36.682583259782135, 0.02321034911167823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 289.8, 131, 405, 377.0, 405.0, 405.0, 405.0, 0.04107822114871138, 0.07268919601705569, 0.022745460343085305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 131.21428571428572, 127, 140, 130.5, 138.5, 140.0, 140.0, 0.06599353263380188, 0.04904402181086254, 0.03312565993532634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 187.14285714285714, 125, 408, 131.0, 399.0, 408.0, 408.0, 0.06590778559255807, 0.03177696805355478, 0.03679728765923792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 353.0, 128, 1451, 134.5, 1291.5, 1451.0, 1451.0, 0.0659152330103487, 8.488177117173743, 0.03794172034049926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 349.2857142857143, 128, 1055, 259.0, 1010.5, 1055.0, 1055.0, 0.06599477698479292, 2.787340227823398, 0.03805195497742036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 133.4, 131, 136, 133.0, 136.0, 136.0, 136.0, 0.04107788366743346, 0.030527606905192246, 0.02306619444216234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 838.8947368421052, 125, 1719, 1075.0, 1704.0, 1719.0, 1719.0, 0.0853295967952, 40.42127383334232, 0.04630498987272417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 173.44444444444446, 128, 394, 132.0, 380.5, 394.0, 394.0, 0.11115708348514508, 0.029960307658105513, 0.06534820728325913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 613.7894736842106, 128, 1134, 911.0, 1050.0, 1134.0, 1134.0, 0.08532729754975929, 13.215661657056119, 0.04638706960237479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 187.5, 127, 398, 131.5, 381.8, 398.0, 398.0, 0.11115982930790655, 0.029961047743146688, 0.065458376047527], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 744.230769230769, 134, 1811, 560.0, 1803.8, 1811.0, 1811.0, 0.08582557602165446, 0.016259923582227505, 0.058702063527431174], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 562.5, 258, 1579, 525.0, 1419.5, 1579.0, 1579.0, 0.06586685485768054, 11.34459171371442, 0.14572857856974827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f624607e-f3be-4478-8632-c76f29d3cda0", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60f6d75f-08a7-49ec-a8a7-580b34e80513", 3, 0, 0.0, 954.3333333333334, 222, 2359, 282.0, 2359.0, 2359.0, 2359.0, 0.02831631208351424, 0.028399270029071413, 0.018158572527514016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f624607e-f3be-4478-8632-c76f29d3cda0", 3, 0, 0.0, 1713.3333333333333, 225, 4594, 321.0, 4594.0, 4594.0, 4594.0, 0.0249912530614285, 0.025064469623131903, 0.016026291839522835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 855.8636363636364, 152, 2755, 748.5, 1670.9, 2592.6999999999975, 2755.0, 0.10156361806539774, 0.0623862458624367, 0.04592183121511636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 145.42105263157893, 127, 390, 131.0, 138.0, 390.0, 390.0, 0.08532691435423244, 0.06341189631208094, 0.04283011130671433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 206.21052631578948, 126, 531, 132.0, 402.0, 531.0, 531.0, 0.08532806395113846, 0.09028389825751112, 0.04489196456639871], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=038a5c73-0f9c-4ced-a0c5-daba85a9cbf1", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 0.5846733414239482, 2.2312398867313914], "isController": false}, {"data": ["login", 22, 0, 0.0, 3271.6818181818176, 1781, 6006, 3182.0, 4914.4, 5866.199999999998, 6006.0, 0.09935015963764288, 27.149993374303985, 0.18733996721444732], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 135.61111111111111, 129, 145, 135.0, 143.2, 145.0, 145.0, 0.11009982384028186, 0.08913354879257193, 0.03913704675572519], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee916cb5-eedd-409f-af13-6138c40d1123", 1, 0, 0.0, 843.0, 843, 843, 843.0, 843.0, 843.0, 843.0, 1.1862396204033216, 0.3788089412811388, 0.7078050860023725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 987.1052631578948, 257, 1858, 1207.0, 1834.0, 1858.0, 1858.0, 0.0852763627387177, 53.75743275369718, 0.18030498221539012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7861af60-c91c-4f6c-922a-84bab516b479", 2, 0, 0.0, 325.5, 230, 421, 325.5, 421.0, 421.0, 421.0, 0.024922739507526666, 0.02869522449157611, 0.01549152704740305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df213ef9-a920-4fa5-829b-1c3f419ca334", 3, 0, 0.0, 424.6666666666667, 232, 580, 462.0, 580.0, 580.0, 580.0, 0.03854257669972763, 0.0321313603281258, 0.024716431021635232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 12, 0, 0.0, 545.8333333333334, 267, 789, 527.5, 783.6, 789.0, 789.0, 0.10142759337677815, 0.15719295965717472, 0.22811303471359382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1033.4285714285716, 128, 1679, 1264.0, 1679.0, 1679.0, 1679.0, 0.05701254275940707, 48.72351716484769, 0.10261939546343052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff751eee-7d41-4054-9386-6f43fb06d7f8", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1340.217391304348, 439, 2481, 1289.0, 2217.0, 2434.9999999999995, 2481.0, 0.09134451178344202, 0.02877786504046959, 0.04121207465229513], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 165.61111111111114, 128, 398, 136.0, 383.6, 398.0, 398.0, 0.10116735891368739, 0.07854301790662253, 0.03596183461384981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 430.3888888888889, 262, 895, 278.0, 791.5000000000001, 895.0, 895.0, 0.11106175033318524, 0.17212402126832518, 0.24978047950910706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18c97d6a-5c67-4795-bb91-da97f2362793", 1, 0, 0.0, 1811.0, 1811, 1811, 1811.0, 1811.0, 1811.0, 1811.0, 0.5521811154058531, 0.09975928354500277, 0.3807029955825511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 397.78571428571433, 263, 540, 401.5, 537.0, 540.0, 540.0, 0.12123626349835899, 0.1878925294647419, 0.2726631980827351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 162.0, 127, 393, 135.0, 393.0, 393.0, 393.0, 0.044641307097471813, 0.033175815137867236, 0.022407843601660656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 186.11111111111111, 125, 381, 133.0, 381.0, 381.0, 381.0, 0.04458668146283948, 0.011930420625798844, 0.025428341771775637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68e2e041-94a1-4ad8-b7d9-e96684942e14", 1, 0, 0.0, 779.0, 779, 779, 779.0, 779.0, 779.0, 779.0, 1.2836970474967906, 0.4099306001283697, 0.7659559531450577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 174.33333333333337, 126, 509, 134.0, 509.0, 509.0, 509.0, 0.04464108567120353, 0.012032167622316575, 0.026244075755922382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83020059-2973-4417-bfe4-077894cd26ce", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 217.77777777777777, 127, 401, 133.0, 401.0, 401.0, 401.0, 0.044641307097471813, 0.01203222730361545, 0.026287800956812015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 134.0, 7.462686567164179, 2.200909514925373, 4.613164645522388], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1468.2777777777783, 1022, 2676, 1314.5, 2111.0, 2230.25, 2676.0, 0.24475144131404328, 292.8078131798651, 0.4832884905634722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1340.217391304348, 439, 2481, 1289.0, 2217.0, 2434.9999999999995, 2481.0, 0.09161083716372848, 0.028861770200189592, 0.04133223317347906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 187.0, 128, 400, 129.0, 400.0, 400.0, 400.0, 0.04316919446283132, 0.011635446945060005, 0.025420922129968056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 130.77777777777777, 127, 134, 131.0, 134.0, 134.0, 134.0, 0.04322496674078948, 0.011650479316853415, 0.02541155271284694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 377.77777777777777, 127, 1453, 134.0, 1444.0, 1453.0, 1453.0, 0.09502491764507137, 14.271941476198897, 0.054503224248247314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 310.61111111111114, 126, 1081, 131.5, 1027.0, 1081.0, 1081.0, 0.09532383625483239, 4.692806111979029, 0.054767763994068734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 131.33333333333334, 127, 134, 133.0, 134.0, 134.0, 134.0, 0.043224343950512924, 0.011565888908633342, 0.024651383659276903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 159.33333333333331, 129, 381, 133.0, 376.5, 381.0, 381.0, 0.09565157320268038, 0.07108481172582008, 0.04801260608025167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 131.66666666666666, 127, 142, 129.0, 142.0, 142.0, 142.0, 0.043222475687357424, 0.032121390623124024, 0.021695656741505583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 175.83333333333331, 126, 411, 131.0, 395.70000000000005, 411.0, 411.0, 0.09550844984479878, 0.04946417438251134, 0.05313279322420608], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 220.55555555555554, 128, 565, 140.0, 565.0, 565.0, 565.0, 0.04435988683299981, 0.03491608280019321, 0.015768553522667903], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a46bca06-51f0-4772-b3d4-31a5b306750b", 3, 0, 0.0, 1719.3333333333333, 250, 4554, 354.0, 4554.0, 4554.0, 4554.0, 0.023941582538605802, 0.024011723893699374, 0.015353163281592912], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 1751.3846153846155, 128, 4594, 1180.0, 4578.0, 4594.0, 4594.0, 0.085564031513891, 0.016030400735850672, 0.05823393370762112], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ce508198-572c-435c-8dd4-6d282731c20b", 3, 0, 0.0, 411.0, 294, 540, 399.0, 540.0, 540.0, 540.0, 0.05588465407399128, 0.03625589699526843, 0.03583748975448008], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1714.1818181818182, 1089, 3925, 1359.0, 3304.7999999999997, 3855.999999999999, 3925.0, 0.0995997899349885, 0.051550672524945225, 0.04581201275330038], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3f8aa15-85c0-4309-bbe8-547667d7a718", 1, 0, 0.0, 825.0, 825, 825, 825.0, 825.0, 825.0, 825.0, 1.2121212121212122, 0.21898674242424243, 0.8357007575757576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 321.77777777777777, 258, 537, 266.0, 537.0, 537.0, 537.0, 0.04313960455362492, 0.06685796135410425, 0.09702198172558418], "isController": false}, {"data": ["addBook", 59, 6, 10.169491525423728, 1307.7796610169485, 669, 2767, 1065.0, 2227.0, 2494.0, 2767.0, 0.26810138776548853, 82.57605726094671, 0.9754442275271964], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c5f08fc9-133a-474d-98e0-fdcc8731e198", 3, 0, 0.0, 653.3333333333333, 358, 1180, 422.0, 1180.0, 1180.0, 1180.0, 0.020222037976987323, 0.027877711859551204, 0.012967908468315435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd2a44da-034f-4a8f-9102-0eb5ef99dde9", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.32261439732142855, 1.231166294642857], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 227.35185185185185, 126, 548, 134.0, 526.5, 541.25, 548.0, 0.2460203923569665, 0.18283351424184716, 0.11892587325849453], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3dbfe775-28b2-4dfc-b6b5-67bba311a738", 1, 0, 0.0, 1793.0, 1793, 1793, 1793.0, 1793.0, 1793.0, 1793.0, 0.5577244841048522, 0.10076077105409928, 0.3845248884551032], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 833.6666666666665, 627, 1324, 776.5, 1157.5, 1219.75, 1324.0, 0.245927396767421, 72.31082020771757, 0.12368418880392755], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 176.0, 125, 403, 133.0, 382.0, 397.0, 403.0, 0.24622792498255888, 0.4357080078792936, 0.11974756507940851], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1239.2777777777774, 882, 2154, 1169.5, 1646.0, 1757.75, 2154.0, 0.24538427632087176, 220.79720317306862, 0.12317140432512508], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 155.0, 130, 385, 136.5, 269.5, 385.0, 385.0, 0.12000685753471627, 0.08965356056060346, 0.042658687639293674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 6, 3.488372093023256, 206.18604651162792, 127, 968, 139.0, 388.80000000000024, 405.4, 814.7000000000021, 0.7310966875369268, 1.544577073052286, 0.3531411853436367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 141.22222222222223, 131, 181, 137.0, 181.0, 181.0, 181.0, 0.04591461921475798, 0.035556926794241286, 0.016321212298996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/038a5c73-0f9c-4ced-a0c5-daba85a9cbf1", 3, 0, 0.0, 1222.0, 243, 2803, 620.0, 2803.0, 2803.0, 2803.0, 0.0836540070269366, 0.03785125968992248, 0.05364531049578941], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 12, 0, 0.0, 133.75, 129, 139, 134.0, 138.4, 139.0, 139.0, 0.09338376056403791, 0.07578311037960499, 0.03319500863799785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 424.77777777777777, 262, 794, 272.0, 794.0, 794.0, 794.0, 0.0445573229960344, 0.06905514804170565, 0.10021046373033908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 565.6666666666667, 259, 1835, 268.0, 1606.4000000000003, 1835.0, 1835.0, 0.09495924665664318, 19.056685600815065, 0.2095162024214608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3f8aa15-85c0-4309-bbe8-547667d7a718", 3, 0, 0.0, 573.0, 252, 1156, 311.0, 1156.0, 1156.0, 1156.0, 0.022545541994829558, 0.026648067377352255, 0.014457915927673901], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 138.5, 129, 156, 137.5, 152.5, 156.0, 156.0, 0.06577680052245573, 0.05453564808941886, 0.023381597060716686], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df213ef9-a920-4fa5-829b-1c3f419ca334", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83020059-2973-4417-bfe4-077894cd26ce", 3, 0, 0.0, 391.6666666666667, 255, 593, 327.0, 593.0, 593.0, 593.0, 0.03013591296748335, 0.03022420177500527, 0.01932543897979889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 137.3684210526316, 126, 163, 137.0, 144.0, 163.0, 163.0, 0.08469438699094216, 0.06575394302519434, 0.030106207875686467], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60f6d75f-08a7-49ec-a8a7-580b34e80513", 1, 0, 0.0, 920.0, 920, 920, 920.0, 920.0, 920.0, 920.0, 1.0869565217391304, 0.19637398097826086, 0.7494055706521738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 134.28571428571428, 127, 152, 135.0, 146.5, 152.0, 152.0, 0.12137816233462226, 0.09020388821938236, 0.06092614789062094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 203.07142857142858, 126, 405, 129.0, 398.0, 405.0, 405.0, 0.12137605770564572, 0.032477577940768484, 0.06922228291025108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 186.1428571428571, 126, 382, 133.5, 382.0, 382.0, 382.0, 0.12137500541852703, 0.03271435692921236, 0.07135522779487624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 242.42857142857142, 125, 397, 137.0, 397.0, 397.0, 397.0, 0.12137184866664355, 0.03271350608593127, 0.07147189916600201], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 37.5, 0.46801872074882994], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.078003120124805], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.078003120124805], "isController": false}, {"data": ["401/Unauthorized", 8, 50.0, 0.62402496099844], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1282, 16, "401/Unauthorized", 8, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
