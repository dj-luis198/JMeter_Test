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

    var data = {"OkPercent": 96.88427299703264, "KoPercent": 3.115727002967359};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7996158770806658, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4051724137931034, 500, 1500, "see books"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9617d15e-955a-411c-83a2-fe4406da05d1"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7dda4001-6920-4497-962f-747c34a5cc90"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/67636ff6-e206-42ad-bb66-1549bd221275"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd735c9d-6437-4453-825f-44303486c616"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9617d15e-955a-411c-83a2-fe4406da05d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=359a5346-c76c-46e4-bfc3-abd5505f3b29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/06a5c1e4-b5ea-4364-9476-9ddde84ec68a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.31666666666666665, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4ae638ca-9acc-48c7-926a-a9f07884ecda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8017241379310345, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68218996-cb6f-411d-aa87-68ab316e831a"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7392592d-85c5-4860-a772-328d3f693d90"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8876404494382022, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8311859-f65c-466e-a3c5-dfd6a5a05d58"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7392592d-85c5-4860-a772-328d3f693d90"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/68218996-cb6f-411d-aa87-68ab316e831a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a8311859-f65c-466e-a3c5-dfd6a5a05d58"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3e95364-f430-4e7b-8e51-f5fd0c58491c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b3e95364-f430-4e7b-8e51-f5fd0c58491c"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bd735c9d-6437-4453-825f-44303486c616"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67636ff6-e206-42ad-bb66-1549bd221275"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/359a5346-c76c-46e4-bfc3-abd5505f3b29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1db26a25-b21e-4926-af90-37c312e1d261"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d10eca1e-6199-43e4-b6f7-dfaf2e7f171a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/65a60398-0867-4a23-84ed-ae772f10b467"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65a60398-0867-4a23-84ed-ae772f10b467"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "register"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1348, 42, 3.115727002967359, 297.9666172106824, 77, 3435, 92.0, 852.1000000000001, 1023.0999999999999, 1467.51, 5.214377446657074, 743.8073790343248, 3.8240916120762347], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1343.327586206897, 956, 1800, 1313.5, 1600.1000000000001, 1685.1999999999998, 1800.0, 0.24521928100015644, 295.0815656339447, 1.2057412889021364], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 12, 0, 0.0, 362.75, 161, 1131, 170.0, 1075.2000000000003, 1131.0, 1131.0, 0.06070386127144237, 12.18221963352573, 0.13393579807872277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 87.44444444444446, 81, 128, 85.0, 95.60000000000005, 128.0, 128.0, 0.1021914386283638, 0.07933807979448167, 0.0363258629499262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 303.53846153846155, 159, 1010, 172.0, 796.3999999999999, 1010.0, 1010.0, 0.08921279997803992, 8.33759024217844, 0.1988858372106589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 84.41666666666667, 79, 103, 82.0, 99.4, 103.0, 103.0, 0.05942359116569278, 0.04416147741903536, 0.029827857284341883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 107.58333333333334, 78, 239, 80.0, 239.0, 239.0, 239.0, 0.05942417969871941, 0.015900610583446405, 0.033890352484425915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 94.16666666666667, 78, 241, 80.5, 194.20000000000016, 241.0, 241.0, 0.05942300264432362, 0.01601635618147785, 0.03493422616394806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 106.58333333333333, 78, 238, 81.0, 236.8, 238.0, 238.0, 0.05942388543074889, 0.016016594120006538, 0.03499277628392732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 85.25, 82, 90, 84.5, 90.0, 90.0, 90.0, 0.030092610007297457, 0.00887496896699593, 0.01860217005333915], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 921.8965517241381, 628, 1462, 869.0, 1258.1, 1343.2999999999997, 1462.0, 0.2449603628792134, 293.0577560046965, 0.4837010290446968], "isController": false}, {"data": ["deleteBook", 13, 4, 30.76923076923077, 373.69230769230774, 82, 945, 437.0, 776.1999999999998, 945.0, 945.0, 0.07544060213206748, 0.01628161432733097, 0.05016528020380569], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 4, 30.76923076923077, 373.69230769230774, 82, 945, 437.0, 776.1999999999998, 945.0, 945.0, 0.07563504346105958, 0.016323578715716963, 0.05029457667647983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, 36.36363636363637, 1058.3181818181815, 107, 1726, 1098.5, 1668.1, 1719.6999999999998, 1726.0, 0.09511868217389424, 0.029623254356003288, 0.04291487418392494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 95.47619047619048, 77, 238, 80.0, 206.0000000000001, 237.8, 238.0, 0.09773806199385647, 0.0331429477334078, 0.05535035895466815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 157.16666666666666, 78, 238, 156.5, 238.0, 238.0, 238.0, 0.03392974281254948, 0.009145125992444977, 0.01998011222262435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 111.76190476190474, 78, 249, 83.0, 238.6, 248.0, 249.0, 0.09773806199385647, 0.07263541521223121, 0.04905992564925998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 158.66666666666669, 78, 243, 157.5, 243.0, 243.0, 243.0, 0.03392955094239328, 0.009145074277441939, 0.019946864909492924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9617d15e-955a-411c-83a2-fe4406da05d1", 3, 0, 0.0, 297.3333333333333, 177, 531, 184.0, 531.0, 531.0, 531.0, 0.0471690696687159, 0.030325166860583952, 0.030248394286253363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 166.80952380952382, 79, 619, 84.0, 244.4, 581.5999999999995, 619.0, 0.09773897178601682, 1.3935893851985963, 0.05715529995392306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 151.42857142857142, 79, 931, 81.0, 243.8, 862.299999999999, 931.0, 0.09773897178601682, 4.212979655458489, 0.05705985173928827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7dda4001-6920-4497-962f-747c34a5cc90", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.6286140501968503, 1.174566313976378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 134.83333333333334, 78, 732, 80.0, 295.5000000000007, 732.0, 732.0, 0.10554708572768852, 5.303059628606192, 0.06154622815761698], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67636ff6-e206-42ad-bb66-1549bd221275", 3, 0, 0.0, 343.6666666666667, 187, 532, 312.0, 532.0, 532.0, 532.0, 0.07249353599304062, 0.03280143718435106, 0.04648836780803711], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 139.88888888888886, 79, 504, 82.0, 270.00000000000034, 504.0, 504.0, 0.10554770463061235, 1.751008475334088, 0.06164966298031536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd735c9d-6437-4453-825f-44303486c616", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 133.16666666666666, 79, 245, 80.5, 245.0, 245.0, 245.0, 0.033929359074407084, 0.009078754283581583, 0.01935033759712279], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 90.5, 78, 242, 81.0, 105.20000000000022, 242.0, 242.0, 0.10554027827453372, 0.07843374195988298, 0.05297627249327181], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9617d15e-955a-411c-83a2-fe4406da05d1", 1, 0, 0.0, 618.0, 618, 618, 618.0, 618.0, 618.0, 618.0, 1.6181229773462784, 0.2923366707119741, 1.1156199433656957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=359a5346-c76c-46e4-bfc3-abd5505f3b29", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 107.66666666666667, 79, 239, 81.0, 239.0, 239.0, 239.0, 0.03389868812076973, 0.025192286777251723, 0.017015552435620744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 97.6111111111111, 78, 234, 80.0, 233.1, 234.0, 234.0, 0.10554708572768852, 0.03704913436730386, 0.05970236088307729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 87.16666666666666, 80, 103, 85.5, 103.0, 103.0, 103.0, 0.033135258123660784, 0.02608107231217831, 0.011778548786145045], "isController": false}, {"data": ["deleteAccount", 12, 3, 25.0, 651.6666666666667, 81, 2220, 477.0, 1926.000000000001, 2220.0, 2220.0, 0.09147735935356, 0.01851433859963409, 0.06224301770468059], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1510.3636363636363, 998, 3435, 1317.0, 2219.1, 3263.5499999999975, 3435.0, 0.09507141159439078, 0.04920688295412804, 0.04372913560640435], "isController": false}, {"data": ["goToProfile", 14, 5, 35.714285714285715, 167.21428571428572, 79, 397, 179.5, 318.0, 397.0, 397.0, 0.07854578096947935, 0.10737037316258977, 0.050751225524573604], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/06a5c1e4-b5ea-4364-9476-9ddde84ec68a", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 1.0824947033898307, 2.0226430084745766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 294.6666666666667, 159, 483, 318.5, 483.0, 483.0, 483.0, 0.033883373428658554, 0.052512610968047976, 0.07620450098261783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 12, 0, 0.0, 108.66666666666666, 80, 237, 83.5, 236.1, 237.0, 237.0, 0.060776726565507186, 0.04516707901987399, 0.03050706782682685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 563.0, 462, 716, 516.5, 716.0, 716.0, 716.0, 0.03375627128227416, 9.925464570683523, 0.019251623465671983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 12, 0, 0.0, 106.33333333333333, 77, 244, 80.0, 241.60000000000002, 244.0, 244.0, 0.060729666948384844, 0.03145211592281259, 0.033784830994397684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 890.5, 758, 1068, 898.0, 1068.0, 1068.0, 1068.0, 0.033707770483790776, 30.330311133255243, 0.01919104510942385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 210.5, 80, 325, 238.5, 325.0, 325.0, 325.0, 0.03378820707102703, 0.059789288293653306, 0.01870889981374251], "isController": false}, {"data": ["addBook", 60, 18, 30.0, 837.6, 403, 3046, 690.5, 1474.7, 1552.1, 3046.0, 0.2677029746262197, 75.80169198039968, 0.9731726413694792], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4ae638ca-9acc-48c7-926a-a9f07884ecda", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.9532416044776119, 1.781133395522388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 99.49999999999999, 80, 308, 83.5, 198.5, 308.0, 308.0, 0.09915646181413829, 0.07368951898492114, 0.049771895871549884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 135.5, 77, 244, 81.0, 239.0, 244.0, 244.0, 0.09920845822969593, 0.03718933137042313, 0.05598468380847099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 147.64285714285714, 77, 696, 81.0, 470.5, 696.0, 696.0, 0.09920072558244997, 6.400612664124059, 0.057710243537781314], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 149.37931034482756, 79, 353, 84.0, 322.1, 325.54999999999995, 353.0, 0.24561388650097607, 0.1825314136984793, 0.11872936896287418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 142.2857142857143, 79, 621, 81.5, 432.0, 621.0, 621.0, 0.09931684200818655, 2.1107461488120998, 0.057874783631165626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 102.0, 79, 247, 81.0, 247.0, 247.0, 247.0, 0.033809483560138624, 0.02512599315357958, 0.018984817428788776], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 518.5517241379309, 388, 739, 483.0, 655.8000000000001, 728.4499999999999, 739.0, 0.24550784143579757, 72.18745700967216, 0.12347318197210523], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68218996-cb6f-411d-aa87-68ab316e831a", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 372.1363636363637, 79, 1028, 82.5, 960.1999999999999, 1019.8999999999999, 1028.0, 0.09558526422808382, 31.291954327622836, 0.05320664122071072], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 121.18965517241378, 78, 277, 83.5, 242.1, 245.05, 277.0, 0.2459252726378454, 0.4351724550974373, 0.11960037673207714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 12, 0, 0.0, 213.83333333333334, 79, 894, 81.5, 884.7, 894.0, 894.0, 0.060777957860615885, 9.128336852334886, 0.03486027400729336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7392592d-85c5-4860-a772-328d3f693d90", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 294.4545454545455, 78, 708, 85.5, 662.9, 701.55, 708.0, 0.09558567952728536, 10.236527035540494, 0.053300217783281194], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 770.9827586206897, 545, 1140, 775.0, 947.3000000000001, 1019.0, 1140.0, 0.24536140042134477, 220.77661939846269, 0.12315992169587031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 12, 0, 0.0, 195.91666666666669, 80, 618, 82.0, 570.6000000000001, 618.0, 618.0, 0.060729359608902925, 2.98971507176186, 0.034891705634672414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 97.30769230769229, 80, 245, 84.0, 184.99999999999994, 245.0, 245.0, 0.09311120342649228, 0.06956061584108067, 0.03309812309301093], "isController": false}, {"data": ["deleteBooks", 13, 4, 30.76923076923077, 307.6153846153846, 82, 618, 374.0, 575.1999999999999, 618.0, 618.0, 0.07579158480203821, 0.01635736351684614, 0.05059224929018266], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 18, 10.112359550561798, 144.70786516853943, 80, 1943, 89.0, 261.69999999999993, 320.39999999999986, 1305.4700000000064, 0.7373103911058827, 1.6219882048459517, 0.35219564070409], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 125.66666666666667, 82, 248, 86.5, 247.1, 248.0, 248.0, 0.06178783088670686, 0.04784936513003764, 0.02196364301050908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8311859-f65c-466e-a3c5-dfd6a5a05d58", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 282.57142857142856, 162, 777, 166.5, 663.0, 777.0, 777.0, 0.09898399994343772, 8.600968043634268, 0.2208083369273952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7392592d-85c5-4860-a772-328d3f693d90", 3, 0, 0.0, 289.3333333333333, 239, 376, 253.0, 376.0, 376.0, 376.0, 0.018210624078087153, 0.02510481542014945, 0.011678036925075422], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68218996-cb6f-411d-aa87-68ab316e831a", 3, 0, 0.0, 640.6666666666667, 213, 1240, 469.0, 1240.0, 1240.0, 1240.0, 0.02064594272815487, 0.02440280535349295, 0.013239748429187858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 93.99999999999996, 81, 243, 85.0, 98.8, 228.5999999999998, 243.0, 0.10195709063014338, 0.08274056866567299, 0.03624255955993378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8311859-f65c-466e-a3c5-dfd6a5a05d58", 3, 0, 0.0, 433.0, 171, 948, 180.0, 948.0, 948.0, 948.0, 0.020294541444836056, 0.02035399810922522, 0.013014403205184578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 546.7272727272729, 116, 1431, 471.5, 1023.5999999999999, 1372.0499999999993, 1431.0, 0.09268231031722626, 0.05693083319290559, 0.04190616179382399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 90.54545454545452, 78, 256, 82.0, 92.1, 231.54999999999964, 256.0, 0.09558277250865675, 0.07103368152254667, 0.047978071356884346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3e95364-f430-4e7b-8e51-f5fd0c58491c", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 103.31818181818183, 78, 251, 81.0, 242.9, 250.1, 251.0, 0.09558360306736471, 0.0777804781352508, 0.05159342211022527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3e95364-f430-4e7b-8e51-f5fd0c58491c", 3, 0, 0.0, 593.6666666666666, 385, 999, 397.0, 999.0, 999.0, 999.0, 0.031130665781172174, 0.025952355164577456, 0.019963350126598042], "isController": false}, {"data": ["login", 22, 0, 0.0, 2643.909090909091, 1478, 4341, 2560.5, 3793.2999999999997, 4276.799999999999, 4341.0, 0.09423496202759371, 41.121363253290724, 0.19900275583721339], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 207.16666666666666, 162, 324, 169.0, 322.2, 324.0, 324.0, 0.059398883300993945, 0.09205666777214588, 0.13358948070526275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 12, 0, 0.0, 87.25, 80, 96, 87.0, 95.7, 96.0, 96.0, 0.061851525413245505, 0.050073158757402855, 0.02198628442423961], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd735c9d-6437-4453-825f-44303486c616", 3, 0, 0.0, 878.0, 192, 2220, 222.0, 2220.0, 2220.0, 2220.0, 0.037261063430750314, 0.03106301544471079, 0.023894627265162147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 253.55555555555551, 160, 814, 166.5, 520.6000000000005, 814.0, 814.0, 0.10549079592805528, 7.165722148598437, 0.23575178308748118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67636ff6-e206-42ad-bb66-1549bd221275", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.009296438547486, 3.85169343575419], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/359a5346-c76c-46e4-bfc3-abd5505f3b29", 3, 0, 0.0, 516.0, 184, 920, 444.0, 920.0, 920.0, 920.0, 0.05380393844829442, 0.03522126309229169, 0.034503176674199214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1db26a25-b21e-4926-af90-37c312e1d261", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d10eca1e-6199-43e4-b6f7-dfaf2e7f171a", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 100.49999999999999, 81, 244, 86.0, 177.5, 244.0, 244.0, 0.09690257830074407, 0.0803420790794255, 0.03444583838034262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 466.00000000000006, 160, 1119, 169.5, 1044.4, 1109.2499999999998, 1119.0, 0.09554873202489479, 41.66132541563699, 0.20600150543541992], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 88.77272727272727, 82, 131, 86.0, 99.4, 126.34999999999994, 131.0, 0.09578168741210942, 0.07436175927014355, 0.03404739669727327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, 50.0, 536.9999999999999, 79, 1149, 462.5, 1097.2, 1149.0, 1149.0, 0.06554368486596317, 39.21528591384283, 0.09547119380653143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 303.0952380952381, 161, 1012, 170.0, 490.0, 959.9999999999993, 1012.0, 0.09770032055009932, 5.710089419055284, 0.21853995158018635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65a60398-0867-4a23-84ed-ae772f10b467", 3, 0, 0.0, 318.6666666666667, 175, 423, 358.0, 423.0, 423.0, 423.0, 0.07525020693806908, 0.03404875899867058, 0.04825615483984248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65a60398-0867-4a23-84ed-ae772f10b467", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 0.9508634868421052, 3.6287006578947367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 92.99999999999999, 79, 234, 82.0, 174.39999999999995, 234.0, 234.0, 0.08926303068588338, 0.06633707651558327, 0.04480585719975006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 116.53846153846156, 77, 245, 81.0, 241.0, 245.0, 245.0, 0.08926486946729473, 0.03419853021959158, 0.050332189770245964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 172.07692307692307, 77, 929, 82.0, 662.1999999999998, 929.0, 929.0, 0.08926548241126668, 6.2007658484855765, 0.051888243907630825], "isController": false}, {"data": ["register", 22, 8, 36.36363636363637, 1058.3181818181815, 107, 1726, 1098.5, 1668.1, 1719.6999999999998, 1726.0, 0.10039794092950238, 0.031267398506808805, 0.045296727255302836], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 173.30769230769232, 79, 648, 81.0, 486.39999999999986, 648.0, 648.0, 0.08926548241126668, 2.041210289735156, 0.051975417230298075], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 19.047619047619047, 0.5934718100890207], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 11.904761904761905, 0.37091988130563797], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.142857142857143, 0.22255192878338279], "isController": false}, {"data": ["401/Unauthorized", 26, 61.904761904761905, 1.9287833827893175], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1348, 42, "401/Unauthorized", 26, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 18, "401/Unauthorized", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
