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

    var data = {"OkPercent": 98.01071155317521, "KoPercent": 1.9892884468247896};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8142292490118577, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.38596491228070173, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/98855a34-8ecb-4174-8348-1a06a77a2a0f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b6029640-99d9-4471-854c-a00f2a551ce7"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d4e34630-80aa-45c5-8f57-78160127c0d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2ca41390-53f4-49d2-8e41-62a5018ced64"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5b266bad-d161-4a35-8200-2bf76e6a0cab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65d9c77e-54ad-463d-a30f-107fd491e569"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b4061f62-3464-4fc4-9f1b-81d2209fd410"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/33b9fa06-778e-44bf-8b57-c8a8a98e7770"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.05, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dcdfc35f-bc9e-4c37-ae9e-4d54b752dec9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98c24350-6b02-4223-bec3-bc621953c783"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/c09fb0ca-c44c-4538-b362-4acafa803f7c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=206f809a-f436-4d98-9759-bd3f07c38d62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98855a34-8ecb-4174-8348-1a06a77a2a0f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b266bad-d161-4a35-8200-2bf76e6a0cab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b4061f62-3464-4fc4-9f1b-81d2209fd410"], "isController": false}, {"data": [0.3559322033898305, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/65d9c77e-54ad-463d-a30f-107fd491e569"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cd5574ac-93f8-41ca-a439-ab1038bc3220"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8245614035087719, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/85ca3002-58fc-4643-b4da-9e6eb6e94159"], "isController": false}, {"data": [0.9142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/206f809a-f436-4d98-9759-bd3f07c38d62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd5574ac-93f8-41ca-a439-ab1038bc3220"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ca41390-53f4-49d2-8e41-62a5018ced64"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dcdfc35f-bc9e-4c37-ae9e-4d54b752dec9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e1bb1c0b-9fca-44f8-bacf-8f3b4c97397f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/98c24350-6b02-4223-bec3-bc621953c783"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/66387781-3f6a-4b99-9c17-ca98ad4b9f56"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33b9fa06-778e-44bf-8b57-c8a8a98e7770"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6029640-99d9-4471-854c-a00f2a551ce7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1307, 26, 1.9892884468247896, 300.2402448355007, 77, 2792, 91.0, 858.6000000000001, 1053.1999999999998, 1577.0800000000072, 5.1908748629799675, 716.0697278998106, 3.796790665659205], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1347.7719298245618, 987, 2128, 1300.0, 1704.0, 1779.3, 2128.0, 0.25173787462570557, 302.9256583483677, 1.2377931628324486], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/98855a34-8ecb-4174-8348-1a06a77a2a0f", 3, 0, 0.0, 501.3333333333333, 205, 906, 393.0, 906.0, 906.0, 906.0, 0.03463723271602087, 0.028875635737542142, 0.022212027490417032], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6029640-99d9-4471-854c-a00f2a551ce7", 3, 0, 0.0, 336.66666666666663, 173, 638, 199.0, 638.0, 638.0, 638.0, 0.03456738912509938, 0.028817410009563643, 0.02216723846889511], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 455.2307692307692, 84, 1033, 448.0, 870.1999999999998, 1033.0, 1033.0, 0.07302345176239293, 0.014476328816177502, 0.049095544867293915], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 455.2307692307692, 84, 1033, 448.0, 870.1999999999998, 1033.0, 1033.0, 0.07319242852477845, 0.014509827139189477, 0.049209152290923014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4e34630-80aa-45c5-8f57-78160127c0d0", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 1.400596217105263, 2.617016173245614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 106.36842105263158, 79, 244, 82.0, 243.0, 244.0, 244.0, 0.09528107918359159, 0.02549513251592197, 0.054339990471892086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 101.52631578947368, 80, 248, 83.0, 245.0, 248.0, 248.0, 0.09527773459634835, 0.07080698830841904, 0.04782495662355767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 105.5263157894737, 78, 240, 81.0, 240.0, 240.0, 240.0, 0.09528155700093778, 0.02568135716040901, 0.056108182491763164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 131.36842105263156, 79, 244, 83.0, 241.0, 244.0, 244.0, 0.09528012356327603, 0.025680970804164243, 0.05601429139169157], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 222.69230769230768, 81, 518, 179.0, 447.99999999999994, 518.0, 518.0, 0.07343927419400396, 0.1508561412886898, 0.0474663097329635], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2ca41390-53f4-49d2-8e41-62a5018ced64", 3, 0, 0.0, 336.33333333333337, 176, 650, 183.0, 650.0, 650.0, 650.0, 0.024053687831239328, 0.02412415761980741, 0.015425053719902822], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b266bad-d161-4a35-8200-2bf76e6a0cab", 3, 0, 0.0, 1069.3333333333333, 179, 2212, 817.0, 2212.0, 2212.0, 2212.0, 0.018262394078114346, 0.025176184544535893, 0.011711235785769943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 91.50000000000001, 79, 242, 83.0, 100.70000000000022, 242.0, 242.0, 0.09556321241047586, 0.07101914516051964, 0.04796825310447714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 89.55555555555556, 79, 239, 81.0, 98.60000000000022, 239.0, 239.0, 0.09556524185969961, 0.03354530787935419, 0.05405616382537044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 553.25, 463, 650, 550.0, 650.0, 650.0, 650.0, 0.028880240861208783, 8.491749727442727, 0.016470762366158135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 915.25, 818, 1107, 868.0, 1107.0, 1107.0, 1107.0, 0.028806406544815567, 25.92005524528655, 0.016400522476198706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 159.75, 80, 243, 158.0, 243.0, 243.0, 243.0, 0.028926187600789684, 0.051185792902959874, 0.016016746454734134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 104.64285714285715, 78, 239, 82.5, 238.5, 239.0, 239.0, 0.06908769696162179, 0.05134349354276775, 0.03467878538893906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 124.92857142857142, 77, 243, 81.0, 243.0, 243.0, 243.0, 0.06903863698005276, 0.018473229035678183, 0.039373597652686346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 137.5, 79, 246, 82.0, 244.5, 246.0, 246.0, 0.0690355730445674, 0.018607244297168556, 0.04058536618440388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 138.8571428571429, 78, 245, 82.0, 245.0, 245.0, 245.0, 0.06909076552568202, 0.018622120395593984, 0.040685284777330334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 123.0, 82, 243, 83.5, 243.0, 243.0, 243.0, 0.028925978421220095, 0.021496747635301267, 0.016242614836134334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 515.263157894737, 78, 1017, 733.0, 998.0, 1017.0, 1017.0, 0.09183624148098023, 43.50352051512881, 0.049835888032287695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 157.66666666666669, 79, 974, 81.5, 320.60000000000105, 974.0, 974.0, 0.09556422712431313, 4.8014854347508695, 0.05572506039128242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 326.47368421052624, 77, 731, 460.0, 656.0, 731.0, 731.0, 0.09183757316796125, 14.223986101108334, 0.04992629581607351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 149.11111111111114, 79, 490, 83.0, 272.20000000000033, 490.0, 490.0, 0.09556422712431313, 1.5853852266995834, 0.05581838483183351], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 392.30769230769226, 85, 853, 365.0, 740.1999999999999, 853.0, 853.0, 0.07303370786516854, 0.014478362008426966, 0.04955231741573034], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65d9c77e-54ad-463d-a30f-107fd491e569", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 0.5221504696531792, 1.9926390895953758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4061f62-3464-4fc4-9f1b-81d2209fd410", 3, 0, 0.0, 321.0, 219, 401, 343.0, 401.0, 401.0, 401.0, 0.06708707902857909, 0.030355156201082336, 0.043021336486426046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 279.00000000000006, 161, 486, 319.5, 484.0, 486.0, 486.0, 0.06900562888772785, 0.10694524711408601, 0.15519527668792696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33b9fa06-778e-44bf-8b57-c8a8a98e7770", 3, 0, 0.0, 603.0, 386, 905, 518.0, 905.0, 905.0, 905.0, 0.08413731209333632, 0.03806994264639892, 0.05395524245568768], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 580.6, 170, 1113, 572.0, 1080.6000000000001, 1111.85, 1113.0, 0.08963866653519663, 0.05506125122132683, 0.040529983013472694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 83.00000000000001, 79, 93, 83.0, 89.0, 93.0, 93.0, 0.0918309151192352, 0.0682454359431035, 0.04609481481570986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 170.10526315789474, 80, 328, 232.0, 257.0, 328.0, 328.0, 0.09183624148098023, 0.0971700692396926, 0.04831598313113249], "isController": false}, {"data": ["login", 20, 0, 0.0, 2719.4500000000003, 1345, 3877, 2538.5, 3810.6000000000004, 3874.2, 3877.0, 0.08655947718075784, 20.83112989872541, 0.1593066315379455], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dcdfc35f-bc9e-4c37-ae9e-4d54b752dec9", 3, 0, 0.0, 370.6666666666667, 242, 452, 418.0, 452.0, 452.0, 452.0, 0.03491335668648969, 0.03501564191115714, 0.02238909917720856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 86.16666666666669, 82, 96, 86.0, 89.70000000000002, 96.0, 96.0, 0.09984357839384964, 0.08083039696142709, 0.03549127200718873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98c24350-6b02-4223-bec3-bc621953c783", 1, 0, 0.0, 853.0, 853, 853, 853.0, 853.0, 853.0, 853.0, 1.1723329425556857, 0.21179843200468934, 0.8082686107854631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 609.1052631578947, 163, 1098, 824.0, 1083.0, 1098.0, 1098.0, 0.09179409135927726, 57.866148777387245, 0.19408581086793728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c09fb0ca-c44c-4538-b362-4acafa803f7c", 1, 0, 0.0, 1882.0, 1882, 1882, 1882.0, 1882.0, 1882.0, 1882.0, 0.5313496280552603, 0.16967903161530287, 0.317045530021254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=206f809a-f436-4d98-9759-bd3f07c38d62", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 243.0, 163, 491, 170.0, 486.0, 491.0, 491.0, 0.09523857262442419, 0.1476011862841418, 0.21419378198637587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, 50.0, 560.875, 81, 1190, 493.5, 1190.0, 1190.0, 1190.0, 0.05751175396471654, 34.40972047490331, 0.08389470945780794], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 891.6521739130435, 104, 1641, 906.0, 1196.4, 1553.9999999999986, 1641.0, 0.09262540674635136, 0.02903982691130513, 0.041789978434388995], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 85.8888888888889, 80, 111, 84.0, 92.10000000000002, 111.0, 111.0, 0.08799374266718811, 0.06831545451212358, 0.031279025713727024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 286.11111111111114, 163, 1054, 168.0, 547.3000000000008, 1054.0, 1054.0, 0.09552112078115049, 6.488507407861919, 0.21347146306516662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 317.31250000000006, 162, 1015, 321.0, 536.9000000000005, 1015.0, 1015.0, 0.15103601264926605, 11.512670284254495, 0.3372682836173125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 105.0, 78, 234, 84.0, 234.0, 234.0, 234.0, 0.039774987215182675, 0.029559341084720723, 0.019965179129495993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 103.42857142857143, 78, 237, 82.0, 237.0, 237.0, 237.0, 0.03977543923449326, 0.010643037451417143, 0.022684430188421936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 103.85714285714286, 80, 235, 83.0, 235.0, 235.0, 235.0, 0.03977521322355375, 0.01072066293916097, 0.023383474961503274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98855a34-8ecb-4174-8348-1a06a77a2a0f", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b266bad-d161-4a35-8200-2bf76e6a0cab", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 81.28571428571428, 79, 84, 81.0, 84.0, 84.0, 84.0, 0.039774987215182675, 0.010720602022842207, 0.02342218485425308], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 86.0, 85, 87, 86.0, 87.0, 87.0, 87.0, 0.3813155386081983, 0.11245829361296472, 0.23571556244041944], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 934.3157894736843, 625, 1761, 869.0, 1366.2, 1447.2, 1761.0, 0.25271558412768785, 302.3356967690091, 0.49901456162713365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 891.6521739130435, 104, 1641, 906.0, 1196.4, 1553.9999999999986, 1641.0, 0.09404106732522673, 0.029483663431108784, 0.042428684672123775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 81.2, 79, 83, 81.0, 83.0, 83.0, 83.0, 0.02517851567614386, 0.00678639680333565, 0.014826801711635496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 81.8, 81, 83, 82.0, 83.0, 83.0, 83.0, 0.02517826209563711, 0.00678632845546469, 0.01480206423981791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 208.83333333333337, 79, 1131, 82.0, 888.0000000000003, 1131.0, 1131.0, 0.08426532341499267, 8.444864803895868, 0.04873417684482541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 143.61111111111111, 79, 632, 82.0, 498.8000000000002, 632.0, 632.0, 0.08452212131741814, 2.7816178766634425, 0.04896523499497563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 82.22222222222224, 80, 86, 82.0, 84.2, 86.0, 86.0, 0.08467998024133795, 0.06293111812857244, 0.042505380707077836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 82.4, 81, 83, 83.0, 83.0, 83.0, 83.0, 0.02517826209563711, 0.0067371521623091485, 0.01435947760141804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 117.0, 79, 251, 82.0, 242.9, 251.0, 251.0, 0.08461429981666903, 0.03676168147416914, 0.04746700629906454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 83.2, 82, 84, 83.0, 84.0, 84.0, 84.0, 0.025178008520238084, 0.018711391097559746, 0.01263818005801013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 150.8, 83, 252, 87.0, 252.0, 252.0, 252.0, 0.025817644811169747, 0.02032131027129181, 0.009177365928970496], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 624.5384615384617, 83, 1599, 587.0, 1400.6, 1599.0, 1599.0, 0.07055248019103441, 0.01368968271735591, 0.048011937954520786], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1486.4, 960, 2792, 1246.5, 2497.300000000001, 2779.25, 2792.0, 0.08823594291134494, 0.045668993889660954, 0.040585087022698696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 166.6, 164, 169, 167.0, 169.0, 169.0, 169.0, 0.02516736296370866, 0.03900449709316958, 0.05660198916545025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b4061f62-3464-4fc4-9f1b-81d2209fd410", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 0.8562277843601896, 3.267550355450237], "isController": false}, {"data": ["addBook", 59, 11, 18.64406779661017, 909.8305084745763, 417, 2401, 687.0, 1533.0, 1790.0, 2401.0, 0.2982418893370942, 85.77556397414901, 1.0860337019653636], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/65d9c77e-54ad-463d-a30f-107fd491e569", 3, 0, 0.0, 338.3333333333333, 266, 407, 342.0, 407.0, 407.0, 407.0, 0.023899621589324835, 0.028668654152559248, 0.015326254730133439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd5574ac-93f8-41ca-a439-ab1038bc3220", 3, 0, 0.0, 598.6666666666666, 176, 1033, 587.0, 1033.0, 1033.0, 1033.0, 0.040231195268811436, 0.02586478211455162, 0.025799301653502124], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 160.42105263157893, 80, 580, 85.0, 323.2, 330.29999999999995, 580.0, 0.25333333333333335, 0.18826822916666666, 0.1224609375], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 516.0175438596493, 384, 737, 478.0, 660.8000000000002, 729.6999999999999, 737.0, 0.25357112670103965, 74.5583306039219, 0.12752844751077677], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 123.00000000000004, 79, 330, 84.0, 246.0, 254.1, 330.0, 0.25393374556729686, 0.4493436982108809, 0.12349512235597057], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 771.6315789473683, 540, 1147, 720.0, 1035.2, 1116.8, 1147.0, 0.2534054130952804, 228.01463614233603, 0.12719763899509193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 106.0625, 82, 248, 86.0, 242.4, 248.0, 248.0, 0.15484969901089754, 0.11568361303060218, 0.055044228945279994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85ca3002-58fc-4643-b4da-9e6eb6e94159", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 1.9008091517857142, 3.5516648065476186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 11, 6.285714285714286, 159.14857142857142, 79, 1905, 87.0, 246.20000000000002, 310.39999999999986, 1661.800000000003, 0.7492272256329899, 1.5775915769734645, 0.3597252302803394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 87.71428571428571, 81, 103, 85.0, 103.0, 103.0, 103.0, 0.04028359651949726, 0.031196183632774734, 0.014319559700290042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 94.26315789473684, 83, 243, 86.0, 96.0, 243.0, 243.0, 0.09235854559595566, 0.07495112440453043, 0.032830576754812366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/206f809a-f436-4d98-9759-bd3f07c38d62", 3, 0, 0.0, 662.6666666666667, 174, 1599, 215.0, 1599.0, 1599.0, 1599.0, 0.017112933955483554, 0.023591560970531528, 0.010974114548275586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 210.57142857142858, 162, 472, 167.0, 472.0, 472.0, 472.0, 0.039756237469685866, 0.0616144031878823, 0.08941270985613921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 310.61111111111103, 163, 1211, 167.5, 970.7000000000004, 1211.0, 1211.0, 0.08423180592991915, 11.312762931921982, 0.18704469491707848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd5574ac-93f8-41ca-a439-ab1038bc3220", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ca41390-53f4-49d2-8e41-62a5018ced64", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.5089128521126761, 1.9421214788732395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dcdfc35f-bc9e-4c37-ae9e-4d54b752dec9", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1bb1c0b-9fca-44f8-bacf-8f3b4c97397f", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.2329572876447876, 2.303782577220077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98c24350-6b02-4223-bec3-bc621953c783", 3, 0, 0.0, 486.6666666666667, 177, 1103, 180.0, 1103.0, 1103.0, 1103.0, 0.01714912882425573, 0.02364145851911556, 0.01099732545045045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 88.5, 84, 116, 86.0, 105.0, 116.0, 116.0, 0.06775297266167553, 0.05617409549781496, 0.024084064500829973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66387781-3f6a-4b99-9c17-ca98ad4b9f56", 1, 0, 0.0, 165.0, 165, 165, 165.0, 165.0, 165.0, 165.0, 6.0606060606060606, 1.9353693181818181, 3.6162405303030303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33b9fa06-778e-44bf-8b57-c8a8a98e7770", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 0.7854959239130435, 2.9976222826086953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 104.36842105263159, 83, 247, 87.0, 238.0, 247.0, 247.0, 0.09000303168106716, 0.0698754005727035, 0.031993265167879335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6029640-99d9-4471-854c-a00f2a551ce7", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.4949700342465754, 1.8889126712328768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 82.00000000000001, 80, 87, 82.0, 84.9, 87.0, 87.0, 0.15138326458010065, 0.11250260189985997, 0.07598730272868334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 140.00000000000003, 79, 244, 81.0, 243.3, 244.0, 244.0, 0.1511572980632971, 0.05463583490788852, 0.08541346835144072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 174.5625, 79, 933, 82.5, 453.50000000000045, 933.0, 933.0, 0.15116158228386256, 8.539162437882037, 0.08805457405500393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 164.75, 78, 481, 82.0, 317.20000000000016, 481.0, 481.0, 0.1513904264479075, 2.8203674233822515, 0.08833572246350072], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 26.923076923076923, 0.5355776587605203], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.6923076923076925, 0.1530221882172915], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.6923076923076925, 0.1530221882172915], "isController": false}, {"data": ["401/Unauthorized", 15, 57.69230769230769, 1.1476664116296864], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1307, 26, "401/Unauthorized", 15, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
