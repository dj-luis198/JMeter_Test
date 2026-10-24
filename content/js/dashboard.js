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

    var data = {"OkPercent": 98.50187265917603, "KoPercent": 1.4981273408239701};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.806254029658285, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.31896551724137934, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/292df897-0cb7-4d3d-8c25-6b2cf68ae610"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/726c73d7-b04b-4713-ad1b-58cb0775ff14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35614225-0a21-44bb-9c6d-74a3c0a2ab7f"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/46e0432d-8539-4522-82b1-24c7d2caafd4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/da7844d0-799b-42db-9f72-487e92da5606"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5cb868ba-097e-4d3c-85fb-8af6f8627f2f"], "isController": false}, {"data": [0.8863636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2128f12a-a5a8-44b1-aab2-e66a958bc3af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/51e91d34-5d47-4f19-800e-5ebecf8502dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d058af5-5969-426d-b1a0-3fc656c2c402"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2d406d9-0a0a-4331-a81b-7aa3496d36c7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c32aca1b-63da-42dd-8af6-0f5c63cb7911"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=173d148a-ec03-40ec-806e-5f14c0a9fd34"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb5638dd-b35e-487f-9ed4-3c818cf66819"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c2c6649a-498b-4005-9940-d30f9bc6011b"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/35614225-0a21-44bb-9c6d-74a3c0a2ab7f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3813559322033898, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=292df897-0cb7-4d3d-8c25-6b2cf68ae610"], "isController": false}, {"data": [0.7931034482758621, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9517045454545454, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da7844d0-799b-42db-9f72-487e92da5606"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2128f12a-a5a8-44b1-aab2-e66a958bc3af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/173d148a-ec03-40ec-806e-5f14c0a9fd34"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c2d406d9-0a0a-4331-a81b-7aa3496d36c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51e91d34-5d47-4f19-800e-5ebecf8502dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=726c73d7-b04b-4713-ad1b-58cb0775ff14"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eb5638dd-b35e-487f-9ed4-3c818cf66819"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2c6649a-498b-4005-9940-d30f9bc6011b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c32aca1b-63da-42dd-8af6-0f5c63cb7911"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c0e43f6-4bb0-4838-8292-a607aa43a834"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/76cabad3-19f3-4051-9c11-c3b914519502"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5cb868ba-097e-4d3c-85fb-8af6f8627f2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1335, 20, 1.4981273408239701, 312.84419475655466, 81, 4852, 94.0, 855.4000000000001, 1019.0, 1418.6800000000012, 5.294803556838824, 762.6322918505141, 3.872727553850334], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1403.1551724137933, 1013, 1903, 1383.0, 1680.9, 1762.45, 1903.0, 0.24773302921968368, 298.1073708785019, 1.2181013692588938], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/292df897-0cb7-4d3d-8c25-6b2cf68ae610", 3, 0, 0.0, 443.0, 184, 594, 551.0, 594.0, 594.0, 594.0, 0.04427260116289365, 0.02805949038546678, 0.028390958428027507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/726c73d7-b04b-4713-ad1b-58cb0775ff14", 3, 0, 0.0, 626.6666666666666, 212, 1152, 516.0, 1152.0, 1152.0, 1152.0, 0.021166709000084667, 0.025018333456805802, 0.013573703362684503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35614225-0a21-44bb-9c6d-74a3c0a2ab7f", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 941.6428571428571, 87, 2748, 765.0, 2327.0, 2748.0, 2748.0, 0.08548783019674414, 0.016839957622461318, 0.057520620122613976], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 941.6428571428571, 87, 2748, 765.0, 2327.0, 2748.0, 2748.0, 0.08859974432645208, 0.0174529630285924, 0.05961447640715379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46e0432d-8539-4522-82b1-24c7d2caafd4", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 1.557736280487805, 2.9106326219512195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 120.11111111111111, 81, 252, 84.0, 250.2, 252.0, 252.0, 0.09519931033388512, 0.041360464255303396, 0.053404995054924714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 94.1111111111111, 82, 245, 85.0, 103.70000000000022, 245.0, 245.0, 0.0951977998730696, 0.07074758369473239, 0.047784833139411884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 202.16666666666669, 82, 663, 164.0, 510.0000000000002, 663.0, 663.0, 0.09519880684162092, 3.132986948508023, 0.055150437253408645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 201.44444444444446, 81, 989, 84.0, 980.0, 989.0, 989.0, 0.09519981383147517, 9.540692714173137, 0.05505805205314265], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 265.71428571428567, 85, 647, 209.5, 599.0, 647.0, 647.0, 0.08544661112636943, 0.1739210458054869, 0.05522797842473069], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 85.6, 81, 101, 85.0, 91.7, 100.55, 101.0, 0.12607717183688136, 0.09369602321080733, 0.06328483039468458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 92.65000000000002, 81, 252, 84.0, 89.80000000000001, 243.8999999999999, 252.0, 0.12607955619996217, 0.033736131248818, 0.07190474689529093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 557.6666666666667, 489, 727, 495.5, 727.0, 727.0, 727.0, 0.14165309157872372, 41.6507122494511, 0.08078652879099087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 917.5, 810, 993, 915.0, 993.0, 993.0, 993.0, 0.14023278642546627, 126.18170772857944, 0.07983956492778012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 165.66666666666666, 84, 250, 163.0, 250.0, 250.0, 250.0, 0.14302400419537079, 0.2530854449238397, 0.0791939554480227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 119.28571428571429, 81, 253, 84.5, 253.0, 253.0, 253.0, 0.07964093316419116, 0.059186279431591285, 0.03997601527968189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 143.07142857142858, 81, 262, 84.5, 257.0, 262.0, 262.0, 0.07956625026995691, 0.038362299237300654, 0.04442300970708253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 245.28571428571428, 83, 1025, 86.5, 873.0, 1025.0, 1025.0, 0.07964229233272274, 10.255867308118964, 0.04584320565915374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 214.57142857142856, 81, 858, 84.0, 754.5, 858.0, 858.0, 0.07956534588192503, 3.3605036557434818, 0.04587661475027848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 88.0, 84, 105, 85.0, 105.0, 105.0, 105.0, 0.14295244448680072, 0.10623711938911655, 0.08027114802725627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 109.9, 81, 260, 84.5, 255.50000000000003, 259.85, 260.0, 0.12607717183688136, 0.033981737721659425, 0.07411958734941658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 602.3529411764706, 82, 1076, 914.0, 1036.8, 1076.0, 1076.0, 0.08320322632745854, 44.04829847872689, 0.04470835127912725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 118.89999999999998, 81, 258, 85.0, 253.70000000000002, 257.8, 258.0, 0.12607955619996217, 0.03398238038202105, 0.07424411366071991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 426.99999999999994, 82, 779, 498.0, 761.4, 779.0, 779.0, 0.08320322632745854, 14.40012309183189, 0.044789604429837655], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 689.2857142857143, 88, 2184, 515.0, 1765.0, 2184.0, 2184.0, 0.08887647439722705, 0.017507475146328767, 0.06037103150671018], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/da7844d0-799b-42db-9f72-487e92da5606", 3, 0, 0.0, 367.3333333333333, 240, 547, 315.0, 547.0, 547.0, 547.0, 0.04293135276692568, 0.027600723214413484, 0.0275308479657694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 401.07142857142856, 167, 1279, 335.0, 1041.0, 1279.0, 1279.0, 0.07952602489164579, 13.697181760990212, 0.17594911115466108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5cb868ba-097e-4d3c-85fb-8af6f8627f2f", 1, 0, 0.0, 665.0, 665, 665, 665.0, 665.0, 665.0, 665.0, 1.5037593984962407, 0.2716752819548872, 1.0367716165413534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 384.8636363636364, 111, 827, 398.0, 617.0, 795.9499999999996, 827.0, 0.1017096466976727, 0.06247594509066028, 0.04598785783302975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 100.17647058823529, 83, 317, 86.0, 142.59999999999985, 317.0, 317.0, 0.08320159747067143, 0.06183243718279391, 0.041763301855395625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 124.70588235294116, 83, 259, 85.0, 255.0, 259.0, 259.0, 0.08320363355162051, 0.09577403544964222, 0.04334159863546041], "isController": false}, {"data": ["login", 22, 0, 0.0, 2232.8636363636365, 1175, 6387, 2169.0, 3140.6, 5915.699999999993, 6387.0, 0.10233176889765427, 33.52805380383465, 0.20067528792438613], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2128f12a-a5a8-44b1-aab2-e66a958bc3af", 3, 0, 0.0, 480.0, 215, 862, 363.0, 862.0, 862.0, 862.0, 0.024996250562415636, 0.025069481765235213, 0.01602949661717409], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 97.25000000000001, 84, 254, 87.0, 100.0, 246.2999999999999, 254.0, 0.13145268360653584, 0.10642019014630684, 0.046727321125760786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51e91d34-5d47-4f19-800e-5ebecf8502dc", 3, 0, 0.0, 346.6666666666667, 195, 527, 318.0, 527.0, 527.0, 527.0, 0.04245984006793574, 0.027297585981176136, 0.027228478168565565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d058af5-5969-426d-b1a0-3fc656c2c402", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2d406d9-0a0a-4331-a81b-7aa3496d36c7", 1, 0, 0.0, 877.0, 877, 877, 877.0, 877.0, 877.0, 877.0, 1.1402508551881414, 0.20600235176738882, 0.7861495153933865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c32aca1b-63da-42dd-8af6-0f5c63cb7911", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=173d148a-ec03-40ec-806e-5f14c0a9fd34", 1, 0, 0.0, 2184.0, 2184, 2184, 2184.0, 2184.0, 2184.0, 2184.0, 0.45787545787545786, 0.08272164033882783, 0.31568366529304026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 714.4117647058824, 170, 1161, 999.0, 1124.2, 1161.0, 1161.0, 0.0831674062042885, 58.58079809063535, 0.1745282925119981], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb5638dd-b35e-487f-9ed4-3c818cf66819", 1, 0, 0.0, 867.0, 867, 867, 867.0, 867.0, 867.0, 867.0, 1.1534025374855825, 0.20837838811995388, 0.7952169838523645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2c6649a-498b-4005-9940-d30f9bc6011b", 3, 0, 0.0, 315.6666666666667, 207, 533, 207.0, 533.0, 533.0, 533.0, 0.02437359851808521, 0.024445005544993664, 0.015630204778850215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 352.3888888888889, 169, 1077, 329.0, 1066.2, 1077.0, 1077.0, 0.09515502339227658, 12.779806980678245, 0.2113007328258399], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 699.7777777777778, 85, 1079, 990.0, 1079.0, 1079.0, 1079.0, 0.14603988511529037, 116.48934187734272, 0.2515131354763334], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 724.1818181818182, 257, 1374, 723.0, 1164.0, 1346.0999999999997, 1374.0, 0.10509219451609822, 0.03306522881436897, 0.04741464244769275], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 231.1, 167, 362, 172.5, 346.20000000000005, 361.25, 362.0, 0.12600806451612903, 0.1952878890498992, 0.2833950904107863], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 88.10526315789474, 84, 117, 87.0, 89.0, 117.0, 117.0, 0.1438326091235295, 0.11166691821602143, 0.051127997774379624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35614225-0a21-44bb-9c6d-74a3c0a2ab7f", 3, 0, 0.0, 1055.6666666666665, 182, 2338, 647.0, 2338.0, 2338.0, 2338.0, 0.019929052572840687, 0.023555465459630383, 0.012780023948078176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 298.2307692307693, 172, 497, 335.0, 434.19999999999993, 497.0, 497.0, 0.07128521763925293, 0.11047816444677187, 0.16032212521796824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 101.0, 82, 243, 85.5, 227.60000000000005, 243.0, 243.0, 0.04519161243673174, 0.03358478228940709, 0.02268407108640636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 117.9, 83, 249, 85.0, 248.9, 249.0, 249.0, 0.04519222512958871, 0.012092450864753228, 0.02577369089421856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 99.8, 81, 243, 84.0, 227.60000000000005, 243.0, 243.0, 0.04519263360072308, 0.012180827025194893, 0.026568325612925093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 101.20000000000002, 81, 245, 85.0, 229.50000000000006, 245.0, 245.0, 0.045192837839059266, 0.012180882073808942, 0.026612579313430407], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 90.0, 88, 92, 90.0, 92.0, 92.0, 92.0, 0.3459010722933241, 0.1020137928052577, 0.21382361207194742], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 973.7931034482759, 661, 1554, 906.5, 1329.2, 1411.6499999999999, 1554.0, 0.2606448713627682, 311.8218809684305, 0.5146718065385911], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 724.1818181818182, 257, 1374, 723.0, 1164.0, 1346.0999999999997, 1374.0, 0.10304063547970099, 0.03241974539595706, 0.04648903671056822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 167.16666666666666, 84, 252, 166.5, 252.0, 252.0, 252.0, 0.03002537143886584, 0.00809277589563181, 0.017680956032847757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 110.66666666666667, 82, 247, 83.0, 247.0, 247.0, 247.0, 0.03005018380695762, 0.008099463604219046, 0.017666221339637193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 189.26315789473682, 83, 1067, 85.0, 896.0, 1067.0, 1067.0, 0.15136668180333485, 14.373346294105463, 0.08761778219927822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 155.73684210526318, 82, 672, 85.0, 497.0, 672.0, 672.0, 0.15137029955385595, 4.721545869184194, 0.08776769887268962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 113.5, 83, 251, 85.5, 251.0, 251.0, 251.0, 0.030048829347689994, 0.008040409415299862, 0.01713722298735445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 94.15789473684211, 82, 251, 85.0, 91.0, 251.0, 251.0, 0.15137150550912612, 0.11249386298090329, 0.07598140022626056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 113.83333333333333, 85, 251, 86.5, 251.0, 251.0, 251.0, 0.030049732306968033, 0.022331881138283858, 0.015083557036896062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 104.05263157894737, 81, 256, 85.0, 250.0, 256.0, 256.0, 0.15136909361780101, 0.06443456174664, 0.08498951370686976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 88.16666666666666, 86, 91, 88.0, 91.0, 91.0, 91.0, 0.031874033818349884, 0.025088350837490236, 0.011330222958866558], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 705.6153846153846, 89, 2338, 547.0, 1747.5999999999995, 2338.0, 2338.0, 0.08365239213667514, 0.015672255558057978, 0.056932893085808046], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1321.2727272727275, 788, 4852, 970.0, 2418.9999999999995, 4507.7499999999945, 4852.0, 0.10089521573231582, 0.05222115658020252, 0.04640785801750073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 282.5, 172, 502, 255.5, 502.0, 502.0, 502.0, 0.030012455168895093, 0.046513443704137215, 0.06749871509176308], "isController": false}, {"data": ["addBook", 59, 7, 11.864406779661017, 928.64406779661, 423, 3412, 724.0, 1526.0, 1588.0, 3412.0, 0.2694531471214183, 88.48992365827176, 0.9785605635909428], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 152.79310344827582, 82, 356, 87.0, 337.1, 342.4, 356.0, 0.2617281276511254, 0.19450693861572896, 0.12651896795635456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=292df897-0cb7-4d3d-8c25-6b2cf68ae610", 1, 0, 0.0, 782.0, 782, 782, 782.0, 782.0, 782.0, 782.0, 1.278772378516624, 0.23102821291560102, 0.8816536125319693], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 538.7758620689656, 407, 788, 495.0, 672.2, 763.15, 788.0, 0.2613165850427793, 76.83575252981487, 0.13142386845413218], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 121.91379310344826, 81, 290, 86.0, 254.3, 265.05, 290.0, 0.26209476985367886, 0.4637848857176426, 0.12746405799524613], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 819.5689655172414, 575, 1201, 811.5, 1039.1000000000001, 1088.05, 1201.0, 0.26110483359068665, 234.94258823824015, 0.13106238717345015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 100.30769230769232, 84, 253, 87.0, 190.19999999999993, 253.0, 253.0, 0.07287444853662502, 0.05444233704152161, 0.025904589128253424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 7, 3.977272727272727, 149.48295454545462, 83, 2900, 88.0, 252.0, 298.15, 1115.1399999999762, 0.7791092479382379, 1.730559412060257, 0.37314882010323197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 103.10000000000001, 84, 245, 88.0, 229.50000000000006, 245.0, 245.0, 0.04719808564564621, 0.03655086124706782, 0.016777444506850803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da7844d0-799b-42db-9f72-487e92da5606", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 99.3888888888889, 85, 311, 87.0, 113.00000000000031, 311.0, 311.0, 0.09751446464558909, 0.07913527355516069, 0.03466334485448675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2128f12a-a5a8-44b1-aab2-e66a958bc3af", 1, 0, 0.0, 1346.0, 1346, 1346, 1346.0, 1346.0, 1346.0, 1346.0, 0.7429420505200593, 0.13422292904903416, 0.5122237184249628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 236.4, 168, 492, 175.5, 476.4000000000001, 492.0, 492.0, 0.045174259706819056, 0.07001127944797055, 0.10159796885234793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/173d148a-ec03-40ec-806e-5f14c0a9fd34", 3, 0, 0.0, 311.3333333333333, 192, 528, 214.0, 528.0, 528.0, 528.0, 0.02418477165544762, 0.02425562547865694, 0.015509114635817646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 302.2631578947369, 167, 1154, 175.0, 979.0, 1154.0, 1154.0, 0.15126425068466975, 19.258661806473313, 0.3361229106625374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2d406d9-0a0a-4331-a81b-7aa3496d36c7", 3, 0, 0.0, 716.0, 290, 1011, 847.0, 1011.0, 1011.0, 1011.0, 0.016910745087428552, 0.02331282729337888, 0.010844455671300211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51e91d34-5d47-4f19-800e-5ebecf8502dc", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=726c73d7-b04b-4713-ad1b-58cb0775ff14", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb5638dd-b35e-487f-9ed4-3c818cf66819", 3, 0, 0.0, 422.0, 202, 648, 416.0, 648.0, 648.0, 648.0, 0.049790051947620866, 0.03155639034570893, 0.03192916742734801], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2c6649a-498b-4005-9940-d30f9bc6011b", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 87.64285714285715, 83, 95, 87.0, 94.0, 95.0, 95.0, 0.08120367040590235, 0.06732609001426865, 0.0288653672145981], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c32aca1b-63da-42dd-8af6-0f5c63cb7911", 3, 0, 0.0, 390.66666666666663, 192, 715, 265.0, 715.0, 715.0, 715.0, 0.0281780098810888, 0.0234908474301655, 0.018069882638588847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 87.11764705882354, 84, 94, 88.0, 90.0, 94.0, 94.0, 0.08279960061369115, 0.06428289305457467, 0.02943267053064803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c0e43f6-4bb0-4838-8292-a607aa43a834", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 1.0470030737704918, 1.9563268442622952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76cabad3-19f3-4051-9c11-c3b914519502", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 1.3884171195652173, 2.594259510869565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5cb868ba-097e-4d3c-85fb-8af6f8627f2f", 3, 0, 0.0, 264.6666666666667, 182, 429, 183.0, 429.0, 429.0, 429.0, 0.02310304729193781, 0.027307019764656958, 0.014815430717811679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 97.46153846153847, 83, 245, 86.0, 181.79999999999995, 245.0, 245.0, 0.0713196326490306, 0.05300218793546122, 0.03579911248203294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 159.84615384615384, 81, 252, 87.0, 251.6, 252.0, 252.0, 0.07132080647373475, 0.019083887669729804, 0.04067514744205184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 135.61538461538458, 81, 251, 86.0, 250.6, 251.0, 251.0, 0.0713192413827155, 0.019222764278935038, 0.041927913391010485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 173.0, 82, 253, 245.0, 252.6, 253.0, 253.0, 0.07132041519454016, 0.0192230806579034, 0.04199825230694112], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 30.0, 0.449438202247191], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.0, 0.149812734082397], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.0749063670411985], "isController": false}, {"data": ["401/Unauthorized", 11, 55.0, 0.8239700374531835], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1335, 20, "401/Unauthorized", 11, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
