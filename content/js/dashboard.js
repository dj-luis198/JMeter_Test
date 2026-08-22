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

    var data = {"OkPercent": 96.44444444444444, "KoPercent": 3.5555555555555554};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.744134432466709, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03508771929824561, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7a95608-cbc7-4d37-964b-a9c2bf90fe26"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef24a2e8-bd4f-4bd4-9508-39d121880df2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/59127c4b-e065-44bd-853e-80109fe2d2ff"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b0c097d1-fa36-469a-b1b2-681df582249b"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/09572414-5a62-4d21-9b43-0b2f7edd6715"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/72b1d721-eac1-466a-971f-5feee0eacfa6"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0aa4123a-1f3b-444f-9d0e-7ec1bd0bbde6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9af6505a-904f-4528-8acf-16334f3a68fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1813a3d4-09b5-4986-848d-260a16efc409"], "isController": false}, {"data": [0.225, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.18, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0ff95f7-60e6-481e-8366-7ef366345b90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81d82677-bf41-43e1-8137-cac054c69f3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/11025af9-9fb5-496e-9a00-6ab545cb3d47"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b7a95608-cbc7-4d37-964b-a9c2bf90fe26"], "isController": false}, {"data": [0.4298245614035088, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.18, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/817b81be-14e6-474e-afff-9ff014eca7e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/688a0f16-de7b-4072-9a84-3a4cdf9c8846"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.20689655172413793, 500, 1500, "addBook"], "isController": true}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0c097d1-fa36-469a-b1b2-681df582249b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59127c4b-e065-44bd-853e-80109fe2d2ff"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ef24a2e8-bd4f-4bd4-9508-39d121880df2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.869942196531792, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9af6505a-904f-4528-8acf-16334f3a68fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=817b81be-14e6-474e-afff-9ff014eca7e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0ff95f7-60e6-481e-8366-7ef366345b90"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09572414-5a62-4d21-9b43-0b2f7edd6715"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72b1d721-eac1-466a-971f-5feee0eacfa6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d1ae964-b373-408f-813f-fce15eac2262"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/81d82677-bf41-43e1-8137-cac054c69f3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0aa4123a-1f3b-444f-9d0e-7ec1bd0bbde6"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1350, 48, 3.5555555555555554, 381.5666666666668, 105, 2802, 119.0, 1127.6000000000022, 1303.7000000000003, 1720.92, 5.325170701305258, 767.9122001078347, 3.8964656151755532], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1784.1754385964912, 1286, 2357, 1742.0, 2186.2, 2279.8999999999996, 2357.0, 0.2549035391344012, 306.7334013635103, 1.2533587104899515], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7a95608-cbc7-4d37-964b-a9c2bf90fe26", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 507.00000000000006, 112, 860, 576.0, 825.8000000000001, 860.0, 860.0, 0.09241460890137514, 0.019511756293434865, 0.061633805571984814], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 507.00000000000006, 112, 860, 576.0, 825.8000000000001, 860.0, 860.0, 0.09028149770985934, 0.01906138652819491, 0.060211175946601504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 168.07142857142858, 106, 319, 108.5, 319.0, 319.0, 319.0, 0.10335612089713113, 0.027655837036927665, 0.058945287699145095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 110.28571428571428, 108, 114, 110.0, 114.0, 114.0, 114.0, 0.10335306884790857, 0.07680828651685394, 0.051878395886547864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 123.28571428571429, 106, 318, 109.0, 214.0, 318.0, 318.0, 0.10335459484998819, 0.02785729314316088, 0.060862129584514535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 154.64285714285714, 107, 323, 109.5, 321.5, 323.0, 323.0, 0.10335459484998819, 0.02785729314316088, 0.06076119736298134], "isController": false}, {"data": ["goToProfile", 17, 6, 35.294117647058826, 232.11764705882348, 107, 542, 217.0, 530.8, 542.0, 542.0, 0.07929585282689715, 0.10834397170770615, 0.05123619902326167], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 121.55555555555556, 107, 319, 109.5, 138.10000000000028, 319.0, 319.0, 0.09741366713749938, 0.0723943366129268, 0.048897094637377625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 120.55555555555556, 105, 330, 108.0, 135.6000000000003, 330.0, 330.0, 0.09741313995021106, 0.02606562533824007, 0.05555593137785474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 724.0, 531, 870, 742.0, 869.1, 870.0, 870.0, 0.0653851183470642, 19.225395784294495, 0.037289950307310055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 1213.6000000000001, 1148, 1412, 1166.5, 1397.2, 1412.0, 1412.0, 0.0651567671818395, 58.628173643599, 0.03709608912794183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 193.49999999999997, 107, 326, 109.0, 325.9, 326.0, 326.0, 0.06551877768168357, 0.11593752456954164, 0.03627846381397909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 132.77777777777777, 108, 318, 110.0, 318.0, 318.0, 318.0, 0.06960126210288614, 0.051725156699508154, 0.03493657101648777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 180.33333333333334, 106, 331, 110.0, 331.0, 331.0, 331.0, 0.06960233863857826, 0.04185505216308601, 0.0383960817750143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 376.8888888888889, 106, 1267, 107.0, 1267.0, 1267.0, 1267.0, 0.06960449180987147, 13.932423584902013, 0.03959057574515475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 358.6666666666667, 108, 874, 319.0, 874.0, 874.0, 874.0, 0.06949216668854383, 4.555235655658593, 0.03959454940120916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 131.5, 107, 332, 109.5, 309.9000000000001, 332.0, 332.0, 0.06560861834810622, 0.048757967346590644, 0.03684077690445416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 671.3500000000001, 106, 1485, 636.5, 1395.1000000000004, 1481.1499999999999, 1485.0, 0.09330969487729775, 41.99268867511897, 0.05084649388821499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 132.11111111111111, 106, 322, 108.0, 318.4, 322.0, 322.0, 0.09741630315953544, 0.026256737960968536, 0.05727013134964876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 479.59999999999997, 106, 961, 372.5, 952.9, 960.6, 961.0, 0.09330925954437089, 13.730585113207459, 0.05093737898955403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 157.00000000000006, 107, 329, 109.0, 327.2, 329.0, 329.0, 0.09741524873360176, 0.0262564537602286, 0.057364643541369005], "isController": false}, {"data": ["deleteBooks", 15, 4, 26.666666666666668, 371.33333333333326, 110, 573, 459.0, 571.2, 573.0, 573.0, 0.09062075215224287, 0.019133014272768464, 0.06075602250415345], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef24a2e8-bd4f-4bd4-9508-39d121880df2", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.49227264986376024, 1.8786188692098094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59127c4b-e065-44bd-853e-80109fe2d2ff", 3, 0, 0.0, 442.3333333333333, 286, 528, 513.0, 528.0, 528.0, 528.0, 0.02907934784715895, 0.02916454124905492, 0.018647889081674196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 595.7777777777778, 219, 1378, 431.0, 1378.0, 1378.0, 1378.0, 0.06942997986530584, 18.54200085871385, 0.15220202725898152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 471.20000000000005, 124, 990, 437.0, 860.0000000000001, 961.8, 990.0, 0.11473890015879865, 0.07047926582019956, 0.051879014427269304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 109.65000000000002, 107, 113, 109.0, 112.0, 112.95, 113.0, 0.09330969487729775, 0.06934441191564804, 0.0468370929364561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 183.75, 106, 331, 109.0, 329.9, 330.95, 331.0, 0.09331056555533783, 0.09504191393966539, 0.04929786715374782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0c097d1-fa36-469a-b1b2-681df582249b", 3, 0, 0.0, 942.0, 217, 1972, 637.0, 1972.0, 1972.0, 1972.0, 0.03392859162416168, 0.028284870816887388, 0.021757592936067223], "isController": false}, {"data": ["login", 25, 0, 0.0, 2803.0000000000005, 1552, 4202, 2813.0, 3791.4, 4082.6, 4202.0, 0.11333139914412127, 54.38348852179589, 0.24616376755503372], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/09572414-5a62-4d21-9b43-0b2f7edd6715", 3, 0, 0.0, 1498.3333333333333, 232, 2802, 1461.0, 2802.0, 2802.0, 2802.0, 0.022370864186483524, 0.026441604121458878, 0.01434589923417075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 144.11111111111111, 108, 445, 113.5, 344.20000000000016, 445.0, 445.0, 0.09547906621473243, 0.07729701747266912, 0.033939824318518164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72b1d721-eac1-466a-971f-5feee0eacfa6", 3, 0, 0.0, 490.0, 240, 859, 371.0, 859.0, 859.0, 859.0, 0.0351848376806155, 0.029332151464862077, 0.02256319343450929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 793.0, 216, 1594, 748.5, 1505.1000000000004, 1590.2, 1594.0, 0.09326183259501049, 55.85905623397063, 0.19781709023082306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0aa4123a-1f3b-444f-9d0e-7ec1bd0bbde6", 3, 0, 0.0, 318.3333333333333, 210, 486, 259.0, 486.0, 486.0, 486.0, 0.0425260472039124, 0.026454191473527535, 0.027270935218654757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9af6505a-904f-4528-8acf-16334f3a68fb", 3, 0, 0.0, 302.0, 214, 455, 237.0, 455.0, 455.0, 455.0, 0.023741690408357073, 0.02806187430753403, 0.015224977247546692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1813a3d4-09b5-4986-848d-260a16efc409", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 10, 50.0, 738.4, 107, 1523, 795.5, 1486.3000000000002, 1521.8, 1523.0, 0.11757996907646813, 70.34899112712158, 0.1713176893184477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 325.5, 218, 434, 325.0, 433.5, 434.0, 434.0, 0.10326996983041596, 0.16004828332116222, 0.23225658253852338], "isController": false}, {"data": ["register", 25, 10, 40.0, 1068.84, 124, 2219, 1222.0, 1877.4000000000008, 2188.7, 2219.0, 0.11440024527412587, 0.0354819510733031, 0.05161417316078726], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a0ff95f7-60e6-481e-8366-7ef366345b90", 3, 0, 0.0, 332.0, 217, 460, 319.0, 460.0, 460.0, 460.0, 0.05279366476022877, 0.033941239551253846, 0.033855312362516495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81d82677-bf41-43e1-8137-cac054c69f3d", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 0.7854959239130435, 2.9976222826086953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 138.44444444444446, 109, 328, 113.5, 326.2, 328.0, 328.0, 0.08682314126125083, 0.06740663799091251, 0.030862913495210254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 280.72222222222223, 217, 650, 222.0, 458.3000000000003, 650.0, 650.0, 0.09735465760907777, 0.1508807047125063, 0.21895290671260365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11025af9-9fb5-496e-9a00-6ab545cb3d47", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 411.5555555555555, 216, 1310, 325.5, 726.8000000000009, 1310.0, 1310.0, 0.1250173635227115, 8.492112348503264, 0.2793899326295319], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 109.1, 107, 112, 109.0, 112.0, 112.0, 112.0, 0.04656772577197648, 0.034607460266087985, 0.023374815475386626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 152.8, 106, 326, 111.0, 325.3, 326.0, 326.0, 0.04652158136159364, 0.012448157512770173, 0.026531839370283875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 152.20000000000005, 106, 327, 109.5, 326.2, 327.0, 327.0, 0.04652309639120341, 0.012539428324191545, 0.02735049221435982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 109.2, 106, 116, 108.0, 115.7, 116.0, 116.0, 0.046569243808619036, 0.01255186649529185, 0.02742309962558328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 113.5, 110, 116, 114.0, 116.0, 116.0, 116.0, 0.18619373458083135, 0.05491260531583112, 0.11509827538053344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7a95608-cbc7-4d37-964b-a9c2bf90fe26", 3, 0, 0.0, 461.0, 227, 614, 542.0, 614.0, 614.0, 614.0, 0.04066473283270529, 0.03390051457830672, 0.026077318906389785], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1212.59649122807, 845, 1857, 1175.0, 1675.4, 1754.2999999999997, 1857.0, 0.2602513937147006, 311.35114490637795, 0.5138948418858638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, 40.0, 1068.84, 124, 2219, 1222.0, 1877.4000000000008, 2188.7, 2219.0, 0.11343939160185496, 0.03518393630151283, 0.05118066300786815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 135.875, 106, 321, 110.0, 321.0, 321.0, 321.0, 0.05969926495280027, 0.01609081750680945, 0.03515493824857282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 162.625, 105, 329, 108.5, 329.0, 329.0, 329.0, 0.059697483004872806, 0.016090337216157127, 0.03509559059466156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 179.5, 105, 1168, 109.0, 403.9000000000012, 1168.0, 1168.0, 0.08804237773114792, 4.423561065031524, 0.0513389472577245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 199.9444444444444, 106, 634, 110.5, 370.3000000000004, 634.0, 634.0, 0.08804237773114792, 1.4605997367288344, 0.05142492614222757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 143.77777777777777, 107, 474, 111.0, 342.6000000000002, 474.0, 474.0, 0.08803893277249272, 0.06542737093737008, 0.044191417426817634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 108.125, 107, 111, 107.0, 111.0, 111.0, 111.0, 0.059794307581918206, 0.015999648708442955, 0.03410144104281272], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/817b81be-14e6-474e-afff-9ff014eca7e7", 3, 0, 0.0, 404.0, 208, 580, 424.0, 580.0, 580.0, 580.0, 0.025512590463393683, 0.025587334380766907, 0.01636061302502785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 156.33333333333337, 107, 327, 108.5, 324.3, 327.0, 327.0, 0.0880410858400587, 0.030904178894595256, 0.049800149792125215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 109.375, 107, 111, 109.5, 111.0, 111.0, 111.0, 0.059792966852274004, 0.044435984154863786, 0.03001326656452035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 114.375, 109, 128, 112.5, 128.0, 128.0, 128.0, 0.05949238125692529, 0.04682701102840017, 0.02114768239992266], "isController": false}, {"data": ["deleteAccount", 15, 4, 26.666666666666668, 522.0666666666667, 108, 1461, 512.0, 1099.8000000000002, 1461.0, 1461.0, 0.09250864955873375, 0.018857069125546574, 0.06294322243088063], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/688a0f16-de7b-4072-9a84-3a4cdf9c8846", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 1.3884171195652173, 2.594259510869565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1422.2400000000002, 907, 2096, 1343.0, 1807.4, 2021.2999999999997, 2096.0, 0.11264813229396656, 0.058304209097463165, 0.051813740537556885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 274.875, 216, 440, 222.0, 440.0, 440.0, 440.0, 0.05964763161622714, 0.09244217907710202, 0.13414892149626084], "isController": false}, {"data": ["addBook", 58, 20, 34.48275862068966, 1064.3793103448277, 548, 2226, 873.5, 1920.4, 2074.95, 2226.0, 0.26861551856688987, 78.67756317964357, 0.9751061725993646], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 170.82456140350885, 107, 572, 110.0, 435.2, 449.6999999999998, 572.0, 0.2616335111217193, 0.1944366230113558, 0.12647323047387796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0c097d1-fa36-469a-b1b2-681df582249b", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59127c4b-e065-44bd-853e-80109fe2d2ff", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 674.4736842105266, 525, 972, 636.0, 874.4, 951.0, 972.0, 0.2615614761244849, 76.90775863898551, 0.13154703144932592], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef24a2e8-bd4f-4bd4-9508-39d121880df2", 3, 0, 0.0, 429.3333333333333, 204, 594, 490.0, 594.0, 594.0, 594.0, 0.06877894447246549, 0.031120681255445, 0.04410628926131414], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 162.54385964912282, 106, 437, 112.0, 325.2, 332.29999999999984, 437.0, 0.2620641459467412, 0.4637306957573194, 0.12744916472800502], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1036.4210526315785, 737, 1392, 1050.0, 1302.8, 1364.7, 1392.0, 0.2608051099499437, 234.67289637944168, 0.13091193995534284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 124.88888888888889, 109, 326, 113.0, 144.20000000000027, 326.0, 326.0, 0.1213265031005662, 0.09063942858587219, 0.04312778039902938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 20, 11.560693641618498, 168.50867052023102, 107, 1040, 114.0, 325.79999999999995, 441.19999999999993, 744.7399999999964, 0.7339683078424302, 1.6567319318639824, 0.34928459302942233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 176.5, 109, 329, 113.5, 328.9, 329.0, 329.0, 0.049286819718670834, 0.038168406286040985, 0.017519924196871272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 128.14285714285717, 107, 322, 111.0, 226.0, 322.0, 322.0, 0.09446821144684814, 0.07666316768782304, 0.0335804970377468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9af6505a-904f-4528-8acf-16334f3a68fb", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 264.0, 215, 437, 222.5, 436.7, 437.0, 437.0, 0.046497138101149874, 0.07206148258449692, 0.10457315336616031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 386.99999999999994, 216, 1279, 230.5, 859.6000000000007, 1279.0, 1279.0, 0.08799202205666685, 5.977074832020786, 0.19664536526466045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=817b81be-14e6-474e-afff-9ff014eca7e7", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 112.88888888888889, 108, 121, 113.0, 121.0, 121.0, 121.0, 0.06894174422612892, 0.057159707859358845, 0.024506635642881767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0ff95f7-60e6-481e-8366-7ef366345b90", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09572414-5a62-4d21-9b43-0b2f7edd6715", 1, 0, 0.0, 570.0, 570, 570, 570.0, 570.0, 570.0, 570.0, 1.7543859649122808, 0.3169544956140351, 1.2095668859649125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 114.64999999999999, 108, 131, 112.5, 124.80000000000001, 130.7, 131.0, 0.09343567654437494, 0.07254039341091609, 0.03321346314663328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72b1d721-eac1-466a-971f-5feee0eacfa6", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d1ae964-b373-408f-813f-fce15eac2262", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 0.9647611404833837, 1.802657666163142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81d82677-bf41-43e1-8137-cac054c69f3d", 3, 0, 0.0, 620.6666666666666, 220, 1130, 512.0, 1130.0, 1130.0, 1130.0, 0.08063649069992473, 0.03648591213310397, 0.051710249569938714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 145.1111111111111, 106, 332, 109.0, 326.6, 332.0, 332.0, 0.12511207957128262, 0.09297880132201763, 0.06280039931605397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 181.05555555555557, 105, 331, 109.0, 326.5, 331.0, 331.0, 0.12511468846442572, 0.043917753600522705, 0.07077071082520088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0aa4123a-1f3b-444f-9d0e-7ec1bd0bbde6", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 227.66666666666666, 105, 1201, 108.5, 412.6000000000013, 1201.0, 1201.0, 0.1251138188212888, 6.286161640537572, 0.07295590954270899], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 197.16666666666669, 105, 637, 109.0, 366.1000000000004, 637.0, 637.0, 0.12511207957128262, 2.0755762757956777, 0.07307707512285311], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 20.833333333333332, 0.7407407407407407], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 6, 12.5, 0.4444444444444444], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 8.333333333333334, 0.2962962962962963], "isController": false}, {"data": ["401/Unauthorized", 28, 58.333333333333336, 2.074074074074074], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1350, 48, "401/Unauthorized", 28, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 10, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 20, "401/Unauthorized", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
