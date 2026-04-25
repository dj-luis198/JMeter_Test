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

    var data = {"OkPercent": 96.66975023126734, "KoPercent": 3.330249768732655};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6926100628930818, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4720a7ee-d39c-47a3-b982-3eac4da8d022"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc34e5c2-1d8e-47d1-b89c-2ac1592a412a"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0e176b0-6260-41b0-822f-d9d932965b7d"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6cb04046-5b14-4027-a54d-836715c34f8b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f33b3a42-e193-4f77-99a5-4dc1596f218f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/72405277-1ec8-4830-a19c-94ea5bf4354e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72405277-1ec8-4830-a19c-94ea5bf4354e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6642fcb-e801-469f-9a2c-869fab909761"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b0a3f71b-a09b-4afc-a104-bd2c37bebae0"], "isController": false}, {"data": [0.5789473684210527, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52fd1c8a-79b0-409f-84e4-de289f2ee7b5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ac531e2a-b44b-4b78-b38e-eba02af05d01"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.11363636363636363, 500, 1500, "register"], "isController": true}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31aec8d6-ca7d-4190-aab2-d47f0fb93d31"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d0e176b0-6260-41b0-822f-d9d932965b7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.11363636363636363, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dc34e5c2-1d8e-47d1-b89c-2ac1592a412a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4720a7ee-d39c-47a3-b982-3eac4da8d022"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8eb1bc51-ea30-48a6-8d36-d4d38e9a953d"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.19318181818181818, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cb04046-5b14-4027-a54d-836715c34f8b"], "isController": false}, {"data": [0.9347826086956522, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7947761194029851, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/ec5c9b70-af51-4133-abce-9e85adfe0dcd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac531e2a-b44b-4b78-b38e-eba02af05d01"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f33b3a42-e193-4f77-99a5-4dc1596f218f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5e1c0680-775e-4408-84e4-2bdc2f5f6dd8"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0a3f71b-a09b-4afc-a104-bd2c37bebae0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e6642fcb-e801-469f-9a2c-869fab909761"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/31aec8d6-ca7d-4190-aab2-d47f0fb93d31"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/52fd1c8a-79b0-409f-84e4-de289f2ee7b5"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1081, 36, 3.330249768732655, 1252.3672525439429, 119, 60519, 221.0, 1406.4000000000015, 1878.5999999999995, 37276.16, 4.289086833177931, 629.3230447904061, 3.118211508322257], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 46, 0, 0.0, 9601.80434782609, 1533, 53737, 2182.0, 38933.3, 46690.399999999994, 53737.0, 0.2093621282115468, 251.93178609932184, 1.029431948774549], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4720a7ee-d39c-47a3-b982-3eac4da8d022", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc34e5c2-1d8e-47d1-b89c-2ac1592a412a", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 0.7140872035573123, 2.7251111660079053], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 507.2, 129, 1067, 519.0, 888.8000000000001, 1067.0, 1067.0, 0.1081572173311125, 0.022011683683402193, 0.07124575032266903], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 507.2, 129, 1067, 519.0, 888.8000000000001, 1067.0, 1067.0, 0.11091967197355676, 0.022573886366493386, 0.0730654453794562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 239.15384615384616, 121, 381, 129.0, 380.2, 381.0, 381.0, 0.14580529385374608, 0.07270549433602512, 0.08127067911619561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 126.84615384615384, 121, 131, 127.0, 130.6, 131.0, 131.0, 0.145808564570762, 0.10835968519370107, 0.07318906463805827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 276.2307692307692, 122, 1002, 128.0, 886.8, 1002.0, 1002.0, 0.145803658550263, 6.628809120579626, 0.0839312977366786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 326.7692307692308, 122, 1376, 127.0, 1321.2, 1376.0, 1376.0, 0.145803658550263, 20.217004737216943, 0.0837889113513756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0e176b0-6260-41b0-822f-d9d932965b7d", 1, 0, 0.0, 2390.0, 2390, 2390, 2390.0, 2390.0, 2390.0, 2390.0, 0.41841004184100417, 0.0755916579497908, 0.2884741108786611], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 261.8666666666667, 127, 539, 236.0, 485.6, 539.0, 539.0, 0.10788029602353229, 0.1477665070337953, 0.06849275044410721], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 145.53333333333336, 124, 365, 129.0, 232.4000000000001, 365.0, 365.0, 0.0826683126846259, 0.06143611909472686, 0.04149561789052511], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cb04046-5b14-4027-a54d-836715c34f8b", 3, 0, 0.0, 1533.3333333333333, 236, 3016, 1348.0, 3016.0, 3016.0, 3016.0, 0.02099781622711238, 0.02894718480528025, 0.013465396473766727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 143.73333333333335, 121, 379, 127.0, 235.60000000000008, 379.0, 379.0, 0.08267651435815467, 0.030400843300446453, 0.04668854723584853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 922.0, 635, 1133, 1000.5, 1133.0, 1133.0, 1133.0, 0.04989086373557842, 14.669570470845027, 0.0273875993919551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1196.875, 875, 1639, 1124.5, 1639.0, 1639.0, 1639.0, 0.04989210831576715, 44.89300676349893, 0.027339559842465666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 292.25, 128, 433, 373.0, 433.0, 433.0, 433.0, 0.0501290823871469, 0.08870497781788104, 0.026686148472942827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 4, 0, 0.0, 131.75, 123, 141, 131.5, 141.0, 141.0, 141.0, 0.02306858289695264, 0.017143741781817344, 0.011579347274446932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f33b3a42-e193-4f77-99a5-4dc1596f218f", 3, 0, 0.0, 415.0, 258, 538, 449.0, 538.0, 538.0, 538.0, 0.026396367859782492, 0.0264737009687467, 0.01692735829549854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 4, 0, 0.0, 190.0, 122, 374, 132.0, 374.0, 374.0, 374.0, 0.023038024259039547, 0.006164471334938315, 0.01313887321023349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 4, 0, 0.0, 125.75, 120, 131, 126.0, 131.0, 131.0, 131.0, 0.023070578667789433, 0.006218241906552621, 0.013562976912118397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 4, 0, 0.0, 127.75, 123, 136, 126.0, 136.0, 136.0, 136.0, 0.023070844796659343, 0.006218313636599589, 0.013585663488657796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72405277-1ec8-4830-a19c-94ea5bf4354e", 3, 0, 0.0, 396.3333333333333, 236, 636, 317.0, 636.0, 636.0, 636.0, 0.04735147420923038, 0.030442435404697266, 0.03036536594797651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 131.75, 123, 141, 130.5, 141.0, 141.0, 141.0, 0.05020206330480183, 0.037308369311478705, 0.027117203384246592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 256.1333333333333, 122, 1579, 128.0, 860.2000000000005, 1579.0, 1579.0, 0.08267651435815467, 4.9802965072617535, 0.048131080168660086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 698.1578947368421, 123, 1636, 139.0, 1515.0, 1636.0, 1636.0, 0.12472020007745782, 47.27144305374127, 0.06880893439717475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 201.86666666666665, 123, 748, 127.0, 527.8000000000002, 748.0, 748.0, 0.08267788146196542, 1.6414681421453257, 0.048212616162423456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 488.10526315789485, 121, 1105, 366.0, 1049.0, 1105.0, 1105.0, 0.12472101877379545, 15.460354921557043, 0.06893118394709202], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 554.9285714285714, 130, 2390, 447.0, 1707.0, 2390.0, 2390.0, 0.10673579079785005, 0.021896621145122558, 0.07065587713948081], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 4, 0, 0.0, 323.75, 252, 509, 267.0, 509.0, 509.0, 509.0, 0.02301893307245209, 0.035674850376935026, 0.051770119986188634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72405277-1ec8-4830-a19c-94ea5bf4354e", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6642fcb-e801-469f-9a2c-869fab909761", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 0.7465457128099173, 2.848979855371901], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 908.2272727272726, 244, 1897, 929.5, 1591.9999999999998, 1869.2499999999995, 1897.0, 0.12767093397091422, 0.07731209522510707, 0.05772621330911454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 141.68421052631578, 122, 382, 127.0, 157.0, 382.0, 382.0, 0.1247161067569874, 0.09268452855670645, 0.06260163952450343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 192.73684210526315, 122, 381, 127.0, 379.0, 381.0, 381.0, 0.12472020007745782, 0.11224561592086174, 0.06671915308419926], "isController": false}, {"data": ["login", 22, 1, 4.545454545454546, 6329.454545454547, 1802, 54185, 4198.0, 7375.999999999999, 47228.4499999999, 54185.0, 0.10252395332364016, 44.73848054549733, 0.21332154599131342], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 1475.733333333333, 129, 20131, 137.0, 8167.000000000007, 20131.0, 20131.0, 0.08237277524862849, 0.06668655339952444, 0.02928094745166091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0a3f71b-a09b-4afc-a104-bd2c37bebae0", 3, 0, 0.0, 416.0, 218, 539, 491.0, 539.0, 539.0, 539.0, 0.05204989850269792, 0.03346306951263945, 0.03337835288096188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 854.4210526315791, 253, 1764, 497.0, 1646.0, 1764.0, 1764.0, 0.12461222642697395, 62.88214373405455, 0.2668313098876522], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52fd1c8a-79b0-409f-84e4-de289f2ee7b5", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac531e2a-b44b-4b78-b38e-eba02af05d01", 3, 0, 0.0, 489.3333333333333, 222, 816, 430.0, 816.0, 816.0, 816.0, 0.08440243079000675, 0.03818990195250957, 0.05412525672406032], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, 42.857142857142854, 826.2857142857142, 127, 1775, 1188.5, 1611.5, 1775.0, 1775.0, 0.08723502361576711, 59.646241533529405, 0.1307856000679187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 550.3846153846155, 252, 1498, 495.0, 1445.6, 1498.0, 1498.0, 0.14559790339019119, 26.98873479971888, 0.32172192970421226], "isController": false}, {"data": ["register", 22, 8, 36.36363636363637, 21226.545454545452, 511, 60519, 1483.0, 59598.5, 60517.95, 60519.0, 0.09339486073552698, 0.03285900506879381, 0.042137134433411584], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 405.2, 252, 1710, 259.0, 1129.8000000000004, 1710.0, 1710.0, 0.08261003656870952, 6.708182369228313, 0.18438280492741332], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 8, 0, 0.0, 132.25, 126, 151, 129.5, 151.0, 151.0, 151.0, 0.10890280424720937, 0.084548563844269, 0.03871154369725021], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31aec8d6-ca7d-4190-aab2-d47f0fb93d31", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 448.17647058823525, 249, 1002, 501.0, 889.1999999999999, 1002.0, 1002.0, 0.11354300942406978, 8.156025001168825, 0.25365200445155384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 3, 0, 0.0, 129.33333333333334, 123, 135, 130.0, 135.0, 135.0, 135.0, 0.02274019329164298, 0.01689969442865264, 0.011414511085844228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 3, 0, 0.0, 234.66666666666669, 129, 380, 195.0, 380.0, 380.0, 380.0, 0.022697181766597314, 0.0060732693398902965, 0.01294448647626253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 3, 0, 0.0, 135.66666666666666, 121, 159, 127.0, 159.0, 159.0, 159.0, 0.022741744746656963, 0.0061296108887473845, 0.01336965853270263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0e176b0-6260-41b0-822f-d9d932965b7d", 3, 0, 0.0, 403.66666666666663, 226, 752, 233.0, 752.0, 752.0, 752.0, 0.020403860410389645, 0.024116672249389584, 0.013084506838693881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 3, 0, 0.0, 232.0, 127, 363, 206.0, 363.0, 363.0, 363.0, 0.022700273159953693, 0.006118433000143768, 0.013367446011183667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 136.0, 130, 147, 131.0, 147.0, 147.0, 147.0, 0.02810383429979297, 0.008288435506384254, 0.015771813259389023], "isController": false}, {"data": ["https://demoqa.com/books", 46, 0, 0.0, 1594.0652173913045, 1007, 2452, 1639.5, 2233.0, 2334.65, 2452.0, 0.21137374554277102, 252.87648507287798, 0.41738057957762015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, 36.36363636363637, 21226.545454545452, 511, 60519, 1483.0, 59598.5, 60517.95, 60519.0, 0.09126964371649988, 0.032111292440384326, 0.04117829628615522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 190.36363636363635, 121, 367, 128.0, 366.8, 367.0, 367.0, 0.059816417975377394, 0.01612239390742594, 0.03522392581948493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 128.0909090909091, 122, 155, 127.0, 149.60000000000002, 155.0, 155.0, 0.059885129433541115, 0.016140913792634128, 0.03520590617089038], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc34e5c2-1d8e-47d1-b89c-2ac1592a412a", 3, 0, 0.0, 987.3333333333334, 230, 1447, 1285.0, 1447.0, 1447.0, 1447.0, 0.06892115419959566, 0.03118502745359309, 0.04419748495221467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 8, 0, 0.0, 154.875, 120, 361, 126.5, 361.0, 361.0, 361.0, 0.10776587862867919, 0.02904627197413619, 0.06335454974068835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 8, 0, 0.0, 155.5, 121, 371, 125.5, 371.0, 371.0, 371.0, 0.10775136372819719, 0.029042359754865646, 0.06345124250791298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 192.1818181818182, 120, 375, 127.0, 374.8, 375.0, 375.0, 0.059813815903949887, 0.01600486870867409, 0.03411256688272142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 8, 0, 0.0, 131.5, 121, 142, 128.5, 142.0, 142.0, 142.0, 0.10810664720747017, 0.0803409751219578, 0.05426446939906217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 196.27272727272728, 124, 387, 130.0, 385.0, 387.0, 387.0, 0.059892954955053056, 0.04451029171952674, 0.030063455905173116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 8, 0, 0.0, 157.375, 122, 380, 126.0, 380.0, 380.0, 380.0, 0.10810664720747017, 0.028926973959811354, 0.061654572235510324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 3507.818181818182, 127, 37274, 131.0, 29846.400000000027, 37274.0, 37274.0, 0.057646553260174614, 0.045374142507520254, 0.020491548229202693], "isController": false}, {"data": ["deleteAccount", 13, 3, 23.076923076923077, 596.3076923076923, 128, 1348, 536.0, 1322.8, 1348.0, 1348.0, 0.10119172718710351, 0.020311320240680632, 0.06752449764145436], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4720a7ee-d39c-47a3-b982-3eac4da8d022", 3, 0, 0.0, 406.0, 232, 536, 450.0, 536.0, 536.0, 536.0, 0.04558993374262963, 0.02984419165248313, 0.029235732250319127], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8eb1bc51-ea30-48a6-8d36-d4d38e9a953d", 2, 0, 0.0, 268.0, 223, 313, 268.0, 313.0, 313.0, 313.0, 0.06673562681437485, 0.03828826245453635, 0.04148166647202109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 1, 4.545454545454546, 4495.227272727273, 379, 50141, 2182.5, 5749.199999999999, 43525.6999999999, 50141.0, 0.10328929453411834, 0.054404774899762434, 0.04750904074762669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 391.09090909090907, 251, 754, 259.0, 753.8, 754.0, 754.0, 0.0597712391664629, 0.0926337466378678, 0.13442691777379304], "isController": false}, {"data": ["addBook", 44, 15, 34.09090909090909, 1249.0227272727275, 645, 2536, 1014.0, 2221.5, 2410.5, 2536.0, 0.30334367459496725, 100.25114588719406, 1.09713649388142], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cb04046-5b14-4027-a54d-836715c34f8b", 1, 0, 0.0, 779.0, 779, 779, 779.0, 779.0, 779.0, 779.0, 1.2836970474967906, 0.23191792362002567, 0.8850489409499358], "isController": false}, {"data": ["https://demoqa.com/books-0", 46, 0, 0.0, 283.63043478260863, 123, 595, 135.0, 522.5, 539.0, 595.0, 0.21277284648439124, 0.15812513298302905, 0.1028540615329821], "isController": false}, {"data": ["https://demoqa.com/books-3", 46, 0, 0.0, 826.7391304347824, 593, 1252, 749.5, 1092.9, 1139.2, 1252.0, 0.21270889400623327, 62.543477437828884, 0.10697761759102553], "isController": false}, {"data": ["https://demoqa.com/books-1", 46, 0, 0.0, 191.9782608695652, 122, 516, 127.5, 380.3, 469.84999999999985, 516.0, 0.2131998516870597, 0.3772638000556174, 0.10368508412124583], "isController": false}, {"data": ["https://demoqa.com/books-2", 46, 0, 0.0, 1308.6521739130435, 878, 1888, 1314.0, 1751.3, 1788.1, 1888.0, 0.21192297060720539, 190.68866147321017, 0.10637539735556989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 147.0588235294118, 124, 365, 131.0, 194.59999999999985, 365.0, 365.0, 0.11087052930895051, 0.08282808097787807, 0.039411008465291004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 134, 15, 11.194029850746269, 2026.3507462686573, 121, 42582, 133.5, 577.0, 18377.0, 40571.600000000035, 0.5688523615863339, 1.3368834757409938, 0.2681046749369593], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 3, 0, 0.0, 132.33333333333334, 130, 135, 132.0, 135.0, 135.0, 135.0, 0.02234903228690198, 0.017307404886243424, 0.007944382570734687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 129.6923076923077, 123, 137, 129.0, 136.6, 137.0, 137.0, 0.13668527689282822, 0.11092330575970728, 0.04858734452049754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec5c9b70-af51-4133-abce-9e85adfe0dcd", 1, 0, 0.0, 1521.0, 1521, 1521, 1521.0, 1521.0, 1521.0, 1521.0, 0.6574621959237344, 0.20995130670611442, 0.39229433760683763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac531e2a-b44b-4b78-b38e-eba02af05d01", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 0.6251351643598616, 2.3856509515570936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 3, 0, 0.0, 369.0, 265, 504, 338.0, 504.0, 504.0, 504.0, 0.022674708629994104, 0.03514136972246156, 0.05099595114734025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f33b3a42-e193-4f77-99a5-4dc1596f218f", 1, 0, 0.0, 1024.0, 1024, 1024, 1024.0, 1024.0, 1024.0, 1024.0, 0.9765625, 0.17642974853515625, 0.6732940673828125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e1c0680-775e-4408-84e4-2bdc2f5f6dd8", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 1.2142050855513307, 2.268744058935361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 8, 0, 0.0, 321.12499999999994, 249, 516, 256.5, 516.0, 516.0, 516.0, 0.10756736406174366, 0.16670840504490939, 0.2419215228849567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0a3f71b-a09b-4afc-a104-bd2c37bebae0", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 4, 0, 0.0, 9122.5, 132, 35787, 285.5, 35787.0, 35787.0, 35787.0, 0.023721275018532245, 0.0196673461823573, 0.008432171979243884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 135.26315789473682, 127, 158, 133.0, 151.0, 158.0, 158.0, 0.12249687310613387, 0.09510255285095355, 0.043543810361946024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6642fcb-e801-469f-9a2c-869fab909761", 3, 0, 0.0, 314.3333333333333, 234, 467, 242.0, 467.0, 467.0, 467.0, 0.07970032677133976, 0.03606232233468824, 0.05110991007146463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 149.88235294117646, 121, 484, 129.0, 211.99999999999977, 484.0, 484.0, 0.11383191713036434, 0.08459578997676491, 0.05713828652832741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 208.41176470588235, 120, 488, 128.0, 401.5999999999999, 488.0, 488.0, 0.11384411392447447, 0.040520342938651414, 0.06436430200164739], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31aec8d6-ca7d-4190-aab2-d47f0fb93d31", 3, 0, 0.0, 485.33333333333337, 259, 884, 313.0, 884.0, 884.0, 884.0, 0.09651578033008397, 0.04480192146832674, 0.06189325756844578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 244.88235294117646, 119, 871, 128.0, 477.39999999999964, 871.0, 871.0, 0.11365307732420543, 6.044433391357686, 0.06624104564173876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52fd1c8a-79b0-409f-84e4-de289f2ee7b5", 2, 0, 0.0, 312.0, 254, 370, 312.0, 370.0, 370.0, 370.0, 0.03368591255137102, 0.038028237216196185, 0.020938557948191067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 200.70588235294122, 122, 640, 127.0, 428.79999999999984, 640.0, 640.0, 0.11384563870751717, 1.9979621839946426, 0.06646445462916457], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 16.666666666666668, 0.5550416281221091], "isController": false}, {"data": ["504/Gateway Time-out", 2, 5.555555555555555, 0.18501387604070305], "isController": false}, {"data": ["502/Bad Gateway", 1, 2.7777777777777777, 0.09250693802035152], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.333333333333334, 0.27752081406105455], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.333333333333334, 0.27752081406105455], "isController": false}, {"data": ["401/Unauthorized", 21, 58.333333333333336, 1.942645698427382], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1081, 36, "401/Unauthorized", 21, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "504/Gateway Time-out", 2], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, "406/Not Acceptable", 6, "504/Gateway Time-out", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 134, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
