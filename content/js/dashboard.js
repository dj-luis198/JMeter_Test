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

    var data = {"OkPercent": 98.31625183016105, "KoPercent": 1.6837481698389458};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8121859296482412, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2767857142857143, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57420c1b-2c66-40c5-aa03-123857e97387"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db8cf306-c06f-4a5c-9486-fb91ceca8ddb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fba78089-8aa2-484f-936f-dbd677e88be7"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e174f245-62cf-4648-83e0-c9fd84007bb6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f81294bf-6d39-4c21-8c21-707c21eb7f50"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2c22c813-ec98-4f16-93c0-cd113e5b9686"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d564a632-c55e-401a-8e89-08303b709aa4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3a17cf0-efc1-48b3-a568-ce4a6d7f5a8f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a98b575e-0edb-47f2-a8b5-05885c2e15d8"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/00a0c587-1d3a-41d2-aa3b-81df8b9f582c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/85b8edc0-e246-4e2e-a388-d037c5c58e2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/57420c1b-2c66-40c5-aa03-123857e97387"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=150d9fd2-8731-493e-839d-fdf82a8e0ebc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5b60b5bd-2dae-434d-99cf-dd3b2b97a807"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/18e7c7ce-8634-48cb-99ef-fd22c4b05dcf"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/150d9fd2-8731-493e-839d-fdf82a8e0ebc"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f7bea6d1-f5b7-4c56-adfc-5d2a599aa307"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c22c813-ec98-4f16-93c0-cd113e5b9686"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.4015151515151515, 500, 1500, "addBook"], "isController": true}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e174f245-62cf-4648-83e0-c9fd84007bb6"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f81294bf-6d39-4c21-8c21-707c21eb7f50"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9627659574468085, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/61570b6d-3051-4db4-aa9f-c20061a1370f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d564a632-c55e-401a-8e89-08303b709aa4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f3a17cf0-efc1-48b3-a568-ce4a6d7f5a8f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b60b5bd-2dae-434d-99cf-dd3b2b97a807"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fba78089-8aa2-484f-936f-dbd677e88be7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b7c611d9-d15a-44a2-8ac2-1a9f80f7c74f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2658a47a-ac4f-40c4-8d0a-0820c3ae886f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00a0c587-1d3a-41d2-aa3b-81df8b9f582c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/fb0b7182-71ec-4488-b44b-4ec98ba6199a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a98b575e-0edb-47f2-a8b5-05885c2e15d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1366, 23, 1.6837481698389458, 311.21742313323597, 98, 2311, 113.5, 791.0, 975.8999999999992, 1446.5899999999983, 5.3676612164865, 718.0405074104964, 3.9139285909005177], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1449.5535714285716, 1194, 1877, 1438.0, 1719.6, 1736.5, 1877.0, 0.24496080627099664, 294.77007738820384, 1.2044703706781914], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57420c1b-2c66-40c5-aa03-123857e97387", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 422.4666666666667, 104, 777, 410.0, 718.8000000000001, 777.0, 777.0, 0.07605873762777868, 0.015479141525028394, 0.05096826734392747], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 422.4666666666667, 104, 777, 410.0, 718.8000000000001, 777.0, 777.0, 0.07713628953877641, 0.015698440175665043, 0.051690353399910516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 121.94736842105263, 99, 304, 101.0, 299.0, 304.0, 304.0, 0.09280742459396753, 0.032169678837464896, 0.0525190041519111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 103.05263157894738, 100, 116, 102.0, 110.0, 116.0, 116.0, 0.09280017192452904, 0.06896575276813144, 0.04658133629805461], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 162.1052631578947, 98, 490, 101.0, 300.0, 490.0, 490.0, 0.09280787792344815, 1.459940044279127, 0.054231741576463925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 162.63157894736844, 98, 883, 100.0, 303.0, 883.0, 883.0, 0.09280787792344815, 4.418892363926555, 0.05414110888317931], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db8cf306-c06f-4a5c-9486-fb91ceca8ddb", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 1.1697287087912087, 2.185639880952381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fba78089-8aa2-484f-936f-dbd677e88be7", 3, 0, 0.0, 398.3333333333333, 186, 611, 398.0, 611.0, 611.0, 611.0, 0.023069647265093314, 0.031803371148330144, 0.014794012080805285], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 186.39999999999998, 100, 346, 185.0, 295.0, 346.0, 346.0, 0.0767290900441448, 0.17290021253957943, 0.04958917167110843], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e174f245-62cf-4648-83e0-c9fd84007bb6", 3, 0, 0.0, 756.3333333333334, 180, 1675, 414.0, 1675.0, 1675.0, 1675.0, 0.023114083411022338, 0.027320064083796256, 0.01482250791657357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 130.14285714285714, 99, 300, 102.5, 300.0, 300.0, 300.0, 0.08390719863830604, 0.06235681461303798, 0.042117480566493455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f81294bf-6d39-4c21-8c21-707c21eb7f50", 3, 0, 0.0, 302.3333333333333, 179, 510, 218.0, 510.0, 510.0, 510.0, 0.022827228317937636, 0.02698101107501027, 0.01463855461794829], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 596.5, 492, 706, 594.0, 706.0, 706.0, 706.0, 0.019600252843261678, 5.76312512556412, 0.011178269199672675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 129.07142857142858, 99, 305, 101.0, 299.5, 305.0, 305.0, 0.08390921023452624, 0.02245226914478534, 0.04785447146187825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 817.25, 688, 989, 796.0, 989.0, 989.0, 989.0, 0.01956258069564537, 17.60244449729058, 0.011137680220274658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 252.0, 102, 306, 300.0, 306.0, 306.0, 306.0, 0.019637781127110447, 0.03474966738508216, 0.010873654198312132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 127.80000000000001, 99, 298, 101.0, 296.2, 298.0, 298.0, 0.08292194833409806, 0.06162461199438342, 0.041622931097389064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 206.33333333333337, 98, 304, 292.0, 302.8, 304.0, 304.0, 0.08283357078956959, 0.0636351650596954, 0.04492211228366632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 375.26666666666665, 100, 886, 294.0, 884.8, 886.0, 886.0, 0.08265692417053776, 24.806467637403358, 0.046225454337559854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 325.19999999999993, 98, 780, 300.0, 733.8000000000001, 780.0, 780.0, 0.08261640651678215, 8.11216734848151, 0.04628347513521552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c22c813-ec98-4f16-93c0-cd113e5b9686", 3, 0, 0.0, 471.33333333333337, 189, 844, 381.0, 844.0, 844.0, 844.0, 0.022700960250618598, 0.02683176649413937, 0.01455758193154904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 102.5, 101, 105, 102.0, 105.0, 105.0, 105.0, 0.019637491899534593, 0.014593878257368968, 0.011026911955305068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 466.94117647058823, 99, 1003, 679.0, 926.9999999999999, 1003.0, 1003.0, 0.0820823817410156, 39.11163720703832, 0.04452101610746032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 143.28571428571428, 99, 303, 101.0, 301.0, 303.0, 303.0, 0.08390921023452624, 0.02261615432102465, 0.049329438048032026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 408.29411764705884, 98, 804, 492.0, 715.9999999999999, 804.0, 804.0, 0.08200161109047671, 12.775151959235552, 0.044557286265212506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 142.5, 99, 297, 100.5, 297.0, 297.0, 297.0, 0.08380975186327037, 0.022589347181897094, 0.04935281286479692], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 469.07142857142856, 104, 1245, 412.0, 1074.5, 1245.0, 1245.0, 0.07400124744959986, 0.015181198991997293, 0.049889931403486514], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 544.9333333333333, 204, 987, 510.0, 985.2, 987.0, 987.0, 0.08256592889422203, 33.01115921532093, 0.1786509535676738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 525.695652173913, 159, 1016, 403.0, 963.4, 1006.5999999999999, 1016.0, 0.09880531486676318, 0.06069193657343168, 0.04467466873370249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 113.17647058823529, 99, 297, 102.0, 143.39999999999986, 297.0, 297.0, 0.08208000386258842, 0.0609989091205369, 0.04120031443883832], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d564a632-c55e-401a-8e89-08303b709aa4", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 193.8823529411765, 99, 304, 103.0, 303.2, 304.0, 304.0, 0.08200477557222449, 0.08714891705458142, 0.043122226309061526], "isController": false}, {"data": ["login", 23, 0, 0.0, 2343.5652173913045, 1137, 4572, 2364.0, 2994.4, 4257.199999999995, 4572.0, 0.0996421546966113, 20.870656834043825, 0.1790741118309896], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 103.57142857142856, 101, 108, 103.0, 107.0, 108.0, 108.0, 0.08106449259417957, 0.06562740660212389, 0.02881589385183727], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3a17cf0-efc1-48b3-a568-ce4a6d7f5a8f", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 0.506061799719888, 1.9312412464985995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a98b575e-0edb-47f2-a8b5-05885c2e15d8", 3, 0, 0.0, 340.3333333333333, 180, 485, 356.0, 485.0, 485.0, 485.0, 0.01983103954309285, 0.02733868895344994, 0.012717170540329725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 594.2352941176471, 200, 1103, 788.0, 1027.8, 1103.0, 1103.0, 0.08196009989489823, 51.970066936090404, 0.17322828328544293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00a0c587-1d3a-41d2-aa3b-81df8b9f582c", 3, 0, 0.0, 478.0, 180, 1035, 219.0, 1035.0, 1035.0, 1035.0, 0.02602765872533879, 0.026273362534920443, 0.01669091396123614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85b8edc0-e246-4e2e-a388-d037c5c58e2e", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 1.1364268238434163, 2.123415258007117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57420c1b-2c66-40c5-aa03-123857e97387", 3, 0, 0.0, 308.6666666666667, 261, 355, 310.0, 355.0, 355.0, 355.0, 0.054094990803851564, 0.03477786680911681, 0.034689821576688665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=150d9fd2-8731-493e-839d-fdf82a8e0ebc", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b60b5bd-2dae-434d-99cf-dd3b2b97a807", 3, 0, 0.0, 389.0, 346, 442, 379.0, 442.0, 442.0, 442.0, 0.037079609922503615, 0.03082725382228979, 0.023778265477647175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 6, 60.0, 430.79999999999995, 100, 1096, 103.0, 1085.2, 1096.0, 1096.0, 0.048417709261339426, 23.177538510235504, 0.06291938058014099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 309.36842105263156, 201, 984, 210.0, 407.0, 984.0, 984.0, 0.09275441559836362, 5.976528937546987, 0.2073577974121518], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 1047.0434782608697, 251, 2018, 1067.0, 1799.2000000000003, 1991.1999999999996, 2018.0, 0.10090817356205853, 0.03209935616197956, 0.04552692986881937], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/18e7c7ce-8634-48cb-99ef-fd22c4b05dcf", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 1.6376201923076923, 3.059895833333333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 317.0714285714286, 202, 606, 207.5, 601.5, 606.0, 606.0, 0.08375760548971277, 0.1298079296017326, 0.18837281781524268], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 104.8125, 101, 113, 104.0, 111.6, 113.0, 113.0, 0.09768307945907995, 0.07583793766598493, 0.03472328215146983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/150d9fd2-8731-493e-839d-fdf82a8e0ebc", 3, 0, 0.0, 252.33333333333334, 185, 368, 204.0, 368.0, 368.0, 368.0, 0.025611036649393445, 0.030271378279279816, 0.01642374420550296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 297.5882352941176, 202, 594, 207.0, 450.79999999999984, 594.0, 594.0, 0.07943628275578482, 0.12311072337249074, 0.17865406170563716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7bea6d1-f5b7-4c56-adfc-5d2a599aa307", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.7002981085526315, 1.308508086622807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 102.6923076923077, 100, 115, 102.0, 110.6, 115.0, 115.0, 0.0645244547683572, 0.04795225593624984, 0.03238825170989805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c22c813-ec98-4f16-93c0-cd113e5b9686", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 116.38461538461537, 98, 299, 101.0, 221.39999999999992, 299.0, 299.0, 0.0645257358415645, 0.024720646994589767, 0.03638297575321388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 176.84615384615387, 99, 891, 101.0, 654.5999999999998, 891.0, 891.0, 0.06446110516085525, 4.477746701636816, 0.037469954306993535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 146.6153846153846, 99, 493, 101.0, 416.19999999999993, 493.0, 493.0, 0.06446078552904949, 1.4740078152504301, 0.037532718497270336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 120.33333333333333, 104, 144, 113.0, 144.0, 144.0, 144.0, 0.01880606558301938, 0.005546320123117043, 0.01162523390044069], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 935.8035714285714, 783, 1462, 804.0, 1295.8, 1310.05, 1462.0, 0.2575233610477522, 308.0874694191009, 0.5085080430064013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 1047.0434782608697, 251, 2018, 1067.0, 1799.2000000000003, 1991.1999999999996, 2018.0, 0.0994779569822713, 0.03164439766097047, 0.044881656372860686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 117.9090909090909, 99, 296, 100.0, 257.20000000000016, 296.0, 296.0, 0.06552767650773227, 0.017661756558724713, 0.03858709856851812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 99.72727272727272, 98, 101, 100.0, 101.0, 101.0, 101.0, 0.0655284572218317, 0.017661966985571823, 0.038523565671428395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 150.0, 99, 297, 102.0, 296.3, 297.0, 297.0, 0.09452075025845517, 0.025476295968099246, 0.05556786294491212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 137.0625, 98, 298, 100.0, 297.3, 298.0, 298.0, 0.09452075025845517, 0.025476295968099246, 0.055660168365086395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 114.81250000000001, 99, 302, 102.0, 169.70000000000013, 302.0, 302.0, 0.09452130864751823, 0.07024483972730602, 0.047445266254711294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 117.72727272727272, 98, 297, 100.0, 258.0000000000001, 297.0, 297.0, 0.06552767650773227, 0.017533772815545547, 0.037371253008316056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 150.5625, 100, 306, 101.0, 301.1, 306.0, 306.0, 0.0945201918759895, 0.025291535716817505, 0.05390604692927526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 101.36363636363636, 99, 104, 101.0, 103.8, 104.0, 104.0, 0.06552650547146321, 0.04869694400760107, 0.03289123419173055], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 444.21428571428567, 100, 1035, 415.5, 939.5, 1035.0, 1035.0, 0.07470969945355191, 0.014888784273074624, 0.050836573533021685], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 141.63636363636363, 100, 319, 104.0, 316.6, 319.0, 319.0, 0.0696484652010941, 0.05482095991414244, 0.024757852864451424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1209.1304347826087, 618, 2116, 1115.0, 1805.0, 2055.399999999999, 2116.0, 0.09994307590024812, 0.05172834983118311, 0.04596991088771178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 220.54545454545453, 199, 398, 203.0, 359.60000000000014, 398.0, 398.0, 0.06548710499368943, 0.10149222229002453, 0.1472820339848308], "isController": false}, {"data": ["addBook", 66, 7, 10.606060606060606, 895.8787878787879, 528, 1651, 807.5, 1451.7000000000005, 1593.45, 1651.0, 0.31921994254041036, 93.78852801064309, 1.1626607737939774], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 184.57142857142853, 99, 577, 103.0, 403.3, 416.15, 577.0, 0.25857093385663166, 0.1921606256493132, 0.12499278540921159], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e174f245-62cf-4648-83e0-c9fd84007bb6", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 575.8750000000001, 489, 881, 500.5, 781.0, 797.9, 881.0, 0.2582775653649785, 75.94217983959119, 0.12989545523726945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f81294bf-6d39-4c21-8c21-707c21eb7f50", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 167.76785714285714, 98, 401, 104.0, 305.0, 363.1499999999999, 401.0, 0.2589786990020071, 0.45827090096839534, 0.12594862510058547], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 743.7857142857143, 679, 981, 692.5, 898.6, 917.6999999999999, 981.0, 0.258041922596639, 232.18657554177284, 0.12952494942839107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 106.0, 100, 116, 105.0, 115.2, 116.0, 116.0, 0.07829987932606833, 0.05849551531683816, 0.02783316022918835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 188, 7, 3.723404255319149, 155.4414893617021, 100, 448, 108.0, 297.0, 319.65, 438.2099999999998, 0.8155050058126421, 1.6501191740734473, 0.3969249659483282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 110.6153846153846, 100, 130, 109.0, 128.0, 130.0, 130.0, 0.0634895828246027, 0.0491672257616308, 0.02256856264468299], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61570b6d-3051-4db4-aa9f-c20061a1370f", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.7080619456762749, 1.3230148281596452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 125.15789473684211, 100, 301, 104.0, 297.0, 301.0, 301.0, 0.09369898953037081, 0.07603892607396302, 0.033307062684623995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 281.53846153846155, 202, 994, 205.0, 757.1999999999998, 994.0, 994.0, 0.06442788042185393, 6.021257793295535, 0.143631776388173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 303.5625, 201, 601, 211.0, 467.3000000000001, 601.0, 601.0, 0.09446271379568895, 0.14639875663452967, 0.21244885729635907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d564a632-c55e-401a-8e89-08303b709aa4", 3, 0, 0.0, 647.3333333333334, 216, 1309, 417.0, 1309.0, 1309.0, 1309.0, 0.02527507708898512, 0.02987428545250813, 0.016208301388444233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3a17cf0-efc1-48b3-a568-ce4a6d7f5a8f", 3, 0, 0.0, 348.0, 191, 647, 206.0, 647.0, 647.0, 647.0, 0.020666992745885546, 0.02849111792930511, 0.013253247301235197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b60b5bd-2dae-434d-99cf-dd3b2b97a807", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 118.93333333333332, 102, 300, 104.0, 191.40000000000006, 300.0, 300.0, 0.08330602746877412, 0.06906915754002854, 0.029612689451790804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fba78089-8aa2-484f-936f-dbd677e88be7", 1, 0, 0.0, 904.0, 904, 904, 904.0, 904.0, 904.0, 904.0, 1.1061946902654867, 0.19984962665929204, 0.7626693860619469], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7c611d9-d15a-44a2-8ac2-1a9f80f7c74f", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 1.252297794117647, 2.339920343137255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2658a47a-ac4f-40c4-8d0a-0820c3ae886f", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 1.5279231459330145, 2.854926734449761], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00a0c587-1d3a-41d2-aa3b-81df8b9f582c", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 117.23529411764706, 102, 300, 105.0, 152.79999999999987, 300.0, 300.0, 0.07983656984525794, 0.061982493190410215, 0.028379405687181534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb0b7182-71ec-4488-b44b-4ec98ba6199a", 2, 0, 0.0, 1256.0, 201, 2311, 1256.0, 2311.0, 2311.0, 2311.0, 0.05334329074760622, 0.03279257961486144, 0.0331572310164564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a98b575e-0edb-47f2-a8b5-05885c2e15d8", 1, 0, 0.0, 1245.0, 1245, 1245, 1245.0, 1245.0, 1245.0, 1245.0, 0.8032128514056225, 0.14511169678714858, 0.553777610441767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 113.52941176470587, 99, 298, 101.0, 148.39999999999986, 298.0, 298.0, 0.07954704974030227, 0.05911650864489261, 0.039928890201675164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 158.41176470588235, 98, 300, 102.0, 299.2, 300.0, 300.0, 0.07947453308711812, 0.021265646548701528, 0.04532531965124705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 158.5294117647059, 99, 303, 101.0, 300.6, 303.0, 303.0, 0.07947453308711812, 0.021420870246137303, 0.04672233292816905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 147.3529411764706, 99, 303, 101.0, 299.8, 303.0, 303.0, 0.07954779418646003, 0.021440616401819306, 0.04684308583440957], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 17.391304347826086, 0.29282576866764276], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 13.043478260869565, 0.21961932650073207], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 13.043478260869565, 0.21961932650073207], "isController": false}, {"data": ["401/Unauthorized", 13, 56.52173913043478, 0.9516837481698389], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1366, 23, "401/Unauthorized", 13, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 188, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
