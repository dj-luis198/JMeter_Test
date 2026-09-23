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

    var data = {"OkPercent": 98.8, "KoPercent": 1.2};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7405757368060315, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d4ca2a2-86fe-4d80-a021-71fa7d63faff"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cff194fd-5f6f-4173-86cb-4d2f1e1933bf"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/541ea421-fd6e-4037-9517-4ad310830905"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00bec57e-7fac-4e15-a5ae-9486e8aba583"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fc82e073-3c18-421d-9505-37223a8ffea5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e805d593-ac63-48d0-ae9f-1e44d79858ff"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1695861f-e2bb-47e3-b77a-731114eb4858"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90fac4e6-c9c1-48b9-9e54-ed5b9842a80f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7b5387b3-64a2-4113-ba6e-46cbf7650a32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/89c10ce1-3f35-4efa-a1cd-93aa160b0f6a"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41941283-899c-48e1-bdf3-c9c3bb93ee61"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/48dfabc6-a591-4496-bcce-c8d685db4fa9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4d4ca2a2-86fe-4d80-a021-71fa7d63faff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60a42533-2b7d-4030-bc48-a8cbe319b5a6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7451f8c6-b115-4c8c-9969-b8e8cd4759df"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "register"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cff194fd-5f6f-4173-86cb-4d2f1e1933bf"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.28846153846153844, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=541ea421-fd6e-4037-9517-4ad310830905"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc82e073-3c18-421d-9505-37223a8ffea5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51aae620-fc74-4da2-aeb2-e8b4277d4a58"], "isController": false}, {"data": [0.2796610169491525, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e805d593-ac63-48d0-ae9f-1e44d79858ff"], "isController": false}, {"data": [0.9038461538461539, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/00bec57e-7fac-4e15-a5ae-9486e8aba583"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9903846153846154, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4326923076923077, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9323529411764706, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48dfabc6-a591-4496-bcce-c8d685db4fa9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/60a42533-2b7d-4030-bc48-a8cbe319b5a6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/51aae620-fc74-4da2-aeb2-e8b4277d4a58"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1695861f-e2bb-47e3-b77a-731114eb4858"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7743b46a-1621-49fc-8930-f26a1e55ac53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/41941283-899c-48e1-bdf3-c9c3bb93ee61"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/90fac4e6-c9c1-48b9-9e54-ed5b9842a80f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7451f8c6-b115-4c8c-9969-b8e8cd4759df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89c10ce1-3f35-4efa-a1cd-93aa160b0f6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1250, 15, 1.2, 449.7792000000001, 124, 2379, 156.5, 1270.0, 1523.0, 1889.39, 4.822847177476918, 667.8087859555314, 3.5180597842547545], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 52, 0, 0.0, 2187.1153846153848, 1695, 2931, 2122.5, 2594.9, 2676.2999999999997, 2931.0, 0.23385921675151558, 281.4116873321948, 1.1498839417420712], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d4ca2a2-86fe-4d80-a021-71fa7d63faff", 1, 0, 0.0, 621.0, 621, 621, 621.0, 621.0, 621.0, 621.0, 1.6103059581320451, 0.29092441626409016, 1.1102304750402576], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 633.4285714285716, 503, 950, 600.5, 836.5, 950.0, 950.0, 0.07128309572301426, 0.01287829366089613, 0.04845022912423625], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 633.4285714285716, 503, 950, 600.5, 836.5, 950.0, 950.0, 0.07307537725163506, 0.013202094523000476, 0.049668420475720704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 176.0, 126, 421, 133.0, 387.70000000000005, 421.0, 421.0, 0.1389274798555154, 0.060358683739310304, 0.07793566306998859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 130.2777777777778, 126, 143, 129.0, 134.9, 143.0, 143.0, 0.13917992097673376, 0.10343351549149842, 0.06986179627152456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 338.5, 126, 1127, 266.5, 1017.2000000000002, 1127.0, 1127.0, 0.13888781722363255, 4.570789625465853, 0.080460292551755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 269.11111111111114, 127, 1591, 132.5, 1171.6000000000006, 1591.0, 1591.0, 0.13919714181868797, 13.949997414219762, 0.0805035553269973], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 263.4666666666667, 131, 409, 253.0, 395.2, 409.0, 409.0, 0.07133583484327516, 0.13285370387543813, 0.04611285834367703], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cff194fd-5f6f-4173-86cb-4d2f1e1933bf", 1, 0, 0.0, 889.0, 889, 889, 889.0, 889.0, 889.0, 889.0, 1.124859392575928, 0.2032216676040495, 0.7755378233970753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/541ea421-fd6e-4037-9517-4ad310830905", 3, 0, 0.0, 734.6666666666667, 243, 1591, 370.0, 1591.0, 1591.0, 1591.0, 0.018688212098748512, 0.022417337755171962, 0.011984302680512555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00bec57e-7fac-4e15-a5ae-9486e8aba583", 1, 0, 0.0, 657.0, 657, 657, 657.0, 657.0, 657.0, 657.0, 1.5220700152207, 0.2749833523592085, 1.0493959284627092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 151.28571428571428, 126, 380, 133.0, 262.0, 380.0, 380.0, 0.11893434823977166, 0.08838773340865842, 0.05969946776879163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 210.0, 126, 424, 134.0, 420.5, 424.0, 424.0, 0.11868128141874994, 0.06995374079160416, 0.06554955261395523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 883.75, 665, 1116, 877.0, 1116.0, 1116.0, 1116.0, 0.04350947418800444, 12.793230061783454, 0.024813996997846283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1391.0, 989, 1653, 1461.0, 1653.0, 1653.0, 1653.0, 0.04325680483611078, 38.92254902888473, 0.024627653534621666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 200.25, 129, 401, 135.5, 401.0, 401.0, 401.0, 0.04398117605664775, 0.07782606544398998, 0.024352858226678983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 155.23076923076925, 129, 397, 134.0, 295.7999999999999, 397.0, 397.0, 0.0672557581275997, 0.04998206243662438, 0.03375923796639282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 172.15384615384616, 127, 405, 132.0, 393.0, 405.0, 405.0, 0.06725088719439645, 0.01799486630006311, 0.03835402160305422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 255.0769230769231, 126, 399, 158.0, 399.0, 399.0, 399.0, 0.06716263690845216, 0.018102429479231245, 0.03948428458875801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 190.92307692307688, 126, 393, 134.0, 391.0, 393.0, 393.0, 0.0672557581275997, 0.018127528557829606, 0.039604709131779894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc82e073-3c18-421d-9505-37223a8ffea5", 3, 0, 0.0, 901.6666666666666, 226, 1979, 500.0, 1979.0, 1979.0, 1979.0, 0.0865700929185664, 0.039170712616148205, 0.05551532651353379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 137.0, 129, 143, 138.0, 143.0, 143.0, 143.0, 0.043974406895187, 0.03268019887425518, 0.024692660121809106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 880.1666666666665, 126, 1678, 1349.5, 1650.1000000000001, 1678.0, 1678.0, 0.0830691273588171, 41.53536588777822, 0.044869587238736054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 437.5, 127, 1545, 131.5, 1453.5, 1545.0, 1545.0, 0.11781834094944751, 22.74205455988538, 0.06709465230966026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e805d593-ac63-48d0-ae9f-1e44d79858ff", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 0.7140872035573123, 2.7251111660079053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 635.5555555555555, 127, 1143, 816.0, 1142.1, 1143.0, 1143.0, 0.08306721060306796, 13.57912743086962, 0.044949672230631496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 334.8571428571429, 127, 1113, 131.0, 1057.5, 1113.0, 1113.0, 0.11805977197598326, 7.463607679998987, 0.06734743409734871], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 609.4285714285713, 232, 1399, 529.0, 1220.0, 1399.0, 1399.0, 0.072894266865911, 0.013169374384954623, 0.05025718008528629], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 432.15384615384625, 259, 791, 515.0, 691.8, 791.0, 791.0, 0.06711721246728036, 0.10401857049372454, 0.15094818389858072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 515.8000000000001, 137, 1092, 442.5, 938.0000000000001, 1084.6499999999999, 1092.0, 0.09881325283347002, 0.06069681253149673, 0.04467825787294592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 131.05555555555554, 126, 142, 130.0, 136.60000000000002, 142.0, 142.0, 0.08306644392553555, 0.06173199592512945, 0.04169546111105984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 234.66666666666663, 127, 418, 131.0, 416.2, 418.0, 418.0, 0.08295810154993387, 0.0914195398590634, 0.043441384340275696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1695861f-e2bb-47e3-b77a-731114eb4858", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["login", 20, 0, 0.0, 2594.25, 1560, 4457, 2372.0, 3842.6000000000004, 4427.349999999999, 4457.0, 0.10000250006250157, 24.066285250881272, 0.18404756993924848], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90fac4e6-c9c1-48b9-9e54-ed5b9842a80f", 1, 0, 0.0, 1041.0, 1041, 1041, 1041.0, 1041.0, 1041.0, 1041.0, 0.9606147934678194, 0.17354857108549473, 0.6622988712776178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 155.64285714285714, 130, 384, 136.0, 270.5, 384.0, 384.0, 0.1322339028836436, 0.107052642080606, 0.04700502016567019], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b5387b3-64a2-4113-ba6e-46cbf7650a32", 1, 0, 0.0, 725.0, 725, 725, 725.0, 725.0, 725.0, 725.0, 1.379310344827586, 0.4404633620689655, 0.8230064655172414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89c10ce1-3f35-4efa-a1cd-93aa160b0f6a", 3, 0, 0.0, 350.3333333333333, 269, 474, 308.0, 474.0, 474.0, 474.0, 0.0859697386519945, 0.039906525819578174, 0.05513033370586887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1051.0555555555559, 257, 1805, 1482.0, 1782.5, 1805.0, 1805.0, 0.0829061364358652, 55.15964037160373, 0.1746732260389751], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41941283-899c-48e1-bdf3-c9c3bb93ee61", 1, 0, 0.0, 666.0, 666, 666, 666.0, 666.0, 666.0, 666.0, 1.5015015015015014, 0.2712673611111111, 1.0352149024024024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48dfabc6-a591-4496-bcce-c8d685db4fa9", 3, 0, 0.0, 384.0, 255, 509, 388.0, 509.0, 509.0, 509.0, 0.04147197876634687, 0.026662486348806993, 0.026594986383366975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d4ca2a2-86fe-4d80-a021-71fa7d63faff", 3, 0, 0.0, 326.3333333333333, 226, 504, 249.0, 504.0, 504.0, 504.0, 0.03333444448148272, 0.03343210398679956, 0.021376580608242497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60a42533-2b7d-4030-bc48-a8cbe319b5a6", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7451f8c6-b115-4c8c-9969-b8e8cd4759df", 1, 0, 0.0, 1399.0, 1399, 1399, 1399.0, 1399.0, 1399.0, 1399.0, 0.7147962830593281, 0.12913800035739814, 0.4928185310936383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 507.44444444444446, 262, 1719, 398.0, 1299.6000000000006, 1719.0, 1719.0, 0.1387336698909399, 18.63264239469729, 0.30807124070291725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 1, 20.0, 1249.4, 131, 1795, 1414.0, 1795.0, 1795.0, 1795.0, 0.04044162251789542, 38.707956510090185, 0.07817397227726776], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1225.190476190476, 197, 2165, 1354.0, 1811.4, 2129.7999999999993, 2165.0, 0.08296492953907056, 0.02634321702440354, 0.03743144281938535], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 630.3571428571429, 256, 1674, 403.0, 1590.5, 1674.0, 1674.0, 0.11768859597505002, 30.313983257221036, 0.2582318969720406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 163.6923076923077, 129, 434, 141.0, 325.5999999999999, 434.0, 434.0, 0.10722622258514175, 0.08324692085467547, 0.038115571309562106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cff194fd-5f6f-4173-86cb-4d2f1e1933bf", 3, 0, 0.0, 414.6666666666667, 315, 520, 409.0, 520.0, 520.0, 520.0, 0.04174377669862385, 0.026837226230397818, 0.026769283885510732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 537.0666666666666, 255, 1682, 525.0, 1140.8000000000002, 1682.0, 1682.0, 0.07510213890891612, 6.098518594663743, 0.16762543152437315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 207.8, 126, 389, 135.5, 388.8, 389.0, 389.0, 0.06519712350291106, 0.048452159165737606, 0.032725899883297146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 209.8, 131, 397, 134.0, 396.2, 397.0, 397.0, 0.06519372314833528, 0.01744441420180065, 0.03718079523303496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 180.49999999999997, 126, 387, 128.0, 386.3, 387.0, 387.0, 0.06519584832837845, 0.017572318494758255, 0.03832802802117562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 234.5, 127, 416, 132.0, 413.7, 416.0, 416.0, 0.06519542328128565, 0.017572203931284024, 0.03839144554552271], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1485.9615384615383, 1009, 2379, 1423.5, 2057.0, 2123.45, 2379.0, 0.22734128736375916, 271.979216306491, 0.4489102373530479], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1225.190476190476, 197, 2165, 1354.0, 1811.4, 2129.7999999999993, 2165.0, 0.08211368444102088, 0.026072927704766113, 0.037047384972413715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=541ea421-fd6e-4037-9517-4ad310830905", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 214.9, 128, 419, 135.0, 417.1, 419.0, 419.0, 0.06451030229527656, 0.017387542415523757, 0.037988000277394296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 181.1, 126, 392, 130.0, 391.0, 392.0, 392.0, 0.06451196696987291, 0.017387991097348558, 0.037925980581897945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 212.69230769230765, 128, 402, 134.0, 399.6, 402.0, 402.0, 0.10423766186906146, 0.02809530730064547, 0.06128034418474121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 154.76923076923077, 126, 423, 132.0, 311.39999999999986, 423.0, 423.0, 0.10446214050961454, 0.028155811309232042, 0.061514326882126526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 208.4, 124, 402, 129.5, 401.4, 402.0, 402.0, 0.06450738932144677, 0.017260766283277752, 0.03678937047238762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 153.0, 128, 382, 132.0, 287.9999999999999, 382.0, 382.0, 0.10446130110568269, 0.07763188490373489, 0.05243467653156339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 158.20000000000002, 128, 380, 133.5, 356.6000000000001, 380.0, 380.0, 0.0645040605306104, 0.04793709967167433, 0.03237801475852905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 154.46153846153845, 126, 401, 133.0, 300.5999999999999, 401.0, 401.0, 0.10423348300192431, 0.02789059994387428, 0.059445658274534956], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 794.0714285714286, 474, 1591, 602.5, 1557.5, 1591.0, 1591.0, 0.07160282933465628, 0.012936058034093176, 0.048737472701421314], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 139.3, 130, 156, 135.5, 155.4, 156.0, 156.0, 0.06337296255925372, 0.0498814529519126, 0.022527107784734723], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1429.35, 929, 1879, 1378.0, 1865.1000000000001, 1878.85, 1879.0, 0.10071406270457545, 0.052127395735766587, 0.046324534701030304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 426.2, 257, 801, 404.5, 774.6000000000001, 801.0, 801.0, 0.06444586225341402, 0.09987849941032036, 0.14494025465782467], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc82e073-3c18-421d-9505-37223a8ffea5", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 0.7112758366141733, 2.714382381889764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51aae620-fc74-4da2-aeb2-e8b4277d4a58", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["addBook", 59, 10, 16.949152542372882, 1373.5762711864406, 697, 3199, 1097.0, 2368.0, 2558.0, 3199.0, 0.28835909015375893, 94.6771678326271, 1.0469578956017909], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e805d593-ac63-48d0-ae9f-1e44d79858ff", 3, 0, 0.0, 417.6666666666667, 261, 606, 386.0, 606.0, 606.0, 606.0, 0.06971070059254095, 0.03154227663529685, 0.044703802137794825], "isController": false}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 225.82692307692312, 127, 642, 135.0, 516.4, 528.75, 642.0, 0.22872122840893594, 0.16997739728437528, 0.11056348443596026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00bec57e-7fac-4e15-a5ae-9486e8aba583", 3, 0, 0.0, 697.3333333333333, 237, 1524, 331.0, 1524.0, 1524.0, 1524.0, 0.024339783375927956, 0.024569553466390816, 0.015608519938339217], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 842.1346153846151, 624, 1269, 766.0, 1133.5, 1149.85, 1269.0, 0.22851919561243145, 67.19223106147166, 0.11492908763711152], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 203.82692307692307, 126, 544, 133.5, 387.8, 394.04999999999995, 544.0, 0.22889540360422223, 0.40503756965903387, 0.11131827245595964], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1258.6346153846155, 879, 1884, 1265.0, 1553.8, 1713.949999999999, 1884.0, 0.22788926334795623, 205.05515974708672, 0.11438972789145459], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 153.73333333333335, 129, 381, 139.0, 239.4000000000001, 381.0, 381.0, 0.07730524232616627, 0.057752451542497266, 0.02747959785812942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 10, 5.882352941176471, 209.45882352941177, 127, 1233, 140.5, 381.9, 418.29999999999984, 836.8199999999956, 0.6999053069290626, 1.47644316871835, 0.3384778732142122], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 141.4, 134, 154, 140.5, 153.8, 154.0, 154.0, 0.06511010118109724, 0.05042217796543955, 0.023144606279218157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 155.94444444444446, 129, 396, 140.5, 198.90000000000032, 396.0, 396.0, 0.1299976889299746, 0.10549617138750866, 0.0462101159868269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48dfabc6-a591-4496-bcce-c8d685db4fa9", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60a42533-2b7d-4030-bc48-a8cbe319b5a6", 3, 0, 0.0, 615.6666666666667, 284, 1278, 285.0, 1278.0, 1278.0, 1278.0, 0.05844990842847679, 0.02644706143085376, 0.03748252591279273], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51aae620-fc74-4da2-aeb2-e8b4277d4a58", 3, 0, 0.0, 362.3333333333333, 235, 599, 253.0, 599.0, 599.0, 599.0, 0.019280949136856178, 0.026580344920112603, 0.012364410742059464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 474.09999999999997, 263, 803, 394.5, 801.4, 803.0, 803.0, 0.06513978998931708, 0.10095395186820919, 0.14650091439980198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 370.61538461538464, 261, 784, 280.0, 692.8, 784.0, 784.0, 0.10412494993992792, 0.16137333550260313, 0.2341794528434121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1695861f-e2bb-47e3-b77a-731114eb4858", 3, 0, 0.0, 401.33333333333337, 229, 716, 259.0, 716.0, 716.0, 716.0, 0.05646952527952415, 0.03696621593005308, 0.036212553646049014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 179.84615384615384, 129, 416, 137.0, 403.2, 416.0, 416.0, 0.0702516630730239, 0.05824576362206767, 0.024972270857988966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7743b46a-1621-49fc-8930-f26a1e55ac53", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.8104973032994923, 1.5144154505076142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 164.16666666666669, 130, 383, 135.5, 383.0, 383.0, 383.0, 0.08425506817639267, 0.06541287031272673, 0.02995004376582708], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41941283-899c-48e1-bdf3-c9c3bb93ee61", 3, 0, 0.0, 429.33333333333337, 253, 749, 286.0, 749.0, 749.0, 749.0, 0.043370149771583884, 0.027882827408488985, 0.027812237972011798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90fac4e6-c9c1-48b9-9e54-ed5b9842a80f", 3, 0, 0.0, 485.0, 242, 970, 243.0, 970.0, 970.0, 970.0, 0.017005067510118013, 0.023442858367626884, 0.01090494238116292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7451f8c6-b115-4c8c-9969-b8e8cd4759df", 3, 0, 0.0, 374.6666666666667, 272, 577, 275.0, 577.0, 577.0, 577.0, 0.017385559554234254, 0.020549142819474148, 0.01114894281309944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 167.13333333333333, 127, 381, 135.0, 380.4, 381.0, 381.0, 0.07524794196878716, 0.055921566248288104, 0.03777093962105136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89c10ce1-3f35-4efa-a1cd-93aa160b0f6a", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 0.7787244073275862, 2.9717807112068964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 216.3333333333333, 126, 422, 132.0, 407.0, 422.0, 422.0, 0.07525058444620587, 0.027670266989073614, 0.04249502405510349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 293.99999999999994, 125, 1547, 134.0, 857.6000000000004, 1547.0, 1547.0, 0.0751548189269896, 4.52720201270868, 0.04375223898731387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 280.7333333333334, 127, 791, 138.0, 564.2000000000002, 791.0, 791.0, 0.07515293622521832, 1.4920695646891424, 0.043824534490187535], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 26.666666666666668, 0.32], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.666666666666667, 0.08], "isController": false}, {"data": ["401/Unauthorized", 10, 66.66666666666667, 0.8], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1250, 15, "401/Unauthorized", 10, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
