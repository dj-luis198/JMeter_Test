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

    var data = {"OkPercent": 99.31350114416476, "KoPercent": 0.6864988558352403};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8052459016393443, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.15178571428571427, 500, 1500, "see books"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4898cb85-3434-43c4-bb89-b10d9815eb25"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/db64fe3b-1a84-4a07-baa2-a93495784373"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/48e44e42-d270-49a4-ad2a-3d7ee91ee52e"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2cf545d6-9c59-4de4-9fd7-e70eef89d22c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fafb03dc-f877-4257-b88a-fc6a42bad5cf"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/770d8f34-58a4-4444-9f65-87f196d62c6d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ca8550d-3af8-4212-88f4-ec0ccd9d73d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fcb7f2a7-6f0e-4ff7-be10-abd8365c2cce"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99956a6e-8299-49db-83ab-1eeda21cce1f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/69d630f0-0a0d-4c71-a967-52ce65603d40"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2aa454c-a200-488b-ab61-3d98e4526fc4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/74255ca8-f9d0-4892-8a93-54d8988be9c9"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d8ea1f49-535a-4a63-af65-302ebbf25cfc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93ef255f-d988-4f7a-a0fd-626b01b53ec2"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.48214285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4898cb85-3434-43c4-bb89-b10d9815eb25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db64fe3b-1a84-4a07-baa2-a93495784373"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2cf545d6-9c59-4de4-9fd7-e70eef89d22c"], "isController": false}, {"data": [0.3114754098360656, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/89e9d1f9-3b56-4576-adc6-bb621e667994"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7ca8550d-3af8-4212-88f4-ec0ccd9d73d8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7fccf9ce-e087-4aad-bda3-f6dd2a13ed78"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5d112770-6b72-4569-84c0-f19fbbaa77fc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9634831460674157, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fafb03dc-f877-4257-b88a-fc6a42bad5cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a2aa454c-a200-488b-ab61-3d98e4526fc4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69d630f0-0a0d-4c71-a967-52ce65603d40"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7fccf9ce-e087-4aad-bda3-f6dd2a13ed78"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d112770-6b72-4569-84c0-f19fbbaa77fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/99956a6e-8299-49db-83ab-1eeda21cce1f"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/93ef255f-d988-4f7a-a0fd-626b01b53ec2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74255ca8-f9d0-4892-8a93-54d8988be9c9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8ea1f49-535a-4a63-af65-302ebbf25cfc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c7a9374a-70f4-4894-a446-fd0c477e6bd6"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1311, 9, 0.6864988558352403, 362.93821510297465, 113, 2707, 135.0, 918.1999999999998, 1130.3999999999999, 1496.0, 5.107467187153025, 711.7785711729059, 3.72453342863571], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1691.7499999999998, 1372, 2119, 1748.0, 1973.3, 2011.8999999999999, 2119.0, 0.25794564716720403, 310.3957484670083, 1.2683167319207738], "isController": true}, {"data": ["deleteBook", 14, 0, 0.0, 495.2142857142858, 390, 727, 466.0, 709.5, 727.0, 727.0, 0.07812848787892317, 0.014115010017188267, 0.05310295660520559], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 495.2142857142858, 390, 727, 466.0, 709.5, 727.0, 727.0, 0.07861900108943473, 0.014203628126509204, 0.053436352302975165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 151.10526315789474, 113, 345, 116.0, 339.0, 345.0, 345.0, 0.09149218945624747, 0.03171378113142131, 0.05177472275458905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 128.1578947368421, 114, 338, 116.0, 121.0, 338.0, 338.0, 0.09159274971075974, 0.0680684399705939, 0.0459752669446587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 210.5789473684211, 113, 788, 116.0, 348.0, 788.0, 788.0, 0.09149086776680422, 1.439222451016271, 0.05346215438120874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 234.1578947368421, 113, 1010, 117.0, 346.0, 1010.0, 1010.0, 0.09159495745655266, 4.3611411782606595, 0.053433530383011546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4898cb85-3434-43c4-bb89-b10d9815eb25", 3, 0, 0.0, 328.0, 254, 411, 319.0, 411.0, 411.0, 411.0, 0.08802816901408451, 0.0398304540786385, 0.05645035578051644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db64fe3b-1a84-4a07-baa2-a93495784373", 3, 0, 0.0, 940.6666666666667, 203, 2233, 386.0, 2233.0, 2233.0, 2233.0, 0.028746095322052086, 0.028830312398190915, 0.018434182221498247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48e44e42-d270-49a4-ad2a-3d7ee91ee52e", 2, 0, 0.0, 235.5, 220, 251, 235.5, 251.0, 251.0, 251.0, 0.014294495189902369, 0.02809342926726418, 0.008885201355832869], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 236.35714285714286, 193, 369, 210.0, 322.0, 369.0, 369.0, 0.07858634393874755, 0.18244902938848598, 0.05080484344477625], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 131.33333333333331, 115, 340, 116.0, 209.80000000000007, 340.0, 340.0, 0.08312275568559649, 0.061773844801502865, 0.041723726974996676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 183.4, 113, 461, 116.0, 390.20000000000005, 461.0, 461.0, 0.0831236769481419, 0.030565268711139678, 0.04694106600574107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 1241.0, 567, 2587, 569.0, 2587.0, 2587.0, 2587.0, 0.03269291544522302, 9.612802647853709, 0.01864517833985375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 950.6666666666666, 816, 1018, 1018.0, 1018.0, 1018.0, 1018.0, 0.032533726629939703, 29.273904409811088, 0.018522619751225437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 939.6666666666667, 339, 2137, 343.0, 2137.0, 2137.0, 2137.0, 0.03277506473075285, 0.05799650126183999, 0.018147911818688342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 118.33333333333333, 114, 146, 116.0, 132.20000000000002, 146.0, 146.0, 0.07581807705138444, 0.05634527015244488, 0.0380571207074332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 145.26666666666668, 113, 339, 115.0, 338.4, 339.0, 339.0, 0.07581884350990699, 0.027879220582288717, 0.04281592764355034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 220.79999999999998, 113, 1016, 115.0, 612.2000000000003, 1016.0, 1016.0, 0.07581960998392624, 4.567247926649582, 0.04413925471850706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 190.8, 113, 789, 115.0, 520.2000000000002, 789.0, 789.0, 0.07581884350990699, 1.5052903387838656, 0.04421285034623938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2cf545d6-9c59-4de4-9fd7-e70eef89d22c", 1, 0, 0.0, 786.0, 786, 786, 786.0, 786.0, 786.0, 786.0, 1.272264631043257, 0.22985249681933842, 0.8771668256997455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 120.66666666666667, 119, 123, 120.0, 123.0, 123.0, 123.0, 0.03285402954672391, 0.02441593406743837, 0.018448307606802973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 763.7857142857142, 114, 1046, 1018.0, 1039.0, 1046.0, 1046.0, 0.13538342520065758, 87.02345714268446, 0.07128027995358283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 235.73333333333335, 113, 1010, 116.0, 611.6000000000003, 1010.0, 1010.0, 0.08301832491158548, 5.000886609766829, 0.048330069098919105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 557.3571428571429, 116, 925, 574.0, 916.5, 925.0, 925.0, 0.13538866216660542, 28.445256138425236, 0.0714152527416204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 190.79999999999998, 113, 566, 116.0, 434.6000000000001, 566.0, 566.0, 0.0830178654446437, 1.6482181079951739, 0.048410873749197496], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 651.9230769230769, 218, 1200, 606.0, 1134.8, 1200.0, 1200.0, 0.08133133133133133, 0.014693648726851851, 0.0560741405467968], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fafb03dc-f877-4257-b88a-fc6a42bad5cf", 1, 0, 0.0, 1037.0, 1037, 1037, 1037.0, 1037.0, 1037.0, 1037.0, 0.9643201542912248, 0.17421799662487947, 0.664853543876567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 370.53333333333336, 230, 1133, 244.0, 732.8000000000002, 1133.0, 1133.0, 0.07577364895583912, 6.153047221506582, 0.1691242192156922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/770d8f34-58a4-4444-9f65-87f196d62c6d", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 1.5501744538834952, 2.896503337378641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 498.99999999999994, 218, 1162, 465.0, 972.0000000000002, 1151.4999999999998, 1162.0, 0.09641430604655434, 0.05922324072586199, 0.04359357783159634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 116.64285714285714, 114, 119, 116.5, 119.0, 119.0, 119.0, 0.13538342520065758, 0.10061209626728557, 0.06795613335267382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 181.85714285714283, 113, 353, 116.0, 351.5, 353.0, 353.0, 0.13539128080151638, 0.18147871455649686, 0.06909337404742563], "isController": false}, {"data": ["login", 21, 0, 0.0, 2412.952380952381, 1353, 5066, 2238.0, 4256.6, 5010.699999999999, 5066.0, 0.09524371051354502, 16.41166858051722, 0.1662645856104895], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ca8550d-3af8-4212-88f4-ec0ccd9d73d8", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 120.60000000000001, 115, 141, 118.0, 136.2, 141.0, 141.0, 0.0801042423206733, 0.0648500164881232, 0.02847455488742684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fcb7f2a7-6f0e-4ff7-be10-abd8365c2cce", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 1.6719159031413613, 3.1239774214659684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99956a6e-8299-49db-83ab-1eeda21cce1f", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.29812551567656764, 1.1377114273927393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69d630f0-0a0d-4c71-a967-52ce65603d40", 3, 0, 0.0, 422.6666666666667, 208, 638, 422.0, 638.0, 638.0, 638.0, 0.037985742684579056, 0.031444578010053556, 0.024359346708535394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 881.642857142857, 235, 1166, 1135.0, 1157.5, 1166.0, 1166.0, 0.1352265043948614, 115.61552961701922, 0.27941402854245145], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2aa454c-a200-488b-ab61-3d98e4526fc4", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74255ca8-f9d0-4892-8a93-54d8988be9c9", 3, 0, 0.0, 781.3333333333334, 207, 1686, 451.0, 1686.0, 1686.0, 1686.0, 0.027388505957000046, 0.022832670493449583, 0.01756359268726891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 400.1578947368422, 232, 1125, 458.0, 687.0, 1125.0, 1125.0, 0.09143891158819764, 5.891765880893599, 0.20441691301031337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1662.3333333333333, 1138, 2707, 1142.0, 2707.0, 2707.0, 2707.0, 0.03249144391976779, 38.871062781592514, 0.07326439844799204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8ea1f49-535a-4a63-af65-302ebbf25cfc", 3, 0, 0.0, 407.0, 199, 810, 212.0, 810.0, 810.0, 810.0, 0.028652200488997553, 0.028736142482617667, 0.018373969714624083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93ef255f-d988-4f7a-a0fd-626b01b53ec2", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 988.2272727272727, 253, 1802, 967.0, 1480.7, 1756.0999999999995, 1802.0, 0.09329386720042067, 0.029651282366610975, 0.042091568990814794], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 122.33333333333333, 117, 140, 120.0, 132.8, 140.0, 140.0, 0.08205277817031421, 0.06370308461464824, 0.02916719849022888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 436.46666666666664, 231, 1127, 457.0, 861.2000000000002, 1127.0, 1127.0, 0.08296460176991151, 6.7369741254148225, 0.18517418245298672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 421.3529411764706, 232, 1137, 457.0, 958.5999999999998, 1137.0, 1137.0, 0.08719066546993205, 12.391036711437364, 0.193469314976279], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 136.81818181818184, 114, 343, 116.0, 298.40000000000015, 343.0, 343.0, 0.07100576437705351, 0.052768932315368874, 0.03564156532207569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 142.9090909090909, 113, 351, 115.0, 318.8000000000001, 351.0, 351.0, 0.07100805618673828, 0.028695727251600908, 0.03995463956956207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 249.27272727272725, 114, 1053, 117.0, 911.2000000000005, 1053.0, 1053.0, 0.07100759781296599, 5.825831726920916, 0.04118995420009941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 194.0909090909091, 113, 566, 115.0, 544.8000000000001, 566.0, 566.0, 0.07100851456642847, 1.9154773749120462, 0.04125983024123529], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1109.9642857142858, 902, 1640, 923.5, 1489.5, 1510.1, 1640.0, 0.2453675913227504, 293.54494279868027, 0.4845051461470716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 988.2272727272727, 253, 1802, 967.0, 1480.7, 1756.0999999999995, 1802.0, 0.08911825587471593, 0.02832416157949956, 0.04020765059972536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 201.75, 114, 347, 116.5, 347.0, 347.0, 347.0, 0.04231729507849858, 0.01140583343912657, 0.024919266535483053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 200.75000000000003, 113, 350, 117.0, 350.0, 350.0, 350.0, 0.042317518923865496, 0.011405893772448121, 0.024878072648600612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 216.6666666666667, 114, 1017, 116.0, 422.10000000000093, 1017.0, 1017.0, 0.08213552361396304, 4.12677978125713, 0.04789456422541638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 166.22222222222223, 113, 567, 116.0, 363.6000000000003, 567.0, 567.0, 0.08222144061099666, 1.3640319310390507, 0.04802495820410103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 154.16666666666666, 115, 345, 116.5, 343.2, 345.0, 345.0, 0.08221956277463618, 0.061102624288572396, 0.0412703664708623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 114.375, 113, 116, 114.5, 116.0, 116.0, 116.0, 0.042317518923865496, 0.011323242368299947, 0.02413421001126704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4898cb85-3434-43c4-bb89-b10d9815eb25", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.8287342316513762, 3.162629013761468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 165.27777777777777, 114, 344, 115.5, 340.4, 344.0, 344.0, 0.08213627320349717, 0.02883147176793765, 0.04646011200193477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 119.125, 114, 145, 116.0, 145.0, 145.0, 145.0, 0.042316847394869087, 0.03144836022216345, 0.021241073790002642], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db64fe3b-1a84-4a07-baa2-a93495784373", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 149.0, 117, 344, 120.0, 344.0, 344.0, 344.0, 0.041751038557084105, 0.032862633864267375, 0.014841189487088492], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 490.6923076923077, 376, 810, 433.0, 755.5999999999999, 810.0, 810.0, 0.08020779990004874, 0.0144906669741299, 0.05459456692415427], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1159.7142857142858, 716, 2045, 1038.0, 1734.2, 2013.9999999999995, 2045.0, 0.09436251381736808, 0.048839972971879975, 0.043403070320293335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 322.625, 229, 466, 248.5, 466.0, 466.0, 466.0, 0.042291121507678484, 0.06554297835223218, 0.09511372346892924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2cf545d6-9c59-4de4-9fd7-e70eef89d22c", 3, 0, 0.0, 282.3333333333333, 196, 376, 275.0, 376.0, 376.0, 376.0, 0.03174871946831478, 0.02646760109321424, 0.02035969314862634], "isController": false}, {"data": ["addBook", 61, 5, 8.19672131147541, 1125.8032786885244, 593, 1832, 956.0, 1737.8, 1819.7, 1832.0, 0.2867026376642665, 96.68862400799712, 1.0414405382842022], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/89e9d1f9-3b56-4576-adc6-bb621e667994", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 1.4784071180555556, 2.7624059606481484], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 226.14285714285714, 115, 469, 118.5, 464.3, 467.15, 469.0, 0.24622636117010283, 0.1829865828617659, 0.1190254382609384], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ca8550d-3af8-4212-88f4-ec0ccd9d73d8", 3, 0, 0.0, 397.6666666666667, 292, 532, 369.0, 532.0, 532.0, 532.0, 0.019076081772803864, 0.02254728285060249, 0.012233034209773314], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 642.4821428571428, 561, 920, 570.0, 797.3, 832.5999999999999, 920.0, 0.24614410858471533, 72.37454067751166, 0.12379317961047695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7fccf9ce-e087-4aad-bda3-f6dd2a13ed78", 3, 0, 0.0, 810.6666666666666, 273, 1726, 433.0, 1726.0, 1726.0, 1726.0, 0.038938282821727566, 0.032461244240379, 0.024970187877214615], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 184.28571428571425, 113, 475, 118.0, 348.3, 467.45, 475.0, 0.2466373637989201, 0.4364325226598078, 0.11994668669127168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d112770-6b72-4569-84c0-f19fbbaa77fc", 3, 0, 0.0, 401.3333333333333, 250, 498, 456.0, 498.0, 498.0, 498.0, 0.06848845969454147, 0.03032041184393763, 0.0439200083327626], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 879.6785714285713, 782, 1177, 797.0, 1043.1000000000001, 1133.05, 1177.0, 0.24590739829972602, 221.267909249192, 0.12343398703716714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 120.3529411764706, 116, 138, 119.0, 130.0, 138.0, 138.0, 0.08899638255880304, 0.06648655532957454, 0.03163543286269952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 5, 2.808988764044944, 184.41573033707866, 114, 982, 124.5, 340.2, 403.3999999999995, 914.8500000000007, 0.7142026008209318, 1.5169086149184083, 0.3449779745735849], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fafb03dc-f877-4257-b88a-fc6a42bad5cf", 3, 0, 0.0, 614.3333333333334, 208, 1249, 386.0, 1249.0, 1249.0, 1249.0, 0.02554996295255372, 0.030199191237214373, 0.016384579106943627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 140.45454545454547, 116, 343, 121.0, 300.20000000000016, 343.0, 343.0, 0.06950939008669717, 0.053829049158936375, 0.02470841600738063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 122.05263157894736, 116, 153, 119.0, 141.0, 153.0, 153.0, 0.0879006999671529, 0.07133347819600006, 0.03124595194144888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2aa454c-a200-488b-ab61-3d98e4526fc4", 3, 0, 0.0, 309.6666666666667, 207, 399, 323.0, 399.0, 399.0, 399.0, 0.040361097283698154, 0.025948296593523393, 0.025882604703413206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69d630f0-0a0d-4c71-a967-52ce65603d40", 1, 0, 0.0, 884.0, 884, 884, 884.0, 884.0, 884.0, 884.0, 1.1312217194570138, 0.20437111142533937, 0.7799243495475113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7fccf9ce-e087-4aad-bda3-f6dd2a13ed78", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 398.45454545454544, 230, 1168, 240.0, 1095.2000000000003, 1168.0, 1168.0, 0.070953093554879, 7.816745595264203, 0.15792480544339232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d112770-6b72-4569-84c0-f19fbbaa77fc", 1, 0, 0.0, 943.0, 943, 943, 943.0, 943.0, 943.0, 943.0, 1.0604453870625663, 0.19158437168610817, 0.7311273860021209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99956a6e-8299-49db-83ab-1eeda21cce1f", 3, 0, 0.0, 289.6666666666667, 193, 427, 249.0, 427.0, 427.0, 427.0, 0.02021250075796878, 0.0278645640332024, 0.012961792478254719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 397.5, 231, 1363, 236.5, 751.0000000000009, 1363.0, 1363.0, 0.08209132203513508, 5.576255248998942, 0.1834584275863327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 137.13333333333335, 116, 382, 118.0, 228.4000000000001, 382.0, 382.0, 0.07665693975275582, 0.06355638852547821, 0.02724914655273742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93ef255f-d988-4f7a-a0fd-626b01b53ec2", 3, 0, 0.0, 372.66666666666663, 212, 674, 232.0, 674.0, 674.0, 674.0, 0.022714366837024418, 0.026847612625402237, 0.014566179254211624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74255ca8-f9d0-4892-8a93-54d8988be9c9", 1, 0, 0.0, 1200.0, 1200, 1200, 1200.0, 1200.0, 1200.0, 1200.0, 0.8333333333333334, 0.15055338541666669, 0.5745442708333334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8ea1f49-535a-4a63-af65-302ebbf25cfc", 1, 0, 0.0, 672.0, 672, 672, 672.0, 672.0, 672.0, 672.0, 1.488095238095238, 0.26884533110119047, 1.025971912202381], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 137.5, 116, 348, 121.0, 238.5, 348.0, 348.0, 0.1432356943350283, 0.11120349316049559, 0.05091581322065459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 116.70588235294117, 114, 128, 116.0, 122.39999999999999, 128.0, 128.0, 0.08724257026875844, 0.06483554294387223, 0.043791680779435384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 154.9411764705883, 113, 343, 115.0, 339.8, 343.0, 343.0, 0.08724391345403786, 0.03876059436199039, 0.04889427962187461], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 262.8235294117647, 114, 1020, 116.0, 840.7999999999998, 1020.0, 1020.0, 0.08724301799258947, 9.25620956991758, 0.05040729980293342], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7a9374a-70f4-4894-a446-fd0c477e6bd6", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.8359579515706806, 1.5619887107329842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 262.47058823529414, 114, 797, 117.0, 793.0, 797.0, 797.0, 0.08724301799258947, 3.0386711092179945, 0.05049249806269181], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 44.44444444444444, 0.30511060259344014], "isController": false}, {"data": ["401/Unauthorized", 5, 55.55555555555556, 0.38138825324180015], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1311, 9, "401/Unauthorized", 5, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
