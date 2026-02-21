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

    var data = {"OkPercent": 66.08, "KoPercent": 33.92};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7ce4f1d-e718-4d24-9b5f-6618b5c33f4a"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b413c374-35f9-431a-b9c3-c432ff032e2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e4048468-1614-4988-999e-02cdd37ce053"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ae38a4f-a968-4c47-9608-752315a9fbaa"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b7ce4f1d-e718-4d24-9b5f-6618b5c33f4a"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6388888888888888, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.35185185185185186, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1be097fa-1210-4748-8c52-0b855ec53e8c"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1be097fa-1210-4748-8c52-0b855ec53e8c"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/48bc59bb-81ce-4e71-b2a9-7be0a534f122"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b4f85b4f-7e86-4b99-ba04-aba3a9d59d26"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a770d8ce-803e-412d-bd44-2a4f7f37de3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0f34793-4789-4a01-932c-9a7964b06ebb"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9069767441860465, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a770d8ce-803e-412d-bd44-2a4f7f37de3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48bc59bb-81ce-4e71-b2a9-7be0a534f122"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/677485ab-9a1f-4fbf-ad14-767805550f07"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0f34793-4789-4a01-932c-9a7964b06ebb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c4ebe22d-77e4-4366-bd82-cc3b586c2277"], "isController": false}, {"data": [0.7708333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=898bf424-384e-43cc-b2f5-c5996b02eeca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/898bf424-384e-43cc-b2f5-c5996b02eeca"], "isController": false}, {"data": [0.0625, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02a250a8-345a-438c-8d5c-0b731e137b9b"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/198045e6-dff9-411b-9e88-ae613f3f39fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63c44b36-5591-4f9e-b6c5-f7f4b373b13b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b15a734d-1c5f-4270-af99-608b71b1839d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5ff4038f-cd65-4736-a757-105b937b9ed0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b413c374-35f9-431a-b9c3-c432ff032e2a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6ae38a4f-a968-4c47-9608-752315a9fbaa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4ebe22d-77e4-4366-bd82-cc3b586c2277"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ff4038f-cd65-4736-a757-105b937b9ed0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/63c44b36-5591-4f9e-b6c5-f7f4b373b13b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b15a734d-1c5f-4270-af99-608b71b1839d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66c9cd42-b7d7-455b-8dc8-82ab3be6b611"], "isController": false}, {"data": [0.35185185185185186, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/66c9cd42-b7d7-455b-8dc8-82ab3be6b611"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 625, 212, 33.92, 265.728, 99, 2010, 107.0, 662.9999999999999, 972.9999999999986, 1523.14, 2.4098615389954157, 2.470740666124287, 1.1617189397765961], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7ce4f1d-e718-4d24-9b5f-6618b5c33f4a", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["see books", 56, 56, 100.0, 571.7142857142854, 401, 811, 608.0, 731.6, 744.0, 811.0, 0.25399474775146613, 1.6336516606607492, 0.42638376111793974], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, 100.0, 114.52941176470587, 100, 312, 102.0, 148.79999999999984, 312.0, 312.0, 0.12045887746497835, 0.059876531864916, 0.06046470997753796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 130.76470588235293, 99, 305, 104.0, 301.8, 305.0, 305.0, 0.07984894458483245, 0.06199210053216973, 0.028383804520389664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, 100.0, 127.62499999999999, 99, 299, 102.0, 296.9, 299.0, 299.0, 0.09336577794116789, 0.04640935641802193, 0.046865244005625285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b413c374-35f9-431a-b9c3-c432ff032e2a", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 2.8089887640449436, 0.5074833216292135, 1.9366660814606742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4048468-1614-4988-999e-02cdd37ce053", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 1.1364268238434163, 2.123415258007117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 103.0, 101, 105, 103.0, 105.0, 105.0, 105.0, 0.05146481736422938, 0.015178100433591087, 0.031813700577692575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ae38a4f-a968-4c47-9608-752315a9fbaa", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.49361765710382516, 1.8837517076502732], "isController": false}, {"data": ["https://demoqa.com/books", 56, 56, 100.0, 183.7857142857143, 99, 420, 102.5, 405.6, 413.15, 420.0, 0.2553102247185889, 0.12690713318531419, 0.12341656370673973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7ce4f1d-e718-4d24-9b5f-6618b5c33f4a", 3, 0, 0.0, 274.6666666666667, 202, 401, 221.0, 401.0, 401.0, 401.0, 0.04389494476552784, 0.02822022002341064, 0.028148776428414662], "isController": false}, {"data": ["deleteBook", 18, 4, 22.22222222222222, 454.44444444444446, 101, 1071, 413.0, 1028.7, 1071.0, 1071.0, 0.08741470995313601, 0.01801221074229658, 0.05848514556977394], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 4, 22.22222222222222, 454.44444444444446, 101, 1071, 413.0, 1028.7, 1071.0, 1071.0, 0.08496657981194063, 0.017507762051093237, 0.05684721474831011], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 7, 25.925925925925927, 822.8888888888889, 149, 2010, 824.0, 1412.8, 1801.199999999999, 2010.0, 0.10410601848460195, 0.03280424019957509, 0.04696970755848252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1be097fa-1210-4748-8c52-0b855ec53e8c", 3, 0, 0.0, 442.6666666666667, 208, 750, 370.0, 750.0, 750.0, 750.0, 0.06675121820973233, 0.030203187926929668, 0.04280595698996507], "isController": false}, {"data": ["deleteAccount", 17, 4, 23.529411764705884, 443.1176470588235, 99, 1130, 401.0, 928.3999999999999, 1130.0, 1130.0, 0.08516991397838689, 0.021727917507928317, 0.056269484183445975], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 126.75, 99, 300, 102.5, 300.0, 300.0, 300.0, 0.04869942108563185, 0.0383317708935735, 0.017311122339033196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1be097fa-1210-4748-8c52-0b855ec53e8c", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 0.6741196361940298, 2.572586287313433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1145.2500000000002, 645, 1727, 1125.0, 1554.5, 1693.75, 1727.0, 0.09845588355950838, 0.05095861160794867, 0.04528586050442231], "isController": false}, {"data": ["goToProfile", 18, 4, 22.22222222222222, 212.61111111111111, 100, 370, 201.5, 314.2000000000001, 370.0, 370.0, 0.08791122919434242, 0.14240741543428145, 0.055173453739157614], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, 100.0, 101.125, 100, 103, 101.0, 103.0, 103.0, 103.0, 0.04811451253984483, 0.023916295783965837, 0.0241512299272268], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48bc59bb-81ce-4e71-b2a9-7be0a534f122", 3, 0, 0.0, 272.0, 186, 372, 258.0, 372.0, 372.0, 372.0, 0.01909514474119714, 0.02632419856086259, 0.012245258834686967], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4f85b4f-7e86-4b99-ba04-aba3a9d59d26", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 1.1612215909090908, 2.169744318181818], "isController": false}, {"data": ["addBook", 58, 58, 100.0, 668.4655172413796, 404, 1910, 631.0, 873.4000000000001, 1133.5499999999997, 1910.0, 0.2734030668281945, 0.9214233914589826, 0.5331203288732494], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a770d8ce-803e-412d-bd44-2a4f7f37de3e", 3, 0, 0.0, 239.33333333333334, 176, 364, 178.0, 364.0, 364.0, 364.0, 0.021175972330062822, 0.021238011311498554, 0.013579643714265548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 128.49999999999997, 100, 311, 103.5, 304.0, 311.0, 311.0, 0.09520579327252064, 0.07112542173191239, 0.03384268432734132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0f34793-4789-4a01-932c-9a7964b06ebb", 3, 0, 0.0, 264.0, 196, 385, 211.0, 385.0, 385.0, 385.0, 0.03878474466709761, 0.03233324579831933, 0.024871727537168715], "isController": false}, {"data": ["deleteBooks", 17, 4, 23.529411764705884, 378.47058823529414, 101, 1548, 366.0, 838.3999999999994, 1548.0, 1548.0, 0.08530624943547335, 0.0177051630980219, 0.05738374200881163], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 13, 7.558139534883721, 192.453488372093, 100, 1586, 108.5, 365.70000000000005, 440.4, 1111.5000000000066, 0.7159328355102687, 1.586988245902117, 0.3425159458950409], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 133.25, 100, 300, 105.0, 300.0, 300.0, 300.0, 0.04376439438283998, 0.03389176244686729, 0.015556874565775149], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a770d8ce-803e-412d-bd44-2a4f7f37de3e", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48bc59bb-81ce-4e71-b2a9-7be0a534f122", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/677485ab-9a1f-4fbf-ad14-767805550f07", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 1.6632080078125, 3.1077067057291665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 13, 100.0, 132.76923076923077, 99, 298, 102.0, 297.6, 298.0, 298.0, 0.1376083665886886, 0.06840103378285399, 0.06907294963533783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0f34793-4789-4a01-932c-9a7964b06ebb", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 117.33333333333334, 101, 298, 104.0, 185.80000000000007, 298.0, 298.0, 0.09140879230703604, 0.07418037735072944, 0.032492969140391716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4ebe22d-77e4-4366-bd82-cc3b586c2277", 3, 0, 0.0, 628.0, 308, 896, 680.0, 896.0, 896.0, 896.0, 0.0687001923605386, 0.03108504797563433, 0.04405578741870477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 502.9166666666667, 108, 979, 443.5, 905.5, 966.75, 979.0, 0.09894173568539827, 0.060775734127065925, 0.044736351193690814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=898bf424-384e-43cc-b2f5-c5996b02eeca", 1, 0, 0.0, 1548.0, 1548, 1548, 1548.0, 1548.0, 1548.0, 1548.0, 0.6459948320413437, 0.11670805071059431, 0.4453831556847545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/898bf424-384e-43cc-b2f5-c5996b02eeca", 3, 0, 0.0, 334.3333333333333, 182, 456, 365.0, 456.0, 456.0, 456.0, 0.046111990654636566, 0.030185941798982464, 0.02957051484037566], "isController": false}, {"data": ["login", 24, 6, 25.0, 1962.5416666666667, 1283, 2795, 1920.0, 2461.0, 2725.0, 2795.0, 0.09986601309909206, 0.14936015533326122, 0.14979901964863807], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/02a250a8-345a-438c-8d5c-0b731e137b9b", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 1.5887360074626864, 2.96855565920398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 8, 100.0, 102.875, 100, 108, 102.0, 108.0, 108.0, 108.0, 0.0451997830410414, 0.02246747028114265, 0.022688172346772735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 122.76470588235294, 102, 315, 105.0, 180.59999999999988, 315.0, 315.0, 0.11799491927759345, 0.09552518367297361, 0.04194350646195705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, 100.0, 135.94117647058823, 99, 492, 102.0, 333.59999999999985, 492.0, 492.0, 0.07975304703553232, 0.03964287201277925, 0.04003229118775744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/198045e6-dff9-411b-9e88-ae613f3f39fe", 2, 0, 0.0, 236.5, 184, 289, 236.5, 289.0, 289.0, 289.0, 0.038688461166457105, 0.03419243882387078, 0.02404805227778315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63c44b36-5591-4f9e-b6c5-f7f4b373b13b", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b15a734d-1c5f-4270-af99-608b71b1839d", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ff4038f-cd65-4736-a757-105b937b9ed0", 3, 0, 0.0, 358.66666666666663, 203, 666, 207.0, 666.0, 666.0, 666.0, 0.03324136555529701, 0.03358762977983136, 0.021316891322895545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 108.15384615384615, 99, 124, 106.0, 122.0, 124.0, 124.0, 0.1493909446104344, 0.1238602655998621, 0.05310381234199035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 20, 100.0, 123.35, 100, 298, 101.0, 279.3000000000004, 297.95, 298.0, 0.09381083046037665, 0.04663057881282394, 0.04708863950843125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b413c374-35f9-431a-b9c3-c432ff032e2a", 3, 0, 0.0, 510.3333333333333, 189, 1130, 212.0, 1130.0, 1130.0, 1130.0, 0.03225320919431483, 0.026888173420130303, 0.020683210323177156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ae38a4f-a968-4c47-9608-752315a9fbaa", 3, 0, 0.0, 413.0, 196, 619, 424.0, 619.0, 619.0, 619.0, 0.01765858884330357, 0.024343790283655797, 0.011324029954852873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 105.75, 101, 121, 103.5, 115.80000000000001, 120.75, 121.0, 0.09052477210388622, 0.07028046271737261, 0.03217872758380331], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4ebe22d-77e4-4366-bd82-cc3b586c2277", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ff4038f-cd65-4736-a757-105b937b9ed0", 1, 0, 0.0, 661.0, 661, 661, 661.0, 661.0, 661.0, 661.0, 1.5128593040847202, 0.27331930786686837, 1.0430455748865355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 14, 100.0, 116.00000000000001, 99, 297, 100.0, 206.0, 297.0, 297.0, 0.07104831793107298, 0.0353160095965978, 0.040589126943044625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 15, 100.0, 102.73333333333332, 99, 108, 103.0, 106.8, 108.0, 108.0, 0.09413891137762882, 0.04679365809688777, 0.047253320750098846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63c44b36-5591-4f9e-b6c5-f7f4b373b13b", 3, 0, 0.0, 877.6666666666666, 229, 1526, 878.0, 1526.0, 1526.0, 1526.0, 0.026593858591589248, 0.026671770286681794, 0.017054004370257426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b15a734d-1c5f-4270-af99-608b71b1839d", 3, 0, 0.0, 318.3333333333333, 174, 411, 370.0, 411.0, 411.0, 411.0, 0.04477745604346399, 0.029312325554494163, 0.028714709767455743], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66c9cd42-b7d7-455b-8dc8-82ab3be6b611", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 0.7590926995798319, 2.8968618697478994], "isController": false}, {"data": ["register", 27, 7, 25.925925925925927, 822.8888888888889, 149, 2010, 824.0, 1412.8, 1801.199999999999, 2010.0, 0.10459319059591002, 0.032957750161732066, 0.04718950591338909], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/66c9cd42-b7d7-455b-8dc8-82ab3be6b611", 3, 0, 0.0, 353.3333333333333, 181, 592, 287.0, 592.0, 592.0, 592.0, 0.07846624643632463, 0.03473766118274789, 0.05031852391912746], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 3.30188679245283, 1.12], "isController": false}, {"data": ["401/Unauthorized", 21, 9.90566037735849, 3.36], "isController": false}, {"data": ["404/Not Found", 184, 86.79245283018868, 29.44], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 625, 212, "404/Not Found", 184, "401/Unauthorized", 21, "406/Not Acceptable", 7, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 56, 56, "404/Not Found", 56, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
