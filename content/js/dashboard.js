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

    var data = {"OkPercent": 98.66457187745483, "KoPercent": 1.335428122545169};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8198653198653199, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ec6c169-d081-41de-8b25-4cbb3c8397ba"], "isController": false}, {"data": [0.41818181818181815, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bbb25cd3-570f-42e2-a6d5-d47fdee61b71"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6bb89c1-d660-42f3-b193-91e8f8f182f0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e9bb728-6dc9-4b57-bfd9-690f4fe40c04"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f480c04f-e945-44af-91df-1bec4006fbf4"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48d3266c-9b7d-4e73-96be-33c863921b91"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=858d2c7b-f2f2-4445-b2b3-7ca7939d1db2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3504bf11-bb87-4e8f-831c-161f56557c65"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7ba54b02-cc6b-4d90-affd-c10cdf878060"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=708e04df-e924-469f-93fd-729421253d9a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/634362d2-c183-40c2-912d-6eb53ca38461"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce5ef572-2173-48dc-abc1-6776b757b1bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d6419773-cebc-4140-b8f2-a274432451fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1b4c2d8-fc2f-4185-a32c-9b6c61733453"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e6bb89c1-d660-42f3-b193-91e8f8f182f0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c7cf76f8-d498-4085-a0d3-0e6fa7221df1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bbb25cd3-570f-42e2-a6d5-d47fdee61b71"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dce67b60-08ba-4668-b3b8-b85f6d523c66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/858d2c7b-f2f2-4445-b2b3-7ca7939d1db2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ce5ef572-2173-48dc-abc1-6776b757b1bf"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/39c65dbe-b0c4-418a-97fa-bdb1bc22ad18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1b4c2d8-fc2f-4185-a32c-9b6c61733453"], "isController": false}, {"data": [0.38392857142857145, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/48d3266c-9b7d-4e73-96be-33c863921b91"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9491017964071856, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3504bf11-bb87-4e8f-831c-161f56557c65"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d6419773-cebc-4140-b8f2-a274432451fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dce67b60-08ba-4668-b3b8-b85f6d523c66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7cf76f8-d498-4085-a0d3-0e6fa7221df1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/708e04df-e924-469f-93fd-729421253d9a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8ec6c169-d081-41de-8b25-4cbb3c8397ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5e9bb728-6dc9-4b57-bfd9-690f4fe40c04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1273, 17, 1.335428122545169, 301.53809897879023, 77, 2581, 99.0, 846.0, 1004.4999999999998, 1518.0599999999997, 5.038251928427535, 722.9631401582914, 3.6746465270989086], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ec6c169-d081-41de-8b25-4cbb3c8397ba", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1306.0909090909092, 1026, 1679, 1280.0, 1546.2, 1607.0, 1679.0, 0.24158514998045358, 290.70868489005676, 1.1878722950699059], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bbb25cd3-570f-42e2-a6d5-d47fdee61b71", 3, 0, 0.0, 319.6666666666667, 174, 554, 231.0, 554.0, 554.0, 554.0, 0.027847396268448902, 0.02792898043720412, 0.017857868049754012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6bb89c1-d660-42f3-b193-91e8f8f182f0", 1, 0, 0.0, 796.0, 796, 796, 796.0, 796.0, 796.0, 796.0, 1.256281407035176, 0.22696490263819094, 0.8661471419597989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e9bb728-6dc9-4b57-bfd9-690f4fe40c04", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 0.2523241096368715, 0.9629233589385475], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 572.0714285714286, 102, 1072, 531.5, 982.5, 1072.0, 1072.0, 0.07423314509928683, 0.014017098478220526, 0.05020161423950794], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 572.0714285714286, 102, 1072, 531.5, 982.5, 1072.0, 1072.0, 0.07343838519482154, 0.013867027673157221, 0.04966414233145891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 98.1764705882353, 79, 239, 80.0, 235.0, 239.0, 239.0, 0.10611205432937182, 0.03776828404324378, 0.05999281012808349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 89.5294117647059, 78, 233, 80.0, 116.9999999999999, 233.0, 233.0, 0.10611006734868392, 0.07885718872299655, 0.05326227989963236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 153.99999999999997, 78, 695, 80.0, 346.1999999999997, 695.0, 695.0, 0.10611139199420756, 1.8622281090637853, 0.06194910827419184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 152.94117647058823, 77, 1016, 80.0, 394.3999999999994, 1016.0, 1016.0, 0.10611337902450595, 5.643448171806924, 0.06184664197970114], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 191.35714285714283, 80, 298, 185.5, 275.5, 298.0, 298.0, 0.07442691277165824, 0.13482090525719814, 0.04811064457693616], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 81.65, 79, 84, 82.0, 84.0, 84.0, 84.0, 0.1105522082803604, 0.08215842822397877, 0.05549202642197778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 117.94999999999999, 77, 237, 80.0, 233.9, 236.85, 237.0, 0.11045757048573718, 0.03785113426117693, 0.06253149766658382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f480c04f-e945-44af-91df-1bec4006fbf4", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.2096058238636362, 2.260150331439394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 591.8, 469, 627, 621.0, 627.0, 627.0, 627.0, 0.0750198802682711, 22.058335693333735, 0.04278477546549836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 780.8, 702, 862, 777.0, 862.0, 862.0, 862.0, 0.07484357692422837, 67.34438207739575, 0.04261113803400892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 143.0, 79, 238, 86.0, 238.0, 238.0, 238.0, 0.07545233675886942, 0.13351526778034317, 0.0417787841233193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 94.45454545454545, 78, 234, 81.0, 203.6000000000001, 234.0, 234.0, 0.07915947035118019, 0.05882847357153137, 0.03973434351611974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 122.18181818181819, 79, 238, 80.0, 237.6, 238.0, 238.0, 0.07916117935764301, 0.021181799945306824, 0.04514661010240578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 79.45454545454545, 78, 81, 79.0, 80.8, 81.0, 81.0, 0.07916117935764301, 0.02133641162373972, 0.04653811520830185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 108.1818181818182, 78, 238, 80.0, 237.6, 238.0, 238.0, 0.0791617490428625, 0.02133656517170903, 0.04661575651645125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 80.6, 79, 82, 81.0, 82.0, 82.0, 82.0, 0.07563495545101123, 0.056209180759980035, 0.042470800180011196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 552.8333333333334, 77, 1094, 776.0, 1021.1000000000001, 1094.0, 1094.0, 0.1101159888415798, 55.059057823893944, 0.059478883729750895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 140.05, 78, 784, 80.5, 247.00000000000003, 757.1999999999996, 784.0, 0.1105522082803604, 5.002060978179758, 0.06451757780111658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 378.7777777777778, 79, 712, 507.5, 699.4, 712.0, 712.0, 0.11011464157684167, 18.000613468550036, 0.05958568983764208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 130.35, 77, 616, 81.0, 236.70000000000002, 597.0499999999997, 616.0, 0.11045818053285025, 1.6522019665698318, 0.0645705731122697], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 587.2857142857143, 244, 1660, 451.0, 1228.0, 1660.0, 1660.0, 0.07350354654612085, 0.013879331787133728, 0.050302964227398966], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48d3266c-9b7d-4e73-96be-33c863921b91", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=858d2c7b-f2f2-4445-b2b3-7ca7939d1db2", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 232.1818181818182, 159, 473, 163.0, 442.4000000000001, 473.0, 473.0, 0.07911392405063292, 0.12261113034018987, 0.17792906942246836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3504bf11-bb87-4e8f-831c-161f56557c65", 3, 0, 0.0, 323.0, 285, 386, 298.0, 386.0, 386.0, 386.0, 0.02366191850835266, 0.027967586622340005, 0.01517382143927563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 537.5000000000001, 175, 1544, 441.5, 1039.1, 1476.049999999999, 1544.0, 0.10288306404470737, 0.06319672586339935, 0.04651841665302686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 90.5, 79, 240, 80.0, 110.4000000000002, 240.0, 240.0, 0.11011127355922457, 0.08183074138532216, 0.05527069786078265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 141.66666666666669, 78, 243, 80.5, 240.3, 243.0, 243.0, 0.11000562250959493, 0.12122581404160658, 0.057604940780306556], "isController": false}, {"data": ["login", 22, 0, 0.0, 2530.5000000000005, 1451, 3874, 2413.5, 3668.5, 3852.3999999999996, 3874.0, 0.10325439065829367, 28.21692519131396, 0.19470199374841599], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 102.69999999999997, 80, 256, 87.0, 230.6000000000003, 255.45, 256.0, 0.11724497751827556, 0.09491805308852583, 0.041676925602199516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ba54b02-cc6b-4d90-affd-c10cdf878060", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 1.5887360074626864, 2.96855565920398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=708e04df-e924-469f-93fd-729421253d9a", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/634362d2-c183-40c2-912d-6eb53ca38461", 1, 0, 0.0, 345.0, 345, 345, 345.0, 345.0, 345.0, 345.0, 2.898550724637681, 0.9256114130434784, 1.7295063405797102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce5ef572-2173-48dc-abc1-6776b757b1bf", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.2937627032520325, 1.1210619918699187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6419773-cebc-4140-b8f2-a274432451fa", 3, 0, 0.0, 299.6666666666667, 246, 400, 253.0, 400.0, 400.0, 400.0, 0.05169027189083014, 0.032760728962059345, 0.03314773295082532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1b4c2d8-fc2f-4185-a32c-9b6c61733453", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 654.1666666666666, 160, 1191, 858.0, 1107.3000000000002, 1191.0, 1191.0, 0.10994985065145287, 73.15253709280378, 0.2316510688041732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6bb89c1-d660-42f3-b193-91e8f8f182f0", 3, 0, 0.0, 339.3333333333333, 182, 425, 411.0, 425.0, 425.0, 425.0, 0.03860010293360782, 0.032179317582346885, 0.024753321217189914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 282.1176470588235, 159, 1249, 163.0, 520.9999999999993, 1249.0, 1249.0, 0.10605644698425373, 7.6182500140368825, 0.2369272269514386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 638.4285714285714, 79, 945, 788.0, 945.0, 945.0, 945.0, 0.07435891988357518, 63.54791303724319, 0.13384190629713824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7cf76f8-d498-4085-a0d3-0e6fa7221df1", 3, 0, 0.0, 295.6666666666667, 170, 413, 304.0, 413.0, 413.0, 413.0, 0.03164723877841658, 0.026383000817553667, 0.020294616013502822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bbb25cd3-570f-42e2-a6d5-d47fdee61b71", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 889.1739130434783, 148, 1678, 993.0, 1278.4, 1601.599999999999, 1678.0, 0.0960209743206516, 0.030397944316184543, 0.04332196302357524], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dce67b60-08ba-4668-b3b8-b85f6d523c66", 3, 0, 0.0, 280.0, 196, 412, 232.0, 412.0, 412.0, 412.0, 0.03840196618066845, 0.024688764064720117, 0.024626260864556267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 86.82352941176471, 81, 110, 83.0, 110.0, 110.0, 110.0, 0.08180510175111037, 0.06351079676966088, 0.02907915726309002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 261.25, 160, 867, 170.5, 330.0, 840.1999999999996, 867.0, 0.11040878853956776, 6.766921225054514, 0.2468994969499572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 407.06666666666666, 161, 1251, 316.0, 1068.6000000000001, 1251.0, 1251.0, 0.1549666821633349, 37.27093987292732, 0.34059376452812645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/858d2c7b-f2f2-4445-b2b3-7ca7939d1db2", 3, 0, 0.0, 352.0, 164, 513, 379.0, 513.0, 513.0, 513.0, 0.04267061132762495, 0.035572732945979006, 0.02736364072767616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 81.33333333333333, 79, 84, 81.0, 84.0, 84.0, 84.0, 0.05784582160348617, 0.04298893578149705, 0.029035890922062393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 96.66666666666667, 79, 232, 80.0, 232.0, 232.0, 232.0, 0.05778936418857312, 0.01546316971452054, 0.032957996763795606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 97.22222222222223, 78, 232, 80.0, 232.0, 232.0, 232.0, 0.05784656519950637, 0.015591457026429452, 0.034007453369241054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 114.22222222222223, 80, 233, 81.0, 233.0, 233.0, 233.0, 0.05778936418857312, 0.015576039566451347, 0.03403026035713827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 1.2086962090163935, 2.5334592725409837], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 903.9454545454545, 621, 1318, 862.0, 1209.6, 1264.3999999999999, 1318.0, 0.24084672952036468, 288.136420377166, 0.47557821004900136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 889.1739130434783, 148, 1678, 993.0, 1278.4, 1601.599999999999, 1678.0, 0.09419512314988492, 0.02981992349717824, 0.04249819032738948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 117.5, 77, 234, 79.5, 234.0, 234.0, 234.0, 0.03005710850616171, 0.008101330027051396, 0.01769964495040577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 80.25, 79, 84, 79.0, 84.0, 84.0, 84.0, 0.030056656798064352, 0.008101208277603283, 0.01767002675042455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce5ef572-2173-48dc-abc1-6776b757b1bf", 3, 0, 0.0, 246.33333333333331, 170, 393, 176.0, 393.0, 393.0, 393.0, 0.020479772811053617, 0.024206398137023334, 0.013133187642505087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 143.58823529411765, 78, 864, 80.0, 359.19999999999953, 864.0, 864.0, 0.08154689666089443, 4.336924232439835, 0.04752842448997213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 138.88235294117646, 78, 619, 80.0, 313.39999999999975, 619.0, 619.0, 0.08154728783314466, 1.4311342897950765, 0.04760828850231211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 81.94117647058825, 80, 94, 80.0, 90.0, 94.0, 94.0, 0.08154650549239699, 0.06060243230440831, 0.040932523264738334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 118.5, 79, 235, 80.0, 235.0, 235.0, 235.0, 0.030056430949106948, 0.008042443437554008, 0.017141558275662556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 98.23529411764706, 78, 241, 80.0, 234.6, 241.0, 241.0, 0.08154689666089443, 0.02902484901831927, 0.046104351846077835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 119.0, 79, 234, 81.5, 234.0, 234.0, 234.0, 0.030055527587217384, 0.022336187982297296, 0.015086465995927478], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 440.8571428571429, 79, 765, 427.0, 659.5, 765.0, 765.0, 0.07430918992367384, 0.013886322531077166, 0.05057441169679728], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 122.5, 82, 240, 84.0, 240.0, 240.0, 240.0, 0.030687319232510144, 0.02415427666152654, 0.01090838300843134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1538.1818181818182, 806, 2581, 1490.5, 2235.6, 2531.3499999999995, 2581.0, 0.10265167952145654, 0.05313026381481637, 0.047215762748638694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 239.25, 159, 469, 164.5, 469.0, 469.0, 469.0, 0.030037471746003137, 0.046552214512604474, 0.0675549779600051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39c65dbe-b0c4-418a-97fa-bdb1bc22ad18", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 0.44290698682385576, 0.8275723821081831], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1b4c2d8-fc2f-4185-a32c-9b6c61733453", 3, 0, 0.0, 278.0, 169, 476, 189.0, 476.0, 476.0, 476.0, 0.0422267576887888, 0.02764258128650855, 0.02707900802308396], "isController": false}, {"data": ["addBook", 56, 8, 14.285714285714286, 882.0357142857142, 410, 2044, 695.0, 1512.3000000000002, 1698.6499999999996, 2044.0, 0.28008402520756226, 96.84430719840952, 1.01587116760028], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 138.52727272727267, 78, 339, 81.0, 322.4, 327.0, 339.0, 0.2419081716580386, 0.17977745960133532, 0.11693803219797765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48d3266c-9b7d-4e73-96be-33c863921b91", 3, 0, 0.0, 417.66666666666663, 206, 765, 282.0, 765.0, 765.0, 765.0, 0.029912356794591845, 0.024936701090803943, 0.019182077762156878], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 521.4727272727274, 387, 779, 471.0, 707.6, 761.5999999999999, 779.0, 0.24149710642557937, 71.00816774773212, 0.12145606426677087], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 141.16363636363639, 78, 242, 84.0, 238.8, 241.2, 242.0, 0.24222032360635234, 0.42861643200655314, 0.11779855581637057], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 760.890909090909, 540, 1001, 766.0, 936.4, 945.2, 1001.0, 0.24124076705791533, 217.06886625474806, 0.12109155690211766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 84.33333333333333, 81, 90, 83.0, 89.4, 90.0, 90.0, 0.15045739046701975, 0.11240224971413096, 0.05348290051757342], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 8, 4.790419161676646, 138.28742514970068, 79, 754, 87.0, 261.00000000000017, 348.0, 549.999999999998, 0.7049596231209871, 1.566709772450009, 0.3374496212425019], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 103.66666666666667, 82, 259, 84.0, 259.0, 259.0, 259.0, 0.05649646583219294, 0.043751657622000985, 0.020082728088787336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 110.52941176470588, 80, 263, 91.0, 242.99999999999997, 263.0, 263.0, 0.10981770261366132, 0.08911963952339118, 0.03903676147594993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 197.0, 160, 315, 163.0, 315.0, 315.0, 315.0, 0.05775895263765884, 0.08951509554293416, 0.12990123820754718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3504bf11-bb87-4e8f-831c-161f56557c65", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 254.94117647058823, 160, 945, 164.0, 456.99999999999955, 945.0, 945.0, 0.08151522416686646, 5.855404129705106, 0.18210280058738912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d6419773-cebc-4140-b8f2-a274432451fa", 1, 0, 0.0, 1660.0, 1660, 1660, 1660.0, 1660.0, 1660.0, 1660.0, 0.6024096385542169, 0.10883377259036145, 0.4153332078313253], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dce67b60-08ba-4668-b3b8-b85f6d523c66", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 112.54545454545455, 80, 238, 85.0, 237.6, 238.0, 238.0, 0.08157877172034797, 0.06763708710017131, 0.028998704009967444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7cf76f8-d498-4085-a0d3-0e6fa7221df1", 1, 0, 0.0, 742.0, 742, 742, 742.0, 742.0, 742.0, 742.0, 1.3477088948787064, 0.24348256401617252, 0.9291821091644205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/708e04df-e924-469f-93fd-729421253d9a", 3, 0, 0.0, 566.6666666666666, 208, 1048, 444.0, 1048.0, 1048.0, 1048.0, 0.0663907761081727, 0.030040097262487, 0.0425748141058269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 86.83333333333331, 80, 109, 84.0, 100.9, 109.0, 109.0, 0.11978040259524204, 0.09299357428048577, 0.04257818998502745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ec6c169-d081-41de-8b25-4cbb3c8397ba", 3, 0, 0.0, 276.3333333333333, 171, 441, 217.0, 441.0, 441.0, 441.0, 0.025955598622622898, 0.026031640415462617, 0.0166447035438044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e9bb728-6dc9-4b57-bfd9-690f4fe40c04", 3, 0, 0.0, 291.3333333333333, 177, 485, 212.0, 485.0, 485.0, 485.0, 0.0655580079106663, 0.029023076418784554, 0.04204077981250409], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 91.80000000000001, 77, 241, 81.0, 151.60000000000005, 241.0, 241.0, 0.1550964700043427, 0.11526212272783672, 0.07785115779514859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 111.93333333333334, 77, 239, 80.0, 238.4, 239.0, 239.0, 0.15509486635992348, 0.08808903737786279, 0.08584743188750452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 313.20000000000005, 77, 1158, 235.0, 982.2, 1158.0, 1158.0, 0.15509486635992348, 27.944369006229643, 0.0885131249030657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 230.8, 79, 624, 234.0, 619.8, 624.0, 624.0, 0.1550932627486662, 9.153955750599694, 0.08866366798151289], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 29.41176470588235, 0.3927729772191673], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.07855459544383346], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.07855459544383346], "isController": false}, {"data": ["401/Unauthorized", 10, 58.8235294117647, 0.7855459544383346], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1273, 17, "401/Unauthorized", 10, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
