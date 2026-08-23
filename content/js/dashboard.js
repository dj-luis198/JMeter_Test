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

    var data = {"OkPercent": 99.61210240496509, "KoPercent": 0.3878975950349108};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7402684563758389, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99ff1e38-06e5-4283-8466-e5e469ab7a22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8c605e14-98e4-43fb-aabe-60be98d36218"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65bcd43a-3a3d-49f6-9586-43f5c61a9a1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0ed868f6-07f7-4107-8bae-b4ee029e10d4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/abd79ef7-ff22-4d5b-b500-dc7a349aeda3"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ad7e5d5-3975-49b5-a0b9-c1e80c28cf6e"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b0b192ce-93dd-4d39-bd7a-6226be40471f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/048d2029-c70f-4c85-95c2-66c1d3d6e35a"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cf76003a-bc96-4110-81ee-9b0fb9056859"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.34375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=863c0834-b980-4a12-bd94-eebcb8d0dc2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f89a5a02-54e4-4d26-83e6-d456c510f6fe"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5c8589b3-1341-4b2d-a172-a9ab749bf3b7"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e5f7f8c6-3803-412d-9de1-548d37837aed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5d9f35ed-ab54-42d2-b305-6766d2be78bb"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7185bc53-7479-4b4d-992b-e4956046f7fa"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0b192ce-93dd-4d39-bd7a-6226be40471f"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.2767857142857143, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/017baba3-6d63-4acf-bbbf-37a38eace75b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/99ff1e38-06e5-4283-8466-e5e469ab7a22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/65bcd43a-3a3d-49f6-9586-43f5c61a9a1f"], "isController": false}, {"data": [0.175, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abd79ef7-ff22-4d5b-b500-dc7a349aeda3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.38392857142857145, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9573863636363636, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1ad7e5d5-3975-49b5-a0b9-c1e80c28cf6e"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe0a999f-5c2f-4581-9060-198de9f9e4e4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5f7f8c6-3803-412d-9de1-548d37837aed"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ed868f6-07f7-4107-8bae-b4ee029e10d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f89a5a02-54e4-4d26-83e6-d456c510f6fe"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7185bc53-7479-4b4d-992b-e4956046f7fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/863c0834-b980-4a12-bd94-eebcb8d0dc2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=048d2029-c70f-4c85-95c2-66c1d3d6e35a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1289, 5, 0.3878975950349108, 477.3816912335145, 136, 2875, 160.0, 1257.0, 1645.5, 2146.499999999997, 5.138201270797955, 718.6785327189117, 3.755366410753151], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2223.892857142858, 1677, 2921, 2222.5, 2694.4000000000005, 2820.2, 2921.0, 0.2440523143568132, 293.67775040284977, 1.2000033230337446], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99ff1e38-06e5-4283-8466-e5e469ab7a22", 1, 0, 0.0, 736.0, 736, 736, 736.0, 736.0, 736.0, 736.0, 1.358695652173913, 0.24546747622282608, 0.9367569633152174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c605e14-98e4-43fb-aabe-60be98d36218", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 1.237736191860465, 2.3127119670542635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65bcd43a-3a3d-49f6-9586-43f5c61a9a1f", 1, 0, 0.0, 646.0, 646, 646, 646.0, 646.0, 646.0, 646.0, 1.5479876160990713, 0.2796657314241486, 1.067264899380805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ed868f6-07f7-4107-8bae-b4ee029e10d4", 3, 0, 0.0, 331.6666666666667, 253, 464, 278.0, 464.0, 464.0, 464.0, 0.03156001136160409, 0.026310282909201847, 0.0202386791609245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abd79ef7-ff22-4d5b-b500-dc7a349aeda3", 3, 0, 0.0, 345.0, 248, 537, 250.0, 537.0, 537.0, 537.0, 0.017051752067524937, 0.023507216798817746, 0.010934880069343792], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 797.5454545454546, 503, 1623, 615.0, 1592.2, 1623.0, 1623.0, 0.08732376476565476, 0.015776266095357552, 0.05935287136415598], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 797.5454545454546, 503, 1623, 615.0, 1592.2, 1623.0, 1623.0, 0.08841590843327012, 0.015973577207182586, 0.06009518776323827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 156.93749999999997, 137, 416, 139.0, 227.7000000000002, 416.0, 416.0, 0.10441478774431429, 0.037740745423695626, 0.059000982967337745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 140.875, 138, 148, 140.0, 147.3, 148.0, 148.0, 0.10441274357535336, 0.07759579869223039, 0.0524103029274723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 235.12500000000003, 137, 1113, 140.0, 626.5000000000005, 1113.0, 1113.0, 0.10441615056808912, 1.9452479027037257, 0.060926415980891845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 287.50000000000006, 137, 1393, 140.5, 714.7000000000007, 1393.0, 1393.0, 0.10441478774431429, 5.898422204865076, 0.0608236532123862], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ad7e5d5-3975-49b5-a0b9-c1e80c28cf6e", 1, 0, 0.0, 2110.0, 2110, 2110, 2110.0, 2110.0, 2110.0, 2110.0, 0.47393364928909953, 0.08562277843601897, 0.3267550355450237], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 417.9090909090909, 237, 1575, 257.0, 1375.4000000000005, 1575.0, 1575.0, 0.0876186834894539, 0.22973457015070414, 0.05664410983400242], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b0b192ce-93dd-4d39-bd7a-6226be40471f", 3, 0, 0.0, 541.0, 282, 1012, 329.0, 1012.0, 1012.0, 1012.0, 0.021192876367823563, 0.02504926239959875, 0.013590483868688939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 158.6, 138, 422, 140.0, 253.4000000000001, 422.0, 422.0, 0.0942661069354717, 0.07005518298622458, 0.0473171669578442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 195.86666666666667, 137, 422, 139.0, 420.8, 422.0, 422.0, 0.09409934381390914, 0.025178925981456154, 0.053666032018870054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 864.6666666666666, 687, 1087, 820.0, 1087.0, 1087.0, 1087.0, 0.19948134849391583, 58.65413986136046, 0.11376670656293637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1412.6666666666667, 1229, 1505, 1504.0, 1505.0, 1505.0, 1505.0, 0.19761544035307294, 177.81472060058627, 0.1125095719978921], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 414.6666666666667, 411, 418, 415.0, 418.0, 418.0, 418.0, 0.20887001322843415, 0.36960201559562766, 0.1156536108403537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 20, 0, 0.0, 173.05, 137, 503, 140.0, 394.90000000000055, 498.94999999999993, 503.0, 0.11142992450622616, 0.08281071538011532, 0.055932598824414294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 20, 0, 0.0, 210.15000000000003, 136, 426, 140.0, 423.0, 425.9, 426.0, 0.11125883812395347, 0.046480987255300095, 0.06251790571926058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 20, 0, 0.0, 285.74999999999994, 136, 1510, 139.5, 1280.1000000000022, 1503.3, 1510.0, 0.1114305453410889, 10.053570669948297, 0.0645513666956386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 20, 0, 0.0, 253.04999999999998, 138, 1100, 140.0, 799.200000000001, 1087.1, 1100.0, 0.11142992450622616, 3.3034402248098726, 0.06465982533359334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 234.33333333333334, 139, 414, 150.0, 414.0, 414.0, 414.0, 0.2128867442520579, 0.15820977771075787, 0.11954089643059891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1073.0625, 138, 1921, 1451.0, 1844.7, 1921.0, 1921.0, 0.07541513676063707, 42.41929291533708, 0.040285234187566875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 214.79999999999998, 137, 422, 141.0, 420.2, 422.0, 422.0, 0.09410111478453981, 0.025363191094270498, 0.055321163183879855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 736.125, 139, 1386, 820.0, 1296.4, 1386.0, 1386.0, 0.07541478129713425, 13.866653557456637, 0.0403586915535445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 139.66666666666666, 137, 152, 139.0, 145.4, 152.0, 152.0, 0.09426788418876202, 0.02540814066025226, 0.055511263833812004], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 775.0, 358, 2110, 609.0, 1927.6000000000006, 2110.0, 2110.0, 0.088217367593751, 0.015937708012542906, 0.060821739766785364], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 20, 0, 0.0, 503.0, 277, 2012, 285.5, 1447.4000000000015, 1987.0999999999997, 2012.0, 0.11117349179261697, 13.455282113157939, 0.2471873106576468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/048d2029-c70f-4c85-95c2-66c1d3d6e35a", 3, 0, 0.0, 750.3333333333334, 492, 1182, 577.0, 1182.0, 1182.0, 1182.0, 0.020163593958987248, 0.023832685437852445, 0.012930429719793256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 661.2, 148, 1194, 666.5, 1125.6000000000001, 1190.7, 1194.0, 0.08790126929432862, 0.05399404139270771, 0.03974442156569741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 158.875, 138, 418, 140.5, 230.4000000000002, 418.0, 418.0, 0.07541442583698228, 0.05604529107611672, 0.037854506718954004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 278.1875, 138, 422, 280.5, 420.6, 422.0, 422.0, 0.07541122684639676, 0.09096847457227696, 0.039049612339161995], "isController": false}, {"data": ["login", 20, 0, 0.0, 3170.6000000000004, 1728, 4856, 3108.0, 4541.600000000001, 4842.599999999999, 4856.0, 0.08715926176105288, 15.763224885875841, 0.15318410487438172], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cf76003a-bc96-4110-81ee-9b0fb9056859", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.9504045758928571, 1.7758324032738093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 145.73333333333335, 141, 153, 144.0, 151.8, 153.0, 153.0, 0.09421518748822309, 0.07627381877708686, 0.03349055492745431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1250.7499999999998, 281, 2061, 1594.0, 1985.4, 2061.0, 2061.0, 0.07536043482970897, 56.39209747224617, 0.15743633809517082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=863c0834-b980-4a12-bd94-eebcb8d0dc2d", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.504648219273743, 1.925846717877095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f89a5a02-54e4-4d26-83e6-d456c510f6fe", 3, 0, 0.0, 341.6666666666667, 239, 477, 309.0, 477.0, 477.0, 477.0, 0.04432034747152418, 0.028493712974043052, 0.028421576991830285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c8589b3-1341-4b2d-a172-a9ab749bf3b7", 1, 0, 0.0, 740.0, 740, 740, 740.0, 740.0, 740.0, 740.0, 1.3513513513513513, 0.43153505067567566, 0.8063239020270271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 447.24999999999994, 277, 1533, 286.0, 856.8000000000006, 1533.0, 1533.0, 0.10431811810114945, 7.951614170067871, 0.23294571953421958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1647.6666666666667, 1379, 1919, 1645.0, 1919.0, 1919.0, 1919.0, 0.19580967299784607, 234.2564433620521, 0.4415278661640885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5f7f8c6-3803-412d-9de1-548d37837aed", 3, 0, 0.0, 941.0, 237, 2105, 481.0, 2105.0, 2105.0, 2105.0, 0.029751574354142905, 0.02983873716963356, 0.01907897183517628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d9f35ed-ab54-42d2-b305-6766d2be78bb", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 0.9886561532507739, 1.8473055340557274], "isController": false}, {"data": ["register", 21, 3, 14.285714285714286, 1427.047619047619, 467, 2546, 1299.0, 2171.0, 2509.1999999999994, 2546.0, 0.08822602667786997, 0.028161432622623675, 0.039805101880054615], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 160.78947368421052, 140, 427, 145.0, 161.0, 427.0, 427.0, 0.08874067639077658, 0.06889534934635486, 0.03154453731078386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 411.79999999999995, 278, 845, 283.0, 674.6000000000001, 845.0, 845.0, 0.09401618331902198, 0.1457067216086796, 0.21144459978877697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7185bc53-7479-4b4d-992b-e4956046f7fa", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 601.7058823529412, 279, 1522, 558.0, 1294.7999999999997, 1522.0, 1522.0, 0.10181164845036683, 14.468886856191046, 0.2259121406647702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 174.25000000000003, 140, 413, 140.0, 413.0, 413.0, 413.0, 0.04344662039601594, 0.03228796691539857, 0.021808166878468944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 174.875, 137, 416, 140.5, 416.0, 416.0, 416.0, 0.043381595358169295, 0.011607965945447643, 0.024741066102705926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0b192ce-93dd-4d39-bd7a-6226be40471f", 1, 0, 0.0, 1198.0, 1198, 1198, 1198.0, 1198.0, 1198.0, 1198.0, 0.8347245409015025, 0.15080472662771285, 0.5755034432387313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 261.75, 139, 553, 145.5, 553.0, 553.0, 553.0, 0.043381830604796945, 0.011692759030199177, 0.025503771507898204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 192.625, 137, 560, 140.5, 560.0, 560.0, 560.0, 0.043447564220930865, 0.011710476293922772, 0.025584844946505186], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1514.0357142857142, 1095, 2350, 1377.0, 2109.7000000000007, 2242.15, 2350.0, 0.24805102763997164, 296.75526554748404, 0.48980388465627217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, 14.285714285714286, 1427.047619047619, 467, 2546, 1299.0, 2171.0, 2509.1999999999994, 2546.0, 0.0873184503885671, 0.027871737512422088, 0.0393956289839043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 142.8, 137, 158, 140.0, 158.0, 158.0, 158.0, 0.027460758575994903, 0.007401532584936126, 0.016170739669262624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/017baba3-6d63-4acf-bbbf-37a38eace75b", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.7943680037313432, 1.48427782960199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 142.4, 137, 158, 139.0, 158.0, 158.0, 158.0, 0.02746090939547554, 0.007401573235499267, 0.016144011187574487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 226.26315789473685, 137, 1234, 140.0, 422.0, 1234.0, 1234.0, 0.08977296888657894, 4.274390230397599, 0.0523706412861159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 219.05263157894737, 137, 1100, 139.0, 416.0, 1100.0, 1100.0, 0.0897712722479199, 1.4121718771409266, 0.052457318780150156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 158.05263157894737, 139, 415, 142.0, 163.0, 415.0, 415.0, 0.08977212055923307, 0.06671541381403942, 0.045061396452583787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 140.4, 138, 143, 141.0, 143.0, 143.0, 143.0, 0.027460607758170906, 0.007347857935291823, 0.015661127862081844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 235.0526315789474, 139, 553, 140.0, 420.0, 553.0, 553.0, 0.08976915153977719, 0.03111652744573691, 0.05079966891719505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99ff1e38-06e5-4283-8466-e5e469ab7a22", 3, 0, 0.0, 460.0, 327, 538, 515.0, 538.0, 538.0, 538.0, 0.01743202961120763, 0.02403146009227354, 0.011178742947291353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 147.8, 140, 163, 143.0, 163.0, 163.0, 163.0, 0.027460758575994903, 0.020407848902668085, 0.01378401358209119], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 208.2, 144, 425, 148.0, 425.0, 425.0, 425.0, 0.028152519087407943, 0.022159111703565233, 0.01000734076935204], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 877.0909090909091, 464, 1829, 705.0, 1750.8000000000002, 1829.0, 1829.0, 0.08919521589296574, 0.016114370058787755, 0.060711978005270624], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/65bcd43a-3a3d-49f6-9586-43f5c61a9a1f", 3, 0, 0.0, 933.6666666666666, 257, 1839, 705.0, 1839.0, 1839.0, 1839.0, 0.03835287199089759, 0.03197321131793252, 0.024594777936871173], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1780.4999999999998, 924, 2875, 1751.0, 2540.8, 2858.3999999999996, 2875.0, 0.0880262318170815, 0.04556045201470038, 0.04048862811117713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 292.4, 280, 311, 284.0, 311.0, 311.0, 311.0, 0.027439359016573375, 0.04252564722588081, 0.06171176153825047], "isController": false}, {"data": ["addBook", 60, 2, 3.3333333333333335, 1461.2833333333333, 718, 3216, 1142.0, 2474.7, 2551.65, 3216.0, 0.27436598593417044, 88.55315812397684, 0.9983367276597496], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 263.1607142857143, 138, 613, 143.0, 560.9, 568.4, 613.0, 0.24941654344301722, 0.18535741167982042, 0.1205675673870054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abd79ef7-ff22-4d5b-b500-dc7a349aeda3", 1, 0, 0.0, 896.0, 896, 896, 896.0, 896.0, 896.0, 896.0, 1.1160714285714286, 0.20163399832589285, 0.7694789341517857], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 877.9642857142858, 681, 1253, 822.5, 1117.3, 1232.65, 1253.0, 0.24915797950675622, 73.26071879852462, 0.1253089447714643], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 226.55357142857136, 137, 565, 143.0, 421.0, 446.3999999999998, 565.0, 0.24991966867792498, 0.4422406637152344, 0.12154296386875647], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1246.964285714286, 953, 1790, 1235.0, 1632.8, 1649.75, 1790.0, 0.24870208598874624, 223.78257414430936, 0.12483678925606988], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 147.2941176470588, 141, 168, 146.0, 156.0, 168.0, 168.0, 0.10293984074601109, 0.07690329899482273, 0.036591896515183624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 2, 1.1363636363636365, 232.32954545454547, 138, 2367, 146.0, 400.20000000000005, 509.6500000000001, 1701.7199999999912, 0.7294429708222812, 1.5277407213610743, 0.3525711180993037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 192.75, 141, 519, 146.5, 519.0, 519.0, 519.0, 0.04268920656773443, 0.0330591218830209, 0.015174678897124348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 146.5, 140, 156, 146.5, 155.3, 156.0, 156.0, 0.10633702189878044, 0.08629498554481109, 0.03779948825308211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 438.0, 280, 974, 286.0, 974.0, 974.0, 974.0, 0.04334845110565643, 0.0671816327194109, 0.0974916825159441], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ad7e5d5-3975-49b5-a0b9-c1e80c28cf6e", 3, 0, 0.0, 896.6666666666667, 303, 1829, 558.0, 1829.0, 1829.0, 1829.0, 0.017235238018637036, 0.0237601669950937, 0.011052545213774401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 466.842105263158, 281, 1650, 296.0, 694.0, 1650.0, 1650.0, 0.08970811811254119, 5.780244103461789, 0.20054762527266545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe0a999f-5c2f-4581-9060-198de9f9e4e4", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.7478593384074942, 1.3973763173302107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5f7f8c6-3803-412d-9de1-548d37837aed", 1, 0, 0.0, 609.0, 609, 609, 609.0, 609.0, 609.0, 609.0, 1.6420361247947455, 0.29665691707717573, 1.1321069376026274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ed868f6-07f7-4107-8bae-b4ee029e10d4", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.3481003131021195, 1.3284260597302504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 20, 0, 0.0, 203.2, 139, 452, 143.0, 431.6, 451.05, 452.0, 0.1161986764970747, 0.09634050424415666, 0.041304998286069525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f89a5a02-54e4-4d26-83e6-d456c510f6fe", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7185bc53-7479-4b4d-992b-e4956046f7fa", 3, 0, 0.0, 501.66666666666663, 245, 1008, 252.0, 1008.0, 1008.0, 1008.0, 0.022486564277843988, 0.026578357712516768, 0.014420094930778858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 145.8125, 139, 170, 142.5, 160.20000000000002, 170.0, 170.0, 0.07492285287493035, 0.058167644565985964, 0.026632732857885397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/863c0834-b980-4a12-bd94-eebcb8d0dc2d", 3, 0, 0.0, 1088.6666666666667, 253, 1575, 1438.0, 1575.0, 1575.0, 1575.0, 0.059396531242575434, 0.026875383602597606, 0.03808957244396927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=048d2029-c70f-4c85-95c2-66c1d3d6e35a", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 207.88235294117646, 138, 446, 142.0, 423.59999999999997, 446.0, 446.0, 0.10248495882516066, 0.07616313834565162, 0.051442645347785726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 222.05882352941177, 137, 431, 140.0, 421.4, 431.0, 431.0, 0.10230733122299387, 0.045452946902495094, 0.05733630074744533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 334.0, 137, 1096, 145.0, 1088.8, 1096.0, 1096.0, 0.10189952706631261, 10.811219044272349, 0.05887554246512939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 391.47058823529414, 138, 1104, 414.0, 1096.0, 1104.0, 1104.0, 0.10190074867079464, 3.549199329852723, 0.058975760734045035], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 60.0, 0.23273855702094648], "isController": false}, {"data": ["401/Unauthorized", 2, 40.0, 0.1551590380139643], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1289, 5, "406/Not Acceptable", 3, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
