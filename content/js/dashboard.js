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

    var data = {"OkPercent": 98.87820512820512, "KoPercent": 1.1217948717948718};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7254632807137955, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4200be77-c6a2-40f1-a08b-806d5addd058"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c2355cf-ce7d-437e-870b-e0ed6c01ed12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c1ab674-ff8c-478b-bcd3-e20f86967374"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/20ac7937-1aea-423a-9af1-d5e49abc3c6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5238095238095238, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ca6dcf8-6753-4e37-b824-5feea27e768d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd1490b8-ce76-4fd7-bcb3-9c253e8a5c82"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80469f04-1f7b-40ff-bafc-6341586a5a4d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bd1490b8-ce76-4fd7-bcb3-9c253e8a5c82"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/061084dc-3505-4e7f-bd48-d9e74f92d3fd"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fe9f4134-8954-46d9-9faa-f7b95d22d172"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0c1ab674-ff8c-478b-bcd3-e20f86967374"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/672ffed3-9846-47fa-a1ee-60ddb0278c61"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97ba8cd4-ff00-4df9-9400-e5e8143f9425"], "isController": false}, {"data": [0.4523809523809524, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8d6c94f-b9ae-42e3-bfcd-09012c9e118c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/51caa8ed-4805-44b0-92bf-65c9b2d25a75"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0a0c414a-97c9-4df0-8677-e821c702d508"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=efe703a2-fcbd-4f1e-95bf-ba621b2c08be"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "register"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d8d6c94f-b9ae-42e3-bfcd-09012c9e118c"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.25961538461538464, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20ac7937-1aea-423a-9af1-d5e49abc3c6a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4200be77-c6a2-40f1-a08b-806d5addd058"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2719298245614035, 500, 1500, "addBook"], "isController": true}, {"data": [0.9038461538461539, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6ca6dcf8-6753-4e37-b824-5feea27e768d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3557692307692308, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.927710843373494, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=061084dc-3505-4e7f-bd48-d9e74f92d3fd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a0c414a-97c9-4df0-8677-e821c702d508"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80469f04-1f7b-40ff-bafc-6341586a5a4d"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7c2355cf-ce7d-437e-870b-e0ed6c01ed12"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=672ffed3-9846-47fa-a1ee-60ddb0278c61"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe9f4134-8954-46d9-9faa-f7b95d22d172"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/97ba8cd4-ff00-4df9-9400-e5e8143f9425"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ecc5e603-d7fd-4f0b-92ad-1817394e0d21"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/efe703a2-fcbd-4f1e-95bf-ba621b2c08be"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1248, 14, 1.1217948717948718, 501.14583333333286, 138, 3800, 165.0, 1389.2000000000003, 1690.55, 2197.709999999999, 4.996596869119591, 712.1127687472474, 3.645736890439204], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 52, 0, 0.0, 2379.173076923076, 1890, 3548, 2288.0, 2857.8, 3048.9, 3548.0, 0.25151756995332414, 302.6603103309633, 1.2367099264794794], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4200be77-c6a2-40f1-a08b-806d5addd058", 1, 0, 0.0, 1504.0, 1504, 1504, 1504.0, 1504.0, 1504.0, 1504.0, 0.6648936170212766, 0.12012238198138298, 0.45841298204787234], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 703.2857142857143, 523, 1297, 615.5, 1166.5, 1297.0, 1297.0, 0.08549983816102062, 0.015446748105262515, 0.05811317125006871], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 703.2857142857143, 523, 1297, 615.5, 1166.5, 1297.0, 1297.0, 0.08414978662018394, 0.015202842309310573, 0.05719555809340626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 184.64285714285714, 141, 428, 143.5, 425.0, 428.0, 428.0, 0.06981707925235882, 0.026171664613712075, 0.03939872845644412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c2355cf-ce7d-437e-870b-e0ed6c01ed12", 1, 0, 0.0, 964.0, 964, 964, 964.0, 964.0, 964.0, 964.0, 1.037344398340249, 0.18741085321576764, 0.7152003371369294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 143.0, 139, 151, 143.0, 148.0, 151.0, 151.0, 0.06981568658740923, 0.05188450927052581, 0.035044202056570654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 273.0, 138, 1122, 144.0, 773.5, 1122.0, 1122.0, 0.06971903229983167, 1.4817142384938695, 0.040627287655747336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 313.35714285714283, 141, 1678, 144.5, 1053.0, 1678.0, 1678.0, 0.06981638291293897, 4.50468100925815, 0.040615836599742675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c1ab674-ff8c-478b-bcd3-e20f86967374", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 274.0, 229, 437, 251.0, 400.5, 437.0, 437.0, 0.08568822949756094, 0.17502848942362423, 0.055396101491587246], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/20ac7937-1aea-423a-9af1-d5e49abc3c6a", 3, 0, 0.0, 620.6666666666667, 304, 1214, 344.0, 1214.0, 1214.0, 1214.0, 0.026629030969563015, 0.022199527445654586, 0.01707655957358045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 147.28571428571428, 141, 190, 143.0, 172.0, 190.0, 190.0, 0.09278159213212098, 0.06895194493412507, 0.04657201011319354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 255.00000000000003, 140, 561, 146.5, 494.5, 561.0, 561.0, 0.09276806658096665, 0.034775082994288144, 0.052350283108260336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1002.6666666666666, 822, 1131, 1044.0, 1131.0, 1131.0, 1131.0, 0.06398566721054483, 18.813910684006782, 0.036491825831013854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1450.1666666666665, 1263, 1555, 1530.0, 1555.0, 1555.0, 1555.0, 0.06358491765753163, 57.213820678610034, 0.03620117870541108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 236.5, 141, 427, 143.5, 427.0, 427.0, 427.0, 0.06435558606487042, 0.11387922065385275, 0.03563439189334134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 186.35714285714283, 140, 427, 144.5, 425.5, 427.0, 427.0, 0.06305028260037379, 0.046856704159066856, 0.031648286383390754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 224.5, 142, 426, 144.5, 425.5, 426.0, 426.0, 0.06305369021721996, 0.016871788202654562, 0.03596030770200826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 223.07142857142858, 139, 429, 144.5, 427.0, 429.0, 429.0, 0.06305340623508111, 0.016994863399299207, 0.037068506399920736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 242.14285714285714, 138, 423, 144.5, 422.5, 423.0, 423.0, 0.06305369021721996, 0.01699493994136007, 0.03713024921971059], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 144.0, 140, 149, 143.5, 149.0, 149.0, 149.0, 0.06454597286917607, 0.04796824741547167, 0.036244076562281485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 910.2380952380953, 138, 1978, 425.0, 1928.8000000000002, 1976.1, 1978.0, 0.10272967420017612, 44.03180912765385, 0.056189845049408084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 205.3571428571429, 141, 981, 143.0, 571.0, 981.0, 981.0, 0.09277114022357845, 5.985764030392488, 0.05396981790350477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 630.9047619047618, 139, 1286, 434.0, 1252.8, 1283.0, 1286.0, 0.10273017674482314, 14.398352770535027, 0.05629044236347893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 255.28571428571428, 140, 1101, 146.5, 766.5, 1101.0, 1101.0, 0.09276868129319542, 1.9715803766077142, 0.05405898183059113], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 752.5714285714287, 242, 1583, 607.5, 1543.5, 1583.0, 1583.0, 0.08421255248246574, 0.01521418184497672, 0.05806060747326251], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ca6dcf8-6753-4e37-b824-5feea27e768d", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd1490b8-ce76-4fd7-bcb3-9c253e8a5c82", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 0.7465457128099173, 2.848979855371901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 491.35714285714283, 283, 854, 565.5, 852.0, 854.0, 854.0, 0.06300913632476708, 0.09765185483145056, 0.1417090243710338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80469f04-1f7b-40ff-bafc-6341586a5a4d", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd1490b8-ce76-4fd7-bcb3-9c253e8a5c82", 3, 0, 0.0, 658.0, 250, 1212, 512.0, 1212.0, 1212.0, 1212.0, 0.10203734566851468, 0.046169241692459444, 0.06543410513247849], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 671.7272727272729, 149, 2357, 496.5, 1438.2999999999997, 2230.3999999999983, 2357.0, 0.10137921818190197, 0.062272976793375324, 0.045838455095918565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 169.9047619047619, 140, 419, 143.0, 365.4000000000002, 418.8, 419.0, 0.10272615652531221, 0.07634238780836192, 0.05156371528711961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 184.19047619047618, 138, 434, 142.0, 432.2, 433.9, 434.0, 0.10273067929438699, 0.1009630848310814, 0.05448012772847792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/061084dc-3505-4e7f-bd48-d9e74f92d3fd", 3, 0, 0.0, 382.6666666666667, 235, 475, 438.0, 475.0, 475.0, 475.0, 0.03164924200065408, 0.026384670821508825, 0.020295900631929865], "isController": false}, {"data": ["login", 22, 0, 0.0, 3365.181818181817, 1920, 5635, 3348.0, 4861.4, 5544.249999999999, 5635.0, 0.09689154312994919, 31.74561435018806, 0.19000686223343816], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 172.2857142857143, 141, 434, 148.0, 313.5, 434.0, 434.0, 0.09593706528517293, 0.07766779992325035, 0.03410262867558881], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe9f4134-8954-46d9-9faa-f7b95d22d172", 3, 0, 0.0, 345.0, 252, 519, 264.0, 519.0, 519.0, 519.0, 0.018460402436773122, 0.0254491550519968, 0.011838213802227555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c1ab674-ff8c-478b-bcd3-e20f86967374", 3, 0, 0.0, 795.0, 239, 1319, 827.0, 1319.0, 1319.0, 1319.0, 0.02113211800174692, 0.02497744806782001, 0.013551520984193176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/672ffed3-9846-47fa-a1ee-60ddb0278c61", 3, 0, 0.0, 565.0, 250, 856, 589.0, 856.0, 856.0, 856.0, 0.03949707063392799, 0.02539281071028899, 0.02532852511355408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97ba8cd4-ff00-4df9-9400-e5e8143f9425", 1, 0, 0.0, 625.0, 625, 625, 625.0, 625.0, 625.0, 625.0, 1.6, 0.2890625, 1.103125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 1096.5714285714287, 282, 2123, 852.0, 2073.0, 2121.0, 2123.0, 0.10265535176567205, 58.564997526800376, 0.21836699013286534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8d6c94f-b9ae-42e3-bfcd-09012c9e118c", 1, 0, 0.0, 1079.0, 1079, 1079, 1079.0, 1079.0, 1079.0, 1079.0, 0.9267840593141798, 0.1674365732159407, 0.6389741658943466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51caa8ed-4805-44b0-92bf-65c9b2d25a75", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.7713428442028986, 1.4412552838164252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a0c414a-97c9-4df0-8677-e821c702d508", 3, 0, 0.0, 342.3333333333333, 250, 515, 262.0, 515.0, 515.0, 515.0, 0.03743168717091308, 0.023285141335812144, 0.024004044181868092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 498.21428571428567, 282, 1822, 292.0, 1197.0, 1822.0, 1822.0, 0.06966803182833796, 6.053630038802606, 0.15541180649206532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=efe703a2-fcbd-4f1e-95bf-ba621b2c08be", 1, 0, 0.0, 841.0, 841, 841, 841.0, 841.0, 841.0, 841.0, 1.1890606420927465, 0.21482052615933414, 0.8198015755053508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 0, 0.0, 1594.6666666666667, 1413, 1696, 1676.0, 1696.0, 1696.0, 1696.0, 0.06348534546608825, 75.95054425457623, 0.14315201433710717], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1264.3636363636363, 159, 2075, 1292.5, 1885.8999999999999, 2050.0999999999995, 2075.0, 0.09950383768210333, 0.03130696029344586, 0.044893333016730215], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 513.642857142857, 288, 1244, 566.5, 975.0, 1244.0, 1244.0, 0.09267901945597416, 8.053112473851277, 0.20674351577860306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 169.07692307692307, 142, 416, 146.0, 316.7999999999999, 416.0, 416.0, 0.10110358451093085, 0.07849350555291995, 0.035939164806619954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8d6c94f-b9ae-42e3-bfcd-09012c9e118c", 3, 0, 0.0, 485.3333333333333, 437, 551, 468.0, 551.0, 551.0, 551.0, 0.024882843279558746, 0.024955742234479328, 0.01595677124372745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 658.0, 287, 1694, 566.0, 1502.9, 1694.0, 1694.0, 0.0808431945188314, 18.236155247670705, 0.17793989750598746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 175.22222222222223, 140, 424, 143.0, 424.0, 424.0, 424.0, 0.05267840419554223, 0.03914869686797621, 0.026442089605965533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 204.44444444444446, 138, 426, 143.0, 426.0, 426.0, 426.0, 0.05268272123816102, 0.02288863019071145, 0.029554000520973577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 318.55555555555554, 142, 1159, 144.0, 1159.0, 1159.0, 1159.0, 0.05268210447446674, 5.279671777684445, 0.030468274397667937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 282.1111111111111, 139, 1122, 143.0, 1122.0, 1122.0, 1122.0, 0.05268241285450874, 1.7337750058536014, 0.0305199004156057], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1633.8076923076926, 1114, 2968, 1431.5, 2262.7000000000007, 2421.6, 2968.0, 0.2453293074164937, 293.49914193715796, 0.4844295503868654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1264.3636363636363, 159, 2075, 1292.5, 1885.8999999999999, 2050.0999999999995, 2075.0, 0.09770959819148416, 0.030742437499167247, 0.044083822621548516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 177.125, 140, 424, 143.0, 424.0, 424.0, 424.0, 0.039404596546187116, 0.010620770162839495, 0.02320407394272542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 196.875, 142, 568, 143.0, 568.0, 568.0, 568.0, 0.03940401428395518, 0.010620613224972294, 0.023165250584903336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 218.2307692307692, 141, 565, 143.0, 508.99999999999994, 565.0, 565.0, 0.10327788105565883, 0.027836616378283045, 0.060716098042486934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 272.5384615384615, 139, 430, 144.0, 428.8, 430.0, 430.0, 0.10327788105565883, 0.027836616378283045, 0.06081695534820535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 176.75, 139, 418, 142.0, 418.0, 418.0, 418.0, 0.039350713231677326, 0.010529390063944908, 0.022442203639940973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 167.07692307692307, 141, 433, 144.0, 321.39999999999986, 433.0, 433.0, 0.10327788105565883, 0.07675240965171522, 0.05184065513926625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20ac7937-1aea-423a-9af1-d5e49abc3c6a", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.3062102754237288, 1.168564618644068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4200be77-c6a2-40f1-a08b-806d5addd058", 3, 0, 0.0, 417.6666666666667, 313, 576, 364.0, 576.0, 576.0, 576.0, 0.0542171940794824, 0.034362264607015705, 0.03476818760956391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 179.125, 142, 424, 145.0, 424.0, 424.0, 424.0, 0.0394034320389306, 0.02928321463049432, 0.019778675847666332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 164.9230769230769, 140, 425, 142.0, 316.9999999999999, 425.0, 425.0, 0.10327706057596822, 0.027634682224428997, 0.05890019860973188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 146.75, 144, 159, 145.0, 159.0, 159.0, 159.0, 0.03996283456385561, 0.03145512173678479, 0.01420553884887055], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 659.0, 475, 1214, 536.5, 1143.0, 1214.0, 1214.0, 0.08274329483800046, 0.01494873979006844, 0.056320387209068665], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1820.6363636363637, 1123, 3800, 1672.0, 2658.4, 3631.5499999999975, 3800.0, 0.09810829371839352, 0.0507787067097154, 0.045125982755237645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 411.25, 284, 993, 289.0, 993.0, 993.0, 993.0, 0.0393224737768253, 0.06094215418341968, 0.08843716514455925], "isController": false}, {"data": ["addBook", 57, 8, 14.035087719298245, 1470.9649122807018, 720, 3090, 1202.0, 2506.8, 2665.3999999999996, 3090.0, 0.27076841225203313, 91.99399484946227, 0.9825421546633921], "isController": true}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 267.05769230769226, 142, 594, 148.0, 574.0, 579.35, 594.0, 0.2468069352748812, 0.18341804467205527, 0.11930608687604122], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 923.5769230769231, 685, 1281, 847.0, 1259.8, 1276.45, 1281.0, 0.24604669209149152, 72.34589699397185, 0.12374418596398254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ca6dcf8-6753-4e37-b824-5feea27e768d", 3, 0, 0.0, 533.3333333333333, 262, 1072, 266.0, 1072.0, 1072.0, 1072.0, 0.026550787230841394, 0.02662857274030675, 0.01702638373852785], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 200.4230769230769, 141, 435, 146.0, 425.4, 427.35, 435.0, 0.24702970532206497, 0.43712678324568527, 0.12013749340858237], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1364.634615384615, 962, 2396, 1267.5, 1701.1, 1834.05, 2396.0, 0.24606532087864247, 221.41000826329937, 0.12351325676916235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 150.125, 141, 163, 148.0, 162.3, 163.0, 163.0, 0.08094585228393782, 0.060472243161340256, 0.02877372092905602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 8, 4.819277108433735, 221.1385542168676, 141, 1760, 151.0, 375.3, 475.30000000000024, 1039.7500000000134, 0.6942179175135289, 1.4957230190742645, 0.33475071669635914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 150.0, 143, 165, 146.0, 165.0, 165.0, 165.0, 0.05537745891300201, 0.042885082927744726, 0.019684956097981186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 146.92857142857142, 143, 156, 145.5, 153.5, 156.0, 156.0, 0.06882549296259334, 0.05585350063663581, 0.02446531195154685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=061084dc-3505-4e7f-bd48-d9e74f92d3fd", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 495.0, 283, 1302, 291.0, 1302.0, 1302.0, 1302.0, 0.052634656997485235, 7.0691040046201525, 0.11688023605181588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a0c414a-97c9-4df0-8677-e821c702d508", 1, 0, 0.0, 698.0, 698, 698, 698.0, 698.0, 698.0, 698.0, 1.4326647564469914, 0.25883103510028654, 0.9877551934097422], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80469f04-1f7b-40ff-bafc-6341586a5a4d", 3, 0, 0.0, 345.0, 250, 487, 298.0, 487.0, 487.0, 487.0, 0.05204809243741217, 0.03237757312756987, 0.03337719469456444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 473.7692307692308, 284, 859, 564.0, 800.1999999999999, 859.0, 859.0, 0.10315904744522651, 0.15987637528864695, 0.2320071154944889], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c2355cf-ce7d-437e-870b-e0ed6c01ed12", 3, 0, 0.0, 383.3333333333333, 229, 522, 399.0, 522.0, 522.0, 522.0, 0.020427757236533003, 0.024144917488883894, 0.013099831300771487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=672ffed3-9846-47fa-a1ee-60ddb0278c61", 1, 0, 0.0, 1583.0, 1583, 1583, 1583.0, 1583.0, 1583.0, 1583.0, 0.6317119393556537, 0.11412764529374606, 0.435535770688566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe9f4134-8954-46d9-9faa-f7b95d22d172", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97ba8cd4-ff00-4df9-9400-e5e8143f9425", 3, 0, 0.0, 1114.0, 237, 2488, 617.0, 2488.0, 2488.0, 2488.0, 0.029930262488402023, 0.024951628330988795, 0.019193560254606765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 169.7142857142857, 144, 428, 147.0, 298.5, 428.0, 428.0, 0.06262188903401264, 0.05191990604480149, 0.02226012461755918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 162.9047619047619, 144, 422, 149.0, 159.0, 395.6999999999996, 422.0, 0.10315456483510006, 0.08008581937881304, 0.03666822421872697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ecc5e603-d7fd-4f0b-92ad-1817394e0d21", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 0.9647611404833837, 1.802657666163142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 161.68749999999997, 139, 423, 144.0, 234.0000000000002, 423.0, 423.0, 0.08101799105763924, 0.06020965936998385, 0.04066723379260407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 248.9375, 140, 430, 143.0, 430.0, 430.0, 430.0, 0.08090287609724525, 0.04443140131366045, 0.04486593824582339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 459.25, 140, 1548, 281.0, 1356.9, 1548.0, 1548.0, 0.08102045260050333, 13.686932817271028, 0.04632565917733858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 378.75000000000006, 139, 1265, 143.0, 1263.6, 1265.0, 1265.0, 0.08102004233297212, 4.484477145385402, 0.046404545730750146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/efe703a2-fcbd-4f1e-95bf-ba621b2c08be", 3, 0, 0.0, 329.6666666666667, 241, 483, 265.0, 483.0, 483.0, 483.0, 0.046605561597017245, 0.029962885466832373, 0.029887030060587228], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 42.857142857142854, 0.4807692307692308], "isController": false}, {"data": ["401/Unauthorized", 8, 57.142857142857146, 0.6410256410256411], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1248, 14, "401/Unauthorized", 8, "406/Not Acceptable", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
