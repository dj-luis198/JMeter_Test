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

    var data = {"OkPercent": 99.29411764705883, "KoPercent": 0.7058823529411765};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8252197430696416, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/10218e5b-380b-45c5-bdb3-9b97f0acb19f"], "isController": false}, {"data": [0.32727272727272727, 500, 1500, "see books"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9589c8c2-39e4-4f27-b220-b98a80b041fa"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/daeaa38f-19d7-4d43-8b3c-d37408cf6d22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c5587fad-f138-4c79-ab82-3191b1e2eabc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0bdd8a9b-d456-4615-b0f4-c174cc4bc303"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/160c5be1-1b15-4618-8076-e952743e9599"], "isController": false}, {"data": [0.875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc7447c9-9ca2-4087-b635-635e4036e921"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2beff9de-5804-409d-ac86-7de283da0bc5"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de59381c-90d9-4586-873f-a9d038950a7e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2e869b0d-3b3d-4ff9-b22c-d5a4b69d8dc1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc7447c9-9ca2-4087-b635-635e4036e921"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dee70fd2-c22f-4bcf-bb0f-1b70a67996aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2df6862b-bd02-4245-a449-948e3bc0c1f5"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9589c8c2-39e4-4f27-b220-b98a80b041fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=daeaa38f-19d7-4d43-8b3c-d37408cf6d22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=160c5be1-1b15-4618-8076-e952743e9599"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0bdd8a9b-d456-4615-b0f4-c174cc4bc303"], "isController": false}, {"data": [0.4396551724137931, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10218e5b-380b-45c5-bdb3-9b97f0acb19f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8363636363636363, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.97953216374269, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5587fad-f138-4c79-ab82-3191b1e2eabc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/52f40e52-e7b6-4b2c-b14c-621312a1b8b3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad200fc4-c6ab-4ee4-9ef4-6d81cae6030a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2df6862b-bd02-4245-a449-948e3bc0c1f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dee70fd2-c22f-4bcf-bb0f-1b70a67996aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2beff9de-5804-409d-ac86-7de283da0bc5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4ba3cd5d-0391-4b6d-821a-1eae7797ba9c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e869b0d-3b3d-4ff9-b22c-d5a4b69d8dc1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de59381c-90d9-4586-873f-a9d038950a7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1275, 9, 0.7058823529411765, 312.3027450980392, 81, 2839, 106.0, 867.6000000000017, 1066.4, 1502.44, 5.17606748780072, 722.142980427868, 3.791457541276601], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/10218e5b-380b-45c5-bdb3-9b97f0acb19f", 3, 0, 0.0, 540.6666666666666, 481, 637, 504.0, 637.0, 637.0, 637.0, 0.021625050458451072, 0.02556007754382677, 0.013867626758837437], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1402.3999999999999, 1020, 1757, 1422.0, 1653.6, 1743.8, 1757.0, 0.24308747613322962, 292.51582261216276, 1.1952592210261828], "isController": true}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 523.8461538461538, 89, 1216, 527.0, 965.9999999999998, 1216.0, 1216.0, 0.10577447255152436, 0.020039304370113014, 0.07150424267511778], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 523.8461538461538, 89, 1216, 527.0, 965.9999999999998, 1216.0, 1216.0, 0.10396589918506731, 0.019696664494045953, 0.07028163512367944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 116.4666666666667, 82, 249, 84.0, 247.8, 249.0, 249.0, 0.09424182452172274, 0.025217050702101593, 0.053747290547545006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 86.86666666666667, 82, 110, 85.0, 99.2, 110.0, 110.0, 0.09424241662687542, 0.0700375772002463, 0.04730527553341208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 127.59999999999998, 82, 249, 84.0, 247.8, 249.0, 249.0, 0.09424182452172274, 0.025401116765620582, 0.055495918150975404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 110.86666666666669, 82, 330, 84.0, 279.6, 330.0, 330.0, 0.09424300873946835, 0.025401435949309825, 0.0554045813097265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9589c8c2-39e4-4f27-b220-b98a80b041fa", 3, 0, 0.0, 332.3333333333333, 189, 413, 395.0, 413.0, 413.0, 413.0, 0.018293686848668524, 0.025219324154984114, 0.011731303089803708], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 224.46153846153848, 83, 481, 198.0, 406.99999999999994, 481.0, 481.0, 0.10439838423423785, 0.2585726507352056, 0.06748408175598082], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/daeaa38f-19d7-4d43-8b3c-d37408cf6d22", 3, 0, 0.0, 293.6666666666667, 182, 395, 304.0, 395.0, 395.0, 395.0, 0.020367843249078355, 0.024074101184050622, 0.013061409896056107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 85.15789473684212, 83, 99, 84.0, 91.0, 99.0, 99.0, 0.09319390217583237, 0.06925835894121916, 0.046778970428103354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 82.73684210526318, 81, 85, 83.0, 85.0, 85.0, 85.0, 0.09319344506736905, 0.024936527293417107, 0.053149386639983906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 558.0, 487, 664, 493.0, 664.0, 664.0, 664.0, 0.30564215416590257, 89.86894159942538, 0.1743115410477413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 887.6, 738, 1062, 879.0, 1062.0, 1062.0, 1062.0, 0.295351172544155, 265.7575042272137, 0.16815403671215076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 183.2, 84, 255, 245.0, 255.0, 255.0, 255.0, 0.31013521895546453, 0.5487939616672869, 0.17172526283959808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5587fad-f138-4c79-ab82-3191b1e2eabc", 3, 0, 0.0, 463.0, 188, 662, 539.0, 662.0, 662.0, 662.0, 0.03791229622140781, 0.023584113958043728, 0.024312247251358526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 99.61538461538461, 83, 264, 85.0, 196.79999999999995, 264.0, 264.0, 0.0686410653093336, 0.05101157294961218, 0.03445459723534909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 121.38461538461539, 81, 249, 84.0, 248.2, 249.0, 249.0, 0.06864179017788784, 0.026297560840386716, 0.03870382189567504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0bdd8a9b-d456-4615-b0f4-c174cc4bc303", 3, 0, 0.0, 364.6666666666667, 179, 567, 348.0, 567.0, 567.0, 567.0, 0.017672632161834186, 0.024363150131955655, 0.011333035598572051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 159.99999999999997, 82, 734, 84.0, 540.3999999999999, 734.0, 734.0, 0.06864179017788784, 4.768155134735913, 0.03990010309468871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 167.07692307692307, 83, 654, 85.0, 493.1999999999998, 654.0, 654.0, 0.06864179017788784, 1.5696137480265484, 0.0399671360929093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 84.0, 82, 86, 84.0, 86.0, 86.0, 86.0, 0.31344032096288865, 0.23293758227808425, 0.17600408647818455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 103.15789473684211, 81, 247, 84.0, 246.0, 247.0, 247.0, 0.09319344506736905, 0.025118545740814312, 0.054787552666558756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 584.7222222222223, 82, 1146, 751.5, 1078.5, 1146.0, 1146.0, 0.1031406322520757, 51.57131216729984, 0.05571116182192197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 95.26315789473684, 82, 245, 84.0, 111.0, 245.0, 245.0, 0.0931943592887799, 0.025118792152053954, 0.054879100245248315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 407.66666666666663, 82, 795, 488.5, 734.7, 795.0, 795.0, 0.10313767733950631, 16.860078162602278, 0.05581028612110655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/160c5be1-1b15-4618-8076-e952743e9599", 3, 0, 0.0, 608.0, 198, 1101, 525.0, 1101.0, 1101.0, 1101.0, 0.018234200065643122, 0.025137316822265172, 0.011693155641053693], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 513.0, 396, 910, 465.0, 858.7000000000002, 910.0, 910.0, 0.10352949296430822, 0.018704058787497087, 0.0713787324539078], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dc7447c9-9ca2-4087-b635-635e4036e921", 3, 0, 0.0, 303.3333333333333, 171, 491, 248.0, 491.0, 491.0, 491.0, 0.07553630778527545, 0.03550599884177661, 0.04843962445865646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 298.6923076923077, 167, 820, 181.0, 695.9999999999999, 820.0, 820.0, 0.06861099675944984, 6.4122006845266375, 0.15295737310923926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 688.8, 143, 1629, 781.0, 1368.2000000000007, 1617.9999999999998, 1629.0, 0.0847454036211711, 0.052055526247770136, 0.03831750183261935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 112.44444444444444, 83, 256, 84.5, 251.5, 256.0, 256.0, 0.1031400412560165, 0.07664997206623882, 0.051771466021086406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 154.72222222222223, 82, 333, 87.0, 274.5000000000001, 333.0, 333.0, 0.10313708637730984, 0.11365671107291218, 0.054008200830826525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2beff9de-5804-409d-ac86-7de283da0bc5", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["login", 20, 0, 0.0, 2779.2999999999997, 1740, 4822, 2688.5, 3837.1000000000004, 4773.799999999999, 4822.0, 0.08444483852035754, 25.37214856829054, 0.16241612252523843], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 96.84210526315789, 84, 251, 87.0, 97.0, 251.0, 251.0, 0.08866323835478361, 0.07177912558214415, 0.03151701050892699], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de59381c-90d9-4586-873f-a9d038950a7e", 3, 0, 0.0, 325.3333333333333, 191, 489, 296.0, 489.0, 489.0, 489.0, 0.03782768229790561, 0.03153538228025269, 0.024257986369425145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 707.9444444444445, 168, 1232, 835.5, 1163.6000000000001, 1232.0, 1232.0, 0.1030868793310807, 68.58642116717255, 0.21719161631636216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e869b0d-3b3d-4ff9-b22c-d5a4b69d8dc1", 3, 0, 0.0, 399.3333333333333, 290, 515, 393.0, 515.0, 515.0, 515.0, 0.01779127278765523, 0.024526705812408817, 0.011409116989479426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 264.6666666666667, 168, 416, 329.0, 370.40000000000003, 416.0, 416.0, 0.09419270571686929, 0.14598029684831207, 0.21184160279877928], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, 16.666666666666668, 824.1666666666666, 83, 1148, 893.5, 1148.0, 1148.0, 1148.0, 0.24006721882126994, 239.34725160544954, 0.47693041551634463], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1123.0000000000002, 221, 1868, 1130.0, 1658.2, 1850.7999999999997, 1868.0, 0.0885052723855121, 0.02795423223783474, 0.03993108968955722], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 199.42105263157896, 168, 332, 174.0, 331.0, 332.0, 332.0, 0.09315460723075868, 0.1443714469484512, 0.20950689497308322], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 97.26315789473684, 84, 251, 87.0, 112.0, 251.0, 251.0, 0.09192021325489476, 0.07136383743910286, 0.03267476330545087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc7447c9-9ca2-4087-b635-635e4036e921", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.3261084160649819, 1.2445002256317688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 400.05882352941177, 169, 981, 334.0, 977.8, 981.0, 981.0, 0.10434056761268781, 14.828282326012104, 0.23152361587633802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 85.57142857142857, 81, 92, 85.0, 92.0, 92.0, 92.0, 0.05341065160994964, 0.03969287683122234, 0.026809643483900504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 84.28571428571429, 83, 88, 83.0, 88.0, 88.0, 88.0, 0.05341024408481547, 0.014291412968007263, 0.03046052982962132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dee70fd2-c22f-4bcf-bb0f-1b70a67996aa", 1, 0, 0.0, 910.0, 910, 910, 910.0, 910.0, 910.0, 910.0, 1.098901098901099, 0.19853193681318682, 0.7576407967032966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 83.71428571428572, 82, 88, 83.0, 88.0, 88.0, 88.0, 0.05341024408481547, 0.014395729850985419, 0.03139938177642471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 108.57142857142856, 82, 252, 84.0, 252.0, 252.0, 252.0, 0.05334146155604663, 0.014377190810028195, 0.03141103644364856], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 965.1818181818182, 653, 1400, 907.0, 1305.0, 1387.3999999999999, 1400.0, 0.2551221571274173, 305.2147947368299, 0.5037666032340212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1123.0000000000002, 221, 1868, 1130.0, 1658.2, 1850.7999999999997, 1868.0, 0.08867307083289348, 0.028007231077800065, 0.040006795629684365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 116.0, 82, 245, 84.0, 245.0, 245.0, 245.0, 0.03129400719762166, 0.008434712877483961, 0.01842801400406822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 83.8, 82, 87, 83.0, 87.0, 87.0, 87.0, 0.031325769204262804, 0.00844327373083646, 0.018416126036099816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2df6862b-bd02-4245-a449-948e3bc0c1f5", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 135.0, 82, 729, 84.0, 251.0, 729.0, 729.0, 0.0931098696461825, 4.4332711962780555, 0.054317281069293344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 130.47368421052627, 81, 654, 84.0, 249.0, 654.0, 654.0, 0.09318658897847881, 1.4658974634855708, 0.05445303917024699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 110.36842105263156, 82, 250, 85.0, 250.0, 250.0, 250.0, 0.09318384682537348, 0.06925088616612228, 0.046773923113517545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 116.2, 83, 245, 85.0, 245.0, 245.0, 245.0, 0.03129400719762166, 0.008373591769676107, 0.0178473634798936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9589c8c2-39e4-4f27-b220-b98a80b041fa", 1, 0, 0.0, 739.0, 739, 739, 739.0, 739.0, 739.0, 739.0, 1.3531799729364007, 0.2444709912043302, 0.9329541610284168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=daeaa38f-19d7-4d43-8b3c-d37408cf6d22", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 135.8421052631579, 81, 261, 84.0, 251.0, 261.0, 261.0, 0.09310941336169087, 0.0322743566874611, 0.052689897261113096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 120.8, 83, 249, 85.0, 249.0, 249.0, 249.0, 0.03132184448077779, 0.02327726918932802, 0.01572209771789041], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 174.2, 86, 378, 92.0, 378.0, 378.0, 378.0, 0.033831330518566634, 0.026628957419887408, 0.012025980770271734], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 486.66666666666663, 390, 662, 496.5, 633.5000000000001, 662.0, 662.0, 0.10273532811095415, 0.018560581738795427, 0.0699282457942725], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1481.1, 785, 2839, 1372.5, 2059.4000000000005, 2801.6499999999996, 2839.0, 0.08582070338648495, 0.044418918744958034, 0.03947417118655704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 238.8, 169, 494, 174.0, 494.0, 494.0, 494.0, 0.0312738463078097, 0.04846835360399805, 0.07033561332703687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=160c5be1-1b15-4618-8076-e952743e9599", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0bdd8a9b-d456-4615-b0f4-c174cc4bc303", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["addBook", 58, 2, 3.4482758620689653, 902.0517241379309, 524, 2582, 735.5, 1463.2000000000003, 1715.8499999999995, 2582.0, 0.27770329796606275, 81.20992304506454, 1.0126126823026391], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10218e5b-380b-45c5-bdb3-9b97f0acb19f", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 158.10909090909092, 83, 351, 86.0, 335.0, 338.4, 351.0, 0.25619765416111573, 0.1903968894693448, 0.12384554571264872], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 513.5090909090909, 405, 754, 493.0, 662.8, 704.7999999999998, 754.0, 0.2561785611148891, 75.32500289656441, 0.12883980368571082], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 138.89090909090905, 82, 352, 86.0, 253.0, 262.3999999999999, 352.0, 0.25656455397418493, 0.45399899589963194, 0.12477455847572666], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 805.4545454545454, 568, 1064, 807.0, 1000.0, 1055.0, 1064.0, 0.2555857095059296, 229.97647068519044, 0.12829204559184357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 88.52941176470587, 84, 98, 88.0, 93.19999999999999, 98.0, 98.0, 0.11331671354867953, 0.08465555260228501, 0.04028055051925718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 2, 1.1695906432748537, 153.73099415204686, 83, 1264, 92.0, 281.60000000000014, 349.80000000000024, 763.6000000000008, 0.7397601619685407, 1.531889584306702, 0.357315852173424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 107.42857142857142, 85, 213, 89.0, 213.0, 213.0, 213.0, 0.05515850189508853, 0.04271551953398946, 0.019607123720519752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 90.53333333333335, 84, 137, 86.0, 111.20000000000002, 137.0, 137.0, 0.09050265172769563, 0.07344502303292486, 0.0321708644813293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 195.2857142857143, 165, 337, 171.0, 337.0, 337.0, 337.0, 0.053308151577921285, 0.08261722319742293, 0.11989128230854756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5587fad-f138-4c79-ab82-3191b1e2eabc", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52f40e52-e7b6-4b2c-b14c-621312a1b8b3", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 272.3157894736842, 166, 815, 170.0, 501.0, 815.0, 815.0, 0.09306973372259342, 5.996846114705998, 0.20806270910075045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad200fc4-c6ab-4ee4-9ef4-6d81cae6030a", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 1.2142050855513307, 2.268744058935361], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2df6862b-bd02-4245-a449-948e3bc0c1f5", 3, 0, 0.0, 584.6666666666666, 198, 1054, 502.0, 1054.0, 1054.0, 1054.0, 0.02910332651022012, 0.02426224583094848, 0.01866326602380652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dee70fd2-c22f-4bcf-bb0f-1b70a67996aa", 3, 0, 0.0, 274.6666666666667, 180, 390, 254.0, 390.0, 390.0, 390.0, 0.024932267340391934, 0.025005311092365742, 0.015988465709821653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 103.23076923076924, 85, 248, 89.0, 191.59999999999997, 248.0, 248.0, 0.06889424733034792, 0.05712032810885291, 0.02448975198070961], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 91.16666666666667, 84, 156, 87.0, 103.80000000000008, 156.0, 156.0, 0.10192640913260625, 0.07913231959025582, 0.036231653246356126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2beff9de-5804-409d-ac86-7de283da0bc5", 3, 0, 0.0, 613.0, 206, 1228, 405.0, 1228.0, 1228.0, 1228.0, 0.026175269605276934, 0.026251954965448646, 0.016785573282029807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ba3cd5d-0391-4b6d-821a-1eae7797ba9c", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 1.5501744538834952, 2.896503337378641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e869b0d-3b3d-4ff9-b22c-d5a4b69d8dc1", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de59381c-90d9-4586-873f-a9d038950a7e", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 112.41176470588235, 82, 335, 84.0, 264.5999999999999, 335.0, 335.0, 0.1044996311777723, 0.07766037043582492, 0.05245391643103024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 151.8235294117647, 82, 256, 84.0, 253.6, 256.0, 256.0, 0.10439503079653409, 0.04638046692212745, 0.05850631436414215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 237.17647058823528, 81, 898, 86.0, 889.2, 898.0, 898.0, 0.1045002735448337, 11.087150058550888, 0.0603782026260304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 238.29411764705878, 82, 657, 247.0, 654.6, 657.0, 657.0, 0.10439503079653409, 3.6360750845906797, 0.06041934370835713], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 55.55555555555556, 0.39215686274509803], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 11.11111111111111, 0.0784313725490196], "isController": false}, {"data": ["401/Unauthorized", 3, 33.333333333333336, 0.23529411764705882], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1275, 9, "406/Not Acceptable", 5, "401/Unauthorized", 3, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
