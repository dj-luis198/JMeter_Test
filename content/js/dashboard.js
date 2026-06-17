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

    var data = {"OkPercent": 97.93205317577548, "KoPercent": 2.06794682422452};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8081063964534515, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4083333333333333, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a32121c6-b843-4749-86b5-ada540c995f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9727f0a-3d7e-439b-bad0-c17d13ee8356"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/01a2bc1f-6e66-45c0-bce4-32b34c7e7327"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1950277-1814-4f59-ad75-ba9caf61e507"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c6d1fbf1-d93a-490a-b6cf-037efc66f4d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.043478260869565216, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4712df90-ea94-4672-8373-56cbdbf6d102"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/454e4774-2917-4b98-963c-dd20b43d5231"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac2193aa-049f-4681-97f0-a5e50b880872"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e602c17b-9b32-4cd6-b633-bc6ed33ba797"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d1e60778-8b12-4602-b84d-d3af824bca17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ccd38e13-13c0-469e-ba2e-4be5963a5625"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04eeb19a-3298-4e48-ab3d-2000407aeac5"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/12cd8072-b68a-4f4d-9852-30fdb7dcd345"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a49a3f9-e430-4f81-9ce9-80ea6c6e4a8d"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/73093bc3-e1e9-46c0-8ec0-45822f1bba77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac2193aa-049f-4681-97f0-a5e50b880872"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7a49a3f9-e430-4f81-9ce9-80ea6c6e4a8d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6d1fbf1-d93a-490a-b6cf-037efc66f4d0"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c9727f0a-3d7e-439b-bad0-c17d13ee8356"], "isController": false}, {"data": [0.8166666666666667, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9195402298850575, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/04eeb19a-3298-4e48-ab3d-2000407aeac5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1e60778-8b12-4602-b84d-d3af824bca17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01a2bc1f-6e66-45c0-bce4-32b34c7e7327"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a1950277-1814-4f59-ad75-ba9caf61e507"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8e22b76e-2743-492d-968c-fa00304fafbc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e602c17b-9b32-4cd6-b633-bc6ed33ba797"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a32121c6-b843-4749-86b5-ada540c995f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73093bc3-e1e9-46c0-8ec0-45822f1bba77"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=454e4774-2917-4b98-963c-dd20b43d5231"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12cd8072-b68a-4f4d-9852-30fdb7dcd345"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88b2f50f-10fa-4c60-9182-1b77a68964d7"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1354, 28, 2.06794682422452, 307.99778434268893, 77, 2896, 94.0, 848.5, 1041.5, 1748.900000000001, 5.221468952698274, 750.7940195694216, 3.816032999568091], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 0, 0.0, 1320.25, 961, 1759, 1300.5, 1654.6999999999998, 1697.95, 1759.0, 0.26916209838771904, 323.89211057851907, 1.323467934943521], "isController": true}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 477.2, 83, 1103, 468.0, 838.4000000000001, 1103.0, 1103.0, 0.07944620697325841, 0.015563387811362928, 0.05349171045035407], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 477.2, 83, 1103, 468.0, 838.4000000000001, 1103.0, 1103.0, 0.07966434754899357, 0.015606121209304796, 0.05363858609060492], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a32121c6-b843-4749-86b5-ada540c995f3", 3, 0, 0.0, 1236.3333333333333, 316, 2896, 497.0, 2896.0, 2896.0, 2896.0, 0.06877421425460215, 0.03111854095504459, 0.0441032558859265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 89.36842105263158, 78, 243, 80.0, 90.0, 243.0, 243.0, 0.08286991603969034, 0.028725057245665684, 0.0468954448806019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 81.89473684210527, 78, 92, 81.0, 87.0, 92.0, 92.0, 0.08286666317754401, 0.061583526052842764, 0.04159518054029065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 133.94736842105263, 79, 627, 80.0, 239.0, 627.0, 627.0, 0.08281429113146116, 1.302733157643541, 0.04839204748527867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 138.84210526315792, 78, 706, 81.0, 240.0, 706.0, 706.0, 0.08281356922124734, 3.9430300191016032, 0.04831075301506771], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 360.3125, 79, 2896, 192.5, 1153.0000000000018, 2896.0, 2896.0, 0.07910805666114558, 0.1363387570764629, 0.05112763745024845], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 82.47058823529412, 80, 93, 82.0, 85.8, 93.0, 93.0, 0.09516345723242275, 0.0707220614783923, 0.047767594743618455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 90.29411764705881, 78, 240, 81.0, 121.5999999999999, 240.0, 240.0, 0.0951655881233346, 0.04228002404330594, 0.05333383948364272], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 492.6666666666667, 462, 622, 467.0, 622.0, 622.0, 622.0, 0.06375789003889232, 18.74693663262704, 0.036361921662805774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 822.3333333333334, 537, 1097, 811.5, 1097.0, 1097.0, 1097.0, 0.06355191661988539, 57.18412628692631, 0.036182390028704284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 163.0, 80, 241, 167.0, 241.0, 241.0, 241.0, 0.06401638819537801, 0.11327899942385251, 0.0354465743230267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9727f0a-3d7e-439b-bad0-c17d13ee8356", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01a2bc1f-6e66-45c0-bce4-32b34c7e7327", 3, 0, 0.0, 434.33333333333337, 240, 804, 259.0, 804.0, 804.0, 804.0, 0.028504104591061112, 0.03369088664392672, 0.01827899936340833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1950277-1814-4f59-ad75-ba9caf61e507", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 95.81818181818181, 80, 238, 81.0, 207.4000000000001, 238.0, 238.0, 0.06580324828762002, 0.04890260932312386, 0.033030146113121765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 108.36363636363637, 78, 243, 80.0, 241.0, 243.0, 243.0, 0.0658036419324735, 0.017607615126462636, 0.037528639539613794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 121.9090909090909, 77, 239, 80.0, 238.0, 239.0, 239.0, 0.06580324828762002, 0.017736031765022583, 0.03868511276283911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 122.09090909090908, 78, 236, 80.0, 235.8, 236.0, 236.0, 0.0658036419324735, 0.017736137864612, 0.03874960555203274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6d1fbf1-d93a-490a-b6cf-037efc66f4d0", 3, 0, 0.0, 350.0, 181, 496, 373.0, 496.0, 496.0, 496.0, 0.081468607429937, 0.03781713352704758, 0.052243866092765594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 81.33333333333333, 79, 88, 80.0, 88.0, 88.0, 88.0, 0.06402048655569782, 0.04757772487195903, 0.035949003681177975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 572.4210526315791, 80, 1163, 859.0, 1089.0, 1163.0, 1163.0, 0.09348691429218105, 44.28545668050109, 0.05073164273729685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 185.35294117647058, 80, 846, 81.0, 791.5999999999999, 846.0, 846.0, 0.09516505539166019, 10.096712799560002, 0.05498449719263086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 365.0, 77, 719, 471.0, 631.0, 719.0, 719.0, 0.09341383311372888, 14.46812037847352, 0.05078320892495428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 190.58823529411768, 79, 630, 82.0, 620.4, 630.0, 630.0, 0.0951655881233346, 3.314613935600887, 0.05507774013916568], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 401.6666666666667, 81, 1038, 401.0, 744.6000000000001, 1038.0, 1038.0, 0.07973167633191765, 0.0156193108126784, 0.05421338721422839], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 248.0, 161, 474, 165.0, 444.0000000000001, 474.0, 474.0, 0.06577137868768161, 0.10193279099350656, 0.14792137218528395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 578.4347826086955, 99, 1389, 622.0, 1057.4, 1323.799999999999, 1389.0, 0.09910034124987074, 0.060873158834149114, 0.044808064451845854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 82.42105263157896, 78, 87, 82.0, 86.0, 87.0, 87.0, 0.09348415443582313, 0.06947406398990372, 0.04692466345704403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 122.42105263157895, 78, 251, 80.0, 242.0, 251.0, 251.0, 0.0934124553218059, 0.09883782921744945, 0.04914524530602412], "isController": false}, {"data": ["login", 23, 0, 0.0, 2627.95652173913, 1362, 4429, 2646.0, 3673.2000000000003, 4295.199999999998, 4429.0, 0.10146193412914781, 31.804111744880583, 0.19697452505889204], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4712df90-ea94-4672-8373-56cbdbf6d102", 1, 0, 0.0, 327.0, 327, 327, 327.0, 327.0, 327.0, 327.0, 3.058103975535168, 0.9765625, 1.8247085244648318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 85.76470588235294, 80, 105, 84.0, 98.6, 105.0, 105.0, 0.094958804636224, 0.0768758291439743, 0.033754887585532745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/454e4774-2917-4b98-963c-dd20b43d5231", 3, 0, 0.0, 456.0, 361, 601, 406.0, 601.0, 601.0, 601.0, 0.02865192684208013, 0.028735868034000286, 0.018373794231412062], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac2193aa-049f-4681-97f0-a5e50b880872", 1, 0, 0.0, 1038.0, 1038, 1038, 1038.0, 1038.0, 1038.0, 1038.0, 0.9633911368015414, 0.17405015655105974, 0.6642130298651252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 664.3684210526316, 161, 1244, 942.0, 1169.0, 1244.0, 1244.0, 0.09337435252258185, 58.86233084345298, 0.1974270528228541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e602c17b-9b32-4cd6-b633-bc6ed33ba797", 3, 0, 0.0, 388.3333333333333, 188, 531, 446.0, 531.0, 531.0, 531.0, 0.031684339487136164, 0.026413930151873603, 0.020318407809133538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1e60778-8b12-4602-b84d-d3af824bca17", 3, 0, 0.0, 491.6666666666667, 172, 875, 428.0, 875.0, 875.0, 875.0, 0.030943785456420837, 0.02579656072717896, 0.01984350825167612], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ccd38e13-13c0-469e-ba2e-4be5963a5625", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 1.6545903497409327, 3.091604598445596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04eeb19a-3298-4e48-ab3d-2000407aeac5", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 238.36842105263162, 158, 788, 164.0, 333.0, 788.0, 788.0, 0.08278073561575797, 5.33388581759047, 0.18506106576929446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, 45.45454545454545, 529.4545454545455, 79, 1186, 617.0, 1151.4, 1186.0, 1186.0, 0.09772305286817161, 63.7813831198973, 0.14947358645825004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12cd8072-b68a-4f4d-9852-30fdb7dcd345", 3, 0, 0.0, 279.6666666666667, 166, 422, 251.0, 422.0, 422.0, 422.0, 0.03244225279003374, 0.0267289524126222, 0.02080443945194221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a49a3f9-e430-4f81-9ce9-80ea6c6e4a8d", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1238.8750000000005, 101, 2247, 1186.5, 1931.0, 2185.0, 2247.0, 0.09478111486286357, 0.029757937918369764, 0.04276257330726853], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 84.39999999999999, 79, 101, 83.0, 91.7, 100.55, 101.0, 0.09851779970346142, 0.07648598707446469, 0.035019999113339806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 305.5882352941176, 162, 928, 176.0, 872.8, 928.0, 928.0, 0.09512032721392562, 13.517954704889185, 0.21106461852552302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73093bc3-e1e9-46c0-8ec0-45822f1bba77", 3, 0, 0.0, 295.6666666666667, 165, 433, 289.0, 433.0, 433.0, 433.0, 0.08370068634562804, 0.037872380866023105, 0.05367524482450756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac2193aa-049f-4681-97f0-a5e50b880872", 3, 0, 0.0, 260.3333333333333, 191, 393, 197.0, 393.0, 393.0, 393.0, 0.04225292601512655, 0.02716456018225095, 0.027095789143814875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 262.29411764705884, 159, 740, 166.0, 410.3999999999997, 740.0, 740.0, 0.09466585736639585, 6.800040824650989, 0.21148095858925597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a49a3f9-e430-4f81-9ce9-80ea6c6e4a8d", 3, 0, 0.0, 960.6666666666666, 228, 2138, 516.0, 2138.0, 2138.0, 2138.0, 0.019768836406289125, 0.023366095374751244, 0.012677281158980983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 81.375, 79, 85, 81.5, 85.0, 85.0, 85.0, 0.037871435942833064, 0.02814469018798434, 0.019009685619742377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 117.875, 78, 236, 79.5, 236.0, 236.0, 236.0, 0.037871794507643004, 0.010133663764740413, 0.02159875780514015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 98.75, 77, 238, 79.0, 238.0, 238.0, 238.0, 0.037871435942833064, 0.010207535468966725, 0.022264262146079596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 118.75, 79, 236, 80.0, 236.0, 236.0, 236.0, 0.037871435942833064, 0.010207535468966725, 0.02230124597024252], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 91.0, 81, 101, 91.0, 101.0, 101.0, 101.0, 0.06932409012131717, 0.02044519064124783, 0.04285366117850953], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 913.9500000000003, 618, 1362, 861.0, 1255.9, 1349.5, 1362.0, 0.24782021469491267, 296.47913302163056, 0.48934811925108734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1238.8750000000005, 101, 2247, 1186.5, 1931.0, 2185.0, 2247.0, 0.09429551428380592, 0.02960547640844102, 0.042543483983514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 105.66666666666667, 79, 235, 79.5, 235.0, 235.0, 235.0, 0.03931641853638079, 0.010597003433633885, 0.023152148806091424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 134.16666666666666, 80, 238, 86.0, 238.0, 238.0, 238.0, 0.03931616090794121, 0.010596933994718529, 0.023113602408770122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 145.29999999999998, 78, 853, 80.0, 296.3000000000001, 825.4999999999997, 853.0, 0.0999695092996636, 4.5232346712377725, 0.058341580817850555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 141.9, 78, 469, 81.0, 295.70000000000016, 460.64999999999986, 469.0, 0.10016176124440972, 1.4981910629416508, 0.05855159207119498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 81.64999999999998, 80, 84, 81.0, 83.9, 84.0, 84.0, 0.10035626473982638, 0.07458116940137488, 0.05037414069948317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 83.83333333333333, 78, 92, 83.5, 92.0, 92.0, 92.0, 0.039316676168196736, 0.01052028249031827, 0.022422791877174705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 137.85, 77, 302, 80.0, 239.8, 298.9, 302.0, 0.10027927778864136, 0.03436327985940845, 0.056769430990308005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 121.5, 79, 328, 80.5, 328.0, 328.0, 328.0, 0.03931616090794121, 0.029218357862249276, 0.019734869830743927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 84.16666666666666, 81, 91, 83.0, 91.0, 91.0, 91.0, 0.03895471514364551, 0.030661621490017853, 0.01384718389871774], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 432.4, 79, 804, 433.0, 682.2, 804.0, 804.0, 0.08055334779713445, 0.01548659088834232, 0.05481928024241188], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1499.0, 794, 2730, 1409.0, 2017.0, 2588.199999999998, 2730.0, 0.09941689827922316, 0.05145601180467606, 0.04572788973585363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 257.66666666666663, 160, 563, 172.0, 563.0, 563.0, 563.0, 0.03929530421114677, 0.06090004666317375, 0.08837606015456154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6d1fbf1-d93a-490a-b6cf-037efc66f4d0", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 0.6569602272727272, 2.5071022727272725], "isController": false}, {"data": ["addBook", 57, 12, 21.05263157894737, 892.0701754385966, 416, 1910, 721.0, 1547.6000000000001, 1624.6, 1910.0, 0.2535372899977315, 80.84573034307599, 0.9202976199742905], "isController": true}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 138.56666666666658, 79, 405, 82.0, 321.7, 330.84999999999997, 405.0, 0.24855115389873197, 0.18471428527044437, 0.12014923943346907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9727f0a-3d7e-439b-bad0-c17d13ee8356", 3, 0, 0.0, 295.0, 197, 392, 296.0, 392.0, 392.0, 392.0, 0.01732141619898843, 0.02387897057380078, 0.011107809216148179], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 504.4500000000003, 383, 713, 471.0, 640.2, 706.95, 713.0, 0.2483649308717609, 73.02753616814306, 0.1249100970692938], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 128.3166666666667, 78, 328, 83.0, 241.0, 242.95, 328.0, 0.2486861083939851, 0.440057840244044, 0.12094304880879354], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 772.5500000000001, 536, 1092, 766.0, 1012.0, 1034.75, 1092.0, 0.24819541252145855, 223.326668467807, 0.12458246292581025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 85.76470588235294, 81, 97, 84.0, 93.8, 97.0, 97.0, 0.0968489896371581, 0.07235300495354097, 0.034426789285083546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 12, 6.896551724137931, 150.65517241379305, 80, 1129, 87.0, 321.5, 392.25, 711.25, 0.6883401508018767, 1.5799766139895246, 0.32658838074902485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 109.75, 82, 247, 92.0, 247.0, 247.0, 247.0, 0.039906419446398195, 0.03090409240331423, 0.014185485037586858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04eeb19a-3298-4e48-ab3d-2000407aeac5", 3, 0, 0.0, 284.6666666666667, 182, 488, 184.0, 488.0, 488.0, 488.0, 0.01961925564544081, 0.027046727753399037, 0.012581358600754686], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 106.26315789473685, 81, 316, 85.0, 237.0, 316.0, 316.0, 0.08074695180256945, 0.06552804389446798, 0.028703018023569612], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1e60778-8b12-4602-b84d-d3af824bca17", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01a2bc1f-6e66-45c0-bce4-32b34c7e7327", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1950277-1814-4f59-ad75-ba9caf61e507", 3, 0, 0.0, 260.6666666666667, 169, 411, 202.0, 411.0, 411.0, 411.0, 0.0879584835957428, 0.04077242208344328, 0.056405668191280386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e22b76e-2743-492d-968c-fa00304fafbc", 1, 0, 0.0, 347.0, 347, 347, 347.0, 347.0, 347.0, 347.0, 2.881844380403458, 0.9202764769452451, 1.7195380043227666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 201.625, 161, 321, 162.5, 321.0, 321.0, 321.0, 0.03785691977172277, 0.058670831716527386, 0.08514109983816166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 267.55000000000007, 161, 933, 164.5, 377.8000000000001, 905.5499999999996, 933.0, 0.09992855108597352, 6.12459064425186, 0.2234632706364949], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 118.45454545454545, 79, 295, 84.0, 283.80000000000007, 295.0, 295.0, 0.06692178060606797, 0.05548495286577316, 0.023788601699813228], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e602c17b-9b32-4cd6-b633-bc6ed33ba797", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 87.3157894736842, 80, 121, 84.0, 97.0, 121.0, 121.0, 0.09481605684971156, 0.07361207538625067, 0.033704145208295906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a32121c6-b843-4749-86b5-ada540c995f3", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 0.6145036139455783, 2.345078656462585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73093bc3-e1e9-46c0-8ec0-45822f1bba77", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=454e4774-2917-4b98-963c-dd20b43d5231", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.3290784380692167, 1.2558344717668488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12cd8072-b68a-4f4d-9852-30fdb7dcd345", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 81.88235294117646, 79, 90, 82.0, 84.39999999999999, 90.0, 90.0, 0.09470857614012412, 0.07038401019788522, 0.04753926575783574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 98.94117647058823, 79, 237, 80.0, 237.0, 237.0, 237.0, 0.09470963141239916, 0.03370983893791505, 0.05354619671190444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88b2f50f-10fa-4c60-9182-1b77a68964d7", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 1.3195699896694215, 2.46561854338843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 160.88235294117646, 78, 658, 83.0, 323.5999999999997, 658.0, 658.0, 0.09470963141239916, 5.036960477183335, 0.05520013328987832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 177.7058823529412, 79, 628, 84.0, 316.7999999999997, 628.0, 628.0, 0.09470963141239916, 1.6621300927318714, 0.05529262316430449], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.0, 0.51698670605613], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.714285714285714, 0.22156573116691286], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.142857142857143, 0.14771048744460857], "isController": false}, {"data": ["401/Unauthorized", 16, 57.142857142857146, 1.1816838995568686], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1354, 28, "401/Unauthorized", 16, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
