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

    var data = {"OkPercent": 99.60876369327073, "KoPercent": 0.39123630672926446};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.803776129467296, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0627e6f4-c927-469d-b27b-a51faae4d0c0"], "isController": false}, {"data": [0.16071428571428573, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/72b7d999-a085-4f05-b5c7-9677ddb10c05"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2a2e928c-ad4b-42f1-a68d-469b5316b94f"], "isController": false}, {"data": [0.875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2811f2da-c59c-413c-bf0e-403c6f532057"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bee0ccac-939c-4d0a-b7e5-6c22e36ef78f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=157407b8-ec17-4fac-b9e7-357bec6247f8"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/04177084-e6d4-41aa-af37-a851676368b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e57c1037-8ad4-4534-947d-ab083efd6563"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cd3fac93-4d9c-44c9-a434-96efe8667b6e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/18fb75af-c037-411d-b975-d8c70a14715e"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a09dce87-bbfa-4430-a2f0-9f690f0d477f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8a66107-c73e-4941-baa6-abfd6569f973"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18fb75af-c037-411d-b975-d8c70a14715e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a910213-b1fb-4f72-a83f-e18ff922cc7e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04177084-e6d4-41aa-af37-a851676368b4"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1acfcae-779f-4f7c-b45a-b2b05a739f58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d164345-aa0e-4a0c-8ca5-e98c9d56dda8"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01e56d3a-b53b-4db9-9a5c-8515e0be7ae1"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/157407b8-ec17-4fac-b9e7-357bec6247f8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0627e6f4-c927-469d-b27b-a51faae4d0c0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bee0ccac-939c-4d0a-b7e5-6c22e36ef78f"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd0cf481-3c95-4a56-9dad-0013ad1dd640"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ef9adfcc-edd7-4048-87c9-137d98c01325"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf46cd86-bcd1-4eb5-90ae-423bd8e1bc6c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a2e928c-ad4b-42f1-a68d-469b5316b94f"], "isController": false}, {"data": [0.3559322033898305, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5535714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.985632183908046, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e57c1037-8ad4-4534-947d-ab083efd6563"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd3fac93-4d9c-44c9-a434-96efe8667b6e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d1acfcae-779f-4f7c-b45a-b2b05a739f58"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf46cd86-bcd1-4eb5-90ae-423bd8e1bc6c"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cd0cf481-3c95-4a56-9dad-0013ad1dd640"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/01e56d3a-b53b-4db9-9a5c-8515e0be7ae1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1278, 5, 0.39123630672926446, 359.9640062597812, 98, 2510, 119.0, 1008.2000000000003, 1216.1, 1657.8300000000008, 5.010448235169584, 697.441601281477, 3.6497495327208145], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0627e6f4-c927-469d-b27b-a51faae4d0c0", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1677.071428571429, 1223, 2181, 1643.5, 2079.6, 2120.45, 2181.0, 0.2597414644780356, 312.55586724370244, 1.27714675160831], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/72b7d999-a085-4f05-b5c7-9677ddb10c05", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 1.341747636554622, 2.5070575105042017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a2e928c-ad4b-42f1-a68d-469b5316b94f", 3, 0, 0.0, 342.6666666666667, 209, 583, 236.0, 583.0, 583.0, 583.0, 0.01576988582602662, 0.02174006070091886, 0.010112849960049623], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 487.08333333333337, 416, 629, 474.0, 602.3000000000001, 629.0, 629.0, 0.0806088656317384, 0.014563125138546488, 0.054788838359072195], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 487.08333333333337, 416, 629, 474.0, 602.3000000000001, 629.0, 629.0, 0.0800913040866588, 0.014469620367218628, 0.054437058246400896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 160.78571428571428, 100, 310, 104.0, 308.5, 310.0, 310.0, 0.09908347783007183, 0.04777239109664178, 0.05531976538447929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 117.92857142857142, 100, 307, 103.5, 208.0, 307.0, 307.0, 0.09908558163236418, 0.07363684338108314, 0.049736317342807805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2811f2da-c59c-413c-bf0e-403c6f532057", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 1.174029181985294, 2.193675321691176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 287.7142857142857, 98, 807, 296.5, 803.0, 807.0, 807.0, 0.09908417908757626, 4.184896607428482, 0.05713098663071326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 245.07142857142858, 98, 1010, 102.0, 1005.5, 1010.0, 1010.0, 0.09908488035500697, 12.759569763717947, 0.05703462839631121], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bee0ccac-939c-4d0a-b7e5-6c22e36ef78f", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=157407b8-ec17-4fac-b9e7-357bec6247f8", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 251.58333333333331, 185, 441, 215.5, 413.4000000000001, 441.0, 441.0, 0.08080155138978669, 0.2032072218911603, 0.05223694044925663], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/04177084-e6d4-41aa-af37-a851676368b4", 3, 0, 0.0, 512.3333333333334, 185, 872, 480.0, 872.0, 872.0, 872.0, 0.021763101387034998, 0.02572324906781382, 0.013956155511868143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 103.23529411764707, 100, 110, 103.0, 106.8, 110.0, 110.0, 0.1266747142367476, 0.09414009524820793, 0.06358476866961744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 148.99999999999997, 99, 306, 103.0, 303.6, 306.0, 306.0, 0.12667943396648212, 0.045088796694411945, 0.07162103567888999], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 1, 0, 0.0, 802.0, 802, 802, 802.0, 802.0, 802.0, 802.0, 1.2468827930174564, 366.6249415523691, 0.711112842892768], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 1, 0, 0.0, 1001.0, 1001, 1001, 1001.0, 1001.0, 1001.0, 1001.0, 0.999000999000999, 898.9028549575426, 0.5687671703296704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 5.726638349514563, 1.791944781553398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 103.83333333333334, 101, 109, 103.5, 107.80000000000001, 109.0, 109.0, 0.062421323123979154, 0.04638928407944154, 0.0313325782087161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 152.66666666666669, 99, 311, 103.0, 308.6, 311.0, 311.0, 0.062422297244575764, 0.024515788289577036, 0.03516334159561795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 185.83333333333331, 101, 903, 103.0, 721.2000000000007, 903.0, 903.0, 0.062421972534332085, 4.696039333970558, 0.036250260091552224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 162.16666666666669, 99, 821, 102.0, 606.5000000000007, 821.0, 821.0, 0.062422297244575764, 1.5449416969241412, 0.03631140793491435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e57c1037-8ad4-4534-947d-ab083efd6563", 1, 0, 0.0, 747.0, 747, 747, 747.0, 747.0, 747.0, 747.0, 1.3386880856760375, 0.241852827978581, 0.9229626840696118], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd3fac93-4d9c-44c9-a434-96efe8667b6e", 3, 0, 0.0, 370.6666666666667, 196, 567, 349.0, 567.0, 567.0, 567.0, 0.019899969486713454, 0.027433714445387853, 0.012761373661727053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 1, 0, 0.0, 113.0, 113, 113, 113.0, 113.0, 113.0, 113.0, 8.849557522123893, 6.576673119469026, 4.969233960176991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 595.8571428571428, 101, 1310, 104.0, 1270.2, 1307.5, 1310.0, 0.09810746037159368, 42.05064410759586, 0.053661641968502836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 189.8235294117647, 99, 1402, 103.0, 516.3999999999992, 1402.0, 1402.0, 0.12667943396648212, 6.737216612983151, 0.0738332684411723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 415.76190476190476, 100, 851, 306.0, 841.2, 850.7, 851.0, 0.09810700203688824, 13.750382500513894, 0.05375719889325958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 137.47058823529412, 98, 703, 102.0, 225.39999999999958, 703.0, 703.0, 0.1266784899923993, 2.2231754804468022, 0.07395642772246978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18fb75af-c037-411d-b975-d8c70a14715e", 3, 0, 0.0, 350.0, 229, 438, 383.0, 438.0, 438.0, 438.0, 0.02251812709230931, 0.026615663890681998, 0.01444033540750304], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 620.9166666666667, 224, 1370, 525.0, 1236.8000000000004, 1370.0, 1370.0, 0.07959618203646832, 0.01438016960619789, 0.05487783644311195], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 308.08333333333337, 206, 1005, 210.5, 825.6000000000006, 1005.0, 1005.0, 0.06238789674803088, 6.308432804660896, 0.13898163131352517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 657.7, 119, 1321, 654.5, 1300.3000000000004, 1320.75, 1321.0, 0.09157257584498595, 0.0562491701235314, 0.04140439708616064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 112.9047619047619, 100, 306, 103.0, 106.0, 285.9999999999997, 306.0, 0.09810700203688824, 0.07290959819342964, 0.049245116256797415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a09dce87-bbfa-4430-a2f0-9f690f0d477f", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.730745852402746, 1.365399742562929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 160.71428571428572, 100, 309, 104.0, 307.6, 308.9, 309.0, 0.0981060853803246, 0.09641806214786923, 0.0520276133592458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8a66107-c73e-4941-baa6-abfd6569f973", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.7963489713216957, 1.487979270573566], "isController": false}, {"data": ["login", 20, 0, 0.0, 2642.7, 1764, 4382, 2549.5, 3826.800000000001, 4357.099999999999, 4382.0, 0.088421629699057, 5.416053644573786, 0.1407406389125908], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18fb75af-c037-411d-b975-d8c70a14715e", 1, 0, 0.0, 724.0, 724, 724, 724.0, 724.0, 724.0, 724.0, 1.3812154696132597, 0.2495359979281768, 0.9522833218232044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 130.76470588235293, 103, 308, 105.0, 307.2, 308.0, 308.0, 0.1275701635899745, 0.10327701720321178, 0.04534720658862375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a910213-b1fb-4f72-a83f-e18ff922cc7e", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 1.5653722426470589, 2.924900428921569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04177084-e6d4-41aa-af37-a851676368b4", 1, 0, 0.0, 685.0, 685, 685, 685.0, 685.0, 685.0, 685.0, 1.4598540145985401, 0.26374315693430656, 1.006500912408759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 720.5714285714287, 205, 1416, 612.0, 1378.4, 1413.8, 1416.0, 0.0980589007130283, 55.942716857550764, 0.20858948545926587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1acfcae-779f-4f7c-b45a-b2b05a739f58", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d164345-aa0e-4a0c-8ca5-e98c9d56dda8", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 1.1960147471910112, 2.234755383895131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 437.28571428571433, 204, 1113, 406.5, 1109.0, 1113.0, 1113.0, 0.09901200166905945, 17.053353103319026, 0.21906129108114034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 1, 0, 0.0, 1114.0, 1114, 1114, 1114.0, 1114.0, 1114.0, 1114.0, 0.8976660682226212, 1073.9206968132853, 2.024131788599641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01e56d3a-b53b-4db9-9a5c-8515e0be7ae1", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 0.8065359933035714, 3.077915736607143], "isController": false}, {"data": ["register", 22, 3, 13.636363636363637, 1163.5454545454545, 296, 2324, 1106.5, 1655.3, 2226.7999999999984, 2324.0, 0.09368200070687328, 0.02992434646158825, 0.04226668391267135], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 342.17647058823525, 204, 1504, 209.0, 628.7999999999993, 1504.0, 1504.0, 0.1265794509430169, 9.092459075746632, 0.2827750613351898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 108.0, 103, 120, 106.0, 117.9, 120.0, 120.0, 0.12253400318588409, 0.09513137942654086, 0.04355700894498223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 369.05882352941177, 205, 614, 405.0, 613.2, 614.0, 614.0, 0.1046727130551502, 0.16222226134621423, 0.23541138492774505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 153.16666666666666, 103, 303, 104.5, 300.3, 303.0, 303.0, 0.06628662335940606, 0.04926183630518361, 0.03327277774095187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 152.91666666666663, 98, 308, 102.5, 306.5, 308.0, 308.0, 0.066289552766484, 0.03433160105842319, 0.036877879452448296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 320.25, 98, 1389, 104.0, 1306.5000000000002, 1389.0, 1389.0, 0.06608329799712537, 9.925154211571186, 0.037903245791319956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 242.41666666666666, 102, 589, 107.0, 588.1, 589.0, 589.0, 0.06617805204903793, 3.257954981001384, 0.03802222065968488], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1138.267857142857, 790, 1745, 1019.5, 1650.2, 1699.75, 1745.0, 0.2599428125812321, 310.9819745905901, 0.513285514686769], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, 13.636363636363637, 1163.5454545454545, 296, 2324, 1106.5, 1655.3, 2226.7999999999984, 2324.0, 0.09175306747186934, 0.029308197510989516, 0.0413964034882848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 122.1, 100, 306, 102.0, 285.70000000000005, 306.0, 306.0, 0.049519904525624076, 0.013347161766672114, 0.02916064690327277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 182.89999999999998, 100, 306, 104.0, 306.0, 306.0, 306.0, 0.04951916887026968, 0.013346963484564874, 0.029111855136623385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/157407b8-ec17-4fac-b9e7-357bec6247f8", 3, 0, 0.0, 313.3333333333333, 205, 455, 280.0, 455.0, 455.0, 455.0, 0.05150479853039642, 0.033112622753103164, 0.033028793328411764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0627e6f4-c927-469d-b27b-a51faae4d0c0", 3, 0, 0.0, 364.0, 205, 602, 285.0, 602.0, 602.0, 602.0, 0.027465987951586616, 0.027546454713163533, 0.017613280034057825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bee0ccac-939c-4d0a-b7e5-6c22e36ef78f", 3, 0, 0.0, 1050.0, 207, 2510, 433.0, 2510.0, 2510.0, 2510.0, 0.021131522596641496, 0.024976744319142343, 0.013551139165163982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 202.83333333333334, 100, 1106, 102.5, 865.1000000000008, 1106.0, 1106.0, 0.11240270141159059, 8.456117063315505, 0.06527552712183517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 177.16666666666666, 99, 791, 102.5, 645.5000000000005, 791.0, 791.0, 0.11218832680459598, 2.7766428285949347, 0.0652605924478558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd0cf481-3c95-4a56-9dad-0013ad1dd640", 1, 0, 0.0, 926.0, 926, 926, 926.0, 926.0, 926.0, 926.0, 1.0799136069114472, 0.1951015793736501, 0.7445498110151187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef9adfcc-edd7-4048-87c9-137d98c01325", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.790435488861386, 1.4769299195544554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 142.7, 98, 306, 104.0, 304.7, 306.0, 306.0, 0.04952088543343155, 0.013250705672617427, 0.02824237997375393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 138.83333333333334, 103, 311, 105.0, 309.8, 311.0, 311.0, 0.11240059572315733, 0.08353208334504174, 0.05641983027510046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 144.5, 99, 310, 104.0, 308.8, 310.0, 310.0, 0.04951916887026968, 0.03680086670925315, 0.024856301561834587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 169.24999999999997, 101, 306, 103.5, 306.0, 306.0, 306.0, 0.11218832680459598, 0.04406094280265139, 0.0631972329216645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 151.29999999999998, 103, 316, 113.5, 314.6, 316.0, 316.0, 0.0471424597992674, 0.037106272068564, 0.016757671256770836], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 549.0, 433, 1162, 484.5, 994.0000000000006, 1162.0, 1162.0, 0.08048181781599174, 0.014540172164021944, 0.05478108107201781], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1506.5000000000002, 1001, 2326, 1457.0, 2221.7000000000003, 2321.25, 2326.0, 0.08955397642043801, 0.04635117920198451, 0.041191330951197556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 329.6, 203, 612, 213.0, 611.3, 612.0, 612.0, 0.04949367965710779, 0.07670553673420905, 0.11131244555695238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf46cd86-bcd1-4eb5-90ae-423bd8e1bc6c", 3, 0, 0.0, 357.6666666666667, 236, 489, 348.0, 489.0, 489.0, 489.0, 0.034034442856170445, 0.027664063740839063, 0.021825472795135345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a2e928c-ad4b-42f1-a68d-469b5316b94f", 1, 0, 0.0, 1370.0, 1370, 1370, 1370.0, 1370.0, 1370.0, 1370.0, 0.7299270072992701, 0.13187157846715328, 0.5032504562043795], "isController": false}, {"data": ["addBook", 59, 2, 3.389830508474576, 1070.542372881356, 525, 2031, 864.0, 1865.0, 1957.0, 2031.0, 0.2779125470449417, 96.83243452127209, 1.0096363746897037], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 181.08928571428572, 100, 448, 105.0, 410.6, 414.2, 448.0, 0.260818130586049, 0.1938306614999837, 0.12607907679696706], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 638.5714285714284, 491, 933, 602.0, 854.8000000000001, 907.6, 933.0, 0.26062876690014664, 76.63351115816909, 0.13107794429060107], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 153.76785714285714, 99, 418, 105.0, 308.0, 309.9, 418.0, 0.26122936404644287, 0.46225352309780704, 0.12704318681164894], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 955.1964285714287, 683, 1378, 912.5, 1258.2, 1314.1499999999999, 1378.0, 0.2604893478463113, 234.38877308354267, 0.13075344218066798], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 122.94117647058825, 104, 330, 110.0, 161.19999999999985, 330.0, 330.0, 0.10901698741174433, 0.0814433548535004, 0.038752132244018495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 2, 1.1494252873563218, 163.51724137931043, 101, 518, 109.0, 304.5, 348.5, 495.5, 0.7447227405796853, 1.575689470412251, 0.3593039784886408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 107.08333333333333, 103, 118, 105.5, 115.9, 118.0, 118.0, 0.06665000416562526, 0.051614700491543784, 0.023691993668249606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e57c1037-8ad4-4534-947d-ab083efd6563", 3, 0, 0.0, 607.3333333333333, 219, 1162, 441.0, 1162.0, 1162.0, 1162.0, 0.01803068823136979, 0.0248567593293786, 0.01156264837753857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 108.57142857142857, 103, 129, 106.5, 124.0, 129.0, 129.0, 0.09373702746494904, 0.07606979474938735, 0.033320583981681105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd3fac93-4d9c-44c9-a434-96efe8667b6e", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1acfcae-779f-4f7c-b45a-b2b05a739f58", 3, 0, 0.0, 316.0, 222, 494, 232.0, 494.0, 494.0, 494.0, 0.0453850925099469, 0.02917824144112797, 0.029104372475454228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 508.08333333333337, 207, 1496, 215.5, 1412.6000000000004, 1496.0, 1496.0, 0.06604474531495087, 13.254043090756488, 0.14571981892732327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf46cd86-bcd1-4eb5-90ae-423bd8e1bc6c", 1, 0, 0.0, 589.0, 589, 589, 589.0, 589.0, 589.0, 589.0, 1.697792869269949, 0.30673015704584045, 1.1705485993208828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 393.75, 208, 1213, 214.0, 1033.6000000000006, 1213.0, 1213.0, 0.11207830537602272, 11.332942688875294, 0.24967704519557665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 107.5, 102, 117, 106.0, 116.7, 117.0, 117.0, 0.06509639691443078, 0.05397152439487474, 0.02313973484067657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd0cf481-3c95-4a56-9dad-0013ad1dd640", 3, 0, 0.0, 298.3333333333333, 222, 449, 224.0, 449.0, 449.0, 449.0, 0.030289568272686886, 0.024955370214248214, 0.0194239744457009], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 119.33333333333334, 104, 310, 106.0, 136.0, 292.89999999999975, 310.0, 0.0939164501370733, 0.07291365025290358, 0.033384363134662774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01e56d3a-b53b-4db9-9a5c-8515e0be7ae1", 3, 0, 0.0, 397.6666666666667, 197, 560, 436.0, 560.0, 560.0, 560.0, 0.08529027122306249, 0.03859162662762267, 0.05469460752260192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 139.64705882352942, 100, 307, 103.0, 307.0, 307.0, 307.0, 0.10473913793528353, 0.07783836325073318, 0.05257413759642162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 137.7058823529412, 98, 312, 103.0, 306.4, 312.0, 312.0, 0.1047410739040695, 0.028026420165737344, 0.05973514371091463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 202.47058823529412, 100, 412, 108.0, 331.99999999999994, 412.0, 412.0, 0.1047410739040695, 0.028230992575706233, 0.061576295400634605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 185.58823529411765, 101, 307, 103.0, 306.2, 307.0, 307.0, 0.1047397832502603, 0.028230644704171727, 0.0616778215819404], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 60.0, 0.2347417840375587], "isController": false}, {"data": ["401/Unauthorized", 2, 40.0, 0.1564945226917058], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1278, 5, "406/Not Acceptable", 3, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
