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

    var data = {"OkPercent": 98.18049490538573, "KoPercent": 1.819505094614265};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8087586641461878, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f1aee6d-9137-46b4-8e66-59c787b001d5"], "isController": false}, {"data": [0.3793103448275862, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ad7cdd4e-706f-41e1-b725-e029f8197be8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f07811d-aa83-4b25-9635-b453851653c6"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/beeb0070-9999-4ead-a26f-16e39d532a63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f07811d-aa83-4b25-9635-b453851653c6"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=130f74fd-0341-4693-a0bf-f70abe0749e5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=905a8c8e-4469-40cb-afca-3e79dc5567b6"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24a49b21-a470-4444-a3ef-98c9fd7ca9af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.36923076923076925, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=507b9920-b003-419d-9203-6f1d1a259a07"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fda8fa7f-fe32-4f2b-bc03-e01d965892a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dabe958e-e95f-4465-bd62-353d8f9d4b85"], "isController": false}, {"data": [0.8620689655172413, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/507b9920-b003-419d-9203-6f1d1a259a07"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9228723404255319, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fda8fa7f-fe32-4f2b-bc03-e01d965892a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6f69f8a8-82d5-4a51-87b7-15e73759af41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.575, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8de9ba30-30a9-4b16-a8db-69046ce10581"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a50d12f1-a9f3-46dd-897f-eea878339791"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dabe958e-e95f-4465-bd62-353d8f9d4b85"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/24a49b21-a470-4444-a3ef-98c9fd7ca9af"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/130f74fd-0341-4693-a0bf-f70abe0749e5"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a50d12f1-a9f3-46dd-897f-eea878339791"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f69f8a8-82d5-4a51-87b7-15e73759af41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/905a8c8e-4469-40cb-afca-3e79dc5567b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad7cdd4e-706f-41e1-b725-e029f8197be8"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=beeb0070-9999-4ead-a26f-16e39d532a63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1374, 25, 1.819505094614265, 309.3813682678309, 76, 2783, 95.0, 820.5, 1065.5, 1781.0, 5.564713077075731, 759.4425892799285, 4.091913668731497], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/4f1aee6d-9137-46b4-8e66-59c787b001d5", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 1.0973743556701032, 2.0504456615120277], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1361.6379310344828, 995, 2115, 1309.0, 1675.0, 1743.6499999999999, 2115.0, 0.24011392991985162, 288.93904702714116, 1.180638317525833], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 97.15789473684211, 83, 247, 90.0, 99.0, 247.0, 247.0, 0.08509761592310759, 0.06606699673717825, 0.03024954316016715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 238.94444444444443, 162, 485, 172.5, 482.3, 485.0, 485.0, 0.09538849614736462, 0.1478335384627614, 0.2145309635033015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad7cdd4e-706f-41e1-b725-e029f8197be8", 3, 0, 0.0, 433.66666666666663, 235, 726, 340.0, 726.0, 726.0, 726.0, 0.040976329340417686, 0.04136315015775887, 0.02627713828145275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f07811d-aa83-4b25-9635-b453851653c6", 3, 0, 0.0, 316.0, 216, 448, 284.0, 448.0, 448.0, 448.0, 0.02793296089385475, 0.02801479574022346, 0.017912738594040967], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/beeb0070-9999-4ead-a26f-16e39d532a63", 3, 0, 0.0, 1464.0, 488, 2376, 1528.0, 2376.0, 2376.0, 2376.0, 0.01830015921138514, 0.025228246829497418, 0.011735453660946851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 276.4285714285714, 163, 412, 324.0, 381.0, 412.0, 412.0, 0.11963460174495612, 0.18541026657152868, 0.2690610232603847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 84.80000000000001, 79, 90, 84.0, 89.9, 90.0, 90.0, 0.04715535331148469, 0.035044163935585786, 0.023669776955178835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 99.9, 79, 244, 81.5, 229.80000000000007, 244.0, 244.0, 0.04715668752564145, 0.019700811448700596, 0.02649800586157626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f07811d-aa83-4b25-9635-b453851653c6", 1, 0, 0.0, 735.0, 735, 735, 735.0, 735.0, 735.0, 735.0, 1.3605442176870748, 0.2458014455782313, 0.938031462585034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 187.3, 81, 950, 82.5, 879.0000000000002, 950.0, 950.0, 0.04715602040912563, 4.254546024570645, 0.0273173352604427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 186.2, 81, 622, 95.5, 584.2000000000002, 622.0, 622.0, 0.04715646515137226, 1.3979957765490898, 0.027363644133735734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 3.31372893258427, 6.945663623595506], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 924.293103448276, 627, 1762, 864.5, 1293.2, 1381.6, 1762.0, 0.2449076107151302, 292.9946460768334, 0.4835968641269466], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 582.3333333333334, 96, 1121, 544.5, 1073.9, 1121.0, 1121.0, 0.08095854922279792, 0.015397145958144431, 0.0547036811683668], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 582.3333333333334, 96, 1121, 544.5, 1073.9, 1121.0, 1121.0, 0.0833663325066172, 0.01585507153873408, 0.05633062001973003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 8, 38.095238095238095, 1299.904761904762, 193, 2020, 1332.0, 1988.0, 2018.2, 2020.0, 0.09252364860399437, 0.02875874568773709, 0.04174406802250528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 111.61111111111111, 79, 275, 83.0, 245.30000000000004, 275.0, 275.0, 0.090908631774587, 0.03191074476896581, 0.05142216769107227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 110.63636363636364, 78, 242, 82.0, 241.8, 242.0, 242.0, 0.06844541789038779, 0.01844817904076858, 0.04030526073037483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 83.55555555555554, 80, 92, 83.0, 85.70000000000002, 92.0, 92.0, 0.09090771351949212, 0.06755934569173194, 0.04563141088771382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 82.09090909090908, 77, 96, 81.0, 93.60000000000001, 96.0, 96.0, 0.06844499200438048, 0.018448064251180677, 0.040238169127575246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 158.72222222222223, 81, 662, 84.5, 284.00000000000057, 662.0, 662.0, 0.090908631774587, 1.508150132448826, 0.05309908472684481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 139.7777777777778, 79, 785, 82.5, 297.2000000000008, 785.0, 785.0, 0.0909090909090909, 4.56759489425505, 0.053010574494949496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 164.8421052631579, 80, 713, 84.0, 246.0, 713.0, 713.0, 0.085056853791745, 4.049840273580894, 0.04961941254812428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 148.94736842105263, 80, 884, 83.0, 240.0, 884.0, 884.0, 0.08505761534260312, 1.3380223908576494, 0.049702920889702656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 100.10526315789474, 79, 245, 83.0, 238.0, 245.0, 245.0, 0.08511591443610707, 0.06325508875573972, 0.04272419923843656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 125.00000000000001, 80, 244, 84.0, 242.8, 244.0, 244.0, 0.06837904368799264, 0.018296736299326155, 0.0389974233533083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 108.36842105263158, 79, 261, 82.0, 245.0, 261.0, 261.0, 0.08511705835446327, 0.029503980342439364, 0.04816708534553046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 112.72727272727273, 81, 242, 84.0, 240.4, 242.0, 242.0, 0.06844371437815774, 0.05086490882986137, 0.03435553631872371], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 88.0, 82, 104, 85.0, 104.0, 104.0, 104.0, 0.06718500919213082, 0.05288195059458733, 0.023882171236265244], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 632.0, 83, 1528, 463.5, 1424.2000000000003, 1528.0, 1528.0, 0.08068311705775566, 0.015160914492704902, 0.05491153222281988], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=130f74fd-0341-4693-a0bf-f70abe0749e5", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=905a8c8e-4469-40cb-afca-3e79dc5567b6", 1, 0, 0.0, 1153.0, 1153, 1153, 1153.0, 1153.0, 1153.0, 1153.0, 0.8673026886383347, 0.15669042714657416, 0.5979645490026019], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1766.8, 1256, 2783, 1731.0, 2664.7000000000007, 2778.65, 2783.0, 0.08817642338791454, 0.04563818788632295, 0.040557710366902096], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 248.15384615384616, 79, 488, 207.0, 480.4, 488.0, 488.0, 0.07780098508016493, 0.1889911699622366, 0.05028543236401286], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 240.27272727272725, 165, 486, 170.0, 484.0, 486.0, 486.0, 0.0683433570256971, 0.10591885507791143, 0.15370581174822306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 101.11111111111111, 80, 244, 82.5, 242.2, 244.0, 244.0, 0.0954324947644673, 0.07092200050367149, 0.0479026389735705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24a49b21-a470-4444-a3ef-98c9fd7ca9af", 1, 0, 0.0, 713.0, 713, 713, 713.0, 713.0, 713.0, 713.0, 1.402524544179523, 0.2533857819074334, 0.9669749298737729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 107.55555555555556, 78, 240, 81.0, 240.0, 240.0, 240.0, 0.09543047094937412, 0.0255351064845005, 0.05442519046331493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 569.8571428571428, 478, 643, 626.0, 643.0, 643.0, 643.0, 0.08984495328062429, 26.417399397717936, 0.05123969991785604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 790.4285714285713, 707, 959, 784.0, 959.0, 959.0, 959.0, 0.08977121165486818, 80.77629404800837, 0.05110997694803529], "isController": false}, {"data": ["addBook", 65, 12, 18.46153846153846, 827.4615384615383, 425, 1919, 716.0, 1445.1999999999998, 1693.3999999999992, 1919.0, 0.30716304214276935, 74.62030014702476, 1.121892706177285], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 207.28571428571428, 81, 328, 239.0, 328.0, 328.0, 328.0, 0.09031325798627239, 0.15981213229602106, 0.05000743874825825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=507b9920-b003-419d-9203-6f1d1a259a07", 1, 0, 0.0, 864.0, 864, 864, 864.0, 864.0, 864.0, 864.0, 1.1574074074074074, 0.20910192418981483, 0.7979781539351852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 19, 0, 0.0, 94.26315789473684, 81, 243, 85.0, 97.0, 243.0, 243.0, 0.10819552639970843, 0.08040702694353333, 0.05430908258735365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 19, 0, 0.0, 82.84210526315789, 79, 92, 81.0, 91.0, 92.0, 92.0, 0.10819860708530037, 0.028951580411496387, 0.06170701810333536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 19, 0, 0.0, 108.36842105263159, 79, 248, 83.0, 241.0, 248.0, 248.0, 0.1081998394086594, 0.02916323796561523, 0.0636096712148564], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 154.0689655172413, 80, 667, 84.0, 336.1, 351.1, 667.0, 0.2456534169119671, 0.18256079127930372, 0.11874847790178099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 19, 0, 0.0, 115.05263157894736, 77, 247, 82.0, 238.0, 247.0, 247.0, 0.10819922324347103, 0.0291630718898418, 0.06371497228106741], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fda8fa7f-fe32-4f2b-bc03-e01d965892a1", 1, 0, 0.0, 827.0, 827, 827, 827.0, 827.0, 827.0, 827.0, 1.2091898428053203, 0.2184571493349456, 0.833679715840387], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dabe958e-e95f-4465-bd62-353d8f9d4b85", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 502.4827586206899, 388, 772, 475.0, 640.6, 721.05, 772.0, 0.2459649033527561, 72.32184838914192, 0.12370305197916931], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 104.57142857142857, 80, 239, 82.0, 239.0, 239.0, 239.0, 0.09049539766263316, 0.06725292736451546, 0.050815286773451235], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 132.74137931034485, 79, 344, 85.5, 245.0, 317.5, 344.0, 0.2461256428971534, 0.43552701653285353, 0.1196978224245922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 687.4285714285714, 81, 1120, 867.5, 1109.0, 1120.0, 1120.0, 0.068662455369404, 44.13571479148684, 0.036151242545219134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 118.44444444444444, 79, 252, 82.5, 248.4, 252.0, 252.0, 0.095433000731653, 0.02572217597845335, 0.05610416644575694], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 767.7586206896552, 545, 1076, 724.5, 972.8000000000001, 1045.85, 1076.0, 0.24563365011604074, 221.02159015231405, 0.12329657828090326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 494.9285714285714, 78, 725, 633.0, 725.0, 725.0, 725.0, 0.06866312888069291, 14.4261731892552, 0.03621865099022041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 100.61111111111111, 79, 250, 82.0, 244.60000000000002, 250.0, 250.0, 0.09543148284619096, 0.025721766860887407, 0.05619646890259097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 100.21428571428572, 81, 243, 85.0, 176.5, 243.0, 243.0, 0.11925652077618959, 0.0890930062439307, 0.04239196636966114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/507b9920-b003-419d-9203-6f1d1a259a07", 3, 0, 0.0, 630.6666666666667, 201, 1182, 509.0, 1182.0, 1182.0, 1182.0, 0.01812207026530711, 0.02498273684035664, 0.011621249486541342], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 701.5833333333333, 89, 1153, 724.0, 1150.3, 1153.0, 1153.0, 0.08356255005048571, 0.015892389279621184, 0.05711603661084225], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 188, 12, 6.382978723404255, 150.54787234042536, 80, 726, 90.5, 269.19999999999993, 413.6999999999991, 646.7899999999987, 0.7865187342068711, 1.5727392227584216, 0.38087604407224257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 89.4, 83, 102, 87.0, 101.8, 102.0, 102.0, 0.04620986673074435, 0.03578557062253933, 0.01642616356444428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fda8fa7f-fe32-4f2b-bc03-e01d965892a1", 3, 0, 0.0, 696.3333333333334, 292, 1377, 420.0, 1377.0, 1377.0, 1377.0, 0.024901225140276904, 0.024974177948305056, 0.015968559090607258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 19, 0, 0.0, 220.21052631578948, 164, 482, 172.0, 336.0, 482.0, 482.0, 0.10814379709946953, 0.16760176366880677, 0.24321793429695146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f69f8a8-82d5-4a51-87b7-15e73759af41", 3, 0, 0.0, 452.66666666666663, 189, 903, 266.0, 903.0, 903.0, 903.0, 0.042796005706134094, 0.02751370809557775, 0.027444053138373753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 86.33333333333334, 82, 93, 85.0, 93.0, 93.0, 93.0, 0.09452887857240387, 0.07671240048209728, 0.03360206230503419], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 805.6999999999999, 114, 2280, 718.0, 1828.5000000000002, 2258.0999999999995, 2280.0, 0.08848970201092847, 0.054355490786009784, 0.04001048049908192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 83.7857142857143, 79, 91, 83.0, 90.0, 91.0, 91.0, 0.06866178187132782, 0.05102696875398484, 0.034464995978381346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 94.21428571428572, 80, 235, 82.5, 165.5, 235.0, 235.0, 0.068662455369404, 0.09203527778867658, 0.03504007557774552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8de9ba30-30a9-4b16-a8db-69046ce10581", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.6517059948979592, 1.2177136479591837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a50d12f1-a9f3-46dd-897f-eea878339791", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 0.2899904695024077, 1.1066663322632424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dabe958e-e95f-4465-bd62-353d8f9d4b85", 3, 0, 0.0, 372.3333333333333, 196, 485, 436.0, 485.0, 485.0, 485.0, 0.03074936195073952, 0.03083944797207958, 0.01971882911554585], "isController": false}, {"data": ["login", 20, 0, 0.0, 3287.7999999999997, 1778, 5032, 3164.5, 4734.200000000001, 5018.8, 5032.0, 0.08884032284573322, 37.31836231610053, 0.18560166275769246], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/24a49b21-a470-4444-a3ef-98c9fd7ca9af", 3, 0, 0.0, 499.3333333333333, 452, 577, 469.0, 577.0, 577.0, 577.0, 0.018648598247031765, 0.025708598169329272, 0.011958899266488469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 305.1, 166, 1030, 182.0, 959.9000000000002, 1030.0, 1030.0, 0.047137126615035795, 5.704987100630695, 0.10480645495811866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 86.66666666666666, 82, 95, 85.5, 95.0, 95.0, 95.0, 0.09369729527140983, 0.07585454861328003, 0.03330646042850896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/130f74fd-0341-4693-a0bf-f70abe0749e5", 3, 0, 0.0, 408.3333333333333, 207, 608, 410.0, 608.0, 608.0, 608.0, 0.02838194529853076, 0.028465095528897554, 0.018200661535841666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 276.89473684210526, 163, 967, 167.0, 498.0, 967.0, 967.0, 0.08502373952306157, 5.478411311849176, 0.19007542920207457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a50d12f1-a9f3-46dd-897f-eea878339791", 3, 0, 0.0, 381.0, 302, 521, 320.0, 521.0, 521.0, 521.0, 0.019597339987719, 0.027016515249996736, 0.012567304614520323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f69f8a8-82d5-4a51-87b7-15e73759af41", 1, 0, 0.0, 789.0, 789, 789, 789.0, 789.0, 789.0, 789.0, 1.2674271229404308, 0.2289785329531052, 0.8738315906210392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/905a8c8e-4469-40cb-afca-3e79dc5567b6", 3, 0, 0.0, 287.0, 185, 475, 201.0, 475.0, 475.0, 475.0, 0.030547409579667645, 0.030636903943670576, 0.019589321898419682], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 19, 0, 0.0, 108.47368421052632, 83, 331, 86.0, 244.0, 331.0, 331.0, 0.10858632040965618, 0.09002908791777157, 0.03859904358311997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 772.6428571428572, 161, 1212, 951.0, 1196.0, 1212.0, 1212.0, 0.06863350687805787, 58.68005893289604, 0.1418151325852281], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 103.42857142857143, 80, 242, 85.5, 194.5, 242.0, 242.0, 0.07244689383942664, 0.056245391213226734, 0.025752606794483685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad7cdd4e-706f-41e1-b725-e029f8197be8", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.3016094532554257, 1.1510068864774625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 277.05555555555554, 162, 866, 247.5, 382.7000000000008, 866.0, 866.0, 0.09087008102582224, 6.172574076469697, 0.2030772774314057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 3, 30.0, 651.1, 79, 1042, 866.0, 1032.3, 1042.0, 1042.0, 0.12446325222478065, 104.24091515495675, 0.22098304577136102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 82.85714285714285, 78, 90, 83.0, 87.0, 90.0, 90.0, 0.11971849052086095, 0.08897047977185076, 0.06009307043722903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=beeb0070-9999-4ead-a26f-16e39d532a63", 1, 0, 0.0, 1144.0, 1144, 1144, 1144.0, 1144.0, 1144.0, 1144.0, 0.8741258741258742, 0.15792313155594406, 0.6026688155594406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 125.42857142857143, 76, 243, 81.5, 241.5, 243.0, 243.0, 0.11971951428082778, 0.03203432315717462, 0.0682775354882846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 192.64285714285714, 79, 329, 240.5, 296.5, 329.0, 329.0, 0.11972258566578585, 0.032268978167731346, 0.07038378571367489], "isController": false}, {"data": ["register", 21, 8, 38.095238095238095, 1299.904761904762, 193, 2020, 1332.0, 1988.0, 2018.2, 2020.0, 0.09230363500505473, 0.02869035976440596, 0.041644804074546175], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 139.42857142857144, 80, 266, 82.5, 254.5, 266.0, 266.0, 0.11971951428082778, 0.03226815033350436, 0.07049889366341713], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 32.0, 0.5822416302765647], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.14556040756914118], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.0, 0.07278020378457059], "isController": false}, {"data": ["401/Unauthorized", 14, 56.0, 1.0189228529839884], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1374, 25, "401/Unauthorized", 14, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 188, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
