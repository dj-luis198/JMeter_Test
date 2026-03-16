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

    var data = {"OkPercent": 98.20493642483171, "KoPercent": 1.7950635751682873};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7626198083067093, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/74be22e6-57d8-478b-ba49-a144a5d107ed"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c2be69ea-1ea8-4348-9eab-7df9e1318e9d"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.59375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b9c0026-240e-4353-ad03-d02d4190eaa0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/274ab1ee-e575-4a1f-9e37-32b554784d2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea402d00-5bd4-488b-aa87-53264c6ecdff"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/64ba74ef-6ac2-47c7-ba17-8e14a1c171fa"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3c5f191-e875-4fdc-9c9e-e1b13a1c1262"], "isController": false}, {"data": [0.8260869565217391, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4772c719-095b-4491-84b9-821974f44f8f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fdd82da7-6b05-4e2f-8ebe-c79468b9eae4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/17a80b4f-f887-433a-98fe-aec4e8ebbde9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=536c2dcf-20a6-46fa-a82e-b3200602c58b"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9dd6aba8-9f22-4416-b724-57acb9695313"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/62c2bf71-22b9-469e-95e6-94e540761ce5"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e4fd5d1-b729-411d-b883-4cad03efe57a"], "isController": false}, {"data": [0.32, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ea402d00-5bd4-488b-aa87-53264c6ecdff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34bb1672-7d8c-498a-8556-fdc48ce0bf1a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a673903-9562-49ac-8ff9-b9cb5cc09c62"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b9c0026-240e-4353-ad03-d02d4190eaa0"], "isController": false}, {"data": [0.3114754098360656, 500, 1500, "addBook"], "isController": true}, {"data": [0.9017857142857143, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74be22e6-57d8-478b-ba49-a144a5d107ed"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64ba74ef-6ac2-47c7-ba17-8e14a1c171fa"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3c5f191-e875-4fdc-9c9e-e1b13a1c1262"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9578651685393258, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62c2bf71-22b9-469e-95e6-94e540761ce5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=274ab1ee-e575-4a1f-9e37-32b554784d2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a4df6d64-d7b0-46f3-80ed-9e9a77eb802f"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a673903-9562-49ac-8ff9-b9cb5cc09c62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8ae4cc3f-9454-454f-a50b-c16186eebabc"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/536c2dcf-20a6-46fa-a82e-b3200602c58b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fdd82da7-6b05-4e2f-8ebe-c79468b9eae4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2be69ea-1ea8-4348-9eab-7df9e1318e9d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9e4fd5d1-b729-411d-b883-4cad03efe57a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1337, 24, 1.7950635751682873, 398.2916978309651, 126, 2089, 148.0, 1042.2, 1193.1999999999998, 1689.0, 5.234515699631978, 724.7054445557807, 3.8149290567986065], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1947.1785714285716, 1568, 2463, 2026.5, 2279.8, 2390.35, 2463.0, 0.24700179517376136, 297.2257577110873, 1.2145058971678597], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/74be22e6-57d8-478b-ba49-a144a5d107ed", 3, 0, 0.0, 343.3333333333333, 246, 476, 308.0, 476.0, 476.0, 476.0, 0.01755073625338583, 0.02419510678160449, 0.011254866672906929], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2be69ea-1ea8-4348-9eab-7df9e1318e9d", 3, 0, 0.0, 602.3333333333333, 220, 1251, 336.0, 1251.0, 1251.0, 1251.0, 0.09815469179426776, 0.04345390001308729, 0.06294425222483968], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 531.6875000000001, 140, 1816, 464.5, 1043.9000000000008, 1816.0, 1816.0, 0.0856091088091773, 0.017300522416210086, 0.05741934183984677], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 531.6875000000001, 140, 1816, 464.5, 1043.9000000000008, 1816.0, 1816.0, 0.08341675008341676, 0.016857474336315483, 0.05594889322916667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 203.7777777777778, 127, 403, 132.0, 394.0, 403.0, 403.0, 0.10397292083039707, 0.03649657105971511, 0.058811939701482185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 163.66666666666666, 130, 392, 135.5, 387.5, 392.0, 392.0, 0.10397292083039707, 0.07726893823430875, 0.0521895325261954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b9c0026-240e-4353-ad03-d02d4190eaa0", 3, 0, 0.0, 390.6666666666667, 302, 463, 407.0, 463.0, 463.0, 463.0, 0.04515012416284145, 0.03696372469711792, 0.02895369290390549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 246.38888888888889, 127, 913, 134.0, 444.10000000000076, 913.0, 913.0, 0.10397472258966375, 1.7249131197326695, 0.060730895366770836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 220.16666666666663, 130, 900, 132.5, 463.5000000000007, 900.0, 900.0, 0.10396931749919135, 5.223786961453376, 0.060626205755279335], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 264.2941176470589, 136, 755, 229.0, 436.5999999999997, 755.0, 755.0, 0.08735195128844128, 0.17727809553477378, 0.05645661787375074], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/274ab1ee-e575-4a1f-9e37-32b554784d2a", 3, 0, 0.0, 410.6666666666667, 297, 572, 363.0, 572.0, 572.0, 572.0, 0.021167754454048334, 0.025019569147997883, 0.013574373787264069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 188.9473684210526, 129, 407, 135.0, 405.0, 407.0, 407.0, 0.10569530824089629, 0.07854895465949421, 0.05305409026935615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 848.2, 645, 1028, 945.0, 1028.0, 1028.0, 1028.0, 0.022904365113903407, 6.734643839985524, 0.013062645729023038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 188.47368421052633, 127, 408, 131.0, 408.0, 408.0, 408.0, 0.10553327630833491, 0.03658081904931181, 0.05972046526288894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1035.6, 879, 1299, 942.0, 1299.0, 1299.0, 1299.0, 0.022854008593107232, 20.564077105139866, 0.013011608407989761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 290.0, 130, 402, 387.0, 402.0, 402.0, 402.0, 0.02296169071521074, 0.04063142927340026, 0.012714139292504386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 157.16666666666669, 130, 408, 135.5, 326.7000000000003, 408.0, 408.0, 0.06605165239217067, 0.04908721432660341, 0.0331548333296638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 198.66666666666669, 129, 408, 134.5, 404.40000000000003, 408.0, 408.0, 0.0659576222277187, 0.03415969302223321, 0.03669322148019897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 351.5, 132, 1171, 138.5, 1167.1, 1171.0, 1171.0, 0.06605201596257053, 9.920455913719554, 0.03788530342644832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 296.5, 130, 1048, 137.5, 928.3000000000004, 1048.0, 1048.0, 0.0659536345948798, 3.246906877590054, 0.03789328289712332], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 184.6, 129, 390, 135.0, 390.0, 390.0, 390.0, 0.02296137437602465, 0.01706406826186988, 0.01289334986934978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea402d00-5bd4-488b-aa87-53264c6ecdff", 1, 0, 0.0, 748.0, 748, 748, 748.0, 748.0, 748.0, 748.0, 1.3368983957219251, 0.2415294953208556, 0.9217287767379679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 883.3333333333334, 130, 1353, 1152.5, 1312.5000000000002, 1353.0, 1353.0, 0.08276033297240631, 55.856496438288374, 0.043319861790243934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 229.68421052631575, 128, 946, 131.0, 400.0, 946.0, 946.0, 0.10554265589761251, 5.025237583809202, 0.06157016572974414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 677.1666666666666, 135, 973, 882.0, 965.8000000000001, 973.0, 973.0, 0.08275919144269961, 18.256039158028678, 0.043400083793681335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 266.10526315789474, 127, 957, 135.0, 524.0, 957.0, 957.0, 0.10569354434956749, 1.662641591105054, 0.061761405515534176], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 441.53333333333336, 138, 748, 468.0, 732.4, 748.0, 748.0, 0.08363115316209391, 0.017020246405254267, 0.05646736259401535], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 532.3333333333334, 268, 1304, 276.5, 1300.1, 1304.0, 1304.0, 0.06590545861961017, 13.226090649525755, 0.14541249951943935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64ba74ef-6ac2-47c7-ba17-8e14a1c171fa", 3, 0, 0.0, 554.0, 229, 1004, 429.0, 1004.0, 1004.0, 1004.0, 0.02191652725320164, 0.02590459324751795, 0.014054543844012769], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3c5f191-e875-4fdc-9c9e-e1b13a1c1262", 3, 0, 0.0, 489.33333333333337, 228, 948, 292.0, 948.0, 948.0, 948.0, 0.046292724326826636, 0.03030425410847928, 0.029686415014273587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 476.39130434782606, 158, 1152, 440.0, 942.4000000000003, 1131.5999999999997, 1152.0, 0.10003044404818857, 0.06144448174444396, 0.04522860897881964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 133.58333333333334, 131, 139, 132.5, 138.4, 139.0, 139.0, 0.08275862068965517, 0.06150323275862069, 0.04154094827586207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 217.49999999999997, 130, 394, 135.5, 391.90000000000003, 394.0, 394.0, 0.08276033297240631, 0.11537146027159181, 0.041986321268715904], "isController": false}, {"data": ["login", 23, 0, 0.0, 2333.4782608695655, 1644, 3106, 2269.0, 3080.6, 3101.4, 3106.0, 0.09657819264410096, 25.25107623667326, 0.18053052526989405], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 153.15789473684214, 131, 394, 141.0, 154.0, 394.0, 394.0, 0.1037672991010475, 0.084006924760516, 0.03688603210232548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4772c719-095b-4491-84b9-821974f44f8f", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 1.0470030737704918, 1.9563268442622952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fdd82da7-6b05-4e2f-8ebe-c79468b9eae4", 3, 0, 0.0, 343.6666666666667, 211, 432, 388.0, 432.0, 432.0, 432.0, 0.06426459877468832, 0.041315944850263485, 0.04121134752152864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17a80b4f-f887-433a-98fe-aec4e8ebbde9", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=536c2dcf-20a6-46fa-a82e-b3200602c58b", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 1021.25, 271, 1484, 1284.5, 1443.8000000000002, 1484.0, 1484.0, 0.08268164123057843, 74.21902587461675, 0.1700867941916147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9dd6aba8-9f22-4416-b724-57acb9695313", 2, 0, 0.0, 295.0, 233, 357, 295.0, 357.0, 357.0, 357.0, 0.0447127207690588, 0.039472948803934725, 0.02779262379834563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62c2bf71-22b9-469e-95e6-94e540761ce5", 3, 0, 0.0, 314.6666666666667, 238, 453, 253.0, 453.0, 453.0, 453.0, 0.04041764904008084, 0.033694530986864264, 0.02591886998989559], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, 54.54545454545455, 647.1818181818182, 132, 1433, 137.0, 1413.6000000000001, 1433.0, 1433.0, 0.04874633294631699, 26.515096960887718, 0.06758014340284857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 472.11111111111114, 261, 1043, 529.0, 809.0000000000003, 1043.0, 1043.0, 0.10389010735311094, 7.056991434477087, 0.2321745498095348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e4fd5d1-b729-411d-b883-4cad03efe57a", 1, 0, 0.0, 722.0, 722, 722, 722.0, 722.0, 722.0, 722.0, 1.3850415512465375, 0.25022723337950137, 0.9549212257617729], "isController": false}, {"data": ["register", 25, 7, 28.0, 1006.92, 283, 1741, 1091.0, 1514.6000000000001, 1690.8999999999999, 1741.0, 0.09818283214270285, 0.03086622785486221, 0.04429733247063351], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 153.35294117647058, 132, 406, 137.0, 200.3999999999998, 406.0, 406.0, 0.08099557859429792, 0.06288230955319027, 0.028791397078441836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 486.94736842105266, 262, 1094, 274.0, 816.0, 1094.0, 1094.0, 0.10545537295125187, 6.794901180683906, 0.23575151349273746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 440.49999999999994, 266, 1558, 274.5, 1007.9000000000011, 1533.0999999999997, 1558.0, 0.1477716042085353, 17.88473664791199, 0.3285609262324152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea402d00-5bd4-488b-aa87-53264c6ecdff", 3, 0, 0.0, 432.3333333333333, 225, 622, 450.0, 622.0, 622.0, 622.0, 0.01748567631681714, 0.02410541640681009, 0.011213145294313076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 131.63636363636363, 128, 136, 132.0, 135.4, 136.0, 136.0, 0.06777906489537378, 0.05037096522009711, 0.03402191343381066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 180.0, 126, 400, 132.0, 397.8, 400.0, 400.0, 0.06778031782807215, 0.027391335826827453, 0.03813846363585949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 250.2727272727273, 130, 1170, 132.0, 1013.4000000000005, 1170.0, 1170.0, 0.0677794825344597, 5.560980401331559, 0.03931739514205963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 141.33333333333334, 138, 147, 139.0, 147.0, 147.0, 147.0, 0.017090608710513572, 0.005040394365795995, 0.010564800111088957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 252.1818181818182, 130, 644, 133.0, 596.6000000000001, 644.0, 644.0, 0.0677794825344597, 1.8283732038437128, 0.03938358604297219], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1243.3392857142862, 1027, 1895, 1073.0, 1711.8000000000002, 1823.0, 1895.0, 0.25033750860535187, 299.4906916914769, 0.49431879140627094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 1006.92, 283, 1741, 1091.0, 1514.6000000000001, 1690.8999999999999, 1741.0, 0.09787800485474904, 0.03077039777621173, 0.04415980297157623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 168.875, 129, 414, 134.0, 414.0, 414.0, 414.0, 0.03805736195881242, 0.01025764834046116, 0.02241073170035536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 167.375, 127, 409, 134.0, 409.0, 409.0, 409.0, 0.03805718091432377, 0.010257599543313829, 0.022373459873459872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 162.70588235294122, 129, 405, 132.0, 384.2, 405.0, 405.0, 0.08279314862344214, 0.022315340839912143, 0.0486733158899533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 207.2941176470588, 126, 392, 133.0, 392.0, 392.0, 392.0, 0.08289407599923933, 0.022342543921669976, 0.04881360139408331], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 199.25, 129, 409, 132.0, 409.0, 409.0, 409.0, 0.038056818830513955, 0.010183172226133618, 0.021704279489277493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 165.6470588235294, 130, 410, 134.0, 394.0, 410.0, 410.0, 0.08289286341206531, 0.061602997125568056, 0.04160833182988434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 131.375, 127, 134, 131.0, 134.0, 134.0, 134.0, 0.03805754300502359, 0.028282998268381793, 0.019103102641193484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 164.11764705882354, 128, 408, 134.0, 388.79999999999995, 408.0, 408.0, 0.0827907293863259, 0.022152988136575485, 0.04721658785313899], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 141.625, 132, 163, 138.5, 163.0, 163.0, 163.0, 0.037534895723367816, 0.029544068313510218, 0.013342482464165905], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 476.86666666666673, 132, 1251, 432.0, 1069.2, 1251.0, 1251.0, 0.08545645139237046, 0.016924383146848368, 0.05815044465840208], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1287.9565217391305, 826, 2089, 1239.0, 1669.8000000000002, 2013.399999999999, 2089.0, 0.09724706250449239, 0.05033295227283298, 0.044729850038687416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 336.87500000000006, 264, 546, 269.5, 546.0, 546.0, 546.0, 0.03803347896986322, 0.05894446398942669, 0.08553818561288574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34bb1672-7d8c-498a-8556-fdc48ce0bf1a", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.6808868603411514, 1.2722381396588487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a673903-9562-49ac-8ff9-b9cb5cc09c62", 3, 0, 0.0, 312.6666666666667, 234, 417, 287.0, 417.0, 417.0, 417.0, 0.032717873774442977, 0.027275545161571768, 0.020981188585824435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b9c0026-240e-4353-ad03-d02d4190eaa0", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["addBook", 61, 5, 8.19672131147541, 1208.1803278688524, 678, 2211, 1052.0, 1872.6000000000001, 2052.6, 2211.0, 0.27604308082179385, 87.68713249643633, 1.003877790128066], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 238.67857142857153, 130, 649, 138.0, 526.3, 544.45, 649.0, 0.2513972750331081, 0.18682942021503446, 0.12152504994276223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74be22e6-57d8-478b-ba49-a144a5d107ed", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.29812551567656764, 1.1377114273927393], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 760.8214285714282, 627, 1091, 675.0, 963.9000000000002, 1082.3, 1091.0, 0.2512596634017866, 73.87868364613665, 0.12636594399601572], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 180.19642857142853, 129, 540, 137.0, 391.20000000000005, 405.75, 540.0, 0.25187217487125285, 0.4456956844401466, 0.12249252254480851], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64ba74ef-6ac2-47c7-ba17-8e14a1c171fa", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3c5f191-e875-4fdc-9c9e-e1b13a1c1262", 1, 0, 0.0, 640.0, 640, 640, 640.0, 640.0, 640.0, 640.0, 1.5625, 0.28228759765625, 1.0772705078125], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1003.1785714285713, 889, 1367, 923.5, 1233.4, 1284.0, 1367.0, 0.2509578973313316, 225.81235715566112, 0.12596910080889107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 138.9, 131, 153, 139.5, 148.4, 152.8, 153.0, 0.14308096236255283, 0.10689153926499309, 0.050860810839813704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 5, 2.808988764044944, 203.02808988764053, 130, 1192, 142.0, 354.69999999999993, 400.3499999999999, 924.9800000000027, 0.7466881444380123, 1.5859052846538808, 0.3606693162559882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 164.36363636363637, 131, 394, 139.0, 351.8000000000002, 394.0, 394.0, 0.0674350171652771, 0.052222625597719466, 0.023971041257969592], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62c2bf71-22b9-469e-95e6-94e540761ce5", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 138.66666666666666, 131, 150, 139.5, 149.1, 150.0, 150.0, 0.1067463706233988, 0.08662718162894961, 0.03794499893253629], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=274ab1ee-e575-4a1f-9e37-32b554784d2a", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4df6d64-d7b0-46f3-80ed-9e9a77eb802f", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 1.4581549657534247, 2.724564783105023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 456.45454545454544, 262, 1302, 278.0, 1149.2000000000005, 1302.0, 1302.0, 0.06772398167758459, 7.461001472227011, 0.1507375661078412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a673903-9562-49ac-8ff9-b9cb5cc09c62", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ae4cc3f-9454-454f-a50b-c16186eebabc", 2, 0, 0.0, 404.0, 330, 478, 404.0, 478.0, 478.0, 478.0, 0.017970905104635594, 0.02558748011968623, 0.011170391698340387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 407.82352941176475, 263, 816, 276.0, 783.1999999999999, 816.0, 816.0, 0.08273754191629881, 0.12822703029410762, 0.1860786709308947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/536c2dcf-20a6-46fa-a82e-b3200602c58b", 3, 0, 0.0, 489.6666666666667, 289, 755, 425.0, 755.0, 755.0, 755.0, 0.023967212852817346, 0.028328434202011647, 0.015369599388037164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fdd82da7-6b05-4e2f-8ebe-c79468b9eae4", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 143.75, 133, 176, 139.5, 169.40000000000003, 176.0, 176.0, 0.06525888744473388, 0.054106245547440486, 0.023197495146370244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 138.83333333333334, 132, 148, 138.5, 146.8, 148.0, 148.0, 0.0806771502141306, 0.06263509220725959, 0.028678205740179236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2be69ea-1ea8-4348-9eab-7df9e1318e9d", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 0.8065359933035714, 3.077915736607143], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e4fd5d1-b729-411d-b883-4cad03efe57a", 3, 0, 0.0, 320.6666666666667, 211, 432, 319.0, 432.0, 432.0, 432.0, 0.017818006877750654, 0.02456356091382618, 0.011426260920953382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 148.35, 130, 401, 135.5, 140.9, 387.99999999999983, 401.0, 0.1479213354338163, 0.10992982057142012, 0.07424957657517732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 212.24999999999997, 129, 408, 135.0, 403.9, 407.8, 408.0, 0.1479169594189822, 0.061795776601016185, 0.08311661957976792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 262.35, 129, 1157, 134.5, 861.100000000001, 1144.7499999999998, 1157.0, 0.1479235235383307, 13.346067661144188, 0.0856916349247439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 244.49999999999994, 128, 928, 134.5, 758.4000000000009, 921.55, 928.0, 0.14791914739403442, 4.385196020605137, 0.08583355213040551], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 29.166666666666668, 0.5235602094240838], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 12.5, 0.2243829468960359], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 12.5, 0.2243829468960359], "isController": false}, {"data": ["401/Unauthorized", 11, 45.833333333333336, 0.8227374719521316], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1337, 24, "401/Unauthorized", 11, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
