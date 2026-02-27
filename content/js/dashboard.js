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

    var data = {"OkPercent": 98.41389728096676, "KoPercent": 1.5861027190332326};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.790207522697795, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.13157894736842105, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99d08600-9db4-4c37-aa7e-c7fde18ca65e"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ef5fcfed-3715-49c6-930d-43a3d002eb17"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d6855ea-40ed-477c-b6bb-8784496eb0f6"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2aaa77e-b330-44b0-a4b5-a6fcb14a98da"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c165e2f-8b75-4cd6-b047-bfd7318d8261"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/37ae9139-025c-415a-8795-be04f8746a16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e5a7a12-4a56-459e-951b-944de0b0de1c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=466e53af-6442-41ba-98e2-b09dccb0a4d4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d6855ea-40ed-477c-b6bb-8784496eb0f6"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4617d170-7529-4d7e-9c8d-c6419e8c45b9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f8551aa6-b50f-4c8a-85a2-a70dad71f629"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a21b7632-f5de-482b-95ae-3993b69bf74b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8de60743-def3-4c47-b2e1-64f654fbaf34"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f8551aa6-b50f-4c8a-85a2-a70dad71f629"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a21b7632-f5de-482b-95ae-3993b69bf74b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/637a1478-6986-458c-8c98-bfefb960f4b4"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4824561403508772, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f2aaa77e-b330-44b0-a4b5-a6fcb14a98da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/99d08600-9db4-4c37-aa7e-c7fde18ca65e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e3003cb-fb1e-4d41-b884-a3976683851d"], "isController": false}, {"data": [0.3220338983050847, 500, 1500, "addBook"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef5fcfed-3715-49c6-930d-43a3d002eb17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9371428571428572, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d6cbd54-c9d9-42e7-9268-96d73e7795fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8c165e2f-8b75-4cd6-b047-bfd7318d8261"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3e3003cb-fb1e-4d41-b884-a3976683851d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1e5a7a12-4a56-459e-951b-944de0b0de1c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37ae9139-025c-415a-8795-be04f8746a16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4617d170-7529-4d7e-9c8d-c6419e8c45b9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/466e53af-6442-41ba-98e2-b09dccb0a4d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8de60743-def3-4c47-b2e1-64f654fbaf34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1324, 21, 1.5861027190332326, 360.64123867069486, 108, 3129, 127.5, 915.5, 1115.5, 1674.5, 5.18071864863067, 733.620305187713, 3.791315338585789], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1662.8771929824563, 1309, 2130, 1622.0, 1933.4, 1963.9999999999993, 2130.0, 0.2575561088242338, 309.9269938217599, 1.2664013749316572], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99d08600-9db4-4c37-aa7e-c7fde18ca65e", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 0.48828125, 1.8633868243243243], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 496.6, 116, 817, 459.0, 807.4, 817.0, 817.0, 0.09569133802008242, 0.018016884736593644, 0.064734940974393], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 496.6, 116, 817, 459.0, 807.4, 817.0, 817.0, 0.09677169621429124, 0.018220295927847026, 0.06546580047934247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 126.18749999999999, 108, 326, 113.5, 179.00000000000014, 326.0, 326.0, 0.09946846538808243, 0.04529020701874359, 0.05568388455441236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 141.625, 109, 344, 114.5, 332.8, 344.0, 344.0, 0.09932274304585607, 0.07381309322060202, 0.04985536125543947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 223.99999999999997, 108, 777, 115.0, 776.3, 777.0, 777.0, 0.09946475528561927, 3.6792003266795557, 0.05750306164949864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef5fcfed-3715-49c6-930d-43a3d002eb17", 3, 0, 0.0, 1167.0, 312, 2446, 743.0, 2446.0, 2446.0, 2446.0, 0.019002495661096824, 0.022460306557761253, 0.01218584519933618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 290.6875, 110, 1021, 117.0, 860.7000000000002, 1021.0, 1021.0, 0.0994641369621166, 11.210708266246845, 0.05740557123497159], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d6855ea-40ed-477c-b6bb-8784496eb0f6", 3, 0, 0.0, 326.6666666666667, 200, 489, 291.0, 489.0, 489.0, 489.0, 0.031358447965882004, 0.026142247799682234, 0.020109421384370947], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 238.73333333333332, 112, 423, 217.0, 356.40000000000003, 423.0, 423.0, 0.09649032523672293, 0.19378473651708522, 0.06237320568199362], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 128.11764705882354, 109, 334, 115.0, 166.79999999999984, 334.0, 334.0, 0.09527759407261273, 0.0708068838762288, 0.04782488608722944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 153.70588235294116, 111, 341, 115.0, 337.8, 341.0, 341.0, 0.09527866206339954, 0.02549448574743308, 0.05433861195803255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 732.3333333333333, 553, 804, 775.0, 804.0, 804.0, 804.0, 0.07108583614714768, 20.901596099164742, 0.04054114092767016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2aaa77e-b330-44b0-a4b5-a6fcb14a98da", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 921.3333333333333, 784, 1022, 963.5, 1022.0, 1022.0, 1022.0, 0.0710050768629957, 63.890492974935206, 0.04042574200305322], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 188.0, 112, 335, 119.0, 335.0, 335.0, 335.0, 0.07156488549618321, 0.12663630128816794, 0.039626259840171756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 145.85714285714283, 110, 334, 115.0, 333.0, 334.0, 334.0, 0.09962994591517221, 0.07404139535297466, 0.05000956269570168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 192.7142857142857, 108, 343, 115.5, 341.0, 343.0, 343.0, 0.099626400996264, 0.03734600160113859, 0.056220534602383916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 236.00000000000003, 109, 960, 113.0, 648.5, 960.0, 960.0, 0.09962852791733678, 6.428215254995659, 0.05795911850101764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 191.99999999999997, 109, 571, 114.5, 453.0, 571.0, 571.0, 0.09978830623605638, 2.12076601335025, 0.05814951941238943], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 114.16666666666667, 113, 116, 114.0, 116.0, 116.0, 116.0, 0.07157256862020016, 0.053190160859347975, 0.040189674762319424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 496.4090909090911, 110, 1117, 118.5, 1031.2, 1104.3999999999999, 1117.0, 0.10761840470390263, 44.03183525150911, 0.059064007269134064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 153.05882352941177, 109, 343, 115.0, 336.6, 343.0, 343.0, 0.09527973007812937, 0.02568086474762081, 0.05601406006546278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 420.86363636363643, 108, 884, 336.5, 806.9, 872.7499999999999, 884.0, 0.10750218669220658, 14.383628424799777, 0.0591052061598753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 153.23529411764707, 110, 339, 114.0, 335.8, 339.0, 339.0, 0.09527919606777153, 0.025680720815141545, 0.056106792215689684], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 631.2142857142857, 141, 1956, 440.5, 1642.5, 1956.0, 1956.0, 0.09362419249133976, 0.01767861949456311, 0.06407275059518237], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 415.85714285714295, 223, 1077, 340.0, 876.5, 1077.0, 1077.0, 0.09939017031215612, 8.636261205797997, 0.22171440057078354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c165e2f-8b75-4cd6-b047-bfd7318d8261", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 543.8095238095239, 125, 1603, 477.0, 1215.2, 1567.8999999999996, 1603.0, 0.09642625916623428, 0.059230583023009147, 0.04359898241598288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 115.00000000000001, 110, 123, 115.0, 120.8, 122.85, 123.0, 0.10761893114834292, 0.07997852207411031, 0.05401965879907056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 185.9090909090909, 108, 348, 114.5, 345.7, 347.7, 348.0, 0.10750008551143166, 0.10215562103288037, 0.05720485729363648], "isController": false}, {"data": ["login", 21, 0, 0.0, 2804.666666666667, 1422, 4536, 2772.0, 4317.0, 4518.599999999999, 4536.0, 0.09581341022739716, 32.8806280397945, 0.18995596717934446], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/37ae9139-025c-415a-8795-be04f8746a16", 3, 0, 0.0, 265.0, 193, 362, 240.0, 362.0, 362.0, 362.0, 0.05126014523707817, 0.03295533425886373, 0.032871903032891926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 132.76470588235293, 113, 362, 118.0, 173.99999999999983, 362.0, 362.0, 0.10097350336479352, 0.08174515067325569, 0.035892925024203944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e5a7a12-4a56-459e-951b-944de0b0de1c", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=466e53af-6442-41ba-98e2-b09dccb0a4d4", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d6855ea-40ed-477c-b6bb-8784496eb0f6", 1, 0, 0.0, 1329.0, 1329, 1329, 1329.0, 1329.0, 1329.0, 1329.0, 0.7524454477050414, 0.13593985139202408, 0.5187758653122648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 635.7272727272727, 221, 1231, 454.5, 1147.5, 1218.6999999999998, 1231.0, 0.10743971167088286, 58.51593633098268, 0.22913922172137954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 447.37500000000006, 225, 1349, 341.0, 1039.6000000000004, 1349.0, 1349.0, 0.0992518888875104, 14.977063993430766, 0.2200455085418657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 806.2500000000001, 112, 1135, 993.5, 1135.0, 1135.0, 1135.0, 0.07617088939034725, 68.3502441634056, 0.14143498517047998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4617d170-7529-4d7e-9c8d-c6419e8c45b9", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 0.9713121639784946, 3.7067372311827955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f8551aa6-b50f-4c8a-85a2-a70dad71f629", 1, 0, 0.0, 674.0, 674, 674, 674.0, 674.0, 674.0, 674.0, 1.483679525222552, 0.26804757047477745, 1.0229274851632046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a21b7632-f5de-482b-95ae-3993b69bf74b", 3, 0, 0.0, 487.0, 217, 1017, 227.0, 1017.0, 1017.0, 1017.0, 0.0853315129277242, 0.03777697186904457, 0.05472105483971898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8de60743-def3-4c47-b2e1-64f654fbaf34", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1052.4347826086955, 121, 2268, 1061.0, 1684.0000000000002, 2160.7999999999984, 2268.0, 0.08947257859971525, 0.02791459356108643, 0.0403675110479184], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 120.38461538461537, 111, 150, 117.0, 140.39999999999998, 150.0, 150.0, 0.08331197128941296, 0.0646806808350423, 0.02961480229428352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 335.6470588235294, 227, 666, 238.0, 501.1999999999999, 666.0, 666.0, 0.0952167581494343, 0.14756737810854711, 0.21414472072084687], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8551aa6-b50f-4c8a-85a2-a70dad71f629", 3, 0, 0.0, 525.6666666666666, 189, 935, 453.0, 935.0, 935.0, 935.0, 0.055752755115315286, 0.03584364952888922, 0.035752906112360386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a21b7632-f5de-482b-95ae-3993b69bf74b", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 0.8988261815920398, 3.4301150497512434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/637a1478-6986-458c-8c98-bfefb960f4b4", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.8230307667525772, 1.5378342461340206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 427.62499999999994, 226, 1132, 344.5, 969.6000000000001, 1132.0, 1132.0, 0.11086551320338972, 16.72955451551771, 0.24579338999023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 159.0, 109, 338, 117.0, 338.0, 338.0, 338.0, 0.036075296358559585, 0.0268098637977186, 0.018108107742480107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 113.4, 111, 116, 114.0, 116.0, 116.0, 116.0, 0.03613473921558708, 0.009668865766670762, 0.020608093458889507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 200.4, 110, 341, 114.0, 341.0, 341.0, 341.0, 0.03607477579526843, 0.009723279413568445, 0.02120802248901523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 210.2, 114, 342, 160.0, 342.0, 342.0, 342.0, 0.03607972175318584, 0.009724612503788371, 0.021246164274581116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 141.0, 141, 141, 141.0, 141.0, 141.0, 141.0, 7.092198581560283, 2.0916445035460995, 4.3841422872340425], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1079.8771929824566, 857, 1622, 923.0, 1463.2, 1494.1999999999994, 1622.0, 0.2580434871181975, 308.70972102443267, 0.5095350888212845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1052.4347826086955, 121, 2268, 1061.0, 1684.0000000000002, 2160.7999999999984, 2268.0, 0.09037860777648977, 0.02819726604711476, 0.04077628593040847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 131.23076923076925, 110, 345, 114.0, 253.39999999999992, 345.0, 345.0, 0.06062838994314922, 0.01634124572686444, 0.035702069468475574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2aaa77e-b330-44b0-a4b5-a6fcb14a98da", 3, 0, 0.0, 820.0, 202, 1810, 448.0, 1810.0, 1810.0, 1810.0, 0.021557764028714944, 0.02548054726180467, 0.01382447758351837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 165.15384615384616, 108, 344, 115.0, 341.2, 344.0, 344.0, 0.060628672698442305, 0.01634132193825203, 0.03564302828560769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 113.30769230769232, 109, 131, 112.0, 124.19999999999999, 131.0, 131.0, 0.08190937043197742, 0.022077134999243915, 0.04815375097661173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 145.84615384615384, 109, 336, 113.0, 331.6, 336.0, 336.0, 0.08190833826883577, 0.02207685679902214, 0.04823313278916794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 155.61538461538458, 109, 434, 114.0, 398.0, 434.0, 434.0, 0.0606289554563728, 0.016222982221724754, 0.034577451158712615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 114.07692307692307, 110, 118, 114.0, 117.6, 118.0, 118.0, 0.08190730613170695, 0.06087056637327049, 0.04111362827314196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 131.7692307692308, 113, 330, 116.0, 245.5999999999999, 330.0, 330.0, 0.060626976206243646, 0.04505578993452287, 0.030431900166024643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 130.38461538461536, 109, 335, 114.0, 248.19999999999993, 335.0, 335.0, 0.08191040262113287, 0.02191743195135782, 0.04671452649486484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 118.53846153846153, 111, 134, 117.0, 132.4, 134.0, 134.0, 0.05812991589048324, 0.04575460176536083, 0.020663368539195214], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 537.3571428571428, 112, 1017, 463.0, 933.0, 1017.0, 1017.0, 0.09325375679420228, 0.017426535606282642, 0.06346797607708089], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1408.8095238095234, 798, 3129, 1118.0, 2599.0000000000005, 3092.6999999999994, 3129.0, 0.09804104651814226, 0.05074390102989785, 0.04509505166996582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 307.46153846153845, 225, 765, 233.0, 644.1999999999999, 765.0, 765.0, 0.06059476088375128, 0.09391004445557938, 0.13627903741726485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99d08600-9db4-4c37-aa7e-c7fde18ca65e", 3, 0, 0.0, 590.0, 263, 1058, 449.0, 1058.0, 1058.0, 1058.0, 0.03864485379363648, 0.02484491739662502, 0.02478201887157027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e3003cb-fb1e-4d41-b884-a3976683851d", 1, 0, 0.0, 958.0, 958, 958, 958.0, 958.0, 958.0, 958.0, 1.04384133611691, 0.18858461638830898, 0.7196796711899791], "isController": false}, {"data": ["addBook", 59, 9, 15.254237288135593, 1076.5254237288134, 570, 3754, 921.0, 1699.0, 1802.0, 3754.0, 0.2876463217836022, 88.59641449926382, 1.0460411608479228], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef5fcfed-3715-49c6-930d-43a3d002eb17", 1, 0, 0.0, 1956.0, 1956, 1956, 1956.0, 1956.0, 1956.0, 1956.0, 0.5112474437627812, 0.09236404013292433, 0.35248114775051126], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 207.5438596491228, 110, 473, 117.0, 455.6, 465.0, 473.0, 0.25924174064910493, 0.1926591451503602, 0.12531705236455756], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 620.8245614035088, 536, 917, 564.0, 803.8, 899.1999999999999, 917.0, 0.25915569801541294, 76.20037999556708, 0.130337094216736], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 165.2982456140351, 109, 345, 115.0, 340.0, 341.2, 345.0, 0.2594175393563714, 0.4590474426892041, 0.12616204550729782], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 870.5438596491227, 745, 1138, 793.0, 1020.2, 1045.7999999999995, 1138.0, 0.25861012935043487, 232.6978489776393, 0.12981016258410502], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 126.12499999999999, 113, 189, 120.5, 161.00000000000003, 189.0, 189.0, 0.11205266475243364, 0.08371121927305834, 0.03983122067371665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 9, 5.142857142857143, 185.20000000000002, 109, 2569, 120.0, 333.20000000000005, 368.0, 1072.560000000018, 0.7174659921119739, 1.5471961941503973, 0.34433963533253525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 167.4, 116, 350, 123.0, 350.0, 350.0, 350.0, 0.0369437199370479, 0.028609736240311507, 0.013132337946372495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d6cbd54-c9d9-42e7-9268-96d73e7795fa", 2, 0, 0.0, 308.5, 194, 423, 308.5, 423.0, 423.0, 423.0, 0.021175224986765485, 0.030149880889359448, 0.013162139359449444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 119.6875, 114, 129, 118.0, 127.6, 129.0, 129.0, 0.09973507869721054, 0.0809373539036933, 0.03545270375564905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 373.8, 232, 681, 269.0, 681.0, 681.0, 681.0, 0.03598675687347057, 0.05577244449042752, 0.08093505964804952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c165e2f-8b75-4cd6-b047-bfd7318d8261", 3, 0, 0.0, 421.33333333333337, 197, 849, 218.0, 849.0, 849.0, 849.0, 0.026700368465084817, 0.026952422724683598, 0.017122306600331084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 280.46153846153845, 225, 450, 230.0, 450.0, 450.0, 450.0, 0.08184748665256371, 0.12684761847423692, 0.1840769157820842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e3003cb-fb1e-4d41-b884-a3976683851d", 3, 0, 0.0, 446.33333333333337, 209, 839, 291.0, 839.0, 839.0, 839.0, 0.01849101028716539, 0.025491350444708794, 0.011857841883371033], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e5a7a12-4a56-459e-951b-944de0b0de1c", 3, 0, 0.0, 550.3333333333334, 291, 980, 380.0, 980.0, 980.0, 980.0, 0.03318033512138473, 0.027661080158159594, 0.021277753967815075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 167.0, 111, 353, 117.0, 350.5, 353.0, 353.0, 0.10498845127036026, 0.0870460889927108, 0.03732011353751087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37ae9139-025c-415a-8795-be04f8746a16", 1, 0, 0.0, 875.0, 875, 875, 875.0, 875.0, 875.0, 875.0, 1.142857142857143, 0.20647321428571427, 0.7879464285714286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 129.04545454545453, 112, 334, 117.5, 131.4, 303.6999999999996, 334.0, 0.10663202741412486, 0.08278560722092702, 0.0379043534948647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4617d170-7529-4d7e-9c8d-c6419e8c45b9", 3, 0, 0.0, 440.0, 243, 590, 487.0, 590.0, 590.0, 590.0, 0.06707807888382077, 0.03153019072533763, 0.043015564909221], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/466e53af-6442-41ba-98e2-b09dccb0a4d4", 3, 0, 0.0, 824.6666666666666, 226, 1775, 473.0, 1775.0, 1775.0, 1775.0, 0.020154247171687314, 0.023821637851691613, 0.012924435849031253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8de60743-def3-4c47-b2e1-64f654fbaf34", 3, 0, 0.0, 316.6666666666667, 224, 422, 304.0, 422.0, 422.0, 422.0, 0.03679446611229671, 0.03067403245885152, 0.02359540958373194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 129.0625, 110, 347, 114.5, 188.80000000000015, 347.0, 347.0, 0.11095469581076677, 0.08245754249218117, 0.05569405629563878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 155.8125, 110, 343, 114.5, 338.1, 343.0, 343.0, 0.11095084877399312, 0.0505183918367913, 0.062111888730167535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 265.5625, 110, 1012, 117.5, 829.3000000000002, 1012.0, 1012.0, 0.11095161816000611, 12.505474443855014, 0.06403555305914414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 268.3125, 110, 801, 119.0, 792.6, 801.0, 801.0, 0.11095238755668974, 4.104127732202544, 0.06414434905621126], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 38.095238095238095, 0.6042296072507553], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.761904761904762, 0.0755287009063444], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.761904761904762, 0.0755287009063444], "isController": false}, {"data": ["401/Unauthorized", 11, 52.38095238095238, 0.8308157099697885], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1324, 21, "401/Unauthorized", 11, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
