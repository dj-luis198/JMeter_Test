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

    var data = {"OkPercent": 97.11246200607903, "KoPercent": 2.8875379939209727};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6947882736156352, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/33747217-79e7-4af8-9552-e1d959e4382c"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/c99295b2-a7e4-4af6-b9f8-2047ea57c5f4"], "isController": false}, {"data": [0.3, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.3, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3523338d-c846-41b3-ba79-6cdef738836b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5789473684210527, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86740850-9fb6-494c-95ea-657d3d074988"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e2874001-fcb2-48b5-a547-29253d2ae358"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ee63fe80-0b43-47f3-b32b-d68d4734f88c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/35df3d49-7239-43ee-93ef-9ecd50a08da3"], "isController": false}, {"data": [0.0625, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11899130-6259-405c-bccb-01c9073949fd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=107f9ae5-d158-4cd1-88db-a46455d3d52f"], "isController": false}, {"data": [0.125, 500, 1500, "register"], "isController": true}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/634726e3-e628-46e5-8532-98e85af83002"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/10f8d9f6-88d2-4f26-aa15-4d1ead58af64"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.22807017543859648, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/493f840f-237d-435b-a5d3-0f22659dbe1e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.25, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/55b1d569-c489-4ca9-9fa5-48afe22f0fb6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/575f4c2b-2d19-4d55-b4da-8cc093106b55"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3523338d-c846-41b3-ba79-6cdef738836b"], "isController": false}, {"data": [0.1875, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/aca1b195-c813-4f16-85ab-bab626258686"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.2982456140350877, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/86740850-9fb6-494c-95ea-657d3d074988"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8609467455621301, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=493f840f-237d-435b-a5d3-0f22659dbe1e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35df3d49-7239-43ee-93ef-9ecd50a08da3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10f8d9f6-88d2-4f26-aa15-4d1ead58af64"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c99295b2-a7e4-4af6-b9f8-2047ea57c5f4"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/11899130-6259-405c-bccb-01c9073949fd"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee63fe80-0b43-47f3-b32b-d68d4734f88c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33747217-79e7-4af8-9552-e1d959e4382c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=634726e3-e628-46e5-8532-98e85af83002"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/107f9ae5-d158-4cd1-88db-a46455d3d52f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1316, 38, 2.8875379939209727, 548.9354103343463, 135, 8229, 154.0, 1434.9999999999995, 1770.4499999999996, 4223.579999999969, 5.1035247672195485, 717.7484081176486, 3.738781504376389], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2388.5614035087715, 1672, 4486, 2269.0, 2988.2000000000003, 3103.6, 4486.0, 0.2630570926191718, 316.5460576697872, 1.2934496692749315], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/33747217-79e7-4af8-9552-e1d959e4382c", 3, 0, 0.0, 981.3333333333333, 255, 2244, 445.0, 2244.0, 2244.0, 2244.0, 0.04224459621206787, 0.02715920492149546, 0.027090447440681547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c99295b2-a7e4-4af6-b9f8-2047ea57c5f4", 3, 0, 0.0, 2608.3333333333335, 389, 3870, 3566.0, 3870.0, 3870.0, 3870.0, 0.017000634690361772, 0.02009417466168737, 0.010902099720056216], "isController": false}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 1154.9333333333334, 145, 5134, 528.0, 4654.0, 5134.0, 5134.0, 0.07600670885883527, 0.016047510210234556, 0.05069093265298884], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 1154.9333333333334, 145, 5134, 528.0, 4654.0, 5134.0, 5134.0, 0.07417370492711198, 0.015660502934806256, 0.04946845268706608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 206.2307692307692, 138, 431, 141.0, 429.8, 431.0, 431.0, 0.09348953276808124, 0.025015753885209237, 0.05331824915679633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 165.23076923076923, 138, 413, 145.0, 307.3999999999999, 413.0, 413.0, 0.09348549896087271, 0.0694750631926017, 0.046925338345594314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 206.15384615384613, 137, 434, 143.0, 428.4, 434.0, 434.0, 0.09348818812700012, 0.0251979882061055, 0.05505212640681744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 140.76923076923077, 137, 150, 141.0, 148.0, 150.0, 150.0, 0.09348953276808124, 0.025198350628896894, 0.05496161984998526], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 797.9999999999999, 143, 4698, 255.0, 4201.200000000001, 4698.0, 4698.0, 0.07660096006536615, 0.1275884741088755, 0.04950137562557451], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 169.61904761904765, 137, 424, 144.0, 362.6000000000002, 423.0, 424.0, 0.13639286340579473, 0.10136227446465801, 0.06846282401423681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 181.09523809523813, 138, 434, 141.0, 411.8, 431.79999999999995, 434.0, 0.13639817875955598, 0.04625258182266937, 0.0772440950955112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 974.125, 817, 1136, 964.0, 1136.0, 1136.0, 1136.0, 0.04998531681318613, 14.697342811799034, 0.028507250995020213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1484.4999999999998, 1127, 1712, 1528.5, 1712.0, 1712.0, 1712.0, 0.049797076911585296, 44.80749733896871, 0.028351265468217018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 313.0, 138, 431, 409.5, 431.0, 431.0, 431.0, 0.05028979494336112, 0.08898936370836948, 0.027846009504771244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 143.63636363636365, 138, 153, 143.0, 151.8, 153.0, 153.0, 0.06523350630096368, 0.04847919755374351, 0.03274416234247591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 165.09090909090912, 135, 408, 140.0, 355.6000000000002, 408.0, 408.0, 0.06523273259916858, 0.017454852277511906, 0.03720304281046333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 167.9090909090909, 138, 431, 140.0, 374.6000000000002, 431.0, 431.0, 0.06523350630096368, 0.017582468495181615, 0.038350166790214975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 166.36363636363635, 139, 414, 141.0, 360.4000000000002, 414.0, 414.0, 0.06523234575515335, 0.01758215569181868, 0.03841318797886472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3523338d-c846-41b3-ba79-6cdef738836b", 3, 0, 0.0, 747.6666666666667, 241, 1674, 328.0, 1674.0, 1674.0, 1674.0, 0.061139642944485206, 0.027664096254177876, 0.03920738821635282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 177.5, 138, 431, 141.0, 431.0, 431.0, 431.0, 0.05028789821729401, 0.03737215873375072, 0.028237833471625052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 230.0952380952381, 138, 1715, 141.0, 374.0000000000002, 1586.599999999998, 1715.0, 0.1364034945276217, 5.879590677876652, 0.07963213682569581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 865.4736842105261, 138, 1716, 1246.0, 1653.0, 1716.0, 1716.0, 0.09001923568931046, 42.64279116188775, 0.04884987101191097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 265.2380952380953, 137, 945, 143.0, 546.6000000000001, 908.3999999999994, 945.0, 0.136404380529249, 1.9448915138612832, 0.07976586147485612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 667.2105263157895, 138, 1251, 818.0, 1228.0, 1251.0, 1251.0, 0.09001710324961743, 13.94202809718057, 0.04893662114880775], "isController": false}, {"data": ["deleteBooks", 15, 4, 26.666666666666668, 759.6666666666667, 140, 2488, 495.0, 1979.2000000000003, 2488.0, 2488.0, 0.07415243763779994, 0.01565601271219956, 0.049714961119405196], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 338.72727272727275, 279, 578, 289.0, 573.4, 578.0, 578.0, 0.06517861904282235, 0.10101412931734285, 0.1465882418511913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86740850-9fb6-494c-95ea-657d3d074988", 1, 0, 0.0, 1368.0, 1368, 1368, 1368.0, 1368.0, 1368.0, 1368.0, 0.7309941520467835, 0.1320643731725146, 0.5039862024853801], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 595.2173913043479, 140, 1670, 486.0, 1210.0000000000002, 1595.599999999999, 1670.0, 0.09888942872006982, 0.060743604164964764, 0.0447127006810472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 156.99999999999997, 138, 424, 142.0, 147.0, 424.0, 424.0, 0.09013368248275601, 0.06698411364197003, 0.045242883589977134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 244.2631578947368, 136, 434, 143.0, 428.0, 434.0, 434.0, 0.09013453765726105, 0.0953695308497315, 0.04742069939657299], "isController": false}, {"data": ["login", 23, 0, 0.0, 4933.478260869565, 1641, 11313, 3571.0, 9921.4, 11056.599999999997, 11313.0, 0.09915459926453153, 41.39318038646583, 0.20679240664378926], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 290.2857142857142, 142, 2352, 153.0, 431.2, 2160.199999999997, 2352.0, 0.1312647672863197, 0.10626805867222562, 0.04666052274630896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2874001-fcb2-48b5-a547-29253d2ae358", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 0.9948160046728972, 1.8588152258566977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1040.4210526315792, 278, 1858, 1388.0, 1795.0, 1858.0, 1858.0, 0.08995488052571526, 56.706727226915916, 0.19019705593063058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee63fe80-0b43-47f3-b32b-d68d4734f88c", 3, 0, 0.0, 539.3333333333334, 241, 793, 584.0, 793.0, 793.0, 793.0, 0.03301601276619161, 0.027524091371815333, 0.021172377978319487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35df3d49-7239-43ee-93ef-9ecd50a08da3", 3, 0, 0.0, 1301.3333333333335, 312, 3256, 336.0, 3256.0, 3256.0, 3256.0, 0.06960072384752802, 0.03149251502215623, 0.044633276686077535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, 50.0, 902.8749999999999, 137, 1951, 708.5, 1881.0, 1951.0, 1951.0, 0.09950434398651715, 59.534206950378426, 0.14515099006822266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 417.3076923076923, 282, 842, 291.0, 737.5999999999999, 842.0, 842.0, 0.09338879190822036, 0.144734387459322, 0.21003358180139794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11899130-6259-405c-bccb-01c9073949fd", 1, 0, 0.0, 2488.0, 2488, 2488, 2488.0, 2488.0, 2488.0, 2488.0, 0.40192926045016075, 0.07261417303054662, 0.27711138464630225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=107f9ae5-d158-4cd1-88db-a46455d3d52f", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1287.625, 141, 2429, 1377.5, 1966.0, 2316.0, 2429.0, 0.10811151702981625, 0.03378484907181758, 0.04877687584743663], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 475.33333333333337, 278, 1855, 292.0, 970.2000000000002, 1769.9999999999986, 1855.0, 0.13626453488372092, 7.963972630294851, 0.30480191557114306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 230.73333333333338, 141, 1375, 146.0, 651.4000000000004, 1375.0, 1375.0, 0.08658408469077937, 0.06722104231364219, 0.03077793635492548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/634726e3-e628-46e5-8532-98e85af83002", 3, 0, 0.0, 396.6666666666667, 260, 631, 299.0, 631.0, 631.0, 631.0, 0.03800595426616837, 0.03168400028504466, 0.024372307911572813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 476.4705882352941, 281, 1499, 293.0, 974.1999999999996, 1499.0, 1499.0, 0.10332713370531102, 7.422197897292828, 0.23083001508880055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 182.57142857142856, 141, 406, 146.0, 406.0, 406.0, 406.0, 0.03214282434405679, 0.023887391919753143, 0.016134191125825384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 180.42857142857142, 135, 413, 143.0, 413.0, 413.0, 413.0, 0.03214356233325527, 0.008600914139953071, 0.018331875393184646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 222.57142857142856, 138, 427, 143.0, 427.0, 427.0, 427.0, 0.03210184539751256, 0.008652450517298307, 0.018872373954397035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 221.7142857142857, 137, 429, 145.0, 429.0, 429.0, 429.0, 0.032144743186462474, 0.008664012811976214, 0.018928984513121944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10f8d9f6-88d2-4f26-aa15-4d1ead58af64", 3, 0, 0.0, 453.3333333333333, 332, 695, 333.0, 695.0, 695.0, 695.0, 0.032803017877644745, 0.027346526297085998, 0.021035789459296923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 213.0, 140, 419, 146.5, 419.0, 419.0, 419.0, 0.5990714392691329, 0.1766792721282013, 0.3703244346263292], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1644.5087719298247, 1086, 2544, 1542.0, 2311.8, 2481.8, 2544.0, 0.24432585353308042, 292.29866223558156, 0.4824481209412975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1287.625, 141, 2429, 1377.5, 1966.0, 2316.0, 2429.0, 0.102739286218809, 0.03210602694337781, 0.046353076399501716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/493f840f-237d-435b-a5d3-0f22659dbe1e", 3, 0, 0.0, 367.0, 230, 497, 374.0, 497.0, 497.0, 497.0, 0.03540658562492624, 0.029517013602029976, 0.022705395078484597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 168.90000000000003, 139, 417, 141.0, 389.80000000000007, 417.0, 417.0, 0.053895281468107466, 0.014526462583200842, 0.03173716281764532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 140.99999999999997, 136, 151, 139.0, 150.4, 151.0, 151.0, 0.053895281468107466, 0.014526462583200842, 0.03168453070683662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 196.06666666666666, 137, 425, 141.0, 419.0, 425.0, 425.0, 0.08353009310821045, 0.022513970408072348, 0.04910655864369404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 187.20000000000002, 138, 559, 142.0, 470.20000000000005, 559.0, 559.0, 0.0835282325425994, 0.022513468927497494, 0.049187035374206475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 162.0, 139, 416, 144.0, 258.80000000000007, 416.0, 416.0, 0.08352776741414739, 0.06207483496305289, 0.04192702387780445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 141.79999999999998, 136, 148, 142.0, 147.9, 148.0, 148.0, 0.05389441007178736, 0.014420965194989975, 0.030736655744066223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 197.26666666666668, 138, 430, 144.0, 424.6, 430.0, 430.0, 0.08352776741414739, 0.022350203390113656, 0.04763692985338093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 146.4, 138, 159, 146.5, 158.4, 159.0, 159.0, 0.053895862414642434, 0.040053468064006725, 0.02705319656359981], "isController": false}, {"data": ["deleteAccount", 14, 4, 28.571428571428573, 1337.1428571428573, 137, 4296, 663.0, 3931.0, 4296.0, 4296.0, 0.08501181056939697, 0.017469642434252475, 0.05784076452942927], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 146.79999999999998, 141, 153, 147.0, 153.0, 153.0, 153.0, 0.054191730341949816, 0.042654818999620654, 0.019263466644989975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55b1d569-c489-4ca9-9fa5-48afe22f0fb6", 1, 0, 0.0, 3383.0, 3383, 3383, 3383.0, 3383.0, 3383.0, 3383.0, 0.2955956251847473, 0.09439430608926988, 0.17637590526160213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/575f4c2b-2d19-4d55-b4da-8cc093106b55", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.6867439516129031, 1.283182123655914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 3250.521739130435, 1081, 8229, 1603.0, 7884.200000000001, 8196.199999999999, 8229.0, 0.09789691880089044, 0.05066930367624212, 0.04502875855001894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 319.19999999999993, 285, 557, 291.5, 531.7, 557.0, 557.0, 0.0538540662512723, 0.08346328431715737, 0.12111905720378917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3523338d-c846-41b3-ba79-6cdef738836b", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 0.7820955086580086, 2.9846455627705626], "isController": false}, {"data": ["addBook", 56, 14, 25.0, 1661.428571428571, 741, 5539, 1262.5, 2561.0, 4194.049999999998, 5539.0, 0.25490927960816806, 66.32454602819479, 0.9289670470011744], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 267.4561403508772, 139, 590, 146.0, 573.2, 582.3, 590.0, 0.24563883334482522, 0.18254995329630078, 0.1187414282282114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aca1b195-c813-4f16-85ab-bab626258686", 1, 0, 0.0, 668.0, 668, 668, 668.0, 668.0, 668.0, 668.0, 1.4970059880239521, 0.47804781062874246, 0.8932330651197604], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 937.3157894736843, 677, 1442, 846.0, 1252.8, 1277.6, 1442.0, 0.2455658137921824, 72.20450280731269, 0.12350233799118548], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 167.42105263157896, 137, 428, 144.0, 203.20000000000076, 420.5, 428.0, 0.24614374794880212, 0.4355590539875287, 0.11970662742041352], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1375.4736842105258, 945, 2130, 1369.0, 1728.6000000000004, 1873.4999999999995, 2130.0, 0.24498426943112075, 220.43727627053354, 0.12297061961679302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86740850-9fb6-494c-95ea-657d3d074988", 3, 0, 0.0, 1015.0, 269, 2299, 477.0, 2299.0, 2299.0, 2299.0, 0.021803117845851958, 0.025770547167411607, 0.013981817108179802], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 165.05882352941177, 144, 420, 147.0, 223.19999999999982, 420.0, 420.0, 0.10849932666594334, 0.08105662587836587, 0.038568120025784546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 14, 8.284023668639053, 316.40236686390523, 138, 4950, 150.0, 509.0, 1033.0, 4495.700000000007, 0.6966860007337876, 1.5135215119838237, 0.3320989636795739], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 148.85714285714286, 144, 161, 147.0, 161.0, 161.0, 161.0, 0.03281993576669714, 0.025416219788076986, 0.011666461542068124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 151.92307692307693, 141, 170, 150.0, 167.2, 170.0, 170.0, 0.09744543055888702, 0.07907925077581555, 0.03463880539397937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 447.8571428571429, 289, 835, 297.0, 835.0, 835.0, 835.0, 0.03207963080927743, 0.04971716220148758, 0.07214784155641203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 426.26666666666665, 282, 847, 292.0, 760.0, 847.0, 847.0, 0.08346084295451384, 0.1293480056336069, 0.18770539191820837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=493f840f-237d-435b-a5d3-0f22659dbe1e", 1, 0, 0.0, 616.0, 616, 616, 616.0, 616.0, 616.0, 616.0, 1.6233766233766236, 0.2932858157467533, 1.1192420860389611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35df3d49-7239-43ee-93ef-9ecd50a08da3", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 0.6869355988593155, 2.6214947718631176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10f8d9f6-88d2-4f26-aa15-4d1ead58af64", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 238.18181818181816, 141, 838, 147.0, 756.2000000000003, 838.0, 838.0, 0.06313203778739426, 0.05234287117333762, 0.0224414665572378], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c99295b2-a7e4-4af6-b9f8-2047ea57c5f4", 1, 0, 0.0, 1365.0, 1365, 1365, 1365.0, 1365.0, 1365.0, 1365.0, 0.7326007326007326, 0.13235462454212454, 0.5050938644688645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11899130-6259-405c-bccb-01c9073949fd", 3, 0, 0.0, 3491.3333333333335, 1480, 4698, 4296.0, 4698.0, 4698.0, 4698.0, 0.017981083899737474, 0.024788375753707098, 0.011530838308099879], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee63fe80-0b43-47f3-b32b-d68d4734f88c", 1, 0, 0.0, 1640.0, 1640, 1640, 1640.0, 1640.0, 1640.0, 1640.0, 0.6097560975609756, 0.1101610137195122, 0.4203982469512195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 146.78947368421052, 140, 170, 145.0, 155.0, 170.0, 170.0, 0.09102188836883986, 0.07066640747385515, 0.03235543688111104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33747217-79e7-4af8-9552-e1d959e4382c", 1, 0, 0.0, 1032.0, 1032, 1032, 1032.0, 1032.0, 1032.0, 1032.0, 0.9689922480620154, 0.17506207606589147, 0.6680747335271318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=634726e3-e628-46e5-8532-98e85af83002", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/107f9ae5-d158-4cd1-88db-a46455d3d52f", 2, 0, 0.0, 360.5, 244, 477, 360.5, 477.0, 477.0, 477.0, 0.01794027681847131, 0.03012529881773576, 0.011151353706012685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 159.23529411764704, 137, 413, 145.0, 200.99999999999983, 413.0, 413.0, 0.10341513267553197, 0.07685441012312484, 0.05190954901877289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 190.05882352941177, 137, 430, 143.0, 420.4, 430.0, 430.0, 0.10342016571560671, 0.03681016468140506, 0.058470891025563035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 279.2941176470588, 138, 1361, 140.0, 618.5999999999993, 1361.0, 1361.0, 0.10341890740966055, 5.5001475715567585, 0.06027620832826378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 284.6470588235293, 137, 1130, 145.0, 576.3999999999995, 1130.0, 1130.0, 0.10341890740966055, 1.8149756851502616, 0.06037720335503103], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 21.05263157894737, 0.60790273556231], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.526315789473685, 0.303951367781155], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.526315789473685, 0.303951367781155], "isController": false}, {"data": ["401/Unauthorized", 22, 57.89473684210526, 1.6717325227963526], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1316, 38, "401/Unauthorized", 22, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
