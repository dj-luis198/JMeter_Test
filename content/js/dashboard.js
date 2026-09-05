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

    var data = {"OkPercent": 98.1508875739645, "KoPercent": 1.849112426035503};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7934990439770554, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.32786885245901637, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de7b9147-4a16-4a09-84e6-705127ff3b94"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8cbf4b8-3c7b-4701-b58e-76c798e5fa76"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2879e0cd-1104-4762-8d75-cc9074f26f64"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2f7d0ac8-5753-4002-a495-1089f55ddd12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a5bfe057-1056-4ef7-bc09-4f11cffa28ef"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d5ba70a9-a2e7-489d-8194-ed633f521a34"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=480bd293-3afd-4640-b56c-0c630f464e71"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/95c9ad45-2671-47c6-b3cb-ec08d3b65da9"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ff21c12-830a-4538-85ce-4e394b5086d1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/09e2a3d3-411c-40db-8ecb-e1e4fac242e6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1fa42348-9140-4427-9dd6-c206fdbedac6"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=857cb755-9ef3-42bb-8d46-556f0d6f7a6e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/650edd47-4220-4b0c-9241-691d8519677a"], "isController": false}, {"data": [0.9318181818181818, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/de7b9147-4a16-4a09-84e6-705127ff3b94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5bfe057-1056-4ef7-bc09-4f11cffa28ef"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.48360655737704916, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f7d0ac8-5753-4002-a495-1089f55ddd12"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2879e0cd-1104-4762-8d75-cc9074f26f64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e61f930c-67f6-4394-b4af-4ba02eff0593"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.35344827586206895, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7213114754098361, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a629cd73-f78e-4d8e-8dc5-bcd070e51bec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/480bd293-3afd-4640-b56c-0c630f464e71"], "isController": false}, {"data": [0.9152542372881356, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3e53a109-5d0a-4d7d-a990-eb712f48a953"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e53a109-5d0a-4d7d-a990-eb712f48a953"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1fabdf5a-eb7f-4e07-875f-75b84c4a98e9"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95c9ad45-2671-47c6-b3cb-ec08d3b65da9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09e2a3d3-411c-40db-8ecb-e1e4fac242e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/857cb755-9ef3-42bb-8d46-556f0d6f7a6e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c8cbf4b8-3c7b-4701-b58e-76c798e5fa76"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1fa42348-9140-4427-9dd6-c206fdbedac6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1352, 25, 1.849112426035503, 327.0377218934909, 81, 4285, 105.0, 864.2000000000003, 1082.6999999999998, 1749.41, 5.435787746962472, 773.145432733383, 3.975365034807938], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 61, 0, 0.0, 1405.7049180327865, 1015, 2010, 1371.0, 1706.6, 1763.8999999999999, 2010.0, 0.26588441437868043, 319.94840725428577, 1.3073515882779843], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de7b9147-4a16-4a09-84e6-705127ff3b94", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 0.30466115092748736, 1.1626528246205734], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 597.4285714285713, 90, 1205, 536.0, 1098.5, 1205.0, 1205.0, 0.07269064419487324, 0.014319083370976702, 0.04891001352565201], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 597.4285714285713, 90, 1205, 536.0, 1098.5, 1205.0, 1205.0, 0.07102993404363267, 0.013991945712836124, 0.04779260210553019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 139.86363636363637, 82, 265, 89.0, 261.1, 264.55, 265.0, 0.10651586602240706, 0.035773217432773965, 0.06034070854838241], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 104.13636363636364, 84, 264, 88.0, 206.4999999999999, 261.9, 264.0, 0.10650761529449355, 0.07915263206944297, 0.053461830333368834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 149.81818181818187, 83, 658, 87.0, 256.7, 597.8499999999992, 658.0, 0.10651792890412418, 1.4510325430429267, 0.06230882755231482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8cbf4b8-3c7b-4701-b58e-76c798e5fa76", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 0.7590926995798319, 2.8968618697478994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 143.0909090909091, 82, 854, 85.5, 252.0, 763.6999999999987, 854.0, 0.10651896037494674, 4.3840391702294035, 0.062205408500213034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2879e0cd-1104-4762-8d75-cc9074f26f64", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 246.5, 89, 615, 197.5, 519.5, 615.0, 615.0, 0.072524580652514, 0.1372634937810172, 0.046875890368735684], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2f7d0ac8-5753-4002-a495-1089f55ddd12", 3, 0, 0.0, 420.3333333333333, 353, 475, 433.0, 475.0, 475.0, 475.0, 0.020801264716894786, 0.024586390685887034, 0.013339352699310783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 96.88888888888889, 85, 252, 87.0, 107.10000000000022, 252.0, 252.0, 0.13708854396734246, 0.1018792792569801, 0.06881202304610745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 595.0, 507, 675, 599.0, 675.0, 675.0, 675.0, 0.02451581269919098, 7.2084629351556755, 0.013981674430007356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 115.44444444444446, 83, 263, 86.5, 260.3, 263.0, 263.0, 0.1370948086765781, 0.05956245810991957, 0.07690756953753351], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 864.0, 820, 920, 858.0, 920.0, 920.0, 920.0, 0.024478605698619406, 22.025892436416825, 0.013936549924116323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 176.5, 83, 263, 180.0, 263.0, 263.0, 263.0, 0.024604634282867178, 0.04353866925835481, 0.013623855115611025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 101.16666666666666, 84, 251, 87.5, 203.30000000000018, 251.0, 251.0, 0.06995779213208031, 0.05199011700440734, 0.03511553237879812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 155.33333333333331, 84, 264, 88.0, 260.7, 264.0, 264.0, 0.06995819997551463, 0.01871928397782325, 0.039898035923535684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 142.58333333333334, 81, 266, 87.5, 263.6, 266.0, 266.0, 0.06995901567664943, 0.018856140944096916, 0.04112824945053023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 125.66666666666667, 83, 252, 86.0, 251.1, 252.0, 252.0, 0.06995901567664943, 0.018856140944096916, 0.04119656880177696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 89.5, 84, 93, 90.5, 93.0, 93.0, 93.0, 0.024603423566389265, 0.018284380209006083, 0.013815398975267408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5bfe057-1056-4ef7-bc09-4f11cffa28ef", 3, 0, 0.0, 1630.3333333333335, 176, 4285, 430.0, 4285.0, 4285.0, 4285.0, 0.04882256253356551, 0.02209093812553908, 0.03130873964554819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 467.1363636363636, 84, 1367, 90.0, 1151.1999999999998, 1338.9499999999996, 1367.0, 0.10814318157240185, 39.82480670174356, 0.05977445387693306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 191.55555555555554, 84, 952, 88.0, 622.6000000000005, 952.0, 952.0, 0.13708854396734246, 13.738678890077837, 0.07928406459916833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 331.6818181818182, 83, 775, 169.0, 691.4, 762.5499999999998, 775.0, 0.10814264998648217, 13.025304074397228, 0.059879768107749407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 193.83333333333331, 84, 675, 87.0, 659.7, 675.0, 675.0, 0.13709376451861047, 4.5117474599571965, 0.07942096449271499], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 457.3846153846154, 89, 873, 469.0, 860.2, 873.0, 873.0, 0.07047139945357561, 0.013970404383863133, 0.04781382811483585], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d5ba70a9-a2e7-489d-8194-ed633f521a34", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.6503786914460286, 1.2152335794297353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 287.83333333333337, 169, 517, 337.5, 468.4000000000002, 517.0, 517.0, 0.0699223279473718, 0.10836595161374907, 0.15725695435820045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=480bd293-3afd-4640-b56c-0c630f464e71", 1, 0, 0.0, 873.0, 873, 873, 873.0, 873.0, 873.0, 873.0, 1.1454753722794961, 0.20694623424971365, 0.7897515750286369], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95c9ad45-2671-47c6-b3cb-ec08d3b65da9", 3, 0, 0.0, 399.33333333333337, 200, 751, 247.0, 751.0, 751.0, 751.0, 0.025809337818422706, 0.025884951112812617, 0.016550909994235915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 647.0476190476192, 119, 1736, 567.0, 1275.0000000000002, 1694.0999999999995, 1736.0, 0.09086188992731048, 0.05581262574636552, 0.04108306155893043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 96.5, 84, 265, 87.0, 98.1, 240.09999999999965, 265.0, 0.10814105526007924, 0.08036654595011748, 0.05428174062859446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 134.59090909090907, 83, 277, 90.0, 258.4, 274.29999999999995, 277.0, 0.1081399921352733, 0.09538093233877311, 0.05795819713429021], "isController": false}, {"data": ["login", 21, 0, 0.0, 3049.2380952380954, 1645, 6263, 2690.0, 4951.4000000000015, 6164.699999999999, 6263.0, 0.0909390102371343, 20.84923130824427, 0.1659307079926729], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 92.33333333333334, 87, 106, 91.0, 105.1, 106.0, 106.0, 0.14059314686516336, 0.1138200378429887, 0.04997647017472604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ff21c12-830a-4538-85ce-4e394b5086d1", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 1.46484375, 2.7370627866972477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09e2a3d3-411c-40db-8ecb-e1e4fac242e6", 3, 0, 0.0, 369.0, 223, 621, 263.0, 621.0, 621.0, 621.0, 0.05176697956929873, 0.033887824190709556, 0.03319692374723909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1fa42348-9140-4427-9dd6-c206fdbedac6", 3, 0, 0.0, 539.6666666666666, 201, 803, 615.0, 803.0, 803.0, 803.0, 0.01715874123474302, 0.023654710002974182, 0.011003489658998616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 580.6818181818182, 172, 1460, 266.5, 1237.6, 1431.0499999999995, 1460.0, 0.10809270423379469, 53.00117608393644, 0.2317889895297476], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=857cb755-9ef3-42bb-8d46-556f0d6f7a6e", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/650edd47-4220-4b0c-9241-691d8519677a", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 288.6363636363637, 172, 945, 183.5, 515.0, 880.4999999999991, 945.0, 0.10646071357712837, 5.946767488289321, 0.23819450493348626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, 50.0, 526.0, 89, 1004, 518.5, 1004.0, 1004.0, 1004.0, 0.04474998741406604, 26.77425833888047, 0.065278607128673], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1325.1304347826087, 215, 3418, 1136.0, 2477.0000000000014, 3313.7999999999984, 3418.0, 0.09177679882525697, 0.029054339845495755, 0.041407110407488984], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 91.21428571428571, 87, 105, 89.0, 100.0, 105.0, 105.0, 0.0680887488206056, 0.05286187042224751, 0.024203422432324647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 337.7222222222223, 171, 1043, 264.0, 789.2000000000004, 1043.0, 1043.0, 0.13699464198733563, 18.399082040763517, 0.3042095646995251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 411.55555555555554, 172, 1245, 344.0, 956.1000000000005, 1245.0, 1245.0, 0.09747380391519779, 19.561313941800016, 0.21506427178945658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 108.66666666666667, 83, 279, 87.0, 279.0, 279.0, 279.0, 0.04340298709002262, 0.03225554021045626, 0.02178626500417151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 105.55555555555556, 84, 250, 88.0, 250.0, 250.0, 250.0, 0.043404452332265905, 0.011614081971719589, 0.024754101720745398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 106.55555555555556, 82, 265, 86.0, 265.0, 265.0, 265.0, 0.043404870991077885, 0.011698969134313963, 0.02551731673498915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de7b9147-4a16-4a09-84e6-705127ff3b94", 3, 0, 0.0, 317.0, 183, 565, 203.0, 565.0, 565.0, 565.0, 0.01778779164566719, 0.024521906777148616, 0.011406884616524858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 105.0, 84, 246, 86.0, 246.0, 246.0, 246.0, 0.043404870991077885, 0.011698969134313963, 0.025559704304316373], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5bfe057-1056-4ef7-bc09-4f11cffa28ef", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 0.8856081495098039, 3.379672181372549], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 106.0, 89, 123, 106.0, 123.0, 123.0, 123.0, 0.1368550704803613, 0.040361553989325304, 0.08459888634186397], "isController": false}, {"data": ["https://demoqa.com/books", 61, 0, 0.0, 958.3278688524591, 667, 1636, 881.0, 1348.4, 1385.0, 1636.0, 0.2672555050252797, 319.7304970569035, 0.527725225743277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f7d0ac8-5753-4002-a495-1089f55ddd12", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1325.1304347826087, 215, 3418, 1136.0, 2477.0000000000014, 3313.7999999999984, 3418.0, 0.09484770757214613, 0.030026516119986475, 0.04279261806477686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 86.75, 84, 90, 86.5, 90.0, 90.0, 90.0, 0.023178731196254316, 0.006247392392740421, 0.01364919424935679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 89.0, 83, 98, 87.5, 98.0, 98.0, 98.0, 0.023178328263074026, 0.006247283789656672, 0.013626321889033755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 116.28571428571428, 81, 337, 86.5, 298.0, 337.0, 337.0, 0.06752650415288002, 0.01820050307245594, 0.039698198730501726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 120.85714285714286, 82, 257, 85.5, 256.0, 257.0, 257.0, 0.06752715556327295, 0.01820067864791341, 0.03976452617641951], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2879e0cd-1104-4762-8d75-cc9074f26f64", 3, 0, 0.0, 807.0, 417, 1580, 424.0, 1580.0, 1580.0, 1580.0, 0.08281344890410203, 0.03747092902887429, 0.053106280709987304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 89.35714285714286, 83, 124, 86.5, 107.0, 124.0, 124.0, 0.06751575769559073, 0.05017528477182085, 0.03388974556204457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 87.5, 84, 93, 86.5, 93.0, 93.0, 93.0, 0.023178999826157502, 0.006202193312858551, 0.01321927333835545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 133.21428571428572, 83, 264, 86.0, 258.5, 264.0, 264.0, 0.06752845842176346, 0.018069138288635926, 0.038512323943661976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 96.25, 85, 119, 90.5, 119.0, 119.0, 119.0, 0.02317886551042759, 0.017225699856870506, 0.01163470397691385], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 538.2307692307692, 89, 1263, 441.0, 1078.9999999999998, 1263.0, 1263.0, 0.07121453653031821, 0.013818145121530345, 0.04846247644442253], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 99.0, 86, 117, 96.5, 117.0, 117.0, 117.0, 0.022308606102519196, 0.017559313006475074, 0.007930012325504871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e61f930c-67f6-4394-b4af-4ba02eff0593", 2, 0, 0.0, 302.0, 237, 367, 302.0, 367.0, 367.0, 367.0, 0.013971456314748967, 0.027615456622121008, 0.008684406195642303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1723.952380952381, 1303, 3133, 1577.0, 2715.8, 3100.3999999999996, 3133.0, 0.09178562374887453, 0.047506231041897946, 0.04221780154855459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 187.0, 172, 210, 183.0, 210.0, 210.0, 210.0, 0.0231666492916797, 0.03590378166591375, 0.05210233722533041], "isController": false}, {"data": ["addBook", 58, 12, 20.689655172413794, 945.0689655172413, 436, 2117, 793.0, 1499.5, 1654.2999999999995, 2117.0, 0.2828881908812455, 88.61979369890942, 1.0277988326594416], "isController": true}, {"data": ["https://demoqa.com/books-0", 61, 0, 0.0, 156.44262295081967, 84, 466, 91.0, 348.8, 357.7, 466.0, 0.26812715380828467, 0.19926246489072721, 0.129612247202247], "isController": false}, {"data": ["https://demoqa.com/books-3", 61, 0, 0.0, 525.8032786885242, 403, 872, 504.0, 674.4000000000001, 741.6, 872.0, 0.2677387922785888, 78.72409469449248, 0.1346537871322981], "isController": false}, {"data": ["https://demoqa.com/books-1", 61, 0, 0.0, 137.4918032786885, 83, 276, 91.0, 266.0, 272.9, 276.0, 0.26825095976675356, 0.4746784561497632, 0.13045798629281571], "isController": false}, {"data": ["https://demoqa.com/books-2", 61, 0, 0.0, 799.9344262295082, 579, 1170, 761.0, 1010.0, 1017.6, 1170.0, 0.2677035424639258, 240.88011808167371, 0.13437462971333777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 95.27777777777777, 87, 141, 91.0, 113.10000000000005, 141.0, 141.0, 0.09680542110358181, 0.07232045619554694, 0.03441130203291384], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a629cd73-f78e-4d8e-8dc5-bcd070e51bec", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/480bd293-3afd-4640-b56c-0c630f464e71", 3, 0, 0.0, 319.3333333333333, 195, 427, 336.0, 427.0, 427.0, 427.0, 0.031968968787630135, 0.026651213888385674, 0.020500933760296672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 12, 6.779661016949152, 157.68361581920894, 84, 869, 94.0, 271.6000000000003, 460.9, 706.7599999999998, 0.7672966880527138, 1.7148053106576209, 0.36464457663213107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 93.77777777777777, 90, 100, 94.0, 100.0, 100.0, 100.0, 0.04219171917191719, 0.03267386064778353, 0.014997837674392438], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e53a109-5d0a-4d7d-a990-eb712f48a953", 3, 0, 0.0, 404.33333333333337, 187, 667, 359.0, 667.0, 667.0, 667.0, 0.034138237101436084, 0.028459643625253193, 0.02189203355788707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e53a109-5d0a-4d7d-a990-eb712f48a953", 1, 0, 0.0, 841.0, 841, 841, 841.0, 841.0, 841.0, 841.0, 1.1890606420927465, 0.21482052615933414, 0.8198015755053508], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 109.45454545454548, 88, 269, 93.5, 207.89999999999992, 265.54999999999995, 269.0, 0.1047205152249349, 0.08498315249211026, 0.03722487064636358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1fabdf5a-eb7f-4e07-875f-75b84c4a98e9", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.6751288319238901, 1.2614792547568712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 236.33333333333334, 170, 529, 181.0, 529.0, 529.0, 529.0, 0.04338499361276483, 0.0672382664682205, 0.0975738674708959], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95c9ad45-2671-47c6-b3cb-ec08d3b65da9", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 255.07142857142858, 168, 425, 195.5, 387.0, 425.0, 425.0, 0.06748549061951681, 0.10458932970036443, 0.15177645009447968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09e2a3d3-411c-40db-8ecb-e1e4fac242e6", 1, 0, 0.0, 765.0, 765, 765, 765.0, 765.0, 765.0, 765.0, 1.3071895424836601, 0.23616217320261437, 0.9012459150326797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/857cb755-9ef3-42bb-8d46-556f0d6f7a6e", 3, 0, 0.0, 300.0, 193, 441, 266.0, 441.0, 441.0, 441.0, 0.04572473708276177, 0.02939660017527816, 0.029322178402682517], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 94.08333333333334, 87, 122, 92.5, 114.80000000000003, 122.0, 122.0, 0.06865970533543127, 0.05692586897439565, 0.024406379630954083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 102.31818181818183, 86, 280, 94.0, 107.8, 254.34999999999962, 280.0, 0.11122795664132018, 0.08635373586899368, 0.03953806271234428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8cbf4b8-3c7b-4701-b58e-76c798e5fa76", 3, 0, 0.0, 592.3333333333333, 192, 1263, 322.0, 1263.0, 1263.0, 1263.0, 0.05973715651135006, 0.027729552469135804, 0.03830800726802071], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1fa42348-9140-4427-9dd6-c206fdbedac6", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.3231915250447227, 1.2333687388193202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 105.77777777777779, 84, 255, 86.5, 254.1, 255.0, 255.0, 0.09760964817144592, 0.07253998267428745, 0.04899546792980782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 132.5, 83, 257, 86.5, 256.1, 257.0, 257.0, 0.0975202760907372, 0.05050610653006604, 0.05425200255178056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 246.94444444444449, 82, 989, 88.0, 852.2000000000003, 989.0, 989.0, 0.09761176547146483, 14.660464210036116, 0.055986956627838876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 258.72222222222223, 83, 669, 253.5, 662.7, 669.0, 669.0, 0.09751974774891915, 4.800911149351494, 0.05602941236225335], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 20.0, 0.3698224852071006], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.14792899408284024], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.0, 0.14792899408284024], "isController": false}, {"data": ["401/Unauthorized", 16, 64.0, 1.183431952662722], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1352, 25, "401/Unauthorized", 16, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
