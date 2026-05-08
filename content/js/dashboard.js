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

    var data = {"OkPercent": 97.59689922480621, "KoPercent": 2.4031007751937983};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7634194831013916, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.08333333333333333, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bcd6d670-4b3c-4320-afc0-1dfc8ddaca8c"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b642da1f-5343-4876-93c6-e8148194de78"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d8ea74b-6151-4902-a530-7c20000e044c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dac78e5b-3f77-4896-87e6-5766dc536745"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/965a20f2-4fbc-4f40-8fa5-e85a26763078"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b4b34b8c-4ef8-4990-935b-641cccf7ba36"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4bec189d-451b-4159-9dbc-dcbcb99f17c3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a25adb7b-27fa-46ec-9957-62705ec83535"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9f746f6a-31d8-4cb1-845f-c5725f91e399"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4b8c3e6-1148-4fa4-9991-b5bc348ae805"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4bec189d-451b-4159-9dbc-dcbcb99f17c3"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2470c0eb-1dee-4a29-a0b5-284a65daaa75"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0ae4b09-28d9-4303-ab43-89ba7771e10a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b563ff69-55d2-4e52-b4e1-045156349c02"], "isController": false}, {"data": [0.22, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4e2924aa-236c-42e8-baaa-f5c859952278"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2d8ea74b-6151-4902-a530-7c20000e044c"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b642da1f-5343-4876-93c6-e8148194de78"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bcd6d670-4b3c-4320-afc0-1dfc8ddaca8c"], "isController": false}, {"data": [0.24561403508771928, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=965a20f2-4fbc-4f40-8fa5-e85a26763078"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f746f6a-31d8-4cb1-845f-c5725f91e399"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a25adb7b-27fa-46ec-9957-62705ec83535"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ed5a2ae-065e-4167-b4b2-6d5c60bb12bb"], "isController": false}, {"data": [0.9077380952380952, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2470c0eb-1dee-4a29-a0b5-284a65daaa75"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0ed5a2ae-065e-4167-b4b2-6d5c60bb12bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dac78e5b-3f77-4896-87e6-5766dc536745"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f4b8c3e6-1148-4fa4-9991-b5bc348ae805"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0ae4b09-28d9-4303-ab43-89ba7771e10a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e2924aa-236c-42e8-baaa-f5c859952278"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1290, 31, 2.4031007751937983, 372.2472868217058, 100, 2451, 118.0, 1099.0, 1315.45, 1703.989999999999, 5.021194110022536, 720.3622626427538, 3.6676847417490883], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1732.2592592592594, 1230, 2217, 1726.5, 2115.5, 2153.75, 2217.0, 0.2488444860209306, 299.4445029273789, 1.2235663936673686], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bcd6d670-4b3c-4320-afc0-1dfc8ddaca8c", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.32435199730700176, 1.2377973518850987], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 487.1333333333334, 111, 792, 527.0, 750.0, 792.0, 792.0, 0.09001602285206767, 0.01763399822668435, 0.060608444553130456], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 487.1333333333334, 111, 792, 527.0, 750.0, 792.0, 792.0, 0.08988710180013902, 0.017608742794050673, 0.060521641068817564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 138.05882352941177, 100, 513, 102.0, 346.59999999999985, 513.0, 513.0, 0.07737789086076076, 0.03437733271582742, 0.04336504499296771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 127.82352941176474, 102, 309, 104.0, 304.2, 309.0, 309.0, 0.07737612991907367, 0.05750315905118659, 0.03883919021328503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 180.35294117647058, 101, 814, 103.0, 569.9999999999998, 814.0, 814.0, 0.07737753866601124, 2.6950568269747204, 0.04478278389591356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 275.7058823529411, 101, 1106, 104.0, 1031.6, 1106.0, 1106.0, 0.0773771864744678, 8.209475903264861, 0.04470701640396353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b642da1f-5343-4876-93c6-e8148194de78", 3, 0, 0.0, 302.3333333333333, 192, 408, 307.0, 408.0, 408.0, 408.0, 0.06120575334081404, 0.02769400948689177, 0.03924978322962359], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 219.46666666666667, 102, 339, 213.0, 315.0, 339.0, 339.0, 0.09080013075218828, 0.16531417034407195, 0.058689042845555026], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d8ea74b-6151-4902-a530-7c20000e044c", 1, 0, 0.0, 666.0, 666, 666, 666.0, 666.0, 666.0, 666.0, 1.5015015015015014, 0.2712673611111111, 1.0352149024024024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 129.375, 102, 306, 104.0, 305.3, 306.0, 306.0, 0.09083992869065598, 0.06750897044295821, 0.04559738608105193], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dac78e5b-3f77-4896-87e6-5766dc536745", 3, 0, 0.0, 338.6666666666667, 231, 449, 336.0, 449.0, 449.0, 449.0, 0.03903962521959789, 0.02509871738564643, 0.02503517632897391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 145.1875, 100, 309, 103.0, 306.9, 309.0, 309.0, 0.09083683433632338, 0.032832991512433296, 0.051328577410014765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 680.1250000000001, 598, 817, 606.0, 817.0, 817.0, 817.0, 0.08141416402918698, 23.938467429246003, 0.0464315154228957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/965a20f2-4fbc-4f40-8fa5-e85a26763078", 3, 0, 0.0, 278.0, 197, 410, 227.0, 410.0, 410.0, 410.0, 0.026839633191679715, 0.026918264929545962, 0.01721161373294565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1232.875, 943, 1418, 1243.0, 1418.0, 1418.0, 1418.0, 0.08101758081503686, 72.89976163108645, 0.04612622032731103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 205.125, 101, 312, 204.5, 312.0, 312.0, 312.0, 0.0820100667356918, 0.14511937590339213, 0.04540987093665747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4b34b8c-4ef8-4990-935b-641cccf7ba36", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 1.174029181985294, 2.193675321691176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4bec189d-451b-4159-9dbc-dcbcb99f17c3", 3, 0, 0.0, 336.0, 213, 526, 269.0, 526.0, 526.0, 526.0, 0.024380531333046185, 0.028816962653089417, 0.015634650626985998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 130.93333333333334, 102, 308, 103.0, 305.0, 308.0, 308.0, 0.07414730598121601, 0.05510361313643104, 0.03721847194760257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 133.73333333333332, 100, 336, 103.0, 316.8, 336.0, 336.0, 0.07414803903152775, 0.01984039325648301, 0.04228755351016817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 166.0, 101, 418, 104.0, 351.40000000000003, 418.0, 418.0, 0.07414657294539846, 0.01998481848918943, 0.043590075110478396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 144.46666666666664, 101, 308, 104.0, 306.2, 308.0, 308.0, 0.07414767250456007, 0.019985114854744707, 0.04366313136743138], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 130.12499999999997, 101, 306, 103.0, 306.0, 306.0, 306.0, 0.08199745807879956, 0.06093756406051413, 0.04604349452666968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 582.5714285714287, 100, 1261, 114.0, 1216.6, 1256.6, 1261.0, 0.10368629464682473, 44.44183407168673, 0.056713085827564756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 193.8125, 100, 1151, 104.0, 558.8000000000006, 1151.0, 1151.0, 0.09083992869065598, 5.1315744067726845, 0.05291603267966435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 433.9523809523811, 101, 904, 118.0, 815.4, 895.2999999999998, 904.0, 0.10368578270422396, 14.53228762929864, 0.056814061458513344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 176.5, 101, 600, 104.5, 400.5000000000002, 600.0, 600.0, 0.0908388972157878, 1.692306921214289, 0.05300414168596993], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 477.5333333333333, 105, 962, 474.0, 890.6, 962.0, 962.0, 0.08983864978498617, 0.017599251119988498, 0.06108560275744762], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a25adb7b-27fa-46ec-9957-62705ec83535", 3, 0, 0.0, 322.3333333333333, 212, 518, 237.0, 518.0, 518.0, 518.0, 0.029916831209238316, 0.024940431226191186, 0.019184947097070144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 327.3333333333333, 205, 727, 220.0, 655.6, 727.0, 727.0, 0.07410774277696534, 0.11485252713578516, 0.1666700504056164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f746f6a-31d8-4cb1-845f-c5725f91e399", 3, 0, 0.0, 417.6666666666667, 283, 631, 339.0, 631.0, 631.0, 631.0, 0.037774336116042764, 0.02428525840793765, 0.02422377674108211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4b8c3e6-1148-4fa4-9991-b5bc348ae805", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 631.086956521739, 146, 1479, 536.0, 1305.6, 1445.1999999999996, 1479.0, 0.0995433987578715, 0.061145310369825366, 0.04500839221181104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 104.0952380952381, 102, 111, 104.0, 106.6, 110.6, 111.0, 0.10368373498437337, 0.0770540257061603, 0.052044374787078046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 161.57142857142858, 100, 308, 103.0, 307.0, 307.9, 308.0, 0.10368578270422396, 0.10190175463500135, 0.054986638111931274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4bec189d-451b-4159-9dbc-dcbcb99f17c3", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["login", 23, 0, 0.0, 2727.304347826087, 1685, 4324, 2405.0, 4043.0000000000005, 4282.999999999999, 4324.0, 0.09808813432103819, 40.94797284078163, 0.20456823495733165], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 107.31250000000001, 103, 119, 106.0, 116.2, 119.0, 119.0, 0.08799040904541405, 0.07123442294789868, 0.03127784071536203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2470c0eb-1dee-4a29-a0b5-284a65daaa75", 3, 0, 0.0, 307.6666666666667, 196, 419, 308.0, 419.0, 419.0, 419.0, 0.02101164044880864, 0.02483504767891412, 0.01347426161593523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 697.5714285714286, 206, 1364, 405.0, 1321.4, 1359.8, 1364.0, 0.10363205684958547, 59.12220891266532, 0.22044462316176472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 416.5882352941176, 206, 1415, 216.0, 1176.5999999999997, 1415.0, 1415.0, 0.07733987234371659, 10.991098557440779, 0.171611170095401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 943.1666666666665, 102, 1717, 1213.0, 1658.2000000000003, 1717.0, 1717.0, 0.1213800916419692, 96.819351653298, 0.20927397636122716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0ae4b09-28d9-4303-ab43-89ba7771e10a", 3, 0, 0.0, 285.3333333333333, 189, 455, 212.0, 455.0, 455.0, 455.0, 0.09174873080922381, 0.04252935959385895, 0.05883626292127959], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b563ff69-55d2-4e52-b4e1-045156349c02", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 1.4784071180555556, 2.7624059606481484], "isController": false}, {"data": ["register", 25, 9, 36.0, 1043.4800000000002, 151, 1727, 1040.0, 1685.6000000000001, 1719.8, 1727.0, 0.10011653564749369, 0.03119255813767225, 0.04516976510658406], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4e2924aa-236c-42e8-baaa-f5c859952278", 3, 0, 0.0, 416.33333333333337, 201, 846, 202.0, 846.0, 846.0, 846.0, 0.0470876300795781, 0.029843624923482602, 0.03019616902889611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 380.125, 205, 1457, 243.0, 871.8000000000006, 1457.0, 1457.0, 0.09078323233698736, 6.919921963655501, 0.20272188344000364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 10, 0, 0.0, 104.7, 102, 107, 105.0, 106.9, 107.0, 107.0, 0.0815580856686132, 0.06331902158842528, 0.028991350765014846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 378.1875, 204, 1513, 308.5, 747.9000000000008, 1513.0, 1513.0, 0.10343601512751721, 7.884376161634935, 0.23097595516695218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 103.55555555555556, 102, 107, 103.0, 107.0, 107.0, 107.0, 0.04688647741895151, 0.03484434503498252, 0.023534813860684647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 147.77777777777777, 101, 309, 103.0, 309.0, 309.0, 309.0, 0.04688647741895151, 0.012545795715617885, 0.026739944152995784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 125.1111111111111, 101, 305, 103.0, 305.0, 305.0, 305.0, 0.04688647741895151, 0.012637370866826775, 0.027564120513875794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 169.88888888888889, 102, 305, 103.0, 305.0, 305.0, 305.0, 0.046837188727849914, 0.012624086024303297, 0.02758088359657568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 106.5, 105, 108, 106.5, 108.0, 108.0, 108.0, 0.0946163307786924, 0.02790442567887217, 0.05848841541300028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d8ea74b-6151-4902-a530-7c20000e044c", 3, 0, 0.0, 339.3333333333333, 262, 489, 267.0, 489.0, 489.0, 489.0, 0.030193236714975844, 0.030478264014694043, 0.01936219932568438], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1204.9629629629633, 801, 1791, 1172.0, 1690.5, 1724.5, 1791.0, 0.24422564640649097, 292.1787796745467, 0.48225025100969215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 1043.4800000000002, 151, 1727, 1040.0, 1685.6000000000001, 1719.8, 1727.0, 0.09949535953643122, 0.030999022955569354, 0.04488950791585081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 105.0, 100, 117, 103.0, 117.0, 117.0, 117.0, 0.033416715996104566, 0.009006849233325058, 0.01967800756411236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 133.42857142857144, 102, 299, 104.0, 299.0, 299.0, 299.0, 0.03338531904441678, 0.008998386773690461, 0.019626916078846583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 10, 0, 0.0, 313.4, 102, 1398, 203.0, 1289.2000000000003, 1398.0, 1398.0, 0.07952981970589873, 7.175399351533732, 0.04607137602494055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 10, 0, 0.0, 173.60000000000002, 101, 814, 102.0, 743.1000000000003, 814.0, 814.0, 0.07966223213574444, 2.3616584432008283, 0.046225877280331396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 104.28571428571429, 101, 116, 103.0, 116.0, 116.0, 116.0, 0.033416715996104566, 0.008941582209895167, 0.019057970841528386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 10, 0, 0.0, 124.70000000000003, 103, 312, 103.5, 291.4000000000001, 312.0, 312.0, 0.07952855472757493, 0.05910276381609817, 0.039919606572239766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 103.85714285714285, 102, 105, 104.0, 105.0, 105.0, 105.0, 0.033416396948605584, 0.024833865310438328, 0.016773464874593035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 10, 0, 0.0, 203.7, 102, 307, 204.0, 306.7, 307.0, 307.0, 0.07953488002163349, 0.033227560227787896, 0.04469176754340616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 104.85714285714286, 103, 108, 105.0, 108.0, 108.0, 108.0, 0.03421727972626176, 0.02693274165953807, 0.012163173652694611], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 465.40000000000003, 103, 846, 489.0, 717.0000000000001, 846.0, 846.0, 0.09195684158901422, 0.01767894226642962, 0.06257974382356547], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b642da1f-5343-4876-93c6-e8148194de78", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 0.681751179245283, 2.6017099056603774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1455.304347826087, 824, 2451, 1373.0, 1833.8000000000002, 2332.5999999999985, 2451.0, 0.10136892117023807, 0.05246633615256463, 0.046625744014826304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 238.71428571428572, 205, 404, 210.0, 404.0, 404.0, 404.0, 0.03336860871969415, 0.051714826209135374, 0.07504678308735901], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bcd6d670-4b3c-4320-afc0-1dfc8ddaca8c", 3, 0, 0.0, 334.0, 238, 522, 242.0, 522.0, 522.0, 522.0, 0.033506075768406, 0.027932636732710864, 0.02148664364054682], "isController": false}, {"data": ["addBook", 57, 14, 24.56140350877193, 1072.385964912281, 520, 2418, 840.0, 1893.8, 2113.599999999999, 2418.0, 0.25802246153428304, 82.27575864120618, 0.9362597522305363], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 180.87037037037035, 102, 422, 105.0, 413.5, 417.75, 422.0, 0.2457841196149382, 0.18265792483102342, 0.11881165938417422], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=965a20f2-4fbc-4f40-8fa5-e85a26763078", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 636.0555555555555, 502, 1006, 605.0, 821.0, 914.5, 1006.0, 0.2456052577718145, 72.21610064698793, 0.12352217553953562], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 168.51851851851853, 101, 310, 106.0, 307.0, 308.25, 310.0, 0.24594755851502328, 0.4352118906535373, 0.11961121498093906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f746f6a-31d8-4cb1-845f-c5725f91e399", 1, 0, 0.0, 843.0, 843, 843, 843.0, 843.0, 843.0, 843.0, 1.1862396204033216, 0.21431086892052195, 0.8178566132858838], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1022.5185185185185, 697, 1402, 1024.5, 1312.0, 1395.25, 1402.0, 0.24472703871219195, 220.20581961747806, 0.12284150185358073], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 138.6875, 104, 405, 106.5, 337.1000000000001, 405.0, 405.0, 0.10523546435148645, 0.0786182912391476, 0.03740791896869245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a25adb7b-27fa-46ec-9957-62705ec83535", 1, 0, 0.0, 962.0, 962, 962, 962.0, 962.0, 962.0, 962.0, 1.0395010395010396, 0.18780048076923078, 0.7166872401247402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ed5a2ae-065e-4167-b4b2-6d5c60bb12bb", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 14, 8.333333333333334, 169.02976190476204, 101, 1995, 108.5, 339.3999999999999, 371.54999999999995, 988.9800000000033, 0.720377683728469, 1.5930659694975793, 0.3450009125319989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 107.66666666666667, 104, 120, 105.0, 120.0, 120.0, 120.0, 0.04600733050132654, 0.03562872371831245, 0.016354168264143418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2470c0eb-1dee-4a29-a0b5-284a65daaa75", 1, 0, 0.0, 668.0, 668, 668, 668.0, 668.0, 668.0, 668.0, 1.4970059880239521, 0.27045518338323354, 1.0321154565868262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 132.88235294117646, 104, 312, 108.0, 311.2, 312.0, 312.0, 0.07725657362551466, 0.0626955201980495, 0.027462297655944667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ed5a2ae-065e-4167-b4b2-6d5c60bb12bb", 3, 0, 0.0, 327.3333333333333, 207, 516, 259.0, 516.0, 516.0, 516.0, 0.029785544082605243, 0.024830982550635424, 0.019100755808181095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dac78e5b-3f77-4896-87e6-5766dc536745", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 298.0, 207, 413, 209.0, 413.0, 413.0, 413.0, 0.04681185276111911, 0.07254922883974223, 0.10528095401255598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 10, 0, 0.0, 439.1, 205, 1502, 308.5, 1413.8000000000002, 1502.0, 1502.0, 0.07933233903468409, 9.601560454713134, 0.17639049757243042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 121.46666666666665, 104, 308, 107.0, 194.60000000000008, 308.0, 308.0, 0.07494491548711697, 0.06213694653179913, 0.026640575427061112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4b8c3e6-1148-4fa4-9991-b5bc348ae805", 3, 0, 0.0, 397.6666666666667, 299, 586, 308.0, 586.0, 586.0, 586.0, 0.01836052731434447, 0.025311469132893494, 0.011774166279055535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 138.95238095238096, 103, 321, 107.0, 306.0, 319.5, 321.0, 0.10591884598895418, 0.08223191656369001, 0.03765083978513606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0ae4b09-28d9-4303-ab43-89ba7771e10a", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 0.9217554209183673, 3.5176179846938775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e2924aa-236c-42e8-baaa-f5c859952278", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 104.375, 102, 112, 103.5, 111.3, 112.0, 112.0, 0.1043875387375632, 0.07757706736258359, 0.052397651280378404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 165.375, 100, 307, 103.0, 304.9, 307.0, 307.0, 0.1043895819197244, 0.03773163477347461, 0.05898674007646537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 222.25, 101, 1410, 103.0, 638.6000000000008, 1410.0, 1410.0, 0.10350560547544653, 5.847062229915061, 0.06029403678330455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 209.0, 100, 799, 104.0, 453.9000000000003, 799.0, 799.0, 0.10391634734039099, 1.9359366881535365, 0.06063478274988634], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 29.032258064516128, 0.6976744186046512], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.451612903225806, 0.15503875968992248], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.451612903225806, 0.15503875968992248], "isController": false}, {"data": ["401/Unauthorized", 18, 58.064516129032256, 1.3953488372093024], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1290, 31, "401/Unauthorized", 18, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
