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

    var data = {"OkPercent": 64.17445482866043, "KoPercent": 35.82554517133956};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.47095671981776766, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/80662966-668d-40b1-8432-313b3854a38d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae37a97b-bdb3-4d9d-a5ff-5595525b890c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/89905360-3ade-4fff-a4fd-7561b9bc6551"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89905360-3ade-4fff-a4fd-7561b9bc6551"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5294117647058824, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7dde7fbe-2104-4915-9538-ac654dc33fde"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=385bbfa8-56eb-4c43-bc2f-9bc8ac5b0fd1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3e446cf-b189-4c97-8529-cd1cda310be0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8bf1ae0-4f4d-476b-b0fb-3beb3ed092b7"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7dde7fbe-2104-4915-9538-ac654dc33fde"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f70a0e6a-4d94-411f-9b92-7cd6e7506dfb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92bbb72d-3700-48db-bbc3-01dd637fa46d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b3e446cf-b189-4c97-8529-cd1cda310be0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8756906077348067, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8bf1ae0-4f4d-476b-b0fb-3beb3ed092b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b7faa807-7dd3-4b6c-86fe-99ef17b27fae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e68f9924-f1e6-4e07-bf7f-cfb7264c3a79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cae243e3-4e72-41f7-a417-75db477f8eb9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92bbb72d-3700-48db-bbc3-01dd637fa46d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=644c675d-d9ab-4ca3-a17f-2d637c202295"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f70a0e6a-4d94-411f-9b92-7cd6e7506dfb"], "isController": false}, {"data": [0.6956521739130435, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cae243e3-4e72-41f7-a417-75db477f8eb9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e68f9924-f1e6-4e07-bf7f-cfb7264c3a79"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/385bbfa8-56eb-4c43-bc2f-9bc8ac5b0fd1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ae37a97b-bdb3-4d9d-a5ff-5595525b890c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f38011c0-12e8-447d-9950-4cd78d27831a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80662966-668d-40b1-8432-313b3854a38d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/45498175-83c7-4c11-8c98-d41c2b94ed65"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/644c675d-d9ab-4ca3-a17f-2d637c202295"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45498175-83c7-4c11-8c98-d41c2b94ed65"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 642, 230, 35.82554517133956, 311.85358255451706, 126, 3127, 137.0, 694.7, 1085.9500000000003, 1981.2300000000118, 2.554044699760509, 2.645467043076629, 1.2252544285523896], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 59, 100.0, 727.1864406779662, 514, 1155, 781.0, 937.0, 946.0, 1155.0, 0.26072047230176404, 1.678180900236858, 0.43767430848313715], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 19, 100.0, 186.4736842105263, 127, 404, 133.0, 395.0, 404.0, 404.0, 0.09126673423607343, 0.04536598410757946, 0.045811622458341535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 179.88235294117644, 133, 392, 137.0, 384.8, 392.0, 392.0, 0.11354604292040422, 0.08815342199386851, 0.04036206994436244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80662966-668d-40b1-8432-313b3854a38d", 3, 0, 0.0, 935.3333333333334, 214, 2118, 474.0, 2118.0, 2118.0, 2118.0, 0.027500985451978696, 0.02758155474529504, 0.017635723092577483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, 100.0, 168.75, 130, 444, 133.0, 408.3, 444.0, 444.0, 0.086372101811115, 0.04293300763853275, 0.043354746416907335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae37a97b-bdb3-4d9d-a5ff-5595525b890c", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89905360-3ade-4fff-a4fd-7561b9bc6551", 3, 0, 0.0, 313.6666666666667, 237, 407, 297.0, 407.0, 407.0, 407.0, 0.04875670404680644, 0.031345862790508695, 0.03126650617584918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 135.33333333333334, 133, 140, 133.0, 140.0, 140.0, 140.0, 0.03136730063466505, 0.009250903116864106, 0.019390137989983375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89905360-3ade-4fff-a4fd-7561b9bc6551", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["https://demoqa.com/books", 59, 59, 100.0, 251.38983050847455, 126, 741, 133.0, 528.0, 532.0, 741.0, 0.26670765224938525, 0.13257245604974324, 0.12892606236664617], "isController": false}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 582.2352941176471, 132, 2529, 445.0, 1516.1999999999991, 2529.0, 2529.0, 0.09652509652509653, 0.020033615219736543, 0.06452010702929821], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 582.2352941176471, 132, 2529, 445.0, 1516.1999999999991, 2529.0, 2529.0, 0.09632655836539496, 0.019992408971402344, 0.06438739850297195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, 34.61538461538461, 922.6538461538461, 156, 1827, 891.0, 1650.4, 1779.3999999999999, 1827.0, 0.10343483207752838, 0.03227676475736575, 0.04666688712872862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7dde7fbe-2104-4915-9538-ac654dc33fde", 3, 0, 0.0, 298.3333333333333, 213, 450, 232.0, 450.0, 450.0, 450.0, 0.03679943083546974, 0.029911516535210923, 0.023598593341756315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=385bbfa8-56eb-4c43-bc2f-9bc8ac5b0fd1", 1, 0, 0.0, 732.0, 732, 732, 732.0, 732.0, 732.0, 732.0, 1.366120218579235, 0.24680882855191258, 0.9418758538251366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 187.5, 130, 402, 137.5, 401.0, 402.0, 402.0, 0.05116424233431739, 0.0402718548061131, 0.018187289267276883], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 513.625, 131, 1590, 446.0, 1337.3000000000002, 1590.0, 1590.0, 0.09771887501145143, 0.023451575716859557, 0.06495704759214584], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1402.304347826087, 797, 3127, 1285.0, 2558.6000000000013, 3076.5999999999995, 3127.0, 0.09843741306478465, 0.05094905168392174, 0.0452773647983531], "isController": false}, {"data": ["goToProfile", 18, 5, 27.77777777777778, 227.5, 129, 467, 227.0, 323.0000000000002, 467.0, 467.0, 0.10033836325832111, 0.14748084512773632, 0.06249917255690021], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 10, 100.0, 157.1, 128, 391, 131.0, 365.4000000000001, 391.0, 391.0, 0.04985790497083313, 0.024782884404447324, 0.02502633120606272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3e446cf-b189-4c97-8529-cd1cda310be0", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8bf1ae0-4f4d-476b-b0fb-3beb3ed092b7", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["addBook", 61, 61, 100.0, 796.0819672131148, 527, 2756, 716.0, 1083.0000000000005, 1397.5, 2756.0, 0.29182553616962237, 0.9818931374354755, 0.5681683970884422], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7dde7fbe-2104-4915-9538-ac654dc33fde", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f70a0e6a-4d94-411f-9b92-7cd6e7506dfb", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.3261084160649819, 1.2445002256317688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92bbb72d-3700-48db-bbc3-01dd637fa46d", 3, 0, 0.0, 323.6666666666667, 207, 477, 287.0, 477.0, 477.0, 477.0, 0.08977735216662677, 0.040621913903519276, 0.05757206502872876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3e446cf-b189-4c97-8529-cd1cda310be0", 3, 0, 0.0, 500.0, 231, 669, 600.0, 669.0, 669.0, 669.0, 0.047521741196597446, 0.03055190067164061, 0.030474554087661775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 159.1875, 132, 515, 135.0, 253.90000000000026, 515.0, 515.0, 0.09050541618349973, 0.06761390955114971, 0.032171847158978424], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 451.375, 133, 1146, 409.0, 856.2000000000003, 1146.0, 1146.0, 0.09675858732462506, 0.01955369156688437, 0.0654171674679487], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 19, 10.497237569060774, 210.03314917127068, 128, 2350, 137.0, 377.00000000000057, 460.00000000000017, 1314.3400000000086, 0.7539247824656256, 1.6710174300849312, 0.35986989330506464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 132.0, 130, 134, 132.0, 134.0, 134.0, 134.0, 0.030887622006106924, 0.023919808838713665, 0.010979584384983322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 18, 100.0, 147.0, 129, 390, 132.5, 164.10000000000036, 390.0, 390.0, 0.08901064666234801, 0.0442445499522804, 0.0446791722504364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8bf1ae0-4f4d-476b-b0fb-3beb3ed092b7", 3, 0, 0.0, 291.3333333333333, 212, 414, 248.0, 414.0, 414.0, 414.0, 0.05178932104200114, 0.0332955433131355, 0.0332112507984187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7faa807-7dd3-4b6c-86fe-99ef17b27fae", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.6451231060606061, 1.2054135101010102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 154.78571428571428, 131, 397, 135.0, 272.0, 397.0, 397.0, 0.08660204504543514, 0.07027958928980138, 0.030784320699744527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e68f9924-f1e6-4e07-bf7f-cfb7264c3a79", 3, 0, 0.0, 557.0, 208, 1229, 234.0, 1229.0, 1229.0, 1229.0, 0.03219402264312926, 0.032529377045661854, 0.020645255405912968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cae243e3-4e72-41f7-a417-75db477f8eb9", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92bbb72d-3700-48db-bbc3-01dd637fa46d", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.7314334514170041, 2.791308198380567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=644c675d-d9ab-4ca3-a17f-2d637c202295", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f70a0e6a-4d94-411f-9b92-7cd6e7506dfb", 3, 0, 0.0, 510.3333333333333, 291, 834, 406.0, 834.0, 834.0, 834.0, 0.02698933921101165, 0.02706840954073141, 0.017307616616436507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 554.8695652173913, 185, 1080, 527.0, 938.4000000000001, 1059.5999999999997, 1080.0, 0.09913493989405492, 0.060894411321641154, 0.04482370817475335], "isController": false}, {"data": ["login", 23, 8, 34.78260869565217, 2405.347826086956, 1309, 3897, 2087.0, 3724.0000000000005, 3896.8, 3897.0, 0.0983494398357992, 0.14880196752330455, 0.14718591652056784], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 7, 100.0, 167.2857142857143, 128, 380, 132.0, 380.0, 380.0, 380.0, 0.03134122535236492, 0.015578792680032953, 0.015731826006948797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 163.52631578947373, 130, 403, 135.0, 392.0, 403.0, 403.0, 0.09049342731948942, 0.0732607922342351, 0.032167585492474754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cae243e3-4e72-41f7-a417-75db477f8eb9", 3, 0, 0.0, 418.3333333333333, 345, 467, 443.0, 467.0, 467.0, 467.0, 0.025934506725682076, 0.026010486725854973, 0.016631177815622948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e68f9924-f1e6-4e07-bf7f-cfb7264c3a79", 1, 0, 0.0, 1146.0, 1146, 1146, 1146.0, 1146.0, 1146.0, 1146.0, 0.8726003490401396, 0.1576475239965096, 0.6016170375218151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, 100.0, 163.11764705882354, 130, 390, 133.0, 387.6, 390.0, 390.0, 0.11782154886822006, 0.058565594115160165, 0.059140894646743276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/385bbfa8-56eb-4c43-bc2f-9bc8ac5b0fd1", 3, 0, 0.0, 294.3333333333333, 211, 449, 223.0, 449.0, 449.0, 449.0, 0.04642884779076066, 0.029426095914261395, 0.029773707730403158], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 183.33333333333334, 130, 453, 134.0, 406.20000000000005, 453.0, 453.0, 0.08981184418642943, 0.07446314034597518, 0.03192530398814483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 19, 100.0, 132.1052631578947, 127, 141, 131.0, 137.0, 141.0, 141.0, 0.09147368927832074, 0.04546885531510279, 0.04591550418853209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae37a97b-bdb3-4d9d-a5ff-5595525b890c", 3, 0, 0.0, 387.3333333333333, 255, 472, 435.0, 472.0, 472.0, 472.0, 0.03171750277528149, 0.02644157702066924, 0.02033967463128403], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 137.68421052631578, 129, 169, 133.0, 156.0, 169.0, 169.0, 0.09036946843727409, 0.0701598900465165, 0.03212352198356227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f38011c0-12e8-447d-9950-4cd78d27831a", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.8381520669291338, 1.5660884186351707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80662966-668d-40b1-8432-313b3854a38d", 1, 0, 0.0, 634.0, 634, 634, 634.0, 634.0, 634.0, 634.0, 1.5772870662460567, 0.28495908911671924, 1.0874654968454258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45498175-83c7-4c11-8c98-d41c2b94ed65", 3, 0, 0.0, 916.6666666666667, 307, 1590, 853.0, 1590.0, 1590.0, 1590.0, 0.032968119828126204, 0.027484164999945052, 0.021141665384573117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 14, 100.0, 150.64285714285714, 127, 393, 132.0, 265.5, 393.0, 393.0, 0.09279758196015007, 0.04612692306417615, 0.046580036257340945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 16, 100.0, 133.00000000000003, 127, 156, 131.0, 145.5, 156.0, 156.0, 0.11703606173652256, 0.05817515178114256, 0.06646853970082656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/644c675d-d9ab-4ca3-a17f-2d637c202295", 3, 0, 0.0, 792.6666666666666, 237, 1727, 414.0, 1727.0, 1727.0, 1727.0, 0.050159674965306225, 0.03224783790901035, 0.03216619781303817], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45498175-83c7-4c11-8c98-d41c2b94ed65", 1, 0, 0.0, 589.0, 589, 589, 589.0, 589.0, 589.0, 589.0, 1.697792869269949, 0.30673015704584045, 1.1705485993208828], "isController": false}, {"data": ["register", 26, 9, 34.61538461538461, 922.6538461538461, 156, 1827, 891.0, 1650.4, 1779.3999999999999, 1827.0, 0.1030453875299228, 0.03215523886713486, 0.046491180701976886], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 3.9130434782608696, 1.4018691588785046], "isController": false}, {"data": ["401/Unauthorized", 26, 11.304347826086957, 4.049844236760125], "isController": false}, {"data": ["404/Not Found", 195, 84.78260869565217, 30.373831775700936], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 642, 230, "404/Not Found", 195, "401/Unauthorized", 26, "406/Not Acceptable", 9, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 59, 59, "404/Not Found", 59, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
