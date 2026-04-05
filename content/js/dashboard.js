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

    var data = {"OkPercent": 96.42074506939372, "KoPercent": 3.579254930606282};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7871473354231975, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95f85d8f-3441-43ce-aa9e-649bbd3a8194"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/898ab0bf-bcd1-4316-af9e-9864f7d85981"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a5ab3ed-6066-43f7-99b2-1bb4946837a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e70987a-6b94-497c-aca3-71494c19fc54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a5ab3ed-6066-43f7-99b2-1bb4946837a7"], "isController": false}, {"data": [0.4732142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95f85d8f-3441-43ce-aa9e-649bbd3a8194"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a434582-8477-4b63-ad19-0b0af307fc1f"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c4b1952-b55a-44d6-81bc-6df45d46a138"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=898ab0bf-bcd1-4316-af9e-9864f7d85981"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ca482c30-a230-4a22-bf2d-2b362d2b6a35"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.7321428571428571, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8873626373626373, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5aa814f-e36a-418f-a9fc-244b0c1c38ad"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a5aa814f-e36a-418f-a9fc-244b0c1c38ad"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8931bd73-4af9-4ab1-82c6-f71e20babe74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c4b1952-b55a-44d6-81bc-6df45d46a138"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a4ea57dc-e96a-4b2c-947b-60c16001b86a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8931bd73-4af9-4ab1-82c6-f71e20babe74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a434582-8477-4b63-ad19-0b0af307fc1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11e61236-ec53-4e93-8072-ed7cf959c2e2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e70987a-6b94-497c-aca3-71494c19fc54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f64220c3-8a92-431d-861e-6689feff7f3c"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/11e61236-ec53-4e93-8072-ed7cf959c2e2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98519c3b-5f58-43e8-bb64-1ed74aa398c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/98519c3b-5f58-43e8-bb64-1ed74aa398c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.1875, 500, 1500, "register"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1369, 49, 3.579254930606282, 295.2081811541274, 80, 2091, 94.0, 849.0, 1010.0, 1365.899999999999, 5.319541641247625, 728.6018127035143, 3.904534821820612], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/95f85d8f-3441-43ce-aa9e-649bbd3a8194", 3, 0, 0.0, 265.0, 192, 344, 259.0, 344.0, 344.0, 344.0, 0.03467526613266757, 0.02890734263208387, 0.022236417409295283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/898ab0bf-bcd1-4316-af9e-9864f7d85981", 3, 0, 0.0, 272.6666666666667, 174, 457, 187.0, 457.0, 457.0, 457.0, 0.02564036819568729, 0.025565249929488987, 0.016442553823406238], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1418.1964285714282, 1015, 2134, 1426.5, 1730.9, 1888.2499999999998, 2134.0, 0.2387744050893059, 287.32645134731655, 1.1740518843990773], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6a5ab3ed-6066-43f7-99b2-1bb4946837a7", 3, 0, 0.0, 278.0, 178, 456, 200.0, 456.0, 456.0, 456.0, 0.02483690432824453, 0.02935638008328642, 0.015927311694870352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 221.2, 170, 353, 177.5, 350.1, 352.9, 353.0, 0.10407343421518224, 0.16129349619091232, 0.23406359277105926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 89.18750000000001, 86, 94, 87.5, 93.3, 94.0, 94.0, 0.09654431685844793, 0.07495383974850205, 0.03431848763327641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 280.13333333333327, 170, 1082, 177.0, 638.6000000000003, 1082.0, 1082.0, 0.09607009273966285, 7.801179240373777, 0.21442519462199622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 87.23076923076923, 84, 103, 86.0, 97.39999999999999, 103.0, 103.0, 0.07825385550726557, 0.058155453165067476, 0.03927976731517041], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e70987a-6b94-497c-aca3-71494c19fc54", 3, 0, 0.0, 300.3333333333333, 192, 435, 274.0, 435.0, 435.0, 435.0, 0.0431028289823422, 0.02771096589847847, 0.02764081155443169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 110.69230769230768, 82, 254, 85.0, 254.0, 254.0, 254.0, 0.07817479885022911, 0.02091786609859646, 0.04458406496927129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 111.0, 80, 262, 85.0, 257.6, 262.0, 262.0, 0.07825668191668674, 0.02109262129785697, 0.04600636964242716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 110.6923076923077, 83, 256, 84.0, 254.8, 256.0, 256.0, 0.07825526868645521, 0.021092240388146135, 0.04608195997844971], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 122.8, 86, 256, 90.0, 256.0, 256.0, 256.0, 0.040758765172450334, 0.01202065144734375, 0.02519560386148541], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a5ab3ed-6066-43f7-99b2-1bb4946837a7", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 984.142857142857, 666, 1705, 929.0, 1346.4, 1528.05, 1705.0, 0.23364193538966052, 279.51698180513426, 0.4613515560135679], "isController": false}, {"data": ["deleteBook", 15, 5, 33.333333333333336, 380.26666666666665, 84, 942, 424.0, 797.4000000000001, 942.0, 942.0, 0.09588830929733047, 0.020975567658791043, 0.06364461675040912], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 5, 33.333333333333336, 380.26666666666665, 84, 942, 424.0, 797.4000000000001, 942.0, 942.0, 0.09581725732682628, 0.020960025040243246, 0.06359745693014283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 11, 45.833333333333336, 813.0833333333334, 118, 1588, 858.5, 1543.0, 1583.75, 1588.0, 0.09729637692616422, 0.029977545820512506, 0.04389738880848424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95f85d8f-3441-43ce-aa9e-649bbd3a8194", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 96.74999999999999, 82, 252, 85.5, 147.7000000000001, 252.0, 252.0, 0.07160118141949343, 0.025880261008681644, 0.04045921249888123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 85.83333333333333, 82, 91, 85.5, 91.0, 91.0, 91.0, 0.0333425951653237, 0.008986871353153654, 0.019634360238955265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 90.5625, 82, 141, 87.0, 108.10000000000004, 141.0, 141.0, 0.07159829775047098, 0.05320928182432463, 0.035938989300529384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 140.83333333333331, 84, 254, 87.5, 254.0, 254.0, 254.0, 0.03331371525657113, 0.008979087315247688, 0.019584820883257636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 153.62500000000003, 83, 666, 86.5, 376.9000000000003, 666.0, 666.0, 0.07160150184150113, 1.3339188480884636, 0.04177919663114934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 152.0625, 84, 963, 86.0, 473.7000000000005, 963.0, 963.0, 0.07160118141949343, 4.044771890103374, 0.04170908663742952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 118.3125, 82, 265, 86.5, 254.5, 265.0, 265.0, 0.09338866611800825, 0.02517116391461941, 0.054902321292032194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 117.81250000000001, 83, 255, 86.5, 253.6, 255.0, 255.0, 0.09338703087608707, 0.025170723165820346, 0.05499255822097706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 140.33333333333334, 84, 252, 85.0, 252.0, 252.0, 252.0, 0.03331297540391983, 0.008913823496751985, 0.018998806285048023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 107.75000000000001, 84, 252, 86.5, 249.9, 252.0, 252.0, 0.09338539569143131, 0.0694006700402141, 0.04687509119667548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 113.33333333333333, 84, 252, 86.0, 252.0, 252.0, 252.0, 0.03334352163160966, 0.024779706993803663, 0.016736884881491568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 105.81250000000001, 83, 251, 85.0, 246.8, 251.0, 251.0, 0.09338812103100486, 0.024988618322749345, 0.05326041277549495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 88.0, 87, 89, 88.0, 89.0, 89.0, 89.0, 0.03369423603935487, 0.026521049070039084, 0.011977247967114425], "isController": false}, {"data": ["deleteAccount", 15, 5, 33.333333333333336, 308.8666666666667, 85, 457, 415.0, 456.4, 457.0, 457.0, 0.09544656265112372, 0.020008979930769426, 0.06493597524116164], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a434582-8477-4b63-ad19-0b0af307fc1f", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.49361765710382516, 1.8837517076502732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1255.782608695652, 842, 2091, 1201.0, 1936.8000000000004, 2085.2, 2091.0, 0.09304545877479359, 0.048158294092422456, 0.042797276448171655], "isController": false}, {"data": ["goToProfile", 15, 5, 33.333333333333336, 175.39999999999998, 84, 352, 178.0, 296.20000000000005, 352.0, 352.0, 0.09648784253184099, 0.16390369709249966, 0.06234647377138813], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 255.66666666666666, 172, 503, 173.0, 503.0, 503.0, 503.0, 0.03329707651668184, 0.05160396526559968, 0.07488590548624831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 87.09999999999997, 84, 95, 86.0, 90.0, 94.75, 95.0, 0.10412599245086554, 0.07738269556162958, 0.05226636730443837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 93.15, 83, 249, 84.5, 91.60000000000001, 241.1499999999999, 249.0, 0.10412328196584757, 0.0278611125572678, 0.05938280924614744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 637.2, 494, 763, 663.0, 761.2, 763.0, 763.0, 0.0586396767781016, 17.242011993279895, 0.03344294066251107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 851.7, 590, 1037, 869.5, 1034.5, 1037.0, 1037.0, 0.058540469026237836, 52.674816932977016, 0.03332919281474283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c4b1952-b55a-44d6-81bc-6df45d46a138", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["addBook", 63, 18, 28.571428571428573, 831.5714285714284, 435, 1950, 722.0, 1527.2, 1711.3999999999996, 1950.0, 0.28577908822862325, 66.24501640819913, 1.0426427123497393], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 151.7, 84, 255, 85.0, 254.9, 255.0, 255.0, 0.05879413234559191, 0.10403805450216068, 0.03255495414057677], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=898ab0bf-bcd1-4316-af9e-9864f7d85981", 1, 0, 0.0, 1142.0, 1142, 1142, 1142.0, 1142.0, 1142.0, 1142.0, 0.8756567425569177, 0.1581997044658494, 0.6037242775831875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca482c30-a230-4a22-bf2d-2b362d2b6a35", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 1.2005110432330826, 2.2431567199248117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 120.13333333333333, 84, 259, 87.0, 256.0, 259.0, 259.0, 0.10010611247922797, 0.07439526523114501, 0.05024857599054998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 106.73333333333332, 82, 250, 85.0, 248.8, 250.0, 250.0, 0.10010878487956913, 0.03681083444009157, 0.05653278646128794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 224.39999999999998, 84, 910, 242.0, 578.2000000000002, 910.0, 910.0, 0.09999733340444254, 6.023674004109891, 0.058214593444174824], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 158.83928571428572, 85, 469, 88.0, 342.6, 352.2, 469.0, 0.23437336514114718, 0.17417786218009082, 0.1132957185008475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 178.33333333333334, 84, 650, 86.0, 413.60000000000014, 650.0, 650.0, 0.0999980000399992, 1.9853378974087186, 0.05831263583061673], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 537.2142857142859, 411, 743, 502.0, 678.2, 700.05, 743.0, 0.23408435396898383, 68.82857239894662, 0.11772797099026043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 86.1, 84, 91, 86.0, 90.6, 91.0, 91.0, 0.05879378667262444, 0.04369342935338593, 0.03301408919605376], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 124.5, 83, 342, 88.0, 255.3, 259.5, 342.0, 0.2345038986273147, 0.41496197686786546, 0.11404584132461203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 116.69999999999999, 84, 266, 87.5, 262.6, 265.9, 266.0, 0.10412111367943191, 0.028063893921409382, 0.06121182659669728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 526.9444444444445, 82, 1081, 447.5, 1045.0, 1081.0, 1081.0, 0.08615614365101018, 38.77333563830933, 0.04694836734107781], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 823.0357142857143, 579, 1328, 831.0, 1004.9, 1180.35, 1328.0, 0.23401001228552565, 210.5626204002407, 0.11746205694800799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 103.25, 84, 255, 86.0, 236.20000000000033, 254.85, 255.0, 0.1041221978113514, 0.028064186128840807, 0.06131414578148916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 403.99999999999994, 83, 741, 458.5, 737.4, 741.0, 741.0, 0.08615614365101018, 12.677994329848795, 0.047032504200112], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 92.46666666666667, 88, 112, 91.0, 103.60000000000001, 112.0, 112.0, 0.093658097991346, 0.06996918453455046, 0.03329252702036127], "isController": false}, {"data": ["deleteBooks", 15, 5, 33.333333333333336, 403.4000000000001, 86, 1142, 383.0, 968.0000000000001, 1142.0, 1142.0, 0.09539557364538286, 0.0208677817349275, 0.06350388935703383], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 18, 9.89010989010989, 143.4560439560439, 85, 782, 92.0, 253.40000000000003, 349.6999999999999, 634.2599999999977, 0.7458832979516897, 1.5540569442964518, 0.3596623264386941], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 89.46153846153847, 86, 94, 88.0, 94.0, 94.0, 94.0, 0.07399817850637523, 0.05730523003472222, 0.026304040015938068], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5aa814f-e36a-418f-a9fc-244b0c1c38ad", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5aa814f-e36a-418f-a9fc-244b0c1c38ad", 3, 0, 0.0, 569.3333333333334, 252, 1032, 424.0, 1032.0, 1032.0, 1032.0, 0.02386596871967033, 0.028208767064167636, 0.015304673951090675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 367.6666666666667, 171, 995, 337.0, 707.0000000000002, 995.0, 995.0, 0.09993803841618197, 8.115268012998609, 0.22305831842590929], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 102.125, 86, 256, 92.0, 145.40000000000012, 256.0, 256.0, 0.0699912510936133, 0.0567995406824147, 0.024879702537182854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 509.7391304347826, 119, 1008, 466.0, 971.2, 1001.5999999999999, 1008.0, 0.09261459042204066, 0.05688923571822615, 0.04187554234902815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 96.33333333333334, 83, 262, 86.0, 109.90000000000023, 262.0, 262.0, 0.0861536694283704, 0.0640263109716698, 0.04324510359978749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 129.55555555555557, 83, 338, 86.0, 275.9000000000001, 338.0, 338.0, 0.08615490652192642, 0.08775348388903248, 0.04551738713707246], "isController": false}, {"data": ["login", 23, 0, 0.0, 2382.9565217391296, 1602, 3723, 2231.0, 3306.8, 3643.999999999999, 3723.0, 0.09354574997254636, 48.78069279270669, 0.20858335002582676], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8931bd73-4af9-4ab1-82c6-f71e20babe74", 1, 0, 0.0, 852.0, 852, 852, 852.0, 852.0, 852.0, 852.0, 1.1737089201877935, 0.21204702171361503, 0.8092172828638498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 225.8461538461538, 170, 350, 173.0, 346.8, 350.0, 350.0, 0.07813392154152217, 0.12109231785780829, 0.17572502081066949], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 123.74999999999999, 86, 259, 90.0, 258.9, 259.0, 259.0, 0.10123814248256173, 0.08195939464652703, 0.035986995960598116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c4b1952-b55a-44d6-81bc-6df45d46a138", 3, 0, 0.0, 346.0, 271, 415, 352.0, 415.0, 415.0, 415.0, 0.04488531801247812, 0.028856934594610768, 0.0287838790639915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 248.625, 170, 515, 177.0, 508.7, 515.0, 515.0, 0.09333854473541439, 0.14465651415537367, 0.2099205747320892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4ea57dc-e96a-4b2c-947b-60c16001b86a", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 1.6460615335051545, 3.0756684922680413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8931bd73-4af9-4ab1-82c6-f71e20babe74", 3, 0, 0.0, 493.0, 192, 849, 438.0, 849.0, 849.0, 849.0, 0.01684125433662299, 0.023217028683463013, 0.010799892917691177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a434582-8477-4b63-ad19-0b0af307fc1f", 3, 0, 0.0, 347.6666666666667, 161, 456, 426.0, 456.0, 456.0, 456.0, 0.01981663011599334, 0.027318824394932228, 0.012707930119956667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 92.13333333333334, 86, 115, 88.0, 113.8, 115.0, 115.0, 0.09867771857114664, 0.08181385065127295, 0.035076845273337286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11e61236-ec53-4e93-8072-ed7cf959c2e2", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 0.5117962110481586, 1.953125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 647.4999999999999, 168, 1169, 700.5, 1134.8, 1169.0, 1169.0, 0.08611863320160372, 51.58064602580449, 0.18266569464246413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e70987a-6b94-497c-aca3-71494c19fc54", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 98.5, 86, 255, 88.0, 114.60000000000022, 255.0, 255.0, 0.08224247824001096, 0.06385036152422727, 0.0292346309368789], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f64220c3-8a92-431d-861e-6689feff7f3c", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 1.2722547310756973, 2.3772099103585655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 285.87499999999994, 171, 1046, 180.0, 589.6000000000005, 1046.0, 1046.0, 0.0715707544004831, 5.455457165183065, 0.15981980105566862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 10, 50.0, 518.0500000000002, 84, 1123, 425.5, 1088.4, 1121.75, 1123.0, 0.11702202354483114, 70.01516806556745, 0.17070473405282374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11e61236-ec53-4e93-8072-ed7cf959c2e2", 3, 0, 0.0, 278.6666666666667, 174, 376, 286.0, 376.0, 376.0, 376.0, 0.04073153843020651, 0.0339562076561715, 0.02612015973551654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98519c3b-5f58-43e8-bb64-1ed74aa398c5", 1, 0, 0.0, 551.0, 551, 551, 551.0, 551.0, 551.0, 551.0, 1.8148820326678765, 0.32788396098003625, 1.2512760889292196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98519c3b-5f58-43e8-bb64-1ed74aa398c5", 3, 0, 0.0, 313.6666666666667, 249, 423, 269.0, 423.0, 423.0, 423.0, 0.0517491202649555, 0.03326969808700752, 0.03318547100324294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 87.46666666666667, 84, 96, 87.0, 91.8, 96.0, 96.0, 0.09612242151604283, 0.0714347292711998, 0.04824894986254494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 85.33333333333334, 84, 88, 85.0, 88.0, 88.0, 88.0, 0.09612426945555214, 0.035345694914385314, 0.05428267664436583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 190.7333333333333, 83, 994, 86.0, 550.6000000000003, 994.0, 994.0, 0.09612426945555214, 5.790367036504794, 0.05595984488747052], "isController": false}, {"data": ["register", 24, 11, 45.833333333333336, 813.0833333333334, 118, 1588, 858.5, 1543.0, 1583.75, 1588.0, 0.097890460574617, 0.030160586241495767, 0.04416542264206353], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 169.26666666666665, 83, 668, 86.0, 420.20000000000016, 668.0, 668.0, 0.09612488545117817, 1.908441947778554, 0.05605407545483092], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 22.448979591836736, 0.8035062089116143], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 10.204081632653061, 0.36523009495982467], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 10.204081632653061, 0.36523009495982467], "isController": false}, {"data": ["401/Unauthorized", 28, 57.142857142857146, 2.0452885317750185], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1369, 49, "401/Unauthorized", 28, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 18, "401/Unauthorized", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
