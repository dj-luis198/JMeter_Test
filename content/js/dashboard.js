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

    var data = {"OkPercent": 97.37434358589647, "KoPercent": 2.625656414103526};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7546683837733419, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e590d48-323a-43b2-8957-d779798def75"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f572e2f9-e88f-42d4-8f2a-5bb0f7de9efc"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19a3839d-2928-4da2-acd6-4998b371eca9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/69310179-71fa-40ee-b783-ef89c9585459"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=32d0bf2b-9528-4bee-baea-0a9354640939"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/12bcb209-85df-4b76-a292-32d8e9a54624"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/96cb7f2e-b12a-4800-ac44-2526458a1349"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f075e78c-2333-4044-afb4-9af19ad2670a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96cb7f2e-b12a-4800-ac44-2526458a1349"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/45b02e21-79f3-4a3d-868a-7acdde5f02c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12bcb209-85df-4b76-a292-32d8e9a54624"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2705f838-83db-422c-bb5a-7597368e0cbc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/05d049d0-4db6-424b-985f-7313c158fa16"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=715abab7-617e-401a-a3a7-1d0fe0bdd804"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ebc6c643-005e-4630-8715-abfcef5b2dd1"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19a3839d-2928-4da2-acd6-4998b371eca9"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=05d049d0-4db6-424b-985f-7313c158fa16"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3482142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b3163807-eeca-43ec-984d-e440876f4fba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.45652173913043476, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8e590d48-323a-43b2-8957-d779798def75"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f572e2f9-e88f-42d4-8f2a-5bb0f7de9efc"], "isController": false}, {"data": [0.22950819672131148, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8960674157303371, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/25e43d8e-0542-4bc9-aa48-4d64839cbfe8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2705f838-83db-422c-bb5a-7597368e0cbc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/32d0bf2b-9528-4bee-baea-0a9354640939"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45b02e21-79f3-4a3d-868a-7acdde5f02c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/715abab7-617e-401a-a3a7-1d0fe0bdd804"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5270ad1c-4c76-49b1-b1f7-f3558c0e98fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3229a503-4818-44d0-b888-991940fc96ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ebc6c643-005e-4630-8715-abfcef5b2dd1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1333, 35, 2.625656414103526, 418.4448612153037, 137, 2429, 157.0, 1108.8000000000004, 1279.7999999999997, 1738.9800000000002, 5.156094674098457, 725.2098690149364, 3.7625508767875173], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2112.7321428571427, 1693, 2711, 2141.0, 2466.9, 2541.95, 2711.0, 0.26046511627906976, 313.4268077761628, 1.280704941860465], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e590d48-323a-43b2-8957-d779798def75", 1, 0, 0.0, 999.0, 999, 999, 999.0, 999.0, 999.0, 999.0, 1.001001001001001, 0.1808449074074074, 0.6901432682682682], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f572e2f9-e88f-42d4-8f2a-5bb0f7de9efc", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 421.5, 142, 585, 468.0, 570.5, 585.0, 585.0, 0.09045739133805866, 0.018557142014873778, 0.06055521656468672], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 421.5, 142, 585, 468.0, 570.5, 585.0, 585.0, 0.08789939286633643, 0.01803237405272708, 0.0588428064549547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 174.35, 137, 435, 146.0, 400.90000000000055, 434.65, 435.0, 0.1035432500155315, 0.027705908695562137, 0.0590520097744828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 146.34999999999997, 138, 157, 146.0, 149.9, 156.65, 157.0, 0.10354056978375553, 0.0769476304740605, 0.05197251256723666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 174.05, 139, 439, 146.0, 390.60000000000053, 437.84999999999997, 439.0, 0.10339711211865853, 0.02786875287573218, 0.06088716660893661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 173.1, 141, 419, 145.5, 385.60000000000053, 418.6, 419.0, 0.10354432214709507, 0.027908430578709217, 0.06087273626225706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19a3839d-2928-4da2-acd6-4998b371eca9", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 0.6593578923357664, 2.5162522810218975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69310179-71fa-40ee-b783-ef89c9585459", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.8748929794520548, 1.6347388698630136], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 249.7857142857143, 139, 466, 237.5, 409.5, 466.0, 466.0, 0.09013881377321074, 0.1413386157092637, 0.05825447193141724], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=32d0bf2b-9528-4bee-baea-0a9354640939", 1, 0, 0.0, 547.0, 547, 547, 547.0, 547.0, 547.0, 547.0, 1.8281535648994516, 0.3302816499085923, 1.2604261882998171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 163.35294117647058, 141, 423, 146.0, 218.99999999999983, 423.0, 423.0, 0.09114450693502468, 0.06773532204839237, 0.045750270082619816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 910.5, 684, 1026, 1001.5, 1026.0, 1026.0, 1026.0, 0.029433262529985134, 8.654356460110572, 0.016786157536632148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 211.7058823529412, 139, 438, 144.0, 433.2, 438.0, 438.0, 0.09115721402105197, 0.048552946254779045, 0.05063707833085779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1080.8333333333335, 976, 1237, 1022.0, 1237.0, 1237.0, 1237.0, 0.02936253927239628, 26.420464451140734, 0.0167171488240303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 438.1666666666667, 424, 451, 440.5, 451.0, 451.0, 451.0, 0.029475483766377313, 0.05215778963347236, 0.016320897749546814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12bcb209-85df-4b76-a292-32d8e9a54624", 3, 0, 0.0, 387.6666666666667, 310, 530, 323.0, 530.0, 530.0, 530.0, 0.05233410090014654, 0.03364578427011374, 0.03356060506942991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 198.90909090909093, 143, 428, 149.0, 427.8, 428.0, 428.0, 0.12789210556911987, 0.095044816736426, 0.06419584205324962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 250.63636363636363, 142, 444, 147.0, 443.4, 444.0, 444.0, 0.12790251502854552, 0.05168787716707557, 0.07196787466716277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 300.27272727272725, 143, 1026, 148.0, 906.2000000000005, 1026.0, 1026.0, 0.12789656655853593, 10.493297874736939, 0.07419000052321323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 220.27272727272728, 139, 990, 143.0, 821.4000000000005, 990.0, 990.0, 0.12790102785916935, 3.450171103960281, 0.07431749177363843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 203.5, 140, 491, 147.5, 491.0, 491.0, 491.0, 0.029517826307270734, 0.02193658771468069, 0.016574951295586594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 836.4666666666666, 139, 1440, 1028.0, 1367.4, 1440.0, 1440.0, 0.08698728245930445, 46.972164114918904, 0.046653726100244146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 391.7647058823529, 139, 1284, 147.0, 1276.8, 1284.0, 1284.0, 0.09115477007549759, 14.49456669814634, 0.052206632447880916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96cb7f2e-b12a-4800-ac44-2526458a1349", 3, 0, 0.0, 543.3333333333334, 379, 785, 466.0, 785.0, 785.0, 785.0, 0.038968630252646616, 0.03248654364486588, 0.02498964895758914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 603.4000000000001, 142, 1105, 710.0, 1052.8, 1105.0, 1105.0, 0.0869847602700007, 15.355222655615737, 0.046737319434135144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 276.6470588235294, 138, 717, 146.0, 712.2, 717.0, 717.0, 0.09115525885412477, 4.750116876457814, 0.05229593119118475], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 382.2857142857143, 141, 999, 338.5, 773.0, 999.0, 999.0, 0.08802484815713693, 0.01805811093960238, 0.059344319017768446], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 528.5454545454545, 292, 1174, 298.0, 1113.2000000000003, 1174.0, 1174.0, 0.12767389765196094, 14.065551297340901, 0.2841719005710505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 500.69565217391306, 178, 1157, 425.0, 910.2000000000002, 1113.7999999999993, 1157.0, 0.1039270883696551, 0.06383802596143853, 0.04699047062026398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 146.06666666666666, 141, 154, 145.0, 151.6, 154.0, 154.0, 0.08697921196833956, 0.06463982451943985, 0.04365948725754544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 279.4, 144, 442, 158.0, 440.8, 442.0, 442.0, 0.08698223822695406, 0.10166049092775255, 0.04522396839065462], "isController": false}, {"data": ["login", 23, 0, 0.0, 2264.0434782608695, 1173, 3676, 2182.0, 3440.2000000000007, 3667.4, 3676.0, 0.10449605640969724, 32.75518334514593, 0.20286486019109148], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f075e78c-2333-4044-afb4-9af19ad2670a", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.5785071331521738, 1.0809414628623188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96cb7f2e-b12a-4800-ac44-2526458a1349", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45b02e21-79f3-4a3d-868a-7acdde5f02c8", 3, 0, 0.0, 399.0, 230, 511, 456.0, 511.0, 511.0, 511.0, 0.05585760035748864, 0.0252741095367543, 0.0358201408542489], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 184.41176470588235, 142, 436, 150.0, 432.8, 436.0, 436.0, 0.08571788730618933, 0.06939465681331149, 0.030470030253371992], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12bcb209-85df-4b76-a292-32d8e9a54624", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 986.2666666666665, 296, 1595, 1176.0, 1515.2, 1595.0, 1595.0, 0.08690412736668908, 62.43440322573636, 0.182108277835392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2705f838-83db-422c-bb5a-7597368e0cbc", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05d049d0-4db6-424b-985f-7313c158fa16", 3, 0, 0.0, 290.3333333333333, 225, 411, 235.0, 411.0, 411.0, 411.0, 0.13978845347374308, 0.06325063487255952, 0.08964298611434696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=715abab7-617e-401a-a3a7-1d0fe0bdd804", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 365.05, 282, 598, 298.0, 571.3000000000001, 596.6999999999999, 598.0, 0.10331752575189329, 0.1601219857111862, 0.2323635369205178], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 719.2500000000001, 139, 1729, 650.0, 1621.9000000000003, 1729.0, 1729.0, 0.058682289196101536, 35.110060620027284, 0.08560221629558268], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebc6c643-005e-4630-8715-abfcef5b2dd1", 3, 0, 0.0, 319.3333333333333, 265, 417, 276.0, 417.0, 417.0, 417.0, 0.058429417263945155, 0.026437789712527266, 0.037469385419912744], "isController": false}, {"data": ["register", 24, 6, 25.0, 1032.3333333333333, 172, 2429, 1007.0, 1614.5, 2231.0, 2429.0, 0.09590754512649806, 0.03025208698814343, 0.04327078696136924], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 149.76470588235293, 145, 154, 150.0, 153.2, 154.0, 154.0, 0.09413119673973833, 0.0730803724688398, 0.033460698841078856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 575.3529411764707, 289, 1430, 317.0, 1422.8, 1430.0, 1430.0, 0.0910722417164439, 19.3434239647229, 0.200711543741462], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19a3839d-2928-4da2-acd6-4998b371eca9", 3, 0, 0.0, 402.3333333333333, 240, 509, 458.0, 509.0, 509.0, 509.0, 0.06592827004219409, 0.02983082531206048, 0.042278220046589314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 446.0588235294118, 289, 872, 302.0, 645.5999999999998, 872.0, 872.0, 0.08689829321528797, 0.13467538216080274, 0.19543629811992988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 170.33333333333331, 140, 434, 146.0, 351.8000000000003, 434.0, 434.0, 0.06671484961360982, 0.04958007866792683, 0.033487727247456495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=05d049d0-4db6-424b-985f-7313c158fa16", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 0.7687832446808511, 2.9338430851063833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 179.58333333333334, 141, 576, 143.0, 447.6000000000005, 576.0, 576.0, 0.06671596234995858, 0.03455244013632295, 0.03711509754429662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 353.24999999999994, 139, 1244, 148.0, 1163.3000000000002, 1244.0, 1244.0, 0.06671484961360982, 10.020007939762051, 0.03826548340468116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 283.0833333333333, 140, 706, 144.0, 699.4, 706.0, 706.0, 0.06671484961360982, 3.2843816019903262, 0.03833063462500695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 151.66666666666666, 141, 168, 146.0, 168.0, 168.0, 168.0, 0.03469090404495941, 0.010231106466384515, 0.021444670176229794], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1384.1607142857142, 1110, 2100, 1175.0, 1878.1000000000001, 1940.05, 2100.0, 0.2504158692113689, 299.5844382188277, 0.49447352299354286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1032.3333333333333, 172, 2429, 1007.0, 1614.5, 2231.0, 2429.0, 0.0928329123618627, 0.029282256536017237, 0.04188359913201227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 214.75, 139, 430, 144.0, 430.0, 430.0, 430.0, 0.04347589804901907, 0.011718113146024674, 0.0256015298081626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 215.25, 139, 432, 148.5, 432.0, 432.0, 432.0, 0.04347566178108918, 0.011718049464434192, 0.025558933976773127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 263.2941176470589, 140, 1292, 146.0, 614.3999999999994, 1292.0, 1292.0, 0.09642381100933042, 5.128126019185502, 0.05619921797453277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 236.5294117647059, 137, 1144, 144.0, 579.1999999999995, 1144.0, 1144.0, 0.096504822402743, 1.693635240864683, 0.05634067727935875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 195.05882352941177, 142, 426, 149.0, 420.4, 426.0, 426.0, 0.09705578423928246, 0.07212837090438863, 0.04871745419823358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 144.625, 142, 148, 144.5, 148.0, 148.0, 148.0, 0.043473771730093085, 0.011632630326216314, 0.024793635439818714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3163807-eeca-43ec-984d-e440876f4fba", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 1.3195699896694215, 2.46561854338843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 160.5294117647059, 138, 426, 143.0, 206.7999999999998, 426.0, 426.0, 0.09705689246667237, 0.03454529559532985, 0.05487327295823699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 179.75, 140, 430, 144.5, 430.0, 430.0, 430.0, 0.043473771730093085, 0.03230814481113363, 0.02182179557545688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 150.125, 146, 155, 149.5, 155.0, 155.0, 155.0, 0.04458935986400245, 0.03509670317420506, 0.015850124014157124], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 428.2857142857143, 143, 785, 441.5, 756.5, 785.0, 785.0, 0.08768468586961288, 0.017474549911375835, 0.05966546530818035], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1109.0869565217392, 672, 1623, 1061.0, 1524.6000000000001, 1608.6, 1623.0, 0.10235414534288638, 0.05297626663254862, 0.04707890864892528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e590d48-323a-43b2-8957-d779798def75", 3, 0, 0.0, 433.66666666666663, 220, 728, 353.0, 728.0, 728.0, 728.0, 0.021241043360049845, 0.029282493043558303, 0.013621372206802798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 399.25, 289, 862, 291.5, 862.0, 862.0, 862.0, 0.0434388354048228, 0.06732171072993533, 0.09769495892315128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f572e2f9-e88f-42d4-8f2a-5bb0f7de9efc", 3, 0, 0.0, 551.3333333333334, 233, 980, 441.0, 980.0, 980.0, 980.0, 0.017868523404787572, 0.0246332020245037, 0.011458655959450365], "isController": false}, {"data": ["addBook", 61, 17, 27.868852459016395, 1249.1311475409834, 732, 3193, 1087.0, 2013.2, 2253.1, 3193.0, 0.2834875474609275, 90.07360256033405, 1.0287497327781314], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 273.55357142857144, 144, 615, 150.5, 590.5, 600.5, 615.0, 0.25185065256303013, 0.18716635410201748, 0.12174421193232413], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 791.9999999999999, 686, 1162, 730.0, 1006.5, 1140.6, 1162.0, 0.25177365548372016, 74.02981438436845, 0.12662444587316002], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 218.12499999999997, 139, 596, 147.0, 438.3, 474.3999999999998, 596.0, 0.2520910048527519, 0.44608291093084607, 0.1225989457194047], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1107.1249999999998, 964, 1454, 1022.5, 1318.3, 1428.1, 1454.0, 0.25114134773210395, 225.97742614874744, 0.12606118431084123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 150.94117647058823, 146, 162, 150.0, 158.0, 162.0, 162.0, 0.0827838756488795, 0.06184537585096954, 0.029427080797062632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 17, 9.55056179775281, 201.10112359550558, 140, 1501, 151.0, 315.5, 430.15, 732.3300000000078, 0.7256213642496953, 1.5601782918954616, 0.3485627512158235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 149.41666666666666, 143, 156, 150.0, 155.4, 156.0, 156.0, 0.07108541504996713, 0.055049545053343675, 0.025268643631043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25e43d8e-0542-4bc9-aa48-4d64839cbfe8", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 1.0824947033898307, 2.0226430084745766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 166.35, 140, 481, 150.0, 163.60000000000002, 465.14999999999975, 481.0, 0.10416883685076773, 0.0845354525615117, 0.037028766224296336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2705f838-83db-422c-bb5a-7597368e0cbc", 3, 0, 0.0, 304.3333333333333, 230, 416, 267.0, 416.0, 416.0, 416.0, 0.036325329652366595, 0.03643175151658251, 0.023294563611706443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 526.5000000000001, 288, 1385, 297.0, 1305.2000000000003, 1385.0, 1385.0, 0.0666607412674429, 13.37766287093925, 0.1470789402053151], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32d0bf2b-9528-4bee-baea-0a9354640939", 3, 0, 0.0, 332.6666666666667, 244, 442, 312.0, 442.0, 442.0, 442.0, 0.025743780731638247, 0.02581920196425047, 0.01650886980511958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 462.47058823529414, 291, 1718, 297.0, 1033.1999999999994, 1718.0, 1718.0, 0.09634511955295866, 6.920665638513111, 0.21523238478257173], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45b02e21-79f3-4a3d-868a-7acdde5f02c8", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 0.7084865196078431, 2.703737745098039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 155.63636363636363, 144, 217, 149.0, 205.00000000000006, 217.0, 217.0, 0.12134851292913247, 0.10061024167659519, 0.04313560420527756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/715abab7-617e-401a-a3a7-1d0fe0bdd804", 3, 0, 0.0, 654.6666666666666, 243, 1244, 477.0, 1244.0, 1244.0, 1244.0, 0.0269684738540646, 0.022482507011803203, 0.01729423616292554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 151.6, 141, 170, 151.0, 162.8, 170.0, 170.0, 0.09008305657816507, 0.06993752927699338, 0.032021711518019615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5270ad1c-4c76-49b1-b1f7-f3558c0e98fb", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 1.1654596259124086, 2.1776630930656933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3229a503-4818-44d0-b888-991940fc96ed", 1, 0, 0.0, 326.0, 326, 326, 326.0, 326.0, 326.0, 326.0, 3.067484662576687, 0.9795580904907976, 1.8303057898773005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 162.5294117647059, 137, 431, 147.0, 206.9999999999998, 431.0, 431.0, 0.08696363896789508, 0.0646282512251642, 0.0436516703413067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 212.23529411764707, 137, 442, 146.0, 440.4, 442.0, 442.0, 0.08696586334081922, 0.02327016265174264, 0.04959771893656096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ebc6c643-005e-4630-8715-abfcef5b2dd1", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 0.728484122983871, 2.780052923387097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 212.58823529411765, 142, 440, 146.0, 434.4, 440.0, 440.0, 0.08696497357799479, 0.02343977803469391, 0.05112589266987585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 226.76470588235293, 138, 443, 145.0, 432.59999999999997, 443.0, 443.0, 0.08696452870341004, 0.023439658127090986, 0.05121055742984009], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 17.142857142857142, 0.450112528132033], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.571428571428571, 0.2250562640660165], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.571428571428571, 0.2250562640660165], "isController": false}, {"data": ["401/Unauthorized", 23, 65.71428571428571, 1.7254313578394598], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1333, 35, "401/Unauthorized", 23, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
