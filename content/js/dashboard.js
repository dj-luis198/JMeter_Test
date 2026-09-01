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

    var data = {"OkPercent": 97.35449735449735, "KoPercent": 2.6455026455026456};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7061855670103093, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/64aac529-12ac-4e2f-8526-becce83045a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3fd962d0-6b25-4dca-a36c-1f459354e683"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50e6bf82-cc9d-4eec-a1cc-3e50d3a43956"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47be66a4-241c-426a-992b-63c0a2a9e7c4"], "isController": false}, {"data": [0.4117647058823529, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4117647058823529, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=373fe6ab-8dc3-4c6c-a6d5-927e80724a61"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ea6c8fac-019e-4701-8e64-2134f84062d0"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88177317-7e73-4459-9d96-c808c5c7f599"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=faaf1475-bb28-4f31-bb2c-093793a461e1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/75aee51e-9306-4807-bc41-26c7dc0d0746"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/65de6028-8dbf-45f1-9282-eb1f10e61528"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8f2f2bcf-206f-4491-a9d9-a8e1dbc9b504"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42083802-8fd2-4f3a-a476-d6fcd2e2f039"], "isController": false}, {"data": [0.47368421052631576, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9b4dd280-b1a8-4c76-b17b-ae2a5d38e343"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3927fe77-c49d-4053-b22a-c8dfbe1512ef"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9904ce68-71e5-4389-af8c-8f9b99b94626"], "isController": false}, {"data": [0.6052631578947368, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.10714285714285714, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.16, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8edfafdd-ff54-41ff-b620-6e25aeaae9b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.24561403508771928, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.16, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.38235294117647056, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/373fe6ab-8dc3-4c6c-a6d5-927e80724a61"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2543859649122807, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64aac529-12ac-4e2f-8526-becce83045a2"], "isController": false}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/faaf1475-bb28-4f31-bb2c-093793a461e1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/88177317-7e73-4459-9d96-c808c5c7f599"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75aee51e-9306-4807-bc41-26c7dc0d0746"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/42083802-8fd2-4f3a-a476-d6fcd2e2f039"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/47be66a4-241c-426a-992b-63c0a2a9e7c4"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65de6028-8dbf-45f1-9282-eb1f10e61528"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9904ce68-71e5-4389-af8c-8f9b99b94626"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f2f2bcf-206f-4491-a9d9-a8e1dbc9b504"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b4dd280-b1a8-4c76-b17b-ae2a5d38e343"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8edfafdd-ff54-41ff-b620-6e25aeaae9b7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/50e6bf82-cc9d-4eec-a1cc-3e50d3a43956"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1323, 35, 2.6455026455026456, 491.1806500377928, 137, 3043, 157.0, 1386.8000000000004, 1653.1999999999998, 2159.8, 5.396167619731292, 774.4758649086975, 3.936175334915203], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2357.228070175438, 1665, 3321, 2369.0, 2817.2000000000003, 3153.2, 3321.0, 0.24406222302149033, 293.68866414602843, 1.2000520438605506], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/64aac529-12ac-4e2f-8526-becce83045a2", 3, 0, 0.0, 1530.6666666666667, 534, 2506, 1552.0, 2506.0, 2506.0, 2506.0, 0.020179598425991322, 0.023851602176033364, 0.012940693001042614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3fd962d0-6b25-4dca-a36c-1f459354e683", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.2096058238636362, 2.260150331439394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50e6bf82-cc9d-4eec-a1cc-3e50d3a43956", 1, 0, 0.0, 595.0, 595, 595, 595.0, 595.0, 595.0, 595.0, 1.680672268907563, 0.3036370798319328, 1.1587447478991597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47be66a4-241c-426a-992b-63c0a2a9e7c4", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 624.9411764705883, 142, 1402, 559.0, 1350.0, 1402.0, 1402.0, 0.10192457581389772, 0.021154267716889504, 0.06812927183883927], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 624.9411764705883, 142, 1402, 559.0, 1350.0, 1402.0, 1402.0, 0.0986107485715943, 0.02046648865976391, 0.06591421589953304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 199.6315789473684, 138, 426, 142.0, 422.0, 426.0, 426.0, 0.13339511633458304, 0.07787323865790471, 0.07371835376384853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 190.47368421052633, 139, 435, 146.0, 420.0, 435.0, 435.0, 0.13313619833089252, 0.09894203801739178, 0.06682813080281128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=373fe6ab-8dc3-4c6c-a6d5-927e80724a61", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.3231915250447227, 1.2333687388193202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 407.6315789473685, 137, 1152, 154.0, 1149.0, 1152.0, 1152.0, 0.1333913702804027, 8.285540243825384, 0.07613647034148191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 544.1578947368422, 138, 1800, 157.0, 1697.0, 1800.0, 1800.0, 0.13338856087783713, 25.296438525424563, 0.07600460453801924], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 318.8235294117647, 138, 1033, 269.0, 633.7999999999996, 1033.0, 1033.0, 0.10105333238224315, 0.1585227711795896, 0.06530618045153007], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 160.4, 139, 415, 141.0, 254.2000000000001, 415.0, 415.0, 0.09138039220464333, 0.06791062350364607, 0.045868673430846364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 159.06666666666672, 137, 414, 141.0, 253.8000000000001, 414.0, 414.0, 0.0913837324771693, 0.024452287791742567, 0.05211728492838562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1147.6666666666667, 1099, 1290, 1124.0, 1290.0, 1290.0, 1290.0, 0.06675270348449112, 19.627511222798272, 0.038069901205998846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea6c8fac-019e-4701-8e64-2134f84062d0", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 319.0, 3.134796238244514, 1.0010530956112853, 1.8704692398119123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1378.3333333333335, 1098, 1645, 1331.5, 1645.0, 1645.0, 1645.0, 0.06668667266846721, 60.00478528975359, 0.03796711930245741], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 280.3333333333333, 139, 425, 276.0, 425.0, 425.0, 425.0, 0.06729097740144675, 0.11907348735490382, 0.03725975018224639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 143.72727272727272, 139, 155, 142.0, 153.8, 155.0, 155.0, 0.05821615127731528, 0.04326415148636419, 0.02922177905912115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 192.54545454545453, 138, 449, 140.0, 441.40000000000003, 449.0, 449.0, 0.05822046502273245, 0.031477506391019226, 0.03231483907334191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 413.3636363636364, 138, 1428, 146.0, 1400.2, 1428.0, 1428.0, 0.058133696933183245, 9.523511364477141, 0.033267916409028694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 368.45454545454544, 138, 1117, 146.0, 1057.8000000000002, 1117.0, 1117.0, 0.058136154874716586, 3.1208132058918348, 0.03332609659322132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 142.16666666666669, 138, 146, 142.5, 146.0, 146.0, 146.0, 0.0675014344054811, 0.05016464021735462, 0.037903637483546526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 871.0526315789473, 138, 1711, 1234.0, 1635.0, 1711.0, 1711.0, 0.11283062341888665, 53.44871764656104, 0.06122870693136335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 197.53333333333333, 137, 433, 140.0, 432.4, 433.0, 433.0, 0.0912197910458653, 0.024586584305330887, 0.053627259970323166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 675.578947368421, 138, 1248, 822.0, 1233.0, 1248.0, 1248.0, 0.11282995338341399, 17.47532772647644, 0.061338528831022296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 245.26666666666668, 138, 587, 144.0, 494.00000000000006, 587.0, 587.0, 0.09122977739934314, 0.02458927593966671, 0.053722222433402265], "isController": false}, {"data": ["deleteBooks", 17, 4, 23.529411764705884, 494.05882352941177, 141, 918, 510.0, 881.1999999999999, 918.0, 918.0, 0.0988510024654603, 0.02051635293587477, 0.06649501601967717], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 585.3636363636363, 281, 1568, 300.0, 1540.8000000000002, 1568.0, 1568.0, 0.0580876489816179, 12.708751457141876, 0.127938253159176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88177317-7e73-4459-9d96-c808c5c7f599", 1, 0, 0.0, 872.0, 872, 872, 872.0, 872.0, 872.0, 872.0, 1.146788990825688, 0.20718355791284404, 0.790657253440367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=faaf1475-bb28-4f31-bb2c-093793a461e1", 1, 0, 0.0, 706.0, 706, 706, 706.0, 706.0, 706.0, 706.0, 1.41643059490085, 0.2558981055240793, 0.9765625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75aee51e-9306-4807-bc41-26c7dc0d0746", 3, 0, 0.0, 467.3333333333333, 318, 561, 523.0, 561.0, 561.0, 561.0, 0.07224911494834188, 0.04644921940852058, 0.04633162644799268], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 816.0909090909091, 235, 1412, 774.0, 1394.8999999999999, 1411.1, 1412.0, 0.11542194590907899, 0.07089883200860418, 0.05218785249599958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 144.1578947368421, 139, 155, 142.0, 154.0, 155.0, 155.0, 0.11282794332474258, 0.08384967272473545, 0.05663433873917743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 211.0526315789474, 138, 576, 140.0, 437.0, 576.0, 576.0, 0.11282526335791736, 0.11937812867424379, 0.059358521573377995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65de6028-8dbf-45f1-9282-eb1f10e61528", 3, 0, 0.0, 410.6666666666667, 297, 580, 355.0, 580.0, 580.0, 580.0, 0.0379641112601554, 0.024407265539976207, 0.02434547499430538], "isController": false}, {"data": ["login", 22, 0, 0.0, 3408.454545454545, 1916, 4879, 3419.0, 4710.0, 4854.549999999999, 4879.0, 0.11313264288138557, 37.06685986529502, 0.22185608563626827], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 176.33333333333331, 143, 434, 149.0, 344.00000000000006, 434.0, 434.0, 0.08642046436596186, 0.06996344234314686, 0.030719774442588006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f2f2bcf-206f-4491-a9d9-a8e1dbc9b504", 3, 0, 0.0, 506.66666666666663, 257, 930, 333.0, 930.0, 930.0, 930.0, 0.024968789013732832, 0.02520449698293799, 0.016011886183936744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42083802-8fd2-4f3a-a476-d6fcd2e2f039", 1, 0, 0.0, 705.0, 705, 705, 705.0, 705.0, 705.0, 705.0, 1.4184397163120568, 0.2562610815602837, 0.9779476950354611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1033.0526315789473, 285, 1862, 1374.0, 1778.0, 1862.0, 1862.0, 0.11272953810555045, 71.06366136454656, 0.23835089479070873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b4dd280-b1a8-4c76-b17b-ae2a5d38e343", 3, 0, 0.0, 427.66666666666663, 258, 756, 269.0, 756.0, 756.0, 756.0, 0.06446067898581864, 0.029166778577567685, 0.04133708906317147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3927fe77-c49d-4053-b22a-c8dfbe1512ef", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 1.3141396604938271, 2.455471965020576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9904ce68-71e5-4389-af8c-8f9b99b94626", 3, 0, 0.0, 729.3333333333334, 344, 1089, 755.0, 1089.0, 1089.0, 1089.0, 0.039081328244075925, 0.024769318389067648, 0.025061919479436708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 765.263157894737, 279, 2220, 563.0, 1838.0, 2220.0, 2220.0, 0.133000133000133, 33.66049752768503, 0.2919563466438466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, 57.142857142857146, 766.0000000000001, 138, 1788, 280.5, 1784.5, 1788.0, 1788.0, 0.11353775535857656, 58.23048620516272, 0.15270891453850957], "isController": false}, {"data": ["register", 25, 8, 32.0, 1289.8000000000002, 151, 2451, 1194.0, 2254.6, 2395.5, 2451.0, 0.10264495520574154, 0.03212466332454693, 0.04631051689946543], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8edfafdd-ff54-41ff-b620-6e25aeaae9b7", 3, 0, 0.0, 470.3333333333333, 402, 579, 430.0, 579.0, 579.0, 579.0, 0.028087257747401926, 0.033198187786724086, 0.018011685469525324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 168.42857142857142, 140, 430, 148.0, 297.5, 430.0, 430.0, 0.08481661436308781, 0.06584883634634259, 0.030149655886878866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 446.33333333333337, 281, 1003, 293.0, 749.2000000000002, 1003.0, 1003.0, 0.09114053262527266, 0.14125002468389425, 0.20497719398047162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 345.6315789473684, 279, 575, 287.0, 574.0, 575.0, 575.0, 0.12621146398655517, 0.19560311850260062, 0.28385254058694975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 141.42857142857142, 138, 145, 141.0, 145.0, 145.0, 145.0, 0.03600952709202492, 0.02676098644241305, 0.01807509465361407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 140.14285714285714, 138, 145, 139.0, 145.0, 145.0, 145.0, 0.036010638571509414, 0.009635659149017166, 0.02053731731031396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 180.42857142857144, 139, 410, 143.0, 410.0, 410.0, 410.0, 0.036010453320163796, 0.009705942496450399, 0.02117020790892442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 140.85714285714286, 138, 144, 140.0, 144.0, 144.0, 144.0, 0.036010638571509414, 0.009705992427477146, 0.021205483455683766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 144.5, 141, 149, 144.0, 149.0, 149.0, 149.0, 0.06278350677277078, 0.018516229536500763, 0.03881050760465226], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1608.9649122807018, 1098, 2734, 1518.0, 2185.2000000000003, 2448.5999999999995, 2734.0, 0.25046687905086235, 299.6454637207514, 0.4945742475008239], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 1289.8000000000002, 151, 2451, 1194.0, 2254.6, 2395.5, 2451.0, 0.10703658510478882, 0.033499106244514375, 0.04829189679532464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 225.0, 139, 416, 147.5, 415.8, 416.0, 416.0, 0.04615611845506241, 0.012440516302341038, 0.02717982366054944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 216.9, 139, 578, 145.0, 563.7, 578.0, 578.0, 0.046155692381541415, 0.012440401462212335, 0.027134498841492122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 180.7857142857143, 138, 435, 140.0, 423.0, 435.0, 435.0, 0.08201763379126513, 0.02210631535780193, 0.04821739799056798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 180.7857142857143, 138, 431, 140.5, 420.5, 431.0, 431.0, 0.08201571186708767, 0.022105797339175975, 0.04829636157798229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 142.8, 139, 151, 142.5, 150.6, 151.0, 151.0, 0.046155692381541415, 0.012350253625529637, 0.02632316831134784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 163.2142857142857, 139, 421, 143.5, 285.0, 421.0, 421.0, 0.08201715330177627, 0.06095220084243333, 0.04116876640343066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 200.3, 139, 424, 145.5, 423.6, 424.0, 424.0, 0.046153775148038235, 0.03429982703872763, 0.02316703166610513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 179.5, 137, 415, 140.0, 414.0, 415.0, 415.0, 0.08188666885031116, 0.02191108131346217, 0.04670099082869309], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 157.0, 144, 179, 154.5, 178.9, 179.0, 179.0, 0.04698342894461124, 0.03698109739194986, 0.016701140757654775], "isController": false}, {"data": ["deleteAccount", 17, 4, 23.529411764705884, 622.4117647058822, 139, 1552, 561.0, 1181.5999999999997, 1552.0, 1552.0, 0.09876026816317521, 0.0198621150528077, 0.06719987226521199], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/373fe6ab-8dc3-4c6c-a6d5-927e80724a61", 3, 0, 0.0, 938.6666666666666, 323, 1994, 499.0, 1994.0, 1994.0, 1994.0, 0.05092859810545615, 0.03274218139917835, 0.03265928980069942], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1674.6363636363633, 1179, 3043, 1489.5, 2148.2, 2909.949999999998, 3043.0, 0.11618695537364669, 0.06013582651175073, 0.0534414609189332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 446.7, 282, 999, 293.5, 985.0, 999.0, 999.0, 0.04612312105935584, 0.07148182921991965, 0.10373198027314112], "isController": false}, {"data": ["addBook", 57, 11, 19.29824561403509, 1421.7368421052633, 714, 3033, 1176.0, 2540.0, 2761.8999999999996, 3033.0, 0.2816247276392437, 95.72686392646631, 1.0209041126474208], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64aac529-12ac-4e2f-8526-becce83045a2", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 246.5087719298245, 138, 705, 147.0, 584.2, 586.1, 705.0, 0.2518491026218817, 0.18716520224145702, 0.12174346269319478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/faaf1475-bb28-4f31-bb2c-093793a461e1", 3, 0, 0.0, 586.3333333333334, 277, 969, 513.0, 969.0, 969.0, 969.0, 0.030197491595031507, 0.02517440624182151, 0.01936492787832424], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 898.2105263157895, 684, 1400, 832.0, 1231.6, 1251.0999999999997, 1400.0, 0.2514591246575524, 73.93733187806879, 0.12646625898304636], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 218.08771929824562, 138, 609, 147.0, 429.8, 435.29999999999995, 609.0, 0.25252413377576743, 0.44684934609540095, 0.12280958849641814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88177317-7e73-4459-9d96-c808c5c7f599", 3, 0, 0.0, 417.0, 250, 661, 340.0, 661.0, 661.0, 661.0, 0.030675160277712447, 0.03096473698606325, 0.019671245360382006], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1357.0, 951, 2178, 1326.0, 1743.6000000000001, 1848.8, 2178.0, 0.25128951196931626, 226.11074458983597, 0.12613555581272318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 162.73684210526315, 141, 414, 146.0, 174.0, 414.0, 414.0, 0.12773366857818982, 0.09542603170147969, 0.045405327502403406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 11, 6.432748538011696, 225.0643274853801, 139, 764, 152.0, 418.0, 502.8000000000002, 699.2, 0.7260468236512937, 1.655419431358854, 0.34614766614159187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 187.57142857142856, 142, 429, 149.0, 429.0, 429.0, 429.0, 0.03602880245407614, 0.02790121127547108, 0.01280711337234738], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 161.63157894736838, 141, 415, 147.0, 160.0, 415.0, 415.0, 0.13795106367530677, 0.11195052140056633, 0.049037292165831706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 322.85714285714283, 280, 551, 284.0, 551.0, 551.0, 551.0, 0.03598361203497607, 0.055767570604987333, 0.08092798683256826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75aee51e-9306-4807-bc41-26c7dc0d0746", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42083802-8fd2-4f3a-a476-d6fcd2e2f039", 3, 0, 0.0, 765.0, 264, 1527, 504.0, 1527.0, 1527.0, 1527.0, 0.04560379423568041, 0.02931884557795208, 0.02924462065243828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 386.1428571428571, 278, 856, 289.5, 716.5, 856.0, 856.0, 0.08181919127573653, 0.12680376616659556, 0.18401327881642696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47be66a4-241c-426a-992b-63c0a2a9e7c4", 3, 0, 0.0, 609.3333333333334, 265, 1033, 530.0, 1033.0, 1033.0, 1033.0, 0.021021799606191622, 0.024847055459010992, 0.013480776440168454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 210.72727272727272, 140, 542, 151.0, 518.6000000000001, 542.0, 542.0, 0.060323553605703316, 0.05001435255004113, 0.021443138195777353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65de6028-8dbf-45f1-9282-eb1f10e61528", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9904ce68-71e5-4389-af8c-8f9b99b94626", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 0.2523241096368715, 0.9629233589385475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f2f2bcf-206f-4491-a9d9-a8e1dbc9b504", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b4dd280-b1a8-4c76-b17b-ae2a5d38e343", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 0.7084865196078431, 2.703737745098039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 149.21052631578945, 142, 162, 149.0, 158.0, 162.0, 162.0, 0.10797969981643452, 0.08383189585357953, 0.0383834089191232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8edfafdd-ff54-41ff-b620-6e25aeaae9b7", 1, 0, 0.0, 918.0, 918, 918, 918.0, 918.0, 918.0, 918.0, 1.0893246187363836, 0.19680181100217864, 0.751038262527233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50e6bf82-cc9d-4eec-a1cc-3e50d3a43956", 3, 0, 0.0, 354.6666666666667, 258, 530, 276.0, 530.0, 530.0, 530.0, 0.044622272463595666, 0.02868782165221401, 0.028615194255626128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 142.42105263157896, 138, 151, 141.0, 147.0, 151.0, 151.0, 0.1263289472809356, 0.09388313367264844, 0.06341120986562589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 140.84210526315792, 138, 146, 141.0, 145.0, 146.0, 146.0, 0.12633062719831914, 0.03380331235580024, 0.07204793582404138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 170.8947368421053, 138, 432, 141.0, 412.0, 432.0, 432.0, 0.12633230716038218, 0.03405050466432177, 0.07426957901420907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 185.94736842105263, 138, 434, 142.0, 418.0, 434.0, 434.0, 0.12633230716038218, 0.03405050466432177, 0.07439295040792038], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 22.857142857142858, 0.6046863189720333], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.428571428571429, 0.30234315948601664], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 11.428571428571429, 0.30234315948601664], "isController": false}, {"data": ["401/Unauthorized", 19, 54.285714285714285, 1.436130007558579], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1323, 35, "401/Unauthorized", 19, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
