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

    var data = {"OkPercent": 98.09802487198245, "KoPercent": 1.9019751280175567};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7567823343848581, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3363d8c9-86c9-4424-9d92-793e24063c65"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/76ef7f6c-600b-418d-9b74-ecb9525fc102"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d31da029-8758-4df5-88d6-c575cf817eeb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85458e5f-2bfb-415b-9461-f80256ae8d58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7d7d0a83-ebfe-4415-af71-07f02600e9cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ce27632b-d799-4b2b-8323-00e92e8bacb3"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=410b65eb-de31-46bd-a246-3bffb0a8b332"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5e5356d8-0c56-40f6-8abd-6f9034dc12b4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d31da029-8758-4df5-88d6-c575cf817eeb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=242bea9b-7fdb-4a1f-a7fb-3da4fdd0a44b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/25b5eb4b-6c58-420e-a6a9-bbd1a54dfb76"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a4af3e71-8ed4-4bb8-844b-e1a66332dda6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82b9e061-9916-4151-858d-44ab898df5f5"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0dd0c7d4-a707-4083-b9e3-41513d0b16e2"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76ef7f6c-600b-418d-9b74-ecb9525fc102"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3620689655172414, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/85458e5f-2bfb-415b-9461-f80256ae8d58"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "addBook"], "isController": true}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9655172413793104, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.47413793103448276, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9293478260869565, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e7de9da2-c9ec-4d03-9496-2d3ada05c132"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/242bea9b-7fdb-4a1f-a7fb-3da4fdd0a44b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e5356d8-0c56-40f6-8abd-6f9034dc12b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/410b65eb-de31-46bd-a246-3bffb0a8b332"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4af3e71-8ed4-4bb8-844b-e1a66332dda6"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25b5eb4b-6c58-420e-a6a9-bbd1a54dfb76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce27632b-d799-4b2b-8323-00e92e8bacb3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82b9e061-9916-4151-858d-44ab898df5f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0dd0c7d4-a707-4083-b9e3-41513d0b16e2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1367, 26, 1.9019751280175567, 392.53328456474037, 125, 4011, 139.0, 1017.4000000000001, 1213.799999999997, 1842.7999999999975, 5.3734699172163305, 746.5134947564937, 3.9427216716031572], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1922.344827586207, 1519, 2946, 1827.0, 2422.8, 2596.5499999999997, 2946.0, 0.2666372446258804, 320.85385100465925, 1.3110532487219801], "isController": true}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 624.5714285714286, 129, 1403, 592.0, 1213.5, 1403.0, 1403.0, 0.08944886719398903, 0.01762022886131592, 0.06018581005533051], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 624.5714285714286, 129, 1403, 592.0, 1213.5, 1403.0, 1403.0, 0.08871146595697493, 0.017474970693533567, 0.05968964848081615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 161.93333333333337, 126, 390, 128.0, 383.4, 390.0, 390.0, 0.10852107479272474, 0.02903786571602205, 0.06189092546772583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3363d8c9-86c9-4424-9d92-793e24063c65", 2, 0, 0.0, 249.5, 234, 265, 249.5, 265.0, 265.0, 265.0, 0.022310970304098524, 0.03179966910042168, 0.013868098240779992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 128.8, 126, 132, 129.0, 132.0, 132.0, 132.0, 0.10872716729486807, 0.0808021233509713, 0.05457594139605682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 195.66666666666666, 126, 390, 128.0, 388.8, 390.0, 390.0, 0.10872953166566393, 0.029306006581760986, 0.06402725351015172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 178.66666666666666, 126, 385, 128.0, 381.4, 385.0, 385.0, 0.10852971181743856, 0.029252148888293982, 0.06380360011142383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76ef7f6c-600b-418d-9b74-ecb9525fc102", 3, 0, 0.0, 613.0, 231, 1054, 554.0, 1054.0, 1054.0, 1054.0, 0.027027270515950594, 0.027106451972540295, 0.017331941053523005], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 252.0714285714286, 126, 436, 233.0, 397.5, 436.0, 436.0, 0.09019688691887434, 0.19496520171889495, 0.058298294795639624], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 128.79999999999998, 126, 131, 129.0, 131.0, 131.0, 131.0, 0.08153104430396947, 0.06059094210480544, 0.040924762472890924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 131.4, 126, 161, 127.0, 153.20000000000002, 161.0, 161.0, 0.08152971486341055, 0.02997915556956659, 0.04604093403159005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 760.0000000000001, 624, 988, 653.0, 988.0, 988.0, 988.0, 0.10551067165078983, 31.023640749351866, 0.060174054925841075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1007.9999999999999, 870, 1171, 914.0, 1171.0, 1171.0, 1171.0, 0.10507039716610128, 94.54252806411546, 0.05982035307405962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 331.7142857142857, 132, 476, 392.0, 476.0, 476.0, 476.0, 0.10629735926988901, 0.1880964990205458, 0.058858010455104554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 147.75000000000003, 127, 387, 130.5, 228.10000000000016, 387.0, 387.0, 0.08218319661816145, 0.061075598267989126, 0.04125211236497557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 160.75, 126, 379, 131.0, 376.9, 379.0, 379.0, 0.08218193024808669, 0.021990086804663824, 0.046869382094611944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d31da029-8758-4df5-88d6-c575cf817eeb", 1, 0, 0.0, 800.0, 800, 800, 800.0, 800.0, 800.0, 800.0, 1.25, 0.225830078125, 0.86181640625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 159.87499999999997, 125, 382, 128.5, 377.1, 382.0, 382.0, 0.08218361875019262, 0.022151053491262854, 0.04831497899181245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 193.87500000000003, 128, 387, 132.0, 384.2, 387.0, 387.0, 0.08218361875019262, 0.022151053491262854, 0.04839523643199819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85458e5f-2bfb-415b-9461-f80256ae8d58", 1, 0, 0.0, 744.0, 744, 744, 744.0, 744.0, 744.0, 744.0, 1.3440860215053765, 0.24282804099462366, 0.9266843077956989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 168.14285714285714, 126, 396, 131.0, 396.0, 396.0, 396.0, 0.10629735926988901, 0.07899637734803275, 0.05968845857440056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 205.73333333333332, 126, 1257, 129.0, 597.6000000000004, 1257.0, 1257.0, 0.08152927172619209, 4.911188508245327, 0.04746319972497459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 694.1111111111111, 125, 1266, 872.0, 1174.2, 1266.0, 1266.0, 0.08634294458222007, 43.17230611511913, 0.04663793165476253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 243.86666666666665, 126, 1290, 130.0, 757.2000000000003, 1290.0, 1290.0, 0.08152882859379076, 1.6186551038405512, 0.04754255974704322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 578.888888888889, 125, 1048, 653.0, 922.0000000000002, 1048.0, 1048.0, 0.08634501549413333, 14.114955346435389, 0.04672337155699251], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 559.1538461538461, 130, 951, 568.0, 890.5999999999999, 951.0, 951.0, 0.08577404477405137, 0.017004034266730885, 0.058196452253548074], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 374.1875, 258, 762, 268.0, 591.9000000000002, 762.0, 762.0, 0.08212709167436608, 0.12728095164767478, 0.18470575402936043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 434.7142857142857, 166, 994, 396.0, 819.2000000000003, 982.2999999999998, 994.0, 0.09891988902130545, 0.060762314642969856, 0.04472647325865667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 143.05555555555554, 126, 383, 128.0, 158.00000000000034, 383.0, 383.0, 0.08634335875665564, 0.06416728126349115, 0.04334031875089941], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d7d0a83-ebfe-4415-af71-07f02600e9cd", 1, 0, 0.0, 957.0, 957, 957, 957.0, 957.0, 957.0, 957.0, 1.0449320794148382, 0.33368436520376177, 0.6234897466039707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 197.99999999999997, 125, 383, 130.5, 379.4, 383.0, 383.0, 0.08634211624526916, 0.09514871230327188, 0.04521343891055436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce27632b-d799-4b2b-8323-00e92e8bacb3", 3, 0, 0.0, 437.33333333333337, 235, 820, 257.0, 820.0, 820.0, 820.0, 0.022817679137795963, 0.02696972426736235, 0.014632430957505875], "isController": false}, {"data": ["login", 21, 0, 0.0, 2696.3333333333335, 1361, 4666, 2650.0, 3878.6000000000004, 4590.699999999999, 4666.0, 0.0988221342757514, 39.54143165772954, 0.20372414595323363], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=410b65eb-de31-46bd-a246-3bffb0a8b332", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 0.72265625, 2.7578125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 153.06666666666666, 129, 448, 131.0, 264.4000000000001, 448.0, 448.0, 0.07841497203199331, 0.06348243341261958, 0.02787407208949762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e5356d8-0c56-40f6-8abd-6f9034dc12b4", 3, 0, 0.0, 698.6666666666666, 229, 1108, 759.0, 1108.0, 1108.0, 1108.0, 0.01766441151013054, 0.02435181729993582, 0.011327763891587619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d31da029-8758-4df5-88d6-c575cf817eeb", 3, 0, 0.0, 512.6666666666666, 278, 824, 436.0, 824.0, 824.0, 824.0, 0.04099928934565134, 0.03417942057754332, 0.026291861982725633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=242bea9b-7fdb-4a1f-a7fb-3da4fdd0a44b", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25b5eb4b-6c58-420e-a6a9-bbd1a54dfb76", 3, 0, 0.0, 558.6666666666666, 286, 1031, 359.0, 1031.0, 1031.0, 1031.0, 0.026441968692709067, 0.02651943539786349, 0.016956601017134396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4af3e71-8ed4-4bb8-844b-e1a66332dda6", 3, 0, 0.0, 942.3333333333334, 357, 1368, 1102.0, 1368.0, 1368.0, 1368.0, 0.024702336841065164, 0.024774706968529223, 0.01584101678935494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82b9e061-9916-4151-858d-44ab898df5f5", 1, 0, 0.0, 951.0, 951, 951, 951.0, 951.0, 951.0, 951.0, 1.0515247108307044, 0.18997272607781285, 0.7249769978969506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 859.2222222222222, 257, 1396, 1013.0, 1304.2, 1396.0, 1396.0, 0.08628830841358945, 57.409888640144196, 0.18179905430410875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0dd0c7d4-a707-4083-b9e3-41513d0b16e2", 1, 0, 0.0, 664.0, 664, 664, 664.0, 664.0, 664.0, 664.0, 1.5060240963855422, 0.2720844314759036, 1.0383330195783131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 394.80000000000007, 256, 521, 503.0, 520.4, 521.0, 521.0, 0.10841988854435458, 0.16802965148426827, 0.2438388704273912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 806.3636363636363, 126, 1306, 1041.0, 1305.2, 1306.0, 1306.0, 0.13507042080575643, 102.84389427976768, 0.22636046995297096], "isController": false}, {"data": ["register", 22, 8, 36.36363636363637, 748.5909090909091, 148, 1238, 904.0, 1179.3, 1230.9499999999998, 1238.0, 0.08846995238708016, 0.027552609461459272, 0.03991515429963969], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 161.87499999999997, 131, 382, 134.0, 334.40000000000003, 382.0, 382.0, 0.0824899594252512, 0.0640424977959714, 0.029322602764444768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 374.0666666666667, 255, 1417, 260.0, 887.2000000000003, 1417.0, 1417.0, 0.08147170487689626, 6.61574642678681, 0.18184208712855693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 438.21052631578954, 255, 1555, 282.0, 540.0, 1555.0, 1555.0, 0.08455831631040912, 5.448422278112302, 0.18903494900911005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76ef7f6c-600b-418d-9b74-ecb9525fc102", 1, 0, 0.0, 712.0, 712, 712, 712.0, 712.0, 712.0, 712.0, 1.4044943820224718, 0.25374166081460675, 0.9683330407303371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 130.77777777777777, 127, 134, 132.0, 134.0, 134.0, 134.0, 0.06046355391333558, 0.04493434035942224, 0.03034986983540477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 129.22222222222223, 126, 132, 129.0, 132.0, 132.0, 132.0, 0.060461929138619044, 0.026268398900936487, 0.03391798759186854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 242.77777777777777, 125, 1155, 128.0, 1155.0, 1155.0, 1155.0, 0.06046314771146986, 6.059468917323364, 0.03496837861351284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 217.22222222222223, 127, 917, 130.0, 917.0, 917.0, 917.0, 0.06046233532411171, 1.9898117815898906, 0.03502695402511202], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 139.0, 130, 148, 139.0, 148.0, 148.0, 148.0, 0.044387234231435035, 0.013090766345599006, 0.027438593035642948], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1276.5344827586207, 1000, 2153, 1060.5, 1838.1000000000001, 2076.5499999999997, 2153.0, 0.25331603796246555, 303.0540483069317, 0.5002002233985404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, 36.36363636363637, 748.5909090909091, 148, 1238, 904.0, 1179.3, 1230.9499999999998, 1238.0, 0.0913803415963315, 0.028459005532664318, 0.04122824005615737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 186.9230769230769, 126, 385, 129.0, 382.6, 385.0, 385.0, 0.07259001161440186, 0.01956527656794425, 0.04274587597996516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 130.23076923076925, 125, 139, 128.0, 139.0, 139.0, 139.0, 0.07269229908966875, 0.01959284623901228, 0.042735121144512285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 214.24999999999997, 127, 1165, 132.0, 622.5000000000006, 1165.0, 1165.0, 0.08603954592629638, 4.860399366332188, 0.05011971596194901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 240.50000000000003, 126, 920, 132.0, 683.4000000000002, 920.0, 920.0, 0.08616186583520466, 1.6051749456103221, 0.0502751121450535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 149.4375, 127, 390, 132.0, 229.70000000000016, 390.0, 390.0, 0.08614516537179714, 0.0640199910624391, 0.04324083496201536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 186.61538461538458, 126, 382, 129.0, 381.2, 382.0, 382.0, 0.07258960628514313, 0.019423390744266817, 0.041398759834495695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 180.0, 127, 593, 131.0, 490.8000000000001, 593.0, 593.0, 0.08601318152006796, 0.031089481259878076, 0.048602907379930976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 171.0769230769231, 127, 392, 132.0, 388.0, 392.0, 392.0, 0.07268579607720349, 0.05401747149878111, 0.03648486248406504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 154.76923076923077, 129, 379, 132.0, 291.3999999999999, 379.0, 379.0, 0.07367400950961446, 0.05798950357885669, 0.026188808067870765], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 675.2307692307694, 127, 1412, 580.0, 1288.0, 1412.0, 1412.0, 0.0852224305437191, 0.016536173234256796, 0.05799504193926919], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1425.4761904761906, 875, 4011, 1227.0, 2029.2, 3814.199999999997, 4011.0, 0.09977763840583842, 0.05164272300302184, 0.04589381610268545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 380.38461538461536, 255, 770, 269.0, 766.8, 770.0, 770.0, 0.07253169076950544, 0.11240995434688002, 0.16312547250212014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85458e5f-2bfb-415b-9461-f80256ae8d58", 3, 0, 0.0, 323.0, 239, 464, 266.0, 464.0, 464.0, 464.0, 0.03434852301351042, 0.028634950337760475, 0.022026884875200367], "isController": false}, {"data": ["addBook", 63, 10, 15.873015873015873, 1175.9682539682537, 664, 3978, 1023.0, 1923.6000000000001, 2179.9999999999995, 3978.0, 0.29907429385236173, 80.6702561268692, 1.0900551492404462], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 227.81034482758608, 127, 770, 132.0, 511.1, 535.8999999999995, 770.0, 0.254287818736628, 0.18897756841657606, 0.12292233425256918], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 753.8448275862067, 623, 1073, 649.0, 971.9000000000001, 1033.2, 1073.0, 0.2544618570450836, 74.8202349001018, 0.1279764222443536], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 223.31034482758622, 125, 518, 132.0, 401.3, 509.15, 518.0, 0.25502913048257664, 0.451282016049247, 0.12402783884797185], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1039.4655172413793, 872, 2011, 908.5, 1280.0, 1822.0499999999995, 2011.0, 0.25419977472640654, 228.7294041343621, 0.12759637129821577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 146.15789473684208, 127, 386, 134.0, 143.0, 386.0, 386.0, 0.08376169357327384, 0.06257587459331493, 0.029774664512374687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 10, 5.434782608695652, 198.1413043478262, 127, 2152, 134.0, 321.0, 392.0, 1211.9000000000062, 0.740889873162875, 1.5637897624320516, 0.3572248716529092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 189.66666666666666, 129, 395, 134.0, 395.0, 395.0, 395.0, 0.06571069770158582, 0.050887288356794486, 0.023358099573610583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 132.53333333333333, 128, 139, 132.0, 138.4, 139.0, 139.0, 0.10516205472633328, 0.08534147214607711, 0.03738182414100128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7de9da2-c9ec-4d03-9496-2d3ada05c132", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.6336030505952381, 1.1838882688492063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/242bea9b-7fdb-4a1f-a7fb-3da4fdd0a44b", 3, 0, 0.0, 650.3333333333333, 237, 1412, 302.0, 1412.0, 1412.0, 1412.0, 0.032062928841673256, 0.03196899447983242, 0.020561188091828227], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e5356d8-0c56-40f6-8abd-6f9034dc12b4", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.3296789461678832, 1.2581261405109487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/410b65eb-de31-46bd-a246-3bffb0a8b332", 3, 0, 0.0, 307.6666666666667, 223, 469, 231.0, 469.0, 469.0, 469.0, 0.10149536504499629, 0.0459240095743961, 0.06508654594356858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 375.88888888888886, 256, 1287, 264.0, 1287.0, 1287.0, 1287.0, 0.0604099824139829, 8.113370029600892, 0.13414608182532117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4af3e71-8ed4-4bb8-844b-e1a66332dda6", 1, 0, 0.0, 717.0, 717, 717, 717.0, 717.0, 717.0, 717.0, 1.3947001394700138, 0.2519721931659693, 0.9615803695955369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 428.5, 256, 1555, 272.5, 976.1000000000006, 1555.0, 1555.0, 0.08593833924159415, 6.550621584286712, 0.19190308102374046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25b5eb4b-6c58-420e-a6a9-bbd1a54dfb76", 1, 0, 0.0, 568.0, 568, 568, 568.0, 568.0, 568.0, 568.0, 1.7605633802816902, 0.31807053257042256, 1.2138259242957747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce27632b-d799-4b2b-8323-00e92e8bacb3", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 168.75000000000003, 128, 397, 138.0, 394.9, 397.0, 397.0, 0.08359412960224868, 0.06930802346905188, 0.029715100757049334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 139.94444444444446, 127, 300, 130.0, 152.40000000000023, 300.0, 300.0, 0.08739815686998068, 0.0678530612418307, 0.03106731357487594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82b9e061-9916-4151-858d-44ab898df5f5", 3, 0, 0.0, 342.3333333333333, 223, 505, 299.0, 505.0, 505.0, 505.0, 0.04140443855581318, 0.03451717680385337, 0.026551674464502593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 142.10526315789477, 126, 379, 129.0, 134.0, 379.0, 379.0, 0.08470118314178977, 0.062946875362209, 0.04251602356921869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 183.6315789473684, 125, 394, 130.0, 389.0, 394.0, 394.0, 0.08470269354565475, 0.029360349777543978, 0.04793259950337474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 251.15789473684208, 125, 1176, 131.0, 395.0, 1176.0, 1176.0, 0.0847019383369889, 4.032941565971665, 0.04941236637154728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0dd0c7d4-a707-4083-b9e3-41513d0b16e2", 3, 0, 0.0, 959.3333333333334, 231, 2067, 580.0, 2067.0, 2067.0, 2067.0, 0.0187812237845418, 0.025891433179535978, 0.012043948846206819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 237.57894736842107, 126, 626, 130.0, 412.0, 626.0, 626.0, 0.0846076431873035, 1.3309439791642546, 0.049439982288057856], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 30.76923076923077, 0.5852231163130943], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.6923076923076925, 0.14630577907827358], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.6923076923076925, 0.14630577907827358], "isController": false}, {"data": ["401/Unauthorized", 14, 53.84615384615385, 1.024140453547915], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1367, 26, "401/Unauthorized", 14, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
