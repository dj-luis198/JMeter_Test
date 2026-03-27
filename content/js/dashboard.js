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

    var data = {"OkPercent": 98.644578313253, "KoPercent": 1.355421686746988};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7939276485788114, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.15789473684210525, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/88bebc4e-5fd5-40eb-af1b-4cf61e973fe6"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a5be6c7a-89dd-4d59-9735-5387be0676cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87efd41d-df90-424a-a44d-695de73d12ba"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/90d804e5-5ae9-4f35-b049-8c54f732221f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f588c23-2e02-4255-976f-e407b059be94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f8aac486-3a32-4d79-8657-56f4d4bc09d3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/73c12c40-0fff-4dd7-9649-c0bfd5333725"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=350bcdb7-ffb5-433d-b2a6-693da632e397"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a3db4e03-1f24-40cc-80af-d6a5b2899334"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a0945dbf-516a-498f-b09f-3f893e3fcdf4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87efd41d-df90-424a-a44d-695de73d12ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/068601a7-8ab8-4226-b4d9-e668e833c19e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f4e1792-89a3-4db7-88bc-6c2443a4b543"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de9145fe-5876-4072-a55c-c7b2be9640d8"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54cdc3eb-c3c5-4aa2-9191-ce72d649b4d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cb47c495-fd51-41cf-baa0-f610eb6a47ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88bebc4e-5fd5-40eb-af1b-4cf61e973fe6"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3db4e03-1f24-40cc-80af-d6a5b2899334"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f8aac486-3a32-4d79-8657-56f4d4bc09d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5be6c7a-89dd-4d59-9735-5387be0676cb"], "isController": false}, {"data": [0.4824561403508772, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de9145fe-5876-4072-a55c-c7b2be9640d8"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73c12c40-0fff-4dd7-9649-c0bfd5333725"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a21c42ea-ae9e-426f-9ed2-56accfb60fbf"], "isController": false}, {"data": [0.3220338983050847, 500, 1500, "addBook"], "isController": true}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2f588c23-2e02-4255-976f-e407b059be94"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9571428571428572, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/350bcdb7-ffb5-433d-b2a6-693da632e397"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90d804e5-5ae9-4f35-b049-8c54f732221f"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/54cdc3eb-c3c5-4aa2-9191-ce72d649b4d9"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0945dbf-516a-498f-b09f-3f893e3fcdf4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=068601a7-8ab8-4226-b4d9-e668e833c19e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1328, 18, 1.355421686746988, 357.8109939759037, 112, 2654, 130.0, 911.0, 1116.0, 1476.13, 5.236944116916354, 748.8012623394017, 3.827607572027699], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1672.4210526315792, 1366, 2451, 1621.0, 1955.2, 1992.1999999999996, 2451.0, 0.2539348768415847, 305.5684671215591, 1.2485958055638466], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/88bebc4e-5fd5-40eb-af1b-4cf61e973fe6", 3, 0, 0.0, 585.3333333333333, 201, 1113, 442.0, 1113.0, 1113.0, 1113.0, 0.02245206484156326, 0.02653758054678262, 0.014397971268841025], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 544.2666666666665, 127, 1287, 468.0, 1067.4, 1287.0, 1287.0, 0.07488056549803064, 0.014098606472676082, 0.05065650755794508], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 544.2666666666665, 127, 1287, 468.0, 1067.4, 1287.0, 1287.0, 0.07671574769724898, 0.01444413687112266, 0.051898003536595974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 182.0, 112, 357, 115.0, 347.4, 357.0, 357.0, 0.10536754679558695, 0.05612177699268625, 0.05853080063840337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5be6c7a-89dd-4d59-9735-5387be0676cb", 3, 0, 0.0, 450.0, 386, 489, 475.0, 489.0, 489.0, 489.0, 0.02762100301068933, 0.027701923917947208, 0.017712687477557935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 130.23529411764707, 112, 348, 115.0, 180.79999999999984, 348.0, 348.0, 0.10536689372199255, 0.07830488879144172, 0.052889241575297036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 234.8235294117647, 113, 792, 115.0, 616.7999999999998, 792.0, 792.0, 0.10536819987727704, 5.490755780530436, 0.060449920276560536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 354.4117647058823, 112, 1023, 338.0, 1019.0, 1023.0, 1023.0, 0.10536754679558695, 16.754547607149497, 0.06034664760753688], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 228.00000000000003, 115, 442, 211.5, 402.80000000000007, 442.0, 442.0, 0.077998557026695, 0.15554485191242712, 0.05041532708207398], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87efd41d-df90-424a-a44d-695de73d12ba", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 0.8442245911214954, 3.2217435747663554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90d804e5-5ae9-4f35-b049-8c54f732221f", 3, 0, 0.0, 432.66666666666663, 201, 855, 242.0, 855.0, 855.0, 855.0, 0.05771117480714849, 0.037102724688840585, 0.03700879374026124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 115.85714285714285, 113, 119, 115.5, 118.5, 119.0, 119.0, 0.07640169830060793, 0.056778996490979144, 0.038350071217297346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 703.1666666666666, 567, 806, 736.5, 806.0, 806.0, 806.0, 0.027790643816581754, 8.171372018295507, 0.01584935155164428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 115.07142857142858, 113, 121, 114.5, 119.0, 121.0, 121.0, 0.07640211524713356, 0.028640134440436362, 0.043114753930615965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 960.1666666666666, 788, 1146, 1008.0, 1146.0, 1146.0, 1146.0, 0.027746691207073557, 24.966521521605426, 0.01579718845090223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 153.0, 113, 342, 115.5, 342.0, 342.0, 342.0, 0.027862914460852605, 0.04930429785455558, 0.015428000487601002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f588c23-2e02-4255-976f-e407b059be94", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 116.2857142857143, 114, 127, 116.0, 122.0, 127.0, 127.0, 0.07455890419713374, 0.05540949813869022, 0.0374250749583269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 130.7142857142857, 112, 340, 115.0, 229.0, 340.0, 340.0, 0.0745608896179287, 0.027949931696899334, 0.04207572523779598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 227.7142857142857, 112, 1015, 117.0, 680.0, 1015.0, 1015.0, 0.07447125409591897, 4.805021831048662, 0.043323818300778756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f8aac486-3a32-4d79-8657-56f4d4bc09d3", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 0.5699181782334385, 2.1749309936908516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 195.50000000000003, 112, 797, 115.5, 570.5, 797.0, 797.0, 0.07447165023857524, 1.582719967312265, 0.043396774978589396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73c12c40-0fff-4dd7-9649-c0bfd5333725", 3, 0, 0.0, 599.3333333333334, 214, 1007, 577.0, 1007.0, 1007.0, 1007.0, 0.019051247856734614, 0.022517930002540168, 0.012217108814377342], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 117.33333333333333, 115, 126, 116.0, 126.0, 126.0, 126.0, 0.027862267524205345, 0.02070623592375026, 0.0156453162367364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 510.2, 115, 1027, 230.0, 1023.8, 1026.85, 1027.0, 0.1048300442906937, 42.46235639102917, 0.05757462588777944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 203.0, 113, 1117, 116.0, 728.5, 1117.0, 1117.0, 0.07640253219821, 4.929631434525758, 0.04444734364767518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 438.8, 114, 803, 400.5, 797.9, 802.75, 803.0, 0.10483059376048305, 13.886194187536692, 0.05767730129360953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 196.28571428571428, 113, 799, 115.0, 570.5, 799.0, 799.0, 0.07640211524713356, 1.6237474657691235, 0.04452171252612679], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 547.7142857142857, 214, 2654, 412.5, 1592.0, 2654.0, 2654.0, 0.07368343491121146, 0.013913299267902442, 0.05042607281765455], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=350bcdb7-ffb5-433d-b2a6-693da632e397", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 345.42857142857144, 229, 1129, 234.5, 794.0, 1129.0, 1129.0, 0.07442453883366115, 6.466934863577162, 0.16602237387698685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3db4e03-1f24-40cc-80af-d6a5b2899334", 3, 0, 0.0, 349.0, 228, 528, 291.0, 528.0, 528.0, 528.0, 0.02719361856417694, 0.02745032915609137, 0.017438616071428572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 548.6818181818181, 138, 1372, 545.0, 922.0999999999999, 1307.349999999999, 1372.0, 0.100102377431464, 0.06148866738710044, 0.04526113354567171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 142.89999999999998, 114, 418, 116.5, 320.30000000000047, 414.19999999999993, 418.0, 0.10482839591588569, 0.07790469657420802, 0.05261894091871606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 184.15, 113, 355, 115.5, 344.0, 354.45, 355.0, 0.1048300442906937, 0.09890264237230391, 0.05582404604659696], "isController": false}, {"data": ["login", 22, 0, 0.0, 2338.045454545454, 1544, 3936, 2244.0, 3402.2, 3860.249999999999, 3936.0, 0.09767012359710187, 32.00070901017989, 0.1915336789893806], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a0945dbf-516a-498f-b09f-3f893e3fcdf4", 3, 0, 0.0, 617.3333333333333, 200, 1362, 290.0, 1362.0, 1362.0, 1362.0, 0.02456258136355077, 0.024634542051139293, 0.015751394949933273], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87efd41d-df90-424a-a44d-695de73d12ba", 3, 0, 0.0, 317.6666666666667, 199, 434, 320.0, 434.0, 434.0, 434.0, 0.09533494343460022, 0.044812388775899326, 0.06113601515825601], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 146.5, 115, 465, 122.0, 302.5, 465.0, 465.0, 0.07768067693161326, 0.0628879698987377, 0.0276130531280344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/068601a7-8ab8-4226-b4d9-e668e833c19e", 3, 0, 0.0, 725.3333333333333, 277, 1477, 422.0, 1477.0, 1477.0, 1477.0, 0.021171190244315536, 0.0250236301357779, 0.013576577077246616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f4e1792-89a3-4db7-88bc-6c2443a4b543", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 1.2722547310756973, 2.3772099103585655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de9145fe-5876-4072-a55c-c7b2be9640d8", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.8287342316513762, 3.162629013761468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 683.35, 230, 1143, 724.0, 1142.9, 1143.0, 1143.0, 0.10476524727217489, 56.49034723295339, 0.22355716974065365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54cdc3eb-c3c5-4aa2-9191-ce72d649b4d9", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb47c495-fd51-41cf-baa0-f610eb6a47ec", 2, 0, 0.0, 219.0, 211, 227, 219.0, 227.0, 227.0, 227.0, 0.017185231012467887, 0.029067207142182007, 0.010682030800230282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88bebc4e-5fd5-40eb-af1b-4cf61e973fe6", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 757.8888888888889, 115, 1265, 927.0, 1265.0, 1265.0, 1265.0, 0.03952586528706758, 31.527976283931856, 0.06807232354994971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 499.2352941176471, 229, 1138, 457.0, 1134.0, 1138.0, 1138.0, 0.10529184421761965, 22.36361754518259, 0.23204972446053415], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 950.8695652173913, 413, 1728, 940.0, 1615.0000000000002, 1719.8, 1728.0, 0.09294731907602283, 0.029140752549989494, 0.041935216223752486], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3db4e03-1f24-40cc-80af-d6a5b2899334", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 155.35714285714286, 116, 357, 118.5, 351.0, 357.0, 357.0, 0.06387502395313399, 0.04959047269798976, 0.022705574920840594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 352.50000000000006, 230, 1233, 233.5, 847.5, 1233.0, 1233.0, 0.07635377978479142, 6.634571449072029, 0.1703260238223793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 319.8421052631579, 229, 485, 234.0, 463.0, 485.0, 485.0, 0.09991533490042648, 0.1548492543818133, 0.22471192995672087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 138.2, 115, 335, 116.0, 313.5000000000001, 335.0, 335.0, 0.07328584410635242, 0.054463405629818544, 0.036786058467446425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8aac486-3a32-4d79-8657-56f4d4bc09d3", 3, 0, 0.0, 336.6666666666667, 198, 445, 367.0, 445.0, 445.0, 445.0, 0.06511123168746609, 0.02946113673358654, 0.041754272924579484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 183.39999999999998, 112, 353, 114.5, 351.8, 353.0, 353.0, 0.07328638119178313, 0.030617103392426587, 0.04118064818139845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 249.29999999999998, 113, 1012, 115.5, 945.1000000000003, 1012.0, 1012.0, 0.07328638119178313, 6.612099134945878, 0.04245457160445874], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 0.8378462357954546, 1.7561479048295456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 205.0, 113, 566, 115.0, 543.7, 566.0, 566.0, 0.07328691828508611, 2.172656536277025, 0.042526451997068525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5be6c7a-89dd-4d59-9735-5387be0676cb", 1, 0, 0.0, 2654.0, 2654, 2654, 2654.0, 2654.0, 2654.0, 2654.0, 0.37678975131876413, 0.06807236718161266, 0.2597788715146948], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1066.0526315789475, 899, 1958, 917.0, 1484.0, 1498.6999999999994, 1958.0, 0.24404341403891852, 291.9607664087085, 0.4818904132682551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 950.8695652173913, 413, 1728, 940.0, 1615.0000000000002, 1719.8, 1728.0, 0.09205154886736572, 0.02885991155046826, 0.04153106989914352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 214.37500000000003, 112, 462, 116.0, 462.0, 462.0, 462.0, 0.04916088514173698, 0.013250394823358795, 0.028949232168425192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 214.375, 113, 461, 116.0, 461.0, 461.0, 461.0, 0.049161187242671905, 0.013250476249001414, 0.028901401093836418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de9145fe-5876-4072-a55c-c7b2be9640d8", 3, 0, 0.0, 366.3333333333333, 212, 473, 414.0, 473.0, 473.0, 473.0, 0.09800078400627205, 0.044279000065333855, 0.06284555484777211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 179.71428571428572, 113, 795, 115.0, 569.0, 795.0, 795.0, 0.06542728691734664, 4.221488489762966, 0.038062470207217564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 261.5714285714286, 113, 801, 231.5, 573.0, 801.0, 801.0, 0.06542728691734664, 1.3905032731168625, 0.038126364042097786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 148.07142857142858, 113, 343, 117.0, 341.0, 343.0, 343.0, 0.0654260638745315, 0.048622299422381325, 0.032840817218270694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 114.625, 114, 115, 115.0, 115.0, 115.0, 115.0, 0.04916148934731978, 0.013154539141763299, 0.02803741189339331], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 181.6428571428571, 113, 348, 115.5, 346.0, 348.0, 348.0, 0.06542759268519513, 0.024526219523593656, 0.036921681419031016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 203.37499999999997, 115, 360, 117.5, 360.0, 360.0, 360.0, 0.04916088514173698, 0.03653460311802914, 0.024676459924660943], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 658.8571428571428, 116, 1477, 501.5, 1419.5, 1477.0, 1477.0, 0.07459386305632369, 0.01393952002845223, 0.05076815861052946], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 177.375, 116, 347, 120.0, 347.0, 347.0, 347.0, 0.05110776071346434, 0.04022739759282447, 0.018167211816114276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1235.8181818181818, 868, 1723, 1196.0, 1491.5, 1690.7499999999995, 1723.0, 0.09930262474892235, 0.05139686632512582, 0.04567532837572502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 419.0, 231, 804, 234.0, 804.0, 804.0, 804.0, 0.04912526328070789, 0.07613456330711273, 0.1104838684916702], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73c12c40-0fff-4dd7-9649-c0bfd5333725", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a21c42ea-ae9e-426f-9ed2-56accfb60fbf", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.8381520669291338, 1.5660884186351707], "isController": false}, {"data": ["addBook", 59, 6, 10.169491525423728, 1091.2033898305087, 589, 2325, 950.0, 1656.0, 1703.0, 2325.0, 0.27874893697439285, 91.52173407528583, 1.0127302853042615], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 202.9473684210526, 114, 777, 117.0, 462.2, 464.5, 777.0, 0.2448748131218531, 0.1819821609235647, 0.11837210204620831], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f588c23-2e02-4255-976f-e407b059be94", 3, 0, 0.0, 277.0, 193, 439, 199.0, 439.0, 439.0, 439.0, 0.03977988463833455, 0.02557463286481469, 0.025509886958827818], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 644.2105263157895, 562, 930, 570.0, 803.0, 913.9, 930.0, 0.24489164618742373, 72.0062751470424, 0.12316327908840159], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 170.64912280701753, 113, 409, 119.0, 344.2, 354.2, 409.0, 0.2453670820688319, 0.43418471944211273, 0.11932891295925614], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 857.298245614035, 781, 1149, 792.0, 1026.0, 1121.3999999999999, 1149.0, 0.2448990113813593, 220.36056092749055, 0.12292782407228388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 120.42105263157895, 115, 145, 119.0, 127.0, 145.0, 145.0, 0.09715290845128037, 0.07258005367698192, 0.03453482292604107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 6, 3.4285714285714284, 182.4685714285714, 114, 1065, 121.0, 327.0, 440.39999999999975, 957.8400000000013, 0.7143731885537005, 1.5585534070498428, 0.3430745346368943], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 118.6, 116, 125, 117.0, 124.7, 125.0, 125.0, 0.07522190461862494, 0.058252900744696856, 0.026739036407401835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 132.35294117647058, 116, 344, 118.0, 171.19999999999985, 344.0, 344.0, 0.1088940844889985, 0.08837010176792748, 0.03870844409569868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/350bcdb7-ffb5-433d-b2a6-693da632e397", 3, 0, 0.0, 309.0, 213, 404, 310.0, 404.0, 404.0, 404.0, 0.018778990065914256, 0.025888353818081664, 0.012042516415967151], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90d804e5-5ae9-4f35-b049-8c54f732221f", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 412.90000000000003, 230, 1129, 234.0, 1084.0000000000002, 1129.0, 1129.0, 0.07322359557143694, 8.862221738895641, 0.16280808827836682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54cdc3eb-c3c5-4aa2-9191-ce72d649b4d9", 3, 0, 0.0, 354.0, 197, 585, 280.0, 585.0, 585.0, 585.0, 0.025075435267763856, 0.025148898457024883, 0.016080275871580337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 427.85714285714283, 229, 918, 455.5, 802.5, 918.0, 918.0, 0.06539092093770581, 5.681981144936641, 0.14587065091991014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 124.50000000000001, 117, 153, 119.5, 151.0, 153.0, 153.0, 0.07474918977217515, 0.06197467003571943, 0.026571001051827883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0945dbf-516a-498f-b09f-3f893e3fcdf4", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 121.34999999999998, 115, 139, 119.0, 128.0, 138.45, 139.0, 0.10516518821939562, 0.08164680140080031, 0.03738293799986329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=068601a7-8ab8-4226-b4d9-e668e833c19e", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 115.7894736842105, 113, 121, 116.0, 119.0, 121.0, 121.0, 0.09997632139756374, 0.07429880916361915, 0.05018342695151149], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 138.4736842105263, 112, 345, 114.0, 343.0, 345.0, 345.0, 0.09997895179962113, 0.026752180462007998, 0.05701924594822143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 142.94736842105263, 112, 363, 115.0, 342.0, 363.0, 363.0, 0.09997842570813667, 0.02694731005414621, 0.058776379176072535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 202.31578947368422, 114, 360, 116.0, 344.0, 360.0, 360.0, 0.0999773735417774, 0.026947026462432185, 0.05887339477118336], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 38.888888888888886, 0.5271084337349398], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.11111111111111, 0.15060240963855423], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07530120481927711], "isController": false}, {"data": ["401/Unauthorized", 8, 44.44444444444444, 0.6024096385542169], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1328, 18, "401/Unauthorized", 8, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
