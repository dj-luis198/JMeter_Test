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

    var data = {"OkPercent": 98.87133182844244, "KoPercent": 1.1286681715575622};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7865459249676585, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.15517241379310345, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/da5cee83-3c3c-45f3-ab57-c744a8af88ef"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b5e1fac-e77e-41a9-ac1e-2d21f855f260"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c0adf656-b530-4437-8c71-36d4b8e35718"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35058e75-ed34-4826-a7d9-ff027865c479"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5edea01a-0325-47e2-b299-a173fafa3930"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4453a39c-44e4-49cf-aaba-3a136df02b4c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95728f22-c33c-4e65-953b-facf456a1b86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4453a39c-44e4-49cf-aaba-3a136df02b4c"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=849cd418-7e8b-4f28-b5aa-1e5acebfe996"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6ee63e93-1244-4788-9d40-46c028cebd04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/60120ea4-921b-4aa0-a486-52c2e5fca76e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4704486a-216b-4d64-9933-cd1345626ddc"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87f0ea5b-f2cd-408b-9d33-d130cf09cf51"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9595d238-cf1e-489f-8a31-989975b2c371"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97bab56c-c985-41bb-bc67-0009e4e6e8cc"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0adf656-b530-4437-8c71-36d4b8e35718"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9595d238-cf1e-489f-8a31-989975b2c371"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da5cee83-3c3c-45f3-ab57-c744a8af88ef"], "isController": false}, {"data": [0.39655172413793105, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f69f8b62-349b-46ba-b4b8-7e57cc75d1c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b987c9a3-0393-463d-8736-0282bbe81fbe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.1590909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4b5e1fac-e77e-41a9-ac1e-2d21f855f260"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/95728f22-c33c-4e65-953b-facf456a1b86"], "isController": false}, {"data": [0.3706896551724138, 500, 1500, "addBook"], "isController": true}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.603448275862069, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/35058e75-ed34-4826-a7d9-ff027865c479"], "isController": false}, {"data": [0.9655172413793104, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/849cd418-7e8b-4f28-b5aa-1e5acebfe996"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4704486a-216b-4d64-9933-cd1345626ddc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ee63e93-1244-4788-9d40-46c028cebd04"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/87f0ea5b-f2cd-408b-9d33-d130cf09cf51"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b987c9a3-0393-463d-8736-0282bbe81fbe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/97bab56c-c985-41bb-bc67-0009e4e6e8cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1329, 15, 1.1286681715575622, 376.22949586155033, 92, 4086, 117.0, 1022.0, 1266.5, 1997.400000000001, 5.235045260097847, 738.5353672065183, 3.832972999288995], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1698.8448275862074, 1178, 2817, 1665.0, 2039.4, 2216.85, 2817.0, 0.24663848751073728, 296.7887438034738, 1.2127195162271114], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/da5cee83-3c3c-45f3-ab57-c744a8af88ef", 3, 0, 0.0, 335.6666666666667, 210, 474, 323.0, 474.0, 474.0, 474.0, 0.04346251358203549, 0.028196871604491126, 0.027871468670771456], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 596.5000000000001, 105, 1872, 496.0, 1359.5, 1872.0, 1872.0, 0.08056580211888059, 0.015212864560254589, 0.05448419723371564], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 596.5000000000001, 105, 1872, 496.0, 1359.5, 1872.0, 1872.0, 0.07934798626146294, 0.014982910073226857, 0.053660625474670993], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b5e1fac-e77e-41a9-ac1e-2d21f855f260", 1, 0, 0.0, 919.0, 919, 919, 919.0, 919.0, 919.0, 919.0, 1.088139281828074, 0.19658766322089227, 0.7502210282916213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 146.41176470588235, 93, 307, 102.0, 306.2, 307.0, 307.0, 0.08670151727655234, 0.030859524416677293, 0.049018631263547115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 124.70588235294116, 96, 291, 103.0, 279.8, 291.0, 291.0, 0.08670063291462028, 0.06443279457815042, 0.04351965363097151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 199.05882352941177, 96, 800, 105.0, 404.7999999999996, 800.0, 800.0, 0.08670107509333115, 1.521581953553724, 0.050617131558681326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 177.47058823529414, 92, 857, 101.0, 413.7999999999996, 857.0, 857.0, 0.0867028438532784, 4.611133960037639, 0.0505334934360847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0adf656-b530-4437-8c71-36d4b8e35718", 3, 0, 0.0, 417.0, 204, 719, 328.0, 719.0, 719.0, 719.0, 0.022720043622483754, 0.026854322393632328, 0.014569819640720377], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 319.2142857142857, 102, 843, 260.0, 655.5, 843.0, 843.0, 0.0802964084563589, 0.19245709339906167, 0.05190477240269795], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 102.21428571428572, 95, 106, 103.5, 106.0, 106.0, 106.0, 0.08373906906080653, 0.062231866753197036, 0.04203308739966265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 113.07142857142858, 93, 293, 99.5, 198.0, 293.0, 293.0, 0.083740571708846, 0.022407145164281057, 0.04775829480270123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 775.6666666666666, 574, 903, 792.5, 903.0, 903.0, 903.0, 0.05286343612334802, 15.54360545154185, 0.030148678414096915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1077.3333333333333, 912, 1210, 1087.0, 1210.0, 1210.0, 1210.0, 0.05277601857715854, 47.48795428607241, 0.03004728401414397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 199.5, 99, 309, 197.0, 309.0, 309.0, 309.0, 0.05308841876144719, 0.0939416160114671, 0.02939563812279351], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35058e75-ed34-4826-a7d9-ff027865c479", 1, 0, 0.0, 891.0, 891, 891, 891.0, 891.0, 891.0, 891.0, 1.122334455667789, 0.2027655022446689, 0.7737969977553311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 104.0, 95, 113, 103.0, 112.6, 113.0, 113.0, 0.08107720420853058, 0.06025366445575367, 0.04069695601873507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5edea01a-0325-47e2-b299-a173fafa3930", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.7018372252747253, 1.3113839285714286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 130.15384615384616, 92, 305, 100.0, 303.8, 305.0, 305.0, 0.08097720803044743, 0.040379109593307545, 0.04513603392322115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 294.61538461538464, 98, 1214, 101.0, 1172.3999999999999, 1214.0, 1214.0, 0.08057318524395081, 11.17220571806203, 0.046302949753322095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 258.8461538461538, 98, 855, 104.0, 839.0, 855.0, 855.0, 0.0807002296852691, 3.6689505866285925, 0.046454767133279534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4453a39c-44e4-49cf-aaba-3a136df02b4c", 3, 0, 0.0, 336.0, 231, 440, 337.0, 440.0, 440.0, 440.0, 0.02348005760440799, 0.02775263319062676, 0.015057198398660071], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95728f22-c33c-4e65-953b-facf456a1b86", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 171.33333333333331, 97, 321, 102.5, 321.0, 321.0, 321.0, 0.05317640385706183, 0.03951879231955474, 0.029859797087705617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 713.3529411764707, 101, 1425, 929.0, 1265.8, 1425.0, 1425.0, 0.07651591531038456, 40.507994998897274, 0.041114997231924244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 141.71428571428572, 92, 307, 101.0, 301.5, 307.0, 307.0, 0.083740571708846, 0.022570700968399898, 0.04923029703977079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 555.4117647058822, 97, 877, 764.0, 831.4, 877.0, 877.0, 0.07651557091868195, 13.242679260229457, 0.04118953441400325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 126.49999999999997, 93, 303, 98.0, 297.5, 303.0, 303.0, 0.08374357716671552, 0.022571511033216293, 0.04931384475735299], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 612.3571428571429, 309, 1372, 517.0, 1145.5, 1372.0, 1372.0, 0.07934618741569469, 0.014982570405572368, 0.05430144006245678], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 430.76923076923083, 200, 1315, 216.0, 1274.2, 1315.0, 1315.0, 0.08051928746624383, 14.925446349766494, 0.17792028551829647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4453a39c-44e4-49cf-aaba-3a136df02b4c", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 721.4545454545453, 196, 2415, 566.0, 1484.3999999999996, 2292.1499999999983, 2415.0, 0.09605183306191413, 0.05900058886322655, 0.04342968623795532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 136.82352941176467, 93, 294, 103.0, 292.4, 294.0, 294.0, 0.07651694850409366, 0.05686464630040554, 0.038407921417093885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 154.47058823529412, 92, 308, 99.0, 296.8, 308.0, 308.0, 0.07651729290819725, 0.08807752270763193, 0.0398586174225375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=849cd418-7e8b-4f28-b5aa-1e5acebfe996", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["login", 22, 0, 0.0, 3385.5000000000005, 1954, 5406, 3069.5, 5050.4, 5367.599999999999, 5406.0, 0.09573000657055955, 31.36504768278992, 0.1877290585171422], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 105.50000000000001, 100, 120, 105.0, 114.5, 120.0, 120.0, 0.08124419684308264, 0.06577288982706593, 0.02887977309656453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ee63e93-1244-4788-9d40-46c028cebd04", 3, 0, 0.0, 474.0, 203, 988, 231.0, 988.0, 988.0, 988.0, 0.017392110938478304, 0.023976428979314984, 0.011153144058854904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60120ea4-921b-4aa0-a486-52c2e5fca76e", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 1.5966796875, 2.9833984375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4704486a-216b-4d64-9933-cd1345626ddc", 3, 0, 0.0, 657.6666666666667, 184, 1321, 468.0, 1321.0, 1321.0, 1321.0, 0.019835759907962075, 0.02344519668808929, 0.012720197597228283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 875.0000000000002, 204, 1528, 1030.0, 1363.9999999999998, 1528.0, 1528.0, 0.07648149147906207, 53.87142649369477, 0.16049778063083733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87f0ea5b-f2cd-408b-9d33-d130cf09cf51", 1, 0, 0.0, 633.0, 633, 633, 633.0, 633.0, 633.0, 633.0, 1.5797788309636651, 0.2854092614533965, 1.0891834518167456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9595d238-cf1e-489f-8a31-989975b2c371", 3, 0, 0.0, 310.3333333333333, 197, 485, 249.0, 485.0, 485.0, 485.0, 0.04561211457763181, 0.029324194756127225, 0.029249956288390194], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97bab56c-c985-41bb-bc67-0009e4e6e8cc", 1, 0, 0.0, 582.0, 582, 582, 582.0, 582.0, 582.0, 582.0, 1.7182130584192439, 0.31041935137457044, 1.1846273625429553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 363.23529411764713, 196, 956, 388.0, 658.3999999999997, 956.0, 956.0, 0.08665776300631073, 6.224803140324406, 0.19359109292006074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 962.625, 102, 1531, 1114.5, 1531.0, 1531.0, 1531.0, 0.0703037120359955, 63.085463773815384, 0.1305407426488681], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1124.4347826086955, 126, 1982, 1233.0, 1816.6000000000004, 1962.9999999999998, 1982.0, 0.09814547720037893, 0.03077047399998293, 0.04428047897126471], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 137.10000000000002, 98, 302, 107.5, 301.3, 302.0, 302.0, 0.0958860107104674, 0.07444275245588046, 0.03408448036973646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 274.50000000000006, 195, 409, 208.0, 408.0, 409.0, 409.0, 0.08368751083454382, 0.12969929657658305, 0.18821517329292423], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0adf656-b530-4437-8c71-36d4b8e35718", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9595d238-cf1e-489f-8a31-989975b2c371", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 340.06250000000006, 199, 581, 400.5, 459.9000000000001, 581.0, 581.0, 0.09821976672805402, 0.15222145488029465, 0.22089855739717618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 119.16666666666666, 98, 296, 102.5, 240.80000000000018, 296.0, 296.0, 0.05171031879411536, 0.03842925058820487, 0.02595615611345244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 133.33333333333331, 95, 308, 101.5, 302.3, 308.0, 308.0, 0.051713438598910574, 0.013837384937599118, 0.029492820450941183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 115.91666666666666, 96, 289, 100.5, 233.80000000000018, 289.0, 289.0, 0.05171232433969825, 0.013938087419684296, 0.03040119067626792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 99.75, 93, 109, 99.0, 107.2, 109.0, 109.0, 0.05171433004085432, 0.013938628018824015, 0.03045287208460464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 0.9544397249190939, 2.0005309466019416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da5cee83-3c3c-45f3-ab57-c744a8af88ef", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1167.6724137931037, 775, 2405, 1083.0, 1599.7, 1757.0999999999997, 2405.0, 0.2479109230407557, 296.58765173858217, 0.4895272328011797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1124.4347826086955, 126, 1982, 1233.0, 1816.6000000000004, 1962.9999999999998, 1982.0, 0.09725199683719593, 0.030490350910574674, 0.04387736576053176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f69f8b62-349b-46ba-b4b8-7e57cc75d1c9", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 1.0574037665562914, 1.9757605546357617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 99.85714285714285, 92, 105, 99.0, 105.0, 105.0, 105.0, 0.05799358756617482, 0.01563108414869556, 0.03415052080312834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 99.42857142857143, 94, 104, 98.0, 104.0, 104.0, 104.0, 0.057992626651754274, 0.015630825152230646, 0.03409332152769148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 176.6, 96, 849, 100.5, 311.40000000000003, 822.1999999999996, 849.0, 0.09808152536388245, 4.437810680894209, 0.05723976519282828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 155.45000000000002, 95, 807, 99.5, 307.6, 782.0499999999997, 807.0, 0.09808441144448914, 1.4671186570037174, 0.057337235049483584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 130.15, 96, 294, 103.0, 288.6, 293.8, 294.0, 0.09808393041925977, 0.07289245219634441, 0.049233535386229994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 101.14285714285714, 93, 105, 103.0, 105.0, 105.0, 105.0, 0.057989263702034596, 0.015516658451520974, 0.033072001955066606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b987c9a3-0393-463d-8736-0282bbe81fbe", 3, 0, 0.0, 335.0, 215, 492, 298.0, 492.0, 492.0, 492.0, 0.026876422210675315, 0.026955161728870653, 0.01723520564942395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 159.60000000000005, 93, 304, 103.0, 303.8, 304.0, 304.0, 0.09808200636552222, 0.0336103281578728, 0.055525526455169165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 103.57142857142858, 99, 109, 103.0, 109.0, 109.0, 109.0, 0.05798590114232225, 0.0430930378606516, 0.029106204284329727], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 115.28571428571428, 105, 159, 108.0, 159.0, 159.0, 159.0, 0.05784072317429889, 0.045526975467270414, 0.020560569565864058], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 628.5714285714284, 104, 1321, 490.0, 1292.0, 1321.0, 1321.0, 0.08107294248453824, 0.01515027991881124, 0.05517778319068356], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1934.818181818182, 1109, 4086, 1653.5, 3062.0999999999995, 3964.949999999998, 4086.0, 0.09568254272008071, 0.04952319105629178, 0.04401023205191213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 207.85714285714286, 202, 215, 207.0, 215.0, 215.0, 215.0, 0.057936468523944316, 0.08979021049560511, 0.1303004755963318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b5e1fac-e77e-41a9-ac1e-2d21f855f260", 3, 0, 0.0, 389.0, 212, 568, 387.0, 568.0, 568.0, 568.0, 0.038632412594166506, 0.03197989102440281, 0.024774040628420577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95728f22-c33c-4e65-953b-facf456a1b86", 3, 0, 0.0, 683.6666666666666, 243, 1255, 553.0, 1255.0, 1255.0, 1255.0, 0.020681097476906107, 0.024444357076382185, 0.013262292327312835], "isController": false}, {"data": ["addBook", 58, 4, 6.896551724137931, 1031.9310344827586, 521, 2222, 852.0, 1759.7, 1809.85, 2222.0, 0.2732008780110976, 79.9141869933419, 0.9956201380253229], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 183.39655172413796, 94, 729, 105.0, 412.2, 425.25, 729.0, 0.24889071980912655, 0.18496663845189973, 0.12031338506398208], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 619.9310344827585, 456, 947, 579.5, 818.4, 866.05, 947.0, 0.2491045122275956, 73.24499764317066, 0.12528205448946458], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 148.41379310344826, 93, 404, 105.0, 304.1, 309.29999999999995, 404.0, 0.249598705529472, 0.44167270939394854, 0.12138687046257526], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 980.3965517241379, 667, 2004, 963.5, 1249.7, 1420.05, 2004.0, 0.24872741619387012, 223.80536630740562, 0.12484950383168872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 107.1875, 100, 117, 107.0, 112.80000000000001, 117.0, 117.0, 0.0948372947661668, 0.07085012743761483, 0.033711694623910854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35058e75-ed34-4826-a7d9-ff027865c479", 3, 0, 0.0, 772.3333333333334, 211, 1263, 843.0, 1263.0, 1263.0, 1263.0, 0.025917254844366886, 0.026161916429811756, 0.016620114597461835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 4, 2.2988505747126435, 172.54597701149441, 95, 721, 109.0, 344.5, 439.5, 580.75, 0.7129803397720103, 1.5265796778578629, 0.3420965911651902], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 112.41666666666667, 100, 129, 110.0, 128.1, 129.0, 129.0, 0.05169739789763915, 0.04003519192658969, 0.018376809408926418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 106.00000000000001, 97, 117, 105.0, 117.0, 117.0, 117.0, 0.08735464444090459, 0.07089034133827316, 0.0310518462661028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/849cd418-7e8b-4f28-b5aa-1e5acebfe996", 3, 0, 0.0, 442.0, 345, 542, 439.0, 542.0, 542.0, 542.0, 0.018637592023110612, 0.02569342520113068, 0.011951841238778616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4704486a-216b-4d64-9933-cd1345626ddc", 1, 0, 0.0, 1372.0, 1372, 1372, 1372.0, 1372.0, 1372.0, 1372.0, 0.7288629737609329, 0.13167934584548105, 0.5025168549562682], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ee63e93-1244-4788-9d40-46c028cebd04", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.32435199730700176, 1.2377973518850987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87f0ea5b-f2cd-408b-9d33-d130cf09cf51", 3, 0, 0.0, 1316.6666666666667, 271, 3213, 466.0, 3213.0, 3213.0, 3213.0, 0.020270681162455995, 0.020330067923674127, 0.012999102177746845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 255.5, 200, 585, 206.5, 533.1000000000001, 585.0, 585.0, 0.05168760014472528, 0.08010568498992092, 0.11624662415361556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 340.15000000000003, 198, 952, 211.5, 596.8, 934.2499999999998, 952.0, 0.09803296848730228, 6.008410960637312, 0.21922431107331394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b987c9a3-0393-463d-8736-0282bbe81fbe", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97bab56c-c985-41bb-bc67-0009e4e6e8cc", 3, 0, 0.0, 415.3333333333333, 364, 488, 394.0, 488.0, 488.0, 488.0, 0.05010522096402445, 0.03221282923305608, 0.03213127776664328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 124.6923076923077, 101, 304, 107.0, 233.59999999999994, 304.0, 304.0, 0.08495788049693825, 0.07043871146669978, 0.03019987158289602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 109.76470588235293, 99, 124, 109.0, 117.6, 124.0, 124.0, 0.07880659008520384, 0.06118285070091509, 0.0280132800693498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 111.625, 97, 276, 100.0, 161.2000000000001, 276.0, 276.0, 0.09840400996340601, 0.07313032381069529, 0.04939420031366278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 195.99999999999997, 94, 307, 188.0, 305.6, 307.0, 307.0, 0.09828009828009827, 0.026297604422604422, 0.056050368550368546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 222.75, 95, 308, 289.5, 305.9, 308.0, 308.0, 0.0982982122012656, 0.026494440007372364, 0.05778859740738465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 110.875, 92, 303, 98.0, 163.00000000000014, 303.0, 303.0, 0.09840824661106601, 0.026524097719388885, 0.05794938740866485], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 46.666666666666664, 0.526711813393529], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.666666666666667, 0.07524454477050414], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.666666666666667, 0.07524454477050414], "isController": false}, {"data": ["401/Unauthorized", 6, 40.0, 0.45146726862302483], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1329, 15, "406/Not Acceptable", 7, "401/Unauthorized", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
