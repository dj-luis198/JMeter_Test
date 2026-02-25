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

    var data = {"OkPercent": 97.21825962910128, "KoPercent": 2.7817403708987163};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8086532602071907, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4827586206896552, 500, 1500, "see books"], "isController": true}, {"data": [0.5882352941176471, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2657744-6787-4451-b4c7-6fd24693d159"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1405785c-8b87-4812-8239-47379e844734"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b758bb35-26a4-42be-8322-feb10a05e1d7"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25475eca-a248-4abe-9d99-dbad60416a50"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c6db50b-cd77-4c58-8cd6-d86ec61f1aba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7d483536-3625-44ec-8d6c-36a8c246e48b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d483536-3625-44ec-8d6c-36a8c246e48b"], "isController": false}, {"data": [0.7708333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41be4001-f62a-43e1-8453-bd5760ae6cb1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c92fc4a0-0316-4283-8b8d-41b94b6af8f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe9dea2d-1aae-40de-ab57-48a85af47a31"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=91e31895-0b5c-4f93-a8d9-53e8519b56e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b706da11-a0ff-45ad-9948-86273062c10a"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.28125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d35518f-2f67-4129-8a48-2d48d0c5bff5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3c67ef0f-e2fa-4b58-bf97-d6174d190ada"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7c5c26ad-6252-4822-9d12-cb3a6fb053fc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f3548c06-15a4-4594-97e3-bd6dd0c98258"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "register"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1405785c-8b87-4812-8239-47379e844734"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2657744-6787-4451-b4c7-6fd24693d159"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b758bb35-26a4-42be-8322-feb10a05e1d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe9dea2d-1aae-40de-ab57-48a85af47a31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.36507936507936506, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.853448275862069, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9130434782608695, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c92fc4a0-0316-4283-8b8d-41b94b6af8f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/41be4001-f62a-43e1-8453-bd5760ae6cb1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/25475eca-a248-4abe-9d99-dbad60416a50"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c67ef0f-e2fa-4b58-bf97-d6174d190ada"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3548c06-15a4-4594-97e3-bd6dd0c98258"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c5c26ad-6252-4822-9d12-cb3a6fb053fc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/91e31895-0b5c-4f93-a8d9-53e8519b56e0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d35518f-2f67-4129-8a48-2d48d0c5bff5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b706da11-a0ff-45ad-9948-86273062c10a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1402, 39, 2.7817403708987163, 278.4101283880169, 80, 2373, 95.5, 722.1000000000001, 828.8499999999999, 1423.5500000000004, 5.4672937286007315, 759.333717143105, 4.001612165557219], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1214.844827586207, 980, 1712, 1185.0, 1417.1, 1496.6499999999999, 1712.0, 0.26170214686002546, 314.9145979953277, 1.2867874115627227], "isController": true}, {"data": ["deleteBook", 17, 3, 17.647058823529413, 535.5882352941178, 90, 1205, 407.0, 1097.0, 1205.0, 1205.0, 0.08671345792867052, 0.017414421468211868, 0.058205810885599445], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, 17.647058823529413, 535.5882352941178, 90, 1205, 407.0, 1097.0, 1205.0, 1205.0, 0.08624494579251496, 0.017320331484985768, 0.057891325343838305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2657744-6787-4451-b4c7-6fd24693d159", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1405785c-8b87-4812-8239-47379e844734", 3, 0, 0.0, 442.33333333333337, 228, 779, 320.0, 779.0, 779.0, 779.0, 0.03803052583540389, 0.02444996371253993, 0.024388065070229704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 109.57894736842103, 81, 247, 84.0, 247.0, 247.0, 247.0, 0.11256657720586058, 0.039018760108774864, 0.06370055587153192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 84.3157894736842, 81, 89, 84.0, 89.0, 89.0, 89.0, 0.11256791103580252, 0.08365642607250558, 0.05650381471914306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 134.89473684210526, 81, 570, 84.0, 253.0, 570.0, 570.0, 0.11256857796262723, 1.770791212689441, 0.06577879126527082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 160.73684210526318, 82, 739, 84.0, 249.0, 739.0, 739.0, 0.11256857796262723, 5.3597651482498545, 0.06566886101335419], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b758bb35-26a4-42be-8322-feb10a05e1d7", 3, 0, 0.0, 303.0, 223, 462, 224.0, 462.0, 462.0, 462.0, 0.04293135276692568, 0.03579010235550022, 0.0275308479657694], "isController": false}, {"data": ["goToProfile", 18, 4, 22.22222222222222, 192.0, 82, 348, 175.5, 322.80000000000007, 348.0, 348.0, 0.08889108373046248, 0.15780675140126915, 0.05744740610879281], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25475eca-a248-4abe-9d99-dbad60416a50", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c6db50b-cd77-4c58-8cd6-d86ec61f1aba", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 1.6545903497409327, 3.091604598445596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 96.4375, 82, 250, 84.0, 151.3000000000001, 250.0, 250.0, 0.08162598971512529, 0.06066150212227574, 0.040972420618725004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 103.875, 81, 248, 83.5, 246.6, 248.0, 248.0, 0.08155858455076513, 0.037135439498822496, 0.04565767440793565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 509.6666666666667, 402, 642, 566.0, 642.0, 642.0, 642.0, 0.09657481328869431, 28.396201692473603, 0.05507782320370848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 660.1111111111111, 568, 733, 720.0, 733.0, 733.0, 733.0, 0.09623404118816963, 86.59155942251556, 0.05478949805928016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 156.0, 81, 257, 84.0, 257.0, 257.0, 257.0, 0.09673674706565201, 0.17117869695601703, 0.05356419490842255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 85.3076923076923, 82, 93, 84.0, 92.2, 93.0, 93.0, 0.07443330489599377, 0.05531615725180787, 0.03736202999662187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 95.92307692307692, 82, 249, 83.0, 184.19999999999993, 249.0, 249.0, 0.07443586205317011, 0.01991740840094591, 0.04245170257719858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 108.23076923076924, 82, 245, 84.0, 244.6, 245.0, 245.0, 0.0744354358481059, 0.020062676068434794, 0.04375989490289039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 108.23076923076925, 81, 245, 84.0, 244.2, 245.0, 245.0, 0.07436645500829472, 0.020044083576454437, 0.0437919652050798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d483536-3625-44ec-8d6c-36a8c246e48b", 3, 0, 0.0, 274.3333333333333, 183, 359, 281.0, 359.0, 359.0, 359.0, 0.04281371751509183, 0.03569203468624681, 0.02745541129711293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 106.44444444444446, 82, 248, 85.0, 248.0, 248.0, 248.0, 0.09690548485044254, 0.07201667379998708, 0.05441470096582467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 537.2857142857143, 83, 748, 727.0, 743.5, 748.0, 748.0, 0.07352168889822498, 47.259193903607816, 0.03870966153765361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 175.00000000000003, 81, 732, 83.5, 619.3000000000001, 732.0, 732.0, 0.08155609020103576, 9.192273340970722, 0.04706997002813685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 415.2142857142857, 81, 660, 487.0, 622.0, 660.0, 660.0, 0.07352168889822498, 15.446960173563703, 0.03878146006196828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 144.9375, 81, 568, 84.0, 465.10000000000014, 568.0, 568.0, 0.08162682257389778, 3.0193753698715398, 0.04719050680053465], "isController": false}, {"data": ["deleteBooks", 17, 3, 17.647058823529413, 361.35294117647055, 85, 667, 403.0, 598.9999999999999, 667.0, 667.0, 0.086429105255398, 0.01735731571535337, 0.05850150202345787], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 219.46153846153848, 167, 334, 172.0, 332.4, 334.0, 334.0, 0.0743290374961406, 0.11519549072888198, 0.16716774741563656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d483536-3625-44ec-8d6c-36a8c246e48b", 1, 0, 0.0, 582.0, 582, 582, 582.0, 582.0, 582.0, 582.0, 1.7182130584192439, 0.31041935137457044, 1.1846273625429553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 529.9999999999999, 158, 1351, 493.0, 952.5, 1268.0, 1351.0, 0.09805724091438377, 0.06023242630385488, 0.04433642826499969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 84.42857142857142, 82, 87, 84.0, 86.5, 87.0, 87.0, 0.07352053060817233, 0.054637816203924945, 0.03690386009043025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 154.85714285714286, 82, 253, 87.5, 253.0, 253.0, 253.0, 0.07352091670080138, 0.09854756803310542, 0.03751946334982303], "isController": false}, {"data": ["login", 24, 0, 0.0, 2446.5833333333335, 1349, 3699, 2359.0, 3484.5, 3645.5, 3699.0, 0.09807727672094972, 44.131027187072185, 0.208964939927668], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41be4001-f62a-43e1-8453-bd5760ae6cb1", 1, 0, 0.0, 667.0, 667, 667, 667.0, 667.0, 667.0, 667.0, 1.4992503748125936, 0.27086066341829085, 1.033662856071964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 90.56250000000001, 84, 105, 88.0, 102.9, 105.0, 105.0, 0.08486127832908144, 0.06870117161602393, 0.030165532531040665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c92fc4a0-0316-4283-8b8d-41b94b6af8f3", 3, 0, 0.0, 433.66666666666663, 197, 901, 203.0, 901.0, 901.0, 901.0, 0.018822348401668916, 0.025935872651127775, 0.012070321077893152], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe9dea2d-1aae-40de-ab57-48a85af47a31", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.050372456395349, 4.008448401162791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 640.7142857142857, 169, 836, 811.0, 830.5, 836.0, 836.0, 0.07348772754949924, 62.830305190595666, 0.1518452473124488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=91e31895-0b5c-4f93-a8d9-53e8519b56e0", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.020700918079096, 3.895215395480226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b706da11-a0ff-45ad-9948-86273062c10a", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 280.7894736842105, 165, 823, 326.0, 343.0, 823.0, 823.0, 0.11250925240562545, 7.249410159141377, 0.25152086417468544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 7, 43.75, 472.375, 82, 980, 654.5, 879.2, 980.0, 980.0, 0.1353477591486626, 91.09751766393997, 0.21076216913817314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d35518f-2f67-4129-8a48-2d48d0c5bff5", 3, 0, 0.0, 306.33333333333337, 163, 586, 170.0, 586.0, 586.0, 586.0, 0.02437656924164493, 0.028812279595186438, 0.01563210983269548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c67ef0f-e2fa-4b58-bf97-d6174d190ada", 3, 0, 0.0, 676.0, 173, 1118, 737.0, 1118.0, 1118.0, 1118.0, 0.02084172791818927, 0.024634216819969152, 0.013365300780870072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c5c26ad-6252-4822-9d12-cb3a6fb053fc", 3, 0, 0.0, 286.6666666666667, 165, 456, 239.0, 456.0, 456.0, 456.0, 0.05416335668375821, 0.0348218194825594, 0.03473366297754026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3548c06-15a4-4594-97e3-bd6dd0c98258", 3, 0, 0.0, 346.6666666666667, 187, 586, 267.0, 586.0, 586.0, 586.0, 0.06266580327115492, 0.02908900894032127, 0.04018607826958829], "isController": false}, {"data": ["register", 26, 11, 42.30769230769231, 1009.2692307692306, 126, 2346, 984.0, 1858.7000000000003, 2270.7499999999995, 2346.0, 0.10495000746759668, 0.03246575501439026, 0.0473504916504196], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 283.0625, 167, 983, 173.0, 754.1000000000003, 983.0, 983.0, 0.0815207699636723, 12.301446372707865, 0.18073489063479203], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 108.5, 84, 268, 87.0, 205.5, 268.0, 268.0, 0.13535593777494176, 0.10508590872175654, 0.048114806005936324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1405785c-8b87-4812-8239-47379e844734", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 0, 0.0, 277.90909090909093, 166, 828, 180.0, 474.99999999999994, 778.6499999999993, 828.0, 0.10800567520729726, 6.033067187814505, 0.24165119198990637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 16, 0, 0.0, 100.625, 83, 344, 84.0, 166.2000000000002, 344.0, 344.0, 0.07033028861792191, 0.052266943006092366, 0.03530250815391784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2657744-6787-4451-b4c7-6fd24693d159", 2, 0, 0.0, 265.0, 182, 348, 265.0, 348.0, 348.0, 348.0, 0.015267525210501004, 0.025637216405719213, 0.009490019332503796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 16, 0, 0.0, 113.31250000000001, 81, 249, 83.0, 246.2, 249.0, 249.0, 0.0703330710495892, 0.018819591276940863, 0.04011182958296885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b758bb35-26a4-42be-8322-feb10a05e1d7", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 16, 0, 0.0, 83.24999999999999, 81, 85, 83.0, 85.0, 85.0, 85.0, 0.07033276187964306, 0.018956877225372544, 0.041347971339399534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 16, 0, 0.0, 114.56249999999999, 81, 251, 84.0, 248.2, 251.0, 251.0, 0.07033214354790499, 0.018956710565646264, 0.04141629156190108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 86.66666666666667, 85, 90, 85.0, 90.0, 90.0, 90.0, 0.041041356006402456, 0.012103993665950724, 0.025370291359426516], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 785.5862068965519, 644, 1337, 668.5, 1061.0, 1094.0999999999997, 1337.0, 0.2516935067414804, 301.11293688351367, 0.4969963580383529], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 11, 42.30769230769231, 1009.2692307692306, 126, 2346, 984.0, 1858.7000000000003, 2270.7499999999995, 2346.0, 0.10268035211462287, 0.03176364858834262, 0.04632648698921461], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe9dea2d-1aae-40de-ab57-48a85af47a31", 3, 0, 0.0, 264.0, 168, 388, 236.0, 388.0, 388.0, 388.0, 0.09698380370478131, 0.04388264555652539, 0.062193389745579156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 106.85714285714285, 82, 243, 85.0, 243.0, 243.0, 243.0, 0.03580507715994128, 0.009650587203265424, 0.02108443508539511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 107.28571428571429, 82, 242, 84.0, 242.0, 242.0, 242.0, 0.03580489401751371, 0.009650537840657992, 0.021049361522014896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 94.78571428571428, 81, 242, 84.0, 164.5, 242.0, 242.0, 0.12296881862099254, 0.03314393939393939, 0.07229221563460694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 125.07142857142856, 83, 335, 84.0, 291.5, 335.0, 335.0, 0.12313862770795035, 0.03318970824940849, 0.0725122973709903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 83.0, 82, 85, 83.0, 85.0, 85.0, 85.0, 0.035805260304242414, 0.009580704417346113, 0.02042018751726325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 84.14285714285714, 83, 87, 84.0, 86.0, 87.0, 87.0, 0.12313754463735992, 0.09151139791897549, 0.06180927533554981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 84.57142857142857, 83, 87, 84.0, 87.0, 87.0, 87.0, 0.035804710876959675, 0.026608774391959286, 0.017972286514411396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 113.14285714285714, 82, 339, 83.0, 293.5, 339.0, 339.0, 0.12313754463735992, 0.03294891331116857, 0.07022688092599433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 93.85714285714285, 85, 105, 94.0, 105.0, 105.0, 105.0, 0.03682020692956295, 0.028981530063698958, 0.013088432931993077], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 460.4375, 82, 901, 458.5, 815.6000000000001, 901.0, 901.0, 0.08440064988500412, 0.01662358991570485, 0.05743303500780706], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1306.3749999999998, 671, 2326, 1276.5, 1861.0, 2232.25, 2326.0, 0.09758041235855923, 0.050505486865269913, 0.04488317795007949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 193.7142857142857, 167, 328, 171.0, 328.0, 328.0, 328.0, 0.03578915077457948, 0.05546619363208753, 0.08049063890025052], "isController": false}, {"data": ["addBook", 63, 15, 23.80952380952381, 789.8730158730159, 429, 1873, 680.0, 1271.8, 1347.8, 1873.0, 0.2973577638696157, 80.27087839424448, 1.0822362365835008], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 149.41379310344823, 83, 339, 85.0, 334.1, 336.05, 339.0, 0.25248567796757737, 0.18763828216145154, 0.12205118222065507], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 459.93103448275843, 399, 683, 409.5, 577.1, 596.0, 683.0, 0.2524593018194481, 74.23141717267346, 0.1269692777705232], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 142.08620689655172, 81, 350, 86.0, 258.40000000000003, 339.1, 350.0, 0.2528147434584185, 0.4473635890104046, 0.12295092015848869], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 631.8275862068965, 560, 859, 575.0, 734.4, 753.9499999999998, 859.0, 0.2521103373931791, 226.849324749085, 0.1265475716993106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 22, 0, 0.0, 95.95454545454544, 82, 173, 88.5, 136.39999999999998, 169.39999999999995, 173.0, 0.10407796385656165, 0.07775355698268521, 0.03699646371463715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 15, 8.152173913043478, 145.34782608695647, 82, 1341, 91.0, 261.0, 319.25, 779.1500000000037, 0.764710282859684, 1.6700925808556444, 0.36733416254872947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 16, 0, 0.0, 88.9375, 85, 104, 87.5, 97.0, 104.0, 104.0, 0.07171607605489866, 0.055537937804233044, 0.025492823910139756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c92fc4a0-0316-4283-8b8d-41b94b6af8f3", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 99.21052631578947, 84, 253, 90.0, 105.0, 253.0, 253.0, 0.10521827253747709, 0.08538709421742526, 0.03740180781605631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 16, 0, 0.0, 226.25000000000003, 167, 591, 169.5, 413.20000000000016, 591.0, 591.0, 0.0703037120359955, 0.108957022462036, 0.15811469611220472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41be4001-f62a-43e1-8453-bd5760ae6cb1", 3, 0, 0.0, 279.0, 163, 461, 213.0, 461.0, 461.0, 461.0, 0.03406922867266285, 0.028069406826337785, 0.02184778010584174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25475eca-a248-4abe-9d99-dbad60416a50", 3, 0, 0.0, 703.6666666666666, 178, 1553, 380.0, 1553.0, 1553.0, 1553.0, 0.017599849814614914, 0.024262813790655653, 0.011286362023044071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 239.42857142857142, 167, 423, 169.5, 421.0, 423.0, 423.0, 0.12287492210607617, 0.1904321302561942, 0.27634857969755217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 115.6923076923077, 83, 269, 88.0, 263.8, 269.0, 269.0, 0.07490507222577542, 0.062103912421565745, 0.026626412392756104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c67ef0f-e2fa-4b58-bf97-d6174d190ada", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.49769714187327824, 1.8993199035812673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 88.42857142857143, 85, 98, 87.0, 96.0, 98.0, 98.0, 0.0760262181843853, 0.05902426118807257, 0.027024944745230713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3548c06-15a4-4594-97e3-bd6dd0c98258", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 0.6042276337792643, 2.3058632943143813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c5c26ad-6252-4822-9d12-cb3a6fb053fc", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.32728996829710144, 1.2490092844202898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91e31895-0b5c-4f93-a8d9-53e8519b56e0", 3, 0, 0.0, 1010.6666666666667, 253, 2373, 406.0, 2373.0, 2373.0, 2373.0, 0.07248828106122844, 0.03279905946455323, 0.04648499794616537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d35518f-2f67-4129-8a48-2d48d0c5bff5", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b706da11-a0ff-45ad-9948-86273062c10a", 3, 0, 0.0, 402.6666666666667, 218, 616, 374.0, 616.0, 616.0, 616.0, 0.02291878347097336, 0.027089226166375092, 0.014697266744081226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 22, 0, 0.0, 92.13636363636364, 82, 249, 84.0, 91.7, 225.44999999999968, 249.0, 0.1081362713630577, 0.08036299072977238, 0.054279339336534824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 22, 0, 0.0, 113.04545454545455, 80, 248, 83.0, 246.4, 247.85, 248.0, 0.10805341768048604, 0.03628960219151977, 0.061211723918606305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 22, 0, 0.0, 169.54545454545453, 81, 742, 84.5, 309.19999999999993, 680.9499999999991, 742.0, 0.10813839748725687, 4.450690926021047, 0.06315113447009728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 22, 0, 0.0, 142.49999999999997, 80, 406, 83.5, 247.0, 382.14999999999964, 406.0, 0.10805235627808747, 1.471935165516564, 0.06320640762751406], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 28.205128205128204, 0.7845934379457917], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.256410256410257, 0.28530670470756064], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.6923076923076925, 0.21398002853067047], "isController": false}, {"data": ["401/Unauthorized", 21, 53.84615384615385, 1.4978601997146932], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1402, 39, "401/Unauthorized", 21, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
