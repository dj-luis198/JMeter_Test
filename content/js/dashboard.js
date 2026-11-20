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

    var data = {"OkPercent": 97.45508982035928, "KoPercent": 2.5449101796407185};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.777599486521181, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.17857142857142858, 500, 1500, "see books"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ca69a521-4909-4f05-af17-ce08dd84162b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ee50ef17-6523-445b-a9c3-c908560b96b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e18ffb97-fbb6-424e-872d-6ba8b7c054b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2bc35c33-e9b9-4565-8b47-18ce03726e85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b84e61de-e7d5-4302-8b14-4a0a1a915b12"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb074169-db1b-465a-b346-fb46de3d9946"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca69a521-4909-4f05-af17-ce08dd84162b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9e22bb81-e584-43d7-a265-3c746f070fba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/863f05dd-ad61-474f-9490-1c68763b78d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a4572a4b-4ba1-4c77-9076-82370969662e"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bcb07ec0-ebfe-4c02-b7c8-57edec3b66e2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4fcf4db2-60df-44e0-90c0-13e378ac09fc"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9ebfc1f-7176-4758-b75b-4e9974548004"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fab55d86-06cd-4519-8276-f2b2e42bbac9"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7515cdee-24e2-4449-bfe1-ed20908668e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4732142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2bc35c33-e9b9-4565-8b47-18ce03726e85"], "isController": false}, {"data": [0.3, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9318181818181818, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee50ef17-6523-445b-a9c3-c908560b96b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/249ed42d-d3ee-4a4b-8741-eb9456b36ee0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb074169-db1b-465a-b346-fb46de3d9946"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b84e61de-e7d5-4302-8b14-4a0a1a915b12"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e22bb81-e584-43d7-a265-3c746f070fba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7515cdee-24e2-4449-bfe1-ed20908668e1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4572a4b-4ba1-4c77-9076-82370969662e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fab55d86-06cd-4519-8276-f2b2e42bbac9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a9ebfc1f-7176-4758-b75b-4e9974548004"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bcb07ec0-ebfe-4c02-b7c8-57edec3b66e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1336, 34, 2.5449101796407185, 339.3570359281434, 103, 2340, 117.0, 881.0, 1072.0, 1458.4099999999992, 5.214207936055701, 722.4234167783044, 3.8181995639540554], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1575.2142857142858, 1281, 2082, 1557.5, 1927.1000000000001, 1994.65, 2082.0, 0.25324126204591807, 304.7356319146735, 1.2451853070324193], "isController": true}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 553.8, 110, 1461, 535.0, 1370.4, 1461.0, 1461.0, 0.09560534115172567, 0.02018542456738583, 0.06376179132540871], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 553.8, 110, 1461, 535.0, 1370.4, 1461.0, 1461.0, 0.095679740771689, 0.02020113276839762, 0.06381141044695196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 161.3846153846154, 106, 338, 111.0, 337.6, 338.0, 338.0, 0.1440155979970754, 0.05517424502592281, 0.08120350650285815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 148.38461538461536, 111, 341, 114.0, 336.2, 341.0, 341.0, 0.14400762132642095, 0.10702128889590465, 0.07228507554861366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 228.3846153846154, 105, 544, 121.0, 460.3999999999999, 544.0, 544.0, 0.14401400259225206, 3.293130289745095, 0.08385310502498089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 227.23076923076925, 106, 951, 113.0, 706.1999999999998, 951.0, 951.0, 0.14365275813295617, 9.978740859402626, 0.08350248215390736], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 202.5333333333334, 108, 434, 212.0, 317.6000000000001, 434.0, 434.0, 0.09518068466639171, 0.1763631162949332, 0.06150803880199245], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ca69a521-4909-4f05-af17-ce08dd84162b", 3, 0, 0.0, 402.0, 212, 583, 411.0, 583.0, 583.0, 583.0, 0.026368526526737684, 0.026445778069296485, 0.01690950431564884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 23, 0, 0.0, 120.95652173913042, 107, 332, 112.0, 115.6, 288.7999999999994, 332.0, 0.12332836445140327, 0.09165320834718543, 0.061905057937520776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee50ef17-6523-445b-a9c3-c908560b96b2", 3, 0, 0.0, 595.6666666666667, 213, 1295, 279.0, 1295.0, 1295.0, 1295.0, 0.030375440443886438, 0.02532275487525819, 0.01947904221173707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 23, 0, 0.0, 141.3913043478261, 107, 342, 112.0, 333.0, 341.4, 342.0, 0.12332968706432447, 0.0330003264215087, 0.07033646215387256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 643.375, 530, 780, 637.5, 780.0, 780.0, 780.0, 0.06780293078168304, 19.936312919000923, 0.038668858961428604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 965.5, 782, 1015, 986.0, 1015.0, 1015.0, 1015.0, 0.06763783322201274, 60.86064122779577, 0.038508649187923266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 247.25, 108, 344, 314.0, 344.0, 344.0, 344.0, 0.06815471119441131, 0.12060189129323565, 0.03773800903049924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 111.72222222222223, 108, 115, 111.5, 115.0, 115.0, 115.0, 0.0955505303054432, 0.07100972027582253, 0.04796188728222441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 119.88888888888889, 103, 308, 109.0, 132.50000000000028, 308.0, 308.0, 0.09555255921604433, 0.025567774633980616, 0.05449481892790029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 134.88888888888889, 103, 332, 111.0, 327.5, 332.0, 332.0, 0.09554951588245286, 0.025753580452692375, 0.056172664610582644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 132.88888888888886, 103, 331, 110.0, 320.20000000000005, 331.0, 331.0, 0.0955505303054432, 0.025753853871388985, 0.05626657204509985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 138.5, 107, 325, 112.5, 325.0, 325.0, 325.0, 0.06815587248036259, 0.05065099507573821, 0.038271119800984854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 712.3571428571429, 108, 1057, 945.5, 1056.5, 1057.0, 1057.0, 0.0636103412240447, 40.88825345597255, 0.03349127061656595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 23, 0, 0.0, 130.30434782608697, 103, 338, 111.0, 249.80000000000024, 334.19999999999993, 338.0, 0.12332770315558059, 0.03324066999115258, 0.07250320048794874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 608.4285714285713, 110, 1064, 760.0, 972.5, 1064.0, 1064.0, 0.06361120829490156, 13.364761009282693, 0.03355384745577885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 23, 0, 0.0, 139.43478260869566, 105, 339, 111.0, 325.6, 337.2, 339.0, 0.12333034838142323, 0.03324138296218048, 0.07262519538476388], "isController": false}, {"data": ["deleteBooks", 15, 4, 26.666666666666668, 509.20000000000016, 115, 1061, 463.0, 981.2, 1061.0, 1061.0, 0.09589321331764947, 0.020246203827417788, 0.06429090564747098], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e18ffb97-fbb6-424e-872d-6ba8b7c054b1", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 0.9310085641399416, 1.7395909256559765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2bc35c33-e9b9-4565-8b47-18ce03726e85", 3, 0, 0.0, 309.3333333333333, 232, 456, 240.0, 456.0, 456.0, 456.0, 0.04281860611164238, 0.02752823797867633, 0.027458546236958165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 271.6111111111112, 214, 446, 224.5, 441.5, 446.0, 446.0, 0.09549223595070479, 0.14799431489625828, 0.21476427675241513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b84e61de-e7d5-4302-8b14-4a0a1a915b12", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 518.4782608695651, 164, 1204, 511.0, 1017.4000000000001, 1169.3999999999996, 1204.0, 0.09533481171374687, 0.05856015289838553, 0.043105486155727346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 111.57142857142858, 107, 115, 112.0, 114.5, 115.0, 115.0, 0.06360947417682525, 0.0472722752427383, 0.031928974342664236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 195.42857142857144, 107, 609, 111.0, 476.5, 609.0, 609.0, 0.06361178635527183, 0.08526535202308198, 0.03246259967739737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb074169-db1b-465a-b346-fb46de3d9946", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["login", 23, 0, 0.0, 2350.347826086956, 1190, 3829, 2354.0, 3407.4000000000005, 3775.7999999999993, 3829.0, 0.09684781418694155, 40.430187529475425, 0.20198147864505697], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca69a521-4909-4f05-af17-ce08dd84162b", 1, 0, 0.0, 913.0, 913, 913, 913.0, 913.0, 913.0, 913.0, 1.095290251916758, 0.1978795865279299, 0.7551512869660459], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 23, 0, 0.0, 125.78260869565214, 109, 341, 116.0, 124.80000000000001, 297.9999999999994, 341.0, 0.12694207577890002, 0.10276853595772277, 0.04512394099953087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e22bb81-e584-43d7-a265-3c746f070fba", 3, 0, 0.0, 353.3333333333333, 204, 531, 325.0, 531.0, 531.0, 531.0, 0.017272648760687452, 0.023811740723148227, 0.011076535826352304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/863f05dd-ad61-474f-9490-1c68763b78d7", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 1.0504471628289473, 1.9627621299342106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4572a4b-4ba1-4c77-9076-82370969662e", 3, 0, 0.0, 292.0, 216, 427, 233.0, 427.0, 427.0, 427.0, 0.033112582781456956, 0.0276045978200883, 0.02123430601545254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 843.8571428571429, 225, 1175, 1058.5, 1172.5, 1175.0, 1175.0, 0.06357683260219975, 54.35671953193828, 0.13136669470859105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bcb07ec0-ebfe-4c02-b7c8-57edec3b66e2", 3, 0, 0.0, 482.66666666666663, 272, 742, 434.0, 742.0, 742.0, 742.0, 0.0205279796362442, 0.02426337697239671, 0.01316410152454462], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4fcf4db2-60df-44e0-90c0-13e378ac09fc", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.6373970808383234, 1.1909774201596806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 461.4615384615385, 222, 1281, 447.0, 1033.3999999999999, 1281.0, 1281.0, 0.1434672729078609, 13.408068516658757, 0.3198376095317449], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, 46.666666666666664, 641.1333333333334, 108, 1340, 897.0, 1211.0, 1340.0, 1340.0, 0.1267009603932798, 80.8576328617946, 0.1914042373024521], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9ebfc1f-7176-4758-b75b-4e9974548004", 1, 0, 0.0, 1061.0, 1061, 1061, 1061.0, 1061.0, 1061.0, 1061.0, 0.942507068803016, 0.1702771559849199, 0.6498144439208294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fab55d86-06cd-4519-8276-f2b2e42bbac9", 3, 0, 0.0, 446.0, 208, 833, 297.0, 833.0, 833.0, 833.0, 0.01801390673600019, 0.02483362468325547, 0.011551886806614706], "isController": false}, {"data": ["register", 24, 9, 37.5, 766.4166666666667, 148, 2340, 780.0, 1293.0, 2097.5, 2340.0, 0.10267555380626835, 0.031935706921187954, 0.04632432212743747], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 116.35714285714285, 110, 136, 115.5, 126.5, 136.0, 136.0, 0.07598413017166986, 0.058991585436013225, 0.02700998377196077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 23, 0, 0.0, 293.3913043478261, 217, 672, 228.0, 450.6, 627.7999999999994, 672.0, 0.12325632492510838, 0.19102323013295605, 0.27720636357668416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 408.375, 217, 1302, 226.5, 1233.4, 1302.0, 1302.0, 0.09873739555434877, 14.899427188113252, 0.21890485571998075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7515cdee-24e2-4449-bfe1-ed20908668e1", 3, 0, 0.0, 310.3333333333333, 204, 514, 213.0, 514.0, 514.0, 514.0, 0.02662359560533182, 0.026874925121137358, 0.017073074004721252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 151.63636363636363, 105, 340, 111.0, 337.8, 340.0, 340.0, 0.05487871803314675, 0.04078389103830534, 0.02754654401273186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 130.45454545454544, 108, 333, 109.0, 289.00000000000017, 333.0, 333.0, 0.05487789667988725, 0.014684124697547957, 0.0312975504502482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 152.0, 104, 341, 112.0, 340.8, 341.0, 341.0, 0.054877075351213285, 0.014791086715756704, 0.03226171812639687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 166.8181818181818, 103, 336, 108.0, 334.6, 336.0, 336.0, 0.05487926561564558, 0.014791677060466973, 0.03231659879515067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 115.75, 115, 117, 115.5, 117.0, 117.0, 117.0, 0.06970462664459354, 0.020557419186198484, 0.04308889518166768], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1048.178571428571, 834, 1619, 896.0, 1470.7, 1526.1499999999999, 1619.0, 0.24857623522414032, 297.38359640984896, 0.4908409644757927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 766.4166666666667, 148, 2340, 780.0, 1293.0, 2097.5, 2340.0, 0.09877234209800687, 0.030721670857632014, 0.04456330278249919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 169.71428571428572, 104, 333, 111.0, 333.0, 333.0, 333.0, 0.032108029759556726, 0.008654117396130524, 0.01890736518067647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 153.42857142857144, 105, 425, 108.0, 425.0, 425.0, 425.0, 0.032138102015518116, 0.008662222808870116, 0.018893688880216704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 142.7857142857143, 104, 334, 112.0, 333.5, 334.0, 334.0, 0.07610722420644628, 0.020513275274393724, 0.044742723605742836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 126.0, 104, 336, 111.0, 226.0, 336.0, 336.0, 0.0761059830174935, 0.020512940735183796, 0.04481631617143416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 109.85714285714285, 106, 115, 110.0, 115.0, 115.0, 115.0, 0.03213765936835726, 0.00859933463567372, 0.01832850885851625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 129.21428571428572, 108, 335, 114.0, 228.0, 335.0, 335.0, 0.07619876993414249, 0.05662818742176019, 0.03824821068959887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 110.85714285714286, 108, 113, 112.0, 113.0, 113.0, 113.0, 0.03213721673338965, 0.023883224545028833, 0.016131376368127226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 125.85714285714285, 104, 324, 111.5, 220.5, 324.0, 324.0, 0.07619918466872405, 0.020389234960185923, 0.04345734750638168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 145.85714285714286, 105, 346, 115.0, 346.0, 346.0, 346.0, 0.03325842269554765, 0.026178016301378323, 0.011822329942557951], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 518.7857142857142, 108, 1295, 522.5, 1064.0, 1295.0, 1295.0, 0.10570505270151914, 0.021065801867204255, 0.07192751040062216], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1201.5217391304348, 790, 2249, 1088.0, 1986.2000000000003, 2206.1999999999994, 2249.0, 0.09827967832633981, 0.050867411633750095, 0.04520481298018169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 296.1428571428571, 218, 536, 224.0, 536.0, 536.0, 536.0, 0.03209124917479645, 0.04973516839883005, 0.07217397153276975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2bc35c33-e9b9-4565-8b47-18ce03726e85", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["addBook", 60, 10, 16.666666666666668, 1029.3166666666668, 546, 2976, 899.5, 1648.6, 1740.8, 2976.0, 0.2685200517348633, 70.66554880044261, 0.9787783148800386], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 204.73214285714295, 107, 468, 114.0, 448.0, 454.95, 468.0, 0.24940099225966206, 0.1853458545992215, 0.12056004996927022], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 644.4464285714284, 517, 946, 560.5, 788.3, 832.7499999999999, 946.0, 0.24934879889574105, 73.3168260346862, 0.12540491350713537], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 182.92857142857147, 104, 456, 114.0, 334.3, 338.45, 456.0, 0.24981932709379825, 0.44206310614644767, 0.12149416493428859], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 841.767857142857, 719, 1131, 768.5, 1032.8000000000002, 1075.6, 1131.0, 0.24911586111790746, 224.15488973286773, 0.12504448497519963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 127.06250000000001, 108, 323, 114.5, 179.50000000000014, 323.0, 323.0, 0.10058907476911663, 0.07514711152184984, 0.035756272671834434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 10, 5.681818181818182, 175.07954545454552, 105, 1836, 116.0, 284.90000000000003, 321.45000000000016, 1278.5199999999927, 0.7313282749794314, 1.5693545794239128, 0.3518835598650367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 139.27272727272728, 109, 335, 116.0, 297.40000000000015, 335.0, 335.0, 0.054713030156827436, 0.04237053995543375, 0.019448772438559754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee50ef17-6523-445b-a9c3-c908560b96b2", 1, 0, 0.0, 706.0, 706, 706, 706.0, 706.0, 706.0, 706.0, 1.41643059490085, 0.2558981055240793, 0.9765625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/249ed42d-d3ee-4a4b-8741-eb9456b36ee0", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 1.573083435960591, 2.939308805418719], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 115.38461538461539, 109, 124, 114.0, 122.8, 124.0, 124.0, 0.1484950596835913, 0.12050722128619566, 0.05278535324690159], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb074169-db1b-465a-b346-fb46de3d9946", 3, 0, 0.0, 303.0, 223, 436, 250.0, 436.0, 436.0, 436.0, 0.024553534890573082, 0.024625469074822805, 0.015745593663551095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 326.0909090909091, 218, 677, 228.0, 675.6, 677.0, 677.0, 0.054848070843762774, 0.08500379729399563, 0.12335459682928289], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b84e61de-e7d5-4302-8b14-4a0a1a915b12", 3, 0, 0.0, 396.6666666666667, 217, 559, 414.0, 559.0, 559.0, 559.0, 0.056121971751940884, 0.03608102025067814, 0.03598967589561313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 274.3571428571429, 218, 668, 226.5, 559.5, 668.0, 668.0, 0.07605926102995106, 0.11787699927200421, 0.17105906069529028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 140.9444444444444, 108, 391, 113.5, 339.7000000000001, 391.0, 391.0, 0.0955297389384523, 0.0792038558190879, 0.03395783688827797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e22bb81-e584-43d7-a265-3c746f070fba", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 130.64285714285717, 106, 330, 116.5, 228.0, 330.0, 330.0, 0.062143507113212156, 0.048246179838870765, 0.022090074794149633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7515cdee-24e2-4449-bfe1-ed20908668e1", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4572a4b-4ba1-4c77-9076-82370969662e", 1, 0, 0.0, 928.0, 928, 928, 928.0, 928.0, 928.0, 928.0, 1.0775862068965516, 0.19468110183189655, 0.7429451778017241], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fab55d86-06cd-4519-8276-f2b2e42bbac9", 1, 0, 0.0, 719.0, 719, 719, 719.0, 719.0, 719.0, 719.0, 1.3908205841446453, 0.25127129694019473, 0.9589055980528512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9ebfc1f-7176-4758-b75b-4e9974548004", 3, 0, 0.0, 719.3333333333334, 210, 1397, 551.0, 1397.0, 1397.0, 1397.0, 0.0333022512321833, 0.027762716603392388, 0.021355935848763375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 123.68750000000001, 106, 315, 110.5, 175.00000000000014, 315.0, 315.0, 0.09880629643124009, 0.07342928865641964, 0.049596129263337306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bcb07ec0-ebfe-4c02-b7c8-57edec3b66e2", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 138.375, 103, 344, 111.0, 337.7, 344.0, 344.0, 0.09880507611078519, 0.04498815111001327, 0.055312509648933215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 239.25, 103, 1088, 111.5, 1016.6, 1088.0, 1088.0, 0.09880446596186147, 11.136356048840282, 0.05702484314791028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 254.99999999999997, 104, 861, 111.0, 830.2, 861.0, 861.0, 0.09880507611078519, 3.6547988004446226, 0.05712168462654769], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 26.470588235294116, 0.6736526946107785], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.764705882352942, 0.2994011976047904], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.823529411764707, 0.2245508982035928], "isController": false}, {"data": ["401/Unauthorized", 18, 52.94117647058823, 1.347305389221557], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1336, 34, "401/Unauthorized", 18, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
