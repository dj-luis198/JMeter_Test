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

    var data = {"OkPercent": 98.55842185128984, "KoPercent": 1.4415781487101669};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.819016393442623, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3793103448275862, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1cb18afd-28b1-4eae-9cd1-1db7b9f64f43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eaabc446-85a4-4291-b5be-a6eaae772ef6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca60e59c-4906-4a75-a412-15b37d5ea3e6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d6c1cf3c-7a7c-4b08-9872-a3cba86b5b07"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3919952-1271-449a-a16c-d2323b5f5698"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=224aa221-e9e1-4c28-a44e-73852bbded65"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bd1156c6-e6a6-4f14-87b3-23dd076fe09d"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c1d4f43-cd9b-4887-8b23-597f831bc213"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/575dcc8b-85e4-4e19-8985-e02c792f5e64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b70a1f3-f883-423f-a625-94cc08be053b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d7b12696-1f93-47e1-92d1-d75cbcfc3d2f"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e3919952-1271-449a-a16c-d2323b5f5698"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/484f007e-8be0-46be-a24b-a8e52bcb6b24"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3778a88e-9a03-46b9-ac9c-58fb42ea3c30"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ca60e59c-4906-4a75-a412-15b37d5ea3e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d9076a3d-6695-4c65-bcba-dfb118eed81c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c1d4f43-cd9b-4887-8b23-597f831bc213"], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd1156c6-e6a6-4f14-87b3-23dd076fe09d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4b70a1f3-f883-423f-a625-94cc08be053b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9f101c93-9e23-41b3-9faa-02ef439222cd"], "isController": false}, {"data": [0.3728813559322034, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7844827586206896, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9346590909090909, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eaabc446-85a4-4291-b5be-a6eaae772ef6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f101c93-9e23-41b3-9faa-02ef439222cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7b12696-1f93-47e1-92d1-d75cbcfc3d2f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/224aa221-e9e1-4c28-a44e-73852bbded65"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d6c1cf3c-7a7c-4b08-9872-a3cba86b5b07"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3778a88e-9a03-46b9-ac9c-58fb42ea3c30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1318, 19, 1.4415781487101669, 297.103945371775, 77, 2237, 90.0, 854.1000000000001, 1019.0, 1564.0099999999989, 5.144880297606733, 713.1865820250744, 3.7731556819113345], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1359.2586206896551, 963, 1916, 1350.0, 1665.1, 1745.4499999999996, 1916.0, 0.24697982004539318, 297.2002921175113, 1.2143978456333542], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1cb18afd-28b1-4eae-9cd1-1db7b9f64f43", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.6082589285714285, 1.1365327380952381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eaabc446-85a4-4291-b5be-a6eaae772ef6", 3, 0, 0.0, 272.3333333333333, 178, 456, 183.0, 456.0, 456.0, 456.0, 0.03049245311785333, 0.03058178647659704, 0.019554079636123392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca60e59c-4906-4a75-a412-15b37d5ea3e6", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6c1cf3c-7a7c-4b08-9872-a3cba86b5b07", 3, 0, 0.0, 505.3333333333333, 174, 1161, 181.0, 1161.0, 1161.0, 1161.0, 0.02450740123517302, 0.024579200262229192, 0.015716009255628532], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 529.1666666666666, 90, 1073, 492.5, 995.0000000000002, 1073.0, 1073.0, 0.07226956547923756, 0.013744626833087418, 0.048832535984221145], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 529.1666666666666, 90, 1073, 492.5, 995.0000000000002, 1073.0, 1073.0, 0.07069885821343985, 0.013445901012761143, 0.04777120928924081], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3919952-1271-449a-a16c-d2323b5f5698", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 142.93333333333334, 79, 239, 81.0, 238.4, 239.0, 239.0, 0.10555277990838018, 0.03881263677881063, 0.05960708417482355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 113.46666666666667, 80, 239, 83.0, 237.8, 239.0, 239.0, 0.10555426544786674, 0.07844413672444003, 0.052983293398636236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 158.46666666666667, 78, 468, 83.0, 331.20000000000005, 468.0, 468.0, 0.10555352267289668, 2.0956359995566753, 0.06155227230345934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 179.2, 78, 934, 82.0, 519.4000000000003, 934.0, 934.0, 0.10555352267289668, 6.358369657672333, 0.061449192691474086], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=224aa221-e9e1-4c28-a44e-73852bbded65", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd1156c6-e6a6-4f14-87b3-23dd076fe09d", 3, 0, 0.0, 318.3333333333333, 181, 546, 228.0, 546.0, 546.0, 546.0, 0.037938186048864384, 0.0316275047106581, 0.02432884977742931], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 202.75, 82, 304, 190.0, 299.5, 304.0, 304.0, 0.07258298654795316, 0.17005730653609794, 0.046917859875520176], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5c1d4f43-cd9b-4887-8b23-597f831bc213", 3, 0, 0.0, 261.3333333333333, 176, 424, 184.0, 424.0, 424.0, 424.0, 0.03028895664640672, 0.025250656891747266, 0.019423582224420973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 84.94444444444446, 80, 108, 83.0, 96.30000000000001, 108.0, 108.0, 0.09193523673323459, 0.06832296401756985, 0.046147179375861894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 567.4, 467, 639, 621.0, 639.0, 639.0, 639.0, 0.026546464276423026, 7.805541922840048, 0.015139780407647506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 89.61111111111111, 79, 238, 81.0, 103.00000000000021, 238.0, 238.0, 0.0919366454361117, 0.03994296097289401, 0.0515747023551104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 832.4, 701, 876, 859.0, 876.0, 876.0, 876.0, 0.026491048674652833, 23.83669216374912, 0.015082306032541605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 174.8, 79, 241, 237.0, 241.0, 241.0, 241.0, 0.026581040275592226, 0.04703598142516905, 0.01471821273072343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 82.99999999999999, 79, 88, 83.0, 87.2, 88.0, 88.0, 0.09703639435590666, 0.07211396103988767, 0.04870772138567971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 100.8235294117647, 78, 254, 81.0, 242.0, 254.0, 254.0, 0.09694121940649164, 0.025939349724002646, 0.055286789192764765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 107.94117647058823, 79, 242, 80.0, 238.8, 242.0, 242.0, 0.09703694824505825, 0.026154489956675856, 0.05704711215187995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 99.58823529411764, 78, 245, 81.0, 237.79999999999998, 245.0, 245.0, 0.09703750214053314, 0.026154639248815573, 0.05714220096752098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 81.6, 80, 84, 81.0, 84.0, 84.0, 84.0, 0.026603102985932277, 0.01977047009013131, 0.014938265836827207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 525.75, 78, 987, 716.0, 974.4, 987.0, 987.0, 0.08273479877345662, 41.885022100856304, 0.04463962531478005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 187.61111111111111, 78, 1076, 81.0, 876.2000000000003, 1076.0, 1076.0, 0.0919361758636893, 9.213618891990315, 0.053170553098249126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 388.75000000000006, 79, 707, 473.0, 700.0, 707.0, 707.0, 0.08273479877345662, 13.693568645967453, 0.04472042101670726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 137.94444444444443, 80, 475, 81.0, 406.60000000000014, 475.0, 475.0, 0.0919366454361117, 3.0256294148743277, 0.053260606552018266], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 472.50000000000006, 89, 991, 425.0, 888.4000000000003, 991.0, 991.0, 0.07073302996722702, 0.013452399986442837, 0.048346900935444324], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/575dcc8b-85e4-4e19-8985-e02c792f5e64", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 1.0788376266891893, 2.0158097550675675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 213.52941176470588, 161, 338, 169.0, 334.8, 338.0, 338.0, 0.09689591099255612, 0.15016973705584624, 0.2179211748201726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 580.1499999999999, 88, 1374, 540.5, 1182.3000000000004, 1365.4499999999998, 1374.0, 0.08470018252889336, 0.05202774883854874, 0.038297055186403924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 83.75, 80, 94, 82.0, 89.80000000000001, 94.0, 94.0, 0.08273394315143931, 0.06148489329906769, 0.041528561308437316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 131.0, 79, 248, 82.5, 245.9, 248.0, 248.0, 0.08273522659110183, 0.09203687987362194, 0.04327642162388566], "isController": false}, {"data": ["login", 20, 0, 0.0, 2480.9, 1202, 3366, 2514.0, 3110.6, 3353.35, 3366.0, 0.08787693713723302, 26.403350919247686, 0.1690172145427543], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b70a1f3-f883-423f-a625-94cc08be053b", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 105.72222222222223, 80, 248, 85.0, 239.0, 248.0, 248.0, 0.09617285467747365, 0.07785868801525943, 0.03418644443613321], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7b12696-1f93-47e1-92d1-d75cbcfc3d2f", 3, 0, 0.0, 318.6666666666667, 274, 393, 289.0, 393.0, 393.0, 393.0, 0.016745276436605172, 0.023084715400072564, 0.010738344589880272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 621.5, 163, 1071, 799.0, 1059.8, 1071.0, 1071.0, 0.08269887787960077, 55.7079155182506, 0.1740896178019672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3919952-1271-449a-a16c-d2323b5f5698", 3, 0, 0.0, 379.6666666666667, 223, 612, 304.0, 612.0, 612.0, 612.0, 0.05332101025540764, 0.03428027189271813, 0.034193486394255554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/484f007e-8be0-46be-a24b-a8e52bcb6b24", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 1.8674616228070173, 3.4893548976608186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 676.7142857142857, 81, 959, 935.0, 959.0, 959.0, 959.0, 0.037071362372567196, 31.68157520190653, 0.06672638355620283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 346.53333333333336, 161, 1172, 322.0, 755.0000000000002, 1172.0, 1172.0, 0.10549265067866939, 8.5663191636191, 0.23545602494901188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3778a88e-9a03-46b9-ac9c-58fb42ea3c30", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 0.5610685170807453, 2.1411587732919255], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1095.318181818182, 98, 2237, 991.0, 2008.1999999999996, 2228.15, 2237.0, 0.08897372848453475, 0.02799386485699495, 0.04014244390610845], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 99.80952380952381, 80, 246, 86.0, 209.8000000000001, 245.29999999999998, 246.0, 0.09950673091958434, 0.07725376082135699, 0.035371533256571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 291.72222222222223, 161, 1160, 167.5, 959.3000000000003, 1160.0, 1160.0, 0.0918962797322755, 12.342141017393924, 0.20406438419281883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 233.24999999999997, 160, 786, 164.5, 467.50000000000034, 786.0, 786.0, 0.08541670003256512, 6.510859807505458, 0.19073824385934005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca60e59c-4906-4a75-a412-15b37d5ea3e6", 3, 0, 0.0, 285.3333333333333, 202, 408, 246.0, 408.0, 408.0, 408.0, 0.01633550958622154, 0.022519818716682367, 0.010475570926060038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 99.9, 80, 250, 83.0, 234.20000000000005, 250.0, 250.0, 0.05365324977733901, 0.03987316707085448, 0.02693141639214087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 111.6, 79, 240, 81.0, 239.3, 240.0, 240.0, 0.053652674049274617, 0.01435628192334106, 0.030598790668726932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 96.2, 77, 239, 80.5, 223.40000000000006, 239.0, 239.0, 0.05365296191176234, 0.014461149890279692, 0.031542073311407154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9076a3d-6695-4c65-bcba-dfb118eed81c", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.6141075721153846, 1.1474609375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 96.8, 79, 237, 81.5, 221.80000000000007, 237.0, 237.0, 0.05365238618987579, 0.01446099471523996, 0.031594129758296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 3.31372893258427, 6.945663623595506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c1d4f43-cd9b-4887-8b23-597f831bc213", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 960.0689655172414, 626, 1581, 938.5, 1324.2, 1337.6, 1581.0, 0.25227153115770884, 301.8044550391238, 0.4981377304696165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1095.318181818182, 98, 2237, 991.0, 2008.1999999999996, 2228.15, 2237.0, 0.0878952288871665, 0.027654535793334344, 0.039655855220577074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 81.0, 79, 83, 81.0, 83.0, 83.0, 83.0, 0.031061688513387586, 0.008372095732123998, 0.018291209153879603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 80.5, 79, 81, 81.0, 81.0, 81.0, 81.0, 0.03106072371486256, 0.008371835688771548, 0.01826030827768287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 106.00000000000001, 78, 297, 81.0, 242.20000000000002, 291.69999999999993, 297.0, 0.10084711577248891, 0.02718144917305365, 0.059287073920935865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 103.19047619047618, 78, 242, 81.0, 238.2, 241.7, 242.0, 0.10092320705116806, 0.02720195815051014, 0.0594303650897015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 83.0, 81, 84, 83.5, 84.0, 84.0, 84.0, 0.031060964908874892, 0.00831123475100754, 0.017714456549592715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 97.8095238095238, 80, 266, 81.0, 206.2000000000001, 262.99999999999994, 266.0, 0.10092078199188789, 0.07500069833576825, 0.05065750189827185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 82.5, 81, 84, 82.5, 84.0, 84.0, 84.0, 0.0310600001553, 0.023082675896663383, 0.015590664140453321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 118.19047619047618, 78, 247, 81.0, 239.6, 246.29999999999998, 247.0, 0.10084130459836349, 0.026982927206983982, 0.05751105652875418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd1156c6-e6a6-4f14-87b3-23dd076fe09d", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 88.75, 85, 93, 88.5, 93.0, 93.0, 93.0, 0.031298169839518636, 0.024635082901027363, 0.01112552131014139], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 545.1666666666667, 81, 1161, 470.5, 1066.8000000000004, 1161.0, 1161.0, 0.07019555311171038, 0.013190228852127218, 0.047773877821714994], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1340.5000000000002, 683, 1907, 1335.0, 1823.9, 1902.8999999999999, 1907.0, 0.08593538518388025, 0.044478275534625515, 0.03952692033360117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 167.25, 164, 171, 167.0, 171.0, 171.0, 171.0, 0.031039995033600793, 0.04810592980305123, 0.06980967633045178], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b70a1f3-f883-423f-a625-94cc08be053b", 3, 0, 0.0, 559.0, 247, 1019, 411.0, 1019.0, 1019.0, 1019.0, 0.016152914254946832, 0.022268096311751247, 0.010358476914793378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f101c93-9e23-41b3-9faa-02ef439222cd", 3, 0, 0.0, 401.0, 171, 847, 185.0, 847.0, 847.0, 847.0, 0.01987110277996728, 0.02738098244388069, 0.012742862134288912], "isController": false}, {"data": ["addBook", 59, 9, 15.254237288135593, 889.457627118644, 408, 3140, 756.0, 1541.0, 1780.0, 3140.0, 0.28716750626657905, 76.7747242781266, 1.0472944197026113], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 148.8275862068965, 80, 337, 84.0, 325.1, 329.05, 337.0, 0.2532275598905009, 0.1881896221451867, 0.12240980678300581], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 516.7241379310344, 387, 788, 475.0, 648.8, 699.35, 788.0, 0.2529558766447584, 74.37742665915069, 0.12721901999223686], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 125.51724137931032, 78, 343, 83.0, 245.1, 247.0, 343.0, 0.2535496957403651, 0.44866411004056794, 0.12330834812373224], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 809.8620689655174, 544, 1261, 808.5, 1023.6, 1054.3999999999999, 1261.0, 0.2526814732201204, 227.3632337701165, 0.12683425511244326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 87.93749999999999, 81, 112, 86.0, 99.4, 112.0, 112.0, 0.08802720040492512, 0.06576250811500754, 0.03129091889393823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 9, 5.113636363636363, 161.2670454545455, 80, 1900, 87.0, 310.1000000000001, 337.85000000000014, 1538.0999999999951, 0.7412742335603486, 1.5714237203542953, 0.3556038397268236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 105.9, 80, 296, 85.5, 275.30000000000007, 296.0, 296.0, 0.05224332852694711, 0.04045796828307525, 0.01857087068731323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eaabc446-85a4-4291-b5be-a6eaae772ef6", 1, 0, 0.0, 649.0, 649, 649, 649.0, 649.0, 649.0, 649.0, 1.5408320493066257, 0.2783729776579353, 1.062331471494607], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 96.19999999999999, 81, 245, 85.0, 159.20000000000005, 245.0, 245.0, 0.11358903487183371, 0.09218016404149786, 0.04037735223959713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f101c93-9e23-41b3-9faa-02ef439222cd", 1, 0, 0.0, 991.0, 991, 991, 991.0, 991.0, 991.0, 991.0, 1.0090817356205852, 0.18230480575176589, 0.6957145560040363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 228.89999999999998, 163, 490, 167.0, 472.80000000000007, 490.0, 490.0, 0.05362907983224824, 0.08311459931033002, 0.12061305747428486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 243.38095238095238, 161, 501, 167.0, 462.6000000000001, 499.2, 501.0, 0.1008011289726445, 0.1562220621870965, 0.22670410158593776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7b12696-1f93-47e1-92d1-d75cbcfc3d2f", 1, 0, 0.0, 542.0, 542, 542, 542.0, 542.0, 542.0, 542.0, 1.8450184501845017, 0.33332852859778594, 1.2720537361623616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/224aa221-e9e1-4c28-a44e-73852bbded65", 3, 0, 0.0, 380.0, 173, 718, 249.0, 718.0, 718.0, 718.0, 0.027862655682588625, 0.023227949610387197, 0.01786765354645169], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d6c1cf3c-7a7c-4b08-9872-a3cba86b5b07", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 104.41176470588235, 82, 247, 87.0, 241.4, 247.0, 247.0, 0.10044313146233383, 0.08327755723781388, 0.03570439438700148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 86.625, 82, 99, 86.0, 93.4, 99.0, 99.0, 0.08243810701496768, 0.06400224128603446, 0.029304170852976787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3778a88e-9a03-46b9-ac9c-58fb42ea3c30", 3, 0, 0.0, 962.6666666666666, 196, 2207, 485.0, 2207.0, 2207.0, 2207.0, 0.10091835704914724, 0.045662928482524304, 0.06471652453998049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 81.1875, 79, 84, 81.0, 84.0, 84.0, 84.0, 0.08545365207545558, 0.06350608323185712, 0.04289372770193767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 111.37499999999999, 79, 244, 81.5, 239.8, 244.0, 244.0, 0.08545593411347481, 0.030888064075927597, 0.048288027223056015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 140.5625, 78, 705, 81.0, 385.8000000000003, 705.0, 705.0, 0.08545547769612032, 4.827405179469856, 0.04977948481028884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 136.0625, 79, 638, 80.0, 365.0000000000003, 638.0, 638.0, 0.08545547769612032, 1.5920151035880619, 0.049862937425226454], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 31.57894736842105, 0.4552352048558422], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.07587253414264036], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.07587253414264036], "isController": false}, {"data": ["401/Unauthorized", 11, 57.89473684210526, 0.834597875569044], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1318, 19, "401/Unauthorized", 11, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
