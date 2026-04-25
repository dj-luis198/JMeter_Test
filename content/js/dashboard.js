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

    var data = {"OkPercent": 97.08365310821182, "KoPercent": 2.916346891788181};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7980895915678524, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d5de427-d8ad-4abe-98fd-a19286e70e02"], "isController": false}, {"data": [0.35454545454545455, 500, 1500, "see books"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19048c3d-c24a-4a02-86de-16d3c765f30d"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=645105cb-15c0-4c88-b0d7-615fdcd99b29"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8e61e132-24d6-40ee-9a40-a5047168062a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/645105cb-15c0-4c88-b0d7-615fdcd99b29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d4c3d8f-8af7-477d-b420-c52756d43743"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.3305084745762712, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4b7b0d5-0640-466e-a2dc-ebd96c91100c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d847dd0-97db-429a-ae22-a30f16afe7f7"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.7909090909090909, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9132947976878613, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/723f59d0-d6fd-4cea-b70f-626dc9cade40"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5d5de427-d8ad-4abe-98fd-a19286e70e02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=723f59d0-d6fd-4cea-b70f-626dc9cade40"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4b7b0d5-0640-466e-a2dc-ebd96c91100c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d847dd0-97db-429a-ae22-a30f16afe7f7"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d4c3d8f-8af7-477d-b420-c52756d43743"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/602ea6cc-e775-489f-86c1-a31b992c7d18"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7ea43fc6-0982-486e-834a-64837c78a327"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0234a2b0-8733-4a2b-ac28-ac8c3498650d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1624695-21d4-4d05-be13-5dcd30bf02e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f4f8c59-71d0-481a-bd3c-6612db62d9e1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e61e132-24d6-40ee-9a40-a5047168062a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0234a2b0-8733-4a2b-ac28-ac8c3498650d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19048c3d-c24a-4a02-86de-16d3c765f30d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/71d05b94-c031-4a18-a32a-49baa8705315"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d1624695-21d4-4d05-be13-5dcd30bf02e2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.23333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1303, 38, 2.916346891788181, 299.67152724481963, 81, 2090, 98.0, 845.6000000000001, 1017.1999999999996, 1447.8000000000002, 5.121573498313772, 718.0648931220373, 3.748350375765485], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d5de427-d8ad-4abe-98fd-a19286e70e02", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1410.527272727273, 1153, 2461, 1340.0, 1713.6, 1839.8, 2461.0, 0.25785520726870387, 310.2875959118815, 1.2678720396464103], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 278.93333333333334, 168, 849, 174.0, 604.8000000000002, 849.0, 849.0, 0.08173852391124287, 6.637412931443175, 0.18243761818028248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 92.78947368421052, 85, 125, 89.0, 109.0, 125.0, 125.0, 0.12855383699373468, 0.09980498086915926, 0.04569687174386663], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19048c3d-c24a-4a02-86de-16d3c765f30d", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 0.9926596840659341, 3.7882039835164836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 330.8666666666666, 170, 813, 332.0, 672.6000000000001, 813.0, 813.0, 0.09930092151255164, 8.063532212391431, 0.2216362950660682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 107.57142857142857, 83, 246, 85.0, 246.0, 246.0, 246.0, 0.05206435153850159, 0.03869235500078096, 0.026133863955849428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 177.71428571428572, 83, 247, 243.0, 247.0, 247.0, 247.0, 0.05212754866479008, 0.025132925249095214, 0.02910357837004602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=645105cb-15c0-4c88-b0d7-615fdcd99b29", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.3109536359724613, 1.186666308089501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 234.57142857142858, 81, 967, 88.0, 967.0, 967.0, 967.0, 0.052125607821819776, 6.712430060931112, 0.030004221243419144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 189.57142857142856, 84, 490, 94.0, 490.0, 490.0, 490.0, 0.05212716048463366, 2.2016307656362866, 0.030056020407783327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 96.25, 83, 104, 99.0, 104.0, 104.0, 104.0, 0.04405771560744575, 0.012993584095164665, 0.02723489646436832], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 957.0545454545452, 659, 2090, 912.0, 1362.9999999999998, 1469.3999999999999, 2090.0, 0.25464141858419376, 304.6396643073753, 0.5028173323996481], "isController": false}, {"data": ["deleteBook", 14, 4, 28.571428571428573, 452.7142857142857, 87, 1340, 422.5, 1125.0, 1340.0, 1340.0, 0.08467093246888342, 0.01806108478584302, 0.05639216400759619], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 4, 28.571428571428573, 452.7142857142857, 87, 1340, 422.5, 1125.0, 1340.0, 1340.0, 0.08472935024692553, 0.018073545832526388, 0.05643107116055002], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 878.2916666666667, 282, 2026, 883.0, 1596.5, 1990.0, 2026.0, 0.09433443128129741, 0.02934132457333323, 0.04256104223824161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 128.53333333333333, 82, 255, 86.0, 253.2, 255.0, 255.0, 0.0867222459905415, 0.03188849253610536, 0.04897322667460657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 105.75, 82, 253, 84.5, 253.0, 253.0, 253.0, 0.05045567784049699, 0.013599381917946454, 0.029711693103339532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 98.00000000000001, 83, 257, 87.0, 157.40000000000006, 257.0, 257.0, 0.08671823511047903, 0.06444587589753374, 0.043528489108189676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 85.375, 81, 93, 84.0, 93.0, 93.0, 93.0, 0.050456632524345325, 0.01359963923507745, 0.029662981230132703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 155.73333333333332, 81, 513, 84.0, 357.6000000000001, 513.0, 513.0, 0.08672324876852987, 1.7217839586561365, 0.05057162364711732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 154.2, 82, 970, 84.0, 535.6000000000003, 970.0, 970.0, 0.08672274737663689, 5.224034893258752, 0.05048664108345619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 126.89473684210526, 82, 249, 84.0, 248.0, 249.0, 249.0, 0.12584781687155575, 0.03391991939116151, 0.07398475171550445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 121.63157894736842, 82, 285, 85.0, 257.0, 285.0, 285.0, 0.12584364920089283, 0.03391879607367815, 0.07410519576966638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 86.75, 82, 93, 86.5, 93.0, 93.0, 93.0, 0.050456314292381725, 0.013501005972766204, 0.028775866744873955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 94.78947368421053, 82, 248, 86.0, 99.0, 248.0, 248.0, 0.1258444827129421, 0.09352309701616109, 0.06316803136176978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e61e132-24d6-40ee-9a40-a5047168062a", 3, 0, 0.0, 367.3333333333333, 295, 425, 382.0, 425.0, 425.0, 425.0, 0.021216407355021217, 0.02507707522984441, 0.013605573727015558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 87.25, 83, 94, 86.5, 94.0, 94.0, 94.0, 0.050454723192774886, 0.037496137060255556, 0.025325905977623332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 100.78947368421052, 81, 246, 84.0, 246.0, 246.0, 246.0, 0.12584698331533944, 0.0336738998324248, 0.07177210767202952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 112.75, 85, 268, 91.5, 268.0, 268.0, 268.0, 0.051438013978280295, 0.04048734303368547, 0.018284606531341827], "isController": false}, {"data": ["deleteAccount", 14, 4, 28.571428571428573, 373.7142857142857, 83, 616, 443.5, 591.0, 616.0, 616.0, 0.08402604807490321, 0.017267071542178075, 0.057170066470605886], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1342.7619047619044, 919, 1813, 1347.0, 1630.6000000000001, 1795.7999999999997, 1813.0, 0.09533667465678797, 0.04934417731259534, 0.043851146253268684], "isController": false}, {"data": ["goToProfile", 14, 4, 28.571428571428573, 176.28571428571428, 82, 329, 178.0, 312.0, 329.0, 329.0, 0.08481918367594225, 0.1428010475169184, 0.05481061087987787], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 195.5, 168, 347, 175.5, 347.0, 347.0, 347.0, 0.050428007715485175, 0.0781535627387451, 0.113413771258557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 85.19999999999999, 83, 89, 85.0, 88.4, 89.0, 89.0, 0.08177595568833547, 0.06077295144416338, 0.04104769650762152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/645105cb-15c0-4c88-b0d7-615fdcd99b29", 3, 0, 0.0, 567.6666666666666, 171, 916, 616.0, 916.0, 916.0, 916.0, 0.04023173479240425, 0.025865128976236457, 0.02579964763705611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 123.8, 82, 353, 83.0, 297.8, 353.0, 353.0, 0.0817768473389814, 0.030070028240271284, 0.04618049308713051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 582.2857142857143, 482, 727, 517.0, 727.0, 727.0, 727.0, 0.044010210368805563, 12.940463124944987, 0.02509957310095942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d4c3d8f-8af7-477d-b420-c52756d43743", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 891.8571428571429, 722, 1007, 922.0, 1007.0, 1007.0, 1007.0, 0.043940316495822536, 39.53757402177871, 0.025016801286195836], "isController": false}, {"data": ["addBook", 59, 13, 22.033898305084747, 854.2033898305084, 432, 1860, 728.0, 1534.0, 1654.0, 1860.0, 0.2702578901561999, 77.78882380559754, 0.9830979670537309], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 204.42857142857144, 82, 258, 249.0, 258.0, 258.0, 258.0, 0.04412033506243027, 0.07807231165344107, 0.024429912090232386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 20, 0, 0.0, 102.80000000000001, 83, 263, 85.0, 234.70000000000033, 262.34999999999997, 263.0, 0.098256922200169, 0.07302101347102403, 0.049320369151256704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4b7b0d5-0640-466e-a2dc-ebd96c91100c", 1, 0, 0.0, 884.0, 884, 884, 884.0, 884.0, 884.0, 884.0, 1.1312217194570138, 0.20437111142533937, 0.7799243495475113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 20, 0, 0.0, 116.94999999999999, 81, 251, 84.0, 250.70000000000002, 251.0, 251.0, 0.09817637385563163, 0.03364266561127065, 0.05557894914463834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d847dd0-97db-429a-ae22-a30f16afe7f7", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 20, 0, 0.0, 162.14999999999998, 82, 938, 86.0, 261.7, 904.1999999999995, 938.0, 0.09784640072014951, 4.427172197740238, 0.057102547920274756], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 146.61818181818177, 83, 359, 88.0, 351.0, 356.59999999999997, 359.0, 0.2553223095991904, 0.1897463648486171, 0.1234224055191399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 20, 0, 0.0, 146.40000000000003, 82, 488, 85.0, 256.7, 476.4499999999998, 488.0, 0.09806228916607829, 1.466787758271554, 0.057324303022279754], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 534.8909090909091, 405, 746, 493.0, 684.0, 730.8, 746.0, 0.25520975922119266, 75.04014297256728, 0.12835256445206467], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 85.00000000000001, 81, 91, 85.0, 91.0, 91.0, 91.0, 0.04412172553765474, 0.032789680795073495, 0.024775382992335428], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 120.98181818181818, 82, 263, 89.0, 250.8, 256.4, 263.0, 0.25568789341069054, 0.452447717636886, 0.124348213787621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 612.6, 81, 1063, 844.0, 1055.8, 1063.0, 1063.0, 0.06931864394247478, 37.43129601747061, 0.0371775383332101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 140.86666666666667, 83, 763, 84.0, 454.00000000000017, 763.0, 763.0, 0.08177729317159602, 4.926128909976829, 0.04760758825132888], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 807.6181818181818, 568, 1729, 809.0, 1066.2, 1100.8, 1729.0, 0.25510322404092783, 229.5423294156629, 0.12804986050491887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 415.1333333333334, 83, 738, 490.0, 737.4, 738.0, 738.0, 0.06937186092329323, 12.246057438166549, 0.037273826054683525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 144.26666666666665, 81, 658, 84.0, 415.0000000000001, 658.0, 658.0, 0.08177729317159602, 1.6235880639225841, 0.04768744888919176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 122.80000000000001, 85, 260, 89.0, 256.4, 260.0, 260.0, 0.10381772376180061, 0.07755913933376705, 0.03690395649345256], "isController": false}, {"data": ["deleteBooks", 14, 4, 28.571428571428573, 413.42857142857144, 83, 1459, 404.5, 1171.5, 1459.0, 1459.0, 0.08494475557146584, 0.018119493759594207, 0.05683524661282788], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 13, 7.514450867052023, 141.0693641618497, 83, 644, 92.0, 262.79999999999995, 331.1999999999996, 580.3599999999992, 0.7252756466691821, 1.5621274381105101, 0.34847228336058356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 112.85714285714285, 84, 264, 88.0, 264.0, 264.0, 264.0, 0.048894973596714256, 0.037864955138861726, 0.01738063514570702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/723f59d0-d6fd-4cea-b70f-626dc9cade40", 3, 0, 0.0, 295.0, 169, 434, 282.0, 434.0, 434.0, 434.0, 0.023758048038773134, 0.023827651695136728, 0.01523546700403095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d5de427-d8ad-4abe-98fd-a19286e70e02", 3, 0, 0.0, 539.0, 190, 909, 518.0, 909.0, 909.0, 909.0, 0.022990619827110537, 0.031694425445251674, 0.014743333678192631], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=723f59d0-d6fd-4cea-b70f-626dc9cade40", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 20, 0, 0.0, 283.0, 169, 1024, 176.0, 512.3000000000001, 998.4999999999997, 1024.0, 0.09780572848151717, 5.994483489476104, 0.21871615004865835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 102.60000000000001, 85, 256, 88.0, 176.80000000000004, 256.0, 256.0, 0.08657309077477145, 0.07025609222054206, 0.030774028361344536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4b7b0d5-0640-466e-a2dc-ebd96c91100c", 3, 0, 0.0, 357.3333333333333, 248, 495, 329.0, 495.0, 495.0, 495.0, 0.01748058198684295, 0.024098393461679652, 0.011209878422552281], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d847dd0-97db-429a-ae22-a30f16afe7f7", 3, 0, 0.0, 279.0, 181, 453, 203.0, 453.0, 453.0, 453.0, 0.025188070929607738, 0.025425848942940622, 0.016152506422958086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 458.66666666666663, 94, 968, 405.0, 908.4000000000001, 965.5999999999999, 968.0, 0.09526617823848299, 0.05851799425000567, 0.04307445363712659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 98.26666666666667, 83, 257, 85.0, 164.00000000000006, 257.0, 257.0, 0.06936544490996366, 0.05154990583640853, 0.0348182018395716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 183.8, 83, 258, 244.0, 256.2, 258.0, 258.0, 0.06931672196600708, 0.08101391879777077, 0.03603928005342009], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d4c3d8f-8af7-477d-b420-c52756d43743", 3, 0, 0.0, 275.6666666666667, 175, 401, 251.0, 401.0, 401.0, 401.0, 0.03469090404495941, 0.028920379316126645, 0.02224644562778973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/602ea6cc-e775-489f-86c1-a31b992c7d18", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 1.7545930631868132, 3.2784598214285716], "isController": false}, {"data": ["login", 21, 0, 0.0, 2388.714285714286, 1614, 3245, 2427.0, 3080.4, 3231.5, 3245.0, 0.0963439755194546, 38.54985273852016, 0.1986153635952819], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 413.14285714285717, 174, 1051, 331.0, 1051.0, 1051.0, 1051.0, 0.05202990976527078, 8.961382541549598, 0.11511472362826858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ea43fc6-0982-486e-834a-64837c78a327", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.6779956210191083, 1.266835854564756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0234a2b0-8733-4a2b-ac28-ac8c3498650d", 3, 0, 0.0, 317.6666666666667, 212, 463, 278.0, 463.0, 463.0, 463.0, 0.03510783958057834, 0.029267961317012092, 0.02251381639770161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 105.13333333333334, 83, 263, 93.0, 174.20000000000005, 263.0, 263.0, 0.08248964754923256, 0.06678116974444707, 0.029322491902266264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 243.42105263157893, 166, 502, 174.0, 372.0, 502.0, 502.0, 0.1257720084465833, 0.1949220482468044, 0.2828641947778138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1624695-21d4-4d05-be13-5dcd30bf02e2", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 0.8442245911214954, 3.2217435747663554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f4f8c59-71d0-481a-bd3c-6612db62d9e1", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e61e132-24d6-40ee-9a40-a5047168062a", 1, 0, 0.0, 1459.0, 1459, 1459, 1459.0, 1459.0, 1459.0, 1459.0, 0.6854009595613434, 0.12382732179575051, 0.4725518334475668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 20, 0, 0.0, 93.0, 84, 112, 90.5, 109.60000000000001, 111.9, 112.0, 0.09759049078257814, 0.0809124283929774, 0.03469036977036958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 724.4000000000001, 170, 1154, 928.0, 1144.4, 1154.0, 1154.0, 0.06928342463349069, 49.775187916855266, 0.14518395759623468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 96.13333333333334, 86, 126, 92.0, 116.4, 126.0, 126.0, 0.06806023784784454, 0.052839735438512114, 0.024193287672475985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0234a2b0-8733-4a2b-ac28-ac8c3498650d", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19048c3d-c24a-4a02-86de-16d3c765f30d", 3, 0, 0.0, 300.3333333333333, 184, 523, 194.0, 523.0, 523.0, 523.0, 0.05301664722722935, 0.023988652228466405, 0.0339983056763157], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71d05b94-c031-4a18-a32a-49baa8705315", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 0.5295786691542289, 0.9895185530679934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1624695-21d4-4d05-be13-5dcd30bf02e2", 3, 0, 0.0, 361.0, 192, 566, 325.0, 566.0, 566.0, 566.0, 0.08836003770028275, 0.0399806160167295, 0.05666317521795476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 297.6666666666667, 167, 1061, 177.0, 726.8000000000002, 1061.0, 1061.0, 0.08667614325832958, 7.038362409567891, 0.19345821740399174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 8, 53.333333333333336, 502.6666666666668, 82, 1093, 105.0, 1085.2, 1093.0, 1093.0, 0.08403643819960335, 46.92916411055834, 0.11812700111768462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 107.00000000000001, 83, 247, 86.0, 246.4, 247.0, 247.0, 0.09935814637442124, 0.07383940370208454, 0.04987313206684816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 127.8, 81, 249, 86.0, 248.4, 249.0, 249.0, 0.09936143716382714, 0.03653602845711561, 0.05611074908587478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 148.53333333333333, 81, 729, 83.0, 446.4000000000002, 729.0, 729.0, 0.09935814637442124, 5.985170434410376, 0.05784248339062987], "isController": false}, {"data": ["register", 24, 9, 37.5, 878.2916666666667, 282, 2026, 883.0, 1596.5, 1990.0, 2026.0, 0.09337576743208859, 0.02904314641320333, 0.042128520071899336], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 185.26666666666662, 82, 513, 86.0, 403.80000000000007, 513.0, 513.0, 0.09936077898850727, 1.9726866533633622, 0.05794104800781638], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 23.68421052631579, 0.6907137375287797], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.526315789473685, 0.3069838833461243], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.526315789473685, 0.3069838833461243], "isController": false}, {"data": ["401/Unauthorized", 21, 55.26315789473684, 1.6116653875671527], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1303, 38, "401/Unauthorized", 21, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
