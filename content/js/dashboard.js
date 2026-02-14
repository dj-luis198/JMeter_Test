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

    var data = {"OkPercent": 65.65495207667732, "KoPercent": 34.34504792332268};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5029205607476636, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9bc9cbd9-bad9-4251-aa2e-1dbb7c38c8e1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/285b8fb3-cae9-44bb-918a-b5acd687aeef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c20fd951-664e-4293-9e7d-dcf27487b4ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a13b75c6-cc58-4a6c-b9e3-6237109a04e1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=285b8fb3-cae9-44bb-918a-b5acd687aeef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e0bc3b1-1840-4e68-8b70-581a3710554d"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ba8389e8-98cf-4124-b4f8-626dfe4a1e36"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cb764fc5-04c9-4f11-ba1e-240d195e0db3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d3ead99b-973e-45bd-8a41-fe07c33fad56"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c03d0ec9-c532-41fc-8328-7d6d299b42a8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e8bcdb2a-2631-4557-b1ff-3b28da5afc2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c03d0ec9-c532-41fc-8328-7d6d299b42a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34b2e06e-954f-43e0-91ec-cb54a589f634"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bbe82b89-b136-4c8a-9c1d-bf5aa2af2553"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4791666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba8389e8-98cf-4124-b4f8-626dfe4a1e36"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68b2ad35-d042-4678-8bbc-aa004e5c15b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.71875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.938953488372093, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a13b75c6-cc58-4a6c-b9e3-6237109a04e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/49fd73c5-c8c6-4958-9310-2acb09ebeeec"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f214e5fb-1eaa-4c2f-8016-714279801aad"], "isController": false}, {"data": [0.7708333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bbe82b89-b136-4c8a-9c1d-bf5aa2af2553"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f214e5fb-1eaa-4c2f-8016-714279801aad"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/68b2ad35-d042-4678-8bbc-aa004e5c15b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b3c5846e-2e25-4ad7-a9ad-0c37e2070d0e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3c5846e-2e25-4ad7-a9ad-0c37e2070d0e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb764fc5-04c9-4f11-ba1e-240d195e0db3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e0bc3b1-1840-4e68-8b70-581a3710554d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8bcdb2a-2631-4557-b1ff-3b28da5afc2a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=266625ee-d0d8-4b0f-ba0c-c7f830411d51"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/266625ee-d0d8-4b0f-ba0c-c7f830411d51"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/accce233-a4f6-4eee-9e1f-9d55f358e190"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 626, 215, 34.34504792332268, 247.03514376996802, 98, 1737, 107.0, 571.5000000000003, 905.8999999999999, 1385.3000000000002, 2.4482676355444655, 2.612131195466403, 1.1714579316440548], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 60, 100.0, 575.2166666666666, 404, 1029, 605.0, 736.6999999999999, 779.1999999999999, 1029.0, 0.2797620157785777, 1.7992558913217824, 0.46963955578454597], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 19, 100.0, 180.89473684210523, 99, 413, 102.0, 319.0, 413.0, 413.0, 0.1081936780725581, 0.053779865370050854, 0.05430815481376452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 131.6, 101, 299, 106.0, 297.8, 299.0, 299.0, 0.09288730911657976, 0.07211465893328214, 0.03301853566253422], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9bc9cbd9-bad9-4251-aa2e-1dbb7c38c8e1", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/285b8fb3-cae9-44bb-918a-b5acd687aeef", 3, 0, 0.0, 488.6666666666667, 183, 909, 374.0, 909.0, 909.0, 909.0, 0.05227482618620293, 0.023652997525658227, 0.03352259361550123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c20fd951-664e-4293-9e7d-dcf27487b4ee", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a13b75c6-cc58-4a6c-b9e3-6237109a04e1", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 22, 100.0, 110.45454545454545, 99, 300, 101.0, 106.8, 271.1999999999996, 300.0, 0.10384117963580065, 0.051616367611936075, 0.05212340462187651], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 104.75, 102, 109, 104.0, 109.0, 109.0, 109.0, 0.051927146213861956, 0.015314451324791317, 0.032099495657592396], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, 100.0, 207.36666666666667, 99, 675, 102.0, 406.9, 419.65, 675.0, 0.26548202686678113, 0.1319632340578043, 0.12833359697173502], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 390.43749999999994, 104, 745, 407.0, 649.1000000000001, 745.0, 745.0, 0.09768665783416469, 0.020438834415009557, 0.0652277854434669], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 390.43749999999994, 104, 745, 407.0, 649.1000000000001, 745.0, 745.0, 0.0992081945968737, 0.02075718329334003, 0.06624375298399648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=285b8fb3-cae9-44bb-918a-b5acd687aeef", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e0bc3b1-1840-4e68-8b70-581a3710554d", 3, 0, 0.0, 366.3333333333333, 352, 374, 373.0, 374.0, 374.0, 374.0, 0.032493907392363935, 0.027088833604115892, 0.02083756431085838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 7, 26.923076923076923, 872.2692307692308, 145, 1737, 849.0, 1407.0, 1623.9499999999996, 1737.0, 0.10178953838444343, 0.03203862423608909, 0.04592457688829381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba8389e8-98cf-4124-b4f8-626dfe4a1e36", 3, 0, 0.0, 421.6666666666667, 185, 546, 534.0, 546.0, 546.0, 546.0, 0.03230913379212304, 0.02693479545625882, 0.0207190734278914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb764fc5-04c9-4f11-ba1e-240d195e0db3", 3, 0, 0.0, 299.0, 184, 522, 191.0, 522.0, 522.0, 522.0, 0.04524272723159752, 0.029086714284637077, 0.02901307703328357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3ead99b-973e-45bd-8a41-fe07c33fad56", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 1.0936162243150687, 2.043423587328767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c03d0ec9-c532-41fc-8328-7d6d299b42a8", 3, 0, 0.0, 310.3333333333333, 188, 534, 209.0, 534.0, 534.0, 534.0, 0.025256564602082827, 0.025330558443690487, 0.016196429774122122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8bcdb2a-2631-4557-b1ff-3b28da5afc2a", 3, 0, 0.0, 385.33333333333337, 180, 652, 324.0, 652.0, 652.0, 652.0, 0.03469290992564153, 0.028922051536317696, 0.02224773195101361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c03d0ec9-c532-41fc-8328-7d6d299b42a8", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34b2e06e-954f-43e0-91ec-cb54a589f634", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 1.6632080078125, 3.1077067057291665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbe82b89-b136-4c8a-9c1d-bf5aa2af2553", 3, 0, 0.0, 350.0, 288, 388, 374.0, 388.0, 388.0, 388.0, 0.08866296252512117, 0.040117681611301574, 0.05685743365054971], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 104.8, 102, 117, 103.5, 115.9, 117.0, 117.0, 0.05452681628825056, 0.04291856828938472, 0.01938257922746407], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 404.68750000000006, 102, 813, 381.0, 700.3000000000001, 813.0, 813.0, 0.10076137816374983, 0.026174342374567828, 0.0664444537158907], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1041.583333333333, 728, 1589, 993.5, 1424.0, 1559.25, 1589.0, 0.11408145415826901, 0.05904606514051032, 0.05247301260600069], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 201.25, 98, 374, 188.0, 339.00000000000006, 374.0, 374.0, 0.09798577981370454, 0.13385728294618746, 0.06126503469309017], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 10, 100.0, 101.5, 100, 104, 101.0, 103.8, 104.0, 104.0, 0.05368435745192566, 0.02668490033499039, 0.02694703098661112], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba8389e8-98cf-4124-b4f8-626dfe4a1e36", 1, 0, 0.0, 368.0, 368, 368, 368.0, 368.0, 368.0, 368.0, 2.717391304347826, 0.49093495244565216, 1.8735139266304348], "isController": false}, {"data": ["addBook", 56, 56, 100.0, 611.0, 405, 1012, 582.5, 808.3000000000001, 892.4499999999999, 1012.0, 0.25636330342428126, 0.9395189325444058, 0.49942203808826224], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68b2ad35-d042-4678-8bbc-aa004e5c15b8", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 22, 0, 0.0, 114.86363636363635, 100, 298, 103.5, 131.39999999999998, 273.99999999999966, 298.0, 0.1029355342822118, 0.07690008176356644, 0.03659036570187998], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 306.0625, 102, 593, 365.5, 510.4000000000001, 593.0, 593.0, 0.09940666645956944, 0.02079870926656519, 0.06676458482184461], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 10, 5.813953488372093, 156.08139534883713, 100, 562, 107.0, 295.80000000000007, 370.8499999999999, 502.14000000000084, 0.6908990122554238, 1.6561131131226627, 0.32677740800398475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 136.66666666666666, 101, 306, 103.0, 306.0, 306.0, 306.0, 0.044074220988144036, 0.03413169652695139, 0.015667008241879325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a13b75c6-cc58-4a6c-b9e3-6237109a04e1", 3, 0, 0.0, 333.0, 200, 555, 244.0, 555.0, 555.0, 555.0, 0.07505065919495658, 0.03395846884146799, 0.04812818965301579], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49fd73c5-c8c6-4958-9310-2acb09ebeeec", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 12, 100.0, 102.25000000000001, 99, 107, 101.5, 107.0, 107.0, 107.0, 0.05990026605701507, 0.029774643967793623, 0.03006712573565014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 147.93749999999997, 101, 317, 107.0, 306.5, 317.0, 317.0, 0.11167257600714704, 0.0906249127558, 0.03969611100254055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f214e5fb-1eaa-4c2f-8016-714279801aad", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 466.58333333333326, 152, 980, 447.0, 911.0, 963.5, 980.0, 0.11294489700837204, 0.06937728536940041, 0.05106785870593385], "isController": false}, {"data": ["login", 24, 6, 25.0, 1766.5416666666667, 1269, 2396, 1735.0, 2319.5, 2390.0, 2396.0, 0.11157289894284678, 0.16686903782321275, 0.16735934841427016], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 6, 100.0, 100.5, 99, 102, 101.0, 102.0, 102.0, 102.0, 0.04406645220993258, 0.021904125170757505, 0.022119293394438817], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 139.47368421052627, 102, 304, 105.0, 300.0, 304.0, 304.0, 0.10726645552111738, 0.08683973791699835, 0.03812987286102219], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bbe82b89-b136-4c8a-9c1d-bf5aa2af2553", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.050372456395349, 4.008448401162791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f214e5fb-1eaa-4c2f-8016-714279801aad", 3, 0, 0.0, 271.0, 177, 399, 237.0, 399.0, 399.0, 399.0, 0.022769707181565645, 0.02283641530807414, 0.01460166769130349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, 100.0, 140.00000000000003, 99, 303, 101.0, 299.4, 303.0, 303.0, 0.08928730870194111, 0.04438207043875783, 0.04481804362577903], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68b2ad35-d042-4678-8bbc-aa004e5c15b8", 3, 0, 0.0, 294.3333333333333, 247, 364, 272.0, 364.0, 364.0, 364.0, 0.03510537463285629, 0.029265906391518545, 0.022512235685783494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3c5846e-2e25-4ad7-a9ad-0c37e2070d0e", 3, 0, 0.0, 297.6666666666667, 198, 353, 342.0, 353.0, 353.0, 353.0, 0.04621285641665511, 0.03783376754163008, 0.029635197636982608], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3c5846e-2e25-4ad7-a9ad-0c37e2070d0e", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.49769714187327824, 1.8993199035812673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb764fc5-04c9-4f11-ba1e-240d195e0db3", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 128.58333333333334, 99, 356, 104.5, 287.30000000000024, 356.0, 356.0, 0.05748613147078267, 0.047661841424506336, 0.020434523296254777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e0bc3b1-1840-4e68-8b70-581a3710554d", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8bcdb2a-2631-4557-b1ff-3b28da5afc2a", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 0.30466115092748736, 1.1626528246205734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, 100.0, 101.25000000000001, 99, 104, 101.0, 104.0, 104.0, 104.0, 0.07808039352518337, 0.03881144560968587, 0.03919269753119556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 116.5625, 101, 297, 103.5, 171.70000000000013, 297.0, 297.0, 0.07580459470599661, 0.05885219999147199, 0.026946164524397236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, 100.0, 138.4375, 100, 305, 101.5, 299.4, 305.0, 305.0, 0.11014125616102652, 0.054747948619104, 0.05528574772145276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 14, 100.0, 116.2142857142857, 98, 296, 102.0, 203.5, 296.0, 296.0, 0.11531175356230952, 0.05731804937814019, 0.06587634358784285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=266625ee-d0d8-4b0f-ba0c-c7f830411d51", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.5376906622023809, 2.051943824404762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/266625ee-d0d8-4b0f-ba0c-c7f830411d51", 3, 0, 0.0, 434.0, 188, 813, 301.0, 813.0, 813.0, 813.0, 0.07423537563100069, 0.034411189745620116, 0.04760536783628625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/accce233-a4f6-4eee-9e1f-9d55f358e190", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.7513786764705882, 1.403952205882353], "isController": false}, {"data": ["register", 26, 7, 26.923076923076923, 872.2692307692308, 145, 1737, 849.0, 1407.0, 1623.9499999999996, 1737.0, 0.10157360961355148, 0.03197065987686153, 0.045827155899864046], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 3.255813953488372, 1.1182108626198084], "isController": false}, {"data": ["401/Unauthorized", 18, 8.372093023255815, 2.8753993610223643], "isController": false}, {"data": ["404/Not Found", 190, 88.37209302325581, 30.35143769968051], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 626, 215, "404/Not Found", 190, "401/Unauthorized", 18, "406/Not Acceptable", 7, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 22, "404/Not Found", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, "404/Not Found", 60, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
