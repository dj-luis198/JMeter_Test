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

    var data = {"OkPercent": 98.65718799368088, "KoPercent": 1.3428120063191153};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7728194726166329, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/600b24fc-6a04-4fb7-b64c-17ab590eb8a5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4643ec5a-846b-4b15-854a-3197aff7af11"], "isController": false}, {"data": [0.009433962264150943, 500, 1500, "see books"], "isController": true}, {"data": [0.7666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba915929-c6c5-444c-ae07-083dcb519ef0"], "isController": false}, {"data": [0.9, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f763603-4040-465f-85f4-e371bea92771"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/beeb6462-1bd3-471b-ba46-fe4790f8b081"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=665f60d0-6fa9-4e7f-b200-9f4aa132524c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e67e9642-63ce-4ae3-9fa4-8159de042f0f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/191b3788-b130-46db-95e6-256d2045209d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=caad9d35-4368-44b3-bf14-834f7fe6ca3f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0f25a1d-43ce-4f08-b9f3-51121219187f"], "isController": false}, {"data": [0.59375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8fb0ea01-b1ef-4ca7-9091-3556d37bcef3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5493c09-c0da-4071-b334-fae2e235a925"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd557ea8-4c97-4b40-b40a-475ae4b72b24"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6032e5ea-613c-486b-8432-689898d3cb72"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f84c7789-ac77-454b-aec1-899bcf1ab698"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1aa3bda8-afcd-4690-b912-242c74aaa086"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=beeb6462-1bd3-471b-ba46-fe4790f8b081"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba915929-c6c5-444c-ae07-083dcb519ef0"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.41509433962264153, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/caad9d35-4368-44b3-bf14-834f7fe6ca3f"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4643ec5a-846b-4b15-854a-3197aff7af11"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=600b24fc-6a04-4fb7-b64c-17ab590eb8a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/665f60d0-6fa9-4e7f-b200-9f4aa132524c"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.27586206896551724, 500, 1500, "addBook"], "isController": true}, {"data": [0.9811320754716981, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49056603773584906, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/805edd06-bb63-42f7-9935-e6939f34f90a"], "isController": false}, {"data": [0.9289940828402367, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b5493c09-c0da-4071-b334-fae2e235a925"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=805edd06-bb63-42f7-9935-e6939f34f90a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8fb0ea01-b1ef-4ca7-9091-3556d37bcef3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e67e9642-63ce-4ae3-9fa4-8159de042f0f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f84c7789-ac77-454b-aec1-899bcf1ab698"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0f25a1d-43ce-4f08-b9f3-51121219187f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6032e5ea-613c-486b-8432-689898d3cb72"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1aa3bda8-afcd-4690-b912-242c74aaa086"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1266, 17, 1.3428120063191153, 403.42338072669844, 103, 3649, 140.5, 1109.1999999999998, 1347.2499999999993, 1861.579999999998, 4.9372316404010625, 693.7037515380101, 3.599588679807269], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/600b24fc-6a04-4fb7-b64c-17ab590eb8a5", 3, 0, 0.0, 293.3333333333333, 211, 422, 247.0, 422.0, 422.0, 422.0, 0.06498992656138299, 0.04178226072875371, 0.04167648285349104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4643ec5a-846b-4b15-854a-3197aff7af11", 3, 0, 0.0, 367.3333333333333, 221, 509, 372.0, 509.0, 509.0, 509.0, 0.027813574878779168, 0.028076137922882227, 0.017836179202862942], "isController": false}, {"data": ["see books", 53, 0, 0.0, 1836.8301886792456, 1306, 2461, 1800.0, 2218.6, 2363.4999999999995, 2461.0, 0.2464680661092458, 296.5835135461523, 1.2118815555273952], "isController": true}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 537.6666666666667, 123, 1423, 474.0, 976.0000000000002, 1423.0, 1423.0, 0.0872326319829722, 0.016424268990543982, 0.059012648368168226], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 537.6666666666667, 123, 1423, 474.0, 976.0000000000002, 1423.0, 1423.0, 0.08703674691454732, 0.01638738750500461, 0.05888013262949617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 177.5, 103, 335, 111.5, 329.4, 335.0, 335.0, 0.09645119870755393, 0.04391637831777053, 0.05399477505772001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 125.62500000000001, 105, 335, 113.0, 181.70000000000016, 335.0, 335.0, 0.09644596614746588, 0.07167517601388823, 0.04841135410136471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 245.625, 108, 902, 112.0, 843.9000000000001, 902.0, 902.0, 0.09644829165963398, 3.5676213666120127, 0.0557591686157259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 291.31250000000006, 105, 1302, 111.0, 1216.6000000000001, 1302.0, 1302.0, 0.09644771027107835, 10.870723617783753, 0.05566464528340557], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba915929-c6c5-444c-ae07-083dcb519ef0", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 289.46666666666664, 114, 865, 233.0, 569.2000000000002, 865.0, 865.0, 0.08803023545153642, 0.17316051653207823, 0.05690444061186883], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6f763603-4040-465f-85f4-e371bea92771", 1, 0, 0.0, 3171.0, 3171, 3171, 3171.0, 3171.0, 3171.0, 3171.0, 0.315357931251971, 0.10070512062440871, 0.18816767187007255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 168.0, 107, 402, 114.0, 353.19999999999993, 402.0, 402.0, 0.1104907740203693, 0.0821127724897471, 0.05546118930319318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 151.05882352941177, 106, 342, 113.0, 334.8, 342.0, 342.0, 0.11049795578781792, 0.03932935053201516, 0.06247247707167418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 724.6, 543, 880, 673.0, 880.0, 880.0, 880.0, 0.04443654461429079, 13.065819548746889, 0.025342716850337718], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1131.2, 742, 1308, 1203.0, 1308.0, 1308.0, 1308.0, 0.044265023548992526, 39.829745998995186, 0.025201668680725237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 196.6, 108, 333, 112.0, 333.0, 333.0, 333.0, 0.04465641355411464, 0.07902091929692943, 0.024726744614436528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 152.2, 106, 326, 110.5, 325.4, 326.0, 326.0, 0.06583451835466372, 0.04892584811318271, 0.03304584222099331], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 229.6, 106, 444, 218.5, 433.80000000000007, 444.0, 444.0, 0.06583755242315112, 0.01761668883197598, 0.037547979116328366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 153.90000000000003, 103, 343, 108.5, 342.2, 343.0, 343.0, 0.0659295740290222, 0.01777008050000989, 0.03875937848190563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 219.3, 107, 342, 216.5, 340.8, 342.0, 342.0, 0.06583321812520161, 0.017744109572808246, 0.038767022001461496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 200.4, 109, 344, 115.0, 344.0, 344.0, 344.0, 0.04465721124647208, 0.03318763452984888, 0.025076070768282662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 839.3125000000001, 107, 1578, 994.0, 1464.6000000000001, 1578.0, 1578.0, 0.08041453693791495, 45.23134139300595, 0.04295581221195262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 214.64705882352942, 106, 1037, 111.0, 470.5999999999995, 1037.0, 1037.0, 0.11050082875621567, 5.8767867516818875, 0.06440380334102506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 541.6250000000001, 109, 911, 633.5, 892.8000000000001, 911.0, 911.0, 0.08032451102453915, 14.769414528444917, 0.042986164102976024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 206.58823529411765, 106, 874, 111.0, 450.7999999999996, 874.0, 874.0, 0.11049436478739584, 1.9391481737556382, 0.06450794056378124], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 600.2857142857142, 199, 1702, 463.5, 1249.0, 1702.0, 1702.0, 0.08379620762306073, 0.015138963291275618, 0.05777355720886803], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/beeb6462-1bd3-471b-ba46-fe4790f8b081", 3, 0, 0.0, 343.3333333333333, 241, 447, 342.0, 447.0, 447.0, 447.0, 0.09491268033409264, 0.042945516166793214, 0.0608652279486206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 431.4, 219, 664, 439.5, 663.8, 664.0, 664.0, 0.06569180034948038, 0.10180946011193882, 0.14774239863755206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 759.9545454545455, 219, 1816, 693.0, 1255.3, 1735.449999999999, 1816.0, 0.09759906304899474, 0.05995098697052508, 0.04412926385906695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 110.25, 104, 118, 111.0, 114.5, 118.0, 118.0, 0.08041049557993557, 0.05975819056282321, 0.04036229953914734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 222.81249999999997, 104, 371, 212.5, 354.90000000000003, 371.0, 371.0, 0.08041534525825891, 0.09700493674830499, 0.04164085627264823], "isController": false}, {"data": ["login", 22, 0, 0.0, 3024.9090909090905, 1575, 5596, 2746.5, 5176.4, 5580.4, 5596.0, 0.096756034058124, 26.441081656870118, 0.1824483454718176], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=665f60d0-6fa9-4e7f-b200-9f4aa132524c", 1, 0, 0.0, 796.0, 796, 796, 796.0, 796.0, 796.0, 796.0, 1.256281407035176, 0.22696490263819094, 0.8661471419597989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 140.8235294117647, 107, 340, 116.0, 326.4, 340.0, 340.0, 0.11984490659146986, 0.09702287848078957, 0.042601119139936555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e67e9642-63ce-4ae3-9fa4-8159de042f0f", 3, 0, 0.0, 344.3333333333333, 255, 521, 257.0, 521.0, 521.0, 521.0, 0.029194807216956345, 0.029280338878724773, 0.018721930409311197], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/191b3788-b130-46db-95e6-256d2045209d", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 1.0539139851485149, 1.969239892739274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=caad9d35-4368-44b3-bf14-834f7fe6ca3f", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0f25a1d-43ce-4f08-b9f3-51121219187f", 3, 0, 0.0, 298.6666666666667, 216, 460, 220.0, 460.0, 460.0, 460.0, 0.049860390905464694, 0.031600970407857996, 0.03197427411580907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 964.8749999999999, 220, 1683, 1105.5, 1580.1000000000001, 1683.0, 1683.0, 0.08027614995584811, 60.07051954034378, 0.16770581425102352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8fb0ea01-b1ef-4ca7-9091-3556d37bcef3", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5493c09-c0da-4071-b334-fae2e235a925", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 0.9078596105527638, 3.4645885678391957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 460.5, 220, 1415, 332.0, 1327.5, 1415.0, 1415.0, 0.09638147788948659, 14.54392030531845, 0.21368168962754583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, 16.666666666666668, 1129.1666666666667, 114, 1625, 1318.0, 1625.0, 1625.0, 1625.0, 0.04397634072868797, 43.84445465214714, 0.08736575763905685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd557ea8-4c97-4b40-b40a-475ae4b72b24", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6032e5ea-613c-486b-8432-689898d3cb72", 3, 0, 0.0, 407.0, 323, 542, 356.0, 542.0, 542.0, 542.0, 0.019725681522296597, 0.023315087762844706, 0.012649606965795666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f84c7789-ac77-454b-aec1-899bcf1ab698", 1, 0, 0.0, 682.0, 682, 682, 682.0, 682.0, 682.0, 682.0, 1.466275659824047, 0.26490331744868034, 1.010928335777126], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1292.0, 180, 2462, 1337.5, 1861.3, 2374.549999999999, 2462.0, 0.09561392834170679, 0.030235867609477947, 0.043138315326043494], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1aa3bda8-afcd-4690-b912-242c74aaa086", 3, 0, 0.0, 1170.6666666666665, 246, 2889, 377.0, 2889.0, 2889.0, 2889.0, 0.020924441840513903, 0.020985743916218536, 0.013418343237569139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 125.9473684210526, 108, 329, 114.0, 130.0, 329.0, 329.0, 0.09354536950420954, 0.07262555542563143, 0.03325245556594948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 424.5882352941177, 219, 1355, 235.0, 859.7999999999995, 1355.0, 1355.0, 0.11040896780604391, 7.93090042572399, 0.24665064045319632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=beeb6462-1bd3-471b-ba46-fe4790f8b081", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 0.6975446428571428, 2.6619811776061777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba915929-c6c5-444c-ae07-083dcb519ef0", 3, 0, 0.0, 376.0, 221, 473, 434.0, 473.0, 473.0, 473.0, 0.014857957922263165, 0.020482894466401204, 0.009528052443638812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 446.3125, 219, 1335, 439.0, 870.2000000000005, 1335.0, 1335.0, 0.10158988164778787, 7.743655245609411, 0.2268534796121806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 112.11111111111111, 107, 118, 111.0, 118.0, 118.0, 118.0, 0.03883478388442769, 0.028860615757860808, 0.019493241129488113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 109.88888888888889, 106, 115, 109.0, 115.0, 115.0, 115.0, 0.03883629208343761, 0.010391742217638581, 0.022148822828835516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 112.11111111111111, 106, 123, 111.0, 123.0, 123.0, 123.0, 0.03883629208343761, 0.010467594350614045, 0.022831492025614693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 110.66666666666669, 105, 119, 111.0, 119.0, 119.0, 119.0, 0.0388361244999849, 0.010467549181636554, 0.02286931940770595], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1244.2830188679243, 849, 1989, 1170.0, 1747.0, 1881.7999999999997, 1989.0, 0.23495198999902472, 281.0842625666067, 0.46393840212698045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/caad9d35-4368-44b3-bf14-834f7fe6ca3f", 3, 0, 0.0, 365.0, 295, 456, 344.0, 456.0, 456.0, 456.0, 0.05478251342171579, 0.0352198776067346, 0.03513071335962894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1292.0, 180, 2462, 1337.5, 1861.3, 2374.549999999999, 2462.0, 0.09728228666436728, 0.030763450381611882, 0.04389103167865008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 134.87499999999997, 108, 309, 109.5, 309.0, 309.0, 309.0, 0.05539130494990549, 0.014929687662279215, 0.032618121957805675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4643ec5a-846b-4b15-854a-3197aff7af11", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=600b24fc-6a04-4fb7-b64c-17ab590eb8a5", 1, 0, 0.0, 732.0, 732, 732, 732.0, 732.0, 732.0, 732.0, 1.366120218579235, 0.24680882855191258, 0.9418758538251366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 109.375, 103, 112, 111.0, 112.0, 112.0, 112.0, 0.05538977089406014, 0.014929274186289646, 0.032563127029515825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 243.42105263157893, 104, 1171, 111.0, 1167.0, 1171.0, 1171.0, 0.0938503334156582, 8.911758690417388, 0.0543247561126204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 213.73684210526318, 104, 877, 113.0, 648.0, 877.0, 877.0, 0.09385079699084707, 2.9273962207765907, 0.054416675619538744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 112.05263157894738, 104, 126, 112.0, 116.0, 126.0, 126.0, 0.0938503334156582, 0.06974619504816004, 0.04710846814028155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 107.25000000000001, 103, 112, 107.0, 112.0, 112.0, 112.0, 0.05538938739337543, 0.014820988423618037, 0.031589259997784426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 134.42105263157893, 105, 333, 112.0, 323.0, 333.0, 333.0, 0.09385172415496401, 0.03995065683857997, 0.052695118969409274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 110.12500000000001, 106, 117, 109.5, 117.0, 117.0, 117.0, 0.055390921427977954, 0.0411645421940344, 0.027803646107402998], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 868.9285714285714, 422, 2889, 490.5, 2693.5, 2889.0, 2889.0, 0.08675983019861803, 0.015674383385492516, 0.05905429848480153], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 176.875, 111, 373, 117.5, 373.0, 373.0, 373.0, 0.054637717782528225, 0.043005859895232174, 0.019422001243008077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/665f60d0-6fa9-4e7f-b200-9f4aa132524c", 3, 0, 0.0, 983.0, 218, 2498, 233.0, 2498.0, 2498.0, 2498.0, 0.024270862829173578, 0.02434196887261842, 0.015564322842927065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1524.7272727272727, 776, 3649, 1300.0, 2450.9999999999995, 3486.399999999998, 3649.0, 0.09765971802975958, 0.05054653374587166, 0.04491965546095387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 246.5, 216, 416, 222.0, 416.0, 416.0, 416.0, 0.055348000553480006, 0.08577859070153591, 0.12447895046353952], "isController": false}, {"data": ["addBook", 58, 10, 17.24137931034483, 1140.3275862068963, 556, 2725, 918.0, 2041.5000000000002, 2207.0499999999984, 2725.0, 0.2725128503904451, 91.00390720438229, 0.9889878232566225], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 202.39622641509433, 104, 714, 114.0, 448.8, 483.2999999999998, 714.0, 0.23632650513229825, 0.17562936563054588, 0.11423986332078871], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 710.4528301886792, 514, 1011, 659.0, 977.6, 1005.2, 1011.0, 0.23646357568619053, 69.52814258140147, 0.1189245522249884], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 177.6415094339623, 105, 451, 113.0, 335.8, 361.8999999999998, 451.0, 0.23676674901384415, 0.4189661613409039, 0.11514632911024843], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1040.4339622641508, 736, 1546, 1009.0, 1315.2, 1413.9999999999995, 1546.0, 0.23573261694339304, 212.1126230994058, 0.11832672373916409], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 117.49999999999999, 111, 129, 116.0, 127.6, 129.0, 129.0, 0.10157246878233656, 0.07588177599461667, 0.0361058385124712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/805edd06-bb63-42f7-9935-e6939f34f90a", 3, 0, 0.0, 286.6666666666667, 200, 456, 204.0, 456.0, 456.0, 456.0, 0.052150332023780555, 0.03413877529291103, 0.0334427584918124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 10, 5.9171597633136095, 178.0828402366864, 106, 1089, 117.0, 329.0, 375.0, 1026.000000000001, 0.6749794311001766, 1.4490122185255894, 0.3252348074711037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 115.44444444444443, 113, 120, 115.0, 120.0, 120.0, 120.0, 0.04017103935869167, 0.031109017784611812, 0.01427954914703493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 141.68749999999997, 109, 338, 114.5, 324.7, 338.0, 338.0, 0.09395405646638794, 0.07624591887067224, 0.03339773100953634], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5493c09-c0da-4071-b334-fae2e235a925", 3, 0, 0.0, 539.3333333333334, 281, 865, 472.0, 865.0, 865.0, 865.0, 0.07297672042618404, 0.033020065557420514, 0.04679822240871828], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=805edd06-bb63-42f7-9935-e6939f34f90a", 1, 0, 0.0, 779.0, 779, 779, 779.0, 779.0, 779.0, 779.0, 1.2836970474967906, 0.23191792362002567, 0.8850489409499358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fb0ea01-b1ef-4ca7-9091-3556d37bcef3", 3, 0, 0.0, 1140.3333333333333, 232, 1976, 1213.0, 1976.0, 1976.0, 1976.0, 0.058139534883720936, 0.03737811894379845, 0.037283490794573645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 227.44444444444446, 219, 237, 228.0, 237.0, 237.0, 237.0, 0.03881619239030113, 0.06015751691739052, 0.08729852644029638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 393.84210526315786, 220, 1287, 227.0, 1282.0, 1287.0, 1287.0, 0.09379797890039149, 11.942171039071795, 0.20842763269945647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e67e9642-63ce-4ae3-9fa4-8159de042f0f", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 121.6, 111, 159, 116.5, 155.60000000000002, 159.0, 159.0, 0.0655914049023016, 0.05438193629106842, 0.023315694711365024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 116.4375, 109, 142, 113.0, 139.2, 142.0, 142.0, 0.0809806759861928, 0.06287073965724929, 0.02878609966696697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f84c7789-ac77-454b-aec1-899bcf1ab698", 3, 0, 0.0, 525.6666666666666, 230, 846, 501.0, 846.0, 846.0, 846.0, 0.01981977220475146, 0.0273231560179435, 0.012709945066198039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0f25a1d-43ce-4f08-b9f3-51121219187f", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6032e5ea-613c-486b-8432-689898d3cb72", 1, 0, 0.0, 1702.0, 1702, 1702, 1702.0, 1702.0, 1702.0, 1702.0, 0.5875440658049353, 0.10614809782608696, 0.4050840922444183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1aa3bda8-afcd-4690-b912-242c74aaa086", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 141.25, 107, 336, 111.5, 331.8, 336.0, 336.0, 0.10179800730400702, 0.07565262066245053, 0.05109782788501915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 164.25000000000003, 108, 338, 110.5, 332.4, 338.0, 338.0, 0.10166346850338666, 0.0367462805466953, 0.057446312951925885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 261.3125, 106, 1220, 117.0, 601.9000000000005, 1220.0, 1220.0, 0.10166540643923268, 5.743108842745856, 0.05922208490332256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 247.37499999999997, 105, 777, 217.0, 469.7000000000003, 777.0, 777.0, 0.10180059807851372, 1.8965207856143032, 0.05940025132022651], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 29.41176470588235, 0.3949447077409163], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.07898894154818326], "isController": false}, {"data": ["401/Unauthorized", 11, 64.70588235294117, 0.8688783570300158], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1266, 17, "401/Unauthorized", 11, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
