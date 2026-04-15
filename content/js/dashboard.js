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

    var data = {"OkPercent": 97.8537360890302, "KoPercent": 2.146263910969793};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7255766621438263, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0fa0d1bc-d157-4e7b-a681-7e0ddf2e8533"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4d7e1b48-8ec8-4f29-825c-90a1cd1ab497"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b689ed70-be36-4327-8d1a-3e9cd1500327"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/63b6f1b2-d7a0-4c09-a274-002eaee211de"], "isController": false}, {"data": [0.78125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6ac1d048-cd2e-400f-8469-71ccb11709ea"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5d5d7f1-90c0-4e3a-95b0-9cb85e3fdad3"], "isController": false}, {"data": [0.8260869565217391, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ac1d048-cd2e-400f-8469-71ccb11709ea"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cb3df347-35be-4e64-9e82-8d28164a1e7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0966b73-9060-49bf-a66b-806211ed5a41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=263a3091-3197-4eb1-ae7a-429a464b45ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63b6f1b2-d7a0-4c09-a274-002eaee211de"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8dfec433-4f08-421b-86c8-680b3e454a3d"], "isController": false}, {"data": [0.40625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2f1ab537-d55a-4f30-831e-88bed8f7804f"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47523073-2822-4efb-850e-afbe67e4e509"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b48a214-3ecb-4cdf-b359-39eb6fef93ad"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac2d6b03-07de-460d-bd25-9d41feaf1f12"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.17592592592592593, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0fa0d1bc-d157-4e7b-a681-7e0ddf2e8533"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db14994d-82e7-4f1b-b70b-23df1f1633dc"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88435120-7e8b-418f-bb2c-0d92a80153c7"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9197530864197531, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/498b2a67-4600-4eb8-a2e3-963fe78d7911"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/263a3091-3197-4eb1-ae7a-429a464b45ea"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f0966b73-9060-49bf-a66b-806211ed5a41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb3df347-35be-4e64-9e82-8d28164a1e7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f1ab537-d55a-4f30-831e-88bed8f7804f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8dfec433-4f08-421b-86c8-680b3e454a3d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b689ed70-be36-4327-8d1a-3e9cd1500327"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac2d6b03-07de-460d-bd25-9d41feaf1f12"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b5d5d7f1-90c0-4e3a-95b0-9cb85e3fdad3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/47523073-2822-4efb-850e-afbe67e4e509"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5b48a214-3ecb-4cdf-b359-39eb6fef93ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1258, 27, 2.146263910969793, 489.8600953895075, 136, 2814, 162.0, 1412.4000000000005, 1647.0, 2160.940000000003, 4.934029902260711, 707.0058021671687, 3.5970113366494876], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2454.870370370371, 1878, 3418, 2392.5, 2919.0, 3221.25, 3418.0, 0.2443671118070043, 294.0558115462895, 1.201551179636979], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0fa0d1bc-d157-4e7b-a681-7e0ddf2e8533", 3, 0, 0.0, 587.6666666666667, 241, 1155, 367.0, 1155.0, 1155.0, 1155.0, 0.01676071288898821, 0.023105995795854515, 0.01074824361696184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d7e1b48-8ec8-4f29-825c-90a1cd1ab497", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 584.875, 148, 1869, 484.0, 1276.8000000000006, 1869.0, 1869.0, 0.08547099862178015, 0.017272612087201787, 0.05732670921964978], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 584.875, 148, 1869, 484.0, 1276.8000000000006, 1869.0, 1869.0, 0.08532559714585877, 0.01724322828063589, 0.05722918622044935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 174.00000000000003, 136, 438, 145.5, 402.8000000000006, 437.6, 438.0, 0.09564161175244125, 0.03995652490985778, 0.05374236660386201], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 202.7, 138, 433, 148.5, 428.8, 432.8, 433.0, 0.09563658099222952, 0.07107367005379557, 0.04800508069336521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 339.6000000000001, 139, 1176, 151.0, 938.6000000000012, 1166.85, 1176.0, 0.09564206912052335, 2.83539506749939, 0.05549855221817869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 388.9000000000001, 138, 1796, 151.0, 1521.1000000000026, 1788.25, 1796.0, 0.09564023967444063, 8.628925807681824, 0.05540409196765447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b689ed70-be36-4327-8d1a-3e9cd1500327", 3, 0, 0.0, 716.0, 230, 1667, 251.0, 1667.0, 1667.0, 1667.0, 0.04099480732440558, 0.026836118987428256, 0.02628898776988248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63b6f1b2-d7a0-4c09-a274-002eaee211de", 3, 0, 0.0, 370.0, 233, 639, 238.0, 639.0, 639.0, 639.0, 0.08461668641056017, 0.03927844883511028, 0.05426265372031364], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 252.8125, 142, 552, 239.5, 406.40000000000015, 552.0, 552.0, 0.08472826058176541, 0.1403104959780554, 0.054759982379169556], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 171.46153846153845, 140, 436, 150.0, 325.19999999999993, 436.0, 436.0, 0.07124849282034419, 0.05294931937136906, 0.035763403622711826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 217.07692307692307, 144, 458, 151.0, 455.6, 458.0, 458.0, 0.07113153862989713, 0.027251415791201578, 0.0401076719468155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 907.1666666666666, 689, 1282, 811.5, 1282.0, 1282.0, 1282.0, 0.044903457566232596, 13.203107459586887, 0.025609003143242028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1546.0, 1133, 1841, 1620.5, 1841.0, 1841.0, 1841.0, 0.044648172401476366, 40.17450400996399, 0.025419809091856177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 238.83333333333334, 139, 428, 150.5, 428.0, 428.0, 428.0, 0.045149784409779445, 0.07989395444386753, 0.024999929453461862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 153.46153846153845, 143, 228, 148.0, 198.79999999999998, 228.0, 228.0, 0.06631942495957065, 0.04928621327561843, 0.03328924260665949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 234.84615384615387, 139, 452, 145.0, 447.6, 452.0, 452.0, 0.06632010162280187, 0.017745808442038782, 0.037823182956754194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 167.0, 141, 422, 146.0, 313.5999999999999, 422.0, 422.0, 0.06631908663313302, 0.017875066319086634, 0.038988369290181714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 212.76923076923077, 142, 450, 148.0, 445.2, 450.0, 450.0, 0.06631840999061339, 0.017874883942782516, 0.03905273557064441], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 194.0, 140, 420, 151.0, 420.0, 420.0, 420.0, 0.04514876518127229, 0.03355293974897287, 0.025352089823468326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1088.1875, 147, 2147, 1414.0, 1969.9, 2147.0, 2147.0, 0.07486956318289231, 42.11242023174469, 0.039993799864298914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 264.00000000000006, 137, 1346, 147.0, 993.1999999999997, 1346.0, 1346.0, 0.07112920346235077, 4.940941601898055, 0.041345986808268495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 723.0, 143, 1200, 869.0, 1197.9, 1200.0, 1200.0, 0.07486816184624888, 13.766145640801277, 0.04006616473803162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 270.7692307692308, 139, 1166, 148.0, 886.3999999999997, 1166.0, 1166.0, 0.07125278845047109, 1.6293187582557316, 0.041487407097325825], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 446.40000000000003, 144, 759, 490.0, 759.0, 759.0, 759.0, 0.08571085727999452, 0.016790623017936424, 0.05827891884324627], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6ac1d048-cd2e-400f-8469-71ccb11709ea", 3, 0, 0.0, 736.3333333333334, 218, 1566, 425.0, 1566.0, 1566.0, 1566.0, 0.07333708167306328, 0.03318311963722591, 0.04702931344268708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 392.92307692307696, 285, 658, 299.0, 636.8, 658.0, 658.0, 0.06626905235255136, 0.102704087972167, 0.14904065192180252], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5d5d7f1-90c0-4e3a-95b0-9cb85e3fdad3", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 477.43478260869557, 143, 1195, 363.0, 1067.8000000000002, 1185.3999999999999, 1195.0, 0.0941157214174646, 0.057811317159751206, 0.04255427638309191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 146.3125, 139, 154, 146.5, 152.6, 154.0, 154.0, 0.07487061421980142, 0.05564114982545788, 0.03758153877829875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 289.43749999999994, 136, 451, 287.0, 445.4, 451.0, 451.0, 0.07487376750759267, 0.09032013800171274, 0.038771303926661144], "isController": false}, {"data": ["login", 23, 0, 0.0, 2653.608695652174, 1303, 3895, 2595.0, 3673.6, 3857.9999999999995, 3895.0, 0.09839908959451019, 30.844036908215042, 0.19102842958261673], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ac1d048-cd2e-400f-8469-71ccb11709ea", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 0.7029730058365758, 2.6826969844357977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb3df347-35be-4e64-9e82-8d28164a1e7a", 3, 0, 0.0, 820.3333333333334, 490, 1419, 552.0, 1419.0, 1419.0, 1419.0, 0.04735446394746812, 0.030444357518310393, 0.03036728319547923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 176.3076923076923, 146, 454, 154.0, 335.5999999999999, 454.0, 454.0, 0.07040537247149936, 0.05699809939343063, 0.025026909745728288], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0966b73-9060-49bf-a66b-806211ed5a41", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=263a3091-3197-4eb1-ae7a-429a464b45ea", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 0.7687832446808511, 2.9338430851063833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63b6f1b2-d7a0-4c09-a274-002eaee211de", 1, 0, 0.0, 329.0, 329, 329, 329.0, 329.0, 329.0, 329.0, 3.0395136778115504, 0.5491308890577508, 2.0956022036474162], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8dfec433-4f08-421b-86c8-680b3e454a3d", 3, 0, 0.0, 847.0, 263, 1204, 1074.0, 1204.0, 1204.0, 1204.0, 0.03397662408263115, 0.028324913501177853, 0.02178839500090604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1236.125, 291, 2296, 1560.0, 2122.4, 2296.0, 2296.0, 0.0748173987860877, 55.98574443604047, 0.15630187534486142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 653.6500000000001, 289, 2226, 577.5, 1695.100000000002, 2203.9999999999995, 2226.0, 0.09556985917781251, 11.566780857715594, 0.2124936087656675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, 45.45454545454545, 1015.0909090909092, 142, 2019, 1284.0, 2014.4, 2019.0, 2019.0, 0.08075646785892579, 52.70771905650751, 0.12352212222491411], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f1ab537-d55a-4f30-831e-88bed8f7804f", 3, 0, 0.0, 705.6666666666667, 264, 1571, 282.0, 1571.0, 1571.0, 1571.0, 0.04374708352776482, 0.028125159494575364, 0.02805395655914606], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 943.2173913043479, 149, 1657, 893.0, 1538.8000000000002, 1637.1999999999998, 1657.0, 0.0983944591085462, 0.03099893370352466, 0.04439281260561362], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47523073-2822-4efb-850e-afbe67e4e509", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 0.2899904695024077, 1.1066663322632424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b48a214-3ecb-4cdf-b359-39eb6fef93ad", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 507.38461538461536, 289, 1494, 310.0, 1256.7999999999997, 1494.0, 1494.0, 0.07106737734044007, 6.64176745934126, 0.1584334853765204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 172.6, 148, 442, 153.0, 277.0000000000001, 442.0, 442.0, 0.0979157011090585, 0.07601853748213037, 0.03480597187861064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac2d6b03-07de-460d-bd25-9d41feaf1f12", 3, 0, 0.0, 347.3333333333333, 235, 470, 337.0, 470.0, 470.0, 470.0, 0.055575109760841776, 0.03572944068283285, 0.03563898640262314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 549.2941176470588, 287, 1766, 305.0, 1686.8, 1766.0, 1766.0, 0.12363726281645684, 17.570617843129767, 0.2743414838471553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 216.44444444444446, 144, 468, 150.0, 468.0, 468.0, 468.0, 0.05556070006482081, 0.04129071557551625, 0.02788886702472451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 174.55555555555554, 137, 417, 145.0, 417.0, 417.0, 417.0, 0.05556275813531384, 0.014867378641675772, 0.03168813549904617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 310.6666666666667, 142, 452, 430.0, 452.0, 452.0, 452.0, 0.05556070006482081, 0.014975344939346234, 0.03266361468654505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 226.44444444444446, 139, 588, 147.0, 588.0, 588.0, 588.0, 0.05556241511297691, 0.01497580719841956, 0.03271888311828621], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 145.5, 144, 147, 145.5, 147.0, 147.0, 147.0, 0.09897070467141726, 0.02918862579176564, 0.061180132868171026], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1696.9999999999993, 1118, 2814, 1599.5, 2312.5, 2576.75, 2814.0, 0.24802612541854407, 296.72547383324377, 0.48975471249638297], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 943.2173913043479, 149, 1657, 893.0, 1538.8000000000002, 1637.1999999999998, 1657.0, 0.09863117088064771, 0.03107350916841058, 0.044499610299667224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 146.8, 139, 157, 147.0, 157.0, 157.0, 157.0, 0.02961734391659756, 0.007982799727520437, 0.01744068201338704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 204.2, 145, 429, 148.0, 429.0, 429.0, 429.0, 0.02961506340585075, 0.007982185058608211, 0.01741041813508023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 184.6, 140, 450, 146.0, 439.8, 450.0, 450.0, 0.09602581173819523, 0.025881957070060434, 0.05645267447889993], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0fa0d1bc-d157-4e7b-a681-7e0ddf2e8533", 1, 0, 0.0, 759.0, 759, 759, 759.0, 759.0, 759.0, 759.0, 1.3175230566534915, 0.2380290678524374, 0.9083703886693018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 184.93333333333334, 139, 450, 144.0, 444.6, 450.0, 450.0, 0.09602581173819523, 0.025881957070060434, 0.05654644968567551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 205.2, 144, 425, 153.0, 425.0, 425.0, 425.0, 0.029614887996493595, 0.007924296202186763, 0.016889740810500254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 166.06666666666666, 143, 430, 146.0, 263.80000000000007, 430.0, 430.0, 0.09602396758230855, 0.07136156184583671, 0.048199530602838464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 209.2, 141, 463, 149.0, 463.0, 463.0, 463.0, 0.02961506340585075, 0.022008850831887132, 0.014865373623639929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 183.73333333333332, 138, 453, 143.0, 442.8, 453.0, 453.0, 0.09602458229306703, 0.025694077683887075, 0.054764019589014785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 222.8, 144, 459, 156.0, 459.0, 459.0, 459.0, 0.02927434747479479, 0.023042113344418552, 0.01040611570393096], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 698.7333333333332, 143, 1667, 490.0, 1609.4, 1667.0, 1667.0, 0.08480373588724495, 0.01630373906738505, 0.05771181323107888], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1341.2173913043478, 707, 2002, 1433.0, 1690.6000000000001, 1943.7999999999993, 2002.0, 0.09625887778889174, 0.049821489480578726, 0.04427532367047657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 418.4, 288, 893, 306.0, 893.0, 893.0, 893.0, 0.02958807482232361, 0.04585573705373786, 0.06654427374590945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db14994d-82e7-4f1b-b70b-23df1f1633dc", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 1.3141396604938271, 2.455471965020576], "isController": false}, {"data": ["addBook", 54, 11, 20.37037037037037, 1442.2222222222222, 725, 2884, 1139.5, 2646.0, 2809.0, 2884.0, 0.2397176658602091, 80.60869368438284, 0.8695010945442035], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/88435120-7e8b-418f-bb2c-0d92a80153c7", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 1.075205176767677, 2.009022516835017], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 256.8703703703704, 142, 607, 153.0, 573.0, 592.5, 607.0, 0.2500567258313229, 0.18583317222425458, 0.12087703055322736], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 943.3333333333335, 679, 1407, 878.5, 1291.0, 1313.0, 1407.0, 0.2494595044071179, 73.34937713079994, 0.1254605905953767], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 233.7592592592593, 137, 624, 152.5, 448.0, 489.25, 624.0, 0.2506277296376573, 0.4434935997103857, 0.12188731382768879], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1434.1481481481483, 969, 2242, 1394.0, 1801.0, 2012.5, 2242.0, 0.24875736483031521, 223.832314143123, 0.12486453664334182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 169.5294117647059, 142, 433, 154.0, 220.99999999999983, 433.0, 433.0, 0.12498529584754735, 0.09337280402673216, 0.04442836688330785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 162, 11, 6.790123456790123, 203.73456790123456, 138, 1438, 152.0, 306.1, 419.7499999999999, 1029.1300000000028, 0.6741853593574431, 1.5029771968246703, 0.32173444717840943], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 152.88888888888889, 147, 173, 150.0, 173.0, 173.0, 173.0, 0.056929957176021104, 0.04408735941463353, 0.020236820714913752], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/498b2a67-4600-4eb8-a2e3-963fe78d7911", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.6013859463276836, 1.1236905602636533], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 157.1, 147, 211, 153.5, 177.80000000000004, 209.45, 211.0, 0.09517600422581458, 0.07723755811684758, 0.03383209525214503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 543.7777777777778, 293, 901, 581.0, 901.0, 901.0, 901.0, 0.05550895544481176, 0.08602803934659792, 0.1248409417865249], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/263a3091-3197-4eb1-ae7a-429a464b45ea", 3, 0, 0.0, 461.33333333333337, 235, 794, 355.0, 794.0, 794.0, 794.0, 0.08094544277157197, 0.03583522206033134, 0.05190837313150937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 412.6, 287, 883, 298.0, 715.0000000000001, 883.0, 883.0, 0.09593553132295098, 0.1486813361421125, 0.21576125843433214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0966b73-9060-49bf-a66b-806211ed5a41", 3, 0, 0.0, 329.6666666666667, 238, 456, 295.0, 456.0, 456.0, 456.0, 0.019946808510638295, 0.02357645237699468, 0.012791410405585107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb3df347-35be-4e64-9e82-8d28164a1e7a", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 196.46153846153848, 143, 453, 153.0, 449.8, 453.0, 453.0, 0.06688171711091562, 0.055451736159343124, 0.023774360379270786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f1ab537-d55a-4f30-831e-88bed8f7804f", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 173.93750000000003, 143, 458, 154.5, 262.7000000000002, 458.0, 458.0, 0.07568053354776151, 0.058755882978975, 0.02690206465955585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8dfec433-4f08-421b-86c8-680b3e454a3d", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b689ed70-be36-4327-8d1a-3e9cd1500327", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac2d6b03-07de-460d-bd25-9d41feaf1f12", 1, 0, 0.0, 759.0, 759, 759, 759.0, 759.0, 759.0, 759.0, 1.3175230566534915, 0.2380290678524374, 0.9083703886693018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5d5d7f1-90c0-4e3a-95b0-9cb85e3fdad3", 3, 0, 0.0, 415.6666666666667, 224, 614, 409.0, 614.0, 614.0, 614.0, 0.04639581819025379, 0.03867828463061196, 0.029752526638932277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47523073-2822-4efb-850e-afbe67e4e509", 3, 0, 0.0, 391.6666666666667, 256, 559, 360.0, 559.0, 559.0, 559.0, 0.021387629395157842, 0.02527945388470642, 0.013715374319160464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b48a214-3ecb-4cdf-b359-39eb6fef93ad", 3, 0, 0.0, 353.6666666666667, 236, 481, 344.0, 481.0, 481.0, 481.0, 0.01576955424726661, 0.021739603592830108, 0.010112637326534902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 147.0, 139, 153, 147.0, 153.0, 153.0, 153.0, 0.12404775108724206, 0.09218783064198359, 0.062266156307463294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 230.94117647058823, 143, 451, 152.0, 431.0, 451.0, 451.0, 0.12381285323078715, 0.05500738780370565, 0.06938868314105925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 379.52941176470586, 138, 1618, 145.0, 1538.8, 1618.0, 1618.0, 0.12377589282463868, 13.132232584913902, 0.0715152763114784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 259.4117647058824, 139, 1126, 143.0, 1122.8, 1126.0, 1126.0, 0.12405770872709493, 4.320925434019543, 0.07179925410302629], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 22.22222222222222, 0.4769475357710652], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.11111111111111, 0.2384737678855326], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.407407407407407, 0.1589825119236884], "isController": false}, {"data": ["401/Unauthorized", 16, 59.25925925925926, 1.2718600953895072], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1258, 27, "401/Unauthorized", 16, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 162, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
