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

    var data = {"OkPercent": 98.5474006116208, "KoPercent": 1.452599388379205};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7876397107166337, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95a22b35-b83a-49e4-8633-44fe1eea0039"], "isController": false}, {"data": [0.10909090909090909, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f615e13a-85c4-410c-babe-3a1f00370f05"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5fac6bf9-1607-46e9-9bb9-4133b32be47f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5de9568c-6220-4153-84dd-bf58392f9fdc"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/392d40f2-f164-47d1-af4b-b6608eecd7ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4360cc4e-181c-41d8-9041-4290ec7abb33"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7c0bb5fc-5586-4424-92b3-c416c6267ddc"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/afd0fe91-5e08-4a22-89e8-15e9e34c43e5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0efbddd7-bd97-48bd-a094-6189d4f9d6ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b683e9a-d6ec-43da-928d-168f8db9c0d4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b63e4e0-ca7e-4218-99df-8f035357f7c8"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a9c4635-4dcd-4f55-8236-e9614b04f296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92d6d2ac-c8bf-475e-84cc-7362ed5a1259"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4245548-c111-4f88-889b-0a26d624fa74"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f615e13a-85c4-410c-babe-3a1f00370f05"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c3662dc1-f831-4fdb-966f-4bcd9b74a2de"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=129dc20d-af0c-4858-896e-cfebc127f904"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.41818181818181815, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95a22b35-b83a-49e4-8633-44fe1eea0039"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5de9568c-6220-4153-84dd-bf58392f9fdc"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4360cc4e-181c-41d8-9041-4290ec7abb33"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=392d40f2-f164-47d1-af4b-b6608eecd7ad"], "isController": false}, {"data": [0.31666666666666665, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/adddb89a-0096-4d30-b93b-18a5ffad45d9"], "isController": false}, {"data": [0.509090909090909, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9342857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=adddb89a-0096-4d30-b93b-18a5ffad45d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c0bb5fc-5586-4424-92b3-c416c6267ddc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92d6d2ac-c8bf-475e-84cc-7362ed5a1259"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0efbddd7-bd97-48bd-a094-6189d4f9d6ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b63e4e0-ca7e-4218-99df-8f035357f7c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/129dc20d-af0c-4858-896e-cfebc127f904"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d4245548-c111-4f88-889b-0a26d624fa74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1308, 19, 1.452599388379205, 358.84021406727834, 100, 2150, 121.0, 1002.0, 1206.1, 1526.3700000000006, 5.0991170107011285, 721.5228984233379, 3.7231466727091984], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95a22b35-b83a-49e4-8633-44fe1eea0039", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1685.7454545454548, 1231, 2608, 1633.0, 2045.3999999999999, 2106.7999999999993, 2608.0, 0.2537005687505478, 305.287304542451, 1.24744371451075], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f615e13a-85c4-410c-babe-3a1f00370f05", 3, 0, 0.0, 307.6666666666667, 187, 416, 320.0, 416.0, 416.0, 416.0, 0.019914368216668327, 0.023538109047761293, 0.012770607222277538], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 553.769230769231, 105, 915, 497.0, 876.5999999999999, 915.0, 915.0, 0.09207777030137762, 0.01744442132662818, 0.06224518141091476], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 553.769230769231, 105, 915, 497.0, 876.5999999999999, 915.0, 915.0, 0.08876870971266251, 0.016817509457281766, 0.060008234578143776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 125.76470588235296, 100, 304, 102.0, 300.8, 304.0, 304.0, 0.0872403317185319, 0.03105130372978077, 0.04932326199297972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 140.52941176470588, 101, 306, 104.0, 302.8, 306.0, 306.0, 0.08723898864353637, 0.06483288120872185, 0.043789882971462586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 221.05882352941174, 100, 919, 103.0, 428.59999999999957, 919.0, 919.0, 0.08715043703380924, 1.52946814202958, 0.050879474470048446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 221.29411764705884, 100, 907, 104.0, 426.1999999999996, 907.0, 907.0, 0.08715088381249231, 4.634962155049112, 0.050794627019849894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5fac6bf9-1607-46e9-9bb9-4133b32be47f", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.5641977694346291, 1.0542043948763251], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5de9568c-6220-4153-84dd-bf58392f9fdc", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 244.84615384615384, 103, 405, 212.0, 383.4, 405.0, 405.0, 0.09217504750560142, 0.19301920254403132, 0.05958280376995944], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 105.07692307692308, 102, 114, 104.0, 112.8, 114.0, 114.0, 0.07199623404314236, 0.053505013776202474, 0.036138734666186695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 117.84615384615384, 101, 302, 103.0, 222.79999999999993, 302.0, 302.0, 0.07200141787407506, 0.027584677821347867, 0.040598155240595506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 720.5, 603, 805, 751.5, 805.0, 805.0, 805.0, 0.06363414608278802, 18.710551800846336, 0.03629134893784004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1068.3333333333333, 894, 1211, 1101.5, 1211.0, 1211.0, 1211.0, 0.06323044335079196, 56.894864074306305, 0.03599936374366378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/392d40f2-f164-47d1-af4b-b6608eecd7ad", 3, 0, 0.0, 420.33333333333337, 199, 711, 351.0, 711.0, 711.0, 711.0, 0.032331070158422244, 0.0262795189406186, 0.020733140694040305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 204.83333333333334, 103, 311, 204.0, 311.0, 311.0, 311.0, 0.06384201230022771, 0.1129704358281373, 0.035350020482645614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 116.75, 101, 305, 103.5, 173.40000000000015, 305.0, 305.0, 0.09573385986956261, 0.07114596421946988, 0.04805391012983905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 140.6875, 102, 307, 102.5, 307.0, 307.0, 307.0, 0.09573443268373531, 0.04359001878788241, 0.05359351907807742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 265.875, 101, 1207, 103.5, 1063.5000000000002, 1207.0, 1207.0, 0.09573500550476281, 10.790393908411518, 0.055253308841127766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 202.6875, 101, 809, 103.0, 664.8000000000002, 809.0, 809.0, 0.09573500550476281, 3.541236918709014, 0.055346800057441005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4360cc4e-181c-41d8-9041-4290ec7abb33", 3, 0, 0.0, 315.0, 194, 432, 319.0, 432.0, 432.0, 432.0, 0.020961430967020682, 0.024775701771240916, 0.013442063478200112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 137.16666666666666, 102, 308, 103.5, 308.0, 308.0, 308.0, 0.06397884432880861, 0.047546777865452486, 0.035925620594789986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 180.46153846153845, 100, 714, 102.0, 551.5999999999999, 714.0, 714.0, 0.07200181666122037, 5.001557082555622, 0.041853219450459986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 695.5555555555557, 100, 1419, 1004.5, 1327.2, 1419.0, 1419.0, 0.08032020990348189, 40.16088061349022, 0.04338476615663333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 158.0769230769231, 101, 510, 103.0, 471.2, 510.0, 510.0, 0.07200181666122037, 1.646446589190866, 0.04192353372454321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 513.2222222222221, 101, 919, 605.0, 910.0, 919.0, 919.0, 0.08031985149751901, 13.13001232128833, 0.04346300991950166], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 550.1538461538461, 110, 1149, 469.0, 1028.1999999999998, 1149.0, 1149.0, 0.08839027706952235, 0.016745814210436853, 0.060456240438551766], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7c0bb5fc-5586-4424-92b3-c416c6267ddc", 3, 0, 0.0, 256.6666666666667, 194, 365, 211.0, 365.0, 365.0, 365.0, 0.10920607185759529, 0.04941290360744057, 0.07003123748680426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 396.375, 205, 1309, 209.5, 1176.7, 1309.0, 1309.0, 0.09567432459906479, 14.437211201819007, 0.2121139017783465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afd0fe91-5e08-4a22-89e8-15e9e34c43e5", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 1.02680365755627, 1.9185842041800643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0efbddd7-bd97-48bd-a094-6189d4f9d6ec", 1, 0, 0.0, 847.0, 847, 847, 847.0, 847.0, 847.0, 847.0, 1.1806375442739079, 0.21329877508854783, 0.8139942443919717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b683e9a-d6ec-43da-928d-168f8db9c0d4", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 1.6376201923076923, 3.059895833333333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b63e4e0-ca7e-4218-99df-8f035357f7c8", 1, 0, 0.0, 839.0, 839, 839, 839.0, 839.0, 839.0, 839.0, 1.1918951132300357, 0.21533261323003577, 0.8217558104886771], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 558.6521739130434, 127, 1344, 563.0, 1148.0000000000005, 1329.6, 1344.0, 0.0973215419117336, 0.05978051744382854, 0.0440037831104811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 105.22222222222223, 102, 118, 104.0, 109.9, 118.0, 118.0, 0.08031411743708727, 0.059686565790647864, 0.04031392222916295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 171.33333333333331, 102, 312, 104.5, 305.7, 312.0, 312.0, 0.08031985149751901, 0.08851219746189269, 0.04205985279156106], "isController": false}, {"data": ["login", 23, 0, 0.0, 2366.2173913043475, 1343, 3596, 2363.0, 3355.8000000000006, 3584.6, 3596.0, 0.09913237620305758, 31.073891872438182, 0.1924520056527005], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 124.53846153846155, 105, 310, 107.0, 237.99999999999994, 310.0, 310.0, 0.0718505949781961, 0.05816810862980915, 0.025540641183655646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a9c4635-4dcd-4f55-8236-e9614b04f296", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 1.6719159031413613, 3.1239774214659684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92d6d2ac-c8bf-475e-84cc-7362ed5a1259", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 0.8562277843601896, 3.267550355450237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 836.1666666666667, 207, 1527, 1117.0, 1431.6000000000001, 1527.0, 1527.0, 0.0802768659911517, 53.41031736121022, 0.1691336704590053], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4245548-c111-4f88-889b-0a26d624fa74", 1, 0, 0.0, 831.0, 831, 831, 831.0, 831.0, 831.0, 831.0, 1.203369434416366, 0.21740561070998798, 0.829666817087846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f615e13a-85c4-410c-babe-3a1f00370f05", 1, 0, 0.0, 704.0, 704, 704, 704.0, 704.0, 704.0, 704.0, 1.4204545454545454, 0.2566250887784091, 0.9793368252840909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3662dc1-f831-4fdb-966f-4bcd9b74a2de", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 1.3034119897959184, 2.4354272959183674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 398.7647058823529, 205, 1022, 408.0, 692.3999999999997, 1022.0, 1022.0, 0.08710355075062766, 6.256824979505048, 0.19458697065378902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 930.0, 103, 1520, 1052.5, 1520.0, 1520.0, 1520.0, 0.08421673175918226, 75.57000088164392, 0.1563745979966945], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1017.8260869565221, 284, 1527, 995.0, 1431.8, 1508.5999999999997, 1527.0, 0.10241795431268647, 0.03226652602751926, 0.04620810048091909], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 106.73684210526314, 103, 121, 106.0, 114.0, 121.0, 121.0, 0.09113977483678785, 0.07075793065942025, 0.03239734183651443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 311.2307692307692, 206, 819, 212.0, 698.5999999999999, 819.0, 819.0, 0.07195518852259393, 6.7247399235061, 0.16041272008601412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=129dc20d-af0c-4858-896e-cfebc127f904", 1, 0, 0.0, 1149.0, 1149, 1149, 1149.0, 1149.0, 1149.0, 1149.0, 0.8703220191470844, 0.15723591166231504, 0.6000462358572671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 438.0, 206, 1010, 408.0, 965.9000000000001, 1010.0, 1010.0, 0.11112654535352133, 16.76894414588832, 0.24637210897346856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 126.00000000000001, 102, 304, 103.0, 304.0, 304.0, 304.0, 0.045678786771423355, 0.033946832747122235, 0.022928609766124614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 169.22222222222226, 101, 305, 103.0, 305.0, 305.0, 305.0, 0.045632465978461476, 0.012210249685643012, 0.026024765753341308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 102.33333333333333, 101, 104, 102.0, 104.0, 104.0, 104.0, 0.04567971414649992, 0.012312110453548806, 0.02685467569940718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 192.0, 102, 305, 104.0, 305.0, 305.0, 305.0, 0.045632465978461476, 0.012299375595757195, 0.026871461899426043], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 110.0, 110, 110, 110.0, 110.0, 110.0, 110.0, 9.09090909090909, 2.6811079545454546, 5.619673295454546], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1147.509090909091, 802, 2150, 1104.0, 1620.6, 1671.9999999999993, 2150.0, 0.2547888726750515, 304.81607066337756, 0.503108496629838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1017.8260869565221, 284, 1527, 995.0, 1431.8, 1508.5999999999997, 1527.0, 0.09972770001907834, 0.03141896799174428, 0.04499433340704512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95a22b35-b83a-49e4-8633-44fe1eea0039", 3, 0, 0.0, 361.6666666666667, 207, 473, 405.0, 473.0, 473.0, 473.0, 0.03751735177519603, 0.02412004223828521, 0.024058978840213602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 132.0, 101, 306, 104.0, 306.0, 306.0, 306.0, 0.04330450490578177, 0.011671917337886493, 0.025500602009947665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 160.2857142857143, 102, 304, 104.0, 304.0, 304.0, 304.0, 0.04330450490578177, 0.011671917337886493, 0.025458312454375614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 157.47368421052633, 100, 311, 103.0, 306.0, 311.0, 311.0, 0.0894622845842358, 0.024112881391844806, 0.052594038398154255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 123.8421052631579, 100, 303, 102.0, 302.0, 303.0, 303.0, 0.08955083188009615, 0.024136747655182166, 0.05273354650751756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 114.36842105263159, 102, 304, 104.0, 106.0, 304.0, 304.0, 0.08954914362740016, 0.06654970537153468, 0.04494947248484734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 130.42857142857142, 100, 303, 102.0, 303.0, 303.0, 303.0, 0.043305308612188585, 0.011587553280995774, 0.024697558817888803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 124.89473684210526, 101, 304, 103.0, 301.0, 304.0, 304.0, 0.08946523333945464, 0.023938939389658763, 0.05102314088890773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 132.28571428571428, 102, 307, 103.0, 307.0, 307.0, 307.0, 0.04330423701027548, 0.03218215270001918, 0.021736697093048433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 136.0, 105, 308, 108.0, 308.0, 308.0, 308.0, 0.044205593902154075, 0.03479463738782831, 0.015713707207406332], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 463.38461538461536, 103, 1053, 419.0, 916.1999999999998, 1053.0, 1053.0, 0.08812006019277958, 0.016509272094410474, 0.05997353856269403], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5de9568c-6220-4153-84dd-bf58392f9fdc", 3, 0, 0.0, 646.6666666666666, 248, 1305, 387.0, 1305.0, 1305.0, 1305.0, 0.05137690094533497, 0.03303039692937389, 0.03294677567132484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1205.695652173913, 773, 1723, 1170.0, 1623.2000000000003, 1716.8, 1723.0, 0.09953779839700867, 0.051518587060951755, 0.045783499067374105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 293.85714285714283, 206, 611, 208.0, 611.0, 611.0, 611.0, 0.043276393963561276, 0.06706995822282397, 0.09732962431453283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4360cc4e-181c-41d8-9041-4290ec7abb33", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=392d40f2-f164-47d1-af4b-b6608eecd7ad", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["addBook", 60, 9, 15.0, 1072.75, 521, 2668, 904.5, 1865.8, 1965.85, 2668.0, 0.2648971536800837, 85.53674389108534, 0.9623389370118719], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 176.49090909090904, 102, 483, 104.0, 414.0, 416.59999999999997, 483.0, 0.2562274927441033, 0.19041906443189707, 0.12385996963704211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/adddb89a-0096-4d30-b93b-18a5ffad45d9", 3, 0, 0.0, 295.6666666666667, 195, 435, 257.0, 435.0, 435.0, 435.0, 0.03298225554651597, 0.027495949366740696, 0.021150730282108225], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 655.4181818181818, 497, 923, 606.0, 902.2, 915.0, 923.0, 0.2560473734194894, 75.28642935827546, 0.1287738254990596], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 160.6909090909091, 101, 422, 106.0, 309.8, 340.9999999999999, 422.0, 0.2564078656609262, 0.4537217310328109, 0.12469835654213014], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 967.4363636363634, 700, 1733, 996.0, 1217.2, 1329.1999999999996, 1733.0, 0.2553258654386266, 229.7426625366741, 0.12816161605024812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 107.56249999999999, 103, 121, 106.5, 115.4, 121.0, 121.0, 0.11271812718831677, 0.08420836650299054, 0.04006777177397197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 9, 5.142857142857143, 176.28000000000003, 103, 2041, 109.0, 310.20000000000005, 346.3999999999999, 1102.4000000000112, 0.7348772754949924, 1.5663835311378, 0.35434043452243474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 130.33333333333334, 103, 309, 106.0, 309.0, 309.0, 309.0, 0.04746785371462327, 0.036759773433297116, 0.01687333862511999], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=adddb89a-0096-4d30-b93b-18a5ffad45d9", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c0bb5fc-5586-4424-92b3-c416c6267ddc", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 0.9661179812834224, 3.6869151069518717], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 120.05882352941175, 104, 308, 106.0, 159.19999999999987, 308.0, 308.0, 0.08582910919482198, 0.06965233373134479, 0.030509566159096873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 318.77777777777777, 206, 609, 210.0, 609.0, 609.0, 609.0, 0.0456081851489614, 0.07068377913222826, 0.10257387734185362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 282.2631578947368, 205, 606, 209.0, 418.0, 606.0, 606.0, 0.08941765575143774, 0.13857990202883955, 0.20110240351129016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92d6d2ac-c8bf-475e-84cc-7362ed5a1259", 3, 0, 0.0, 304.0, 194, 378, 340.0, 378.0, 378.0, 378.0, 0.08588605782994561, 0.039811766389922704, 0.05507667119954194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0efbddd7-bd97-48bd-a094-6189d4f9d6ec", 3, 0, 0.0, 530.0, 212, 1053, 325.0, 1053.0, 1053.0, 1053.0, 0.01662851346632449, 0.022923748219363348, 0.01066346729448543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 119.75000000000003, 103, 320, 105.0, 176.50000000000014, 320.0, 320.0, 0.09988139084836756, 0.08281181721705475, 0.03550471315313066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b63e4e0-ca7e-4218-99df-8f035357f7c8", 3, 0, 0.0, 470.6666666666667, 213, 780, 419.0, 780.0, 780.0, 780.0, 0.03322259136212625, 0.027696307447397563, 0.02130485188261351], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/129dc20d-af0c-4858-896e-cfebc127f904", 3, 0, 0.0, 284.3333333333333, 203, 446, 204.0, 446.0, 446.0, 446.0, 0.01900357900737972, 0.026197967804769896, 0.012186539923352231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4245548-c111-4f88-889b-0a26d624fa74", 3, 0, 0.0, 508.0, 196, 922, 406.0, 922.0, 922.0, 922.0, 0.022934201775107216, 0.02710745007988747, 0.014707154133125396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 119.66666666666667, 103, 308, 107.5, 135.20000000000027, 308.0, 308.0, 0.08300630386763262, 0.06444337067848431, 0.02950614707794753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 129.62500000000003, 102, 307, 104.0, 306.3, 307.0, 307.0, 0.11121305641282286, 0.08264954680679512, 0.05582374120721773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 154.125, 101, 306, 103.0, 305.3, 306.0, 306.0, 0.11136555045903489, 0.050707214747583024, 0.062344044727189206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 300.4375, 101, 898, 300.0, 859.5, 898.0, 898.0, 0.11136477532156579, 12.55204182530347, 0.06427400606938026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 261.0625, 100, 806, 211.5, 666.0000000000001, 806.0, 806.0, 0.11137252718185742, 4.11966869283457, 0.06438724227701131], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 31.57894736842105, 0.45871559633027525], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.0764525993883792], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.0764525993883792], "isController": false}, {"data": ["401/Unauthorized", 11, 57.89473684210526, 0.8409785932721713], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1308, 19, "401/Unauthorized", 11, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
