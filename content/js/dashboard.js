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

    var data = {"OkPercent": 97.4339035769829, "KoPercent": 2.5660964230171075};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7236230922362309, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43c9e4b0-0aee-4fab-ae02-6e1028798adb"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/9056b7f8-6178-478a-8cde-93dc393a3acd"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cae805bb-577a-41b9-bea4-a613db89f1e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3815560d-cee8-453e-bafe-d98d2282a7a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a9c6602-d2d2-488f-922e-7163a7a630e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d05713c8-97c6-4eb8-91da-78567127eb35"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f1be7fb-92cf-4be9-90b1-59bd2faa176f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13a1427d-23fb-4ca0-98eb-b62222c69455"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ae441787-a107-4176-bcbd-79d9a19c4619"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abf6954e-1a85-44b7-a332-ed0d3acb7bb2"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/43c9e4b0-0aee-4fab-ae02-6e1028798adb"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/61706938-e89f-49a0-a9e8-5b0f889ed3ab"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22, 500, 1500, "register"], "isController": true}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afbf451d-e9ca-4661-b972-0fce9e09f61a"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7f1be7fb-92cf-4be9-90b1-59bd2faa176f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.34545454545454546, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/af84fef4-ee98-47c1-958c-79f2ef437c82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3815560d-cee8-453e-bafe-d98d2282a7a1"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9adf3be2-b891-482e-8645-8b28b12873ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/13a1427d-23fb-4ca0-98eb-b62222c69455"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cae805bb-577a-41b9-bea4-a613db89f1e8"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d05713c8-97c6-4eb8-91da-78567127eb35"], "isController": false}, {"data": [0.43636363636363634, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8952095808383234, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7a9c6602-d2d2-488f-922e-7163a7a630e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c1af656-7dce-4b2d-b25a-c2e02a732c32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5c1af656-7dce-4b2d-b25a-c2e02a732c32"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/abf6954e-1a85-44b7-a332-ed0d3acb7bb2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae441787-a107-4176-bcbd-79d9a19c4619"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cdbd02ff-2840-48ed-b6e3-688748d8b8ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61706938-e89f-49a0-a9e8-5b0f889ed3ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/afbf451d-e9ca-4661-b972-0fce9e09f61a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1286, 33, 2.5660964230171075, 475.65007776049816, 126, 3283, 158.5, 1279.7999999999997, 1539.4499999999982, 2106.5099999999966, 5.008587819706418, 720.7953237216125, 3.65099102538762], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2212.0545454545454, 1703, 3160, 2175.0, 2631.2, 2856.7999999999997, 3160.0, 0.2492353007816925, 299.9137412201201, 1.2254880267927948], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43c9e4b0-0aee-4fab-ae02-6e1028798adb", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 631.125, 135, 1959, 559.5, 1528.5000000000005, 1959.0, 1959.0, 0.08522969402539846, 0.0172238474681454, 0.05716486252716696], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 631.125, 135, 1959, 559.5, 1528.5000000000005, 1959.0, 1959.0, 0.08545639053570474, 0.017269659977033596, 0.057316911352347386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 155.3125, 132, 423, 137.0, 227.70000000000022, 423.0, 423.0, 0.09368833404575504, 0.04265838452034501, 0.052448083488016675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 138.62500000000003, 133, 154, 137.0, 146.3, 154.0, 154.0, 0.09368668829267722, 0.06962457987375718, 0.04702632595941024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 324.31249999999994, 132, 1081, 141.5, 1057.9, 1081.0, 1081.0, 0.0936877854549713, 3.465510269059609, 0.054163250966155284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 317.49999999999994, 128, 1647, 140.0, 1533.6000000000001, 1647.0, 1647.0, 0.09368997985665432, 10.559896900764743, 0.05407302548367452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9056b7f8-6178-478a-8cde-93dc393a3acd", 2, 0, 0.0, 378.0, 227, 529, 378.0, 529.0, 529.0, 529.0, 0.015377163374672273, 0.02627933193913719, 0.009558168445291898], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 394.4117647058824, 131, 2316, 263.0, 886.3999999999987, 2316.0, 2316.0, 0.08650827171739274, 0.1220100578587676, 0.05591133760870782], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cae805bb-577a-41b9-bea4-a613db89f1e8", 3, 0, 0.0, 461.66666666666663, 244, 868, 273.0, 868.0, 868.0, 868.0, 0.05634226045148931, 0.03622264465875371, 0.036130941760883446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3815560d-cee8-453e-bafe-d98d2282a7a1", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a9c6602-d2d2-488f-922e-7163a7a630e3", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 153.05555555555557, 130, 414, 137.0, 171.0000000000004, 414.0, 414.0, 0.09172582132829181, 0.0681673340144825, 0.04604206265892773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 169.22222222222217, 127, 427, 137.0, 424.3, 427.0, 427.0, 0.0917281585062579, 0.04750634771596885, 0.051029760054425374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 829.3333333333334, 747, 1071, 792.5, 1071.0, 1071.0, 1071.0, 0.0830036244916028, 24.40582158025067, 0.047338004592867224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1309.3333333333333, 1051, 1521, 1299.5, 1521.0, 1521.0, 1521.0, 0.08254570968673902, 74.2747746760081, 0.0469962390111024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 324.5, 136, 419, 414.5, 419.0, 419.0, 419.0, 0.0834561994046791, 0.14767835285281108, 0.04621061041255181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 141.0909090909091, 135, 146, 142.0, 145.4, 146.0, 146.0, 0.05279450937102541, 0.03923498206186557, 0.026500368961627992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 164.27272727272725, 128, 426, 139.0, 370.6000000000002, 426.0, 426.0, 0.052796536547202504, 0.01412719825579442, 0.030110524749576425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d05713c8-97c6-4eb8-91da-78567127eb35", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 162.90909090909088, 137, 380, 141.0, 334.8000000000002, 380.0, 380.0, 0.05279450937102541, 0.014229770103909195, 0.031037397110700488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f1be7fb-92cf-4be9-90b1-59bd2faa176f", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 0.6642061121323529, 2.5347541360294117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 136.63636363636365, 128, 143, 136.0, 143.0, 143.0, 143.0, 0.05279374922009234, 0.014229565219478013, 0.031088506620816095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 177.16666666666666, 128, 387, 137.0, 387.0, 387.0, 387.0, 0.08378952072394145, 0.06226936061613227, 0.04704977970338509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 921.2777777777778, 135, 2145, 1205.0, 1789.5000000000005, 2145.0, 2145.0, 0.08492248464318403, 42.46206242805179, 0.045870673671199014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 427.8888888888889, 127, 1571, 142.0, 1555.7, 1571.0, 1571.0, 0.09159606136936112, 13.75695617223876, 0.05253654301198382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 716.7777777777776, 134, 1228, 1048.0, 1223.5, 1228.0, 1228.0, 0.08491968013587148, 13.881953535961125, 0.04595208819852334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 306.7222222222222, 133, 1309, 137.0, 868.9000000000007, 1309.0, 1309.0, 0.0916067829733526, 4.509815046541335, 0.05263215232681229], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 367.2, 136, 508, 469.0, 498.4, 508.0, 508.0, 0.08385322331790435, 0.017065441151807876, 0.056617303322264716], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13a1427d-23fb-4ca0-98eb-b62222c69455", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 0.6042276337792643, 2.3058632943143813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 309.90909090909093, 279, 562, 284.0, 509.0000000000002, 562.0, 562.0, 0.05275880592433428, 0.08176584472843604, 0.11865579105834165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 716.6818181818179, 169, 1425, 691.0, 1302.1, 1411.1999999999998, 1425.0, 0.10980180773703464, 0.06744661822909648, 0.04964671580297563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 167.55555555555554, 127, 426, 138.0, 403.50000000000006, 426.0, 426.0, 0.08492488865403489, 0.06311312525949271, 0.04262831325016985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 294.77777777777777, 128, 550, 395.5, 439.3000000000002, 550.0, 550.0, 0.08492128268879652, 0.09358295865748888, 0.044469413005222655], "isController": false}, {"data": ["login", 22, 0, 0.0, 3259.136363636364, 1679, 4611, 3116.5, 4413.9, 4591.2, 4611.0, 0.11375211346256263, 37.2698236486766, 0.22307088372465786], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 147.0, 136, 177, 144.5, 164.40000000000003, 177.0, 177.0, 0.09625256673511294, 0.07792322053067248, 0.034214779581622175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae441787-a107-4176-bcbd-79d9a19c4619", 3, 0, 0.0, 1418.0, 261, 3283, 710.0, 3283.0, 3283.0, 3283.0, 0.06396179348868943, 0.02894104588192653, 0.04101716574632753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abf6954e-1a85-44b7-a332-ed0d3acb7bb2", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 0.725558483935743, 2.7688880522088355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1122.0555555555557, 279, 2283, 1351.5, 1919.4000000000005, 2283.0, 2283.0, 0.08486803021301877, 56.46494007374089, 0.17880669950587946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43c9e4b0-0aee-4fab-ae02-6e1028798adb", 3, 0, 0.0, 768.6666666666666, 333, 1033, 940.0, 1033.0, 1033.0, 1033.0, 0.0482322866927121, 0.031008712961623178, 0.030930209890834257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61706938-e89f-49a0-a9e8-5b0f889ed3ab", 3, 0, 0.0, 890.0, 313, 1874, 483.0, 1874.0, 1874.0, 1874.0, 0.04465681239673112, 0.028710027501153635, 0.028637343887226663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 528.7499999999999, 271, 1790, 290.5, 1671.7, 1790.0, 1790.0, 0.09361159379589161, 14.125946080453312, 0.2075407429835185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 811.6666666666666, 131, 1875, 662.5, 1807.2000000000003, 1875.0, 1875.0, 0.10668373606443697, 63.829691917373445, 0.15562385815063742], "isController": false}, {"data": ["register", 25, 8, 32.0, 1150.7600000000002, 253, 2224, 1158.0, 1771.6000000000001, 2100.7, 2224.0, 0.09817589192797817, 0.030725986176834415, 0.04429420124094327], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 584.4444444444445, 272, 1969, 285.0, 1737.7000000000003, 1969.0, 1969.0, 0.09153085352520912, 18.368666136444535, 0.20195186366987872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 147.15384615384613, 136, 188, 145.0, 172.79999999999998, 188.0, 188.0, 0.08377800118578094, 0.06504249115497641, 0.029780461359008067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afbf451d-e9ca-4661-b972-0fce9e09f61a", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 435.3529411764706, 274, 827, 517.0, 614.9999999999998, 827.0, 827.0, 0.11038602642771338, 0.1710767811921691, 0.2482607606084218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 176.08333333333334, 133, 551, 142.5, 432.5000000000004, 551.0, 551.0, 0.060649556752822735, 0.045072570985252046, 0.03044323454194422], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f1be7fb-92cf-4be9-90b1-59bd2faa176f", 3, 0, 0.0, 962.3333333333333, 263, 1953, 671.0, 1953.0, 1953.0, 1953.0, 0.07597437131207739, 0.0343764245194621, 0.04872054410312254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 163.0, 131, 427, 142.0, 341.8000000000003, 427.0, 427.0, 0.06065108944519416, 0.01622890479295234, 0.03459007444921229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 139.08333333333337, 131, 148, 140.0, 146.5, 148.0, 148.0, 0.06065139599296444, 0.016347446576228695, 0.035656387097426356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 182.08333333333331, 127, 411, 137.5, 408.90000000000003, 411.0, 411.0, 0.06065108944519416, 0.016347363952024987, 0.03571543646040242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 142.0, 136, 151, 139.0, 151.0, 151.0, 151.0, 0.03390213583455758, 0.009998481466832411, 0.02095708201491694], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1479.3636363636365, 1058, 2503, 1353.0, 2032.7999999999997, 2265.9999999999995, 2503.0, 0.26079823226216386, 312.0053539209829, 0.5149746344082963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 1150.7600000000002, 253, 2224, 1158.0, 1771.6000000000001, 2100.7, 2224.0, 0.09825653602477637, 0.030751225259004228, 0.044330585589303396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 225.0, 132, 402, 142.5, 402.0, 402.0, 402.0, 0.042656656571257945, 0.01149730196647187, 0.02511910538327006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af84fef4-ee98-47c1-958c-79f2ef437c82", 1, 0, 0.0, 2631.0, 2631, 2631, 2631.0, 2631.0, 2631.0, 2631.0, 0.38008361839604715, 0.12137435860889396, 0.22678817464842266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 228.83333333333331, 133, 415, 140.0, 415.0, 415.0, 415.0, 0.04265999274780123, 0.011498201170305802, 0.025079409799000335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 401.30769230769226, 133, 1694, 396.0, 1183.5999999999995, 1694.0, 1694.0, 0.0805841732683701, 5.597724630320105, 0.04684197211167727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 231.84615384615384, 128, 808, 140.0, 654.7999999999998, 808.0, 808.0, 0.08070724378554224, 1.8455112997901613, 0.04699232621557526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 200.9230769230769, 128, 427, 139.0, 419.8, 427.0, 427.0, 0.0807032355789526, 0.05997574440974895, 0.040509241296466436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 136.66666666666669, 132, 143, 135.0, 143.0, 143.0, 143.0, 0.04265786966598888, 0.011414312781719681, 0.024328316293884284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 323.6923076923077, 126, 426, 401.0, 424.4, 426.0, 426.0, 0.08057967780525752, 0.030871120553396435, 0.04543502566152816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 138.0, 133, 146, 137.0, 146.0, 146.0, 146.0, 0.042659386131433566, 0.03170292270119233, 0.02141301217925474], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 818.8666666666667, 131, 3283, 520.0, 2485.0000000000005, 3283.0, 3283.0, 0.08426398220344695, 0.016688218350448283, 0.0573390066400018], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 147.0, 140, 156, 146.0, 156.0, 156.0, 156.0, 0.044523597506678544, 0.03504494100623331, 0.015826747551202138], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3815560d-cee8-453e-bafe-d98d2282a7a1", 3, 0, 0.0, 334.0, 239, 497, 266.0, 497.0, 497.0, 497.0, 0.023857807467493736, 0.024083027655175154, 0.015299440335599825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1546.090909090909, 972, 2226, 1436.0, 2077.1, 2206.4999999999995, 2226.0, 0.11257688489525233, 0.05826733300242552, 0.05178096951724985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 370.6666666666667, 273, 556, 287.0, 556.0, 556.0, 556.0, 0.04261514968571327, 0.06604515874143259, 0.09584247043573992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9adf3be2-b891-482e-8645-8b28b12873ff", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 1.174029181985294, 2.193675321691176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13a1427d-23fb-4ca0-98eb-b62222c69455", 3, 0, 0.0, 402.3333333333333, 361, 450, 396.0, 450.0, 450.0, 450.0, 0.06515506906437321, 0.02948097200503866, 0.04178238478411954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cae805bb-577a-41b9-bea4-a613db89f1e8", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["addBook", 56, 13, 23.214285714285715, 1436.0, 705, 3193, 1097.5, 2549.3, 2694.3, 3193.0, 0.24473492148816314, 84.66109624992899, 0.8864385578776238], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 246.60000000000005, 132, 764, 144.0, 562.0, 573.1999999999999, 764.0, 0.26216817850316265, 0.1948339685946356, 0.12673168785064995], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 861.4727272727274, 633, 1189, 810.0, 1120.4, 1152.9999999999998, 1189.0, 0.26160205096007955, 76.91968898786166, 0.13156743773871188], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 197.3090909090909, 128, 568, 142.0, 423.6, 430.2, 568.0, 0.2627480580529891, 0.4649408996015784, 0.12778177042030137], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d05713c8-97c6-4eb8-91da-78567127eb35", 3, 0, 0.0, 436.66666666666663, 237, 701, 372.0, 701.0, 701.0, 701.0, 0.044348520237708064, 0.028511825348135882, 0.02843964351181149], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1223.4181818181817, 915, 1939, 1208.0, 1550.8, 1626.3999999999996, 1939.0, 0.2615485576785901, 235.34185195251942, 0.13128511586601105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 142.41176470588238, 132, 149, 144.0, 149.0, 149.0, 149.0, 0.10782354993181746, 0.08055177314242223, 0.03832790251482574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 13, 7.7844311377245505, 232.18562874251504, 128, 1514, 147.0, 411.40000000000003, 498.1999999999999, 1357.5999999999985, 0.7186659494351801, 1.6359643961807424, 0.3428086336740183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 168.58333333333337, 135, 422, 145.0, 344.60000000000025, 422.0, 422.0, 0.06256549825598673, 0.04845160167675535, 0.022240079458182783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a9c6602-d2d2-488f-922e-7163a7a630e3", 3, 0, 0.0, 737.3333333333334, 257, 1484, 471.0, 1484.0, 1484.0, 1484.0, 0.02424830261881668, 0.02431934256789525, 0.01554985552053023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c1af656-7dce-4b2d-b25a-c2e02a732c32", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 155.8125, 138, 322, 144.0, 216.30000000000013, 322.0, 322.0, 0.09565201795866637, 0.07762385441762867, 0.03400130325874469], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c1af656-7dce-4b2d-b25a-c2e02a732c32", 3, 0, 0.0, 929.6666666666666, 305, 1964, 520.0, 1964.0, 1964.0, 1964.0, 0.041523066063198104, 0.026316865112319895, 0.026627747442871184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 364.91666666666663, 270, 979, 285.0, 850.3000000000004, 979.0, 979.0, 0.06060606060606061, 0.09392755681818182, 0.13630445075757575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abf6954e-1a85-44b7-a332-ed0d3acb7bb2", 3, 0, 0.0, 1098.0, 279, 2316, 699.0, 2316.0, 2316.0, 2316.0, 0.09839614287119945, 0.04452169224966381, 0.06309908901571058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae441787-a107-4176-bcbd-79d9a19c4619", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 649.8461538461539, 273, 2103, 546.0, 1595.3999999999996, 2103.0, 2103.0, 0.0805078185477628, 7.524045904938846, 0.17947945695928164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdbd02ff-2840-48ed-b6e3-688748d8b8ec", 2, 0, 0.0, 300.5, 226, 375, 300.5, 375.0, 375.0, 375.0, 0.029498089998672584, 0.033963132918393535, 0.018335482699370215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 148.00000000000003, 141, 155, 147.0, 154.8, 155.0, 155.0, 0.05303223878006566, 0.043969112035425535, 0.018851303628851467], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61706938-e89f-49a0-a9e8-5b0f889ed3ab", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 160.83333333333331, 138, 450, 144.5, 180.90000000000043, 450.0, 450.0, 0.08331443329985327, 0.06468259225916342, 0.02961567746205722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afbf451d-e9ca-4661-b972-0fce9e09f61a", 3, 0, 0.0, 530.6666666666666, 236, 916, 440.0, 916.0, 916.0, 916.0, 0.025593338906993803, 0.02566831939207289, 0.01641239506731048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 155.0, 133, 403, 139.0, 197.3999999999998, 403.0, 403.0, 0.11069149628857924, 0.08226194206602422, 0.05556194247297825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 212.88235294117646, 131, 409, 141.0, 405.8, 409.0, 409.0, 0.11052453644709126, 0.029573948229006837, 0.06303352469248173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 234.2941176470588, 132, 425, 142.0, 423.4, 425.0, 425.0, 0.11049005589496945, 0.029780522877940984, 0.06495606801637852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 210.4705882352941, 128, 405, 139.0, 396.2, 405.0, 405.0, 0.11069798334320932, 0.02983656582297439, 0.06518641011323753], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 24.242424242424242, 0.6220839813374806], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.090909090909092, 0.2332814930015552], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.090909090909092, 0.2332814930015552], "isController": false}, {"data": ["401/Unauthorized", 19, 57.57575757575758, 1.4774494556765163], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1286, 33, "401/Unauthorized", 19, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
