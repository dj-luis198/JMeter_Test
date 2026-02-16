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

    var data = {"OkPercent": 64.42622950819673, "KoPercent": 35.57377049180328};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.47182254196642687, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19387f2a-7297-4c9d-93b0-3f54a4cdf1d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=545f2a55-84e2-4ad0-9d1c-f2a2e75ed59d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8311ca35-61c9-40ed-aba2-aac9a1ef06d6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5509093a-f3aa-415b-aaac-95787999402a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2cb23343-06a7-4e7c-929d-6ea75e5d7771"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/19387f2a-7297-4c9d-93b0-3f54a4cdf1d2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8311ca35-61c9-40ed-aba2-aac9a1ef06d6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.59375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/545f2a55-84e2-4ad0-9d1c-f2a2e75ed59d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c17452b2-3bbd-4170-b280-0e6667d3b12d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5509093a-f3aa-415b-aaac-95787999402a"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.71875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8337c9de-6c29-4ab7-9d22-69251c9108d3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=117aa8f1-9c3c-470e-ad94-740e8fb127b4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11360907-e2b6-4749-ad17-1f261841d82a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fcda0a96-049a-493f-9001-13028c64bc45"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fcda0a96-049a-493f-9001-13028c64bc45"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/11360907-e2b6-4749-ad17-1f261841d82a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8337c9de-6c29-4ab7-9d22-69251c9108d3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1b1f8c7d-6387-482b-b564-d2a808bd683a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/117aa8f1-9c3c-470e-ad94-740e8fb127b4"], "isController": false}, {"data": [0.8863636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/71e0ab54-3c1a-4e73-8655-6fd4a42349ed"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b1f8c7d-6387-482b-b564-d2a808bd683a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71e0ab54-3c1a-4e73-8655-6fd4a42349ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c17452b2-3bbd-4170-b280-0e6667d3b12d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0ffa60c9-626b-41fe-8fb0-366e788d033a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ffa60c9-626b-41fe-8fb0-366e788d033a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2651727f-b4b6-47f3-a99a-2b83a9898979"], "isController": false}, {"data": [0.2, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 610, 217, 35.57377049180328, 320.3950819672132, 138, 2350, 154.0, 696.7999999999993, 1087.6499999999987, 1770.79, 2.36374556797706, 2.4924566303547557, 1.1319784683606844], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 58, 100.0, 803.7413793103449, 569, 1136, 874.0, 1031.7, 1069.2, 1136.0, 0.25522664566180714, 1.6418741460358461, 0.4284517616139125], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 20, 100.0, 189.7, 139, 444, 148.5, 433.6, 443.5, 444.0, 0.09540983293738253, 0.04742539547375752, 0.04789126379864708], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 210.66666666666666, 143, 464, 152.0, 458.6, 464.0, 464.0, 0.07994116330380839, 0.06206369611965593, 0.02841658539315064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19387f2a-7297-4c9d-93b0-3f54a4cdf1d2", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 0.7753822424892703, 2.9590262875536477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=545f2a55-84e2-4ad0-9d1c-f2a2e75ed59d", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8311ca35-61c9-40ed-aba2-aac9a1ef06d6", 3, 0, 0.0, 340.0, 267, 469, 284.0, 469.0, 469.0, 469.0, 0.020066621182325318, 0.023718066898770585, 0.012868243401426067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5509093a-f3aa-415b-aaac-95787999402a", 3, 0, 0.0, 993.6666666666667, 404, 2122, 455.0, 2122.0, 2122.0, 2122.0, 0.02070564850091105, 0.020766309580503562, 0.013278036310805588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, 100.0, 165.81250000000003, 139, 438, 148.5, 239.20000000000022, 438.0, 438.0, 0.08157896078601329, 0.04055047953132887, 0.04094881430079183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2cb23343-06a7-4e7c-929d-6ea75e5d7771", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19387f2a-7297-4c9d-93b0-3f54a4cdf1d2", 3, 0, 0.0, 313.6666666666667, 237, 452, 252.0, 452.0, 452.0, 452.0, 0.0872093023255814, 0.039459938226744186, 0.05592523619186047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 147.25, 141, 154, 147.0, 154.0, 154.0, 154.0, 0.047367548492527764, 0.013969726215569713, 0.029280916206806718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8311ca35-61c9-40ed-aba2-aac9a1ef06d6", 1, 0, 0.0, 815.0, 815, 815, 815.0, 815.0, 815.0, 815.0, 1.2269938650306749, 0.22167369631901843, 0.845954754601227], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, 100.0, 263.46551724137936, 139, 653, 149.0, 586.0, 600.55, 653.0, 0.26506894077537235, 0.13175790122525832, 0.12813391180059502], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 463.75, 147, 1057, 465.0, 861.7000000000002, 1057.0, 1057.0, 0.08702699468591414, 0.018208528917438578, 0.058110066031732216], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 463.75, 147, 1057, 465.0, 861.7000000000002, 1057.0, 1057.0, 0.08842563680275004, 0.01850116473143476, 0.05904397379285189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, 40.0, 1001.3199999999998, 166, 1909, 1100.0, 1811.0000000000002, 1902.1, 1909.0, 0.10016868406396372, 0.031067943416713744, 0.045193293005421124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/545f2a55-84e2-4ad0-9d1c-f2a2e75ed59d", 3, 0, 0.0, 470.0, 298, 783, 329.0, 783.0, 783.0, 783.0, 0.018197810196839647, 0.025087150450395803, 0.011669819690030633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c17452b2-3bbd-4170-b280-0e6667d3b12d", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5509093a-f3aa-415b-aaac-95787999402a", 1, 0, 0.0, 976.0, 976, 976, 976.0, 976.0, 976.0, 976.0, 1.0245901639344264, 0.18510662141393444, 0.7064068903688525], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 550.7333333333333, 150, 1206, 556.0, 952.2000000000002, 1206.0, 1206.0, 0.09655616350177021, 0.023554423479240427, 0.0640816100740264], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 248.33333333333334, 141, 436, 168.0, 436.0, 436.0, 436.0, 0.020704648193519446, 0.016296822699195967, 0.007359855412540115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1318.5454545454545, 807, 2350, 1159.0, 1824.5, 2274.549999999999, 2350.0, 0.09717014049918953, 0.05029313912555707, 0.044694468921013926], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 262.93749999999994, 139, 511, 253.0, 436.1000000000001, 511.0, 511.0, 0.08669737198591168, 0.14482017068545108, 0.054207023841777294], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 3, 100.0, 144.33333333333334, 140, 147, 146.0, 147.0, 147.0, 147.0, 0.020069440263311054, 0.009975922943384109, 0.010073918257169807], "isController": false}, {"data": ["addBook", 56, 56, 100.0, 872.5535714285712, 596, 1650, 813.0, 1203.6000000000006, 1463.05, 1650.0, 0.2534705091588853, 0.8686748711713507, 0.4941711330471229], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8337c9de-6c29-4ab7-9d22-69251c9108d3", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=117aa8f1-9c3c-470e-ad94-740e8fb127b4", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.3421667850378788, 1.305782433712121], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11360907-e2b6-4749-ad17-1f261841d82a", 1, 0, 0.0, 668.0, 668, 668, 668.0, 668.0, 668.0, 668.0, 1.4970059880239521, 0.27045518338323354, 1.0321154565868262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 187.24999999999997, 143, 449, 151.5, 435.0, 449.0, 449.0, 0.08004202206158233, 0.059797018434678204, 0.02845243752970309], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 461.1875, 141, 976, 446.0, 901.8000000000001, 976.0, 976.0, 0.08859259587379985, 0.018536097330040642, 0.05950152130098227], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 12, 7.0588235294117645, 233.51764705882348, 139, 1027, 154.0, 437.9, 518.6499999999996, 948.8999999999992, 0.719098842250864, 1.6481152273938589, 0.34161738944912795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 151.44444444444446, 147, 165, 150.0, 165.0, 165.0, 165.0, 0.046886965944433735, 0.03630992577532808, 0.01666685117556043], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fcda0a96-049a-493f-9001-13028c64bc45", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fcda0a96-049a-493f-9001-13028c64bc45", 3, 0, 0.0, 583.0, 254, 1206, 289.0, 1206.0, 1206.0, 1206.0, 0.021400292470663766, 0.02567059822734244, 0.01372349484609623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11360907-e2b6-4749-ad17-1f261841d82a", 3, 0, 0.0, 364.3333333333333, 246, 556, 291.0, 556.0, 556.0, 556.0, 0.04054875988376022, 0.026068945563289855, 0.026002948232749883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 12, 100.0, 149.41666666666663, 143, 163, 149.5, 159.4, 163.0, 163.0, 0.06826598704084014, 0.033932995511511355, 0.034266325526359206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8337c9de-6c29-4ab7-9d22-69251c9108d3", 3, 0, 0.0, 402.66666666666663, 251, 700, 257.0, 700.0, 700.0, 700.0, 0.049137634514274484, 0.031590764376852896, 0.031510787758177325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b1f8c7d-6387-482b-b564-d2a808bd683a", 3, 0, 0.0, 390.3333333333333, 248, 641, 282.0, 641.0, 641.0, 641.0, 0.03035669112066785, 0.02530712433594738, 0.019467018719959525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 150.37499999999997, 142, 160, 150.0, 159.3, 160.0, 160.0, 0.11192176668508712, 0.09082713683135489, 0.039784690501339565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/117aa8f1-9c3c-470e-ad94-740e8fb127b4", 3, 0, 0.0, 906.3333333333334, 511, 1459, 749.0, 1459.0, 1459.0, 1459.0, 0.024867167878250346, 0.024940020909143656, 0.015946718984424863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 430.5909090909091, 155, 1193, 371.5, 846.1999999999999, 1145.2999999999993, 1193.0, 0.09534788977783941, 0.05856818620142675, 0.04311139938197231], "isController": false}, {"data": ["login", 22, 8, 36.36363636363637, 2166.409090909091, 1239, 3832, 2166.5, 3268.0, 3761.799999999999, 3832.0, 0.096192104377178, 0.1458082377606478, 0.1439038663760499], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 9, 100.0, 148.44444444444446, 144, 153, 149.0, 153.0, 153.0, 153.0, 0.047654599463091515, 0.023687686647181228, 0.023920375121122106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 223.45000000000005, 141, 454, 154.5, 441.8, 453.45, 454.0, 0.09285180387841985, 0.07517006388204107, 0.03300591465990706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71e0ab54-3c1a-4e73-8655-6fd4a42349ed", 3, 0, 0.0, 381.3333333333333, 237, 625, 282.0, 625.0, 625.0, 625.0, 0.0510013260344769, 0.03172641082418143, 0.03270592847914046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, 100.0, 166.93333333333334, 140, 425, 148.0, 263.6000000000001, 425.0, 425.0, 0.07848513229977135, 0.03901262923885119, 0.039395857423908665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b1f8c7d-6387-482b-b564-d2a808bd683a", 1, 0, 0.0, 870.0, 870, 870, 870.0, 870.0, 870.0, 870.0, 1.1494252873563218, 0.20765984195402298, 0.7924748563218391], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71e0ab54-3c1a-4e73-8655-6fd4a42349ed", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c17452b2-3bbd-4170-b280-0e6667d3b12d", 3, 0, 0.0, 344.6666666666667, 239, 443, 352.0, 443.0, 443.0, 443.0, 0.06897185948133162, 0.031207970273128563, 0.04423000103457789], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ffa60c9-626b-41fe-8fb0-366e788d033a", 3, 0, 0.0, 716.6666666666666, 229, 1192, 729.0, 1192.0, 1192.0, 1192.0, 0.03928501276762915, 0.03275029872978459, 0.025192537484449683], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 228.16666666666666, 145, 463, 157.5, 458.5, 463.0, 463.0, 0.06751852539540536, 0.055979714903026515, 0.024000725824148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 23, 23, 100.0, 159.47826086956525, 140, 442, 147.0, 154.2, 384.59999999999917, 442.0, 0.10346704574592992, 0.05143039676238118, 0.05193560694668748], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 23, 0, 0.0, 166.13043478260872, 140, 416, 151.0, 186.60000000000002, 370.9999999999994, 416.0, 0.10473349878190387, 0.08131165188634139, 0.037229485895129893], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ffa60c9-626b-41fe-8fb0-366e788d033a", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, 100.0, 163.87499999999997, 138, 437, 146.0, 238.9000000000002, 437.0, 437.0, 0.11048808109825153, 0.05492034499903323, 0.05545983758252078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 15, 100.0, 166.53333333333333, 139, 443, 148.0, 268.4000000000001, 443.0, 443.0, 0.12175621159606159, 0.06052139814687046, 0.06920128432510532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2651727f-b4b6-47f3-a99a-2b83a9898979", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 1.1486904226618704, 2.146329811151079], "isController": false}, {"data": ["register", 25, 10, 40.0, 1001.3199999999998, 166, 1909, 1100.0, 1811.0000000000002, 1902.1, 1909.0, 0.10451854577076157, 0.032417080211712766, 0.047155828267667815], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 4.608294930875576, 1.639344262295082], "isController": false}, {"data": ["401/Unauthorized", 20, 9.216589861751151, 3.278688524590164], "isController": false}, {"data": ["404/Not Found", 187, 86.17511520737327, 30.65573770491803], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 610, 217, "404/Not Found", 187, "401/Unauthorized", 20, "406/Not Acceptable", 10, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, "404/Not Found", 58, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 3, "404/Not Found", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 23, 23, "404/Not Found", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
