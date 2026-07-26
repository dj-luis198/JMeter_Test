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

    var data = {"OkPercent": 97.4569932685116, "KoPercent": 2.543006731488407};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.721401028277635, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3c45328c-6978-487a-b62c-28b215f5b5a0"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1d265fa0-0115-40b1-91a2-f4e808fb25ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43c5afe2-90e3-4e80-978d-b8096321e573"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f080286-8e25-4719-ac82-8d1c897b44a8"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc90ee4e-fa99-45d0-a426-ab658a93cd1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e2e2254-40b2-49ff-bbac-714617035e58"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6304347826086957, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7ea432b3-e6f7-4e12-83bb-20dce74828cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6136363636363636, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c8a11424-cfc1-4354-bc42-a8b3c233c182"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4bd126e9-70da-4f30-ab54-3887ebad3ed8"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.17857142857142858, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.14583333333333334, 500, 1500, "register"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/6cf7dfca-387d-4822-a271-c6572622ceac"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b758618a-4ca2-4a1c-a8ef-c0253d03fbe0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4bd126e9-70da-4f30-ab54-3887ebad3ed8"], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c45328c-6978-487a-b62c-28b215f5b5a0"], "isController": false}, {"data": [0.14583333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/43c5afe2-90e3-4e80-978d-b8096321e573"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f080286-8e25-4719-ac82-8d1c897b44a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d2363059-8644-49f1-8d82-a93ebe67c4f4"], "isController": false}, {"data": [0.2627118644067797, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/886546f7-2e79-4724-9ecf-e5b7c3a9f3e5"], "isController": false}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7e2e2254-40b2-49ff-bbac-714617035e58"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3684210526315789, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9085714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bcd83d37-ae7a-4004-9e57-de6cc8cb256a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ea432b3-e6f7-4e12-83bb-20dce74828cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=886546f7-2e79-4724-9ecf-e5b7c3a9f3e5"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8a11424-cfc1-4354-bc42-a8b3c233c182"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fc90ee4e-fa99-45d0-a426-ab658a93cd1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b758618a-4ca2-4a1c-a8ef-c0253d03fbe0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cf7dfca-387d-4822-a271-c6572622ceac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/13d04523-71fe-441b-b66f-889a69350967"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1337, 34, 2.543006731488407, 456.65968586387464, 126, 2832, 144.0, 1294.0, 1572.5999999999995, 2014.9799999999968, 5.243096132579352, 754.0138318768088, 3.8368418433973064], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/3c45328c-6978-487a-b62c-28b215f5b5a0", 3, 0, 0.0, 384.3333333333333, 219, 581, 353.0, 581.0, 581.0, 581.0, 0.027521420839219858, 0.02760205000183476, 0.01764882781681742], "isController": false}, {"data": ["see books", 57, 0, 0.0, 2181.631578947369, 1592, 3046, 2105.0, 2754.8, 2783.4, 3046.0, 0.25270662091346796, 304.09013164712627, 1.242556480761046], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1d265fa0-0115-40b1-91a2-f4e808fb25ce", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43c5afe2-90e3-4e80-978d-b8096321e573", 1, 0, 0.0, 342.0, 342, 342, 342.0, 342.0, 342.0, 342.0, 2.923976608187134, 0.5282574926900584, 2.0159448099415203], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f080286-8e25-4719-ac82-8d1c897b44a8", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 501.7857142857143, 133, 783, 557.5, 737.0, 783.0, 783.0, 0.08009382419405589, 0.01643107819159587, 0.05361749656740754], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 501.7857142857143, 133, 783, 557.5, 737.0, 783.0, 783.0, 0.08178095555205066, 0.016777189612066198, 0.05474691897551829], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc90ee4e-fa99-45d0-a426-ab658a93cd1b", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.29911268625827814, 1.1414786837748345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 212.31249999999997, 127, 395, 133.0, 395.0, 395.0, 395.0, 0.09825656016064947, 0.03551485286080116, 0.055521193479449026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 133.1875, 127, 142, 133.0, 141.3, 142.0, 142.0, 0.09825293991218643, 0.07301805397770887, 0.049318370229359206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 208.43749999999997, 127, 1138, 131.0, 608.1000000000006, 1138.0, 1138.0, 0.09825716356133089, 1.8305074483535784, 0.05733267112099142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 243.49999999999997, 127, 1176, 130.5, 628.6000000000006, 1176.0, 1176.0, 0.0982553533815194, 5.550473938151325, 0.05723566239460578], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 308.2857142857143, 127, 731, 260.5, 683.0, 731.0, 731.0, 0.07948132756525984, 0.12405651406251775, 0.051366803842922186], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 150.2142857142857, 127, 388, 130.5, 269.0, 388.0, 388.0, 0.073101705358355, 0.05432656032979312, 0.036693629447455536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 147.85714285714283, 127, 377, 130.0, 256.0, 377.0, 377.0, 0.0731020870645857, 0.02740308425537692, 0.041252503093784754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 785.0, 636, 1015, 777.0, 1015.0, 1015.0, 1015.0, 0.052605968147086284, 15.4679013177795, 0.030001841208885147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1242.625, 1034, 1513, 1147.5, 1513.0, 1513.0, 1513.0, 0.052423952503899036, 47.17116461448736, 0.029846840146262828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 308.0, 126, 510, 383.0, 510.0, 510.0, 510.0, 0.052782982766356124, 0.09340113747327862, 0.029226514871605394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 134.85714285714286, 128, 164, 133.0, 150.5, 164.0, 164.0, 0.08699434536755112, 0.06465107111787734, 0.043667083514571554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 172.57142857142858, 128, 399, 132.0, 394.5, 399.0, 399.0, 0.0869678653737444, 0.02327069835195895, 0.0495988607209636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 173.1428571428571, 126, 386, 131.5, 383.0, 386.0, 386.0, 0.0869441011532514, 0.023434152263962293, 0.05111362196704819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 192.42857142857142, 128, 392, 133.5, 392.0, 392.0, 392.0, 0.08695274118516585, 0.023436481022564237, 0.051203616147124036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 164.87500000000003, 130, 393, 132.0, 393.0, 393.0, 393.0, 0.052779152234867226, 0.03922356919016989, 0.029636730991258454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 739.5, 128, 1777, 136.0, 1685.5, 1763.9499999999998, 1777.0, 0.1052485540283884, 43.06221602325515, 0.05776336656636161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 250.57142857142858, 129, 1035, 132.0, 712.0, 1035.0, 1035.0, 0.07310285048900585, 4.7167299218452206, 0.04252774644798471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 553.7272727272727, 128, 1172, 133.5, 1156.8, 1171.25, 1172.0, 0.1052485540283884, 14.082095815652373, 0.05786614835740495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 266.64285714285717, 127, 999, 132.5, 696.0, 999.0, 999.0, 0.07310246877480261, 1.553621231959355, 0.042598913514557836], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 431.07142857142856, 135, 987, 448.5, 810.0, 987.0, 987.0, 0.08195905559751078, 0.016813726458724833, 0.05525490181012428], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e2e2254-40b2-49ff-bbac-714617035e58", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 0.7787244073275862, 2.9717807112068964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 367.2142857142857, 259, 564, 270.0, 545.5, 564.0, 564.0, 0.0868723472908238, 0.13463517104544664, 0.19537794512770235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 674.1739130434783, 225, 1654, 681.0, 1132.2, 1553.3999999999985, 1654.0, 0.09928171835071482, 0.060984571135351204, 0.04489007382459079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 133.7272727272727, 129, 152, 132.0, 143.1, 150.79999999999998, 152.0, 0.10524452608868287, 0.07821394956395279, 0.05282781875935839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 178.95454545454547, 127, 396, 133.0, 393.7, 395.7, 396.0, 0.1052460365299425, 0.10001363414564138, 0.05600539266339447], "isController": false}, {"data": ["login", 23, 0, 0.0, 3294.9130434782605, 2032, 4746, 3380.0, 4320.6, 4680.999999999999, 4746.0, 0.09687188062014851, 40.44023432728797, 0.20203167052399265], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7ea432b3-e6f7-4e12-83bb-20dce74828cf", 3, 0, 0.0, 1193.0, 327, 2191, 1061.0, 2191.0, 2191.0, 2191.0, 0.059417706476530004, 0.026884964844523667, 0.03810315161418103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 159.00000000000003, 129, 395, 135.0, 284.0, 395.0, 395.0, 0.07153002728359611, 0.057908586541114436, 0.025426689385965807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 874.9545454545453, 262, 1910, 276.0, 1819.4, 1896.9499999999998, 1910.0, 0.10517710390063632, 57.283630229572935, 0.22431370445711882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8a11424-cfc1-4354-bc42-a8b3c233c182", 3, 0, 0.0, 714.3333333333333, 245, 1521, 377.0, 1521.0, 1521.0, 1521.0, 0.0571374154842396, 0.03673385272831159, 0.03664085563279688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4bd126e9-70da-4f30-ab54-3887ebad3ed8", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 428.3125, 259, 1310, 273.0, 762.6000000000006, 1310.0, 1310.0, 0.09817336188541942, 7.48323215277309, 0.2192242808801242], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, 42.857142857142854, 860.2142857142857, 127, 1821, 1213.5, 1734.0, 1821.0, 1821.0, 0.09165962851661985, 62.6715293327179, 0.14413246412180256], "isController": false}, {"data": ["register", 24, 9, 37.5, 1271.0833333333333, 251, 1997, 1335.5, 1935.5, 1988.5, 1997.0, 0.09716481176341987, 0.030221672408837143, 0.04383803030732421], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6cf7dfca-387d-4822-a271-c6572622ceac", 3, 0, 0.0, 1124.6666666666667, 731, 1613, 1030.0, 1613.0, 1613.0, 1613.0, 0.017882049998211795, 0.02113597771598536, 0.011467330239738685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b758618a-4ca2-4a1c-a8ef-c0253d03fbe0", 3, 0, 0.0, 582.0, 235, 997, 514.0, 997.0, 997.0, 997.0, 0.04853033955060906, 0.031200332230616173, 0.031121344047753855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 136.35714285714283, 130, 153, 134.5, 151.5, 153.0, 153.0, 0.0675659371154171, 0.052455976569098235, 0.024017579208995922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 458.2857142857143, 263, 1165, 387.5, 969.5, 1165.0, 1165.0, 0.07305097392602024, 6.3475823633425, 0.16295829702526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 480.75, 263, 1421, 395.5, 801.1, 1390.0499999999997, 1421.0, 0.13393245786150043, 8.208679796372438, 0.29950384302446276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 139.55555555555554, 130, 165, 135.0, 165.0, 165.0, 165.0, 0.04149683701886722, 0.03083895797984176, 0.02082946701923609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 130.22222222222223, 126, 133, 130.0, 133.0, 133.0, 133.0, 0.041497793700634916, 0.011103901830052703, 0.02366671046989335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 131.33333333333334, 129, 133, 131.0, 133.0, 133.0, 133.0, 0.041498367730869255, 0.011185106927460853, 0.024396501341780556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 130.66666666666666, 128, 134, 130.0, 134.0, 134.0, 134.0, 0.04149760236075249, 0.01118490063629657, 0.02443657639016968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 140.0, 135, 144, 141.0, 144.0, 144.0, 144.0, 0.0367498438131638, 0.010838332843335416, 0.022717432747785822], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4bd126e9-70da-4f30-ab54-3887ebad3ed8", 3, 0, 0.0, 394.3333333333333, 255, 523, 405.0, 523.0, 523.0, 523.0, 0.02703238479698679, 0.027111581236821714, 0.017335220719421868], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1549.7368421052636, 1043, 2484, 1535.0, 2210.4, 2237.0, 2484.0, 0.2556214291480183, 305.8120976485071, 0.5047524704465751], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c45328c-6978-487a-b62c-28b215f5b5a0", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1271.0833333333333, 251, 1997, 1335.5, 1935.5, 1988.5, 1997.0, 0.0965825861597154, 0.030040579777216168, 0.04357534649002785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43c5afe2-90e3-4e80-978d-b8096321e573", 3, 0, 0.0, 1056.3333333333333, 328, 1985, 856.0, 1985.0, 1985.0, 1985.0, 0.07690730106644791, 0.03479855093826907, 0.04931880960315832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 133.42857142857144, 130, 144, 132.0, 144.0, 144.0, 144.0, 0.03784663462318268, 0.010200850738279709, 0.02228664128689371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 131.0, 128, 134, 131.0, 134.0, 134.0, 134.0, 0.03784745313674285, 0.01020107135326272, 0.022250162879217963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 322.4285714285714, 129, 1369, 133.0, 1197.0, 1369.0, 1369.0, 0.0648403306856865, 8.349757500057894, 0.037322991686543315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 279.35714285714283, 128, 1018, 132.5, 901.0, 1018.0, 1018.0, 0.06484063099196903, 2.7385939830210178, 0.03738648547569866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 133.42857142857144, 129, 149, 132.5, 143.0, 149.0, 149.0, 0.06483912948837295, 0.04818611087954279, 0.03254620366896845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 131.71428571428572, 129, 133, 132.0, 133.0, 133.0, 133.0, 0.0378464300003244, 0.010126876777430552, 0.02158429210956001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 186.3571428571429, 126, 391, 132.5, 389.0, 391.0, 391.0, 0.06483912948837295, 0.031261723146179816, 0.03620064121267697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 132.42857142857142, 128, 139, 132.0, 139.0, 139.0, 139.0, 0.037844997702268, 0.028125042237720648, 0.01899641486227124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 174.28571428571428, 134, 399, 137.0, 399.0, 399.0, 399.0, 0.0372059401941087, 0.02928514433247228, 0.013225549053374579], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 639.7142857142857, 130, 1521, 518.5, 1291.0, 1521.0, 1521.0, 0.08318083513558476, 0.016576984234261, 0.0566007984617487], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1643.2608695652177, 1227, 2832, 1516.0, 2239.2000000000003, 2726.7999999999984, 2832.0, 0.0952515053879221, 0.04930009556210812, 0.04381197171651495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 267.7142857142857, 261, 278, 267.0, 278.0, 278.0, 278.0, 0.03781780462241623, 0.05861021087477984, 0.08505312895060994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f080286-8e25-4719-ac82-8d1c897b44a8", 3, 0, 0.0, 368.6666666666667, 266, 483, 357.0, 483.0, 483.0, 483.0, 0.02257268404261723, 0.02668014835896587, 0.014475321472641908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2363059-8644-49f1-8d82-a93ebe67c4f4", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["addBook", 59, 13, 22.033898305084747, 1266.406779661017, 659, 2683, 1095.0, 2238.0, 2440.0, 2683.0, 0.27521994271693395, 84.81101424234049, 0.9997131181953035], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/886546f7-2e79-4724-9ecf-e5b7c3a9f3e5", 3, 0, 0.0, 578.6666666666666, 312, 952, 472.0, 952.0, 952.0, 952.0, 0.024129139152745494, 0.02419982999010705, 0.015473438844696817], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 231.08771929824562, 128, 543, 134.0, 530.2, 537.2, 543.0, 0.25723762890087326, 0.19116976132184038, 0.12434826787688696], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 881.4210526315791, 630, 1312, 881.0, 1150.8, 1175.3999999999996, 1312.0, 0.2566839140243985, 75.47359343125599, 0.12909396066656761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e2e2254-40b2-49ff-bbac-714617035e58", 3, 0, 0.0, 590.6666666666666, 241, 1023, 508.0, 1023.0, 1023.0, 1023.0, 0.07266561705219814, 0.032879299382342256, 0.046598719268499456], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 217.35087719298247, 126, 533, 134.0, 395.6, 400.69999999999993, 533.0, 0.25774594389277766, 0.4560895022790168, 0.12534910161972979], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1311.7368421052638, 885, 1940, 1386.0, 1677.2, 1697.2999999999997, 1940.0, 0.25627537463413314, 230.59703257985, 0.12863822515814888], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 163.4, 130, 400, 135.5, 360.1000000000005, 399.09999999999997, 400.0, 0.1396540768516385, 0.10433141483545258, 0.049642660130855866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 13, 7.428571428571429, 193.07999999999993, 128, 588, 137.0, 353.6, 407.79999999999967, 581.1600000000001, 0.7453310334547157, 1.6456094012862286, 0.3566733413722609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 167.66666666666666, 134, 388, 138.0, 388.0, 388.0, 388.0, 0.043437970578014594, 0.03363897526207575, 0.015440841103903626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bcd83d37-ae7a-4004-9e57-de6cc8cb256a", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.6543769211065574, 1.2227042776639345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 160.1875, 132, 407, 142.0, 242.50000000000017, 407.0, 407.0, 0.10131391483299033, 0.08221861643185055, 0.036013930663289534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ea432b3-e6f7-4e12-83bb-20dce74828cf", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 0.7753822424892703, 2.9590262875536477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 272.8888888888889, 260, 297, 271.0, 297.0, 297.0, 297.0, 0.04147121436931499, 0.06427228242588172, 0.09326973309817618], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=886546f7-2e79-4724-9ecf-e5b7c3a9f3e5", 1, 0, 0.0, 570.0, 570, 570, 570.0, 570.0, 570.0, 570.0, 1.7543859649122808, 0.3169544956140351, 1.2095668859649125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 494.64285714285717, 262, 1501, 284.0, 1329.0, 1501.0, 1501.0, 0.06479921500379537, 11.160706537083666, 0.1433664551820858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8a11424-cfc1-4354-bc42-a8b3c233c182", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 628.0, 1.5923566878980893, 0.2876816281847134, 1.0978552945859872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc90ee4e-fa99-45d0-a426-ab658a93cd1b", 3, 0, 0.0, 498.3333333333333, 360, 635, 500.0, 635.0, 635.0, 635.0, 0.030513542927469307, 0.025437885233479462, 0.019567604025753433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 156.85714285714283, 133, 397, 137.5, 274.5, 397.0, 397.0, 0.08551811762406235, 0.0709032049441689, 0.030399018374178414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b758618a-4ca2-4a1c-a8ef-c0253d03fbe0", 1, 0, 0.0, 633.0, 633, 633, 633.0, 633.0, 633.0, 633.0, 1.5797788309636651, 0.2854092614533965, 1.0891834518167456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 160.31818181818184, 132, 402, 136.0, 312.79999999999984, 399.15, 402.0, 0.10143998672058355, 0.0787546771902968, 0.03605874527958244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cf7dfca-387d-4822-a271-c6572622ceac", 1, 0, 0.0, 987.0, 987, 987, 987.0, 987.0, 987.0, 987.0, 1.0131712259371835, 0.18304362968591692, 0.6985340678824722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 171.85, 128, 402, 131.0, 398.40000000000003, 401.85, 402.0, 0.1342750490103929, 0.09978839091495018, 0.06739978046029486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 208.95000000000002, 127, 413, 131.5, 393.9, 412.05, 413.0, 0.13427865506499087, 0.04601404302959502, 0.07601693002067891], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13d04523-71fe-441b-b66f-889a69350967", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 1.1528373194945847, 2.1540782942238264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 292.95, 128, 1288, 135.0, 399.9, 1243.5999999999995, 1288.0, 0.1340563438813333, 6.065532448756962, 0.07823444443699687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 224.95, 127, 949, 132.0, 399.0, 921.4999999999997, 949.0, 0.13405274975702938, 2.0051228048862226, 0.07836325781695097], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 26.470588235294116, 0.6731488406881077], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.823529411764707, 0.2243829468960359], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.823529411764707, 0.2243829468960359], "isController": false}, {"data": ["401/Unauthorized", 19, 55.88235294117647, 1.4210919970082274], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1337, 34, "401/Unauthorized", 19, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
