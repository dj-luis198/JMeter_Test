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

    var data = {"OkPercent": 98.72509960159363, "KoPercent": 1.2749003984063745};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7980900409276944, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13b73383-c452-4f6f-870b-5ea605304555"], "isController": false}, {"data": [0.125, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7cbd5b3b-88c1-4699-85ff-4a47d69447d7"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87166e87-d365-4536-b892-f17d464ee5e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e415a6a6-fc33-4e82-8fed-133df5c1bc62"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40206547-cf1b-45f9-bc4c-7c7a15634c23"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10f2e83c-5062-434a-8e34-b64239d4e6f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14fb96e2-87f4-49cc-9769-3735fb3fa7ef"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=973004ea-8fba-4885-835d-bf64810e279c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d10e547a-006d-47d6-907e-71ddbcaf8928"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4e14b098-48c9-4106-9428-14f276d7c3e6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5a6b68ba-ec25-4e56-affe-26edd0f0e99d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7ac6f20-5136-431e-bae7-dbc50c9aa821"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7b042af-77de-40e6-b66e-bf1938f7711e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59696075-0085-4613-8b16-ed3a70b26959"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/10f2e83c-5062-434a-8e34-b64239d4e6f7"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e14b098-48c9-4106-9428-14f276d7c3e6"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c7b042af-77de-40e6-b66e-bf1938f7711e"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.49038461538461536, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7efe1a05-cc96-43c6-ab0c-dfe8bdf072ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87166e87-d365-4536-b892-f17d464ee5e4"], "isController": false}, {"data": [0.3103448275862069, 500, 1500, "addBook"], "isController": true}, {"data": [0.9903846153846154, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/40206547-cf1b-45f9-bc4c-7c7a15634c23"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/14fb96e2-87f4-49cc-9769-3735fb3fa7ef"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/13b73383-c452-4f6f-870b-5ea605304555"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7efe1a05-cc96-43c6-ab0c-dfe8bdf072ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/973004ea-8fba-4885-835d-bf64810e279c"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a6b68ba-ec25-4e56-affe-26edd0f0e99d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d7ac6f20-5136-431e-bae7-dbc50c9aa821"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7cbd5b3b-88c1-4699-85ff-4a47d69447d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d10e547a-006d-47d6-907e-71ddbcaf8928"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59696075-0085-4613-8b16-ed3a70b26959"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1255, 16, 1.2749003984063745, 351.3035856573709, 105, 2674, 144.0, 883.8000000000002, 1018.2, 1507.6800000000012, 4.875092743298205, 681.6444716011281, 3.560761488029802], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13b73383-c452-4f6f-870b-5ea605304555", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["see books", 52, 0, 0.0, 1657.7115384615383, 1300, 2123, 1695.5, 1921.6000000000001, 1951.5, 2123.0, 0.23430705940134547, 281.9509850471543, 1.152085980552514], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7cbd5b3b-88c1-4699-85ff-4a47d69447d7", 3, 0, 0.0, 569.6666666666666, 257, 1044, 408.0, 1044.0, 1044.0, 1044.0, 0.0167123470820242, 0.023039319626423332, 0.010717227783719946], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 493.2142857142857, 381, 726, 456.0, 718.5, 726.0, 726.0, 0.07520574142117364, 0.013586974768473753, 0.05111640237220395], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 493.2142857142857, 381, 726, 456.0, 718.5, 726.0, 726.0, 0.07630800089389372, 0.01378611344274447, 0.051865594357568386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 139.875, 107, 335, 112.0, 335.0, 335.0, 335.0, 0.08185692432838952, 0.02190312233005735, 0.046684027156034646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87166e87-d365-4536-b892-f17d464ee5e4", 3, 0, 0.0, 310.0, 261, 383, 286.0, 383.0, 383.0, 383.0, 0.01862232071360733, 0.02567237246814031, 0.011942048113869282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 127.37500000000004, 108, 328, 114.5, 187.30000000000013, 328.0, 328.0, 0.08186278773490784, 0.06083748190064927, 0.041091282124748656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 139.43749999999997, 108, 332, 113.0, 321.5, 332.0, 332.0, 0.08185650554577825, 0.022062886260385543, 0.048202610199320595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 183.4375, 110, 343, 115.5, 338.1, 343.0, 343.0, 0.08185524922365411, 0.022062547642313024, 0.04812193362562478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e415a6a6-fc33-4e82-8fed-133df5c1bc62", 2, 0, 0.0, 193.0, 190, 196, 193.0, 196.0, 196.0, 196.0, 0.10611768451212394, 0.062333776595744676, 0.06596084589059266], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 278.7333333333333, 196, 946, 211.0, 574.6000000000003, 946.0, 946.0, 0.07370753831563533, 0.1533702234444024, 0.04765077184077206], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40206547-cf1b-45f9-bc4c-7c7a15634c23", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 147.1052631578948, 109, 340, 113.0, 331.0, 340.0, 340.0, 0.09260477743172835, 0.06882054260307155, 0.046483257421785516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 125.89473684210526, 109, 337, 112.0, 147.0, 337.0, 337.0, 0.09259123891950898, 0.032094742766918614, 0.05239666634990717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 663.0, 547, 797, 658.0, 797.0, 797.0, 797.0, 0.05302789267154523, 15.591961137183159, 0.030242470039240642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 882.5, 755, 1016, 874.5, 1016.0, 1016.0, 1016.0, 0.05290865321023253, 47.6072991620592, 0.03012279767731012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 263.1666666666667, 109, 340, 334.0, 340.0, 340.0, 340.0, 0.05333475559348249, 0.09437751673377957, 0.02953203752100056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10f2e83c-5062-434a-8e34-b64239d4e6f7", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 128.06666666666666, 110, 334, 114.0, 203.80000000000007, 334.0, 334.0, 0.08837565545277794, 0.06567761113238674, 0.04436043642844518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 126.86666666666667, 107, 337, 112.0, 204.4000000000001, 337.0, 337.0, 0.08849192068764121, 0.023678502215247747, 0.05046804851717038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 133.93333333333334, 110, 439, 112.0, 244.6000000000001, 439.0, 439.0, 0.08849192068764121, 0.023851337997840796, 0.052023570560507826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 163.86666666666667, 110, 449, 112.0, 382.40000000000003, 449.0, 449.0, 0.08849296480929766, 0.02385161942125601, 0.05211060330078759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 113.0, 110, 117, 113.0, 117.0, 117.0, 117.0, 0.053333807411621435, 0.0396357689846132, 0.029948182872736647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 207.57894736842104, 109, 1007, 114.0, 341.0, 1007.0, 1007.0, 0.0925042357202672, 4.40443494670052, 0.053963973860250446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 632.2, 106, 1122, 771.0, 1060.2, 1122.0, 1122.0, 0.09213419652838348, 55.27661900897387, 0.048886308704838885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 192.84210526315786, 107, 774, 113.0, 342.0, 774.0, 774.0, 0.09250378535226902, 1.4551564318125387, 0.0540540468580359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 506.5333333333334, 110, 793, 550.0, 784.6, 793.0, 793.0, 0.09200534857759732, 18.04335100347167, 0.048907791089588676], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 419.07142857142856, 192, 915, 419.5, 702.0, 915.0, 915.0, 0.07640169830060793, 0.013803041196887177, 0.052675389648661336], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 309.26666666666665, 224, 784, 229.0, 584.8000000000002, 784.0, 784.0, 0.0883173773271629, 0.13687468536934327, 0.19862785154732043], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14fb96e2-87f4-49cc-9769-3735fb3fa7ef", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 516.6190476190475, 175, 1477, 461.0, 878.4000000000001, 1420.3999999999992, 1477.0, 0.09329311363545495, 0.05730602390302847, 0.04218233555978089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 126.86666666666666, 107, 318, 113.0, 197.4000000000001, 318.0, 318.0, 0.09213023530062096, 0.06846787994509039, 0.04624505951613201], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=973004ea-8fba-4885-835d-bf64810e279c", 1, 0, 0.0, 915.0, 915, 915, 915.0, 915.0, 915.0, 915.0, 1.092896174863388, 0.19744706284153005, 0.7535006830601093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 260.4666666666667, 110, 344, 329.0, 342.8, 344.0, 344.0, 0.09200986345736262, 0.11674949471249983, 0.047322781335492496], "isController": false}, {"data": ["login", 21, 0, 0.0, 2442.857142857142, 1386, 4307, 2333.0, 3581.6000000000004, 4239.399999999999, 4307.0, 0.09298865538404315, 31.911246894843114, 0.18435571730784558], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 120.3157894736842, 113, 144, 117.0, 132.0, 144.0, 144.0, 0.09088213065980427, 0.07357547491892356, 0.0323057573829773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d10e547a-006d-47d6-907e-71ddbcaf8928", 3, 0, 0.0, 509.3333333333333, 228, 898, 402.0, 898.0, 898.0, 898.0, 0.030731092695219266, 0.025619247523586113, 0.019707113479681626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 779.2666666666667, 228, 1240, 893.0, 1175.2, 1240.0, 1240.0, 0.09194162319871037, 73.3769274699351, 0.19109611462362167], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e14b098-48c9-4106-9428-14f276d7c3e6", 3, 0, 0.0, 565.6666666666667, 210, 1204, 283.0, 1204.0, 1204.0, 1204.0, 0.07133346014837359, 0.03227653307494769, 0.04574443896233594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a6b68ba-ec25-4e56-affe-26edd0f0e99d", 3, 0, 0.0, 1042.0, 308, 1710, 1108.0, 1710.0, 1710.0, 1710.0, 0.022283129442698932, 0.026729600259227073, 0.014289637044959927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7ac6f20-5136-431e-bae7-dbc50c9aa821", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 338.31249999999994, 223, 665, 242.5, 520.1000000000001, 665.0, 665.0, 0.08180962899333252, 0.12678894649650263, 0.18399177301918437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 0, 0.0, 1003.1666666666667, 878, 1130, 1000.0, 1130.0, 1130.0, 1130.0, 0.05285691632750145, 63.235247965008725, 0.11918615214863365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7b042af-77de-40e6-b66e-bf1938f7711e", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59696075-0085-4613-8b16-ed3a70b26959", 3, 0, 0.0, 280.0, 187, 442, 211.0, 442.0, 442.0, 442.0, 0.0242598717461447, 0.02867434710620163, 0.015557274524708679], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 921.7826086956521, 416, 1744, 864.0, 1718.8000000000002, 1744.0, 1744.0, 0.0923472255681362, 0.029093767566048343, 0.041664470910623946], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/10f2e83c-5062-434a-8e34-b64239d4e6f7", 3, 0, 0.0, 308.3333333333333, 196, 468, 261.0, 468.0, 468.0, 468.0, 0.029876609602342327, 0.024906900127473534, 0.019159153944210413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 379.7894736842106, 224, 1117, 230.0, 681.0, 1117.0, 1117.0, 0.09245067270028952, 5.956957597377321, 0.20667876280320172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 136.15384615384613, 110, 336, 117.0, 255.5999999999999, 336.0, 336.0, 0.10138428543575746, 0.07871143254045623, 0.03603894521349191], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e14b098-48c9-4106-9428-14f276d7c3e6", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 0.9409586588541666, 3.590901692708333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 453.29411764705884, 226, 1113, 444.0, 1110.6, 1113.0, 1113.0, 0.09122863505862781, 12.96488976260431, 0.20242925588290536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 113.0, 109, 115, 114.0, 114.8, 115.0, 115.0, 0.056935817805383024, 0.04231265366200829, 0.028579111671842652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 153.09090909090907, 109, 342, 113.0, 339.8, 342.0, 342.0, 0.056935523108058446, 0.023008744778753733, 0.03203634103860746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7b042af-77de-40e6-b66e-bf1938f7711e", 3, 0, 0.0, 265.6666666666667, 196, 403, 198.0, 403.0, 403.0, 403.0, 0.04558092893933178, 0.029304145395566496, 0.029229957685704303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 252.63636363636365, 110, 976, 113.0, 849.2000000000005, 976.0, 976.0, 0.05668203952284029, 4.650488600790972, 0.03288001120758509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 212.36363636363637, 105, 777, 113.0, 690.0000000000002, 777.0, 777.0, 0.05674051530704356, 1.5305935348051478, 0.03296934239032316], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1061.519230769231, 846, 1618, 905.0, 1444.1000000000001, 1488.25, 1618.0, 0.22685827465556807, 271.40136518510764, 0.44795647593120963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 921.7826086956521, 416, 1744, 864.0, 1718.8000000000002, 1744.0, 1744.0, 0.0931917359189313, 0.029359828486687764, 0.04204549022904908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 250.75, 111, 446, 223.0, 446.0, 446.0, 446.0, 0.025975206665238032, 0.007001129921489938, 0.015295946893689974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 165.0, 105, 328, 113.5, 328.0, 328.0, 328.0, 0.025974700641575105, 0.00700099353229954, 0.015270282994363489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 210.3846153846154, 107, 950, 112.0, 704.3999999999999, 950.0, 950.0, 0.10376756066411238, 7.208142822577426, 0.06031801265166028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 213.69230769230768, 108, 788, 113.0, 607.1999999999998, 788.0, 788.0, 0.10376921726081195, 2.3728633768498857, 0.060420312724500706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 224.25, 110, 342, 222.5, 342.0, 342.0, 342.0, 0.025975375344173723, 0.006950442230765235, 0.014814081250974078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 141.6153846153846, 110, 473, 112.0, 337.39999999999986, 473.0, 473.0, 0.10376838895585054, 0.07711693749551002, 0.05208686711260467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 112.0, 107, 115, 113.0, 115.0, 115.0, 115.0, 0.025975037988493058, 0.01930371475512033, 0.013038251490317804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 182.23076923076923, 110, 342, 115.0, 340.0, 342.0, 342.0, 0.10376507586823432, 0.039753747515624625, 0.0585081625200546], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 546.2142857142857, 383, 1204, 446.0, 1156.0, 1204.0, 1204.0, 0.0769222316238283, 0.013897082861726794, 0.05235819867364094], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 117.5, 115, 121, 117.0, 121.0, 121.0, 121.0, 0.025033168948857237, 0.019703841965604426, 0.008898509274789095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1220.8571428571427, 749, 2674, 1066.0, 1851.8000000000002, 2593.699999999999, 2674.0, 0.09166382945289789, 0.04744319297855066, 0.04216178092999502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 421.75, 228, 560, 449.5, 560.0, 560.0, 560.0, 0.025955654763835986, 0.04022619542012471, 0.058374875899525655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7efe1a05-cc96-43c6-ab0c-dfe8bdf072ba", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 0.8856081495098039, 3.379672181372549], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87166e87-d365-4536-b892-f17d464ee5e4", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["addBook", 58, 10, 17.24137931034483, 1053.258620689655, 572, 2221, 886.0, 1614.8000000000002, 1905.1999999999998, 2221.0, 0.2664547279635049, 83.47132223564705, 0.9684152447134003], "isController": true}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 207.07692307692307, 111, 520, 115.5, 454.7, 462.4, 520.0, 0.22763587016000175, 0.16917079803882942, 0.11003882395429772], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 626.0384615384614, 526, 906, 562.0, 779.1, 817.1999999999995, 906.0, 0.22734327522963857, 66.84647142469909, 0.11433768236646862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40206547-cf1b-45f9-bc4c-7c7a15634c23", 3, 0, 0.0, 278.0, 198, 394, 242.0, 394.0, 394.0, 394.0, 0.07995948719315547, 0.03617958567659053, 0.05127610344092327], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 170.61538461538464, 107, 449, 115.0, 336.0, 376.1499999999994, 449.0, 0.22801117254745484, 0.4034728951718634, 0.11088824602405518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14fb96e2-87f4-49cc-9769-3735fb3fa7ef", 3, 0, 0.0, 421.0, 251, 541, 471.0, 541.0, 541.0, 541.0, 0.027009507346585998, 0.026930377930531546, 0.01732054995858542], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 846.8269230769229, 732, 1129, 777.0, 1014.0, 1052.5499999999995, 1129.0, 0.22734923903586435, 204.56924492180497, 0.11411866100042409], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 130.11764705882354, 113, 332, 116.0, 171.19999999999987, 332.0, 332.0, 0.09349238037099976, 0.06984538182013166, 0.03323361958500382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 10, 5.9523809523809526, 179.69047619047637, 109, 1536, 119.0, 321.69999999999993, 381.09999999999997, 881.1900000000021, 0.6975875098617282, 1.4686067778619774, 0.3369410281630195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 122.63636363636363, 113, 176, 117.0, 165.80000000000004, 176.0, 176.0, 0.05642183011899877, 0.043693858676138696, 0.020056197425112842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13b73383-c452-4f6f-870b-5ea605304555", 3, 0, 0.0, 327.6666666666667, 199, 561, 223.0, 561.0, 561.0, 561.0, 0.020592798012108563, 0.02433999009829629, 0.013205667996046184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 134.75, 113, 344, 117.5, 213.10000000000014, 344.0, 344.0, 0.08670817820698326, 0.07036571883789365, 0.030822047722013583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 388.00000000000006, 222, 1089, 231.0, 962.8000000000004, 1089.0, 1089.0, 0.05664963744232037, 6.240965428915005, 0.1260886949854771], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7efe1a05-cc96-43c6-ab0c-dfe8bdf072ba", 3, 0, 0.0, 626.6666666666666, 437, 946, 497.0, 946.0, 946.0, 946.0, 0.09198785760279643, 0.040723791126238, 0.05898960920491828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/973004ea-8fba-4885-835d-bf64810e279c", 3, 0, 0.0, 332.0, 197, 413, 386.0, 413.0, 413.0, 413.0, 0.05245764045533232, 0.03372520830054731, 0.03363982802636871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 405.7692307692308, 224, 1423, 239.0, 1042.5999999999997, 1423.0, 1423.0, 0.10367322200424262, 9.689022700448186, 0.2311230626066638], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a6b68ba-ec25-4e56-affe-26edd0f0e99d", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7ac6f20-5136-431e-bae7-dbc50c9aa821", 3, 0, 0.0, 909.3333333333334, 327, 1951, 450.0, 1951.0, 1951.0, 1951.0, 0.04052849152954527, 0.03378693580962416, 0.02598995062278782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 132.53333333333333, 115, 331, 116.0, 215.20000000000007, 331.0, 331.0, 0.09355995633868704, 0.0775707059878372, 0.03325764072976766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7cbd5b3b-88c1-4699-85ff-4a47d69447d7", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d10e547a-006d-47d6-907e-71ddbcaf8928", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 118.60000000000001, 112, 132, 118.0, 127.8, 132.0, 132.0, 0.09005439285328339, 0.06991527570152371, 0.032011522459565574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59696075-0085-4613-8b16-ed3a70b26959", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 156.29411764705884, 111, 386, 114.0, 348.4, 386.0, 386.0, 0.09128398986210748, 0.06783898074713261, 0.04582028397375317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 150.94117647058823, 107, 345, 112.0, 338.6, 345.0, 345.0, 0.09128644074167548, 0.04055660229182664, 0.05115984121529101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 282.6470588235294, 107, 996, 118.0, 818.3999999999999, 996.0, 996.0, 0.09128840154008903, 9.685412029529113, 0.05274464284755374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 265.6470588235294, 108, 763, 115.0, 760.6, 763.0, 763.0, 0.09128742113035307, 3.179537521815009, 0.05283322425828971], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 37.5, 0.47808764940239046], "isController": false}, {"data": ["401/Unauthorized", 10, 62.5, 0.796812749003984], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1255, 16, "401/Unauthorized", 10, "406/Not Acceptable", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
