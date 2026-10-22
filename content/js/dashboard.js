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

    var data = {"OkPercent": 98.47094801223241, "KoPercent": 1.529051987767584};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7569169960474308, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4d6c2618-ea8c-4c04-adea-a99a282c6754"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c869affe-3a50-4e07-a652-b02a52e96b29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da1bf49f-4fc2-4872-82a3-7181baabcd78"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/fadbc6ce-dd52-49b4-9265-011175473cbd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0700c41-b631-4599-842a-1e807297ab4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=678c7d60-97d3-4c02-bafa-8661ed575628"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e5cf5bc7-3a47-4ea9-965a-de8283214cbe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4e81dc40-a84f-4a78-83ea-9de5ea5e60ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/048b40e9-898d-4757-bc20-2a7487dcdd02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56de98d6-abff-4171-b1b7-fb9d912ceb8e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30965da3-b774-4e1b-ae88-fd744ec3709c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c869affe-3a50-4e07-a652-b02a52e96b29"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8b3abbe8-3a47-4b69-8e3f-321805e8d0a5"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf48f1a9-8d6b-4f74-b6d1-5d7bb4a1d10d"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "register"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/da1bf49f-4fc2-4872-82a3-7181baabcd78"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b0700c41-b631-4599-842a-1e807297ab4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/49581fe9-85f7-4ff0-bae8-9e8f8075a34a"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d6c2618-ea8c-4c04-adea-a99a282c6754"], "isController": false}, {"data": [0.3, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5cf5bc7-3a47-4ea9-965a-de8283214cbe"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9488636363636364, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=048b40e9-898d-4757-bc20-2a7487dcdd02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/30965da3-b774-4e1b-ae88-fd744ec3709c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0535c946-fefb-4626-9905-ce736a390408"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/678c7d60-97d3-4c02-bafa-8661ed575628"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/56de98d6-abff-4171-b1b7-fb9d912ceb8e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b3abbe8-3a47-4b69-8e3f-321805e8d0a5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cf48f1a9-8d6b-4f74-b6d1-5d7bb4a1d10d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c08e06af-f03e-4ce5-b6aa-bbf7d7c25a7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1308, 20, 1.529051987767584, 426.6467889908254, 132, 3483, 146.0, 1098.1000000000001, 1274.8499999999997, 1885.830000000001, 5.05481850187237, 715.2968371395834, 3.6945758522277146], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2017.910714285714, 1641, 2541, 1974.0, 2365.2, 2424.45, 2541.0, 0.2562366162124568, 308.3401095311442, 1.2599134400680858], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4d6c2618-ea8c-4c04-adea-a99a282c6754", 3, 0, 0.0, 398.0, 278, 628, 288.0, 628.0, 628.0, 628.0, 0.016602837978438447, 0.0228883524865517, 0.01064700221924601], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 663.2307692307692, 143, 1384, 620.0, 1214.7999999999997, 1384.0, 1384.0, 0.08944236127833774, 0.01773124935498297, 0.06013440004816127], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 663.2307692307692, 143, 1384, 620.0, 1214.7999999999997, 1384.0, 1384.0, 0.08857637327446412, 0.017559573998746306, 0.05955217403894635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c869affe-3a50-4e07-a652-b02a52e96b29", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.3006057612312812, 1.1471765806988352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 176.85714285714286, 134, 420, 138.0, 404.6, 418.5, 420.0, 0.10617804541386686, 0.02841092230800734, 0.06055466652509594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 140.0952380952381, 135, 150, 140.0, 145.4, 149.6, 150.0, 0.10617428762108924, 0.07890491492153213, 0.053294515466054564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da1bf49f-4fc2-4872-82a3-7181baabcd78", 1, 0, 0.0, 1874.0, 1874, 1874, 1874.0, 1874.0, 1874.0, 1874.0, 0.5336179295624334, 0.09640558297758804, 0.3679045490928495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 190.0952380952381, 135, 424, 138.0, 412.0, 423.0, 424.0, 0.10602901155716227, 0.02857813202126639, 0.062437005829071135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fadbc6ce-dd52-49b4-9265-011175473cbd", 1, 0, 0.0, 2277.0, 2277, 2277, 2277.0, 2277.0, 2277.0, 2277.0, 0.4391743522178305, 0.1402441534914361, 0.26204641523935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 179.09523809523807, 136, 427, 141.0, 408.6, 425.29999999999995, 427.0, 0.10603436523284641, 0.028579575004165636, 0.06233660924821635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0700c41-b631-4599-842a-1e807297ab4d", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.3006057612312812, 1.1471765806988352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=678c7d60-97d3-4c02-bafa-8661ed575628", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 298.4615384615385, 142, 484, 320.0, 446.79999999999995, 484.0, 484.0, 0.09001834989440155, 0.19202607286292978, 0.05818193227850293], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e5cf5bc7-3a47-4ea9-965a-de8283214cbe", 3, 0, 0.0, 526.6666666666666, 279, 817, 484.0, 817.0, 817.0, 817.0, 0.02440055958616651, 0.028840635370237826, 0.0156474942658685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e81dc40-a84f-4a78-83ea-9de5ea5e60ee", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 1.1049686418685123, 2.064635596885813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 138.35714285714286, 136, 143, 138.0, 142.0, 143.0, 143.0, 0.07991871125369625, 0.05939271412506137, 0.040115446859765494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 176.07142857142856, 135, 410, 137.5, 406.0, 410.0, 410.0, 0.0799209923903798, 0.021385109291957093, 0.045579940972638476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 789.4, 670, 1074, 701.0, 1074.0, 1074.0, 1074.0, 0.06541334693930949, 19.233695927692086, 0.03730604942632495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1119.4, 938, 1243, 1232.0, 1243.0, 1243.0, 1243.0, 0.06521200422573786, 58.67787603279512, 0.037127537562114434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 357.6, 145, 415, 408.0, 415.0, 415.0, 415.0, 0.06566678048908618, 0.11619942016232829, 0.03636041458721862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 195.46666666666667, 137, 417, 140.0, 417.0, 417.0, 417.0, 0.07062313142964759, 0.052484573259728336, 0.035449501518397326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 174.93333333333334, 136, 416, 139.0, 410.0, 416.0, 416.0, 0.07053479481428188, 0.025936231843168234, 0.039831953790304755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 265.20000000000005, 134, 961, 138.0, 632.8000000000002, 961.0, 961.0, 0.07062412896907605, 4.254280741800539, 0.041114645914158726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 283.2666666666667, 136, 948, 142.0, 629.4000000000002, 948.0, 948.0, 0.07062379645280212, 1.402149037986186, 0.04118342088722322], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 138.2, 136, 143, 137.0, 143.0, 143.0, 143.0, 0.06589872683659752, 0.04897356554946359, 0.03700367962015974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 935.3571428571429, 138, 1344, 1219.0, 1311.0, 1344.0, 1344.0, 0.07973255423237484, 51.25149187083896, 0.041979723726699586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 177.85714285714286, 135, 426, 137.5, 421.5, 426.0, 426.0, 0.07992053615262538, 0.021541082009887313, 0.046984533949102035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 778.3571428571429, 137, 1102, 974.5, 1100.0, 1102.0, 1102.0, 0.07973300832640416, 16.751962891403643, 0.04205782707619058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/048b40e9-898d-4757-bc20-2a7487dcdd02", 3, 0, 0.0, 346.3333333333333, 232, 486, 321.0, 486.0, 486.0, 486.0, 0.03648791641834613, 0.030418474592247537, 0.02339882660942118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 216.28571428571428, 134, 422, 138.5, 417.5, 422.0, 422.0, 0.0799196236927433, 0.021540836073434717, 0.047062044030004115], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 595.3846153846155, 143, 1874, 480.0, 1603.1999999999998, 1874.0, 1874.0, 0.0888651915044877, 0.017616829956456057, 0.06029375072630205], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 516.8666666666666, 276, 1378, 540.0, 1052.2000000000003, 1378.0, 1378.0, 0.07048839056207443, 5.723868411685096, 0.15732770140882799], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 595.0, 151, 1182, 603.0, 1040.2, 1167.9999999999998, 1182.0, 0.10324026960458978, 0.06341614216922556, 0.04667992658879401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 159.71428571428572, 135, 421, 140.0, 283.5, 421.0, 421.0, 0.07973073790797933, 0.05925301908981667, 0.040021093051466186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 217.78571428571428, 137, 424, 139.0, 424.0, 424.0, 424.0, 0.07973028383981047, 0.1068706148343888, 0.040688250318921135], "isController": false}, {"data": ["login", 21, 0, 0.0, 3044.52380952381, 1365, 5227, 3158.0, 4890.800000000001, 5214.5, 5227.0, 0.10312062658056913, 29.51516713367625, 0.19630035570478035], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56de98d6-abff-4171-b1b7-fb9d912ceb8e", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 143.42857142857144, 138, 163, 141.0, 157.5, 163.0, 163.0, 0.07849733669750492, 0.06354911340061677, 0.0279033501541912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30965da3-b774-4e1b-ae88-fd744ec3709c", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.5298066348973607, 2.021856671554252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c869affe-3a50-4e07-a652-b02a52e96b29", 3, 0, 0.0, 371.0, 268, 454, 391.0, 454.0, 454.0, 454.0, 0.02607539265195435, 0.026151785403864373, 0.016721524584749372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1124.7857142857144, 281, 1484, 1362.5, 1450.5, 1484.0, 1484.0, 0.07966631196189673, 68.11285177655876, 0.16461185079068813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b3abbe8-3a47-4b69-8e3f-321805e8d0a5", 3, 0, 0.0, 534.3333333333334, 258, 1000, 345.0, 1000.0, 1000.0, 1000.0, 0.023495136506743106, 0.027770455942703193, 0.01506686813746221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 386.1428571428572, 277, 567, 286.0, 563.8, 566.8, 567.0, 0.10595197852706568, 0.16420487297114575, 0.23828848295686744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 856.125, 142, 1380, 1147.0, 1380.0, 1380.0, 1380.0, 0.07333528894103843, 54.841421747809115, 0.12141681200040336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf48f1a9-8d6b-4f74-b6d1-5d7bb4a1d10d", 1, 0, 0.0, 1197.0, 1197, 1197, 1197.0, 1197.0, 1197.0, 1197.0, 0.835421888053467, 0.15093071219715956, 0.575984231411863], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 869.6363636363636, 324, 2105, 905.5, 1198.8, 1970.599999999998, 2105.0, 0.09442546397239343, 0.029709148110632307, 0.042602113628169694], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 397.0, 276, 567, 282.5, 566.0, 567.0, 567.0, 0.07985580323530082, 0.1237608981781469, 0.1795975730965799], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 160.875, 139, 422, 142.5, 233.7000000000002, 422.0, 422.0, 0.09105861329114284, 0.07069491949849468, 0.03236849144333593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da1bf49f-4fc2-4872-82a3-7181baabcd78", 3, 0, 0.0, 1098.3333333333333, 302, 2326, 667.0, 2326.0, 2326.0, 2326.0, 0.032026304271241444, 0.026699012121956165, 0.020537701632273975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 11, 0, 0.0, 785.2727272727273, 284, 1503, 561.0, 1483.0, 1503.0, 1503.0, 0.12698559290727743, 41.57556111758866, 0.27673254164550243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 159.92857142857142, 136, 423, 139.0, 284.0, 423.0, 423.0, 0.07886390905864657, 0.05860882304065435, 0.03958598560170346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 198.92857142857142, 135, 424, 139.5, 423.0, 424.0, 424.0, 0.07874281471815696, 0.021069854719506842, 0.044908011518948895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 178.42857142857144, 136, 419, 139.5, 415.0, 419.0, 419.0, 0.07874370050395968, 0.021223888026457884, 0.046292683304085674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 208.07142857142856, 135, 567, 138.0, 490.5, 567.0, 567.0, 0.0788661303769801, 0.02125688670317042, 0.04644167638410059], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 144.5, 143, 146, 144.5, 146.0, 146.0, 146.0, 0.029584048281166793, 0.008724982989172238, 0.018287795470682208], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1316.375, 1079, 1960, 1121.0, 1793.3, 1848.4499999999998, 1960.0, 0.2582442160212867, 308.94986257718506, 0.5099314499951579], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 869.6363636363636, 324, 2105, 905.5, 1198.8, 1970.599999999998, 2105.0, 0.08905764863519154, 0.02802026871121438, 0.04018030631783055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 139.63636363636365, 135, 142, 140.0, 142.0, 142.0, 142.0, 0.05921683049989772, 0.015960786345675555, 0.034870848429138984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 178.54545454545456, 137, 569, 139.0, 484.0000000000003, 569.0, 569.0, 0.05921619293712317, 0.01596061450258398, 0.03481264467592593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 294.6875, 136, 1264, 139.0, 1240.2, 1264.0, 1264.0, 0.08824762282966002, 9.946483073692281, 0.05093197762922762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 265.75, 132, 1093, 139.0, 804.6000000000003, 1093.0, 1093.0, 0.08831435494643182, 3.266747127023641, 0.0510567364534059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 139.54545454545453, 136, 142, 139.0, 142.0, 142.0, 142.0, 0.05921651171679434, 0.015845043174220363, 0.033771916838484274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 155.6875, 135, 409, 139.5, 222.80000000000018, 409.0, 409.0, 0.08878235006880632, 0.06597985195543125, 0.0445645780618813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 140.0, 136, 143, 140.0, 142.8, 143.0, 143.0, 0.05921523661870233, 0.044006635807453585, 0.029723273068372063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 155.4375, 135, 417, 138.0, 224.5000000000002, 417.0, 417.0, 0.0887818574274347, 0.0404243564702553, 0.049701366963161075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0700c41-b631-4599-842a-1e807297ab4d", 3, 0, 0.0, 643.3333333333334, 247, 1099, 584.0, 1099.0, 1099.0, 1099.0, 0.030313747284393473, 0.025271323826605366, 0.01943947986661951], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 169.45454545454544, 141, 419, 144.0, 365.8000000000002, 419.0, 419.0, 0.0589622641509434, 0.04640975088443396, 0.02095924233490566], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 680.8333333333334, 142, 1270, 599.0, 1218.7000000000003, 1270.0, 1270.0, 0.10682904681782977, 0.020073915128773514, 0.07270599922994063], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/49581fe9-85f7-4ff0-bae8-9e8f8075a34a", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.6200697815533981, 1.1586013349514563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1615.9047619047617, 870, 3483, 1307.0, 2821.0, 3417.2999999999993, 3483.0, 0.10482755866599444, 0.0542564512626729, 0.04821658215984705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 321.0, 279, 708, 283.0, 623.6000000000004, 708.0, 708.0, 0.05917032446854291, 0.09170244622224374, 0.13307544653423273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d6c2618-ea8c-4c04-adea-a99a282c6754", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.2867683531746032, 1.0943700396825398], "isController": false}, {"data": ["addBook", 60, 7, 11.666666666666666, 1303.8333333333335, 691, 2922, 1118.5, 1990.7, 2094.7999999999997, 2922.0, 0.26987396885654397, 87.16395068503009, 0.9805025545257865], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 241.62500000000009, 136, 574, 142.5, 554.9, 561.45, 574.0, 0.25973062224036214, 0.19302246437980036, 0.1255533769618938], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 787.9642857142854, 661, 1126, 693.5, 991.2, 1101.4, 1126.0, 0.2596306753642943, 76.34003910687048, 0.13057597442637847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5cf5bc7-3a47-4ea9-965a-de8283214cbe", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 204.1785714285714, 135, 560, 141.0, 418.40000000000003, 443.84999999999985, 560.0, 0.25995849948240407, 0.46000468853722276, 0.12642512963109104], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1072.857142857143, 936, 1404, 976.5, 1261.0, 1288.2499999999998, 1404.0, 0.25895235276709083, 233.00578220951095, 0.12998194269754365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 11, 0, 0.0, 143.27272727272725, 139, 149, 143.0, 148.4, 149.0, 149.0, 0.1361504090700927, 0.10171392865099699, 0.04839721572413451], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 7, 3.977272727272727, 207.3125000000001, 136, 2089, 144.0, 322.0, 410.0, 900.8899999999842, 0.738946245859172, 1.6042428530042785, 0.3557745067218917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 162.78571428571428, 139, 408, 145.0, 278.5, 408.0, 408.0, 0.0829693546762121, 0.06425263501780878, 0.029493012795059767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=048b40e9-898d-4757-bc20-2a7487dcdd02", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 147.33333333333334, 137, 203, 143.0, 158.2, 198.59999999999994, 203.0, 0.10434990012223845, 0.08468238964998062, 0.03709312855907695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30965da3-b774-4e1b-ae88-fd744ec3709c", 3, 0, 0.0, 348.0, 252, 472, 320.0, 472.0, 472.0, 472.0, 0.07384978952809984, 0.03341510658986289, 0.04735810070649632], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0535c946-fefb-4626-9905-ce736a390408", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.2050412735849056, 2.2516214622641506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 412.0714285714286, 278, 846, 286.5, 776.0, 846.0, 846.0, 0.07868085919498241, 0.12193996439691121, 0.17695509641215282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/678c7d60-97d3-4c02-bafa-8661ed575628", 3, 0, 0.0, 406.3333333333333, 239, 570, 410.0, 570.0, 570.0, 570.0, 0.07841702172151502, 0.03471586899129571, 0.05028695728886217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 487.0, 277, 1401, 282.0, 1379.3, 1401.0, 1401.0, 0.08818050549474775, 13.30639737511436, 0.19549979746040144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 166.66666666666669, 135, 469, 142.0, 299.80000000000007, 469.0, 469.0, 0.07240989795031716, 0.0600351595310735, 0.025739455912026803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56de98d6-abff-4171-b1b7-fb9d912ceb8e", 3, 0, 0.0, 968.6666666666666, 338, 1298, 1270.0, 1298.0, 1298.0, 1298.0, 0.01848178312243565, 0.025478630053227536, 0.011851924723697341], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 159.78571428571428, 138, 409, 139.5, 277.5, 409.0, 409.0, 0.07654372286798396, 0.05942603484379613, 0.02720890148822867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b3abbe8-3a47-4b69-8e3f-321805e8d0a5", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.3255208333333333, 1.2422578828828827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf48f1a9-8d6b-4f74-b6d1-5d7bb4a1d10d", 3, 0, 0.0, 702.0, 321, 1220, 565.0, 1220.0, 1220.0, 1220.0, 0.018867093901526345, 0.02600981206802216, 0.012099015294924123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c08e06af-f03e-4ce5-b6aa-bbf7d7c25a7e", 1, 0, 0.0, 332.0, 332, 332, 332.0, 332.0, 332.0, 332.0, 3.0120481927710845, 0.9618552334337349, 1.7972279743975903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 11, 0, 0.0, 164.36363636363637, 135, 405, 140.0, 354.6000000000002, 405.0, 405.0, 0.12901863732861046, 0.09588201465534431, 0.06476130819033768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 11, 0, 0.0, 215.54545454545453, 134, 419, 139.0, 418.2, 419.0, 419.0, 0.12901863732861046, 0.08737164111706681, 0.07062579170527451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 11, 0, 0.0, 593.5454545454545, 141, 1365, 416.0, 1344.2, 1365.0, 1365.0, 0.1271867448287026, 31.23661964731694, 0.07179095557713877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 11, 0, 0.0, 463.2727272727273, 135, 958, 412.0, 958.0, 958.0, 958.0, 0.12778810408921934, 10.272489072664962, 0.07225518776138476], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 30.0, 0.45871559633027525], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.0, 0.1529051987767584], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.0764525993883792], "isController": false}, {"data": ["401/Unauthorized", 11, 55.0, 0.8409785932721713], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1308, 20, "401/Unauthorized", 11, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
