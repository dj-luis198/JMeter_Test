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

    var data = {"OkPercent": 97.29119638826185, "KoPercent": 2.708803611738149};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7108472400513479, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/24aa4adc-3fe8-4ac5-a73d-fa9568032b2c"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9e92da7d-a76a-4e3d-8c90-57d3b597f17d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e8db0ac-2c18-478a-95c5-0d25aec92799"], "isController": false}, {"data": [0.38235294117647056, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.38235294117647056, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ea6578f9-dd0f-4716-b19a-86a69b197586"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1f4ca0fd-2fd5-4b96-a676-57c81d1e91da"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3204858-dcdb-4826-9bc7-8b8bca7f5bff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5046eb7b-c2d6-4269-94aa-1abfa9fc16d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50726978-1fba-4ee2-8335-858dc9c91c09"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/53bb4e56-c751-42e6-a8d6-f437e83023ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d6400ea9-5e5c-4cad-b6c9-aed4d5ff4bb5"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/524269ee-7826-4179-ae56-9ed7212bff81"], "isController": false}, {"data": [0.6956521739130435, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/106cf976-0048-4d26-83b7-e5136bf786c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/49e35ced-c5ac-488a-b827-401fc8944b59"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f80486de-ac1f-489b-849c-f46d634c939c"], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.06666666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/50726978-1fba-4ee2-8335-858dc9c91c09"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b3204858-dcdb-4826-9bc7-8b8bca7f5bff"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e92da7d-a76a-4e3d-8c90-57d3b597f17d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea6578f9-dd0f-4716-b19a-86a69b197586"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=106cf976-0048-4d26-83b7-e5136bf786c6"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41baea5e-2825-47e5-abb0-c26b69732631"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d6400ea9-5e5c-4cad-b6c9-aed4d5ff4bb5"], "isController": false}, {"data": [0.2413793103448276, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f4ca0fd-2fd5-4b96-a676-57c81d1e91da"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.33035714285714285, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9040697674418605, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5046eb7b-c2d6-4269-94aa-1abfa9fc16d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49e35ced-c5ac-488a-b827-401fc8944b59"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/41baea5e-2825-47e5-abb0-c26b69732631"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f80486de-ac1f-489b-849c-f46d634c939c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0e8db0ac-2c18-478a-95c5-0d25aec92799"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24aa4adc-3fe8-4ac5-a73d-fa9568032b2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1329, 36, 2.708803611738149, 498.86982693754646, 141, 5398, 160.0, 1428.0, 1712.5, 2190.0, 5.373887516325862, 767.7719037913909, 3.926621788657418], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/24aa4adc-3fe8-4ac5-a73d-fa9568032b2c", 3, 0, 0.0, 366.6666666666667, 250, 483, 367.0, 483.0, 483.0, 483.0, 0.027831120759232976, 0.02791265724583229, 0.017847430955627915], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2379.089285714285, 1729, 3005, 2416.0, 2790.2, 2901.0, 3005.0, 0.2418317024088165, 291.00445782735807, 1.1890845914339756], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9e92da7d-a76a-4e3d-8c90-57d3b597f17d", 3, 0, 0.0, 848.0, 276, 1768, 500.0, 1768.0, 1768.0, 1768.0, 0.09066457130768533, 0.041023357460183145, 0.058141017407597695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e8db0ac-2c18-478a-95c5-0d25aec92799", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 522.9999999999999, 151, 978, 537.0, 865.9999999999999, 978.0, 978.0, 0.09364430587535393, 0.01943571215117496, 0.06259450500721611], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 522.9999999999999, 151, 978, 537.0, 865.9999999999999, 978.0, 978.0, 0.09375327447098336, 0.01945832839290343, 0.06266734270130758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 187.58823529411768, 143, 593, 145.0, 460.1999999999999, 593.0, 593.0, 0.09453320061613404, 0.04199906787483804, 0.052979429297507104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 179.88235294117644, 144, 438, 146.0, 433.2, 438.0, 438.0, 0.09452952101335647, 0.07025094286246511, 0.04744938847740745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 313.2941176470588, 141, 1150, 146.0, 1144.4, 1150.0, 1150.0, 0.0943836194452464, 3.287377995291923, 0.05462517037631304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 372.5882352941176, 144, 1717, 146.0, 1611.3999999999999, 1717.0, 1717.0, 0.0943836194452464, 10.01380490558862, 0.05453299887294854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea6578f9-dd0f-4716-b19a-86a69b197586", 3, 0, 0.0, 954.0, 255, 1758, 849.0, 1758.0, 1758.0, 1758.0, 0.04065701740120345, 0.02613854471594297, 0.026072371185016534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f4ca0fd-2fd5-4b96-a676-57c81d1e91da", 3, 0, 0.0, 343.6666666666667, 264, 498, 269.0, 498.0, 498.0, 498.0, 0.07462315307696135, 0.03459094074921646, 0.04785404022187951], "isController": false}, {"data": ["goToProfile", 18, 4, 22.22222222222222, 403.27777777777777, 145, 2923, 252.5, 804.4000000000033, 2923.0, 2923.0, 0.09655719941207395, 0.1625683360110075, 0.062401766460320356], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3204858-dcdb-4826-9bc7-8b8bca7f5bff", 1, 0, 0.0, 1496.0, 1496, 1496, 1496.0, 1496.0, 1496.0, 1496.0, 0.6684491978609626, 0.1207647476604278, 0.46086438836898397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5046eb7b-c2d6-4269-94aa-1abfa9fc16d3", 3, 0, 0.0, 399.3333333333333, 328, 453, 417.0, 453.0, 453.0, 453.0, 0.02742781912267549, 0.02286544426210024, 0.017588803278538647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50726978-1fba-4ee2-8335-858dc9c91c09", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 187.12500000000003, 144, 483, 146.0, 449.40000000000003, 483.0, 483.0, 0.09199261759243821, 0.06836560741000534, 0.046175981877454336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 163.00000000000003, 143, 432, 145.0, 233.9000000000002, 432.0, 432.0, 0.09199314651058496, 0.03325094077366236, 0.051981967187194555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 1094.375, 859, 1298, 1147.0, 1298.0, 1298.0, 1298.0, 0.060547806277293816, 17.80306542190468, 0.034531170767519125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1461.0, 1280, 1722, 1426.0, 1722.0, 1722.0, 1722.0, 0.06041794110761191, 54.364169612041294, 0.034398105142322014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 253.0, 143, 437, 145.0, 437.0, 437.0, 437.0, 0.06101234737379977, 0.10796325531379412, 0.033783204063422334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53bb4e56-c751-42e6-a8d6-f437e83023ae", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 1.013764880952381, 1.8942212301587302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 168.53846153846152, 144, 428, 146.0, 319.5999999999999, 428.0, 428.0, 0.08363301831563101, 0.06215305365058125, 0.04197985489671322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 212.0769230769231, 141, 436, 145.0, 434.4, 436.0, 436.0, 0.08347620607064656, 0.03198081813103196, 0.04706823939049527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 387.84615384615387, 143, 1567, 426.0, 1113.7999999999997, 1567.0, 1567.0, 0.08287433700530396, 5.756809292205349, 0.04817319859878621], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6400ea9-5e5c-4cad-b6c9-aed4d5ff4bb5", 2, 0, 0.0, 1588.0, 253, 2923, 1588.0, 2923.0, 2923.0, 2923.0, 0.011532894698904951, 0.02280674977078372, 0.007168640113137697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 287.9230769230769, 143, 844, 150.0, 679.1999999999998, 844.0, 844.0, 0.08325914729824067, 1.9038650057000492, 0.048478188905398394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 182.625, 144, 428, 146.5, 428.0, 428.0, 428.0, 0.06101095146578811, 0.04534114654830542, 0.034259079192215006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 960.3157894736845, 144, 1881, 1434.0, 1716.0, 1881.0, 1881.0, 0.09822471747469422, 46.529789795873526, 0.05330266072665612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 287.9375, 143, 1570, 146.0, 772.0000000000008, 1570.0, 1570.0, 0.09184317777395097, 5.188248243857987, 0.05350044486539234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 633.7894736842105, 143, 1295, 849.0, 1161.0, 1295.0, 1295.0, 0.09822624088176146, 15.213475670911073, 0.053399411482647555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 261.9375, 144, 863, 146.5, 564.1000000000004, 863.0, 863.0, 0.09184265057889571, 1.7110066062131553, 0.05358982785243182], "isController": false}, {"data": ["deleteBooks", 17, 4, 23.529411764705884, 666.9411764705883, 147, 2199, 517.0, 1636.5999999999995, 2199.0, 2199.0, 0.09353147334077917, 0.01941229395566608, 0.06291667927507606], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 579.7692307692308, 290, 1712, 578.0, 1371.5999999999997, 1712.0, 1712.0, 0.08279780139991974, 7.7380615920106495, 0.18458461178977004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/524269ee-7826-4179-ae56-9ed7212bff81", 2, 0, 0.0, 512.0, 455, 569, 512.0, 569.0, 569.0, 569.0, 0.1067748651967327, 0.06563943129037424, 0.06636933759543003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 623.4347826086956, 208, 1625, 629.0, 1056.4000000000003, 1531.9999999999986, 1625.0, 0.09946849227389298, 0.06109929847683465, 0.04497452336212153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 176.89473684210526, 144, 434, 147.0, 432.0, 434.0, 434.0, 0.09822319411487979, 0.07299594797014014, 0.04930343923344551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 252.63157894736844, 144, 444, 147.0, 437.0, 444.0, 444.0, 0.09822573307415526, 0.10393066103333472, 0.05167755981430167], "isController": false}, {"data": ["login", 23, 0, 0.0, 3393.6521739130435, 1810, 7978, 3331.0, 4940.200000000001, 7394.999999999992, 7978.0, 0.09806387795737206, 40.93784675440541, 0.20451764696790753], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/106cf976-0048-4d26-83b7-e5136bf786c6", 3, 0, 0.0, 451.6666666666667, 236, 622, 497.0, 622.0, 622.0, 622.0, 0.024950307304618304, 0.0250234039080498, 0.016000034306672545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 169.0625, 146, 439, 149.0, 250.7000000000002, 439.0, 439.0, 0.09373553689957995, 0.07588550790014821, 0.033320054132272556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49e35ced-c5ac-488a-b827-401fc8944b59", 3, 0, 0.0, 319.6666666666667, 244, 468, 247.0, 468.0, 468.0, 468.0, 0.04174551931426027, 0.03393182347907158, 0.026770401383168205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f80486de-ac1f-489b-849c-f46d634c939c", 3, 0, 0.0, 379.6666666666667, 275, 586, 278.0, 586.0, 586.0, 586.0, 0.024887384584753987, 0.024960296844279632, 0.015959683473947054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1138.5263157894738, 292, 2037, 1583.0, 1864.0, 2037.0, 2037.0, 0.09814911433338672, 61.872296661832394, 0.20752262111084135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 596.7058823529412, 289, 2023, 294.0, 1895.8, 2023.0, 2023.0, 0.09430455934807813, 13.402022460086982, 0.20925449298817866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, 46.666666666666664, 946.6666666666666, 145, 1867, 1426.0, 1864.6, 1867.0, 1867.0, 0.11315716020790742, 72.21429172575985, 0.17094392874116432], "isController": false}, {"data": ["register", 25, 9, 36.0, 1150.7199999999998, 203, 1873, 1164.0, 1801.6000000000001, 1854.1, 1873.0, 0.10417404566156768, 0.03245672610143219, 0.04700039950746511], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 153.4444444444444, 145, 175, 149.5, 170.5, 175.0, 175.0, 0.08240814925031476, 0.0639789830605471, 0.02929352180382282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 530.3124999999999, 290, 1718, 311.0, 1159.4000000000005, 1718.0, 1718.0, 0.09176521868798679, 6.994773549607704, 0.20491469060782985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 410.29411764705884, 290, 582, 295.0, 580.4, 582.0, 582.0, 0.1367713906432278, 0.2119689423347681, 0.3076020631360875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 148.80000000000004, 144, 162, 146.0, 161.3, 162.0, 162.0, 0.05635834892580987, 0.04188349954349737, 0.028289249363150654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 145.5, 143, 148, 146.0, 147.9, 148.0, 148.0, 0.05635898418566904, 0.015080431315305972, 0.03214223316838937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 144.7, 143, 147, 144.5, 146.9, 147.0, 147.0, 0.05635930182096904, 0.015190593068933063, 0.03313310517209313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 174.5, 143, 435, 146.0, 406.3000000000001, 435.0, 435.0, 0.05635930182096904, 0.015190593068933063, 0.03318814355277767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 151.25, 147, 157, 150.5, 157.0, 157.0, 157.0, 0.12038764822729188, 0.03550495094203335, 0.07441931770300367], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1642.4642857142858, 1144, 2360, 1523.0, 2190.6, 2302.75, 2360.0, 0.2503184855731623, 299.4679335315021, 0.49428122834856847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50726978-1fba-4ee2-8335-858dc9c91c09", 3, 0, 0.0, 347.3333333333333, 246, 495, 301.0, 495.0, 495.0, 495.0, 0.03381844006808779, 0.03391751752922477, 0.021686955382204737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 1150.7199999999998, 203, 1873, 1164.0, 1801.6000000000001, 1854.1, 1873.0, 0.10744323773750328, 0.03347528375759086, 0.04847536702610011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 287.0, 144, 431, 286.5, 431.0, 431.0, 431.0, 0.0353129165820628, 0.009517934547509115, 0.020794617870101437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 288.75, 143, 433, 289.5, 433.0, 433.0, 433.0, 0.03531229309203266, 0.009517766497461928, 0.020759766056058265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3204858-dcdb-4826-9bc7-8b8bca7f5bff", 3, 0, 0.0, 591.3333333333333, 234, 1160, 380.0, 1160.0, 1160.0, 1160.0, 0.020705791409857337, 0.024473544469138016, 0.013278127954888983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 240.1111111111111, 143, 1563, 145.0, 546.9000000000016, 1563.0, 1563.0, 0.07999822226172751, 4.019394187073621, 0.04664826892735717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 232.88888888888889, 144, 1140, 146.0, 501.900000000001, 1140.0, 1140.0, 0.0799975111885408, 1.3271375307212665, 0.046725976858497734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 162.38888888888889, 143, 434, 146.0, 181.1000000000004, 434.0, 434.0, 0.07999573356087675, 0.05944995433576876, 0.040154108447549464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e92da7d-a76a-4e3d-8c90-57d3b597f17d", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 144.25, 143, 146, 144.0, 146.0, 146.0, 146.0, 0.03540230291980493, 0.00947288183596343, 0.020190375883951252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 178.33333333333334, 144, 438, 146.0, 436.2, 438.0, 438.0, 0.07999857780306129, 0.028081098002702174, 0.045250931650104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 289.0, 147, 433, 288.0, 433.0, 433.0, 433.0, 0.03540136295247367, 0.026309020709797327, 0.017769824763253388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea6578f9-dd0f-4716-b19a-86a69b197586", 1, 0, 0.0, 708.0, 708, 708, 708.0, 708.0, 708.0, 708.0, 1.4124293785310735, 0.255175229519774, 0.9738038488700566], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 494.9333333333334, 145, 1160, 495.0, 973.4000000000001, 1160.0, 1160.0, 0.09417792092821758, 0.018651642933830592, 0.06408513213162306], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 223.0, 148, 437, 153.5, 437.0, 437.0, 437.0, 0.03777005589968273, 0.029729165092914338, 0.013426074558090346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=106cf976-0048-4d26-83b7-e5136bf786c6", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.3231915250447227, 1.2333687388193202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1769.6086956521742, 847, 5398, 1607.0, 2404.8, 4811.999999999992, 5398.0, 0.1000395808776516, 0.05177829869644077, 0.0460142994075917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41baea5e-2825-47e5-abb0-c26b69732631", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 579.0, 293, 866, 578.5, 866.0, 866.0, 866.0, 0.03526621584687409, 0.05465574662987225, 0.07931454599155374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d6400ea9-5e5c-4cad-b6c9-aed4d5ff4bb5", 1, 0, 0.0, 1088.0, 1088, 1088, 1088.0, 1088.0, 1088.0, 1088.0, 0.9191176470588235, 0.16605152803308823, 0.6336885340073529], "isController": false}, {"data": ["addBook", 58, 12, 20.689655172413794, 1469.5689655172414, 733, 4632, 1117.5, 2552.7, 2867.049999999996, 4632.0, 0.27388462846133504, 85.8203639640432, 0.9948423805768577], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f4ca0fd-2fd5-4b96-a676-57c81d1e91da", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 0.6642061121323529, 2.5347541360294117], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 261.85714285714283, 143, 611, 147.0, 584.3, 590.05, 611.0, 0.2514571041122217, 0.18687388303652414, 0.1215539712261228], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 952.1785714285716, 707, 1328, 863.5, 1281.8, 1295.8, 1328.0, 0.25118415386823595, 73.85648133612028, 0.12632796800990384], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 191.9107142857143, 143, 498, 147.0, 434.6, 473.25, 498.0, 0.25198891248785055, 0.44590225530076677, 0.12254929533100543], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1379.1250000000002, 997, 1827, 1375.5, 1717.5, 1751.5, 1827.0, 0.25100964145962107, 225.85891661325243, 0.12599507393578635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 150.88235294117646, 146, 170, 150.0, 156.39999999999998, 170.0, 170.0, 0.13718638788240706, 0.10248787766605605, 0.04876547381757439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 12, 6.976744186046512, 231.84883720930233, 145, 2297, 154.0, 368.70000000000016, 477.4, 2189.6900000000014, 0.7316253567737023, 1.6027068277234968, 0.3503932486292659], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 176.89999999999998, 146, 430, 148.0, 402.60000000000014, 430.0, 430.0, 0.05734471052390128, 0.044408550239700896, 0.020384252569043033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5046eb7b-c2d6-4269-94aa-1abfa9fc16d3", 1, 0, 0.0, 775.0, 775, 775, 775.0, 775.0, 775.0, 775.0, 1.2903225806451613, 0.2331149193548387, 0.889616935483871], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 150.64705882352945, 146, 160, 150.0, 158.4, 160.0, 160.0, 0.09413901563815177, 0.07639601757353918, 0.033463478215124264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49e35ced-c5ac-488a-b827-401fc8944b59", 1, 0, 0.0, 933.0, 933, 933, 933.0, 933.0, 933.0, 933.0, 1.0718113612004287, 0.19363779474812431, 0.7389636923901393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 324.79999999999995, 289, 587, 293.5, 559.2, 587.0, 587.0, 0.056312330711055805, 0.08727311410004449, 0.12664775158941555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41baea5e-2825-47e5-abb0-c26b69732631", 3, 0, 0.0, 425.0, 248, 569, 458.0, 569.0, 569.0, 569.0, 0.02860248269549797, 0.03397475890490628, 0.01834208688480827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 436.44444444444446, 289, 1708, 294.0, 953.8000000000012, 1708.0, 1708.0, 0.07994350658867733, 5.430359594497666, 0.17865847023658837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f80486de-ac1f-489b-849c-f46d634c939c", 1, 0, 0.0, 2199.0, 2199, 2199, 2199.0, 2199.0, 2199.0, 2199.0, 0.4547521600727603, 0.08215737266939518, 0.3135302978626649], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e8db0ac-2c18-478a-95c5-0d25aec92799", 3, 0, 0.0, 901.0, 270, 1898, 535.0, 1898.0, 1898.0, 1898.0, 0.049504133595155195, 0.031826387972145674, 0.031745814838038976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 153.07692307692307, 146, 170, 152.0, 166.8, 170.0, 170.0, 0.08278303839222605, 0.06863554647949209, 0.0294267831784866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 166.8947368421052, 146, 434, 149.0, 169.0, 434.0, 434.0, 0.0986428816181586, 0.07658309656878523, 0.03506446182520481], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24aa4adc-3fe8-4ac5-a73d-fa9568032b2c", 1, 0, 0.0, 984.0, 984, 984, 984.0, 984.0, 984.0, 984.0, 1.016260162601626, 0.18360168953252032, 0.7006637449186992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 145.76470588235293, 143, 153, 145.0, 148.2, 153.0, 153.0, 0.13693444062281007, 0.10176475518941255, 0.06873467039074645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 195.2941176470588, 143, 434, 145.0, 430.8, 434.0, 434.0, 0.1369333376292812, 0.036640365732835, 0.07809479411669942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 229.7058823529412, 143, 433, 146.0, 433.0, 433.0, 433.0, 0.13693223465352117, 0.03690751637145688, 0.08050117701310522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 229.2941176470588, 142, 435, 146.0, 434.2, 435.0, 435.0, 0.13693444062281007, 0.03690811094911677, 0.0806361989214399], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 25.0, 0.6772009029345373], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.11111111111111, 0.3009781790820166], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.333333333333334, 0.22573363431151242], "isController": false}, {"data": ["401/Unauthorized", 20, 55.55555555555556, 1.5048908954100828], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1329, 36, "401/Unauthorized", 20, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
