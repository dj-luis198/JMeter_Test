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

    var data = {"OkPercent": 69.62025316455696, "KoPercent": 30.379746835443036};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5216121495327103, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d76f203a-5894-40c1-b024-97c5fa91dec3"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de383b94-9c0e-4284-bd15-d39a9a889935"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/17405f7d-656f-4f51-be34-c6b4b2083afb"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7838fe3-e685-4583-aa12-c25b697a6276"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7d7c845b-1f2c-4117-8544-b07c5723ae9d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e203a33-0fb1-41da-a72c-778778af5b4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17405f7d-656f-4f51-be34-c6b4b2083afb"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8e203a33-0fb1-41da-a72c-778778af5b4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=165bd27d-cba5-4c82-bcfb-d7236f5f47d3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e97ca9e8-31e4-43e3-95b1-5d8a9155ba51"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa08e022-04cc-4d3b-8bda-e8b237d9713a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/24f0125d-93ba-4b81-9a80-7d38a7d88a43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e97ca9e8-31e4-43e3-95b1-5d8a9155ba51"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fa08e022-04cc-4d3b-8bda-e8b237d9713a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9692737430167597, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/165bd27d-cba5-4c82-bcfb-d7236f5f47d3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24f0125d-93ba-4b81-9a80-7d38a7d88a43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7291666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ffa8edf3-22fe-4f60-99fd-5cf2346e0e0b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8290ddd7-33f5-4a73-b2a6-ebfb147c85e7"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ffa8edf3-22fe-4f60-99fd-5cf2346e0e0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8290ddd7-33f5-4a73-b2a6-ebfb147c85e7"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aeaced9d-7615-49ae-9b31-fdd9cc943399"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d7838fe3-e685-4583-aa12-c25b697a6276"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1951a58f-6699-4ca1-ac8b-b2d0bec5d779"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b5c358c6-578b-417b-a369-532f8727d438"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d76f203a-5894-40c1-b024-97c5fa91dec3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/42d09e0c-62a5-4543-abed-7faf037ba56d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5c358c6-578b-417b-a369-532f8727d438"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e2b5e12a-084d-4333-beb5-cc93a9f7ab7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26ce20ad-e309-4037-afb5-0afd9cb8bb86"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/26ce20ad-e309-4037-afb5-0afd9cb8bb86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ef9aa7c-4d76-4e61-88cb-7af01dc4d74a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7ef9aa7c-4d76-4e61-88cb-7af01dc4d74a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/20b95f5e-689f-4ef8-aab4-89e074fe6405"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42d09e0c-62a5-4543-abed-7faf037ba56d"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 632, 192, 30.379746835443036, 307.1566455696207, 125, 2443, 136.0, 749.5000000000007, 1072.4500000000003, 1706.409999999999, 2.4914946208158066, 2.6584083754824315, 1.1922152558217003], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d76f203a-5894-40c1-b024-97c5fa91dec3", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["see books", 61, 61, 100.0, 708.8196721311475, 513, 1225, 770.0, 921.6, 936.6, 1225.0, 0.26065145772532466, 1.6765166523165933, 0.43755845295882134], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 169.80952380952382, 129, 392, 132.0, 388.6, 391.7, 392.0, 0.09760223834466604, 0.07577517527735303, 0.034694545661580506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 15, 100.0, 196.86666666666667, 127, 390, 129.0, 385.2, 390.0, 390.0, 0.08774187510236552, 0.0436138812764688, 0.04404230840099207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de383b94-9c0e-4284-bd15-d39a9a889935", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.6451231060606061, 1.2054135101010102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17405f7d-656f-4f51-be34-c6b4b2083afb", 3, 0, 0.0, 381.3333333333333, 271, 478, 395.0, 478.0, 478.0, 478.0, 0.03923363630419146, 0.025223447819263715, 0.025159590989341528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 18, 100.0, 143.22222222222223, 127, 386, 128.5, 159.20000000000036, 386.0, 386.0, 0.1203739617745797, 0.05983432279615339, 0.06042208628138083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7838fe3-e685-4583-aa12-c25b697a6276", 1, 0, 0.0, 1611.0, 1611, 1611, 1611.0, 1611.0, 1611.0, 1611.0, 0.6207324643078833, 0.11214404872749845, 0.4279659373060211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d7c845b-1f2c-4117-8544-b07c5723ae9d", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 1.46484375, 2.7370627866972477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e203a33-0fb1-41da-a72c-778778af5b4a", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 0.7889260371179039, 3.0107123362445414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17405f7d-656f-4f51-be34-c6b4b2083afb", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books", 61, 61, 100.0, 244.2622950819672, 125, 825, 131.0, 514.4, 526.5, 825.0, 0.2555369837419831, 0.12701984836393493, 0.12352617866433752], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 621.1428571428571, 395, 1077, 526.5, 1062.5, 1077.0, 1077.0, 0.1017464043547461, 0.01838191875549612, 0.0691557592098665], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 621.1428571428571, 395, 1077, 526.5, 1062.5, 1077.0, 1077.0, 0.10350359674998706, 0.01869938027221446, 0.07035010091600684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 4, 16.666666666666668, 1052.208333333333, 217, 2114, 988.5, 1874.0, 2080.25, 2114.0, 0.10475088929140387, 0.03334842764550553, 0.04726065512952011], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e203a33-0fb1-41da-a72c-778778af5b4a", 3, 0, 0.0, 325.6666666666667, 207, 435, 335.0, 435.0, 435.0, 435.0, 0.08266512358435976, 0.03659653908682594, 0.05301116323606404], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 168.71428571428572, 129, 383, 133.0, 383.0, 383.0, 383.0, 0.03222035037329577, 0.025360939844605853, 0.011453327671757482], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 565.6428571428572, 395, 1017, 462.5, 956.0, 1017.0, 1017.0, 0.10166070015176491, 0.018366435086012215, 0.06919678516189467], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1214.9583333333335, 767, 2443, 1119.5, 1702.5, 2260.75, 2443.0, 0.10716534272816171, 0.05546643715422432, 0.04929187150875407], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 245.92857142857144, 207, 313, 224.0, 306.5, 313.0, 313.0, 0.10207503973635475, 0.21670297393805504, 0.06598991826705747], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, 100.0, 128.42857142857142, 127, 130, 129.0, 130.0, 130.0, 130.0, 0.03178942683663413, 0.015801580331881615, 0.01595680214260737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=165bd27d-cba5-4c82-bcfb-d7236f5f47d3", 1, 0, 0.0, 1143.0, 1143, 1143, 1143.0, 1143.0, 1143.0, 1143.0, 0.8748906386701663, 0.15806129702537183, 0.6031960848643919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e97ca9e8-31e4-43e3-95b1-5d8a9155ba51", 1, 0, 0.0, 1096.0, 1096, 1096, 1096.0, 1096.0, 1096.0, 1096.0, 0.9124087591240876, 0.1648394730839416, 0.6290630702554744], "isController": false}, {"data": ["addBook", 59, 59, 100.0, 768.1186440677966, 516, 1533, 732.0, 992.0, 1049.0, 1533.0, 0.2726004232237079, 0.9309862143309277, 0.5330634136734524], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa08e022-04cc-4d3b-8bda-e8b237d9713a", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24f0125d-93ba-4b81-9a80-7d38a7d88a43", 3, 0, 0.0, 700.3333333333334, 280, 1017, 804.0, 1017.0, 1017.0, 1017.0, 0.01648306365209747, 0.02272323390840911, 0.010570193813356776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e97ca9e8-31e4-43e3-95b1-5d8a9155ba51", 3, 0, 0.0, 322.0, 223, 443, 300.0, 443.0, 443.0, 443.0, 0.042633620873420784, 0.027409310294598317, 0.02733991963562465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa08e022-04cc-4d3b-8bda-e8b237d9713a", 3, 0, 0.0, 530.3333333333334, 313, 851, 427.0, 851.0, 851.0, 851.0, 0.019100494066113177, 0.026331573037105895, 0.012248689228594713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 161.11111111111111, 128, 389, 131.5, 379.1, 389.0, 389.0, 0.11700544075299502, 0.08741129118754022, 0.0415917777676662], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 622.0, 225, 1611, 470.0, 1377.0, 1611.0, 1611.0, 0.10340192327577293, 0.018681011529314444, 0.07129077913349188], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 3, 1.675977653631285, 196.5195530726257, 128, 894, 136.0, 359.0, 402.0, 688.3999999999971, 0.7251161603681484, 1.6579729420778022, 0.34593503273150045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 224.44444444444446, 130, 446, 135.0, 446.0, 446.0, 446.0, 0.04935888295363556, 0.038224213068586914, 0.01754554042492514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 16, 100.0, 145.18750000000003, 127, 378, 129.0, 207.90000000000018, 378.0, 378.0, 0.07353177721709797, 0.036550463479983274, 0.03690950536092613], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/165bd27d-cba5-4c82-bcfb-d7236f5f47d3", 3, 0, 0.0, 474.66666666666663, 233, 895, 296.0, 895.0, 895.0, 895.0, 0.027002214181562886, 0.027081322230922935, 0.01731587302658818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24f0125d-93ba-4b81-9a80-7d38a7d88a43", 1, 0, 0.0, 804.0, 804, 804, 804.0, 804.0, 804.0, 804.0, 1.243781094527363, 0.22470654539800994, 0.8575287624378108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 166.9375, 128, 426, 133.5, 392.40000000000003, 426.0, 426.0, 0.10624099441570774, 0.08621705699165344, 0.03776535348370861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 604.4166666666667, 175, 1841, 489.5, 1342.0, 1787.0, 1841.0, 0.10750617040623893, 0.06603650506398857, 0.04860874697078968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffa8edf3-22fe-4f60-99fd-5cf2346e0e0b", 3, 0, 0.0, 326.6666666666667, 221, 468, 291.0, 468.0, 468.0, 468.0, 0.019351717464925013, 0.02287307490727302, 0.012409792775358813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8290ddd7-33f5-4a73-b2a6-ebfb147c85e7", 3, 0, 0.0, 450.6666666666667, 217, 596, 539.0, 596.0, 596.0, 596.0, 0.028044197655505077, 0.028126358390823936, 0.01798407206423991], "isController": false}, {"data": ["login", 24, 4, 16.666666666666668, 2147.7916666666665, 1357, 3909, 2040.5, 3078.5, 3751.5, 3909.0, 0.10441774057412354, 0.15462119201552343, 0.15693252221052356], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 9, 100.0, 159.33333333333334, 128, 378, 131.0, 378.0, 378.0, 378.0, 0.04923763724991383, 0.02447456773457631, 0.024714985885210653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ffa8edf3-22fe-4f60-99fd-5cf2346e0e0b", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 187.40000000000003, 127, 398, 134.0, 397.4, 398.0, 398.0, 0.08627978809684043, 0.06984955501199289, 0.030669768425048746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8290ddd7-33f5-4a73-b2a6-ebfb147c85e7", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 21, 100.0, 152.8571428571429, 127, 381, 129.0, 327.8000000000002, 380.5, 381.0, 0.09627639577850927, 0.04785613813599728, 0.04832623772475954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aeaced9d-7615-49ae-9b31-fdd9cc943399", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 179.87499999999997, 127, 388, 132.0, 384.5, 388.0, 388.0, 0.07440441590208378, 0.06168881748131752, 0.026448444715193847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 18, 100.0, 128.94444444444443, 127, 132, 129.0, 131.1, 132.0, 132.0, 0.09479471677445177, 0.04711963949042574, 0.04758250431842599], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7838fe3-e685-4583-aa12-c25b697a6276", 3, 0, 0.0, 396.6666666666667, 287, 603, 300.0, 603.0, 603.0, 603.0, 0.02866890284108827, 0.023302815883527804, 0.01838468053285934], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 134.16666666666666, 128, 161, 131.5, 144.8, 161.0, 161.0, 0.09656911397837924, 0.07497309141876123, 0.034327302234502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1951a58f-6699-4ca1-ac8b-b2d0bec5d779", 1, 0, 0.0, 345.0, 345, 345, 345.0, 345.0, 345.0, 345.0, 2.898550724637681, 0.9256114130434784, 1.7295063405797102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5c358c6-578b-417b-a369-532f8727d438", 3, 0, 0.0, 294.6666666666667, 213, 457, 214.0, 457.0, 457.0, 457.0, 0.07972998113057114, 0.036075740159991494, 0.051128926701570675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d76f203a-5894-40c1-b024-97c5fa91dec3", 3, 0, 0.0, 304.3333333333333, 211, 480, 222.0, 480.0, 480.0, 480.0, 0.022348865795060898, 0.026415602767534546, 0.014331792192796214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42d09e0c-62a5-4543-abed-7faf037ba56d", 3, 0, 0.0, 320.3333333333333, 218, 427, 316.0, 427.0, 427.0, 427.0, 0.10619093129446745, 0.048048631021910725, 0.06809770008141304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5c358c6-578b-417b-a369-532f8727d438", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2b5e12a-084d-4333-beb5-cc93a9f7ab7c", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26ce20ad-e309-4037-afb5-0afd9cb8bb86", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.4817708333333333, 1.8385416666666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, 100.0, 145.0, 127, 380, 128.0, 212.00000000000017, 380.0, 380.0, 0.10196278358399184, 0.0506826726994647, 0.05118053785368341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 4, 100.0, 268.25, 129, 435, 254.5, 435.0, 435.0, 435.0, 0.17721855478268575, 0.08809008240662797, 0.09951237207035576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26ce20ad-e309-4037-afb5-0afd9cb8bb86", 3, 0, 0.0, 308.3333333333333, 222, 425, 278.0, 425.0, 425.0, 425.0, 0.03230565456640427, 0.02693189496893273, 0.020716842283794407], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ef9aa7c-4d76-4e61-88cb-7af01dc4d74a", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ef9aa7c-4d76-4e61-88cb-7af01dc4d74a", 3, 0, 0.0, 294.3333333333333, 226, 427, 230.0, 427.0, 427.0, 427.0, 0.041816509157815505, 0.03486070310975439, 0.026815925469041844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20b95f5e-689f-4ef8-aab4-89e074fe6405", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 0.9310085641399416, 1.7395909256559765], "isController": false}, {"data": ["register", 24, 4, 16.666666666666668, 1052.208333333333, 217, 2114, 988.5, 1874.0, 2080.25, 2114.0, 0.10824316827753548, 0.03446022740085602, 0.0488362731877162], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42d09e0c-62a5-4543-abed-7faf037ba56d", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 0.8029513888888888, 3.064236111111111], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 2.0833333333333335, 0.6329113924050633], "isController": false}, {"data": ["401/Unauthorized", 3, 1.5625, 0.47468354430379744], "isController": false}, {"data": ["404/Not Found", 185, 96.35416666666667, 29.272151898734176], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 632, 192, "404/Not Found", 185, "406/Not Acceptable", 4, "401/Unauthorized", 3, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 61, 61, "404/Not Found", 61, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 21, "404/Not Found", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 4, "404/Not Found", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
