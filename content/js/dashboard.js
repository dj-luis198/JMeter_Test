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

    var data = {"OkPercent": 97.809667673716, "KoPercent": 2.190332326283988};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7998059508408797, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.41228070175438597, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=904089e1-f919-439f-ab44-576cd1f02e49"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a10edef-33f3-4c65-a1bf-2c030f43e38a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=956d83be-163d-4bd5-8f17-7a8d6da67a6f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09a89d0a-65c9-4e8d-b8af-42f81df51730"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8ba7d07-ae1c-4640-a11f-112a9aec7935"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cda21a46-d62b-4754-9f90-0fa83205875c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81c2c109-e329-41bb-ab5d-5d257d8cefa8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df41c74d-4a8e-4fa2-943c-578e894995cd"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b93ff8c8-1dc1-43e5-9f1e-0d18856a7d6d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/74fb2349-ccf9-4ead-8a8f-4ddcb5728f83"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81c2c109-e329-41bb-ab5d-5d257d8cefa8"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd490d94-c46e-4324-8e35-01b8d5965c80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5c3000ea-1193-46c7-a9fc-b5cdd2aa463b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e9e96597-9355-45fd-a0ca-45a351dd0d87"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df827009-3f54-43ad-88f0-e7f9a4dfba10"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3613977a-a572-4802-8cb7-89ad45947c91"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/956d83be-163d-4bd5-8f17-7a8d6da67a6f"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6bdc02a3-b551-4c14-8067-e99730ad785b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d8ba7d07-ae1c-4640-a11f-112a9aec7935"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/904089e1-f919-439f-ab44-576cd1f02e49"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/df41c74d-4a8e-4fa2-943c-578e894995cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/09a89d0a-65c9-4e8d-b8af-42f81df51730"], "isController": false}, {"data": [0.3508771929824561, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74fb2349-ccf9-4ead-8a8f-4ddcb5728f83"], "isController": false}, {"data": [0.9005847953216374, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b93ff8c8-1dc1-43e5-9f1e-0d18856a7d6d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/df827009-3f54-43ad-88f0-e7f9a4dfba10"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5a10edef-33f3-4c65-a1bf-2c030f43e38a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c3000ea-1193-46c7-a9fc-b5cdd2aa463b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cd490d94-c46e-4324-8e35-01b8d5965c80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3613977a-a572-4802-8cb7-89ad45947c91"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8b423cc2-4fb5-4ef8-89c9-54a2975dfb29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1324, 29, 2.190332326283988, 324.7945619335353, 77, 4844, 103.0, 863.5, 1078.75, 1719.0, 5.202071398822855, 764.8687409508907, 3.7941183982020634], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1324.4912280701753, 958, 1767, 1293.0, 1632.0, 1692.8999999999999, 1767.0, 0.25246149962130776, 303.7972929317424, 1.2413512212825044], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=904089e1-f919-439f-ab44-576cd1f02e49", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 645.5999999999999, 86, 1290, 540.0, 1266.0, 1290.0, 1290.0, 0.08319698272275992, 0.016298158920103164, 0.05601713511189994], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 645.5999999999999, 86, 1290, 540.0, 1266.0, 1290.0, 1290.0, 0.08204163339422646, 0.016071827791876783, 0.05523922998457617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a10edef-33f3-4c65-a1bf-2c030f43e38a", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 107.22222222222221, 78, 248, 81.0, 236.3, 248.0, 248.0, 0.09706172586533225, 0.03407060364305011, 0.05490264506683778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 83.7222222222222, 79, 106, 81.0, 97.9, 106.0, 106.0, 0.09714973472725212, 0.07219819153070202, 0.04876461293926522], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=956d83be-163d-4bd5-8f17-7a8d6da67a6f", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09a89d0a-65c9-4e8d-b8af-42f81df51730", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 0.5735367063492064, 2.1887400793650795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 129.05555555555557, 78, 614, 81.5, 285.5000000000005, 614.0, 614.0, 0.09706067910121811, 1.610210968800384, 0.0566924517797154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 147.83333333333334, 78, 817, 80.5, 295.90000000000083, 817.0, 817.0, 0.09714973472725212, 4.8811469555027225, 0.056649595749159384], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 281.1333333333333, 81, 866, 217.0, 617.6000000000001, 866.0, 866.0, 0.08353660574063554, 0.12742051665998372, 0.05399423318965037], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8ba7d07-ae1c-4640-a11f-112a9aec7935", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cda21a46-d62b-4754-9f90-0fa83205875c", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.9504045758928571, 1.7758324032738093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 81.06250000000001, 80, 84, 81.0, 82.6, 84.0, 84.0, 0.08934753959212847, 0.06639988049766579, 0.04484827670933012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81c2c109-e329-41bb-ab5d-5d257d8cefa8", 3, 0, 0.0, 359.6666666666667, 284, 430, 365.0, 430.0, 430.0, 430.0, 0.1243368700265252, 0.05625919574767904, 0.0797342558438329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 120.68749999999999, 78, 248, 80.0, 245.2, 248.0, 248.0, 0.08934803853134163, 0.049069436688538325, 0.049549333379868776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 561.5714285714286, 466, 650, 619.0, 650.0, 650.0, 650.0, 0.07953641631632768, 23.38634725457334, 0.045360612430405636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 783.2857142857143, 696, 886, 787.0, 886.0, 886.0, 886.0, 0.07946689068761564, 71.50444792861035, 0.045243356709843675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 216.14285714285714, 87, 246, 237.0, 246.0, 246.0, 246.0, 0.07988314237458347, 0.14135571678002465, 0.044232169654676586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df41c74d-4a8e-4fa2-943c-578e894995cd", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b93ff8c8-1dc1-43e5-9f1e-0d18856a7d6d", 3, 0, 0.0, 606.6666666666666, 196, 1028, 596.0, 1028.0, 1028.0, 1028.0, 0.04113364320677882, 0.026444969184045628, 0.026378019894972096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 103.92857142857143, 79, 240, 82.0, 239.0, 240.0, 240.0, 0.06315637518495797, 0.04693554835522754, 0.0317015398877621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 103.85714285714286, 79, 250, 80.5, 243.5, 250.0, 250.0, 0.06315808468596898, 0.023675470640513206, 0.03564096715328467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 163.0, 78, 922, 80.0, 580.0, 922.0, 922.0, 0.06315808468596898, 4.075075402012487, 0.03674235674393006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 152.78571428571428, 78, 621, 81.0, 430.5, 621.0, 621.0, 0.06315779976270713, 1.342270655420067, 0.03680386852801725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74fb2349-ccf9-4ead-8a8f-4ddcb5728f83", 3, 0, 0.0, 295.0, 178, 382, 325.0, 382.0, 382.0, 382.0, 0.018500703026715016, 0.02550471266866474, 0.011864057605022323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 103.71428571428571, 79, 235, 81.0, 235.0, 235.0, 235.0, 0.08002560819462227, 0.05947215608994879, 0.04493625460147247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 506.1052631578947, 78, 964, 701.0, 937.0, 964.0, 964.0, 0.08757092092345842, 41.48300598420497, 0.047521267635170325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 215.12499999999997, 78, 854, 81.0, 846.3, 854.0, 854.0, 0.08934753959212847, 15.093642809128527, 0.05108689885858518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 382.94736842105266, 77, 793, 466.0, 739.0, 793.0, 793.0, 0.08757253540926334, 13.563408565054871, 0.04760766380673202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 192.75, 79, 624, 83.0, 623.3, 624.0, 624.0, 0.08934803853134163, 4.945433564847131, 0.051174438084601426], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 406.33333333333337, 84, 1118, 422.0, 882.8000000000002, 1118.0, 1118.0, 0.08221700905483326, 0.01610618360976519, 0.05590328402139835], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 291.64285714285717, 160, 1003, 166.5, 747.0, 1003.0, 1003.0, 0.06313359067787437, 5.485836056439175, 0.1408351164814748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 832.7083333333334, 118, 1730, 743.0, 1481.0, 1673.5, 1730.0, 0.11278460490143095, 0.06927882469042976, 0.05099538288023685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 98.21052631578947, 79, 235, 81.0, 235.0, 235.0, 235.0, 0.08756971009817024, 0.06507866150850349, 0.043955889639120616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 157.05263157894737, 79, 262, 85.0, 255.0, 262.0, 262.0, 0.08750800237653313, 0.0925904470046932, 0.0460388524016341], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81c2c109-e329-41bb-ab5d-5d257d8cefa8", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["login", 24, 0, 0.0, 3322.208333333334, 1635, 6065, 3287.5, 4609.5, 5724.5, 6065.0, 0.11180679785330948, 39.165112399315646, 0.22276740167989714], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd490d94-c46e-4324-8e35-01b8d5965c80", 1, 0, 0.0, 726.0, 726, 726, 726.0, 726.0, 726.0, 726.0, 1.3774104683195594, 0.24884857093663912, 0.9496599517906337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 110.43749999999999, 81, 247, 88.5, 244.2, 247.0, 247.0, 0.09137635636778983, 0.07397558537978298, 0.03248143917761279], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c3000ea-1193-46c7-a9fc-b5cdd2aa463b", 3, 0, 0.0, 767.6666666666666, 452, 1357, 494.0, 1357.0, 1357.0, 1357.0, 0.022801897117840204, 0.026951070454061775, 0.01462231032621914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e9e96597-9355-45fd-a0ca-45a351dd0d87", 1, 0, 0.0, 1078.0, 1078, 1078, 1078.0, 1078.0, 1078.0, 1078.0, 0.9276437847866419, 0.29622999768089053, 0.5535062036178108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 624.7368421052631, 160, 1050, 782.0, 1019.0, 1050.0, 1050.0, 0.0874737578726382, 55.1426503843666, 0.18495106792797686], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df827009-3f54-43ad-88f0-e7f9a4dfba10", 1, 0, 0.0, 1118.0, 1118, 1118, 1118.0, 1118.0, 1118.0, 1118.0, 0.8944543828264758, 0.16159576252236135, 0.6166843694096601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 260.05555555555554, 162, 899, 172.0, 390.5000000000008, 899.0, 899.0, 0.09701882704238106, 6.590242794667737, 0.21681855053872398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 608.1818181818182, 79, 1022, 778.0, 1010.8000000000001, 1022.0, 1022.0, 0.10342039450179576, 78.74526528506422, 0.17331913947180386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3613977a-a572-4802-8cb7-89ad45947c91", 3, 0, 0.0, 501.3333333333333, 195, 1025, 284.0, 1025.0, 1025.0, 1025.0, 0.061022741141532076, 0.027611201232659373, 0.03913242189089134], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1165.2499999999998, 580, 2120, 1098.0, 1718.0, 2020.0, 2120.0, 0.1154428918444407, 0.036245009499987976, 0.052084585968878515], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 327.6875, 161, 935, 164.5, 927.3, 935.0, 935.0, 0.08930664553076056, 20.145293147319684, 0.19656837470277633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 94.93333333333334, 80, 238, 83.0, 151.00000000000006, 238.0, 238.0, 0.11800709616004909, 0.09161683735081937, 0.04194783496314245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/956d83be-163d-4bd5-8f17-7a8d6da67a6f", 3, 0, 0.0, 302.3333333333333, 179, 429, 299.0, 429.0, 429.0, 429.0, 0.08571183680466272, 0.03878237407502643, 0.05496494743007343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 327.4166666666667, 159, 968, 165.0, 940.4000000000001, 968.0, 968.0, 0.07678722260615835, 15.409873297083365, 0.16942180821111366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bdc02a3-b551-4c14-8067-e99730ad785b", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 1.7642869475138123, 3.296572859116022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 80.85714285714285, 79, 83, 81.0, 83.0, 83.0, 83.0, 0.04097065330633173, 0.030447917154412536, 0.02056534746040479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 103.14285714285715, 79, 238, 80.0, 238.0, 238.0, 238.0, 0.04097089310693989, 0.010962914757130397, 0.02336621247505165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 81.14285714285714, 79, 89, 80.0, 89.0, 89.0, 89.0, 0.0409713727165776, 0.011043065302515058, 0.024086685913456755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 104.42857142857143, 77, 239, 82.0, 239.0, 239.0, 239.0, 0.04097065330633173, 0.01104287139897222, 0.024126273382537134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 89.5, 84, 95, 89.5, 95.0, 95.0, 95.0, 0.03702469547187974, 0.010919392609870784, 0.022887336165722538], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 891.6140350877192, 625, 1397, 816.0, 1299.4, 1344.3, 1397.0, 0.24891807974985916, 297.79256130699457, 0.49151597388106955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1165.2499999999998, 580, 2120, 1098.0, 1718.0, 2020.0, 2120.0, 0.11260310221546603, 0.03535341539284407, 0.05080335275736846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8ba7d07-ae1c-4640-a11f-112a9aec7935", 3, 0, 0.0, 544.0, 217, 1123, 292.0, 1123.0, 1123.0, 1123.0, 0.03626122587117595, 0.030229492010443233, 0.02325345539264864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 147.46153846153848, 79, 315, 82.0, 287.79999999999995, 315.0, 315.0, 0.06767343921623746, 0.018240106663751504, 0.03985066781971796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 110.46153846153847, 78, 318, 79.0, 289.2, 318.0, 318.0, 0.06767379150225405, 0.018240201615841913, 0.03978478758237983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 111.06666666666665, 78, 238, 80.0, 236.8, 238.0, 238.0, 0.11844131232974062, 0.0319236349638754, 0.06963053713135142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 111.33333333333333, 77, 240, 81.0, 236.4, 240.0, 240.0, 0.11844037711416074, 0.03192338289405113, 0.0697456517576552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 141.0769230769231, 78, 244, 81.0, 243.2, 244.0, 244.0, 0.0676730869338886, 0.01810783771473191, 0.03859480739198334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/904089e1-f919-439f-ab44-576cd1f02e49", 3, 0, 0.0, 515.0, 180, 1150, 215.0, 1150.0, 1150.0, 1150.0, 0.0343218012081274, 0.028277499628180488, 0.022009748821618158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 84.2, 79, 113, 81.0, 100.4, 113.0, 113.0, 0.1184394419133497, 0.08801993681255774, 0.059451047991661864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 117.07692307692311, 79, 242, 81.0, 240.4, 242.0, 242.0, 0.06767238238019387, 0.05029168260871828, 0.033968363811933244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 101.0, 78, 235, 81.0, 232.0, 235.0, 235.0, 0.1184422475600897, 0.031692554522914626, 0.06754909431161366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 100.30769230769229, 82, 235, 87.0, 186.19999999999996, 235.0, 235.0, 0.06976307386836245, 0.0549111694706056, 0.024798592664144463], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 545.5333333333334, 79, 1150, 466.0, 1133.8, 1150.0, 1150.0, 0.08104559625245164, 0.015581226935774068, 0.055154271980916464], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1785.5833333333333, 948, 4844, 1579.0, 2913.0, 4530.75, 4844.0, 0.11515541182454155, 0.05960192213574904, 0.052966991181014715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 291.07692307692304, 161, 489, 318.0, 487.0, 489.0, 489.0, 0.06764350830454148, 0.10483422624932356, 0.15213183557163967], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df41c74d-4a8e-4fa2-943c-578e894995cd", 3, 0, 0.0, 856.3333333333334, 207, 1896, 466.0, 1896.0, 1896.0, 1896.0, 0.03525554393428367, 0.02266591773118823, 0.022608535660982688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09a89d0a-65c9-4e8d-b8af-42f81df51730", 3, 0, 0.0, 297.6666666666667, 181, 397, 315.0, 397.0, 397.0, 397.0, 0.07949546875828077, 0.036901216943134245, 0.050978539535746464], "isController": false}, {"data": ["addBook", 57, 14, 24.56140350877193, 891.5614035087722, 416, 1745, 759.0, 1458.0, 1540.1999999999998, 1745.0, 0.2604595054011076, 94.03350317463581, 0.9420550069341632], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 136.73684210526315, 79, 343, 83.0, 328.4, 331.2, 343.0, 0.24975462703309032, 0.1856086632540837, 0.12073099646619112], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 504.5614035087719, 386, 820, 469.0, 654.2, 712.0, 820.0, 0.24964961457603363, 73.40527583271286, 0.12555620264322004], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 119.17543859649122, 79, 388, 83.0, 240.20000000000002, 280.1999999999996, 388.0, 0.25006909804024796, 0.4425050836415325, 0.12161563557035496], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 750.5087719298245, 542, 1076, 725.0, 980.2, 1020.9, 1076.0, 0.24931874745760488, 224.33744721796364, 0.1251463244074306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 90.66666666666667, 81, 118, 86.5, 113.50000000000001, 118.0, 118.0, 0.07978139896683088, 0.059602314657837524, 0.028359794163990665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74fb2349-ccf9-4ead-8a8f-4ddcb5728f83", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 14, 8.187134502923977, 151.67836257309935, 80, 869, 88.0, 294.60000000000014, 420.4, 811.4000000000001, 0.7016276941887993, 1.6365943591800394, 0.33364820243805365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 142.14285714285714, 81, 280, 103.0, 280.0, 280.0, 280.0, 0.038970076548364645, 0.030178975295755046, 0.013852644398051495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 96.66666666666667, 80, 239, 85.5, 136.40000000000015, 239.0, 239.0, 0.10000222227160603, 0.08115414717549278, 0.03554766494810996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 187.0, 159, 320, 164.0, 320.0, 320.0, 320.0, 0.04095075963659126, 0.06346567924147492, 0.09209921820612271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 217.79999999999998, 160, 320, 170.0, 318.8, 320.0, 320.0, 0.11836373966290006, 0.1834406785595922, 0.2662028246520106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b93ff8c8-1dc1-43e5-9f1e-0d18856a7d6d", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df827009-3f54-43ad-88f0-e7f9a4dfba10", 3, 0, 0.0, 948.3333333333334, 290, 2077, 478.0, 2077.0, 2077.0, 2077.0, 0.031841049480990896, 0.026544572825787004, 0.02041890217368231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a10edef-33f3-4c65-a1bf-2c030f43e38a", 3, 0, 0.0, 354.33333333333337, 171, 631, 261.0, 631.0, 631.0, 631.0, 0.03491904601166296, 0.029110571886676057, 0.02239274760513543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c3000ea-1193-46c7-a9fc-b5cdd2aa463b", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 100.42857142857143, 81, 243, 86.5, 181.0, 243.0, 243.0, 0.06490616423114012, 0.053813802179919885, 0.02307211306653809], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd490d94-c46e-4324-8e35-01b8d5965c80", 3, 0, 0.0, 548.6666666666666, 357, 866, 423.0, 866.0, 866.0, 866.0, 0.042635438576544823, 0.02652224059888579, 0.027341085285088964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 87.6842105263158, 82, 100, 86.0, 99.0, 100.0, 100.0, 0.0871599614661223, 0.06766813414606174, 0.03098264255241066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3613977a-a572-4802-8cb7-89ad45947c91", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 0.7854959239130435, 2.9976222826086953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b423cc2-4fb5-4ef8-89c9-54a2975dfb29", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 1.0042010613207546, 1.876351218553459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 80.33333333333333, 79, 82, 80.0, 82.0, 82.0, 82.0, 0.07682605939934826, 0.05709436640908596, 0.03856308059693848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 93.58333333333333, 77, 246, 79.5, 197.1000000000002, 246.0, 246.0, 0.07682655125611411, 0.039788750992342956, 0.04273977086481088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 233.58333333333331, 79, 887, 83.0, 859.1000000000001, 887.0, 887.0, 0.07682655125611411, 11.538700274814977, 0.044065228943122745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 209.08333333333337, 77, 623, 82.5, 622.4, 623.0, 623.0, 0.07682655125611411, 3.7821821221414123, 0.04414025487208379], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 24.137931034482758, 0.5287009063444109], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.896551724137931, 0.1510574018126888], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.896551724137931, 0.1510574018126888], "isController": false}, {"data": ["401/Unauthorized", 18, 62.06896551724138, 1.3595166163141994], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1324, 29, "401/Unauthorized", 18, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
