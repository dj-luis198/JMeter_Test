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

    var data = {"OkPercent": 99.05138339920948, "KoPercent": 0.9486166007905138};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.763335584064821, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a525ce75-3f57-4b0a-bfa9-110a78ed9342"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/64ae2f14-ea24-4bc5-9911-574ff2253c8c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/949df4a2-d5be-4a14-b089-6891f02cfb3d"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4d252b60-3783-4764-9633-7e882a5405bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95843139-6be8-4e79-8b8b-4ab7e80022b7"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2174d29-536e-475f-abd1-e7bdcbcfea75"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3bc0aec2-193c-4fc6-aceb-24b013fe9cba"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e16d7610-b7a3-458f-b154-9ab6a1cedb19"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be2ed811-1830-41fc-98ed-b959219f2fe5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acb73abf-193e-47b4-bf8a-3455d114d06e"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b6f03449-0f09-4905-9b3c-d519c5ddf128"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/51f695f5-cb8c-4346-b243-df7ee08cf6e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5834d8fc-2b69-4436-b674-22e0626654e6"], "isController": false}, {"data": [0.32, 500, 1500, "register"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d11bece9-5435-4d8f-a984-f233485a744f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b2174d29-536e-475f-abd1-e7bdcbcfea75"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/825a1448-368b-4658-bb05-944233ae9586"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3bc0aec2-193c-4fc6-aceb-24b013fe9cba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8c6191fd-e984-40d7-91b7-600283c0efa4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.38181818181818183, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26b23fe3-fb20-4455-996e-c98ed99e309d"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a525ce75-3f57-4b0a-bfa9-110a78ed9342"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/be2ed811-1830-41fc-98ed-b959219f2fe5"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64ae2f14-ea24-4bc5-9911-574ff2253c8c"], "isController": false}, {"data": [0.29464285714285715, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d252b60-3783-4764-9633-7e882a5405bc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/95843139-6be8-4e79-8b8b-4ab7e80022b7"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9520958083832335, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e16d7610-b7a3-458f-b154-9ab6a1cedb19"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/acb73abf-193e-47b4-bf8a-3455d114d06e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/26b23fe3-fb20-4455-996e-c98ed99e309d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6f03449-0f09-4905-9b3c-d519c5ddf128"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d11bece9-5435-4d8f-a984-f233485a744f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51f695f5-cb8c-4346-b243-df7ee08cf6e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=825a1448-368b-4658-bb05-944233ae9586"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5834d8fc-2b69-4436-b674-22e0626654e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1265, 12, 0.9486166007905138, 423.79209486166013, 125, 3721, 155.0, 1080.4, 1288.7, 1717.7799999999986, 4.938127025022446, 694.3964022609497, 3.5969270589354725], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1957.2181818181816, 1564, 2583, 1928.0, 2279.4, 2333.7999999999997, 2583.0, 0.23965872597421273, 288.389761956247, 1.1784000832814072], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a525ce75-3f57-4b0a-bfa9-110a78ed9342", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["deleteBook", 15, 0, 0.0, 784.2, 432, 3166, 604.0, 1784.8000000000009, 3166.0, 3166.0, 0.0869298128690895, 0.015705093145294488, 0.059085107184459265], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 0, 0.0, 784.2, 432, 3166, 604.0, 1784.8000000000009, 3166.0, 3166.0, 0.08704179747114564, 0.0157253247384394, 0.05916122171866931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 198.07692307692307, 132, 412, 138.0, 409.6, 412.0, 412.0, 0.09855951478392722, 0.026372370166793023, 0.05620972327520849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 159.07692307692307, 131, 410, 139.0, 303.9999999999999, 410.0, 410.0, 0.0985602620186658, 0.07324644472285613, 0.049472631521088106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 175.76923076923077, 130, 408, 136.0, 402.8, 408.0, 408.0, 0.09856474566504667, 0.02656627910503211, 0.05804154456642885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 218.2307692307692, 130, 407, 139.0, 407.0, 407.0, 407.0, 0.09856624030449386, 0.026566681957070612, 0.05794616861650909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64ae2f14-ea24-4bc5-9911-574ff2253c8c", 3, 0, 0.0, 603.6666666666667, 252, 1258, 301.0, 1258.0, 1258.0, 1258.0, 0.05943536404160475, 0.0279377166914314, 0.03811447498761763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/949df4a2-d5be-4a14-b089-6891f02cfb3d", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.7274167141230068, 1.359179242596811], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 251.13333333333333, 208, 362, 229.0, 341.0, 362.0, 362.0, 0.08841159724391581, 0.18444408997942957, 0.05715671618698463], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4d252b60-3783-4764-9633-7e882a5405bc", 3, 0, 0.0, 311.3333333333333, 212, 395, 327.0, 395.0, 395.0, 395.0, 0.04166030189832109, 0.02727176663981892, 0.026715753495993668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 134.875, 129, 142, 134.0, 141.3, 142.0, 142.0, 0.08606314883545801, 0.06395903932010112, 0.043199666505298266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 166.93750000000003, 128, 411, 135.5, 396.3, 411.0, 411.0, 0.08606546354320756, 0.0391875218525591, 0.04818069040639036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 765.6666666666666, 670, 953, 674.0, 953.0, 953.0, 953.0, 0.03983058723562448, 11.711515147240403, 0.022715881782817082], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1172.6666666666667, 946, 1355, 1217.0, 1355.0, 1355.0, 1355.0, 0.03947160675753908, 35.516621144117416, 0.022472604237934846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 314.6666666666667, 138, 409, 397.0, 409.0, 409.0, 409.0, 0.03996909056995923, 0.07072655479762316, 0.022131322610514533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 135.25, 128, 153, 134.0, 144.60000000000002, 153.0, 153.0, 0.09295894119765975, 0.06908374438615145, 0.04666103103085656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 184.24999999999997, 125, 409, 137.0, 404.8, 409.0, 409.0, 0.0929681235546362, 0.033603346416659886, 0.05253289110527478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95843139-6be8-4e79-8b8b-4ab7e80022b7", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 0.30725180697278914, 1.1725393282312926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 249.5625, 127, 1209, 136.5, 648.3000000000006, 1209.0, 1209.0, 0.09296704318319156, 5.251735732827243, 0.05415511841677125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 207.50000000000003, 126, 659, 134.5, 562.4000000000001, 659.0, 659.0, 0.09297082459310738, 1.732024218173472, 0.05424811298279458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2174d29-536e-475f-abd1-e7bdcbcfea75", 1, 0, 0.0, 943.0, 943, 943, 943.0, 943.0, 943.0, 943.0, 1.0604453870625663, 0.19158437168610817, 0.7311273860021209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 139.66666666666666, 137, 143, 139.0, 143.0, 143.0, 143.0, 0.0401128508203078, 0.029810429174076402, 0.02252430588054393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 638.9047619047619, 133, 1354, 407.0, 1290.2, 1349.1999999999998, 1354.0, 0.11132551580822325, 47.71614337599928, 0.060891495393244136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 322.12500000000006, 128, 1250, 138.0, 1238.1, 1250.0, 1250.0, 0.08606361176704731, 9.700320872711918, 0.04967147905695798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 560.3333333333333, 127, 1205, 389.0, 1119.0, 1196.5, 1205.0, 0.11132610597185039, 15.603132372041244, 0.0610005350942296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 290.68750000000006, 128, 1011, 136.5, 967.6, 1011.0, 1011.0, 0.08606407470361685, 3.1835092828173077, 0.04975579318802849], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3bc0aec2-193c-4fc6-aceb-24b013fe9cba", 3, 0, 0.0, 348.3333333333333, 229, 587, 229.0, 587.0, 587.0, 587.0, 0.08189561039528281, 0.037055631005678095, 0.05251769286416248], "isController": false}, {"data": ["deleteBooks", 15, 0, 0.0, 875.9333333333334, 215, 3154, 461.0, 2759.2000000000003, 3154.0, 3154.0, 0.08622870151072685, 0.0155784275190278, 0.05945064772126285], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 430.18749999999994, 264, 1344, 278.5, 865.2000000000005, 1344.0, 1344.0, 0.09288392991907488, 7.080046944481533, 0.20741280883906696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e16d7610-b7a3-458f-b154-9ab6a1cedb19", 3, 0, 0.0, 514.0, 300, 741, 501.0, 741.0, 741.0, 741.0, 0.021995424951610065, 0.026384485985248403, 0.014105139047744736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 613.3499999999999, 233, 1407, 577.0, 907.4000000000003, 1382.8999999999996, 1407.0, 0.08734196563093653, 0.05365048474790925, 0.03949153328820665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 149.0, 129, 406, 138.0, 142.0, 379.5999999999996, 406.0, 0.111323155216285, 0.08273136828085242, 0.0558790056456743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 212.0, 127, 429, 136.0, 417.8, 428.09999999999997, 429.0, 0.11132846668893236, 0.10941293782570204, 0.05903970582778016], "isController": false}, {"data": ["login", 20, 0, 0.0, 2526.65, 1640, 4192, 2386.5, 3984.4000000000015, 4184.85, 4192.0, 0.08380403265005112, 15.156413516071519, 0.14728722417997756], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be2ed811-1830-41fc-98ed-b959219f2fe5", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 159.0625, 135, 425, 140.5, 233.2000000000002, 425.0, 425.0, 0.08789808217371957, 0.07115967785352884, 0.03124502139768938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acb73abf-193e-47b4-bf8a-3455d114d06e", 1, 0, 0.0, 620.0, 620, 620, 620.0, 620.0, 620.0, 620.0, 1.6129032258064515, 0.2913936491935484, 1.1120211693548387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 817.2857142857143, 263, 1487, 799.0, 1430.6000000000001, 1482.8999999999999, 1487.0, 0.11124177605441311, 63.46356256588427, 0.2366319085778004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6f03449-0f09-4905-9b3c-d519c5ddf128", 3, 0, 0.0, 731.0, 252, 1203, 738.0, 1203.0, 1203.0, 1203.0, 0.03269469692015955, 0.02725622357178666, 0.020966325824451276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 440.76923076923083, 267, 823, 526.0, 712.1999999999999, 823.0, 823.0, 0.09845501363223266, 0.15258604163511058, 0.22142763319827327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1312.6666666666667, 1086, 1498, 1354.0, 1498.0, 1498.0, 1498.0, 0.039399033410380334, 47.13494127902395, 0.08884020326617986], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51f695f5-cb8c-4346-b243-df7ee08cf6e9", 3, 0, 0.0, 317.6666666666667, 219, 419, 315.0, 419.0, 419.0, 419.0, 0.017748748713215717, 0.02446808294286086, 0.011381847319347318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5834d8fc-2b69-4436-b674-22e0626654e6", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 0.7374043367346939, 2.814094387755102], "isController": false}, {"data": ["register", 25, 5, 20.0, 1266.16, 416, 3721, 1230.0, 1971.4000000000005, 3238.5999999999985, 3721.0, 0.09809999921520002, 0.03111609350107125, 0.04425996058342031], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d11bece9-5435-4d8f-a984-f233485a744f", 1, 0, 0.0, 3154.0, 3154, 3154, 3154.0, 3154.0, 3154.0, 3154.0, 0.31705770450221943, 0.0572809329422955, 0.21859642517438174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2174d29-536e-475f-abd1-e7bdcbcfea75", 3, 0, 0.0, 447.33333333333337, 224, 857, 261.0, 857.0, 857.0, 857.0, 0.01799899205644484, 0.02481306359343877, 0.011542322379946724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 161.57142857142856, 137, 398, 140.0, 279.0, 398.0, 398.0, 0.07071814273951983, 0.05490324558390455, 0.025138089801938688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 495.5, 262, 1385, 281.5, 1377.3, 1385.0, 1385.0, 0.08599977425059259, 12.977326041941016, 0.19066502684805453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/825a1448-368b-4658-bb05-944233ae9586", 3, 0, 0.0, 516.6666666666666, 208, 906, 436.0, 906.0, 906.0, 906.0, 0.06083958629081323, 0.026934191847495435, 0.0390149690732103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 548.0, 265, 1550, 541.5, 1328.6000000000004, 1550.0, 1550.0, 0.09608609313945295, 12.904854416223603, 0.21336826129545405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3bc0aec2-193c-4fc6-aceb-24b013fe9cba", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 0.8402979651162791, 3.2067587209302326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 173.85714285714286, 131, 414, 134.0, 414.0, 414.0, 414.0, 0.059625212947189095, 0.044311315481260646, 0.029929061967632026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c6191fd-e984-40d7-91b7-600283c0efa4", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.6117546695402298, 1.143064535440613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 210.57142857142858, 129, 403, 144.0, 403.0, 403.0, 403.0, 0.059625720832375065, 0.02874811540132369, 0.03328991835535226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 365.85714285714283, 132, 1214, 139.0, 1214.0, 1214.0, 1214.0, 0.059485366599816444, 7.66017663170485, 0.03424060024983854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 243.57142857142858, 130, 648, 136.0, 648.0, 648.0, 648.0, 0.05949446701456765, 2.5127946304118716, 0.03430393863995648], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1265.1272727272724, 1007, 1961, 1091.0, 1705.4, 1748.1999999999998, 1961.0, 0.2427666571031317, 290.433321240979, 0.47936931705325414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 5, 20.0, 1266.16, 416, 3721, 1230.0, 1971.4000000000005, 3238.5999999999985, 3721.0, 0.09759144318226179, 0.030954785884373656, 0.04403051440449701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 135.0, 130, 142, 134.0, 142.0, 142.0, 142.0, 0.047464223841279636, 0.012793091582219902, 0.027950124000284786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 132.5, 127, 138, 131.0, 138.0, 138.0, 138.0, 0.04746234653841286, 0.012792585590431591, 0.027902668570434122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 173.0, 130, 412, 135.0, 407.5, 412.0, 412.0, 0.0722103590918, 0.019462948348961718, 0.042451793137952734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 153.28571428571428, 131, 396, 136.0, 267.5, 396.0, 396.0, 0.07220849687698251, 0.01946244642387419, 0.04252121446955122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 137.42857142857144, 132, 142, 137.5, 141.5, 142.0, 142.0, 0.07220812444554475, 0.05366248310845661, 0.03624509371583009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 134.0, 131, 138, 133.5, 138.0, 138.0, 138.0, 0.04746234653841286, 0.012699885694848754, 0.027068369510188584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 157.0, 130, 456, 135.0, 297.0, 456.0, 456.0, 0.07208914337500773, 0.019289477817140736, 0.04111333958105909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 136.16666666666669, 130, 144, 135.5, 144.0, 144.0, 144.0, 0.04746159565884605, 0.03527175224256039, 0.023823496258444207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 226.83333333333334, 137, 409, 140.0, 409.0, 409.0, 409.0, 0.04698438552254468, 0.036981850323409185, 0.01670148079121705], "isController": false}, {"data": ["deleteAccount", 15, 0, 0.0, 648.6, 395, 1258, 587.0, 1046.8000000000002, 1258.0, 1258.0, 0.08341675008341676, 0.015070408950617285, 0.05677878399232566], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26b23fe3-fb20-4455-996e-c98ed99e309d", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1270.7, 852, 3117, 1202.5, 1598.7000000000003, 3041.499999999999, 3117.0, 0.08431561019207097, 0.04363991543144297, 0.038781887109829515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a525ce75-3f57-4b0a-bfa9-110a78ed9342", 3, 0, 0.0, 599.6666666666666, 223, 1163, 413.0, 1163.0, 1163.0, 1163.0, 0.02134031398715313, 0.02522352867426856, 0.01368503208160536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 272.8333333333333, 264, 282, 272.5, 282.0, 282.0, 282.0, 0.04740984228325801, 0.07347599580422896, 0.10662584646322577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be2ed811-1830-41fc-98ed-b959219f2fe5", 3, 0, 0.0, 340.0, 217, 575, 228.0, 575.0, 575.0, 575.0, 0.07858752030177608, 0.035558806386545815, 0.05039629394352177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64ae2f14-ea24-4bc5-9911-574ff2253c8c", 1, 0, 0.0, 2496.0, 2496, 2496, 2496.0, 2496.0, 2496.0, 2496.0, 0.4006410256410256, 0.07238143529647435, 0.27622320713141024], "isController": false}, {"data": ["addBook", 56, 7, 12.5, 1261.2857142857142, 689, 2724, 1067.5, 1992.0000000000002, 2169.2, 2724.0, 0.2555304081185661, 88.33447005388955, 0.927211229249562], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 243.8727272727272, 131, 717, 139.0, 551.8, 562.4, 717.0, 0.2437954068945341, 0.18117998500658247, 0.11785031876249452], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 767.0363636363637, 630, 1123, 677.0, 1018.1999999999999, 1069.1999999999998, 1123.0, 0.2436906281015171, 71.6531359522322, 0.12255925143777471], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d252b60-3783-4764-9633-7e882a5405bc", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95843139-6be8-4e79-8b8b-4ab7e80022b7", 3, 0, 0.0, 814.3333333333334, 252, 1712, 479.0, 1712.0, 1712.0, 1712.0, 0.024466427983069233, 0.02453810697130088, 0.015689734090705204], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 217.63636363636365, 128, 553, 139.0, 407.2, 426.5999999999998, 553.0, 0.2442750803887083, 0.4322523883440814, 0.11879784182966477], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1015.7090909090906, 872, 1383, 945.0, 1216.3999999999999, 1305.9999999999998, 1383.0, 0.24338760139306212, 219.00059156324537, 0.12216916710550188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 143.83333333333331, 133, 185, 141.0, 157.10000000000005, 185.0, 185.0, 0.09443217409095916, 0.07054747380818727, 0.033567686883895644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 7, 4.191616766467066, 199.98203592814386, 128, 895, 144.0, 360.60000000000014, 404.6, 702.5599999999981, 0.7080201298178226, 1.5545076133362163, 0.339283107095464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 178.42857142857144, 134, 413, 140.0, 413.0, 413.0, 413.0, 0.06483882919599852, 0.050212101125416825, 0.0230481775657651], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 140.76923076923077, 134, 145, 141.0, 145.0, 145.0, 145.0, 0.10524185387573366, 0.08540623102610807, 0.037410190244889695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 543.0, 271, 1347, 281.0, 1347.0, 1347.0, 1347.0, 0.05941871519760967, 10.233995012011068, 0.13146224948645252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 336.2857142857143, 269, 594, 276.0, 572.5, 594.0, 594.0, 0.07203832438857471, 0.11164533281705867, 0.1620158799481324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e16d7610-b7a3-458f-b154-9ab6a1cedb19", 1, 0, 0.0, 2058.0, 2058, 2058, 2058.0, 2058.0, 2058.0, 2058.0, 0.48590864917395526, 0.08778623056365405, 0.3350112366375122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acb73abf-193e-47b4-bf8a-3455d114d06e", 3, 0, 0.0, 462.0, 362, 579, 445.0, 579.0, 579.0, 579.0, 0.027744894939331164, 0.023129777324097368, 0.01779213640315182], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26b23fe3-fb20-4455-996e-c98ed99e309d", 3, 0, 0.0, 441.6666666666667, 251, 590, 484.0, 590.0, 590.0, 590.0, 0.03633896991133291, 0.02975016579655022, 0.02330331078298367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6f03449-0f09-4905-9b3c-d519c5ddf128", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 156.5625, 132, 403, 139.5, 231.50000000000017, 403.0, 403.0, 0.09198362691440924, 0.07626376879915375, 0.03269730487973141], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d11bece9-5435-4d8f-a984-f233485a744f", 3, 0, 0.0, 391.0, 227, 715, 231.0, 715.0, 715.0, 715.0, 0.01697322191356104, 0.023398956641904622, 0.010884520563058348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 154.52380952380955, 133, 432, 139.0, 163.8, 405.5999999999996, 432.0, 0.1108232053237357, 0.08603950022692369, 0.039394186267421666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51f695f5-cb8c-4346-b243-df7ee08cf6e9", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=825a1448-368b-4658-bb05-944233ae9586", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 0.5004544667590027, 1.9098424515235457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 164.94444444444443, 131, 403, 136.5, 387.70000000000005, 403.0, 403.0, 0.09615641443414621, 0.07145999158631373, 0.048266012714014796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5834d8fc-2b69-4436-b674-22e0626654e6", 3, 0, 0.0, 311.0, 224, 477, 232.0, 477.0, 477.0, 477.0, 0.1075461552249507, 0.04866183455816454, 0.0689667727191253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 257.61111111111103, 130, 418, 141.0, 417.1, 418.0, 418.0, 0.09615846915717102, 0.04177718212948272, 0.0539430648375189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 294.8888888888889, 129, 1171, 136.5, 1163.8, 1171.0, 1171.0, 0.09616103768444222, 9.637024219893581, 0.05561396819206564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 291.38888888888886, 129, 948, 137.0, 670.8000000000004, 948.0, 948.0, 0.09616103768444222, 3.1646539070763837, 0.05570787545542936], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 41.666666666666664, 0.3952569169960474], "isController": false}, {"data": ["401/Unauthorized", 7, 58.333333333333336, 0.5533596837944664], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1265, 12, "401/Unauthorized", 7, "406/Not Acceptable", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
