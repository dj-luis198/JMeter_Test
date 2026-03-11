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

    var data = {"OkPercent": 98.80952380952381, "KoPercent": 1.1904761904761905};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8313099041533546, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4745762711864407, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e3b6559b-d375-4908-b319-8e48b33c871c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7f93f05-ecdd-47c9-ae4b-ffd78532dce7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e809aca-5288-4acc-ba55-7da5b310e5b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2ea59104-8a9d-48db-b771-26f3bb990f5e"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3f0845ca-c453-480b-9b76-d7788dcb26f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f6288b9f-4fdf-4779-aa7a-965061ba3354"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/263058f1-f830-4fe3-a2cd-3754861e6336"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/61c7087f-289f-4481-9832-65cc5f707200"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/93d8fcf8-93fd-4083-b673-bf8c439a8419"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5e809aca-5288-4acc-ba55-7da5b310e5b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ce33905-3fb9-470a-979c-1f2ace8134ce"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a011301d-6ebb-44bc-9c1e-8dcddd98c82f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92a26919-046c-4371-8a31-2755eb4a6eeb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/58c115bb-808e-4f91-9dbf-6fe8571cbbd5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ea59104-8a9d-48db-b771-26f3bb990f5e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3b6559b-d375-4908-b319-8e48b33c871c"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ced4435-5a65-4752-9b1c-1ec528116737"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/44f13264-4fba-40af-8a8c-a89d2ae72fc4"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a7f93f05-ecdd-47c9-ae4b-ffd78532dce7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dd25c609-f2d8-434d-83d9-1fac6061185b"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.47619047619047616, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.45, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f6288b9f-4fdf-4779-aa7a-965061ba3354"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8813559322033898, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9636871508379888, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a011301d-6ebb-44bc-9c1e-8dcddd98c82f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7ced4435-5a65-4752-9b1c-1ec528116737"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9ce33905-3fb9-470a-979c-1f2ace8134ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ea68cf65-f72d-4ef7-8c12-859c40c56f19"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92a26919-046c-4371-8a31-2755eb4a6eeb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93d8fcf8-93fd-4083-b673-bf8c439a8419"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd25c609-f2d8-434d-83d9-1fac6061185b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/097f4939-e2c2-49c7-a487-cfe4936301ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44f13264-4fba-40af-8a8c-a89d2ae72fc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1344, 16, 1.1904761904761905, 278.42336309523796, 80, 2962, 97.0, 725.0, 863.5, 1273.099999999999, 5.303114001167948, 758.7367772028737, 3.8661256873036978], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1227.2203389830506, 995, 1634, 1192.0, 1425.0, 1566.0, 1634.0, 0.2502842210645988, 301.17616350347004, 1.2306455596291552], "isController": true}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 466.79999999999995, 86, 819, 441.0, 807.6, 819.0, 819.0, 0.09293680297397769, 0.018206174488847583, 0.06257502710656754], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 466.79999999999995, 86, 819, 441.0, 807.6, 819.0, 819.0, 0.09152368633002221, 0.01792934714629146, 0.06162356536621678], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3b6559b-d375-4908-b319-8e48b33c871c", 3, 0, 0.0, 312.0, 190, 402, 344.0, 402.0, 402.0, 402.0, 0.04907172650691094, 0.03052606424306862, 0.03146852253210109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 112.41176470588235, 81, 254, 84.0, 246.0, 254.0, 254.0, 0.0902330667034676, 0.0400886108619381, 0.05056949671180089], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7f93f05-ecdd-47c9-ae4b-ffd78532dce7", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e809aca-5288-4acc-ba55-7da5b310e5b7", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 94.41176470588233, 82, 258, 84.0, 121.99999999999989, 258.0, 258.0, 0.0902325877644611, 0.0670576164929247, 0.04529252940520802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 160.58823529411765, 82, 566, 84.0, 437.1999999999999, 566.0, 566.0, 0.0902325877644611, 3.14279771446163, 0.05222273217641002], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ea59104-8a9d-48db-b771-26f3bb990f5e", 3, 0, 0.0, 1179.6666666666665, 253, 2962, 324.0, 2962.0, 2962.0, 2962.0, 0.03843394486010044, 0.031240091248590757, 0.02464676802552014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 199.29411764705884, 81, 756, 86.0, 729.6, 756.0, 756.0, 0.0902335456475584, 9.573495139994693, 0.05213516786093418], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 211.26666666666668, 81, 441, 190.0, 355.80000000000007, 441.0, 441.0, 0.0935407026777585, 0.17031593956958804, 0.060460422928697036], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3f0845ca-c453-480b-9b76-d7788dcb26f7", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 1.7642869475138123, 3.296572859116022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 85.76470588235293, 82, 110, 84.0, 96.39999999999999, 110.0, 110.0, 0.09256032755466503, 0.06878750905185557, 0.04646094566708773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 103.17647058823529, 81, 244, 85.0, 243.2, 244.0, 244.0, 0.09256032755466503, 0.02476711889646311, 0.05278831180851991], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 405.6666666666667, 402, 410, 405.0, 410.0, 410.0, 410.0, 0.05867282079364769, 17.251757434335335, 0.0334618431088772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 766.6666666666666, 730, 838, 732.0, 838.0, 838.0, 838.0, 0.05830223880597015, 52.46045696201609, 0.03319355978894589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 282.3333333333333, 246, 354, 247.0, 354.0, 354.0, 354.0, 0.05885584242329122, 0.10414725241308953, 0.032589123685552855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f6288b9f-4fdf-4779-aa7a-965061ba3354", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 87.47058823529412, 81, 141, 84.0, 98.59999999999997, 141.0, 141.0, 0.0908896492728828, 0.06754592099283575, 0.045622343482677505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 102.82352941176472, 81, 246, 84.0, 245.2, 246.0, 246.0, 0.09089159306229817, 0.03235089100494023, 0.051387583807395366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 168.70588235294116, 81, 721, 84.0, 344.19999999999965, 721.0, 721.0, 0.09081051051532293, 4.8295927833020835, 0.052927587298280475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 120.88235294117649, 81, 399, 84.0, 276.5999999999999, 399.0, 399.0, 0.09081342115525357, 1.5937525875147571, 0.05301796870409248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 83.33333333333333, 82, 84, 84.0, 84.0, 84.0, 84.0, 0.05904581955597544, 0.04388073113486065, 0.033155611567076054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 490.9333333333333, 81, 847, 571.0, 830.8, 847.0, 847.0, 0.08820986892013478, 52.92218851257579, 0.04680406456374339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 101.99999999999999, 81, 247, 83.0, 243.8, 247.0, 247.0, 0.09256083152295236, 0.02494803662142075, 0.054415645094548167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 417.2666666666666, 82, 680, 569.0, 666.8, 680.0, 680.0, 0.08820935019112026, 17.29891024698618, 0.04688993127021464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 102.29411764705883, 81, 243, 83.0, 243.0, 243.0, 243.0, 0.09255881568273015, 0.024947493289485864, 0.0545048494694202], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 489.57142857142867, 85, 1024, 483.0, 877.0, 1024.0, 1024.0, 0.08764845456992781, 0.017265571687044932, 0.05953687573953383], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 257.6470588235294, 165, 802, 172.0, 468.3999999999997, 802.0, 802.0, 0.09076929648455855, 6.520142941619324, 0.20277614723046858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/263058f1-f830-4fe3-a2cd-3754861e6336", 2, 0, 0.0, 242.0, 172, 312, 242.0, 312.0, 312.0, 312.0, 0.03851635019065593, 0.0340403290259215, 0.023941071187844238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61c7087f-289f-4481-9832-65cc5f707200", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 0.9886561532507739, 1.8473055340557274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93d8fcf8-93fd-4083-b673-bf8c439a8419", 3, 0, 0.0, 352.6666666666667, 282, 479, 297.0, 479.0, 479.0, 479.0, 0.034415115118560075, 0.028690465435752713, 0.022069588796732858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 521.9047619047619, 138, 1791, 411.0, 895.8000000000001, 1702.1999999999987, 1791.0, 0.09841643273236822, 0.06045306268423791, 0.044498836284264154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 92.2, 82, 204, 84.0, 133.80000000000004, 204.0, 204.0, 0.08820675663755843, 0.06555209160271677, 0.044275657140336946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 138.26666666666665, 81, 252, 85.0, 249.6, 252.0, 252.0, 0.08820986892013478, 0.11192775685243665, 0.04536835706178807], "isController": false}, {"data": ["login", 21, 0, 0.0, 2210.8095238095234, 1451, 3410, 2084.0, 3130.4, 3386.3999999999996, 3410.0, 0.09681702504333714, 16.6827701209406, 0.16901108180347066], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 95.35294117647061, 83, 187, 88.0, 121.39999999999995, 187.0, 187.0, 0.09513310240239065, 0.07701693544099789, 0.0338168449945998], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e809aca-5288-4acc-ba55-7da5b310e5b7", 3, 0, 0.0, 554.3333333333334, 193, 915, 555.0, 915.0, 915.0, 915.0, 0.022332561619259603, 0.022397989045878527, 0.01432133671547572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ce33905-3fb9-470a-979c-1f2ace8134ce", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a011301d-6ebb-44bc-9c1e-8dcddd98c82f", 1, 0, 0.0, 724.0, 724, 724, 724.0, 724.0, 724.0, 724.0, 1.3812154696132597, 0.2495359979281768, 0.9522833218232044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92a26919-046c-4371-8a31-2755eb4a6eeb", 3, 0, 0.0, 295.3333333333333, 174, 379, 333.0, 379.0, 379.0, 379.0, 0.03259664906447617, 0.027174485108764152, 0.020903450083664732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58c115bb-808e-4f91-9dbf-6fe8571cbbd5", 1, 0, 0.0, 155.0, 155, 155, 155.0, 155.0, 155.0, 155.0, 6.451612903225806, 2.0602318548387095, 3.849546370967742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ea59104-8a9d-48db-b771-26f3bb990f5e", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 585.6, 168, 930, 659.0, 915.0, 930.0, 930.0, 0.08816372591660887, 70.36185676296594, 0.18324394204998296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3b6559b-d375-4908-b319-8e48b33c871c", 1, 0, 0.0, 730.0, 730, 730, 730.0, 730.0, 730.0, 730.0, 1.36986301369863, 0.2474850171232877, 0.9444563356164384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 324.7647058823529, 165, 841, 328.0, 813.8, 841.0, 841.0, 0.09019189652336766, 12.817554435120194, 0.2001288135919188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, 57.142857142857146, 411.7142857142857, 81, 922, 85.0, 922.0, 922.0, 922.0, 0.08753720331140735, 44.89549660168072, 0.11773802694270066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ced4435-5a65-4752-9b1c-1ec528116737", 1, 0, 0.0, 1024.0, 1024, 1024, 1024.0, 1024.0, 1024.0, 1024.0, 0.9765625, 0.17642974853515625, 0.6732940673828125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44f13264-4fba-40af-8a8c-a89d2ae72fc4", 3, 0, 0.0, 379.0, 279, 565, 293.0, 565.0, 565.0, 565.0, 0.029607405799103884, 0.029694146245780945, 0.01898651999486805], "isController": false}, {"data": ["register", 23, 3, 13.043478260869565, 955.2608695652175, 201, 1656, 999.0, 1429.6000000000004, 1633.5999999999997, 1656.0, 0.09293417432026733, 0.02970484308266697, 0.04192928567965186], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a7f93f05-ecdd-47c9-ae4b-ffd78532dce7", 3, 0, 0.0, 342.0, 169, 615, 242.0, 615.0, 615.0, 615.0, 0.02883672645481285, 0.02892120905184843, 0.018492301795566834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 218.7058823529412, 167, 333, 173.0, 332.2, 333.0, 333.0, 0.09251599982585224, 0.14338173019885497, 0.2080706519520876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 99.6, 84, 248, 87.0, 171.20000000000005, 248.0, 248.0, 0.11584174473113132, 0.08993572955200137, 0.041178120197394336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 316.4761904761905, 167, 847, 205.0, 776.2000000000002, 844.5, 847.0, 0.11130191439292755, 12.837571294507516, 0.24760845808422907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 84.33333333333333, 83, 87, 84.0, 87.0, 87.0, 87.0, 0.038995983413708385, 0.028980413454914145, 0.019574155736959094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 110.0, 81, 246, 83.5, 246.0, 246.0, 246.0, 0.038996490315871574, 0.010434607760301572, 0.022240185883270504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 112.16666666666666, 83, 250, 84.0, 250.0, 250.0, 250.0, 0.03895420932693619, 0.01049937673265077, 0.022900814467593344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 112.33333333333333, 81, 251, 84.5, 251.0, 251.0, 251.0, 0.038953956423507415, 0.010499308567273484, 0.02293870676110837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 87.0, 85, 89, 87.0, 89.0, 89.0, 89.0, 0.2232142857142857, 0.06583077566964285, 0.13798304966517855], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 802.728813559322, 642, 1283, 676.0, 1074.0, 1223.0, 1283.0, 0.2470272986099481, 295.5305297217803, 0.48778241971612796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, 13.043478260869565, 955.2608695652175, 201, 1656, 999.0, 1429.6000000000004, 1633.5999999999997, 1656.0, 0.09158384301732925, 0.029273232431829766, 0.0413200541738341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 97.63636363636364, 81, 246, 83.0, 214.0000000000001, 246.0, 246.0, 0.05239866812112667, 0.014123078517022422, 0.030855856325233768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 83.81818181818183, 80, 88, 83.0, 88.0, 88.0, 88.0, 0.05239816892216966, 0.014122943967303542, 0.030804392276509898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd25c609-f2d8-434d-83d9-1fac6061185b", 3, 0, 0.0, 462.33333333333337, 202, 744, 441.0, 744.0, 744.0, 744.0, 0.029535698814633953, 0.024622696830819517, 0.01894053602370732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 235.33333333333334, 81, 743, 85.0, 735.2, 743.0, 743.0, 0.10893720859296702, 19.6278679422306, 0.06217080537278313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 160.46666666666667, 81, 421, 84.0, 413.2, 421.0, 421.0, 0.10893879092467246, 6.4298142548223565, 0.06227809395244458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 97.72727272727272, 81, 245, 83.0, 212.80000000000013, 245.0, 245.0, 0.0523575161594334, 0.014009726003598389, 0.02986014593467686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 95.6, 82, 257, 84.0, 155.60000000000008, 257.0, 257.0, 0.10893799975307387, 0.08095880645711837, 0.05468176940730465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 85.0, 82, 95, 84.0, 93.4, 95.0, 95.0, 0.05239766973272425, 0.038940065104104644, 0.026301174065058854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 116.13333333333335, 81, 255, 83.0, 250.2, 255.0, 255.0, 0.10881156014014928, 0.061801565798350416, 0.060228898718199815], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 107.18181818181817, 85, 293, 89.0, 253.00000000000014, 293.0, 293.0, 0.05362270092669777, 0.042206930612225003, 0.019061194470037096], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 621.7857142857142, 82, 2962, 490.5, 1853.0, 2962.0, 2962.0, 0.08560178051703475, 0.016528022354293542, 0.05825411347127449], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1192.0000000000002, 853, 2460, 1166.0, 1358.6, 2350.0999999999985, 2460.0, 0.09709949924401104, 0.050256576757154156, 0.04466197670305586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 200.45454545454547, 167, 333, 171.0, 332.2, 333.0, 333.0, 0.05233634188001656, 0.08111110797225222, 0.11770565952117006], "isController": false}, {"data": ["addBook", 60, 5, 8.333333333333334, 867.0333333333334, 422, 3434, 714.5, 1304.0, 1406.0, 3434.0, 0.2720594903418881, 98.70494988862565, 0.9864414831209758], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f6288b9f-4fdf-4779-aa7a-965061ba3354", 3, 0, 0.0, 289.3333333333333, 162, 378, 328.0, 378.0, 378.0, 378.0, 0.031919647607090415, 0.02661009684953078, 0.02046930526886983], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 157.61016949152543, 82, 497, 88.0, 338.0, 415.0, 497.0, 0.24761720897633369, 0.1840202109677636, 0.11969777191727068], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 449.5084745762712, 398, 599, 412.0, 574.0, 587.0, 599.0, 0.24766398294056902, 72.82143420271088, 0.12455756954530572], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 135.9830508474576, 81, 340, 86.0, 251.0, 278.0, 340.0, 0.24782939256595835, 0.43854185481398095, 0.12052640380649145], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 643.169491525424, 559, 838, 577.0, 750.0, 813.0, 838.0, 0.2474956793127171, 222.69704729658162, 0.12423122965501619], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 97.9047619047619, 83, 288, 87.0, 100.80000000000001, 269.39999999999975, 288.0, 0.11412051125989045, 0.08525604600958613, 0.04056627548691418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 5, 2.793296089385475, 152.11731843575419, 83, 2263, 93.0, 258.0, 309.0, 902.9999999999807, 0.7233199983836425, 1.600241317129349, 0.3467947188042995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 117.16666666666667, 85, 249, 90.5, 249.0, 249.0, 249.0, 0.03911776402860813, 0.030293346557310783, 0.013905142682044293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a011301d-6ebb-44bc-9c1e-8dcddd98c82f", 3, 0, 0.0, 324.6666666666667, 232, 502, 240.0, 502.0, 502.0, 502.0, 0.050376141859215476, 0.03238700526430682, 0.03230501284591617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 105.35294117647058, 84, 258, 88.0, 176.39999999999992, 258.0, 258.0, 0.08732906619543218, 0.07086958399258217, 0.03104275399915753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ced4435-5a65-4752-9b1c-1ec528116737", 3, 0, 0.0, 537.6666666666666, 299, 884, 430.0, 884.0, 884.0, 884.0, 0.01710532317657255, 0.02358106889739087, 0.010969233938101538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ce33905-3fb9-470a-979c-1f2ace8134ce", 3, 0, 0.0, 648.6666666666666, 157, 1261, 528.0, 1261.0, 1261.0, 1261.0, 0.04298918105610088, 0.027637901232356526, 0.027567931862148027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 225.0, 167, 335, 173.0, 335.0, 335.0, 335.0, 0.03893221900670932, 0.0603373355113747, 0.08755947301997223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea68cf65-f72d-4ef7-8c12-859c40c56f19", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 1.1783613929889298, 2.2017700645756455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 343.0666666666668, 165, 1000, 172.0, 888.4000000000001, 1000.0, 1000.0, 0.10874529676591488, 26.154263359359707, 0.2390060204114922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92a26919-046c-4371-8a31-2755eb4a6eeb", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93d8fcf8-93fd-4083-b673-bf8c439a8419", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd25c609-f2d8-434d-83d9-1fac6061185b", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/097f4939-e2c2-49c7-a487-cfe4936301ce", 1, 0, 0.0, 980.0, 980, 980, 980.0, 980.0, 980.0, 980.0, 1.0204081632653061, 0.3258529974489796, 0.6088568239795918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 93.0, 83, 169, 88.0, 110.59999999999995, 169.0, 169.0, 0.0896581913305803, 0.07433574652310808, 0.03187068519954221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44f13264-4fba-40af-8a8c-a89d2ae72fc4", 1, 0, 0.0, 577.0, 577, 577, 577.0, 577.0, 577.0, 577.0, 1.7331022530329288, 0.3131092937608319, 1.1948927642980938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 110.86666666666666, 85, 346, 90.0, 212.80000000000007, 346.0, 346.0, 0.08533005665915762, 0.06624745609768584, 0.030332168578059933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 104.8095238095238, 83, 347, 85.0, 169.80000000000004, 330.5999999999998, 347.0, 0.11145077060247102, 0.08282620744968794, 0.05594306258756846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 122.57142857142858, 81, 254, 83.0, 251.2, 253.8, 254.0, 0.11150758251561106, 0.04578738623571641, 0.0627022734272121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 169.71428571428572, 81, 761, 83.0, 640.0000000000003, 758.6999999999999, 761.0, 0.1116083291701655, 9.591538012601113, 0.06470002936361995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 176.8095238095238, 81, 570, 88.0, 371.4000000000001, 553.0999999999998, 570.0, 0.11151231945624468, 3.149891142735769, 0.06475327069615548], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 18.75, 0.22321428571428573], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 12.5, 0.1488095238095238], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 12.5, 0.1488095238095238], "isController": false}, {"data": ["401/Unauthorized", 9, 56.25, 0.6696428571428571], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1344, 16, "401/Unauthorized", 9, "406/Not Acceptable", 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
