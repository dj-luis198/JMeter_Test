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

    var data = {"OkPercent": 99.31245225362872, "KoPercent": 0.6875477463712758};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7455386649041639, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bc47f917-a4fd-4f9c-9267-643a5d975e59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e77d9ce-8cb8-4ba9-8549-a4791ea1de53"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c9f279d2-62c6-47cb-8cb3-599ab1625272"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f4e3a3d7-f32b-4a70-86c3-fe4a485efdf2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0bed41db-1a62-4226-af23-f9f0076fd7c8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8818dcc-07c3-4562-af33-d96a27c54c8a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/63756300-1d22-49cc-b40d-7778f7a3648b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5277777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ca3b8405-8cec-433a-8ea7-f3862952765d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1d9e9540-68f6-43ab-b6a7-ae6959fbfc8b"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/81a72eec-b68d-4a2f-a01c-43f2a6646fe5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9f279d2-62c6-47cb-8cb3-599ab1625272"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6cc76755-fd87-496d-bf73-ffd2ea42aabe"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4e77d9ce-8cb8-4ba9-8549-a4791ea1de53"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/89517004-d9c4-4053-adfc-3961f8885feb"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c098e51-fc13-401c-9298-53a18d8ad60c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bbe2cc57-ca06-4934-8c51-2912fce63bf8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc47f917-a4fd-4f9c-9267-643a5d975e59"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e7b4a3f3-c2bc-42fe-90cf-1c94e08e677d"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e8818dcc-07c3-4562-af33-d96a27c54c8a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.20175438596491227, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4e3a3d7-f32b-4a70-86c3-fe4a485efdf2"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8503c693-ee53-44ab-831c-b7442b8a801b"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.31666666666666665, 500, 1500, "addBook"], "isController": true}, {"data": [0.9035087719298246, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63756300-1d22-49cc-b40d-7778f7a3648b"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.32456140350877194, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.963276836158192, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/26619463-02ac-40f3-a545-2942a138b220"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7c098e51-fc13-401c-9298-53a18d8ad60c"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d9e9540-68f6-43ab-b6a7-ae6959fbfc8b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cc76755-fd87-496d-bf73-ffd2ea42aabe"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81a72eec-b68d-4a2f-a01c-43f2a6646fe5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9318181818181818, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89517004-d9c4-4053-adfc-3961f8885feb"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1309, 9, 0.6875477463712758, 480.53552330022967, 134, 2442, 159.0, 1416.0, 1613.5, 2176.7000000000003, 5.106937476103902, 731.4298021342142, 3.7322146281669646], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2413.315789473684, 1693, 3058, 2367.0, 2867.0, 2925.2999999999997, 3058.0, 0.23364294439297922, 281.1498387171978, 1.148820532244776], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bc47f917-a4fd-4f9c-9267-643a5d975e59", 3, 0, 0.0, 632.6666666666666, 257, 1175, 466.0, 1175.0, 1175.0, 1175.0, 0.049768576121037175, 0.030959553700293633, 0.031915395494284904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e77d9ce-8cb8-4ba9-8549-a4791ea1de53", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 682.5454545454546, 438, 934, 633.0, 931.0, 934.0, 934.0, 0.09210493263780153, 0.01664005130663407, 0.06260257140225574], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 682.5454545454546, 438, 934, 633.0, 931.0, 934.0, 934.0, 0.09550766666087832, 0.017254803058850087, 0.06491536718356573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 165.53846153846152, 139, 424, 145.0, 314.7999999999999, 424.0, 424.0, 0.10317378433504495, 0.05144738434615598, 0.05750822414107824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 146.38461538461542, 140, 155, 147.0, 154.6, 155.0, 155.0, 0.10316805282204304, 0.0766707892554441, 0.05178552651418958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 295.3076923076923, 137, 1173, 145.0, 1134.2, 1173.0, 1173.0, 0.10241300802760424, 4.656099088524229, 0.05895364186564989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 365.15384615384613, 135, 1608, 147.0, 1469.6, 1608.0, 1608.0, 0.1019855808078827, 14.141229313597817, 0.0586079997881838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9f279d2-62c6-47cb-8cb3-599ab1625272", 3, 0, 0.0, 333.3333333333333, 261, 468, 271.0, 468.0, 468.0, 468.0, 0.025962786672436174, 0.026038849524015577, 0.016649313067935958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4e3a3d7-f32b-4a70-86c3-fe4a485efdf2", 3, 0, 0.0, 505.33333333333337, 255, 831, 430.0, 831.0, 831.0, 831.0, 0.023130300693909023, 0.023198065246723208, 0.014832907671549732], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 330.99999999999994, 237, 1175, 254.0, 906.800000000001, 1175.0, 1175.0, 0.06884365605709435, 0.15421471977763498, 0.0445063479587856], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0bed41db-1a62-4226-af23-f9f0076fd7c8", 2, 0, 0.0, 238.0, 237, 239, 238.0, 239.0, 239.0, 239.0, 0.024200476749391964, 0.02732006945536827, 0.015042581495105454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8818dcc-07c3-4562-af33-d96a27c54c8a", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 144.35294117647058, 136, 150, 147.0, 149.2, 150.0, 150.0, 0.07653761823936465, 0.05688000730484033, 0.038418296655306085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 227.52941176470588, 135, 439, 147.0, 436.6, 439.0, 439.0, 0.07644503601910227, 0.02045501940354885, 0.04359755960464426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63756300-1d22-49cc-b40d-7778f7a3648b", 3, 0, 0.0, 415.6666666666667, 281, 658, 308.0, 658.0, 658.0, 658.0, 0.03843049844356481, 0.03203792529751611, 0.024644557921166238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1086.75, 871, 1160, 1158.0, 1160.0, 1160.0, 1160.0, 0.040747305584418234, 11.981060779699693, 0.023238697716113522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1585.0, 1438, 1754, 1574.0, 1754.0, 1754.0, 1754.0, 0.040441213640821365, 36.38907512208191, 0.023024636281834817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 218.0, 142, 440, 145.0, 440.0, 440.0, 440.0, 0.041051324418354046, 0.07264160141216557, 0.022730567329303463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 146.75, 142, 150, 147.5, 149.7, 150.0, 150.0, 0.06827763964199758, 0.05074148805425797, 0.03427217458592457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 265.5, 141, 440, 147.5, 439.7, 440.0, 440.0, 0.06827880512091038, 0.02681587837837838, 0.038462393314366995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 348.1666666666667, 140, 1442, 148.0, 1141.400000000001, 1442.0, 1442.0, 0.06827880512091038, 5.136652071479374, 0.03965149359886202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 279.91666666666663, 142, 1309, 147.0, 1092.1000000000008, 1309.0, 1309.0, 0.06827841662351851, 1.6898796984085438, 0.03971794612832928], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 146.5, 142, 150, 147.0, 150.0, 150.0, 150.0, 0.041048796757145053, 0.030505990558776747, 0.023049861460310947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 211.4705882352941, 136, 442, 147.0, 433.2, 442.0, 442.0, 0.07643747414614845, 0.020602287953454076, 0.04493687444920055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 923.3333333333331, 135, 1750, 1363.0, 1678.0, 1750.0, 1750.0, 0.08401949252226516, 42.01055764729084, 0.04538292467185721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 194.41176470588235, 136, 438, 145.0, 435.6, 438.0, 438.0, 0.07654071966286065, 0.020630115846630406, 0.04507231831709469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 718.9444444444446, 134, 1314, 969.5, 1311.3, 1314.0, 1314.0, 0.08402380674524448, 13.735503705216479, 0.04546730948768818], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 614.3636363636364, 456, 1056, 537.0, 1010.8000000000002, 1056.0, 1056.0, 0.09527273987077552, 0.017212360230560032, 0.06568608823121828], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 536.3333333333334, 291, 1589, 437.0, 1332.200000000001, 1589.0, 1589.0, 0.06822019203984059, 6.89817288027072, 0.15197424616687796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca3b8405-8cec-433a-8ea7-f3862952765d", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 1.3195699896694215, 2.46561854338843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d9e9540-68f6-43ab-b6a7-ae6959fbfc8b", 3, 0, 0.0, 904.3333333333334, 248, 1982, 483.0, 1982.0, 1982.0, 1982.0, 0.04484707148623195, 0.028832345763446645, 0.028759352483032855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 664.9047619047618, 214, 1631, 499.0, 1294.6, 1597.9999999999995, 1631.0, 0.09664325752206689, 0.05936387595837897, 0.043697097883512656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81a72eec-b68d-4a2f-a01c-43f2a6646fe5", 3, 0, 0.0, 516.0, 276, 819, 453.0, 819.0, 819.0, 819.0, 0.019024909948759577, 0.02622737422949115, 0.012200218945005328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 160.7777777777778, 135, 404, 148.0, 181.70000000000036, 404.0, 404.0, 0.08401831599288645, 0.062439393037682214, 0.04217325626986683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 224.77777777777777, 136, 446, 147.0, 446.0, 446.0, 446.0, 0.08401870816568488, 0.09258832466695918, 0.04399677578207414], "isController": false}, {"data": ["login", 21, 0, 0.0, 2714.857142857143, 1540, 3752, 2619.0, 3715.2000000000003, 3750.6, 3752.0, 0.09615692810667008, 22.045522936289167, 0.17545151544463422], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 151.70588235294122, 144, 162, 150.0, 162.0, 162.0, 162.0, 0.0743783935142041, 0.06021453928054217, 0.026439194569502233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9f279d2-62c6-47cb-8cb3-599ab1625272", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cc76755-fd87-496d-bf73-ffd2ea42aabe", 3, 0, 0.0, 355.3333333333333, 255, 454, 357.0, 454.0, 454.0, 454.0, 0.02938439688525393, 0.02449656263773936, 0.01884350972133797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1105.0555555555554, 284, 1899, 1533.5, 1827.0, 1899.0, 1899.0, 0.0839603147578911, 55.861013027842176, 0.17689425256662017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e77d9ce-8cb8-4ba9-8549-a4791ea1de53", 3, 0, 0.0, 325.0, 239, 464, 272.0, 464.0, 464.0, 464.0, 0.030688339453952145, 0.030778246698446147, 0.019679696850353427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89517004-d9c4-4053-adfc-3961f8885feb", 3, 0, 0.0, 441.66666666666663, 237, 724, 364.0, 724.0, 724.0, 724.0, 0.022928067011097182, 0.02299523908241876, 0.014703220055944485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 514.5384615384615, 290, 1749, 295.0, 1610.6, 1749.0, 1749.0, 0.10186730607991099, 18.882618805194447, 0.22509215807846916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c098e51-fc13-401c-9298-53a18d8ad60c", 1, 0, 0.0, 637.0, 637, 637, 637.0, 637.0, 637.0, 637.0, 1.5698587127158556, 0.28361705259026687, 1.082343995290424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1732.0, 1589, 1896, 1721.5, 1896.0, 1896.0, 1896.0, 0.04037956793862306, 48.30800146375934, 0.09105119372097718], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbe2cc57-ca06-4934-8c51-2912fce63bf8", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 1.0042010613207546, 1.876351218553459], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc47f917-a4fd-4f9c-9267-643a5d975e59", 1, 0, 0.0, 739.0, 739, 739, 739.0, 739.0, 739.0, 739.0, 1.3531799729364007, 0.2444709912043302, 0.9329541610284168], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1204.4285714285716, 209, 2378, 1200.0, 1768.8, 2318.2999999999993, 2378.0, 0.1003464341177876, 0.03186223270815912, 0.0452734888304862], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e7b4a3f3-c2bc-42fe-90cf-1c94e08e677d", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 442.7647058823529, 285, 586, 563.0, 585.2, 586.0, 586.0, 0.07638561254521355, 0.11838278038013075, 0.17179303290197928], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 150.23076923076923, 137, 158, 150.0, 156.4, 158.0, 158.0, 0.06820173022543294, 0.05294958547775312, 0.02424358379107187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 0, 0.0, 474.6363636363636, 286, 1752, 300.0, 827.0999999999999, 1619.699999999998, 1752.0, 0.13790423177940336, 7.703164618083632, 0.3085460271044499], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8818dcc-07c3-4562-af33-d96a27c54c8a", 3, 0, 0.0, 438.33333333333337, 245, 756, 314.0, 756.0, 756.0, 756.0, 0.020867387750843392, 0.024664545873474074, 0.013381755816784337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 145.63636363636363, 140, 149, 146.0, 149.0, 149.0, 149.0, 0.05747036357841831, 0.042709908870289394, 0.028847428593073255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 145.0909090909091, 140, 147, 147.0, 147.0, 147.0, 147.0, 0.05746946281725756, 0.015377571105398995, 0.0327755530129672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 170.0, 140, 422, 146.0, 367.20000000000016, 422.0, 422.0, 0.05746976306784044, 0.015489897076878869, 0.03378593492855463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 196.90909090909088, 141, 439, 147.0, 435.40000000000003, 439.0, 439.0, 0.05747096410154597, 0.015490220792994811, 0.03384276499339084], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1676.5087719298244, 1122, 2442, 1595.0, 2248.6000000000004, 2322.0, 2442.0, 0.23615000911456174, 282.5175099276221, 0.46630402190394904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4e3a3d7-f32b-4a70-86c3-fe4a485efdf2", 1, 0, 0.0, 1056.0, 1056, 1056, 1056.0, 1056.0, 1056.0, 1056.0, 0.946969696969697, 0.1710833925189394, 0.6528912168560606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1204.4285714285716, 209, 2378, 1200.0, 1768.8, 2318.2999999999993, 2378.0, 0.09701516670439479, 0.030804480945759282, 0.043770514665459365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 208.0909090909091, 140, 573, 147.0, 542.4000000000001, 573.0, 573.0, 0.04785500802658998, 0.012898420132166832, 0.02818024398440797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 172.45454545454544, 140, 433, 146.0, 377.4000000000002, 433.0, 433.0, 0.047855840805370295, 0.012898644592072463, 0.028134000160969647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 451.07692307692304, 138, 1612, 147.0, 1606.0, 1612.0, 1612.0, 0.0699598000226024, 14.54141666408802, 0.039741286641445266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8503c693-ee53-44ab-831c-b7442b8a801b", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 1.064453125, 1.9889322916666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 473.3076923076923, 139, 1118, 434.0, 1073.6, 1118.0, 1118.0, 0.06984703499336453, 4.753869374627258, 0.03974543945873921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 145.27272727272728, 141, 149, 146.0, 148.8, 149.0, 149.0, 0.04785521621856782, 0.012805009027233968, 0.02729242799965196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 192.0769230769231, 143, 438, 147.0, 437.6, 438.0, 438.0, 0.06995716468992831, 0.051989650711948686, 0.03511521743224918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 173.54545454545453, 142, 442, 147.0, 383.6000000000002, 442.0, 442.0, 0.04785313438030191, 0.03556272974942359, 0.02402003034323748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 278.46153846153845, 141, 450, 148.0, 445.2, 450.0, 450.0, 0.06995641177420223, 0.042966017327665064, 0.03854119020072109], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 149.63636363636365, 143, 160, 149.0, 159.8, 160.0, 160.0, 0.050545198895357656, 0.03978459991177565, 0.017967238669834164], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 605.5454545454545, 454, 831, 538.0, 828.6, 831.0, 831.0, 0.09465459677141776, 0.017100683987023715, 0.06442798237273259], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1386.6666666666665, 764, 2177, 1333.0, 1851.8, 2144.5999999999995, 2177.0, 0.09815285671552498, 0.050801771542215074, 0.04514647999317604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 386.7272727272727, 285, 875, 297.0, 844.0000000000001, 875.0, 875.0, 0.04782338389569285, 0.0741169045336568, 0.10755591124197328], "isController": false}, {"data": ["addBook", 60, 5, 8.333333333333334, 1418.2000000000003, 735, 3377, 1134.0, 2440.1, 2654.149999999999, 3377.0, 0.28585312866249324, 97.97401967265053, 1.0381670129658216], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 272.5087719298246, 140, 610, 149.0, 588.2, 594.1, 610.0, 0.23711271589736763, 0.17621364921669608, 0.11461991637616893], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 923.2982456140352, 673, 1351, 869.0, 1190.4000000000003, 1283.6, 1351.0, 0.23691560816652257, 69.66105513951004, 0.11915189277906164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63756300-1d22-49cc-b40d-7778f7a3648b", 1, 0, 0.0, 830.0, 830, 830, 830.0, 830.0, 830.0, 830.0, 1.2048192771084338, 0.2176675451807229, 0.8306664156626506], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 199.10526315789474, 137, 570, 147.0, 434.0, 436.5, 570.0, 0.23760593264497087, 0.4204511230006711, 0.11555444771210498], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1402.1929824561403, 976, 1833, 1442.0, 1730.6, 1753.2, 1833.0, 0.23678274559978732, 213.0575307103586, 0.11885383909989324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 22, 0, 0.0, 178.27272727272725, 143, 421, 153.0, 340.39999999999986, 419.34999999999997, 421.0, 0.14321611311469007, 0.10699250637962686, 0.05090885270873748], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 5, 2.824858757062147, 220.72316384180786, 139, 1306, 153.0, 371.80000000000024, 438.0, 1249.06, 0.7220216606498194, 1.5410442671684104, 0.34774938684248097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 152.63636363636363, 145, 161, 152.0, 160.6, 161.0, 161.0, 0.059527030683478546, 0.04609856966015477, 0.021159999188267765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26619463-02ac-40f3-a545-2942a138b220", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.8538394050802139, 1.5954002339572193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 151.46153846153845, 144, 172, 149.0, 165.6, 172.0, 172.0, 0.10783459831612127, 0.08751030390693045, 0.03833182987018373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c098e51-fc13-401c-9298-53a18d8ad60c", 3, 0, 0.0, 356.0, 253, 538, 277.0, 538.0, 538.0, 538.0, 0.0420952193862517, 0.027063170015575233, 0.026994655661105423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 345.54545454545456, 288, 582, 295.0, 579.6, 582.0, 582.0, 0.05742625946228139, 0.08899948610023492, 0.12915300345862699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 800.2307692307692, 292, 1758, 586.0, 1750.8, 1758.0, 1758.0, 0.06979266210687941, 19.35157793491566, 0.15284446201937016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d9e9540-68f6-43ab-b6a7-ae6959fbfc8b", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 177.08333333333334, 149, 437, 151.5, 355.7000000000003, 437.0, 437.0, 0.06606328863050802, 0.05477317582744269, 0.023483434630375898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 150.33333333333331, 139, 167, 150.0, 158.9, 167.0, 167.0, 0.08542587169983247, 0.06632184375133478, 0.030366227830799824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cc76755-fd87-496d-bf73-ffd2ea42aabe", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81a72eec-b68d-4a2f-a01c-43f2a6646fe5", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.32493536420863306, 1.2400236061151078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 22, 0, 0.0, 163.4545454545455, 140, 446, 147.0, 183.89999999999998, 407.4499999999995, 446.0, 0.1380288229278423, 0.10257806078914843, 0.0692839990087021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 22, 0, 0.0, 234.0909090909091, 140, 437, 147.5, 432.5, 436.55, 437.0, 0.1380340191114374, 0.04635854885463136, 0.07819558557795471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 22, 0, 0.0, 282.09090909090907, 137, 1579, 146.0, 540.1999999999999, 1429.7499999999977, 1579.0, 0.13803228700676987, 5.681044490707917, 0.08060869885746912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89517004-d9c4-4053-adfc-3961f8885feb", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 22, 0, 0.0, 214.77272727272728, 140, 1108, 143.0, 437.1, 1007.4999999999985, 1108.0, 0.13803142097073734, 1.8803227386375045, 0.08074298941549968], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 44.44444444444444, 0.30557677616501144], "isController": false}, {"data": ["401/Unauthorized", 5, 55.55555555555556, 0.3819709702062643], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1309, 9, "401/Unauthorized", 5, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
