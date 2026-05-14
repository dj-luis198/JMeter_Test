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

    var data = {"OkPercent": 98.49802371541502, "KoPercent": 1.5019762845849802};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7893847194050034, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4e89f8c9-2d3a-456a-b9de-48756280eb3f"], "isController": false}, {"data": [0.17307692307692307, 500, 1500, "see books"], "isController": true}, {"data": [0.7, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/41bac9ec-1b48-4e23-8502-340b24e4b58c"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/281fa00d-f166-4a3e-8a6d-0056d5466fff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4f0d5a05-5ccd-4fb3-8324-1725da177658"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8fb854eb-2c2e-4f69-bf64-fd4df22d22b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c55f9775-31de-409e-886a-5d179e39db17"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd0bc99c-d637-403c-934f-37e058f4575c"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf6064a8-7076-444c-a9d8-b88e99061361"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fbc2c5b9-f9bd-40b3-a5f8-0b19d170143f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81edb229-862e-4732-8838-ab07b1a73b98"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d9abb2a-ffe6-4734-880e-16b818e9c11f"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/73315eae-148e-4b9e-a390-4571c1560b70"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f4aa1934-ac56-4801-9eff-86579266e45d"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a35462fe-3973-4e4d-b1ba-186f192c1219"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4519230769230769, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fbc2c5b9-f9bd-40b3-a5f8-0b19d170143f"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41bac9ec-1b48-4e23-8502-340b24e4b58c"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8fb854eb-2c2e-4f69-bf64-fd4df22d22b7"], "isController": false}, {"data": [0.3135593220338983, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c55f9775-31de-409e-886a-5d179e39db17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e89f8c9-2d3a-456a-b9de-48756280eb3f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd0bc99c-d637-403c-934f-37e058f4575c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cf6064a8-7076-444c-a9d8-b88e99061361"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f0d5a05-5ccd-4fb3-8324-1725da177658"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d1e310d-33d0-4bfa-8180-9a09e272959a"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=281fa00d-f166-4a3e-8a6d-0056d5466fff"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9d9abb2a-ffe6-4734-880e-16b818e9c11f"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/81edb229-862e-4732-8838-ab07b1a73b98"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73315eae-148e-4b9e-a390-4571c1560b70"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4aa1934-ac56-4801-9eff-86579266e45d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1265, 19, 1.5019762845849802, 358.03873517786496, 95, 3419, 127.0, 967.4000000000001, 1246.2000000000003, 1759.8799999999974, 4.976494423572454, 680.9468947006727, 3.6358498151025787], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/4e89f8c9-2d3a-456a-b9de-48756280eb3f", 3, 0, 0.0, 364.0, 197, 682, 213.0, 682.0, 682.0, 682.0, 0.01753811617248153, 0.02417770898126929, 0.011246773717379104], "isController": false}, {"data": ["see books", 52, 0, 0.0, 1648.076923076923, 1167, 2200, 1658.0, 1975.9, 2113.1499999999996, 2200.0, 0.23277363211918012, 280.1045445974135, 1.1445461305860076], "isController": true}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 502.7333333333333, 104, 771, 455.0, 741.0, 771.0, 771.0, 0.08786574114752659, 0.016543471575432737, 0.05944094506926749], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 502.7333333333333, 104, 771, 455.0, 741.0, 771.0, 771.0, 0.08866348660294718, 0.016693672086961146, 0.0599806177923974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 130.00000000000003, 97, 294, 98.0, 288.6, 294.0, 294.0, 0.08951794586153564, 0.031422586248054225, 0.05063553079168677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 99.61111111111109, 97, 108, 99.0, 102.60000000000001, 108.0, 108.0, 0.08960038229496445, 0.06658778410787886, 0.04497519189415208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41bac9ec-1b48-4e23-8502-340b24e4b58c", 3, 0, 0.0, 364.3333333333333, 217, 457, 419.0, 457.0, 457.0, 457.0, 0.024764735017335313, 0.02927107840102361, 0.01588103124484068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 135.38888888888889, 95, 571, 99.0, 315.40000000000043, 571.0, 571.0, 0.08960573476702509, 1.4865354160444046, 0.05233807185882119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 183.38888888888889, 95, 1046, 98.5, 366.5000000000011, 1046.0, 1046.0, 0.08960573476702509, 4.5021096627961965, 0.05225056625846276], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 234.59999999999997, 99, 419, 217.0, 361.40000000000003, 419.0, 419.0, 0.08820105135653217, 0.19294554209836182, 0.05701485930462291], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 12, 0, 0.0, 101.0, 98, 106, 101.0, 105.4, 106.0, 106.0, 0.06394713703338574, 0.04752321414297514, 0.0320984652687112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 12, 0, 0.0, 114.91666666666667, 97, 287, 98.0, 234.2000000000002, 287.0, 287.0, 0.06394781858003869, 0.025114922889588765, 0.03602268881925682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 639.5, 568, 769, 583.5, 769.0, 769.0, 769.0, 0.09261831990367696, 27.232861269334077, 0.052821385570065764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1065.3333333333333, 865, 1278, 1073.0, 1278.0, 1278.0, 1278.0, 0.09188924283263906, 82.68210222486829, 0.05231584821428571], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 259.3333333333333, 99, 300, 289.5, 300.0, 300.0, 300.0, 0.09357892602585897, 0.16559083394419574, 0.05181567486002152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/281fa00d-f166-4a3e-8a6d-0056d5466fff", 3, 0, 0.0, 397.0, 305, 551, 335.0, 551.0, 551.0, 551.0, 0.024314729863351217, 0.024385964423497754, 0.015592453720964159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 180.16666666666669, 96, 304, 104.0, 300.7, 304.0, 304.0, 0.06124167495981015, 0.04551261195743704, 0.030740450126310957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 179.0, 96, 294, 103.0, 293.7, 294.0, 294.0, 0.061244175423733144, 0.01638760162705359, 0.03492831879634781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 130.5, 96, 296, 97.5, 293.90000000000003, 296.0, 296.0, 0.061185468451242835, 0.016491395793499043, 0.03597036328871893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 202.16666666666666, 95, 384, 196.0, 357.30000000000007, 384.0, 384.0, 0.061185468451242835, 0.016491395793499043, 0.036030114722753345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f0d5a05-5ccd-4fb3-8324-1725da177658", 3, 0, 0.0, 361.6666666666667, 189, 507, 389.0, 507.0, 507.0, 507.0, 0.0255271353448716, 0.025601921874202276, 0.01636994030904852], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8fb854eb-2c2e-4f69-bf64-fd4df22d22b7", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.3016094532554257, 1.1510068864774625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 98.66666666666667, 97, 101, 99.0, 101.0, 101.0, 101.0, 0.09357892602585897, 0.06954449482976434, 0.052546760219598546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 785.8125, 96, 1420, 1055.0, 1366.1000000000001, 1420.0, 1420.0, 0.07360721350692367, 41.40237735485577, 0.03931947830887427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 12, 0, 0.0, 195.58333333333331, 96, 1051, 100.0, 823.3000000000009, 1051.0, 1051.0, 0.0639467962655071, 4.810752662118451, 0.03713576970627105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 495.9375, 98, 890, 577.0, 866.9, 890.0, 890.0, 0.073606874882114, 13.534230503379016, 0.03939117913613131], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c55f9775-31de-409e-886a-5d179e39db17", 3, 0, 0.0, 749.6666666666666, 230, 1580, 439.0, 1580.0, 1580.0, 1580.0, 0.019247549145408816, 0.02653430033554894, 0.0123429921277524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 12, 0, 0.0, 171.75, 96, 778, 98.5, 632.2000000000005, 778.0, 778.0, 0.06394713703338574, 1.5826812335136287, 0.0371984159761264], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 520.4285714285716, 101, 1260, 471.0, 1030.5, 1260.0, 1260.0, 0.08788118463836891, 0.016594194113843795, 0.06014245971589268], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fd0bc99c-d637-403c-934f-37e058f4575c", 3, 0, 0.0, 306.0, 195, 400, 323.0, 400.0, 400.0, 400.0, 0.051036031438195364, 0.03234607851893437, 0.032728184223061486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 400.1666666666667, 197, 689, 390.0, 659.3000000000001, 689.0, 689.0, 0.061151482413852855, 0.09477285409256296, 0.1375311171866241], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf6064a8-7076-444c-a9d8-b88e99061361", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 692.9523809523808, 145, 1817, 678.0, 1325.8, 1768.1999999999994, 1817.0, 0.09435530613803733, 0.05795848394611863, 0.042662604240147735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 99.25000000000001, 97, 106, 99.0, 102.5, 106.0, 106.0, 0.07360619764184144, 0.05470148086468881, 0.036946860925689946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 177.9375, 95, 392, 99.5, 326.9000000000001, 392.0, 392.0, 0.0736078907658901, 0.08879311237164625, 0.03811580476427073], "isController": false}, {"data": ["login", 21, 0, 0.0, 3046.095238095238, 1622, 5253, 3085.0, 5095.8, 5251.0, 5253.0, 0.09402157123477185, 32.26571629326671, 0.18640353638634807], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 12, 0, 0.0, 120.83333333333334, 99, 310, 101.0, 252.1000000000002, 310.0, 310.0, 0.0642687289787699, 0.05203005500332055, 0.02284552475417211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fbc2c5b9-f9bd-40b3-a5f8-0b19d170143f", 3, 0, 0.0, 276.0, 187, 446, 195.0, 446.0, 446.0, 446.0, 0.02973093503790694, 0.02981803738665081, 0.01906573633615777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81edb229-862e-4732-8838-ab07b1a73b98", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 887.2499999999999, 196, 1520, 1156.5, 1465.4, 1520.0, 1520.0, 0.07357268981753973, 55.05433062934539, 0.15370153973844908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d9abb2a-ffe6-4734-880e-16b818e9c11f", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 316.6111111111111, 195, 1147, 204.5, 469.3000000000011, 1147.0, 1147.0, 0.08946900147623851, 6.077402297054482, 0.19994613220536117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 897.75, 96, 1375, 1104.0, 1375.0, 1375.0, 1375.0, 0.12233351173637129, 109.77324097790351, 0.22715027429467086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73315eae-148e-4b9e-a390-4571c1560b70", 3, 0, 0.0, 1149.3333333333333, 199, 2263, 986.0, 2263.0, 2263.0, 2263.0, 0.028912875867386275, 0.02410347496626831, 0.018541134589437163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4aa1934-ac56-4801-9eff-86579266e45d", 3, 0, 0.0, 495.0, 194, 685, 606.0, 685.0, 685.0, 685.0, 0.035821750967187274, 0.029863119865549025, 0.022971630665806944], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1128.0833333333333, 134, 2618, 1014.0, 2219.0, 2583.25, 2618.0, 0.09567127350423944, 0.030037416437122048, 0.04316418785054552], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a35462fe-3973-4e4d-b1ba-186f192c1219", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 12, 0, 0.0, 328.33333333333337, 197, 1149, 203.0, 923.7000000000008, 1149.0, 1149.0, 0.06391273780864527, 6.462619079084024, 0.142378522523914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 102.05555555555556, 98, 107, 102.0, 106.1, 107.0, 107.0, 0.12302140572459608, 0.09550978276470105, 0.043730265316165015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 324.99999999999994, 196, 594, 387.5, 495.0, 594.0, 594.0, 0.08708417307357369, 0.13496345963648576, 0.19585434627777362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 127.93333333333332, 96, 319, 99.0, 302.8, 319.0, 319.0, 0.07276643429918647, 0.054077398927422755, 0.036525339091583835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 124.53333333333332, 95, 290, 100.0, 288.2, 290.0, 290.0, 0.0727685523424197, 0.01947127279474902, 0.04150081500778623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 137.26666666666665, 96, 293, 100.0, 291.2, 293.0, 293.0, 0.07276925838423139, 0.019613589173874867, 0.04278036479229228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 111.99999999999999, 96, 289, 99.0, 177.40000000000006, 289.0, 289.0, 0.07276784631430858, 0.019613208576903487, 0.04285059699953914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 2.9200185643564356, 6.120436262376237], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1120.5384615384617, 762, 1781, 1051.0, 1545.0000000000002, 1686.5999999999995, 1781.0, 0.23485840747933698, 280.9723053385123, 0.4637536132062689], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1128.0833333333333, 134, 2618, 1014.0, 2219.0, 2583.25, 2618.0, 0.09441570447884498, 0.02964321190424674, 0.042597710419166386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 130.33333333333334, 97, 289, 98.5, 289.0, 289.0, 289.0, 0.043099732781656755, 0.011616724851305923, 0.025380018425135768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 131.33333333333334, 97, 292, 100.0, 292.0, 292.0, 292.0, 0.043100042381708344, 0.011616808298194826, 0.025338110853309004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 209.94444444444443, 96, 1143, 98.5, 888.3000000000004, 1143.0, 1143.0, 0.12012012012012012, 12.038144915749083, 0.06947051217884552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 195.44444444444443, 97, 768, 99.0, 766.2, 768.0, 768.0, 0.11996720896288349, 3.9481135572943398, 0.06949923270972601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 110.1111111111111, 97, 287, 100.0, 125.90000000000026, 287.0, 287.0, 0.12011771536105383, 0.08926716932593942, 0.06029346259334147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 130.16666666666666, 95, 289, 99.0, 289.0, 289.0, 289.0, 0.043099732781656755, 0.011532545685716749, 0.02458031635203862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 143.27777777777777, 96, 302, 99.0, 293.90000000000003, 302.0, 302.0, 0.11996720896288349, 0.05212117021347498, 0.0672993131877287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 132.66666666666666, 99, 298, 99.5, 298.0, 298.0, 298.0, 0.04310035198620789, 0.0320306326772502, 0.021634356368077003], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fbc2c5b9-f9bd-40b3-a5f8-0b19d170143f", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 499.7142857142857, 96, 986, 451.5, 834.0, 986.0, 986.0, 0.08723230586138786, 0.016301293764136304, 0.05936981084609105], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 170.83333333333334, 101, 303, 108.0, 303.0, 303.0, 303.0, 0.04351168288685512, 0.03424845352227073, 0.01546704352618678], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1574.6190476190475, 1013, 3419, 1430.0, 2125.4, 3294.199999999998, 3419.0, 0.093488316186389, 0.04838750740115836, 0.0430009735583879], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41bac9ec-1b48-4e23-8502-340b24e4b58c", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 296.8333333333333, 197, 587, 202.5, 587.0, 587.0, 587.0, 0.0430684860709338, 0.06674774159626166, 0.0968620345911724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fb854eb-2c2e-4f69-bf64-fd4df22d22b7", 3, 0, 0.0, 349.6666666666667, 310, 409, 330.0, 409.0, 409.0, 409.0, 0.020196987955862847, 0.023872156011633464, 0.012951844489925068], "isController": false}, {"data": ["addBook", 59, 8, 13.559322033898304, 985.4067796610171, 500, 1997, 821.0, 1770.0, 1878.0, 1997.0, 0.2795784525569582, 80.44970390302181, 1.0180809367773607], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c55f9775-31de-409e-886a-5d179e39db17", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 182.07692307692312, 98, 422, 101.0, 394.0, 412.2499999999999, 422.0, 0.23577420086148265, 0.17521891294491043, 0.11397288029925186], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 619.0576923076924, 474, 875, 578.5, 796.6, 860.7, 875.0, 0.23556485734735852, 69.2638895495275, 0.11847256009168909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e89f8c9-2d3a-456a-b9de-48756280eb3f", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 167.1346153846154, 96, 400, 104.0, 295.4, 303.9999999999999, 400.0, 0.23612965334350508, 0.4178388006429992, 0.11483649156744681], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 936.8846153846154, 661, 1357, 891.5, 1219.0000000000002, 1306.8999999999996, 1357.0, 0.23532712733460348, 211.74776283664224, 0.11812318696287714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 117.71428571428571, 99, 294, 102.0, 211.5, 294.0, 294.0, 0.08859525888800295, 0.06618688774347876, 0.03149284593284479], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 8, 4.705882352941177, 162.57647058823528, 97, 895, 106.5, 292.9, 328.9, 569.8199999999963, 0.7439792386028945, 1.5497273876810167, 0.3603264796981195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 116.93333333333334, 98, 293, 102.0, 188.60000000000008, 293.0, 293.0, 0.07406785603183931, 0.0573591892902818, 0.026328808198817878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd0bc99c-d637-403c-934f-37e058f4575c", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf6064a8-7076-444c-a9d8-b88e99061361", 3, 0, 0.0, 274.6666666666667, 187, 438, 199.0, 438.0, 438.0, 438.0, 0.05327555894940598, 0.044101479950631316, 0.034164339560654226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f0d5a05-5ccd-4fb3-8324-1725da177658", 1, 0, 0.0, 801.0, 801, 801, 801.0, 801.0, 801.0, 801.0, 1.2484394506866416, 0.2255481429463171, 0.8607404806491885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 114.22222222222224, 98, 303, 103.0, 130.20000000000027, 303.0, 303.0, 0.09021742399182028, 0.07321355404023697, 0.03206947493459237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d1e310d-33d0-4bfa-8180-9a09e272959a", 2, 0, 0.0, 246.0, 217, 275, 246.0, 275.0, 275.0, 275.0, 0.030008402352658742, 0.034550689818149086, 0.018652683688932904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 267.6, 197, 613, 202.0, 595.0, 613.0, 613.0, 0.07273044641948012, 0.11271798678487788, 0.16357247861724875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=281fa00d-f166-4a3e-8a6d-0056d5466fff", 1, 0, 0.0, 697.0, 697, 697, 697.0, 697.0, 697.0, 697.0, 1.4347202295552368, 0.25920238522238165, 0.9891723457675754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d9abb2a-ffe6-4734-880e-16b818e9c11f", 3, 0, 0.0, 402.0, 229, 550, 427.0, 550.0, 550.0, 550.0, 0.04654843364520784, 0.029926157698335117, 0.02985039527378237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 344.44444444444446, 196, 1241, 201.0, 988.1000000000004, 1241.0, 1241.0, 0.11988730593242351, 16.101479192892015, 0.2662211063267196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81edb229-862e-4732-8838-ab07b1a73b98", 3, 0, 0.0, 830.3333333333334, 218, 1721, 552.0, 1721.0, 1721.0, 1721.0, 0.05434684154272567, 0.024590530515751528, 0.03485132742160468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 107.33333333333334, 98, 133, 102.5, 130.0, 133.0, 133.0, 0.06312832410081594, 0.052339792149992896, 0.022440146457711915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 105.8125, 99, 124, 103.0, 119.10000000000001, 124.0, 124.0, 0.07474679523115446, 0.0580309591882498, 0.026570149867324436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73315eae-148e-4b9e-a390-4571c1560b70", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4aa1934-ac56-4801-9eff-86579266e45d", 1, 0, 0.0, 1260.0, 1260, 1260, 1260.0, 1260.0, 1260.0, 1260.0, 0.7936507936507936, 0.1433841765873016, 0.5471850198412699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 114.57142857142857, 97, 300, 99.5, 202.0, 300.0, 300.0, 0.08713674867894465, 0.06475690014128602, 0.04373856330173589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 125.57142857142856, 95, 293, 97.0, 291.0, 293.0, 293.0, 0.08714054525084028, 0.0233169037096975, 0.04969734221336985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 194.78571428571433, 97, 293, 195.0, 292.0, 293.0, 293.0, 0.08714054525084028, 0.023487100087140545, 0.05122910961035728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 179.7142857142857, 96, 291, 100.5, 290.5, 291.0, 291.0, 0.08714108764526109, 0.023487246279386777, 0.051314527197355894], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 36.8421052631579, 0.5533596837944664], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.07905138339920949], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.07905138339920949], "isController": false}, {"data": ["401/Unauthorized", 10, 52.63157894736842, 0.7905138339920948], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1265, 19, "401/Unauthorized", 10, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
