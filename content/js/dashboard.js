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

    var data = {"OkPercent": 97.15165511932256, "KoPercent": 2.8483448806774443};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7599601593625498, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.125, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac163b9a-7014-4dba-8b49-6c8121dd44b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4017857142857143, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4230769230769231, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1666cb2d-3902-4297-a9a1-35081a216965"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/247c8d96-2ae7-48a5-bc90-90f2a5ff5a1a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e9a9183e-0f9f-4cd0-8c47-165adfba9cdf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.11904761904761904, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.2672413793103448, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac475601-071c-495e-9c1d-df5605a0dd38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/29d2f493-1aa0-41e5-8dbe-f2ea00d83417"], "isController": false}, {"data": [0.5982142857142857, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8953488372093024, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56a77350-79fd-4453-9729-72ad89282791"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/56a77350-79fd-4453-9729-72ad89282791"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ab3635e6-b211-4c5c-8f2a-396375f3fb7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/67ca7c27-025e-4c15-9844-5d04f2520295"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c5e81b9-1bc3-47fd-8ca8-85913dfeabaa"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ada29b80-7be6-4fa1-b2ee-666732e4f266"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5c5e81b9-1bc3-47fd-8ca8-85913dfeabaa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ada29b80-7be6-4fa1-b2ee-666732e4f266"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/22d37245-1a1d-4c9e-b39b-7f9e89d1f4ad"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1666cb2d-3902-4297-a9a1-35081a216965"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a999905e-d749-436b-a972-804bf7615361"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67ca7c27-025e-4c15-9844-5d04f2520295"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/722fe06c-ce39-45e4-a0fd-4991be5b2b88"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22d37245-1a1d-4c9e-b39b-7f9e89d1f4ad"], "isController": false}, {"data": [0.23333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a999905e-d749-436b-a972-804bf7615361"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=722fe06c-ce39-45e4-a0fd-4991be5b2b88"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1299, 37, 2.8483448806774443, 378.6173979984609, 93, 4107, 117.0, 1024.0, 1297.0, 2332.0, 5.118889055271391, 710.4569191573142, 3.7553320221680604], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1698.1071428571431, 1197, 2246, 1684.0, 2116.2, 2162.8, 2246.0, 0.25894397099827526, 311.5973898823423, 1.273225482398746], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 276.33333333333326, 207, 410, 215.0, 407.6, 410.0, 410.0, 0.0889663884984253, 0.1378805259248056, 0.2000874928826889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 125.49999999999997, 101, 367, 106.0, 196.20000000000016, 367.0, 367.0, 0.08992856299776864, 0.0698175855304942, 0.03196679387811307], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac163b9a-7014-4dba-8b49-6c8121dd44b9", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.856128518766756, 1.599677446380697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 333.15384615384613, 198, 424, 407.0, 419.6, 424.0, 424.0, 0.06920488905923938, 0.10725406146192666, 0.1556434174838167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 121.83333333333334, 101, 298, 104.5, 245.80000000000018, 298.0, 298.0, 0.06416906409420019, 0.047688142359068694, 0.03220986225040908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 151.58333333333334, 100, 301, 103.0, 300.4, 301.0, 301.0, 0.06417283884595844, 0.025203297548062782, 0.03614944584079788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 202.75, 96, 1104, 103.0, 865.2000000000008, 1104.0, 1104.0, 0.06417421159307132, 4.827861242319148, 0.03726783641993465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 175.08333333333331, 99, 593, 102.0, 506.00000000000034, 593.0, 593.0, 0.0641718093241639, 1.5882418361426327, 0.03732910913485706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 112.75, 106, 119, 113.0, 119.0, 119.0, 119.0, 0.07632859459975193, 0.022510972235473714, 0.047183594122698215], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1151.160714285714, 769, 1811, 1048.5, 1637.0, 1678.1, 1811.0, 0.24028868969719333, 287.4688107426208, 0.4744762993825439], "isController": false}, {"data": ["deleteBook", 13, 4, 30.76923076923077, 532.6153846153846, 98, 1206, 514.0, 1204.8, 1206.0, 1206.0, 0.09881873603235174, 0.02132709049135716, 0.06571089628593581], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 4, 30.76923076923077, 532.6153846153846, 98, 1206, 514.0, 1204.8, 1206.0, 1206.0, 0.09738119494217055, 0.021016839924042668, 0.06475498329537963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1666cb2d-3902-4297-a9a1-35081a216965", 1, 0, 0.0, 1046.0, 1046, 1046, 1046.0, 1046.0, 1046.0, 1046.0, 0.9560229445506692, 0.17271898900573612, 0.6591330066921606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1412.0, 166, 2704, 1336.0, 2598.9, 2694.3999999999996, 2704.0, 0.08699503337445826, 0.027232287613488976, 0.03924971232324191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 146.94736842105263, 95, 386, 102.0, 301.0, 386.0, 386.0, 0.10600371570919276, 0.03674388665413219, 0.059986683283214035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 194.5, 95, 301, 191.5, 301.0, 301.0, 301.0, 0.04517451479747701, 0.012175943441507473, 0.026601789475467413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/247c8d96-2ae7-48a5-bc90-90f2a5ff5a1a", 2, 0, 0.0, 232.0, 203, 261, 232.0, 261.0, 261.0, 261.0, 0.04672678846782861, 0.04125099294425494, 0.02904453208962198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 133.89473684210526, 97, 308, 103.0, 301.0, 308.0, 308.0, 0.1060043071223736, 0.07877859152356086, 0.053209193223535185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 173.5, 98, 303, 103.0, 303.0, 303.0, 303.0, 0.04517451479747701, 0.012175943441507473, 0.0265576737383605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 197.8421052631579, 96, 783, 101.0, 300.0, 783.0, 783.0, 0.1060043071223736, 1.6675301310269028, 0.06194299792733684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 174.4736842105263, 96, 1094, 101.0, 304.0, 1094.0, 1094.0, 0.1060043071223736, 5.0472183371411194, 0.061839478096162644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 194.68750000000003, 97, 1008, 102.0, 519.4000000000005, 1008.0, 1008.0, 0.09251977610214183, 5.226469483291506, 0.05389457660637461], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 182.625, 95, 810, 101.5, 460.00000000000034, 810.0, 810.0, 0.09251924111092479, 1.7236113259452863, 0.05398461578493902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 150.5, 96, 303, 102.5, 303.0, 303.0, 303.0, 0.045122790393357926, 0.012073871648222725, 0.02573409139621194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 116.5625, 96, 307, 104.0, 168.40000000000015, 307.0, 307.0, 0.09251817114705185, 0.06875617992471333, 0.04643978512654751], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e9a9183e-0f9f-4cd0-8c47-165adfba9cdf", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.5544026692708334, 1.0359022352430556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 156.5, 98, 332, 103.5, 332.0, 332.0, 332.0, 0.045172729223367854, 0.03357074896385052, 0.022674592598448316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 138.18750000000003, 100, 305, 102.0, 296.6, 305.0, 305.0, 0.09251870612589483, 0.033440904399264476, 0.052278941730562405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 107.5, 103, 114, 107.0, 114.0, 114.0, 114.0, 0.04516150884601054, 0.03554704700184033, 0.016053505097605312], "isController": false}, {"data": ["deleteAccount", 12, 4, 33.333333333333336, 804.3333333333334, 94, 3407, 437.5, 3074.6000000000013, 3407.0, 3407.0, 0.11085450346420324, 0.023239030023094687, 0.07541859122401848], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 2012.2857142857147, 954, 4107, 1781.0, 3541.6000000000004, 4068.6999999999994, 4107.0, 0.08920644495325157, 0.04617130451681967, 0.04103148005173974], "isController": false}, {"data": ["goToProfile", 13, 4, 30.76923076923077, 183.46153846153848, 94, 261, 200.0, 255.0, 261.0, 261.0, 0.09902951079421668, 0.18980904206088028, 0.06399127492877493], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 383.0, 200, 634, 400.0, 634.0, 634.0, 634.0, 0.04509557443306408, 0.06988933264186785, 0.10142100382748688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 104.6, 96, 118, 103.0, 116.8, 118.0, 118.0, 0.08902024320330443, 0.06615664558370574, 0.04468398926415867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 718.1428571428572, 594, 857, 766.0, 857.0, 857.0, 857.0, 0.031525141300186896, 9.269438275462182, 0.017979182147762843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 114.8, 94, 308, 102.0, 185.60000000000008, 308.0, 308.0, 0.08902288481625677, 0.023820576601224955, 0.050770863996771436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1029.142857142857, 893, 1187, 1075.0, 1187.0, 1187.0, 1187.0, 0.03150400100812803, 28.347355485240378, 0.017936359948963518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 214.14285714285714, 95, 310, 284.0, 310.0, 310.0, 310.0, 0.031589873189223336, 0.055899267791867865, 0.01749165829911097], "isController": false}, {"data": ["addBook", 58, 14, 24.137931034482758, 1095.1896551724144, 524, 3297, 896.5, 1823.6000000000001, 2194.4499999999975, 3297.0, 0.27903933492417826, 70.12666014121555, 1.0176676175453199], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ac475601-071c-495e-9c1d-df5605a0dd38", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.6927026843817787, 1.29431602494577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 116.14285714285714, 94, 284, 104.0, 202.0, 284.0, 284.0, 0.06621388978225089, 0.04920778332450481, 0.0332362688946064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 160.71428571428572, 94, 310, 103.5, 308.5, 310.0, 310.0, 0.06621702155837031, 0.024822145218658068, 0.03736716688108369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 214.21428571428572, 97, 859, 105.5, 584.0, 859.0, 859.0, 0.06615162898386373, 4.268224367720368, 0.03848385782124885], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 185.5, 96, 612, 106.0, 408.6, 411.6, 612.0, 0.24143238384299998, 0.1794238711958232, 0.11670803711160642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 165.3571428571429, 93, 792, 102.5, 546.0, 792.0, 792.0, 0.06615287930407171, 1.4059240346404827, 0.038549187619016115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29d2f493-1aa0-41e5-8dbe-f2ea00d83417", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 1.5653722426470589, 2.924900428921569], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 637.4999999999999, 468, 1009, 605.0, 839.4000000000003, 915.25, 1009.0, 0.24131066162212475, 70.95334678496634, 0.12136229564003344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 102.28571428571428, 95, 108, 103.0, 108.0, 108.0, 108.0, 0.03161869658698755, 0.023497879006540552, 0.017754639196794767], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 144.23214285714286, 95, 415, 103.0, 305.5, 367.5999999999999, 415.0, 0.24178680448514522, 0.4278493063741046, 0.11758772327500226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 589.235294117647, 94, 1271, 106.0, 1227.8, 1271.0, 1271.0, 0.09545467306774474, 40.4325772410792, 0.052256608130492155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 116.33333333333333, 99, 300, 103.0, 186.60000000000008, 300.0, 300.0, 0.0890223564811243, 0.02399430702030303, 0.05233540879066096], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 961.2678571428569, 658, 1434, 914.0, 1241.4, 1325.3999999999999, 1434.0, 0.24095452413632862, 216.81130437074296, 0.12094787637311809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 454.2941176470589, 96, 900, 305.0, 898.4, 900.0, 900.0, 0.09544877769418213, 13.220730386679843, 0.05234659240845339], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 107.3076923076923, 102, 117, 107.0, 114.6, 117.0, 117.0, 0.06885593220338983, 0.05144022278866525, 0.024476132150423727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 141.06666666666666, 95, 309, 102.0, 303.0, 309.0, 309.0, 0.08902499821950004, 0.023995019051349622, 0.0524239003187095], "isController": false}, {"data": ["deleteBooks", 12, 4, 33.333333333333336, 582.4166666666666, 106, 1390, 548.5, 1286.8000000000004, 1390.0, 1390.0, 0.10666951118696498, 0.023333955572148592, 0.07100883801345814], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 14, 8.13953488372093, 202.84302325581402, 96, 2678, 111.0, 318.1, 492.04999999999995, 2478.7100000000028, 0.726403500251285, 1.534826817962016, 0.3482511875324665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 109.16666666666666, 104, 121, 107.0, 119.2, 121.0, 121.0, 0.0658627749084782, 0.051005059084397654, 0.023412158268248103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56a77350-79fd-4453-9729-72ad89282791", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 347.2857142857143, 194, 959, 220.0, 773.5, 959.0, 959.0, 0.06611882497402474, 5.745230552505431, 0.1474944212241428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56a77350-79fd-4453-9729-72ad89282791", 3, 0, 0.0, 353.0, 230, 542, 287.0, 542.0, 542.0, 542.0, 0.01759499832847516, 0.02425612562535557, 0.011283250881216168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab3635e6-b211-4c5c-8f2a-396375f3fb7e", 1, 0, 0.0, 621.0, 621, 621, 621.0, 621.0, 621.0, 621.0, 1.6103059581320451, 0.5142285628019324, 0.9608368558776168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 119.31578947368422, 101, 294, 106.0, 140.0, 294.0, 294.0, 0.10270436817894343, 0.0833470019108418, 0.0365081933761088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67ca7c27-025e-4c15-9844-5d04f2520295", 3, 0, 0.0, 942.3333333333334, 200, 2299, 328.0, 2299.0, 2299.0, 2299.0, 0.023978706908265462, 0.024048957026160767, 0.015376970250417628], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c5e81b9-1bc3-47fd-8ca8-85913dfeabaa", 1, 0, 0.0, 872.0, 872, 872, 872.0, 872.0, 872.0, 872.0, 1.146788990825688, 0.20718355791284404, 0.790657253440367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 726.7619047619047, 172, 1566, 734.0, 1444.4, 1557.8999999999999, 1566.0, 0.0895514750407246, 0.05500769316466384, 0.04049055951548387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 104.23529411764704, 97, 122, 103.0, 117.19999999999999, 122.0, 122.0, 0.09544181137329538, 0.0709289242725369, 0.04790731547448616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 160.9411764705882, 98, 310, 104.0, 305.2, 310.0, 310.0, 0.09544931360714186, 0.09300386359170153, 0.05066358327952612], "isController": false}, {"data": ["login", 21, 0, 0.0, 3386.5238095238096, 1811, 5734, 3412.0, 5153.6, 5692.4, 5734.0, 0.09006845202353789, 36.038844600021015, 0.18567822482586765], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ada29b80-7be6-4fa1-b2ee-666732e4f266", 1, 0, 0.0, 704.0, 704, 704, 704.0, 704.0, 704.0, 704.0, 1.4204545454545454, 0.2566250887784091, 0.9793368252840909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 359.75, 206, 1207, 210.0, 1026.7000000000007, 1207.0, 1207.0, 0.06413374022628522, 6.484966024149025, 0.14287085001255953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c5e81b9-1bc3-47fd-8ca8-85913dfeabaa", 3, 0, 0.0, 521.3333333333334, 218, 1027, 319.0, 1027.0, 1027.0, 1027.0, 0.02199961867327633, 0.02600280449305545, 0.014107828380974729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ada29b80-7be6-4fa1-b2ee-666732e4f266", 3, 0, 0.0, 354.6666666666667, 209, 433, 422.0, 433.0, 433.0, 433.0, 0.0396809650410698, 0.025511037095088823, 0.02544645219105062], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 119.53333333333335, 102, 291, 107.0, 186.00000000000006, 291.0, 291.0, 0.08626391005549645, 0.06983670062110016, 0.030664124277539756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 350.18749999999994, 199, 1112, 213.0, 766.2000000000004, 1112.0, 1112.0, 0.09246363578573864, 7.048010162692656, 0.20647427849469202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22d37245-1a1d-4c9e-b39b-7f9e89d1f4ad", 3, 0, 0.0, 1347.0, 225, 3407, 409.0, 3407.0, 3407.0, 3407.0, 0.02855185015989036, 0.023802502688632557, 0.018309617452794275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1666cb2d-3902-4297-a9a1-35081a216965", 3, 0, 0.0, 422.66666666666663, 246, 704, 318.0, 704.0, 704.0, 704.0, 0.016995530175563826, 0.023429710382002866, 0.010898826317011959], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a999905e-d749-436b-a972-804bf7615361", 1, 0, 0.0, 584.0, 584, 584, 584.0, 584.0, 584.0, 584.0, 1.7123287671232876, 0.3093562714041096, 1.180570419520548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 128.35714285714283, 105, 301, 114.0, 224.0, 301.0, 301.0, 0.06696738210153212, 0.05552276113691482, 0.023804811606403995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 720.0588235294117, 201, 1379, 409.0, 1332.6, 1379.0, 1379.0, 0.09538558218870635, 53.77911780785697, 0.20303956502771794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 123.70588235294117, 99, 309, 108.0, 168.9999999999999, 309.0, 309.0, 0.09217239490991504, 0.07155962300135005, 0.03276440600313386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67ca7c27-025e-4c15-9844-5d04f2520295", 1, 0, 0.0, 1390.0, 1390, 1390, 1390.0, 1390.0, 1390.0, 1390.0, 0.7194244604316546, 0.12997414568345325, 0.4960094424460432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/722fe06c-ce39-45e4-a0fd-4991be5b2b88", 3, 0, 0.0, 448.3333333333333, 199, 693, 453.0, 693.0, 693.0, 693.0, 0.016499835001649983, 0.022746354567704324, 0.01058094887801122], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22d37245-1a1d-4c9e-b39b-7f9e89d1f4ad", 1, 0, 0.0, 952.0, 952, 952, 952.0, 952.0, 952.0, 952.0, 1.050420168067227, 0.18977317489495799, 0.7242154674369748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 8, 53.333333333333336, 582.2, 94, 1290, 106.0, 1254.0, 1290.0, 1290.0, 0.06747516913775731, 37.68071748034223, 0.09484742036805456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 377.10526315789474, 197, 1197, 208.0, 685.0, 1197.0, 1197.0, 0.10594401695104272, 6.826386420346827, 0.2368439050825248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a999905e-d749-436b-a972-804bf7615361", 3, 0, 0.0, 344.6666666666667, 195, 444, 395.0, 444.0, 444.0, 444.0, 0.03020174767446543, 0.030290229357105465, 0.019367657200096648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 103.3846153846154, 98, 112, 102.0, 110.8, 112.0, 112.0, 0.06924396245911943, 0.05145962444471669, 0.03475722334373768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 133.0, 98, 310, 102.0, 305.2, 310.0, 310.0, 0.06924986416372798, 0.018529748809435028, 0.03949406315587612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 194.07692307692307, 96, 314, 106.0, 311.6, 314.0, 314.0, 0.0692469131856776, 0.018664207069577166, 0.04070961107204875], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1412.0, 166, 2704, 1336.0, 2598.9, 2694.3999999999996, 2704.0, 0.08982011480643765, 0.028116630398393037, 0.040524309609935735], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 208.61538461538464, 98, 308, 286.0, 306.8, 308.0, 308.0, 0.0692469131856776, 0.018664207069577166, 0.04077723501070664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=722fe06c-ce39-45e4-a0fd-4991be5b2b88", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 18.91891891891892, 0.5388760585065435], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.81081081081081, 0.30792917628945343], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.81081081081081, 0.30792917628945343], "isController": false}, {"data": ["401/Unauthorized", 22, 59.45945945945946, 1.6936104695919938], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1299, 37, "401/Unauthorized", 22, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
