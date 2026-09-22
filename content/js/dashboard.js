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

    var data = {"OkPercent": 98.67354458364038, "KoPercent": 1.3264554163596167};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7833969465648855, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.125, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d943f16b-0331-495d-96a5-e8ae7acbd3d0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43ea5b42-bfd7-4bef-ab8a-b6c68ad91dc8"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f7c5aeb-58e8-4b10-b78f-b431d1bfa7d6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f819e8d-46ed-4648-a763-4247e6ecf173"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1cd14a01-4af6-4614-b7b1-3725498a6ff4"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce49bd6f-1bcc-437a-bbca-0d625972cdec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/178c7ac8-b5da-428c-aa93-ae259b5130e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/15587e24-272d-4351-b0b7-b8b49ed1f441"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55e87b31-cd3f-4987-969a-12ddbb156e93"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/76d52ad3-da19-444a-b492-4631804aab00"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/25869c34-8427-4178-9c8c-e82c36548e29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6739e311-5c50-45ec-8e0c-7fd0880418d4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4b9bd5e7-156a-456c-a2fb-11c918e82dd0"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=575edbee-83d8-4cc1-83c1-11d3a8f01272"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7f819e8d-46ed-4648-a763-4247e6ecf173"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5f7c5aeb-58e8-4b10-b78f-b431d1bfa7d6"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/43ea5b42-bfd7-4bef-ab8a-b6c68ad91dc8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d943f16b-0331-495d-96a5-e8ae7acbd3d0"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ce49bd6f-1bcc-437a-bbca-0d625972cdec"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=178c7ac8-b5da-428c-aa93-ae259b5130e7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15587e24-272d-4351-b0b7-b8b49ed1f441"], "isController": false}, {"data": [0.31666666666666665, 500, 1500, "addBook"], "isController": true}, {"data": [0.9916666666666667, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5916666666666667, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9305555555555556, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9fcfb6a7-121a-42be-b0bf-8dfd23210dde"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9fcfb6a7-121a-42be-b0bf-8dfd23210dde"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b9bd5e7-156a-456c-a2fb-11c918e82dd0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b44b95a4-0b70-46db-8312-d1e12290b5f5"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25869c34-8427-4178-9c8c-e82c36548e29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/575edbee-83d8-4cc1-83c1-11d3a8f01272"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/55e87b31-cd3f-4987-969a-12ddbb156e93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1357, 18, 1.3264554163596167, 374.878408253501, 96, 4037, 116.0, 1007.6000000000001, 1240.0, 2057.4400000000023, 5.325411277156851, 745.2685030264485, 3.9029196250922236], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 0, 0.0, 1686.4333333333332, 1234, 3077, 1635.5, 2025.5, 2108.0499999999997, 3077.0, 0.2669680439251421, 321.2534406897119, 1.3126797862920807], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d943f16b-0331-495d-96a5-e8ae7acbd3d0", 3, 0, 0.0, 288.3333333333333, 201, 450, 214.0, 450.0, 450.0, 450.0, 0.018272182429469375, 0.02518967857708425, 0.011717512820981338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43ea5b42-bfd7-4bef-ab8a-b6c68ad91dc8", 1, 0, 0.0, 782.0, 782, 782, 782.0, 782.0, 782.0, 782.0, 1.278772378516624, 0.23102821291560102, 0.8816536125319693], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 763.3846153846155, 103, 2044, 569.0, 1687.1999999999998, 2044.0, 2044.0, 0.0644732535187518, 0.012214659358044775, 0.04358434558407809], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 763.3846153846155, 103, 2044, 569.0, 1687.1999999999998, 2044.0, 2044.0, 0.06493993056422809, 0.012303072782676025, 0.04389982235182456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f7c5aeb-58e8-4b10-b78f-b431d1bfa7d6", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f819e8d-46ed-4648-a763-4247e6ecf173", 1, 0, 0.0, 863.0, 863, 863, 863.0, 863.0, 863.0, 863.0, 1.1587485515643106, 0.20934422074159909, 0.7989028099652375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 124.58823529411765, 100, 303, 101.0, 297.4, 303.0, 303.0, 0.08308692358446763, 0.02223224322475013, 0.0473855111067667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 134.94117647058823, 98, 455, 104.0, 330.1999999999999, 455.0, 455.0, 0.08316374452097683, 0.06180430623092126, 0.04174430144900595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 183.52941176470586, 96, 419, 102.0, 395.79999999999995, 419.0, 419.0, 0.0831674062042885, 0.022416214953499634, 0.048974556583189416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 136.52941176470588, 99, 307, 102.0, 299.8, 307.0, 307.0, 0.08308692358446763, 0.022394522372376043, 0.04884602343539992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1cd14a01-4af6-4614-b7b1-3725498a6ff4", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 1.5279231459330145, 2.854926734449761], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 252.23076923076923, 101, 465, 224.0, 447.79999999999995, 465.0, 465.0, 0.06443905800010906, 0.14582531717647873, 0.04165400346236015], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce49bd6f-1bcc-437a-bbca-0d625972cdec", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 130.1578947368421, 98, 437, 103.0, 296.0, 437.0, 437.0, 0.10209564750134335, 0.07587381616066631, 0.051247229312197745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 132.63157894736844, 97, 300, 101.0, 298.0, 300.0, 300.0, 0.10209674472589711, 0.04346038444797902, 0.057324467484873555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 650.8, 501, 782, 616.0, 782.0, 782.0, 782.0, 0.07137860640408857, 20.987680275592798, 0.040708111464831755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 909.0, 688, 1180, 898.0, 1180.0, 1180.0, 1180.0, 0.07118856426903582, 64.05559526542656, 0.04053020797739051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 262.2, 118, 304, 295.0, 304.0, 304.0, 304.0, 0.07177102173226538, 0.12700106579967274, 0.03974039972870554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 115.88235294117646, 101, 311, 104.0, 149.39999999999986, 311.0, 311.0, 0.10200346811791601, 0.0758053117555997, 0.051200959582625806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 124.94117647058823, 98, 305, 102.0, 297.0, 305.0, 305.0, 0.10200469221584194, 0.02729422428431708, 0.058174551029347356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 112.41176470588235, 97, 295, 100.0, 144.59999999999985, 295.0, 295.0, 0.10200652841781874, 0.027493947112615207, 0.05996868174563172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 137.05882352941177, 99, 311, 102.0, 304.6, 311.0, 311.0, 0.1020059163431479, 0.02749378213936408, 0.06006793706534979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/178c7ac8-b5da-428c-aa93-ae259b5130e7", 3, 0, 0.0, 801.3333333333334, 201, 1768, 435.0, 1768.0, 1768.0, 1768.0, 0.02303846655966579, 0.027230687525438304, 0.014774016641452344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 105.2, 103, 109, 105.0, 109.0, 109.0, 109.0, 0.07178029487345133, 0.05334453554560203, 0.040306317922104026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15587e24-272d-4351-b0b7-b8b49ed1f441", 3, 0, 0.0, 480.6666666666667, 191, 1018, 233.0, 1018.0, 1018.0, 1018.0, 0.022316447221602323, 0.026377285111210295, 0.014311002938332217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 860.2857142857143, 102, 1393, 1051.5, 1340.0, 1393.0, 1393.0, 0.06304801106042252, 40.52679181603041, 0.03319520001981509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 234.42105263157896, 99, 1209, 103.0, 883.0, 1209.0, 1209.0, 0.10209619611067228, 9.694762179673186, 0.05909782897812455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 588.2857142857143, 97, 818, 784.5, 817.5, 818.0, 818.0, 0.06310541760010097, 13.258494017381036, 0.03328705133174969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 218.6842105263158, 99, 814, 104.0, 790.0, 814.0, 814.0, 0.10209729334701795, 3.1846211250047016, 0.05919816849546204], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 562.7692307692308, 131, 1188, 513.0, 1128.0, 1188.0, 1188.0, 0.06527284047317788, 0.01236614360527003, 0.04464462233385552], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 266.8823529411764, 204, 609, 207.0, 457.79999999999984, 609.0, 609.0, 0.10194107805688311, 0.15798876062136086, 0.22926787379394709], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 567.5714285714286, 144, 1433, 488.0, 1009.4000000000001, 1391.9999999999995, 1433.0, 0.09270868283035194, 0.05694703271512829, 0.04191808608442671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 102.14285714285714, 98, 108, 102.0, 106.0, 108.0, 108.0, 0.06310228881016128, 0.04689535330520774, 0.031674391062912984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 202.78571428571428, 98, 312, 204.5, 311.5, 312.0, 312.0, 0.06304403625932714, 0.08450433878063827, 0.03217286337006399], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55e87b31-cd3f-4987-969a-12ddbb156e93", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 0.6948617788461539, 2.6517427884615383], "isController": false}, {"data": ["login", 21, 0, 0.0, 3332.476190476191, 1110, 7800, 3188.0, 6059.000000000001, 7645.999999999998, 7800.0, 0.08666584127770212, 24.805481453252032, 0.16497703742107217], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 107.52631578947368, 102, 134, 105.0, 126.0, 134.0, 134.0, 0.10614940249060019, 0.08593540494600348, 0.03773279541658054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76d52ad3-da19-444a-b492-4631804aab00", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 1.0788376266891893, 2.0158097550675675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25869c34-8427-4178-9c8c-e82c36548e29", 3, 0, 0.0, 390.6666666666667, 194, 513, 465.0, 513.0, 513.0, 513.0, 0.03552650277106722, 0.029616983592676803, 0.022782295071289847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6739e311-5c50-45ec-8e0c-7fd0880418d4", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b9bd5e7-156a-456c-a2fb-11c918e82dd0", 3, 0, 0.0, 1410.3333333333333, 255, 3442, 534.0, 3442.0, 3442.0, 3442.0, 0.025561065385205254, 0.025635951318950974, 0.016391698831007277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 979.2142857142858, 207, 1503, 1153.5, 1447.5, 1503.0, 1503.0, 0.0630136739672509, 53.87523194095618, 0.13020305875124902], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=575edbee-83d8-4cc1-83c1-11d3a8f01272", 1, 0, 0.0, 1188.0, 1188, 1188, 1188.0, 1188.0, 1188.0, 1188.0, 0.8417508417508417, 0.1520741266835017, 0.5803477483164984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 344.23529411764713, 203, 758, 212.0, 629.1999999999999, 758.0, 758.0, 0.08304268393954493, 0.1286999408320877, 0.18676494249294137], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 753.4285714285714, 101, 1286, 982.0, 1286.0, 1286.0, 1286.0, 0.08378116360067504, 71.60026136730859, 0.1508014191930677], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1335.0909090909092, 281, 3323, 1016.0, 2881.4, 3263.149999999999, 3323.0, 0.09189947867932095, 0.028914395635610213, 0.041462460107271754], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7f819e8d-46ed-4648-a763-4247e6ecf173", 3, 0, 0.0, 728.0, 212, 1327, 645.0, 1327.0, 1327.0, 1327.0, 0.02870621106720124, 0.02393118702574947, 0.01840860540442267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 408.7368421052632, 201, 1320, 221.0, 1314.0, 1320.0, 1320.0, 0.10203917230119816, 12.99142329708705, 0.22674031332739], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 118.2, 102, 311, 107.5, 123.10000000000002, 301.64999999999986, 311.0, 0.13081984798733665, 0.10156423745110608, 0.04650236783924857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f7c5aeb-58e8-4b10-b78f-b431d1bfa7d6", 3, 0, 0.0, 905.3333333333334, 201, 1519, 996.0, 1519.0, 1519.0, 1519.0, 0.08628375852052114, 0.03904115375765769, 0.055331707124162334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 463.2142857142857, 202, 1390, 406.5, 1001.5, 1390.0, 1390.0, 0.11462913381313813, 9.960412969365365, 0.2557086843850556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43ea5b42-bfd7-4bef-ab8a-b6c68ad91dc8", 3, 0, 0.0, 594.3333333333334, 195, 1141, 447.0, 1141.0, 1141.0, 1141.0, 0.019493304050058807, 0.026873093311197603, 0.012500588860226512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 123.39999999999999, 98, 310, 104.0, 289.6000000000001, 310.0, 310.0, 0.04976461337871866, 0.03698327224727041, 0.02497950319986464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 122.0, 100, 298, 103.0, 279.00000000000006, 298.0, 298.0, 0.04976560400513581, 0.01331618700918673, 0.028381946034179015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 101.9, 96, 106, 102.5, 105.9, 106.0, 106.0, 0.04976709001871243, 0.013413785981606084, 0.02925760565553211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 142.2, 99, 310, 102.0, 308.8, 310.0, 310.0, 0.04976535634483411, 0.013413318702318567, 0.02930518542571774], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 131.0, 131, 131, 131.0, 131.0, 131.0, 131.0, 7.633587786259541, 2.2513120229007635, 4.71880963740458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d943f16b-0331-495d-96a5-e8ae7acbd3d0", 1, 0, 0.0, 1038.0, 1038, 1038, 1038.0, 1038.0, 1038.0, 1038.0, 0.9633911368015414, 0.17405015655105974, 0.6642130298651252], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 1126.5833333333335, 793, 1671, 1084.0, 1490.3, 1611.25, 1671.0, 0.26635887418982507, 318.6578148583859, 0.5259547300896742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1335.0909090909092, 281, 3323, 1016.0, 2881.4, 3263.149999999999, 3323.0, 0.09047652339846272, 0.028466690245397004, 0.040820462705165796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 123.88888888888891, 97, 303, 102.0, 303.0, 303.0, 303.0, 0.04974629390110437, 0.013408180778032037, 0.02929396017809173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 145.99999999999997, 98, 304, 101.0, 304.0, 304.0, 304.0, 0.049746018936651204, 0.01340810666651927, 0.029245218163929713], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce49bd6f-1bcc-437a-bbca-0d625972cdec", 3, 0, 0.0, 328.3333333333333, 215, 442, 328.0, 442.0, 442.0, 442.0, 0.01957687840148262, 0.023483332327299305, 0.012554183089492438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 207.9, 98, 903, 104.5, 403.4000000000002, 878.5499999999997, 903.0, 0.12436032159579165, 5.626824841984666, 0.07257590643129402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 165.29999999999998, 96, 794, 101.5, 299.9, 769.2999999999997, 794.0, 0.12436341477064278, 1.8601924951342814, 0.07269916023604177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 122.11111111111111, 97, 295, 101.0, 295.0, 295.0, 295.0, 0.0497465688685972, 0.01331109362304261, 0.02837109005787184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 104.99999999999999, 99, 124, 103.5, 113.0, 123.44999999999999, 124.0, 0.12435800181562684, 0.09241839783368361, 0.062421887630109564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 124.66666666666667, 98, 306, 103.0, 306.0, 306.0, 306.0, 0.049744919109234315, 0.036968636173952456, 0.02496961759975238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 122.95, 97, 337, 102.5, 277.8000000000004, 335.0, 337.0, 0.12436341477064278, 0.04261633031544781, 0.0704037808032633], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 664.7692307692307, 101, 1303, 534.0, 1208.1999999999998, 1303.0, 1303.0, 0.06587915735490116, 0.01234244429410483, 0.04483662602429421], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 110.88888888888889, 102, 157, 106.0, 157.0, 157.0, 157.0, 0.04952156664227271, 0.03897888936882012, 0.017603369392370376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1758.2380952380952, 736, 3963, 1465.0, 3185.8, 3892.699999999999, 3963.0, 0.08902492273908491, 0.046077352589565426, 0.04094798692393456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 273.6666666666667, 202, 610, 206.0, 610.0, 610.0, 610.0, 0.049717164574863, 0.07705189470733162, 0.11181506837491162], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=178c7ac8-b5da-428c-aa93-ae259b5130e7", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.3062102754237288, 1.168564618644068], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15587e24-272d-4351-b0b7-b8b49ed1f441", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["addBook", 60, 8, 13.333333333333334, 1084.5666666666664, 516, 3602, 837.0, 1843.2, 2404.7999999999993, 3602.0, 0.29193812857928314, 82.59830085166867, 1.063740052816473], "isController": true}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 180.58333333333331, 99, 733, 104.0, 408.0, 415.84999999999997, 733.0, 0.2672236795809933, 0.19859103531360925, 0.1291755091724528], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 639.683333333333, 485, 929, 601.5, 815.8, 883.0999999999998, 929.0, 0.267459535601093, 78.64198395911436, 0.13451334065875284], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 148.68333333333328, 99, 416, 105.0, 303.8, 329.8999999999999, 416.0, 0.26800191174697047, 0.47423775789600636, 0.13033686723631963], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 944.2500000000001, 693, 1240, 954.0, 1139.7, 1222.8999999999999, 1240.0, 0.26727605607451654, 240.49546507704233, 0.13416005158427882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 105.5, 102, 116, 104.5, 112.5, 116.0, 116.0, 0.11790963069019245, 0.08808678464648166, 0.041913189034404344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 8, 4.444444444444445, 194.20000000000002, 98, 2081, 110.0, 318.6, 493.8999999999995, 1528.5799999999986, 0.7405396065266223, 1.5934538484403413, 0.35467315204512356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 146.39999999999998, 103, 307, 107.0, 307.0, 307.0, 307.0, 0.04700507184725232, 0.036401388647335046, 0.016708834133202972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fcfb6a7-121a-42be-b0bf-8dfd23210dde", 3, 0, 0.0, 1717.0, 422, 4037, 692.0, 4037.0, 4037.0, 4037.0, 0.07111869710546903, 0.03217935839082095, 0.045606716568285806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 108.58823529411765, 103, 119, 106.0, 116.6, 119.0, 119.0, 0.08545247083306107, 0.06934668287331419, 0.03037568299143967], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9fcfb6a7-121a-42be-b0bf-8dfd23210dde", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 0.8770100121359223, 3.3468598300970878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 268.6, 201, 610, 209.0, 590.3000000000001, 610.0, 610.0, 0.04973837614149573, 0.07708476849272826, 0.11186277368541472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b9bd5e7-156a-456c-a2fb-11c918e82dd0", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.2867683531746032, 1.0943700396825398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b44b95a4-0b70-46db-8312-d1e12290b5f5", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.7241177721088435, 1.3530151643990929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 324.55, 203, 1016, 211.5, 507.30000000000024, 991.0999999999997, 1016.0, 0.12427609176546617, 7.616844041660453, 0.2779099829431064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25869c34-8427-4178-9c8c-e82c36548e29", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 117.70588235294117, 103, 296, 106.0, 151.19999999999987, 296.0, 296.0, 0.1041704964643308, 0.0863679213849774, 0.03702935616505509], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/575edbee-83d8-4cc1-83c1-11d3a8f01272", 3, 0, 0.0, 618.3333333333334, 228, 1066, 561.0, 1066.0, 1066.0, 1066.0, 0.01695097213825213, 0.02336828353043547, 0.010870252315220279], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 109.07142857142858, 101, 140, 106.0, 130.0, 140.0, 140.0, 0.06554736733681046, 0.0508888252273089, 0.023300040733006844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55e87b31-cd3f-4987-969a-12ddbb156e93", 3, 0, 0.0, 606.0, 224, 1303, 291.0, 1303.0, 1303.0, 1303.0, 0.06642017402085593, 0.029404764540483096, 0.04259366628290566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 161.1428571428571, 100, 312, 103.0, 310.0, 312.0, 312.0, 0.11491611123879568, 0.08540152407492531, 0.05768250114916111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 175.14285714285714, 99, 308, 104.5, 307.5, 308.0, 308.0, 0.1147258870769483, 0.043006202368270095, 0.06474138019339507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 256.7857142857143, 98, 1078, 199.0, 694.0, 1078.0, 1078.0, 0.11472494693971204, 7.402263884279404, 0.06674149396464832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 235.5, 99, 791, 198.5, 549.0, 791.0, 791.0, 0.11491611123879568, 2.442271968471944, 0.06696492698722789], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 33.333333333333336, 0.4421518054532056], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.07369196757553427], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07369196757553427], "isController": false}, {"data": ["401/Unauthorized", 10, 55.55555555555556, 0.7369196757553427], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1357, 18, "401/Unauthorized", 10, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
