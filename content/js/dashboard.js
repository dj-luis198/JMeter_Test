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

    var data = {"OkPercent": 98.65671641791045, "KoPercent": 1.3432835820895523};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7730473751600512, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03508771929824561, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c34cbc09-7b26-4e85-b712-781128fa7d9b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/47f79358-b421-461f-b48e-134e093b823c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f37eac9-0e6d-4e9c-8271-10c2454d2786"], "isController": false}, {"data": [0.8, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a1e5b57-ac79-453f-b48d-b665ecd00126"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e07753c6-73ae-4699-bdda-22e57fb7354d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bebc8da8-2bfe-4b7c-88b5-de9c8e65aa71"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc82016b-4e70-4626-9ed3-895716b0eed6"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1bb5e56e-ae87-4807-ba7f-7b7a36515edb"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e07753c6-73ae-4699-bdda-22e57fb7354d"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cbfb1b4f-6f26-44e4-a1e3-9266d7dca61d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/78edddb3-f1ce-49b2-ae02-271a842002d8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e0431660-7eb9-4b8a-b06b-9cfad3514900"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14998af3-0862-4f3a-b50e-b0a75efc51d8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8dfbdc1f-7f20-43eb-90c5-36352f72fb9d"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5019aba8-9249-4b30-865b-2f9e2dc37005"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9a6a359-6478-4fbb-8326-14eded08a9bc"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/1bb5e56e-ae87-4807-ba7f-7b7a36515edb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5f37eac9-0e6d-4e9c-8271-10c2454d2786"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47f79358-b421-461f-b48e-134e093b823c"], "isController": false}, {"data": [0.3684210526315789, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a1e5b57-ac79-453f-b48d-b665ecd00126"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.30327868852459017, 500, 1500, "addBook"], "isController": true}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/73192f77-1d28-4710-ab86-fa8b7fe61246"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bebc8da8-2bfe-4b7c-88b5-de9c8e65aa71"], "isController": false}, {"data": [0.9413407821229051, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d9a6a359-6478-4fbb-8326-14eded08a9bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bc82016b-4e70-4626-9ed3-895716b0eed6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8dfbdc1f-7f20-43eb-90c5-36352f72fb9d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/14998af3-0862-4f3a-b50e-b0a75efc51d8"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8de7682c-9b4a-4f25-8135-14cdfafea723"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cbfb1b4f-6f26-44e4-a1e3-9266d7dca61d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0431660-7eb9-4b8a-b06b-9cfad3514900"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5019aba8-9249-4b30-865b-2f9e2dc37005"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1340, 18, 1.3432835820895523, 400.45597014925437, 109, 2519, 130.0, 1138.9, 1358.95, 1770.7999999999984, 5.290879944406276, 749.7525452488688, 3.8617647490681737], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1883.245614035088, 1372, 2488, 1845.0, 2306.2, 2377.1, 2488.0, 0.25040526114632894, 301.32124211580367, 1.2312407127653966], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c34cbc09-7b26-4e85-b712-781128fa7d9b", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 1.5887360074626864, 2.96855565920398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47f79358-b421-461f-b48e-134e093b823c", 3, 0, 0.0, 626.0, 231, 1079, 568.0, 1079.0, 1079.0, 1079.0, 0.023318357765790415, 0.02338667326705738, 0.014953504166213254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f37eac9-0e6d-4e9c-8271-10c2454d2786", 1, 0, 0.0, 713.0, 713, 713, 713.0, 713.0, 713.0, 713.0, 1.402524544179523, 0.2533857819074334, 0.9669749298737729], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 436.53333333333336, 116, 696, 463.0, 624.0, 696.0, 696.0, 0.07522718610202812, 0.014736888214909026, 0.050651012934060866], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 436.53333333333336, 116, 696, 463.0, 624.0, 696.0, 696.0, 0.07510815574427175, 0.014713570353809486, 0.05057086892625381], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a1e5b57-ac79-453f-b48d-b665ecd00126", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 180.77777777777777, 110, 349, 116.5, 345.4, 349.0, 349.0, 0.10286772353727812, 0.03610862474425941, 0.05818678849824553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 145.22222222222223, 113, 351, 116.0, 342.90000000000003, 351.0, 351.0, 0.10299191513466192, 0.0765398900561306, 0.05169711365157836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 182.11111111111111, 111, 897, 114.0, 393.9000000000008, 897.0, 897.0, 0.10299839780270084, 1.7087161500057222, 0.06016063100823987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 228.05555555555557, 109, 1231, 115.5, 437.20000000000124, 1231.0, 1231.0, 0.10299780843552052, 5.174974903224976, 0.060059702965764676], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 325.56250000000006, 113, 1848, 220.5, 821.8000000000011, 1848.0, 1848.0, 0.07532247434328218, 0.13760235471000848, 0.048685608111288955], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 138.8461538461538, 110, 402, 117.0, 290.7999999999999, 402.0, 402.0, 0.07221098940164863, 0.05366461224087365, 0.036246531789499416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 133.15384615384613, 114, 342, 116.0, 252.79999999999993, 342.0, 342.0, 0.07221339614047173, 0.036009053754541116, 0.04025115680305741], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 870.4, 686, 926, 915.0, 926.0, 926.0, 926.0, 0.042137553830725025, 12.38983992470019, 0.02403157366908536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1205.0, 1036, 1256, 1244.0, 1256.0, 1256.0, 1256.0, 0.04202175045803708, 37.81124492849999, 0.023924492692417594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e07753c6-73ae-4699-bdda-22e57fb7354d", 3, 0, 0.0, 658.6666666666667, 218, 1356, 402.0, 1356.0, 1356.0, 1356.0, 0.02515765463571716, 0.029735496087984703, 0.01613300118240977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 183.2, 114, 457, 115.0, 457.0, 457.0, 457.0, 0.042423933886541434, 0.07507047676016901, 0.023490596204754875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bebc8da8-2bfe-4b7c-88b5-de9c8e65aa71", 3, 0, 0.0, 446.33333333333337, 228, 869, 242.0, 869.0, 869.0, 869.0, 0.03838182236892607, 0.03199734605690745, 0.024613343120698034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 118.12500000000001, 111, 127, 117.0, 127.0, 127.0, 127.0, 0.08734768746997423, 0.0649136622701664, 0.04384444468707691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 214.87499999999997, 114, 348, 117.0, 347.3, 348.0, 348.0, 0.0872429060612009, 0.03972363764749504, 0.04883983974568693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 317.6875, 114, 1354, 118.5, 1241.3000000000002, 1354.0, 1354.0, 0.0868423052289923, 9.788088237888212, 0.05012090077181099], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc82016b-4e70-4626-9ed3-895716b0eed6", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 257.375, 114, 909, 116.5, 904.1, 909.0, 909.0, 0.08697637504212918, 3.217255263429696, 0.050283216821230936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 116.4, 115, 117, 117.0, 117.0, 117.0, 117.0, 0.04242249410327332, 0.031526873059170894, 0.023821224716193516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 773.8421052631579, 114, 1561, 1042.0, 1512.0, 1561.0, 1561.0, 0.08484983811544045, 40.1940085268505, 0.04604464385396896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 253.6923076923077, 110, 1240, 117.0, 1057.1999999999998, 1240.0, 1240.0, 0.07221339614047173, 10.013044846602082, 0.04149883417026808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 507.78947368421046, 111, 949, 581.0, 925.0, 949.0, 949.0, 0.08476164134226752, 13.12805169790951, 0.046079558001498946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 251.92307692307696, 115, 871, 117.0, 791.4, 871.0, 871.0, 0.07221339614047173, 3.2831056759729367, 0.04156935506493651], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 549.7142857142858, 121, 1138, 498.0, 1069.5, 1138.0, 1138.0, 0.07059760875813764, 0.013330617111347557, 0.04831425359417469], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1bb5e56e-ae87-4807-ba7f-7b7a36515edb", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 480.0, 231, 1474, 456.5, 1355.7, 1474.0, 1474.0, 0.0867820144275099, 13.095365721782285, 0.19239928540434995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e07753c6-73ae-4699-bdda-22e57fb7354d", 1, 0, 0.0, 671.0, 671, 671, 671.0, 671.0, 671.0, 671.0, 1.4903129657228018, 0.2692459947839046, 1.0275009314456036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 614.8181818181819, 137, 1162, 647.5, 1078.6, 1157.5, 1162.0, 0.0940215138318468, 0.057753449414288706, 0.042511680570454166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 117.05263157894738, 112, 134, 116.0, 120.0, 134.0, 134.0, 0.08484832245935095, 0.06305622401520125, 0.042589880609478895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 199.63157894736844, 111, 356, 116.0, 355.0, 356.0, 356.0, 0.08476164134226752, 0.0896845779539432, 0.04459396385585168], "isController": false}, {"data": ["login", 22, 0, 0.0, 2699.5, 1880, 3991, 2632.0, 3602.7, 3937.2999999999993, 3991.0, 0.09183081424713342, 25.095138321468376, 0.17316108794470114], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cbfb1b4f-6f26-44e4-a1e3-9266d7dca61d", 3, 0, 0.0, 673.6666666666666, 304, 915, 802.0, 915.0, 915.0, 915.0, 0.08892050506846878, 0.0402342129053293, 0.057022589513308436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 124.92307692307693, 114, 153, 121.0, 146.2, 153.0, 153.0, 0.0691147464286284, 0.05595324686458295, 0.0245681325195515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78edddb3-f1ce-49b2-ae02-271a842002d8", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 1.580870977722772, 2.953859839108911], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0431660-7eb9-4b8a-b06b-9cfad3514900", 3, 0, 0.0, 452.3333333333333, 212, 672, 473.0, 672.0, 672.0, 672.0, 0.03829705750941469, 0.03112882571647412, 0.02455898544711815], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14998af3-0862-4f3a-b50e-b0a75efc51d8", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 0.6187125428082192, 2.361140839041096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8dfbdc1f-7f20-43eb-90c5-36352f72fb9d", 3, 0, 0.0, 358.0, 212, 601, 261.0, 601.0, 601.0, 601.0, 0.024576868251601592, 0.024648870795307455, 0.01576055678895024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 904.5263157894736, 230, 1680, 1161.0, 1632.0, 1680.0, 1680.0, 0.08471666733548247, 53.40460593234037, 0.17912158430200156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 424.83333333333337, 229, 1346, 348.0, 764.6000000000009, 1346.0, 1346.0, 0.1027942914903459, 6.982555442886349, 0.22972561062664543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 869.375, 113, 1374, 1256.0, 1374.0, 1374.0, 1374.0, 0.06716818914562064, 50.22955581361667, 0.11120631706323886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5019aba8-9249-4b30-865b-2f9e2dc37005", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9a6a359-6478-4fbb-8326-14eded08a9bc", 1, 0, 0.0, 1001.0, 1001, 1001, 1001.0, 1001.0, 1001.0, 1001.0, 0.999000999000999, 0.18048357892107894, 0.6887643606393608], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1129.9565217391303, 165, 1976, 1031.0, 1885.0000000000002, 1974.6, 1976.0, 0.09482268158543523, 0.03001859349104132, 0.04278132704342879], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 429.15384615384613, 228, 1642, 240.0, 1343.9999999999998, 1642.0, 1642.0, 0.07216449062971844, 13.376760614078181, 0.159459021324607], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 134.0625, 115, 347, 118.5, 201.40000000000015, 347.0, 347.0, 0.09702967895304977, 0.07533065895280719, 0.03449101869034191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 356.7222222222222, 229, 1490, 238.5, 583.7000000000014, 1490.0, 1490.0, 0.11667855059311596, 7.925677940866662, 0.2607542782135217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1bb5e56e-ae87-4807-ba7f-7b7a36515edb", 3, 0, 0.0, 1303.0, 849, 1848, 1212.0, 1848.0, 1848.0, 1848.0, 0.02276417828904436, 0.026906488075364606, 0.01459812214499264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 116.8, 111, 119, 117.5, 119.0, 119.0, 119.0, 0.05246424561661228, 0.0389895419084394, 0.026334592038026086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 117.1, 111, 123, 117.5, 122.7, 123.0, 123.0, 0.05246231893942176, 0.014037768934962462, 0.02991991627013897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 160.79999999999998, 112, 343, 117.0, 342.3, 343.0, 343.0, 0.05246286940417919, 0.014140382769095173, 0.030842429083316285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f37eac9-0e6d-4e9c-8271-10c2454d2786", 3, 0, 0.0, 373.0, 227, 510, 382.0, 510.0, 510.0, 510.0, 0.03671925680224233, 0.03061133355160892, 0.023547179655083784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 138.10000000000002, 113, 338, 116.0, 316.20000000000005, 338.0, 338.0, 0.052463144640889775, 0.01414045695398982, 0.030893824432086457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 121.0, 121, 121, 121.0, 121.0, 121.0, 121.0, 8.264462809917356, 2.4373708677685952, 5.108793904958678], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47f79358-b421-461f-b48e-134e093b823c", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1287.5789473684208, 880, 1890, 1235.0, 1807.0, 1841.1, 1890.0, 0.24478227261015204, 292.84469812870395, 0.4833493703298119], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1129.9565217391303, 165, 1976, 1031.0, 1885.0000000000002, 1974.6, 1976.0, 0.09666830582489587, 0.030602873990761875, 0.043614020792091694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 199.75, 111, 344, 115.0, 344.0, 344.0, 344.0, 0.05511577758027957, 0.01485542442593473, 0.03245587293057479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 172.625, 114, 348, 115.0, 348.0, 348.0, 348.0, 0.05511463844797178, 0.014855117394179896, 0.03240137924382716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 284.56249999999994, 111, 1233, 227.0, 616.3000000000006, 1233.0, 1233.0, 0.09810293450402835, 5.541863750735772, 0.05714687542153605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 250.49999999999997, 113, 895, 120.5, 512.8000000000004, 895.0, 895.0, 0.09830606364088795, 1.8314184451360003, 0.05736120412639702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 145.68750000000003, 112, 351, 117.5, 346.8, 351.0, 351.0, 0.09877701705755614, 0.07340752927812522, 0.04958143239021861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a1e5b57-ac79-453f-b48d-b665ecd00126", 3, 0, 0.0, 313.6666666666667, 209, 493, 239.0, 493.0, 493.0, 493.0, 0.018600037200074398, 0.025629543446586894, 0.011927758230516462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 143.25, 114, 334, 116.5, 334.0, 334.0, 334.0, 0.05511349936275017, 0.014747166821673383, 0.03143191760531845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 159.375, 111, 358, 116.0, 348.90000000000003, 358.0, 358.0, 0.09877762686751451, 0.03570319252376837, 0.055815629244351156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 180.375, 115, 405, 117.0, 405.0, 405.0, 405.0, 0.05511349936275017, 0.04095837208501257, 0.027664393234817952], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 775.7857142857143, 115, 1818, 735.0, 1587.0, 1818.0, 1818.0, 0.07034433552238206, 0.013145401427487553, 0.04787595435908774], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 121.875, 119, 126, 121.0, 126.0, 126.0, 126.0, 0.054127931365783026, 0.042604602227364376, 0.019240788102680685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1471.318181818182, 1011, 2519, 1374.0, 2041.0999999999997, 2466.7999999999993, 2519.0, 0.09210454703402425, 0.04767129875784459, 0.04236449380178264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 383.5, 230, 749, 235.5, 749.0, 749.0, 749.0, 0.055068732661953695, 0.0853457800141802, 0.12385087043015564], "isController": false}, {"data": ["addBook", 61, 7, 11.475409836065573, 1205.9672131147543, 596, 2325, 960.0, 2122.0, 2192.8, 2325.0, 0.2983454057252973, 100.61577013006148, 1.0833887254170722], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 208.19298245614033, 113, 772, 118.0, 465.0, 474.79999999999995, 772.0, 0.2459854739104354, 0.18280756410726692, 0.11890899373600149], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 720.8070175438595, 546, 1042, 678.0, 955.4000000000002, 1026.8999999999999, 1042.0, 0.24588254579023197, 72.2976325312314, 0.12366163191598581], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73192f77-1d28-4710-ab86-fa8b7fe61246", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 1.3141396604938271, 2.455471965020576], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 161.2631578947368, 113, 476, 118.0, 348.2, 352.1, 476.0, 0.24672120503830675, 0.4365808823529412, 0.11998746104402026], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1077.5964912280701, 762, 1451, 1034.0, 1373.4, 1386.0999999999997, 1451.0, 0.24563354061356676, 221.02149162179546, 0.12329652331579424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 120.05555555555554, 114, 127, 119.5, 126.1, 127.0, 127.0, 0.11217259623473985, 0.08380081652302342, 0.039873852567817676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bebc8da8-2bfe-4b7c-88b5-de9c8e65aa71", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 7, 3.910614525139665, 190.41340782122901, 110, 1174, 122.0, 348.0, 464.0, 703.5999999999933, 0.7340247107983646, 1.569505623849242, 0.35366907275046033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 122.39999999999999, 117, 131, 120.0, 130.9, 131.0, 131.0, 0.05526602300171877, 0.04279878539097948, 0.019645344113892217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9a6a359-6478-4fbb-8326-14eded08a9bc", 3, 0, 0.0, 582.3333333333334, 214, 798, 735.0, 798.0, 798.0, 798.0, 0.051013467555434636, 0.03279674427798939, 0.03271371454564005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 132.38888888888889, 113, 340, 120.0, 154.6000000000003, 340.0, 340.0, 0.10533954446499216, 0.08548550922891453, 0.03744491619654018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc82016b-4e70-4626-9ed3-895716b0eed6", 3, 0, 0.0, 290.6666666666667, 207, 452, 213.0, 452.0, 452.0, 452.0, 0.038671255655671144, 0.03165957290820733, 0.024798949753148485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8dfbdc1f-7f20-43eb-90c5-36352f72fb9d", 1, 0, 0.0, 1138.0, 1138, 1138, 1138.0, 1138.0, 1138.0, 1138.0, 0.8787346221441125, 0.15875576669595784, 0.6058463312829526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 280.3, 230, 463, 236.5, 462.4, 463.0, 463.0, 0.05243151133831433, 0.08125860204482895, 0.11791969786341591], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14998af3-0862-4f3a-b50e-b0a75efc51d8", 3, 0, 0.0, 301.3333333333333, 223, 447, 234.0, 447.0, 447.0, 447.0, 0.0880410858400587, 0.03983629860601614, 0.056458639031548054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 489.5625, 228, 1352, 461.0, 898.4000000000004, 1352.0, 1352.0, 0.09803080618084234, 7.472365891176615, 0.21890594939772323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8de7682c-9b4a-4f25-8135-14cdfafea723", 2, 0, 0.0, 235.5, 228, 243, 235.5, 243.0, 243.0, 243.0, 0.06535093451836362, 0.04017423171807607, 0.040620966622010195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cbfb1b4f-6f26-44e4-a1e3-9266d7dca61d", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 0.7140872035573123, 2.7251111660079053], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 134.87499999999997, 117, 346, 119.5, 199.70000000000016, 346.0, 346.0, 0.08766450792815893, 0.07268278049903021, 0.031161993052587746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0431660-7eb9-4b8a-b06b-9cfad3514900", 1, 0, 0.0, 688.0, 688, 688, 688.0, 688.0, 688.0, 688.0, 1.4534883720930232, 0.26259311409883723, 1.0021121002906979], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 134.0, 114, 347, 122.0, 139.0, 347.0, 347.0, 0.08621432882145012, 0.06693397598930942, 0.030646499698249847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5019aba8-9249-4b30-865b-2f9e2dc37005", 3, 0, 0.0, 785.0, 218, 1818, 319.0, 1818.0, 1818.0, 1818.0, 0.03460008073352171, 0.02884466365838187, 0.0221882028141399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 116.88888888888889, 111, 131, 116.0, 124.70000000000002, 131.0, 131.0, 0.11677013798337972, 0.08677937012241403, 0.05861313566743865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 153.1111111111111, 113, 348, 114.5, 348.0, 348.0, 348.0, 0.11677013798337972, 0.04098864978040727, 0.06605064337102413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 210.44444444444443, 109, 1378, 115.0, 447.40000000000146, 1378.0, 1378.0, 0.11676786548341896, 5.866831368146375, 0.06808924795007526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 184.66666666666666, 113, 659, 115.5, 397.1000000000004, 659.0, 659.0, 0.11677013798337972, 1.9371856734393347, 0.0682046064197627], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 27.77777777777778, 0.373134328358209], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.11111111111111, 0.14925373134328357], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07462686567164178], "isController": false}, {"data": ["401/Unauthorized", 10, 55.55555555555556, 0.746268656716418], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1340, 18, "401/Unauthorized", 10, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
