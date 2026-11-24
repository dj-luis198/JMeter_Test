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

    var data = {"OkPercent": 98.27067669172932, "KoPercent": 1.7293233082706767};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7578981302385558, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/db91f652-6dc0-4fb7-a5de-998ac0e46100"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6c4185d5-5d33-4a8d-a0f7-570b32159b5c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e6072086-3622-4538-bfab-8f83b61d154d"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3009eab-238c-4687-a83b-4afc5882066e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e9a02cad-21cc-4e93-a14b-136807b65fa7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82088c21-297f-4f36-a78e-48df149159a5"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c0a04bd-8477-4cc8-8b76-acf4d01b76f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc0f18a2-50cf-4b5b-a667-05a75f327f54"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9ff08dbb-3440-4aba-87a4-24bc6fe09089"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/854fe871-2159-48a4-9499-143df6346690"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b5d70199-d09a-473e-8a2b-3190d7ec2c79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/42117fc3-353c-42d8-818c-7eba4f6bed4e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c0a04bd-8477-4cc8-8b76-acf4d01b76f0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6072086-3622-4538-bfab-8f83b61d154d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d406615-af0f-43df-b582-723e8cecffe2"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de607e50-9435-4e76-bbda-2dcb67401605"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e6d5457d-e34a-48ce-a52a-9d310a849d0f"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b3009eab-238c-4687-a83b-4afc5882066e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cc0f18a2-50cf-4b5b-a667-05a75f327f54"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e9a02cad-21cc-4e93-a14b-136807b65fa7"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c4185d5-5d33-4a8d-a0f7-570b32159b5c"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82088c21-297f-4f36-a78e-48df149159a5"], "isController": false}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9350282485875706, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c0294cd7-2916-4c84-9785-1f4360ce6afa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5d70199-d09a-473e-8a2b-3190d7ec2c79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=854fe871-2159-48a4-9499-143df6346690"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ff08dbb-3440-4aba-87a4-24bc6fe09089"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42117fc3-353c-42d8-818c-7eba4f6bed4e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6d5457d-e34a-48ce-a52a-9d310a849d0f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3d406615-af0f-43df-b582-723e8cecffe2"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1330, 23, 1.7293233082706767, 424.033834586466, 139, 2026, 148.5, 1119.0, 1273.45, 1812.570000000003, 5.166994945668854, 728.3836084915968, 3.775079532386957], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2091.9298245614045, 1694, 3132, 1999.0, 2457.8, 2609.6, 3132.0, 0.2621895124195032, 315.5016988773574, 1.2891837842111316], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/db91f652-6dc0-4fb7-a5de-998ac0e46100", 1, 0, 0.0, 1561.0, 1561, 1561, 1561.0, 1561.0, 1561.0, 1561.0, 0.6406149903907751, 0.20457138853299167, 0.3822419522741832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c4185d5-5d33-4a8d-a0f7-570b32159b5c", 3, 0, 0.0, 701.0, 237, 1289, 577.0, 1289.0, 1289.0, 1289.0, 0.04516507836141096, 0.03765226747512157, 0.028963282673170436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6072086-3622-4538-bfab-8f83b61d154d", 3, 0, 0.0, 602.6666666666666, 242, 1016, 550.0, 1016.0, 1016.0, 1016.0, 0.01514004542013626, 0.020871774854907897, 0.009708948397678526], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 545.6, 143, 893, 571.0, 857.0, 893.0, 893.0, 0.0751089079164789, 0.014713717703169595, 0.050571375369285465], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 545.6, 143, 893, 571.0, 857.0, 893.0, 893.0, 0.07608535762654263, 0.01490500267566841, 0.05122882607901718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3009eab-238c-4687-a83b-4afc5882066e", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.3006057612312812, 1.1471765806988352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 235.5, 139, 425, 143.0, 425.0, 425.0, 425.0, 0.10549759699917946, 0.028228849197046067, 0.06016659828859454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e9a02cad-21cc-4e93-a14b-136807b65fa7", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 162.27777777777777, 141, 491, 143.0, 180.50000000000048, 491.0, 491.0, 0.10549821532185746, 0.07840248228509135, 0.05295515886272924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 228.0, 140, 564, 143.0, 440.7000000000002, 564.0, 564.0, 0.10549821532185746, 0.028435065848469398, 0.06212443734285162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 157.38888888888886, 140, 420, 142.0, 175.2000000000004, 420.0, 420.0, 0.10549883365178352, 0.028435232507707277, 0.06202177525231804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82088c21-297f-4f36-a78e-48df149159a5", 3, 0, 0.0, 437.6666666666667, 300, 679, 334.0, 679.0, 679.0, 679.0, 0.027720796141265176, 0.02780200941121029, 0.01777668242131914], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 248.6, 142, 384, 242.0, 354.0, 384.0, 384.0, 0.07525171699334274, 0.15011639716100356, 0.04863926082746788], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c0a04bd-8477-4cc8-8b76-acf4d01b76f0", 1, 0, 0.0, 655.0, 655, 655, 655.0, 655.0, 655.0, 655.0, 1.5267175572519083, 0.2758229961832061, 1.0526001908396947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 161.7058823529412, 140, 421, 144.0, 228.99999999999983, 421.0, 421.0, 0.11403655877913803, 0.08474787229582426, 0.057241007043434516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 191.64705882352942, 140, 425, 143.0, 424.2, 425.0, 425.0, 0.11403732374525404, 0.04058911178340958, 0.06447353747132296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1037.4, 848, 1259, 978.0, 1259.0, 1259.0, 1259.0, 0.027311658800908932, 8.03053451988835, 0.015576180409893375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc0f18a2-50cf-4b5b-a667-05a75f327f54", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1127.8, 988, 1418, 991.0, 1418.0, 1418.0, 1418.0, 0.02727069436641996, 24.538218727672117, 0.015526186343381675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 198.8, 141, 421, 144.0, 421.0, 421.0, 421.0, 0.027436498224858566, 0.048549740999456754, 0.015191889153803522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 165.07692307692307, 141, 426, 143.0, 313.5999999999999, 426.0, 426.0, 0.06289795049447466, 0.04674349641239767, 0.03157182280679685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 207.76923076923077, 140, 441, 141.0, 433.8, 441.0, 441.0, 0.06289916779562608, 0.01683044138281401, 0.035872181633443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 207.07692307692304, 141, 425, 143.0, 423.4, 425.0, 425.0, 0.06289886346592091, 0.016953209293548994, 0.03697765215476991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 187.0, 141, 438, 142.0, 433.2, 438.0, 438.0, 0.06289916779562608, 0.016953291319914843, 0.03703925603590091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 143.0, 141, 145, 144.0, 145.0, 145.0, 145.0, 0.027436648777971664, 0.020389931367223082, 0.015406321335286823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 613.1499999999999, 141, 1400, 144.0, 1284.9, 1394.3, 1400.0, 0.10221447663632599, 41.402897085673615, 0.05613810709010717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 224.2941176470588, 141, 972, 143.0, 534.3999999999996, 972.0, 972.0, 0.11403808872163303, 6.064909526289133, 0.06646544394357126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 538.1500000000001, 141, 1129, 283.0, 1115.9000000000003, 1128.9, 1129.0, 0.10221395424903407, 13.539585787532964, 0.056237638499908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 216.5294117647059, 140, 1130, 142.0, 561.9999999999995, 1130.0, 1130.0, 0.11403732374525404, 2.001326207957122, 0.06657636266216778], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 454.5333333333334, 144, 670, 494.0, 661.0, 670.0, 670.0, 0.07635219741624165, 0.014957276173533275, 0.051915517566095554], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9ff08dbb-3440-4aba-87a4-24bc6fe09089", 3, 0, 0.0, 365.3333333333333, 238, 462, 396.0, 462.0, 462.0, 462.0, 0.045374109533100414, 0.028225886496665, 0.029097329355536397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 417.84615384615387, 285, 853, 289.0, 746.5999999999999, 853.0, 853.0, 0.06285476680881515, 0.09741261223202112, 0.14136184371162233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 451.9047619047619, 172, 1008, 406.0, 806.4, 987.8999999999997, 1008.0, 0.08859339008935276, 0.054419181998245005, 0.04005736290172884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 229.89999999999995, 141, 1561, 144.0, 401.7000000000005, 1504.2999999999993, 1561.0, 0.10219724067450178, 0.075949316555953, 0.05129822432294329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 220.35, 140, 572, 143.0, 426.0, 564.6999999999999, 572.0, 0.10221447663632599, 0.09643496667808062, 0.0544312051853404], "isController": false}, {"data": ["login", 21, 0, 0.0, 2329.714285714286, 1303, 4144, 2379.0, 3571.6000000000004, 4100.599999999999, 4144.0, 0.08947478302365117, 25.609456252955862, 0.17032413704767302], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/854fe871-2159-48a4-9499-143df6346690", 3, 0, 0.0, 367.0, 245, 471, 385.0, 471.0, 471.0, 471.0, 0.031781007669816515, 0.026494518438281284, 0.02038039879867791], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 180.23529411764707, 143, 430, 145.0, 429.2, 430.0, 430.0, 0.11656689911477726, 0.0943691009435062, 0.041435889919705975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5d70199-d09a-473e-8a2b-3190d7ec2c79", 3, 0, 0.0, 408.0, 262, 513, 449.0, 513.0, 513.0, 513.0, 0.09590179656032223, 0.04339306550092705, 0.06149952448692539], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42117fc3-353c-42d8-818c-7eba4f6bed4e", 3, 0, 0.0, 323.6666666666667, 236, 462, 273.0, 462.0, 462.0, 462.0, 0.023840933293068647, 0.023910779777325683, 0.01528861933181811], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c0a04bd-8477-4cc8-8b76-acf4d01b76f0", 3, 0, 0.0, 317.3333333333333, 234, 458, 260.0, 458.0, 458.0, 458.0, 0.024427381466131437, 0.02449894606027049, 0.015664694494882465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6072086-3622-4538-bfab-8f83b61d154d", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d406615-af0f-43df-b582-723e8cecffe2", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 865.8500000000001, 284, 1705, 988.0, 1534.2000000000003, 1696.9499999999998, 1705.0, 0.10212157573591361, 55.064856176121424, 0.2179158741606883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de607e50-9435-4e76-bbda-2dcb67401605", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6d5457d-e34a-48ce-a52a-9d310a849d0f", 3, 0, 0.0, 433.0, 274, 700, 325.0, 700.0, 700.0, 700.0, 0.020329610755719398, 0.028012774195625065, 0.013036892314051826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 799.5555555555555, 141, 1559, 1130.0, 1559.0, 1559.0, 1559.0, 0.04718267032943989, 31.364987280338458, 0.07300105210801687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 438.5555555555556, 284, 1056, 291.5, 619.5000000000007, 1056.0, 1056.0, 0.10540986870615242, 0.16336470862955457, 0.2370692652639346], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 788.6521739130434, 171, 2015, 855.0, 1234.6000000000001, 1865.799999999998, 2015.0, 0.09432414698162729, 0.02971659182250656, 0.042556402251476375], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b3009eab-238c-4687-a83b-4afc5882066e", 3, 0, 0.0, 481.33333333333337, 249, 852, 343.0, 852.0, 852.0, 852.0, 0.023938907907021283, 0.02400904142628013, 0.015351448104437474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 159.47368421052633, 142, 424, 145.0, 148.0, 424.0, 424.0, 0.09365095795071987, 0.07270753083088116, 0.033289988959044954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 445.8823529411765, 284, 1275, 288.0, 931.7999999999997, 1275.0, 1275.0, 0.11392727418944094, 8.183627519803242, 0.25451044151844954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc0f18a2-50cf-4b5b-a667-05a75f327f54", 3, 0, 0.0, 593.0, 235, 1034, 510.0, 1034.0, 1034.0, 1034.0, 0.023196653496122294, 0.023264612441911713, 0.014875458133906547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 581.578947368421, 284, 1252, 567.0, 1124.0, 1252.0, 1252.0, 0.10757741327278801, 13.696541058830691, 0.23904678803569307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 143.0, 141, 145, 143.0, 145.0, 145.0, 145.0, 0.03756538725218583, 0.027917245799720138, 0.018856063523069844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 142.125, 140, 144, 142.5, 144.0, 144.0, 144.0, 0.03756591644401035, 0.010051817485994957, 0.02142431172197465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 194.625, 140, 567, 141.0, 567.0, 567.0, 567.0, 0.03756574004507889, 0.01012514087152517, 0.022084546393688956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 194.875, 141, 567, 141.5, 567.0, 567.0, 567.0, 0.03756626924684326, 0.010125283507938223, 0.022121543316256334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e9a02cad-21cc-4e93-a14b-136807b65fa7", 3, 0, 0.0, 317.6666666666667, 236, 480, 237.0, 480.0, 480.0, 480.0, 0.08826125330979699, 0.039935918652544866, 0.0565998271550456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 145.0, 144, 146, 145.0, 146.0, 146.0, 146.0, 0.04971167230065619, 0.014661059604295089, 0.030729969303042354], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1374.3157894736846, 1117, 2026, 1256.0, 1841.0, 1986.4, 2026.0, 0.2578975468061425, 308.5351256741532, 0.5092469137129103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 788.6521739130434, 171, 2015, 855.0, 1234.6000000000001, 1865.799999999998, 2015.0, 0.08975749865363752, 0.028277880435206796, 0.04049605896287162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 144.33333333333334, 141, 147, 145.0, 147.0, 147.0, 147.0, 0.026323409407986522, 0.007094981441996368, 0.015500992063492064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 143.0, 141, 146, 142.0, 146.0, 146.0, 146.0, 0.026323178436052225, 0.007094919187842201, 0.015475149822757264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 392.10526315789474, 139, 1270, 143.0, 1257.0, 1270.0, 1270.0, 0.09231187810945274, 17.50646183146766, 0.052599171500893965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c4185d5-5d33-4a8d-a0f7-570b32159b5c", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 311.63157894736844, 140, 835, 145.0, 704.0, 835.0, 835.0, 0.09255921353897717, 5.749270639486735, 0.05283049271948712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 146.3157894736842, 140, 209, 143.0, 149.0, 209.0, 209.0, 0.09281195808807367, 0.06897451182131256, 0.0465872523996776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 143.33333333333334, 142, 145, 143.0, 145.0, 145.0, 145.0, 0.026323178436052225, 0.007043506729959286, 0.015012437701811035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 187.21052631578945, 141, 425, 143.0, 425.0, 425.0, 425.0, 0.09268473531190853, 0.05410738197330679, 0.051220511619738916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 143.66666666666666, 143, 145, 143.0, 145.0, 145.0, 145.0, 0.02632225458884638, 0.019561753654406346, 0.013212537947917033], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 507.59999999999997, 141, 852, 510.0, 760.8000000000001, 852.0, 852.0, 0.07732277619695657, 0.014865505085261249, 0.052620766900181457], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 239.66666666666666, 145, 428, 146.0, 428.0, 428.0, 428.0, 0.024244775250933423, 0.019083289894777675, 0.00861825995248024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82088c21-297f-4f36-a78e-48df149159a5", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1110.3809523809523, 816, 1872, 964.0, 1760.8, 1862.3999999999999, 1872.0, 0.08813234960844056, 0.04561537626218115, 0.04053743814997608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 289.0, 285, 291, 291.0, 291.0, 291.0, 291.0, 0.0262894999737105, 0.04074359029128766, 0.05912570160103055], "isController": false}, {"data": ["addBook", 60, 9, 15.0, 1351.5666666666668, 715, 2731, 1125.0, 2066.4, 2469.999999999998, 2731.0, 0.28367855437408696, 91.58024690081179, 1.0308141766584558], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 258.05263157894734, 141, 576, 144.0, 571.2, 573.1, 576.0, 0.2590532286212915, 0.19251904978594023, 0.12522592594486257], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 856.8245614035089, 697, 1146, 839.0, 1115.6, 1132.3, 1146.0, 0.25893790033162223, 76.13634024496888, 0.1302275572956889], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 235.64912280701753, 140, 576, 145.0, 430.0, 437.0, 576.0, 0.2592688618096966, 0.4587843531241898, 0.12608973943479387], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1112.0350877192984, 972, 1424, 990.0, 1407.2, 1414.0, 1424.0, 0.2586019163763066, 232.69045892908184, 0.1298060400560758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 146.26315789473685, 143, 159, 146.0, 152.0, 159.0, 159.0, 0.10332095294546285, 0.07718801660476472, 0.0367273699923325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 9, 5.084745762711864, 216.94915254237287, 142, 1921, 146.0, 345.20000000000005, 409.3999999999999, 1452.2199999999993, 0.7396295166500215, 1.5789030213030015, 0.35564228022138744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 180.875, 143, 430, 145.0, 430.0, 430.0, 430.0, 0.037320743802423985, 0.028901708823556853, 0.0132663581485179], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0294cd7-2916-4c84-9785-1f4360ce6afa", 1, 0, 0.0, 1181.0, 1181, 1181, 1181.0, 1181.0, 1181.0, 1181.0, 0.8467400508044031, 0.2703945279424217, 0.5052325889077053], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5d70199-d09a-473e-8a2b-3190d7ec2c79", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 0.6406527039007093, 2.444869237588653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 162.05555555555557, 142, 458, 145.0, 178.10000000000045, 458.0, 458.0, 0.10746589450431356, 0.0872110921221529, 0.03820076718708021], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=854fe871-2159-48a4-9499-143df6346690", 1, 0, 0.0, 602.0, 602, 602, 602.0, 602.0, 602.0, 602.0, 1.6611295681063123, 0.3001064161129568, 1.1452709717607974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ff08dbb-3440-4aba-87a4-24bc6fe09089", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 339.625, 284, 710, 287.0, 710.0, 710.0, 710.0, 0.03754000356630034, 0.058179673495818984, 0.08442834786444305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 584.9473684210525, 281, 1480, 296.0, 1399.0, 1480.0, 1480.0, 0.09224689152251067, 23.346414728976207, 0.20249653012103763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 169.3846153846154, 142, 425, 145.0, 332.19999999999993, 425.0, 425.0, 0.06100994931481134, 0.050583444304955885, 0.021687130420499343], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 173.45, 142, 428, 145.0, 400.3000000000006, 428.0, 428.0, 0.09948615401451502, 0.07723778558744088, 0.035364218809847144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42117fc3-353c-42d8-818c-7eba4f6bed4e", 1, 0, 0.0, 670.0, 670, 670, 670.0, 670.0, 670.0, 670.0, 1.492537313432836, 0.2696478544776119, 1.029034514925373], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6d5457d-e34a-48ce-a52a-9d310a849d0f", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 201.2105263157895, 141, 422, 143.0, 422.0, 422.0, 422.0, 0.1076651952423317, 0.08001290388614689, 0.05404288120562352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 245.57894736842107, 141, 428, 143.0, 427.0, 428.0, 428.0, 0.10766641544503062, 0.0458312732686957, 0.06045168186274232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 356.6842105263158, 140, 981, 421.0, 974.0, 981.0, 981.0, 0.10766641544503062, 10.223694243671764, 0.06232212020671952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 296.2631578947368, 139, 1109, 142.0, 978.0, 1109.0, 1109.0, 0.10766580534022395, 3.3583142793190985, 0.062426909438891155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d406615-af0f-43df-b582-723e8cecffe2", 3, 0, 0.0, 415.0, 246, 615, 384.0, 615.0, 615.0, 615.0, 0.023921728105638352, 0.023851644917828863, 0.01534043110941001], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 26.08695652173913, 0.45112781954887216], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.15037593984962405], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.695652173913043, 0.15037593984962405], "isController": false}, {"data": ["401/Unauthorized", 13, 56.52173913043478, 0.9774436090225563], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1330, 23, "401/Unauthorized", 13, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
