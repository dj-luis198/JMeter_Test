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

    var data = {"OkPercent": 97.97822706065318, "KoPercent": 2.021772939346812};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8066976127320955, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/01650a7d-8f04-47ed-94b3-25b9cbd3ecf1"], "isController": false}, {"data": [0.3018867924528302, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/19c02f9a-eba1-4438-af81-dac352c2a0ec"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.53125, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b51c2988-08cc-421c-bf09-3d8ee8e78c29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/17cd328b-113c-4dd3-8144-fc4b8a1803c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd65547a-fc68-4feb-8a77-1269681db326"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e2784f9b-78f8-4d89-8cee-11ce6c4d29c8"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6fa6b824-f70c-43bc-b2ee-55eecac359c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.71875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c0874bf-080b-4206-b596-695877b4a7ad"], "isController": false}, {"data": [0.8409090909090909, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd65547a-fc68-4feb-8a77-1269681db326"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84d552b0-1b79-4ae0-88d8-0d3c569d02c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bdfebb66-e7a8-4504-968b-d0066a90e7be"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/220262f6-8881-413b-955c-3e6fa7a634af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/547be024-f055-45f7-9f66-5f2c5dec09c6"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01eea303-3722-4f9a-a212-934e8f97b13a"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b8e862c3-6fb5-4069-96a6-a94842984c9c"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19c02f9a-eba1-4438-af81-dac352c2a0ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2784f9b-78f8-4d89-8cee-11ce6c4d29c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4811320754716981, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17cd328b-113c-4dd3-8144-fc4b8a1803c2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b509ed18-333d-4d4c-83df-dba23a3448bd"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.78125, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3898305084745763, 500, 1500, "addBook"], "isController": true}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7547169811320755, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9590643274853801, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6fa6b824-f70c-43bc-b2ee-55eecac359c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/01eea303-3722-4f9a-a212-934e8f97b13a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3dad4c3e-ab8c-4584-824b-1af29ad53bd7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c0874bf-080b-4206-b596-695877b4a7ad"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=220262f6-8881-413b-955c-3e6fa7a634af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b509ed18-333d-4d4c-83df-dba23a3448bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b51c2988-08cc-421c-bf09-3d8ee8e78c29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84d552b0-1b79-4ae0-88d8-0d3c569d02c1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01650a7d-8f04-47ed-94b3-25b9cbd3ecf1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bdfebb66-e7a8-4504-968b-d0066a90e7be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1286, 26, 2.021772939346812, 306.2472783825811, 80, 1680, 98.0, 848.3, 1026.549999999999, 1396.5099999999968, 5.102344459829949, 715.2962975889835, 3.7201559902456345], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/01650a7d-8f04-47ed-94b3-25b9cbd3ecf1", 3, 0, 0.0, 291.6666666666667, 182, 394, 299.0, 394.0, 394.0, 394.0, 0.019982149279976553, 0.023618223969920207, 0.0128140735942558], "isController": false}, {"data": ["see books", 53, 0, 0.0, 1454.3018867924532, 1176, 2071, 1397.0, 1762.4, 1870.4999999999995, 2071.0, 0.24139957094642295, 290.4841029273114, 1.1869598044094136], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/19c02f9a-eba1-4438-af81-dac352c2a0ec", 3, 0, 0.0, 298.3333333333333, 204, 440, 251.0, 440.0, 440.0, 440.0, 0.02404231447347331, 0.028417201775124218, 0.015417760258054174], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 446.875, 89, 685, 509.0, 680.8, 685.0, 685.0, 0.0849202810861304, 0.017161319010997177, 0.05695733452487103], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 446.875, 89, 685, 509.0, 680.8, 685.0, 685.0, 0.08559857478372986, 0.017298393622371188, 0.05741227650747115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b51c2988-08cc-421c-bf09-3d8ee8e78c29", 1, 0, 0.0, 648.0, 648, 648, 648.0, 648.0, 648.0, 648.0, 1.5432098765432098, 0.27880256558641975, 1.0639708719135803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 149.25, 83, 258, 88.0, 255.9, 258.0, 258.0, 0.12651821862348178, 0.057606561946482795, 0.07082672736905364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 106.62500000000001, 82, 256, 86.0, 253.2, 256.0, 256.0, 0.12651621779766895, 0.09402230639065046, 0.06350521088672055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 209.1875, 83, 672, 168.5, 548.1000000000001, 672.0, 672.0, 0.1263483740543614, 4.673625122399987, 0.07304515375017767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 240.37499999999997, 80, 1074, 85.5, 966.2000000000002, 1074.0, 1074.0, 0.12651821862348178, 14.260002476001075, 0.07301979219382591], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 176.0625, 85, 279, 184.0, 257.3, 279.0, 279.0, 0.08443360879798203, 0.16494031269459308, 0.054569548557240714], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/17cd328b-113c-4dd3-8144-fc4b8a1803c2", 3, 0, 0.0, 514.3333333333334, 183, 956, 404.0, 956.0, 956.0, 956.0, 0.024426983674632575, 0.024498547103366852, 0.015664439400724667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 95.22222222222221, 83, 253, 86.0, 105.40000000000023, 253.0, 253.0, 0.09135803722332472, 0.06789401008491222, 0.04585745227811417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 103.55555555555557, 82, 254, 86.0, 250.4, 254.0, 254.0, 0.09128298231645782, 0.032042149283175024, 0.05163391784024464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 595.5, 496, 749, 578.0, 749.0, 749.0, 749.0, 0.07040766035344645, 20.70218989826093, 0.04015436879532493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd65547a-fc68-4feb-8a77-1269681db326", 3, 0, 0.0, 282.3333333333333, 170, 357, 320.0, 357.0, 357.0, 357.0, 0.026325719350281246, 0.026574236883210336, 0.01688205309897593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 798.3333333333333, 745, 903, 780.0, 903.0, 903.0, 903.0, 0.07007299270072993, 63.05180200729927, 0.03989507299270073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 224.0, 86, 254, 252.5, 254.0, 254.0, 254.0, 0.07061565078206833, 0.12495660079795685, 0.039100658196711664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 127.33333333333333, 84, 252, 87.0, 251.4, 252.0, 252.0, 0.07432687721819274, 0.05523706402641081, 0.03730860829116315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 127.33333333333334, 82, 259, 85.5, 256.90000000000003, 259.0, 259.0, 0.07425099310703281, 0.038454860036877994, 0.0413069489648174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2784f9b-78f8-4d89-8cee-11ce6c4d29c8", 3, 0, 0.0, 255.0, 176, 399, 190.0, 399.0, 399.0, 399.0, 0.02040760795624609, 0.02412110172172186, 0.013086910050066666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 259.3333333333333, 83, 1055, 88.5, 948.2000000000004, 1055.0, 1055.0, 0.07388343656491275, 11.096669261565836, 0.04237715339432822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 196.33333333333331, 83, 669, 88.0, 618.0000000000002, 669.0, 669.0, 0.07413768603925591, 3.6498089023915585, 0.04259538276669488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6fa6b824-f70c-43bc-b2ee-55eecac359c4", 3, 0, 0.0, 278.3333333333333, 171, 479, 185.0, 479.0, 479.0, 479.0, 0.028885037550548817, 0.029157715313884076, 0.018523282543808972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 91.16666666666667, 85, 106, 86.5, 106.0, 106.0, 106.0, 0.07073886747073178, 0.05257058412619814, 0.03972153202702225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 131.33333333333334, 82, 591, 85.0, 288.6000000000005, 591.0, 591.0, 0.09128344524007546, 4.586403782494371, 0.0532288666146013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 583.6470588235294, 83, 1096, 834.0, 1030.3999999999999, 1096.0, 1096.0, 0.08434338673427368, 44.65190639310468, 0.04532100410801907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 152.7222222222222, 84, 803, 85.0, 309.80000000000075, 803.0, 803.0, 0.09135989199230546, 1.5156364199864991, 0.05336266260791887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 429.70588235294116, 84, 752, 645.0, 749.6, 752.0, 752.0, 0.0843438051955784, 14.59752500545754, 0.04540359596092401], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 394.4375, 87, 771, 397.0, 729.7, 771.0, 771.0, 0.08568383735065574, 0.017315624113038403, 0.057929679341626815], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 387.75, 171, 1308, 176.5, 1200.6000000000004, 1308.0, 1308.0, 0.0738438817267161, 14.819195467062553, 0.1629276791483339], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c0874bf-080b-4206-b596-695877b4a7ad", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 486.40909090909093, 95, 1279, 406.5, 1135.1999999999998, 1263.0999999999997, 1279.0, 0.09602164851712022, 0.05898204777077014, 0.0434160383431901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 86.6470588235294, 84, 98, 86.0, 90.0, 98.0, 98.0, 0.08434296827712123, 0.06268066294813404, 0.04233621649847687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 135.94117647058826, 83, 260, 87.0, 259.2, 260.0, 260.0, 0.08434464213064488, 0.09708742756283675, 0.043935961330462306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd65547a-fc68-4feb-8a77-1269681db326", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 0.48828125, 1.8633868243243243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84d552b0-1b79-4ae0-88d8-0d3c569d02c1", 3, 0, 0.0, 259.6666666666667, 177, 403, 199.0, 403.0, 403.0, 403.0, 0.02066229544327511, 0.02072282951195658, 0.013250235033610667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bdfebb66-e7a8-4504-968b-d0066a90e7be", 3, 0, 0.0, 278.6666666666667, 166, 420, 250.0, 420.0, 420.0, 420.0, 0.05764242482467096, 0.0370585250744548, 0.036964706023633394], "isController": false}, {"data": ["login", 22, 0, 0.0, 2218.909090909091, 1201, 3374, 2226.5, 3045.4, 3331.9999999999995, 3374.0, 0.09553545450992483, 31.301304506776503, 0.18734753681371888], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 99.7222222222222, 86, 253, 90.5, 113.50000000000023, 253.0, 253.0, 0.08676580463232991, 0.07024301957050927, 0.03084253211539852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/220262f6-8881-413b-955c-3e6fa7a634af", 3, 0, 0.0, 253.0, 193, 369, 197.0, 369.0, 369.0, 369.0, 0.05377114998566103, 0.034569668366432466, 0.03448215021866934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/547be024-f055-45f7-9f66-5f2c5dec09c6", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 1.6376201923076923, 3.059895833333333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 672.5294117647059, 170, 1186, 927.0, 1117.2, 1186.0, 1186.0, 0.08430657839271988, 59.38319916344318, 0.17691886576656995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01eea303-3722-4f9a-a212-934e8f97b13a", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 0.91244476010101, 3.4820864898989896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 411.25000000000006, 171, 1161, 340.0, 1054.6000000000001, 1161.0, 1161.0, 0.12626362266116367, 19.05312209001807, 0.2799316302211981], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 488.16666666666663, 85, 1009, 461.5, 981.4000000000001, 1009.0, 1009.0, 0.13998740113389796, 83.75552840869322, 0.20420525433960945], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 848.0416666666666, 156, 1517, 823.0, 1488.0, 1510.75, 1517.0, 0.10167811251530467, 0.03177441016103271, 0.04587430466999098], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b8e862c3-6fb5-4069-96a6-a94842984c9c", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.7426417151162791, 1.3876271802325582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 267.8333333333333, 167, 891, 174.0, 541.8000000000005, 891.0, 891.0, 0.09124226341641449, 6.197855482075965, 0.20390903399788116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 103.06666666666668, 86, 258, 89.0, 166.80000000000007, 258.0, 258.0, 0.08288712431410905, 0.06435084358370771, 0.02946378247103095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 251.94736842105263, 169, 506, 176.0, 503.0, 506.0, 506.0, 0.13437533151808764, 0.20825551867109868, 0.3022132700060115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19c02f9a-eba1-4438-af81-dac352c2a0ec", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 122.77777777777777, 83, 254, 87.0, 254.0, 254.0, 254.0, 0.04180563168309473, 0.031068443076987393, 0.02098446746592841], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2784f9b-78f8-4d89-8cee-11ce6c4d29c8", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 0.5004544667590027, 1.9098424515235457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 102.44444444444444, 81, 252, 85.0, 252.0, 252.0, 252.0, 0.04180718526157362, 0.011186688243819505, 0.023843160344491205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 121.22222222222221, 84, 251, 85.0, 251.0, 251.0, 251.0, 0.04180660265611282, 0.01126818587215541, 0.02457770976462883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 131.33333333333334, 82, 343, 85.0, 343.0, 343.0, 343.0, 0.041807379467002366, 0.011268395246965482, 0.02461899396347893], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 93.66666666666667, 87, 106, 88.0, 106.0, 106.0, 106.0, 0.15865460891638902, 0.046790714739013174, 0.09807457758210376], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1006.3396226415097, 650, 1680, 932.0, 1375.8, 1482.5999999999995, 1680.0, 0.23974415227824797, 286.81735467772506, 0.47340105069005606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 848.0416666666666, 156, 1517, 823.0, 1488.0, 1510.75, 1517.0, 0.09867609571581284, 0.030836279911191512, 0.04451987912178275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 158.33333333333331, 84, 347, 86.0, 347.0, 347.0, 347.0, 0.03125634894587963, 0.00842456280181912, 0.018405838295278726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 83.5, 82, 86, 83.5, 86.0, 86.0, 86.0, 0.031256674602389053, 0.008424650576425174, 0.018375505967420127], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17cd328b-113c-4dd3-8144-fc4b8a1803c2", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 180.06666666666666, 84, 1008, 86.0, 555.6000000000003, 1008.0, 1008.0, 0.0844005311606761, 5.084148428532444, 0.04913473630460714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b509ed18-333d-4d4c-83df-dba23a3448bd", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 163.33333333333334, 83, 745, 86.0, 451.00000000000017, 745.0, 745.0, 0.08440100605999223, 1.675678672006437, 0.04921743563016604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 85.0, 83, 87, 85.0, 87.0, 87.0, 87.0, 0.0312565117732861, 0.008363558814336319, 0.017825979370702228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 114.53333333333332, 84, 336, 87.0, 286.8, 336.0, 336.0, 0.08448038928563383, 0.0627827893030931, 0.04240519540314042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 85.66666666666667, 83, 87, 86.0, 87.0, 87.0, 87.0, 0.03125553483429357, 0.023227990243063875, 0.015688813383620017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 84.73333333333333, 82, 88, 85.0, 87.4, 88.0, 88.0, 0.08448086508405846, 0.03106431809861733, 0.04770748852468249], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 90.5, 87, 96, 89.0, 96.0, 96.0, 96.0, 0.03054912043990734, 0.024045499096255186, 0.01085925765637331], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 364.375, 85, 724, 400.0, 552.5000000000002, 724.0, 724.0, 0.08375077862052, 0.0164955909795177, 0.056990809987803794], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1196.9545454545453, 636, 1665, 1249.0, 1544.0, 1650.4499999999998, 1665.0, 0.09576917886635411, 0.049568032030437185, 0.044050081294973426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 245.16666666666669, 167, 434, 174.5, 434.0, 434.0, 434.0, 0.031241864097891175, 0.0484187874251497, 0.07026368458734704], "isController": false}, {"data": ["addBook", 59, 6, 10.169491525423728, 900.2203389830506, 441, 2418, 727.0, 1564.0, 1776.0, 2418.0, 0.2949528075507919, 96.86456514613911, 1.0713422571138618], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 149.03773584905662, 82, 591, 87.0, 345.0, 404.2999999999998, 591.0, 0.24064547472995493, 0.17883906862255436, 0.11632764647590593], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 541.6415094339626, 406, 814, 500.0, 672.6, 676.3, 814.0, 0.24078979051288224, 70.8001933843005, 0.12110033409583433], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 129.03773584905665, 83, 342, 88.0, 251.2, 257.4, 342.0, 0.24124244410458087, 0.4268860436694341, 0.11732298551179812], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 854.0943396226415, 564, 1244, 842.0, 1077.0, 1108.6999999999998, 1244.0, 0.24043368793521902, 216.34265504145213, 0.12068644101435798], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 116.89473684210526, 85, 275, 89.0, 254.0, 275.0, 275.0, 0.13582391501712096, 0.101470014636814, 0.048281157291242216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 6, 3.508771929824561, 143.9122807017544, 84, 1290, 91.0, 244.60000000000008, 291.20000000000005, 832.8000000000008, 0.6997986544222364, 1.5046206597648513, 0.3381936536753753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 105.77777777777777, 86, 248, 89.0, 248.0, 248.0, 248.0, 0.04096140980069998, 0.03172109176948739, 0.014560501140092573], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6fa6b824-f70c-43bc-b2ee-55eecac359c4", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 89.125, 86, 96, 88.5, 93.2, 96.0, 96.0, 0.11953232975981473, 0.0970032871390684, 0.04249000784430915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01eea303-3722-4f9a-a212-934e8f97b13a", 3, 0, 0.0, 784.6666666666666, 279, 1351, 724.0, 1351.0, 1351.0, 1351.0, 0.08798944126704795, 0.03981293078163954, 0.05642552060419417], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3dad4c3e-ab8c-4584-824b-1af29ad53bd7", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.8895617603550294, 3.5306490384615383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c0874bf-080b-4206-b596-695877b4a7ad", 3, 0, 0.0, 286.3333333333333, 190, 401, 268.0, 401.0, 401.0, 401.0, 0.028277877274012632, 0.02836072261758884, 0.018133925205014608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 274.55555555555554, 169, 591, 172.0, 591.0, 591.0, 591.0, 0.04178893800378886, 0.06476469200391888, 0.09398430099875563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 307.4, 171, 1345, 175.0, 842.8000000000003, 1345.0, 1345.0, 0.08435970980259827, 6.850261075726899, 0.18828801635172374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=220262f6-8881-413b-955c-3e6fa7a634af", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 103.33333333333334, 87, 254, 90.0, 206.00000000000017, 254.0, 254.0, 0.0767528430532281, 0.06363590210174869, 0.027283237179077175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b509ed18-333d-4d4c-83df-dba23a3448bd", 3, 0, 0.0, 572.3333333333334, 248, 1061, 408.0, 1061.0, 1061.0, 1061.0, 0.021062534665421635, 0.02489520291996939, 0.013506898857708538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b51c2988-08cc-421c-bf09-3d8ee8e78c29", 3, 0, 0.0, 237.66666666666669, 167, 374, 172.0, 374.0, 374.0, 374.0, 0.041090261607998904, 0.033853988323517326, 0.026350200315025336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 99.76470588235294, 86, 250, 89.0, 131.5999999999999, 250.0, 250.0, 0.08681885501251213, 0.06740331028803431, 0.03086138986772892], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84d552b0-1b79-4ae0-88d8-0d3c569d02c1", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01650a7d-8f04-47ed-94b3-25b9cbd3ecf1", 1, 0, 0.0, 712.0, 712, 712, 712.0, 712.0, 712.0, 712.0, 1.4044943820224718, 0.25374166081460675, 0.9683330407303371], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bdfebb66-e7a8-4504-968b-d0066a90e7be", 1, 0, 0.0, 771.0, 771, 771, 771.0, 771.0, 771.0, 771.0, 1.297016861219196, 0.23432433527885863, 0.8942323281452659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 104.1578947368421, 84, 257, 85.0, 248.0, 257.0, 257.0, 0.13445616021512985, 0.09992298625362678, 0.0674906897954851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 128.42105263157893, 83, 254, 86.0, 251.0, 254.0, 254.0, 0.13445806323775017, 0.03597803645228862, 0.0766831141902794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 111.3157894736842, 82, 253, 85.0, 252.0, 253.0, 253.0, 0.13445806323775017, 0.03624064985704985, 0.07904663483313047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 128.3157894736842, 83, 257, 85.0, 252.0, 257.0, 257.0, 0.13445901476926125, 0.03624090632452745, 0.07917850186119585], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 30.76923076923077, 0.6220839813374806], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.538461538461538, 0.2332814930015552], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 11.538461538461538, 0.2332814930015552], "isController": false}, {"data": ["401/Unauthorized", 12, 46.15384615384615, 0.9331259720062208], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1286, 26, "401/Unauthorized", 12, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
