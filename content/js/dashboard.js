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

    var data = {"OkPercent": 97.28301886792453, "KoPercent": 2.7169811320754715};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7750320924261874, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.10714285714285714, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2d09bc06-6312-40a6-8b94-38bc4ed9c597"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=46e0c82b-e2a7-4cd5-a40b-07e676cce79e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2fb8d86b-1c0b-4cb6-ab9f-a67b276bb8f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01349f64-728a-458e-a1bc-04422b126123"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=304d7cd2-b131-4391-adeb-13ca2e857665"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/08fddfdd-e5d3-40d2-98de-617c085b3d52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c655a93-9f39-4e1c-ab5f-ba9a6243940e"], "isController": false}, {"data": [0.8695652173913043, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a5ba1d36-cedd-4190-8050-0810d4bd1711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/304d7cd2-b131-4391-adeb-13ca2e857665"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ffbc8cc5-6b3c-4b0b-bbe6-9f8b212c17a3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41825ff6-eb43-4aeb-912f-ddd8720a5423"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/27843b6a-37ce-4dac-87e3-a6b8223a6d24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/90eed881-a1af-472f-b570-d49ccfa2c7a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c75fa63-5287-4096-8081-33f1e8513844"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0458b32a-cfc1-4b5f-9bc8-53fe9162c72c"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e103b08c-93ce-4a0f-9e84-4030a52f4eb0"], "isController": false}, {"data": [0.9347826086956522, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.45535714285714285, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2bfec31f-815b-4184-a11c-03c7c6f8802a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/41825ff6-eb43-4aeb-912f-ddd8720a5423"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.43478260869565216, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/01349f64-728a-458e-a1bc-04422b126123"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2fb8d86b-1c0b-4cb6-ab9f-a67b276bb8f6"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5535714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6c655a93-9f39-4e1c-ab5f-ba9a6243940e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9098837209302325, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=08fddfdd-e5d3-40d2-98de-617c085b3d52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5ba1d36-cedd-4190-8050-0810d4bd1711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc0bb0ae-467d-4446-ab45-6e828c7239e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c75fa63-5287-4096-8081-33f1e8513844"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27843b6a-37ce-4dac-87e3-a6b8223a6d24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e103b08c-93ce-4a0f-9e84-4030a52f4eb0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0458b32a-cfc1-4b5f-9bc8-53fe9162c72c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90eed881-a1af-472f-b570-d49ccfa2c7a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/46e0c82b-e2a7-4cd5-a40b-07e676cce79e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1325, 36, 2.7169811320754715, 352.3660377358486, 97, 2301, 115.0, 1001.2000000000003, 1199.4, 1500.8400000000001, 5.2386449898785425, 741.2659185618041, 3.815639356852543], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1692.8392857142858, 1223, 2236, 1716.0, 2044.9, 2117.45, 2236.0, 0.25218068746256694, 303.45785528768863, 1.2399704700918208], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2d09bc06-6312-40a6-8b94-38bc4ed9c597", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 1.557736280487805, 2.9106326219512195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=46e0c82b-e2a7-4cd5-a40b-07e676cce79e", 1, 0, 0.0, 749.0, 749, 749, 749.0, 749.0, 749.0, 749.0, 1.335113484646195, 0.24120702603471295, 0.9204981642189586], "isController": false}, {"data": ["deleteBook", 18, 5, 27.77777777777778, 359.11111111111114, 106, 697, 417.0, 561.1000000000003, 697.0, 697.0, 0.10036186026283657, 0.021317094342936476, 0.06688068194490134], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, 27.77777777777778, 359.11111111111114, 106, 697, 417.0, 561.1000000000003, 697.0, 697.0, 0.10133708655876143, 0.021524234693877552, 0.06753056826178748], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2fb8d86b-1c0b-4cb6-ab9f-a67b276bb8f6", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 180.3684210526316, 100, 410, 102.0, 304.0, 410.0, 410.0, 0.09753893857100321, 0.04152022457057199, 0.05476538676755957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 139.3157894736842, 99, 369, 105.0, 304.0, 369.0, 369.0, 0.09754094152677242, 0.07248892236511115, 0.04896098041480569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 217.7894736842105, 100, 804, 103.0, 504.0, 804.0, 804.0, 0.09754094152677242, 3.0424992941116074, 0.05655629941218748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 231.8421052631579, 99, 1201, 102.0, 1092.0, 1201.0, 1201.0, 0.09754094152677242, 9.26220825953591, 0.05646104458647775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01349f64-728a-458e-a1bc-04422b126123", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 0.6273057725694445, 2.393934461805556], "isController": false}, {"data": ["goToProfile", 18, 5, 27.77777777777778, 190.77777777777774, 101, 424, 196.5, 277.30000000000024, 424.0, 424.0, 0.10114348326918214, 0.15101832698845277, 0.06536024464080016], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 108.94444444444446, 100, 198, 103.0, 128.7000000000001, 198.0, 198.0, 0.1061608691036484, 0.07889494276159807, 0.05328777999929226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=304d7cd2-b131-4391-adeb-13ca2e857665", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 101.83333333333331, 100, 104, 102.0, 104.0, 104.0, 104.0, 0.10616274749190509, 0.02840682891873242, 0.06054594192897712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 683.3333333333333, 503, 803, 698.0, 803.0, 803.0, 803.0, 0.06754855052068674, 19.86151667604841, 0.038523782718829155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 990.1666666666667, 802, 1118, 1015.0, 1118.0, 1118.0, 1118.0, 0.0671952694530305, 60.462421570521435, 0.03825668172960624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 209.66666666666666, 101, 340, 204.5, 340.0, 340.0, 340.0, 0.06777057401676193, 0.11992214855309824, 0.03752530807373438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 131.42857142857142, 100, 303, 103.0, 298.5, 303.0, 303.0, 0.0625066971461228, 0.04645273098456978, 0.03137543196592492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 115.35714285714286, 99, 301, 101.0, 202.0, 301.0, 301.0, 0.0625066971461228, 0.01672542482230239, 0.03564835071614816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 186.8571428571429, 99, 304, 104.5, 303.5, 304.0, 304.0, 0.06250641806971252, 0.016847432995352202, 0.03674693718551458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 202.35714285714286, 100, 313, 200.0, 309.5, 313.0, 313.0, 0.06250613899579423, 0.016847357776210162, 0.03680781427193742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 103.16666666666667, 102, 105, 103.0, 105.0, 105.0, 105.0, 0.06792862965311114, 0.05048211637306403, 0.0381435176274794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 842.1428571428571, 98, 1305, 1075.0, 1257.5, 1305.0, 1305.0, 0.11889394659963312, 76.42414314088084, 0.06259845904952782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08fddfdd-e5d3-40d2-98de-617c085b3d52", 3, 0, 0.0, 301.3333333333333, 214, 432, 258.0, 432.0, 432.0, 432.0, 0.03165692336914083, 0.031749668261823856, 0.020300826509507628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 101.77777777777777, 99, 107, 101.5, 104.30000000000001, 107.0, 107.0, 0.10616399978767199, 0.02861451556777097, 0.062412820187674356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 567.7142857142859, 100, 915, 695.0, 871.0, 915.0, 915.0, 0.11889596602972399, 24.98012871549894, 0.06271563163481954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 118.77777777777777, 99, 407, 102.0, 137.90000000000043, 407.0, 407.0, 0.10616274749190509, 0.028614178034927547, 0.06251575853283084], "isController": false}, {"data": ["deleteBooks", 17, 4, 23.529411764705884, 452.05882352941177, 103, 1349, 416.0, 970.5999999999997, 1349.0, 1349.0, 0.09847993326536288, 0.02043933817140143, 0.06624540547664289], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 349.92857142857144, 206, 606, 402.0, 601.0, 606.0, 606.0, 0.06247768654052124, 0.09682821146465548, 0.14051378135041057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c655a93-9f39-4e1c-ab5f-ba9a6243940e", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 351.34782608695656, 113, 840, 278.0, 737.2000000000003, 834.3999999999999, 840.0, 0.10910194865567426, 0.06701672432072178, 0.04933027561286833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 116.85714285714286, 99, 300, 103.5, 202.5, 300.0, 300.0, 0.1188899079452427, 0.0883547069788376, 0.059677160824076904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 202.4285714285714, 99, 307, 200.0, 307.0, 307.0, 307.0, 0.11889495630610357, 0.1593670117451232, 0.06067490934259581], "isController": false}, {"data": ["login", 23, 0, 0.0, 2043.9999999999998, 1026, 3221, 2104.0, 2839.6, 3146.3999999999987, 3221.0, 0.10632003254317518, 33.32692427702378, 0.2064058614118376], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 127.55555555555556, 103, 307, 105.0, 301.6, 307.0, 307.0, 0.10673371124973316, 0.08640844397073125, 0.03794049892080358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5ba1d36-cedd-4190-8050-0810d4bd1711", 3, 0, 0.0, 413.6666666666667, 203, 649, 389.0, 649.0, 649.0, 649.0, 0.0717240060248165, 0.03175281516723648, 0.04599488667607048], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/304d7cd2-b131-4391-adeb-13ca2e857665", 3, 0, 0.0, 305.0, 248, 406, 261.0, 406.0, 406.0, 406.0, 0.017979898473506617, 0.024786741547949392, 0.011530078122658867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffbc8cc5-6b3c-4b0b-bbe6-9f8b212c17a3", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 1.6985954122340425, 3.173828125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41825ff6-eb43-4aeb-912f-ddd8720a5423", 1, 0, 0.0, 1349.0, 1349, 1349, 1349.0, 1349.0, 1349.0, 1349.0, 0.7412898443291327, 0.1339244347664937, 0.5110845997034841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 960.4999999999998, 204, 1409, 1177.0, 1362.0, 1409.0, 1409.0, 0.118787014882316, 101.56014679741723, 0.24544565812248637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27843b6a-37ce-4dac-87e3-a6b8223a6d24", 3, 0, 0.0, 353.3333333333333, 234, 424, 402.0, 424.0, 424.0, 424.0, 0.02738875600270236, 0.032372582371683674, 0.01756375303558712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90eed881-a1af-472f-b570-d49ccfa2c7a5", 3, 0, 0.0, 271.0, 201, 396, 216.0, 396.0, 396.0, 396.0, 0.055277122641509434, 0.03503403573665979, 0.03544789440227005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c75fa63-5287-4096-8081-33f1e8513844", 3, 0, 0.0, 280.6666666666667, 202, 418, 222.0, 418.0, 418.0, 418.0, 0.028789681778050746, 0.028874026548884883, 0.018462133171471346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 441.7894736842106, 207, 1307, 395.0, 1194.0, 1307.0, 1307.0, 0.09748689057866167, 12.411835894608975, 0.21662472966628699], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 9, 60.0, 498.8, 101, 1222, 103.0, 1206.4, 1222.0, 1222.0, 0.10098901912732021, 48.343404007412595, 0.13112135471719708], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0458b32a-cfc1-4b5f-9bc8-53fe9162c72c", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["register", 26, 6, 23.076923076923077, 903.1923076923077, 255, 1678, 851.0, 1519.7, 1654.1999999999998, 1678.0, 0.10533010861154661, 0.033295455005813414, 0.047521982596225136], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 120.62499999999999, 102, 312, 106.0, 184.60000000000014, 312.0, 312.0, 0.0845871617835203, 0.06567069689247915, 0.030068092665235736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 229.77777777777777, 202, 529, 207.0, 323.8000000000003, 529.0, 529.0, 0.10609704342905645, 0.16442969523624273, 0.23861473732140331], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e103b08c-93ce-4a0f-9e84-4030a52f4eb0", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 23, 0, 0.0, 350.69565217391306, 205, 1302, 210.0, 611.4, 1164.199999999998, 1302.0, 0.13061725169944402, 6.987701303191037, 0.292308232223276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 134.83333333333331, 99, 301, 102.5, 301.0, 301.0, 301.0, 0.04551074432822349, 0.033821949642361404, 0.022844260336627807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 100.0, 97, 102, 100.0, 102.0, 102.0, 102.0, 0.045510399126200335, 0.023570001630789303, 0.025318122430558716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 352.0, 100, 1207, 200.0, 1207.0, 1207.0, 1207.0, 0.045131445334536835, 6.778362586501937, 0.025885939674301403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 222.0, 99, 825, 102.0, 825.0, 825.0, 825.0, 0.0452614983064656, 2.2282300443939866, 0.026004734541312434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 104.75, 103, 106, 105.0, 106.0, 106.0, 106.0, 0.052419830421848584, 0.015459754675193626, 0.03240405532913101], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1172.7678571428576, 793, 1814, 1133.5, 1526.2000000000005, 1700.85, 1814.0, 0.2499364001124714, 299.01082648611737, 0.4935267588158371], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 6, 23.076923076923077, 903.1923076923077, 255, 1678, 851.0, 1519.7, 1654.1999999999998, 1678.0, 0.10554303923359516, 0.03336276360388885, 0.047618050904219694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2bfec31f-815b-4184-a11c-03c7c6f8802a", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 1.7076788101604279, 3.1908004679144386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41825ff6-eb43-4aeb-912f-ddd8720a5423", 3, 0, 0.0, 352.66666666666663, 189, 679, 190.0, 679.0, 679.0, 679.0, 0.023908764155980776, 0.023978809363469, 0.015332117639089236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 155.0, 104, 302, 107.0, 302.0, 302.0, 302.0, 0.04416229643941485, 0.011903118962186033, 0.026005727297819487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 104.0, 103, 105, 104.0, 105.0, 105.0, 105.0, 0.04416424683397555, 0.011903644654469974, 0.02596374667388016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 260.875, 98, 1145, 103.5, 1051.9, 1145.0, 1145.0, 0.08105821499678299, 9.136157299165607, 0.04678262213193238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 176.18750000000003, 98, 798, 102.0, 658.0000000000001, 798.0, 798.0, 0.08105862565100208, 2.998357771242426, 0.04686201795448558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 114.75, 99, 293, 103.0, 162.80000000000013, 293.0, 293.0, 0.08105903630938208, 0.060240162726015394, 0.0406878365849828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 152.25, 102, 301, 103.0, 301.0, 301.0, 301.0, 0.04416473445953406, 0.011817516837805013, 0.02518770012145302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 152.49999999999997, 99, 303, 103.0, 303.0, 303.0, 303.0, 0.08105821499678299, 0.036907610099853584, 0.045377560299712745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 153.5, 100, 308, 103.0, 308.0, 308.0, 308.0, 0.044065481305219555, 0.03274788210280477, 0.022118806045784034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 106.75, 105, 110, 106.0, 110.0, 110.0, 110.0, 0.043347746459030966, 0.034119417623026324, 0.015408769249108662], "isController": false}, {"data": ["deleteAccount", 17, 4, 23.529411764705884, 461.3529411764706, 101, 1340, 418.0, 907.1999999999996, 1340.0, 1340.0, 0.10123386213138964, 0.020359590494140347, 0.06888299040362536], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1172.3043478260868, 635, 1874, 1181.0, 1609.4000000000003, 1834.9999999999995, 1874.0, 0.10910350127366479, 0.05646958562015853, 0.0501833487303673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 309.25, 206, 611, 210.0, 611.0, 611.0, 611.0, 0.04401214735266934, 0.06821023227410765, 0.09898435093085692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01349f64-728a-458e-a1bc-04422b126123", 3, 0, 0.0, 363.0, 207, 671, 211.0, 671.0, 671.0, 671.0, 0.0856775667571041, 0.0387668677709553, 0.0549429708696273], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2fb8d86b-1c0b-4cb6-ab9f-a67b276bb8f6", 3, 0, 0.0, 597.6666666666667, 200, 1340, 253.0, 1340.0, 1340.0, 1340.0, 0.053563776603342377, 0.03478506976681903, 0.03434916663690901], "isController": false}, {"data": ["addBook", 58, 12, 20.689655172413794, 1107.2413793103444, 517, 3919, 835.0, 1843.5, 2018.5499999999984, 3919.0, 0.2875215641173088, 96.06062925085762, 1.0425948635264024], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 183.75000000000003, 98, 422, 104.0, 411.3, 416.6, 422.0, 0.2509455268959831, 0.1864936972342218, 0.12130667559913244], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 645.75, 488, 979, 602.5, 821.1000000000001, 892.25, 979.0, 0.25078145292026044, 73.73807388648557, 0.12612543774798254], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 173.6785714285714, 100, 416, 104.0, 307.0, 312.05, 416.0, 0.2513453709812793, 0.4447634884942168, 0.12223632299675496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c655a93-9f39-4e1c-ab5f-ba9a6243940e", 3, 0, 0.0, 499.33333333333337, 198, 799, 501.0, 799.0, 799.0, 799.0, 0.04214844682973432, 0.027097390133048595, 0.02702878914536999], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 983.9464285714284, 676, 1412, 988.5, 1211.9, 1302.85, 1412.0, 0.25044722719141327, 225.3528552661002, 0.12571276833631484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 23, 0, 0.0, 121.7391304347826, 103, 411, 107.0, 124.60000000000002, 354.9999999999992, 411.0, 0.12783388264849574, 0.09550089865830004, 0.04544095047270747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 12, 6.976744186046512, 179.37209302325581, 99, 2301, 107.0, 272.0, 398.75, 2171.0600000000018, 0.7006766418035091, 1.5712950576836118, 0.33514946155851666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 109.33333333333333, 104, 126, 105.5, 126.0, 126.0, 126.0, 0.04485578863952393, 0.034736953506975074, 0.015944831117955773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=08fddfdd-e5d3-40d2-98de-617c085b3d52", 1, 0, 0.0, 876.0, 876, 876, 876.0, 876.0, 876.0, 876.0, 1.141552511415525, 0.2062375142694064, 0.787046946347032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 116.84210526315789, 102, 302, 106.0, 112.0, 302.0, 302.0, 0.09874233447666562, 0.08013171870127846, 0.035099814208502236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 488.3333333333333, 203, 1509, 303.0, 1509.0, 1509.0, 1509.0, 0.04509752339434026, 9.050296363542412, 0.09950228306212185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 378.24999999999994, 203, 1247, 209.0, 1155.3000000000002, 1247.0, 1247.0, 0.081016350112157, 12.225329651098024, 0.17961657113488716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5ba1d36-cedd-4190-8050-0810d4bd1711", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc0bb0ae-467d-4446-ab45-6e828c7239e3", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.7443728146853147, 1.3908617424242424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c75fa63-5287-4096-8081-33f1e8513844", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 106.14285714285714, 103, 109, 106.5, 108.5, 109.0, 109.0, 0.06468634055510121, 0.05363154602664153, 0.022993972619196133], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27843b6a-37ce-4dac-87e3-a6b8223a6d24", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 108.28571428571429, 102, 131, 106.0, 122.0, 131.0, 131.0, 0.11131961451607773, 0.08642489603543145, 0.03957064422251201], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e103b08c-93ce-4a0f-9e84-4030a52f4eb0", 3, 0, 0.0, 628.0, 180, 1320, 384.0, 1320.0, 1320.0, 1320.0, 0.030534040366001363, 0.03062349556238613, 0.019580748541999572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0458b32a-cfc1-4b5f-9bc8-53fe9162c72c", 3, 0, 0.0, 271.6666666666667, 195, 418, 202.0, 418.0, 418.0, 418.0, 0.04476275738585497, 0.02877813992091913, 0.028705283870486424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90eed881-a1af-472f-b570-d49ccfa2c7a5", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.4704793294270833, 1.7954508463541665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46e0c82b-e2a7-4cd5-a40b-07e676cce79e", 3, 0, 0.0, 280.6666666666667, 195, 441, 206.0, 441.0, 441.0, 441.0, 0.04578405188859214, 0.029434733880198394, 0.02936021556657764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 23, 0, 0.0, 120.4782608695652, 98, 307, 103.0, 225.20000000000027, 306.4, 307.0, 0.1306944420767915, 0.09712741251995931, 0.06560248362057698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 23, 0, 0.0, 153.43478260869566, 98, 307, 102.0, 302.6, 306.2, 307.0, 0.1306951847348024, 0.04350586991851439, 0.07405986478730779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 23, 0, 0.0, 201.34782608695653, 98, 1198, 103.0, 306.8, 1019.9999999999975, 1198.0, 0.1306944420767915, 5.146698518109703, 0.07634570881846542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 23, 0, 0.0, 171.43478260869566, 99, 693, 102.0, 306.2, 615.7999999999989, 693.0, 0.13069592740125355, 1.7045186163563113, 0.07647420921860883], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 16.666666666666668, 0.4528301886792453], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 13.88888888888889, 0.37735849056603776], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 11.11111111111111, 0.3018867924528302], "isController": false}, {"data": ["401/Unauthorized", 21, 58.333333333333336, 1.5849056603773586], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1325, 36, "401/Unauthorized", 21, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
