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

    var data = {"OkPercent": 98.17629179331307, "KoPercent": 1.8237082066869301};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8164598301763554, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/343df481-85f3-4c66-aec2-bf792ed250fe"], "isController": false}, {"data": [0.3508771929824561, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e73c4de-3e82-450a-86ef-c3840f53612a"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4323a637-a4e6-4764-828f-47720e9efa11"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab3a4bbe-e2ae-498d-8297-b27972862e0f"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7e1d11d7-b478-4cec-989d-ae67162ee481"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6897f894-f2be-4c1d-916b-937f37472f96"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35c78e51-dded-498f-b85a-fb17dd0c4d4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/64dd1bd3-33eb-4630-b00e-7ce2e804e604"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf46d95c-1370-4999-ac17-4b5395f0e4f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d1044097-36a6-4c88-8932-abb1608fdb8d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab3a4bbe-e2ae-498d-8297-b27972862e0f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e97c63f2-0903-41b4-a6d6-c8ef4713bf8c"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=343df481-85f3-4c66-aec2-bf792ed250fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c79113c6-229b-423f-8f27-753e23b7f015"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2df71189-b393-4324-8968-3d894976b4a5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9d3fb3c3-db70-4202-9c2f-48fc809d2835"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7b860111-7021-44c5-bc51-b05abf01f9e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4323a637-a4e6-4764-828f-47720e9efa11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e73c4de-3e82-450a-86ef-c3840f53612a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4318181818181818, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/35c78e51-dded-498f-b85a-fb17dd0c4d4d"], "isController": false}, {"data": [0.3275862068965517, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ca6bb74f-65db-4bd2-a5c4-e9593ba2f5e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e1d11d7-b478-4cec-989d-ae67162ee481"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8959537572254336, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1044097-36a6-4c88-8932-abb1608fdb8d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e97c63f2-0903-41b4-a6d6-c8ef4713bf8c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c79113c6-229b-423f-8f27-753e23b7f015"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6897f894-f2be-4c1d-916b-937f37472f96"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d3fb3c3-db70-4202-9c2f-48fc809d2835"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2df71189-b393-4324-8968-3d894976b4a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b860111-7021-44c5-bc51-b05abf01f9e9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bf46d95c-1370-4999-ac17-4b5395f0e4f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1316, 24, 1.8237082066869301, 308.1481762917934, 81, 1792, 97.0, 852.7999999999997, 1055.5999999999995, 1436.3199999999997, 5.141147147757194, 741.7914674988964, 3.756717753805074], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/343df481-85f3-4c66-aec2-bf792ed250fe", 3, 0, 0.0, 547.3333333333334, 201, 1035, 406.0, 1035.0, 1035.0, 1035.0, 0.07355465110577158, 0.033281564139655766, 0.04716883550728191], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1405.315789473684, 1011, 1975, 1412.0, 1745.2, 1812.3, 1975.0, 0.264981939388868, 318.8623403934168, 1.3029141258036623], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e73c4de-3e82-450a-86ef-c3840f53612a", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 531.2142857142858, 373, 1263, 449.5, 959.5, 1263.0, 1263.0, 0.07270121359097258, 0.013134496596025322, 0.04941410611261418], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 531.2142857142858, 373, 1263, 449.5, 959.5, 1263.0, 1263.0, 0.07294212042744083, 0.013178019803785697, 0.04957784747802619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 146.84615384615387, 82, 252, 84.0, 250.8, 252.0, 252.0, 0.09779068280463679, 0.03746487998074276, 0.05513948806577551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 97.15384615384616, 83, 247, 85.0, 182.59999999999994, 247.0, 247.0, 0.09778921159328714, 0.07267342775633938, 0.04908560035053672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 165.15384615384616, 82, 654, 84.0, 491.59999999999985, 654.0, 654.0, 0.0977914184269122, 2.2361706243982065, 0.05693969983676355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 202.46153846153845, 82, 974, 84.0, 685.5999999999997, 974.0, 974.0, 0.097792154060255, 6.793065278613608, 0.056844628013690904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4323a637-a4e6-4764-828f-47720e9efa11", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab3a4bbe-e2ae-498d-8297-b27972862e0f", 1, 0, 0.0, 880.0, 880, 880, 880.0, 880.0, 880.0, 880.0, 1.1363636363636362, 0.20530007102272727, 0.7834694602272727], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 195.14285714285717, 166, 339, 184.5, 270.5, 339.0, 339.0, 0.07253171967526513, 0.1229993468907206, 0.04689062346193898], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 102.60000000000002, 83, 260, 85.0, 232.90000000000032, 259.4, 260.0, 0.09099263869552952, 0.06762245903056442, 0.04567403934521697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 125.30000000000004, 83, 251, 85.0, 248.8, 250.9, 251.0, 0.09099636469523043, 0.04484947779461211, 0.05075002331781846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 595.1666666666666, 406, 757, 575.0, 757.0, 757.0, 757.0, 0.06701813957644535, 19.70555824714056, 0.03822128272719149], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 893.3333333333334, 731, 1074, 910.0, 1074.0, 1074.0, 1074.0, 0.06669779230307477, 60.01479075651971, 0.037973450110051356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 110.83333333333334, 82, 249, 84.0, 249.0, 249.0, 249.0, 0.06733251038042869, 0.11914698125911795, 0.03728274744697565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e1d11d7-b478-4cec-989d-ae67162ee481", 3, 0, 0.0, 606.6666666666667, 199, 1421, 200.0, 1421.0, 1421.0, 1421.0, 0.0406118857452281, 0.02658544994585082, 0.0260434293353188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 84.36363636363637, 82, 86, 84.0, 86.0, 86.0, 86.0, 0.06388366204381257, 0.04747604181185681, 0.03206660379933561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 114.27272727272727, 81, 253, 84.0, 251.20000000000002, 253.0, 253.0, 0.06388477509655313, 0.02581707175421785, 0.035946529169207535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 240.9090909090909, 81, 999, 243.0, 848.8000000000005, 999.0, 999.0, 0.06382435537401072, 5.23648124905714, 0.03702311239468981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 179.27272727272725, 81, 645, 85.0, 565.6000000000004, 645.0, 645.0, 0.06388403305708329, 1.7232922091969776, 0.037120116864223195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 112.66666666666666, 82, 253, 85.5, 253.0, 253.0, 253.0, 0.06732948807145903, 0.05003685588123078, 0.03780708558700092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 230.95000000000002, 81, 889, 85.0, 822.4, 885.6999999999999, 889.0, 0.09092438273709669, 12.292918830382838, 0.0522815200738306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 558.5000000000001, 82, 999, 770.0, 988.2, 999.0, 999.0, 0.1085730485502482, 54.2875727778716, 0.05864546828159023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 182.85, 82, 668, 84.5, 631.7000000000005, 667.4, 668.0, 0.0909285165467168, 4.0312323115620154, 0.052372694393802315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 418.16666666666663, 83, 756, 495.0, 741.6, 756.0, 756.0, 0.10857370344902464, 17.748713891703762, 0.05875185103084699], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 412.07142857142856, 161, 880, 413.0, 783.0, 880.0, 880.0, 0.07287074291722404, 0.013165124452818797, 0.05024096142535173], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6897f894-f2be-4c1d-916b-937f37472f96", 2, 0, 0.0, 221.5, 202, 241, 221.5, 241.0, 241.0, 241.0, 0.046399406087602076, 0.04096197568671121, 0.028841037084725317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35c78e51-dded-498f-b85a-fb17dd0c4d4d", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64dd1bd3-33eb-4630-b00e-7ce2e804e604", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.804157838983051, 3.3710716807909606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 342.7272727272727, 167, 1085, 329.0, 935.6000000000005, 1085.0, 1085.0, 0.0637925235162439, 7.027881410423698, 0.1419870700528898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 532.8636363636365, 170, 1286, 492.0, 979.8, 1242.0499999999993, 1286.0, 0.11996488300697432, 0.07368936661268247, 0.05424193440647374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 104.61111111111109, 84, 252, 85.0, 249.3, 252.0, 252.0, 0.10857108390132095, 0.08068612778213403, 0.05449759484890524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 157.44444444444449, 83, 253, 86.0, 251.2, 253.0, 253.0, 0.10857239365937221, 0.11964640082515018, 0.05685442402345163], "isController": false}, {"data": ["login", 22, 0, 0.0, 2361.090909090909, 1646, 3153, 2368.5, 3040.7999999999997, 3147.6, 3153.0, 0.11367159243567222, 37.24344168195205, 0.22291297987496125], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf46d95c-1370-4999-ac17-4b5395f0e4f2", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1044097-36a6-4c88-8932-abb1608fdb8d", 3, 0, 0.0, 316.3333333333333, 180, 500, 269.0, 500.0, 500.0, 500.0, 0.07332632659545865, 0.033178253244689954, 0.047022416469092956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 106.49999999999999, 84, 258, 88.5, 235.7000000000003, 257.6, 258.0, 0.09179954651024023, 0.07431818755565348, 0.03263187004856196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab3a4bbe-e2ae-498d-8297-b27972862e0f", 3, 0, 0.0, 410.33333333333337, 174, 857, 200.0, 857.0, 857.0, 857.0, 0.027560610375651117, 0.027641354351361034, 0.017673959127614814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e97c63f2-0903-41b4-a6d6-c8ef4713bf8c", 3, 0, 0.0, 333.0, 182, 438, 379.0, 438.0, 438.0, 438.0, 0.023151899613363277, 0.02736476155472723, 0.014846758541121632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 682.6111111111112, 171, 1083, 854.5, 1074.0, 1083.0, 1083.0, 0.10851413999529771, 72.19732090645478, 0.22862619968410328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=343df481-85f3-4c66-aec2-bf792ed250fe", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 0.9170764593908629, 3.4997620558375635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c79113c6-229b-423f-8f27-753e23b7f015", 3, 0, 0.0, 331.6666666666667, 181, 427, 387.0, 427.0, 427.0, 427.0, 0.12317799219872716, 0.05709813180045165, 0.0789910952576473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2df71189-b393-4324-8968-3d894976b4a5", 3, 0, 0.0, 380.3333333333333, 199, 603, 339.0, 603.0, 603.0, 603.0, 0.12638496861439946, 0.05718590702279143, 0.081047652399208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d3fb3c3-db70-4202-9c2f-48fc809d2835", 3, 0, 0.0, 524.0, 166, 904, 502.0, 904.0, 904.0, 904.0, 0.08123036932741254, 0.03675462674645294, 0.05209108970540453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 339.0, 169, 1222, 331.0, 868.7999999999997, 1222.0, 1222.0, 0.09772746066469708, 9.133347710546296, 0.21786792744487796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 0, 0.0, 1010.6666666666666, 816, 1327, 995.0, 1327.0, 1327.0, 1327.0, 0.06663260999933367, 79.71576680252315, 0.1502487270395131], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 947.7826086956521, 187, 1792, 817.0, 1719.6000000000001, 1790.8, 1792.0, 0.0919338076584859, 0.02882299744184187, 0.041477948377168436], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 360.0, 168, 974, 258.0, 906.4, 970.65, 974.0, 0.09088636931676171, 16.429481940594396, 0.20091745529526708], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 88.93333333333332, 85, 100, 87.0, 97.0, 100.0, 100.0, 0.07943947506394877, 0.06167420183187429, 0.02823825090163804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b860111-7021-44c5-bc51-b05abf01f9e9", 3, 0, 0.0, 279.6666666666667, 167, 379, 293.0, 379.0, 379.0, 379.0, 0.03773917200256626, 0.024262651271181112, 0.024201226837583186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 246.84615384615384, 167, 341, 175.0, 340.2, 341.0, 341.0, 0.05946608603370355, 0.09216081888231205, 0.1337406212261907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 85.08333333333333, 83, 87, 85.0, 87.0, 87.0, 87.0, 0.05428316814663693, 0.0403412997652253, 0.027247605886104868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 98.25, 83, 250, 84.0, 200.80000000000018, 250.0, 250.0, 0.05428439595038406, 0.01452531688516136, 0.030959069565453412], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4323a637-a4e6-4764-828f-47720e9efa11", 3, 0, 0.0, 753.0, 187, 1614, 458.0, 1614.0, 1614.0, 1614.0, 0.027682171758648372, 0.027763271871222534, 0.017751913530122815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e73c4de-3e82-450a-86ef-c3840f53612a", 3, 0, 0.0, 284.3333333333333, 171, 419, 263.0, 419.0, 419.0, 419.0, 0.030158028067071456, 0.025141507122320963, 0.019339620863323817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 98.08333333333334, 82, 252, 84.5, 202.20000000000016, 252.0, 252.0, 0.054243172140706786, 0.014620229991049876, 0.0318890523717827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 83.58333333333334, 81, 87, 83.5, 86.4, 87.0, 87.0, 0.054284887087434855, 0.014631473472785176, 0.03196658878293283], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 975.6491228070175, 662, 1624, 893.0, 1376.2, 1423.1, 1624.0, 0.24990464164989676, 298.9728323238501, 0.49346404825790163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 947.7826086956521, 187, 1792, 817.0, 1719.6000000000001, 1790.8, 1792.0, 0.0901805178714261, 0.02827330774297768, 0.04068691333652232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 84.07692307692308, 82, 89, 84.0, 87.4, 89.0, 89.0, 0.06415412782463223, 0.017291542265232905, 0.03777826081860667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 122.53846153846153, 82, 253, 86.0, 251.0, 253.0, 253.0, 0.06410224801652852, 0.017277559035704954, 0.03768511065034196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 141.66666666666666, 82, 800, 83.0, 465.8000000000002, 800.0, 800.0, 0.08378296859814337, 5.046947480995231, 0.048775215182591015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 143.4, 81, 648, 84.0, 411.0000000000001, 648.0, 648.0, 0.08378203266382181, 1.6633897128231194, 0.04885648870897473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 108.53846153846153, 82, 247, 84.0, 246.2, 247.0, 247.0, 0.06410193193361012, 0.017152274755673023, 0.036558133055887024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 97.0, 82, 250, 84.0, 165.40000000000003, 250.0, 250.0, 0.08377033524888167, 0.06225510266054585, 0.04204878156047381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 109.92307692307693, 83, 254, 85.0, 250.4, 254.0, 254.0, 0.06415254488210737, 0.04767586587430049, 0.032201570380276545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 106.66666666666667, 81, 253, 84.0, 251.2, 253.0, 253.0, 0.08378250062836876, 0.03080752366855643, 0.04731311265953585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 101.00000000000001, 85, 249, 89.0, 186.99999999999994, 249.0, 249.0, 0.06342855748822912, 0.04992521224171159, 0.022546870044643945], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 631.9230769230769, 379, 1437, 458.0, 1430.6, 1437.0, 1437.0, 0.07029534861085576, 0.012699843254890934, 0.04784751756031882], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1231.4090909090912, 881, 1713, 1247.5, 1552.3, 1689.7499999999995, 1713.0, 0.11715338573284767, 0.06063602972500905, 0.05388598113297974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 233.23076923076925, 168, 507, 170.0, 501.0, 507.0, 507.0, 0.06407444464707303, 0.09930287466299306, 0.14410492775606365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35c78e51-dded-498f-b85a-fb17dd0c4d4d", 3, 0, 0.0, 291.6666666666667, 194, 408, 273.0, 408.0, 408.0, 408.0, 0.023112836869597374, 0.023180550258863772, 0.014821708539422796], "isController": false}, {"data": ["addBook", 58, 17, 29.310344827586206, 884.6206896551721, 427, 2618, 715.5, 1449.3, 1874.7499999999989, 2618.0, 0.27991062164288233, 93.51823200699535, 1.0141481547616176], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ca6bb74f-65db-4bd2-a5c4-e9593ba2f5e5", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 1.0202426118210863, 1.9063248801916932], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 150.22807017543857, 83, 345, 86.0, 339.4, 342.0, 345.0, 0.2506287704240463, 0.1862582952077141, 0.1211535560155302], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 520.4210526315787, 405, 780, 492.0, 661.0, 680.2999999999995, 780.0, 0.2505869008994751, 73.6808691326396, 0.12602759176096648], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 130.68421052631587, 82, 344, 87.0, 253.0, 289.1999999999997, 344.0, 0.2509476576017328, 0.44405972224056633, 0.12204290379459273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e1d11d7-b478-4cec-989d-ae67162ee481", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.47294257198952877, 1.804851112565445], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 823.877192982456, 574, 1294, 809.0, 1034.0, 1077.0, 1294.0, 0.2503194867133051, 225.2379141593547, 0.1256486486041395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 89.84615384615384, 83, 106, 88.0, 101.6, 106.0, 106.0, 0.06030607653305005, 0.04505287944119461, 0.021436925642607633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 17, 9.826589595375722, 140.68208092485548, 83, 1369, 89.0, 240.19999999999993, 296.6999999999998, 1122.579999999997, 0.6924126779560619, 1.5627321696230954, 0.32993101388427504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 87.41666666666667, 85, 94, 86.0, 93.10000000000001, 94.0, 94.0, 0.057584337060319596, 0.044594120399251404, 0.020469432314410483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 86.53846153846152, 83, 92, 87.0, 90.4, 92.0, 92.0, 0.09597070678734368, 0.07788247787136972, 0.034114587178313574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1044097-36a6-4c88-8932-abb1608fdb8d", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 0.9765625, 3.7267736486486487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e97c63f2-0903-41b4-a6d6-c8ef4713bf8c", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c79113c6-229b-423f-8f27-753e23b7f015", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6897f894-f2be-4c1d-916b-937f37472f96", 1, 0, 0.0, 686.0, 686, 686, 686.0, 686.0, 686.0, 686.0, 1.4577259475218658, 0.2633586916909621, 1.0050337099125364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d3fb3c3-db70-4202-9c2f-48fc809d2835", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 198.75, 168, 338, 171.0, 337.1, 338.0, 338.0, 0.054221358696880016, 0.08403251587104353, 0.12194510652237761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 263.2, 166, 882, 170.0, 653.4000000000001, 882.0, 882.0, 0.08373058845857569, 6.799174538504907, 0.18688383881024417], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 119.36363636363636, 85, 259, 87.0, 256.6, 259.0, 259.0, 0.06232577113976837, 0.05167439423599937, 0.02215486395983954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2df71189-b393-4324-8968-3d894976b4a5", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 1.1221370341614907, 4.282317546583851], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 99.5, 84, 261, 87.5, 124.20000000000022, 261.0, 261.0, 0.10106681639528356, 0.07846495999438519, 0.03592609489051095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b860111-7021-44c5-bc51-b05abf01f9e9", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf46d95c-1370-4999-ac17-4b5395f0e4f2", 3, 0, 0.0, 635.0, 189, 1437, 279.0, 1437.0, 1437.0, 1437.0, 0.026530124956888546, 0.026607849932348184, 0.017013133517275535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 85.0, 82, 88, 85.0, 88.0, 88.0, 88.0, 0.059489488664964355, 0.04421045007230261, 0.029860934740030935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 135.15384615384616, 82, 255, 85.0, 255.0, 255.0, 255.0, 0.05949030536831363, 0.015918304366130797, 0.03392806478036637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 158.92307692307693, 82, 250, 86.0, 249.6, 250.0, 250.0, 0.05949030536831363, 0.016034496368803285, 0.03497379280441876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 96.38461538461539, 81, 248, 84.0, 183.19999999999993, 248.0, 248.0, 0.0594908498496712, 0.01603464312354419, 0.035032209432960676], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 29.166666666666668, 0.5319148936170213], "isController": false}, {"data": ["401/Unauthorized", 17, 70.83333333333333, 1.2917933130699089], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1316, 24, "401/Unauthorized", 17, "406/Not Acceptable", 7, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
