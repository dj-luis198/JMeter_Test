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

    var data = {"OkPercent": 98.36187639612807, "KoPercent": 1.6381236038719285};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.813662604233483, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2543859649122807, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4724962-bda2-46d3-b237-ce528cca3159"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5263ebb-cbf3-4c1a-93de-e389455cf5ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=906d6e2f-5f00-4148-ab1d-04f246a34136"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f244458f-9b9f-4209-8d7b-df515735cfb0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65bf1889-7eb9-423f-b53b-dedc3e0abe51"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86db88f8-446e-4c0e-9a9b-bb9e4612682c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8bd6e3a4-ce89-4cd4-9d85-6d2a2ea86408"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bba492eb-f200-472a-b250-893e228f587f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6edcf6f8-e0d2-4401-bb8d-5596fdc2610a"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/98bf184a-3a25-4747-914b-609808451ead"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b652819-4b10-42d7-99ae-e0c90d63dfe7"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/64c3a088-90e2-4aa0-9755-bc3a3029bb58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8bd6e3a4-ce89-4cd4-9d85-6d2a2ea86408"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bba492eb-f200-472a-b250-893e228f587f"], "isController": false}, {"data": [0.3790322580645161, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f244458f-9b9f-4209-8d7b-df515735cfb0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/65bf1889-7eb9-423f-b53b-dedc3e0abe51"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23f7eecd-34ad-4c25-a1de-90fe4e8806bd"], "isController": false}, {"data": [0.6754385964912281, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/906d6e2f-5f00-4148-ab1d-04f246a34136"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9419889502762431, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/72def497-64e3-4aa6-9a15-209217baf7a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c5263ebb-cbf3-4c1a-93de-e389455cf5ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98bf184a-3a25-4747-914b-609808451ead"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/23f7eecd-34ad-4c25-a1de-90fe4e8806bd"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6edcf6f8-e0d2-4401-bb8d-5596fdc2610a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4724962-bda2-46d3-b237-ce528cca3159"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6b652819-4b10-42d7-99ae-e0c90d63dfe7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/53149132-d29d-4189-904a-ebfca4913bf6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/86db88f8-446e-4c0e-9a9b-bb9e4612682c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1343, 22, 1.6381236038719285, 312.29858525688826, 97, 2126, 116.0, 792.4000000000005, 987.5999999999999, 1346.6399999999976, 5.2392172773235135, 712.7860754841789, 3.84100512852272], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1487.0877192982457, 1196, 1910, 1434.0, 1723.0000000000002, 1838.7999999999997, 1910.0, 0.2519259072647476, 303.1517826658402, 1.2387177178496134], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c4724962-bda2-46d3-b237-ce528cca3159", 3, 0, 0.0, 267.0, 188, 409, 204.0, 409.0, 409.0, 409.0, 0.04429940491132736, 0.02848024892573943, 0.028408147029724898], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 469.38461538461536, 108, 1124, 421.0, 938.7999999999998, 1124.0, 1124.0, 0.09896317047547998, 0.01874888190648742, 0.06689975744507544], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 469.38461538461536, 108, 1124, 421.0, 938.7999999999998, 1124.0, 1124.0, 0.10156488042688501, 0.0192417839871247, 0.06865853057102901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 151.25, 98, 307, 102.0, 303.9, 306.85, 307.0, 0.10774584909116376, 0.036921893013759144, 0.060996356170066046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 122.9, 100, 303, 103.5, 279.8000000000004, 302.8, 303.0, 0.10785508590657593, 0.08015402380361746, 0.054138197417949244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 178.45, 101, 724, 102.0, 399.60000000000025, 708.2999999999997, 724.0, 0.10773946442712233, 1.6115361863192428, 0.06298129238874553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 181.14999999999998, 98, 912, 102.0, 300.6, 881.4499999999996, 912.0, 0.10785973919515063, 4.880237138063163, 0.06294626967091994], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 198.78571428571428, 102, 271, 204.0, 269.0, 271.0, 271.0, 0.09437714455207932, 0.21851047586304526, 0.061000182855717566], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 129.23529411764707, 101, 310, 103.0, 298.0, 310.0, 310.0, 0.10616440494851026, 0.07889757047443, 0.05328955482767019], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5263ebb-cbf3-4c1a-93de-e389455cf5ce", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 102.23529411764706, 98, 114, 101.0, 107.6, 114.0, 114.0, 0.10616970915744968, 0.028408691708145712, 0.060549912253858015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 701.6666666666667, 690, 711, 701.5, 711.0, 711.0, 711.0, 0.05600044800358403, 16.465991102928825, 0.031937755502044016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 776.0, 700, 903, 727.0, 903.0, 903.0, 903.0, 0.0560025387817581, 50.39118283778864, 0.031884257919692356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 168.83333333333334, 102, 304, 106.0, 304.0, 304.0, 304.0, 0.05631370487864397, 0.09964886058603795, 0.031181514322452274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 141.81250000000003, 99, 332, 104.0, 308.90000000000003, 332.0, 332.0, 0.10861522378130326, 0.08071893095465993, 0.054519750999599485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=906d6e2f-5f00-4148-ab1d-04f246a34136", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 162.875, 98, 305, 100.5, 304.3, 305.0, 305.0, 0.10875919355057982, 0.039311031750887064, 0.06145584801582446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 186.625, 98, 689, 101.0, 418.10000000000025, 689.0, 689.0, 0.10861669845967944, 6.135789382463155, 0.06327134827265507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 194.06250000000003, 99, 679, 102.0, 488.6000000000002, 679.0, 679.0, 0.10875845427046868, 2.0261439817489717, 0.06346013322910647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f244458f-9b9f-4209-8d7b-df515735cfb0", 3, 0, 0.0, 320.6666666666667, 207, 466, 289.0, 466.0, 466.0, 466.0, 0.0351984606539874, 0.029343508377233637, 0.02257192952094895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 104.0, 103, 105, 104.0, 105.0, 105.0, 105.0, 0.05631634769713068, 0.04185228573976216, 0.03162294914633803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 149.00000000000003, 99, 304, 103.0, 302.4, 304.0, 304.0, 0.10617302455719603, 0.028616948025181742, 0.06241812576507032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 535.7058823529413, 98, 1000, 684.0, 928.8, 1000.0, 1000.0, 0.08691339846725665, 46.0124863718513, 0.04670197203944845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 148.29411764705884, 99, 304, 102.0, 303.2, 304.0, 304.0, 0.1061710352925012, 0.028616411856181963, 0.06252063894665842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 431.05882352941177, 99, 711, 503.0, 708.6, 711.0, 711.0, 0.08691206543967281, 15.042018149284255, 0.046786130815439676], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 483.8461538461538, 111, 1000, 412.0, 945.5999999999999, 1000.0, 1000.0, 0.10180348794411771, 0.019286988926912926, 0.06963046557475899], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 387.6875, 202, 790, 402.0, 729.8000000000001, 790.0, 790.0, 0.1083981463916967, 8.262612981778949, 0.2420565541922983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65bf1889-7eb9-423f-b53b-dedc3e0abe51", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 508.85714285714295, 198, 1095, 412.0, 990.4000000000001, 1087.6, 1095.0, 0.08619734265906488, 0.052947391145070126, 0.03897399379994828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 114.76470588235296, 99, 299, 102.0, 151.79999999999987, 299.0, 299.0, 0.08691028813316702, 0.06458860280208993, 0.04362489072309359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 203.76470588235293, 98, 411, 121.0, 331.79999999999995, 411.0, 411.0, 0.08691206543967281, 0.10004273709100205, 0.04527335761758691], "isController": false}, {"data": ["login", 21, 0, 0.0, 2252.142857142857, 1392, 3350, 2234.0, 3202.2000000000003, 3338.7, 3350.0, 0.08558259331559193, 29.369682289904922, 0.16967274464395604], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86db88f8-446e-4c0e-9a9b-bb9e4612682c", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bd6e3a4-ce89-4cd4-9d85-6d2a2ea86408", 3, 0, 0.0, 792.3333333333334, 182, 1726, 469.0, 1726.0, 1726.0, 1726.0, 0.022008495279177764, 0.02207297329269098, 0.014113520735670635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 107.17647058823528, 101, 122, 106.0, 118.0, 122.0, 122.0, 0.10423117247806546, 0.08438246287530887, 0.037050924591812334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bba492eb-f200-472a-b250-893e228f587f", 1, 0, 0.0, 1000.0, 1000, 1000, 1000.0, 1000.0, 1000.0, 1000.0, 1.0, 0.1806640625, 0.689453125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6edcf6f8-e0d2-4401-bb8d-5596fdc2610a", 3, 0, 0.0, 296.3333333333333, 185, 424, 280.0, 424.0, 424.0, 424.0, 0.028079896665980267, 0.028162161988243884, 0.018006964984368858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 655.5882352941178, 203, 1103, 801.0, 1037.3999999999999, 1103.0, 1103.0, 0.08686499136459791, 61.18527380515927, 0.182287741241965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 361.95, 204, 1013, 305.5, 605.5, 992.6499999999996, 1013.0, 0.10767681879606548, 6.5994796265364135, 0.24079018296983432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 622.3333333333333, 101, 1007, 809.0, 1007.0, 1007.0, 1007.0, 0.08391921377021054, 66.93852145418012, 0.1445275348264737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98bf184a-3a25-4747-914b-609808451ead", 3, 0, 0.0, 300.0, 185, 477, 238.0, 477.0, 477.0, 477.0, 0.021092893101217765, 0.024931085563320864, 0.013526366995247067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b652819-4b10-42d7-99ae-e0c90d63dfe7", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 912.3478260869564, 128, 1953, 973.0, 1605.0, 1887.799999999999, 1953.0, 0.0935255894145298, 0.02917909438765137, 0.04219611553663357], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 303.1764705882353, 204, 614, 219.0, 602.0, 614.0, 614.0, 0.10609483630190845, 0.1644262746202429, 0.23860977344071793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 22, 0, 0.0, 115.45454545454545, 101, 305, 106.0, 114.8, 276.64999999999964, 305.0, 0.11693606255016292, 0.09078532199939406, 0.04156711598462822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 316.1111111111111, 203, 594, 306.0, 428.40000000000026, 594.0, 594.0, 0.10423603671424848, 0.1615454983061644, 0.23442928960245535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 132.42857142857142, 99, 313, 103.0, 313.0, 313.0, 313.0, 0.040178622676814636, 0.02985930845415619, 0.02016778521082297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 101.71428571428572, 99, 104, 102.0, 104.0, 104.0, 104.0, 0.040178622676814636, 0.010750920520944542, 0.022914370745370848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 129.14285714285717, 99, 295, 102.0, 295.0, 295.0, 295.0, 0.040179083916886696, 0.010829518711973367, 0.02362090675582597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 133.0, 99, 302, 102.0, 302.0, 302.0, 302.0, 0.04017839206074973, 0.01082933223512395, 0.02365973673108602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 111.0, 111, 111, 111.0, 111.0, 111.0, 111.0, 9.00900900900901, 2.656953828828829, 5.569045608108108], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 947.421052631579, 784, 1471, 810.0, 1277.6000000000001, 1400.5999999999997, 1471.0, 0.24690181537808467, 295.38040815144177, 0.4875346393500851], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 912.3478260869564, 128, 1953, 973.0, 1605.0, 1887.799999999999, 1953.0, 0.09277635251786953, 0.028945339601787762, 0.04185808092114817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 2, 0, 0.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 0.02048152054808549, 0.005520409835226167, 0.012060895400874561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 2, 0, 0.0, 101.5, 101, 102, 101.5, 102.0, 102.0, 102.0, 0.02048152054808549, 0.005520409835226167, 0.01204089391596432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 22, 0, 0.0, 184.36363636363635, 98, 901, 103.0, 307.7, 812.0499999999988, 901.0, 0.11268067321580397, 4.637639002174225, 0.06580375252251053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 22, 0, 0.0, 173.59090909090907, 99, 689, 102.0, 305.4, 631.5499999999992, 689.0, 0.1125699724715249, 1.5334760552155715, 0.0658490366312924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 22, 0, 0.0, 112.18181818181819, 99, 304, 103.0, 112.5, 275.4999999999996, 304.0, 0.11267721052200279, 0.08373765352269934, 0.056558677937802185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 2, 0, 0.0, 101.5, 100, 103, 101.5, 103.0, 103.0, 103.0, 0.020481940049361477, 0.00548051911477055, 0.011681106434401466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 22, 0, 0.0, 138.04545454545456, 97, 311, 102.0, 304.4, 310.09999999999997, 311.0, 0.11256363682877535, 0.03780435352656758, 0.06376674064314769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 2, 0, 0.0, 104.5, 104, 105, 104.5, 105.0, 105.0, 105.0, 0.02048131080389145, 0.01522097414234511, 0.010280657962109575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64c3a088-90e2-4aa0-9755-bc3a3029bb58", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 1.1204769736842106, 2.0936129385964914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 2, 0, 0.0, 104.0, 103, 105, 104.0, 105.0, 105.0, 105.0, 0.0209391195100246, 0.01648137727058577, 0.007443202638329058], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 397.92307692307696, 101, 499, 409.0, 490.2, 499.0, 499.0, 0.10422596188536747, 0.019526708904905835, 0.07093503716056411], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8bd6e3a4-ce89-4cd4-9d85-6d2a2ea86408", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1203.7142857142858, 865, 2126, 1099.0, 1903.4, 2107.4999999999995, 2126.0, 0.08573458206432544, 0.044374344232512186, 0.03943455874247781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 2, 0, 0.0, 207.5, 207, 208, 207.5, 208.0, 208.0, 208.0, 0.020459730136159506, 0.031708585670005014, 0.04601441260114779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bba492eb-f200-472a-b250-893e228f587f", 3, 0, 0.0, 255.33333333333334, 194, 368, 204.0, 368.0, 368.0, 368.0, 0.01907401991327679, 0.026295076280184633, 0.012231711988657315], "isController": false}, {"data": ["addBook", 62, 9, 14.516129032258064, 938.3548387096774, 526, 2333, 836.5, 1491.3000000000002, 1687.95, 2333.0, 0.2903287739228569, 73.9037591942323, 1.05990032094207], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f244458f-9b9f-4209-8d7b-df515735cfb0", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65bf1889-7eb9-423f-b53b-dedc3e0abe51", 3, 0, 0.0, 272.6666666666667, 191, 398, 229.0, 398.0, 398.0, 398.0, 0.022205937867785845, 0.026246666796201305, 0.014240135937349649], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 181.68421052631578, 99, 578, 104.0, 411.4, 413.5, 578.0, 0.24764519828994475, 0.18404101161977338, 0.11971130190773695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23f7eecd-34ad-4c25-a1de-90fe4e8806bd", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 551.3684210526319, 486, 786, 505.0, 705.4, 711.3, 786.0, 0.2475989418403117, 72.80230995966743, 0.12452485844507864], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 161.2456140350877, 100, 412, 103.0, 307.2, 313.79999999999995, 412.0, 0.24802990283319773, 0.43889666399780686, 0.12062391758880123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/906d6e2f-5f00-4148-ab1d-04f246a34136", 3, 0, 0.0, 307.6666666666667, 266, 390, 267.0, 390.0, 390.0, 390.0, 0.02063713721632535, 0.024392397536613722, 0.013234101665416973], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 763.3684210526313, 679, 1016, 703.0, 905.2, 991.1999999999998, 1016.0, 0.247394759571356, 222.60623953590695, 0.12418057267546581], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 107.27777777777777, 101, 122, 105.5, 121.1, 122.0, 122.0, 0.10766065361979042, 0.08043007814369109, 0.038269997966409876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 9, 4.972375690607735, 163.06629834254133, 99, 1913, 110.0, 256.00000000000006, 307.70000000000005, 1253.7200000000055, 0.7532909659187861, 1.5392100173132068, 0.36395271876651725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 136.85714285714286, 104, 309, 108.0, 309.0, 309.0, 309.0, 0.040914377896884076, 0.0316846696017862, 0.014543782768033012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72def497-64e3-4aa6-9a15-209217baf7a3", 1, 0, 0.0, 900.0, 900, 900, 900.0, 900.0, 900.0, 900.0, 1.1111111111111112, 0.3548177083333333, 0.6629774305555556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5263ebb-cbf3-4c1a-93de-e389455cf5ce", 3, 0, 0.0, 331.6666666666667, 225, 499, 271.0, 499.0, 499.0, 499.0, 0.047359696897939854, 0.030756053161259768, 0.030370638961243982], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 147.14999999999998, 100, 469, 106.5, 305.6, 460.8499999999999, 469.0, 0.10586491636671608, 0.08591186084056744, 0.0376316694897311], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98bf184a-3a25-4747-914b-609808451ead", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.4804895279255319, 1.8336519281914894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23f7eecd-34ad-4c25-a1de-90fe4e8806bd", 3, 0, 0.0, 306.6666666666667, 212, 417, 291.0, 417.0, 417.0, 417.0, 0.03049772283669486, 0.03078562451711939, 0.019557458980562787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 266.7142857142857, 199, 615, 208.0, 615.0, 615.0, 615.0, 0.04015442243599672, 0.06223151211516288, 0.09030823717783247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 22, 0, 0.0, 343.7272727272727, 201, 1002, 310.5, 550.3999999999999, 942.8999999999992, 1002.0, 0.1125020454917362, 6.284229026997934, 0.25171134148461793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6edcf6f8-e0d2-4401-bb8d-5596fdc2610a", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4724962-bda2-46d3-b237-ce528cca3159", 1, 0, 0.0, 864.0, 864, 864, 864.0, 864.0, 864.0, 864.0, 1.1574074074074074, 0.20910192418981483, 0.7979781539351852], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 108.25, 100, 126, 106.0, 123.2, 126.0, 126.0, 0.11542762327309454, 0.09570122281138405, 0.041030912960357824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 118.52941176470588, 103, 299, 106.0, 151.79999999999987, 299.0, 299.0, 0.08463311544454788, 0.06570637380704646, 0.03008442775567913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b652819-4b10-42d7-99ae-e0c90d63dfe7", 3, 0, 0.0, 286.6666666666667, 197, 356, 307.0, 356.0, 356.0, 356.0, 0.017614006658094518, 0.024282330142262464, 0.011295440467593164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53149132-d29d-4189-904a-ebfca4913bf6", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.7639615729665072, 1.4274633672248804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86db88f8-446e-4c0e-9a9b-bb9e4612682c", 3, 0, 0.0, 290.6666666666667, 212, 399, 261.0, 399.0, 399.0, 399.0, 0.027997872161715707, 0.0330925370505175, 0.017954364634954412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 112.33333333333333, 99, 292, 102.0, 122.80000000000027, 292.0, 292.0, 0.1042988509743251, 0.07751115780416153, 0.05235313418047178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 157.05555555555557, 98, 307, 103.0, 305.2, 307.0, 307.0, 0.10429703796412182, 0.027907605861493535, 0.05948190446391322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 168.66666666666666, 97, 307, 102.5, 305.2, 307.0, 307.0, 0.10429764229385281, 0.028111473899515016, 0.061315606114159565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 156.66666666666663, 98, 305, 102.0, 302.3, 305.0, 305.0, 0.1042982466305872, 0.02811163678715046, 0.06141781515453524], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 36.36363636363637, 0.5956813104988831], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.14892032762472077], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.07446016381236038], "isController": false}, {"data": ["401/Unauthorized", 11, 50.0, 0.8190618019359642], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1343, 22, "401/Unauthorized", 11, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
