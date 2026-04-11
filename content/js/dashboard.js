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

    var data = {"OkPercent": 98.07987711213518, "KoPercent": 1.9201228878648233};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7747540983606558, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.10909090909090909, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d3c80eb-b507-4189-a0bc-6e69eb6ff8da"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8cf59e4-b6cb-4ab6-ae4b-dc681807fa7a"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce38f2ad-0194-406c-9b7b-add57d663a72"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=748a6a8f-9c36-4af0-ac79-3cec69c0d64a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7332c06-7efa-42d5-bdd8-54cd0674837e"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5118a67-068c-454b-a2f9-173d865c495f"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/96614116-be12-402f-b839-5e67ec52d0c2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/11728f52-cf54-493e-b696-b53154122f5e"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/22b9b78f-4f16-43cb-8796-cc703add2b74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11728f52-cf54-493e-b696-b53154122f5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22b9b78f-4f16-43cb-8796-cc703add2b74"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/780da55b-bf7a-497b-a108-6588fd31a1a5"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=231f57c8-4d56-401a-9898-bd90884edb6f"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cf9fc176-8ff4-4f6b-876e-8935242f9f8a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5149860a-fda5-42b8-98d3-eef4038ab0ef"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/86067b71-baba-4e84-89b8-ffb17165842a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f573abcb-4680-41c7-af4d-9f51cb87cfb5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/74417efb-169a-4305-8b40-1068855ce344"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d7332c06-7efa-42d5-bdd8-54cd0674837e"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f5118a67-068c-454b-a2f9-173d865c495f"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86067b71-baba-4e84-89b8-ffb17165842a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/748a6a8f-9c36-4af0-ac79-3cec69c0d64a"], "isController": false}, {"data": [0.4318181818181818, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96614116-be12-402f-b839-5e67ec52d0c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ce38f2ad-0194-406c-9b7b-add57d663a72"], "isController": false}, {"data": [0.27586206896551724, 500, 1500, "addBook"], "isController": true}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.509090909090909, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9269005847953217, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/231f57c8-4d56-401a-9898-bd90884edb6f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74417efb-169a-4305-8b40-1068855ce344"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5149860a-fda5-42b8-98d3-eef4038ab0ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=780da55b-bf7a-497b-a108-6588fd31a1a5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c8cf59e4-b6cb-4ab6-ae4b-dc681807fa7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f573abcb-4680-41c7-af4d-9f51cb87cfb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1302, 25, 1.9201228878648233, 363.29032258064495, 98, 2978, 115.0, 1010.7, 1222.0999999999995, 1582.2300000000016, 5.053876967984349, 718.4138792448005, 3.6872375960217214], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1702.3454545454547, 1234, 2270, 1646.0, 2043.8, 2238.4, 2270.0, 0.252585557617062, 303.9456958631652, 1.2419612134784246], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6d3c80eb-b507-4189-a0bc-6e69eb6ff8da", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 1.573083435960591, 2.939308805418719], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8cf59e4-b6cb-4ab6-ae4b-dc681807fa7a", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["deleteBook", 16, 2, 12.5, 677.6875000000001, 102, 2978, 504.5, 1944.800000000001, 2978.0, 2978.0, 0.10153443921260041, 0.019793762136538436, 0.06840436645682883], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 677.6875000000001, 102, 2978, 504.5, 1944.800000000001, 2978.0, 2978.0, 0.09929870291069323, 0.019357913641159314, 0.06689813737354931], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce38f2ad-0194-406c-9b7b-add57d663a72", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 0.8812881097560976, 3.363185975609756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 114.0, 100, 307, 102.5, 126.10000000000028, 307.0, 307.0, 0.10428314031296529, 0.027903887154055167, 0.059473978459738015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 117.27777777777777, 102, 309, 104.0, 155.10000000000025, 309.0, 309.0, 0.10428072370822254, 0.07749768627144273, 0.05234403514260389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 147.66666666666666, 100, 308, 103.0, 305.3, 308.0, 308.0, 0.10428495284002688, 0.028108053695163494, 0.061409986877476765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 170.55555555555557, 101, 307, 104.0, 307.0, 307.0, 307.0, 0.10428314031296529, 0.028107565162478927, 0.06130708053555186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=748a6a8f-9c36-4af0-ac79-3cec69c0d64a", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.31148976293103453, 1.1887122844827587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7332c06-7efa-42d5-bdd8-54cd0674837e", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 225.93749999999997, 99, 390, 215.5, 362.70000000000005, 390.0, 390.0, 0.10129852040848629, 0.18878473035600096, 0.06547554511266294], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 115.49999999999999, 102, 304, 102.5, 164.70000000000016, 304.0, 304.0, 0.15365998885965082, 0.11419458156464284, 0.0771301115955669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 115.5, 101, 304, 102.5, 166.10000000000014, 304.0, 304.0, 0.15366441612323886, 0.055542033220325956, 0.08683014919854402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 687.3333333333334, 499, 812, 701.5, 812.0, 812.0, 812.0, 0.05304430083191145, 15.596785681133026, 0.0302518278181995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 988.8333333333334, 801, 1208, 966.0, 1208.0, 1208.0, 1208.0, 0.05271388659485864, 47.432047819182586, 0.030011910043752525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 173.5, 102, 311, 109.5, 311.0, 311.0, 311.0, 0.053229712825699306, 0.09419164027360073, 0.029473874191573737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 131.60000000000002, 102, 305, 104.0, 303.2, 305.0, 305.0, 0.08302521752606992, 0.061701357946620315, 0.04167476739101556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 157.33333333333337, 99, 320, 103.0, 311.0, 320.0, 320.0, 0.08293432707087015, 0.03879987463094224, 0.046369791724259944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5118a67-068c-454b-a2f9-173d865c495f", 1, 0, 0.0, 666.0, 666, 666, 666.0, 666.0, 666.0, 666.0, 1.5015015015015014, 0.2712673611111111, 1.0352149024024024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 275.46666666666664, 100, 1194, 103.0, 1017.6000000000001, 1194.0, 1194.0, 0.08302751531857658, 9.980501939384379, 0.047859740926476366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96614116-be12-402f-b839-5e67ec52d0c2", 3, 0, 0.0, 820.3333333333334, 211, 1239, 1011.0, 1239.0, 1239.0, 1239.0, 0.02294788535236478, 0.023015115485233037, 0.014715929083384966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 237.20000000000002, 101, 803, 102.0, 800.0, 803.0, 803.0, 0.08293157592109336, 3.270657218917245, 0.04788542622683444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 102.0, 100, 104, 102.0, 104.0, 104.0, 104.0, 0.05323160182761833, 0.03955981346759526, 0.029890792041875527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11728f52-cf54-493e-b696-b53154122f5e", 3, 0, 0.0, 673.0, 351, 1154, 514.0, 1154.0, 1154.0, 1154.0, 0.023335589106947004, 0.027581876317488468, 0.01496455421246276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 655.9047619047619, 102, 1420, 303.0, 1378.4, 1417.8, 1420.0, 0.09962238372644643, 42.69996784509668, 0.05449025657507733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 178.8125, 101, 905, 103.0, 491.3000000000004, 905.0, 905.0, 0.15366441612323886, 8.68054826083094, 0.08951252364991404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 390.2380952380953, 101, 817, 110.0, 811.6, 816.5, 817.0, 0.09962380154938731, 13.962972560758658, 0.05458832094756467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 198.75, 102, 805, 104.0, 462.7000000000004, 805.0, 805.0, 0.1536629403403634, 2.8627038134820024, 0.08966172544274136], "isController": false}, {"data": ["deleteBooks", 16, 2, 12.5, 558.8125, 103, 2950, 430.5, 1351.2000000000016, 2950.0, 2950.0, 0.0992063492063492, 0.019339909629216268, 0.0675140865265377], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/22b9b78f-4f16-43cb-8796-cc703add2b74", 3, 0, 0.0, 728.0, 390, 958, 836.0, 958.0, 958.0, 958.0, 0.02954326118212436, 0.02462900126543635, 0.018945385588797194], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11728f52-cf54-493e-b696-b53154122f5e", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22b9b78f-4f16-43cb-8796-cc703add2b74", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 449.8, 205, 1500, 407.0, 1201.2000000000003, 1500.0, 1500.0, 0.08288254438360251, 13.332169884005879, 0.18357728141110294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/780da55b-bf7a-497b-a108-6588fd31a1a5", 3, 0, 0.0, 299.0, 220, 408, 269.0, 408.0, 408.0, 408.0, 0.022129932208641002, 0.02654583339480537, 0.014191395329108977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 535.6818181818181, 148, 1215, 472.5, 927.1, 1172.3999999999994, 1215.0, 0.09350759749229626, 0.05743777228774838, 0.04227931410052067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 113.6190476190476, 101, 306, 104.0, 109.80000000000001, 286.4999999999997, 306.0, 0.09962285632960934, 0.07403612662776632, 0.05000600405607344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 172.2857142857143, 102, 309, 105.0, 308.6, 309.0, 309.0, 0.09962332893725627, 0.09790919985862975, 0.05283223787204569], "isController": false}, {"data": ["login", 22, 0, 0.0, 2426.0909090909095, 1604, 3421, 2342.5, 3319.6, 3407.5, 3421.0, 0.09334413862453168, 30.583340205972327, 0.18305030877816764], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 117.87499999999999, 104, 305, 105.5, 167.80000000000013, 305.0, 305.0, 0.14572347149739975, 0.11797339635873476, 0.05180014025884132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=231f57c8-4d56-401a-9898-bd90884edb6f", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 0.8685772235576924, 3.3146784855769234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 770.904761904762, 208, 1525, 609.0, 1483.4, 1522.8, 1525.0, 0.09957278533529951, 56.806389794560005, 0.21180979908819778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf9fc176-8ff4-4f6b-876e-8935242f9f8a", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.7274167141230068, 1.359179242596811], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5149860a-fda5-42b8-98d3-eef4038ab0ef", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 311.6111111111111, 206, 613, 227.0, 433.90000000000026, 613.0, 613.0, 0.1042179312740642, 0.16151743841009755, 0.23438857004313463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 696.4, 98, 1310, 953.0, 1299.5, 1310.0, 1310.0, 0.08777858729141613, 63.01761935693407, 0.14202301115665844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86067b71-baba-4e84-89b8-ffb17165842a", 3, 0, 0.0, 526.6666666666667, 221, 1064, 295.0, 1064.0, 1064.0, 1064.0, 0.02514184189133696, 0.025215499631252986, 0.016122860848285746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f573abcb-4680-41c7-af4d-9f51cb87cfb5", 1, 0, 0.0, 2950.0, 2950, 2950, 2950.0, 2950.0, 2950.0, 2950.0, 0.33898305084745767, 0.061242055084745756, 0.23371292372881355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74417efb-169a-4305-8b40-1068855ce344", 3, 0, 0.0, 410.6666666666667, 209, 605, 418.0, 605.0, 605.0, 605.0, 0.033101621979477, 0.033004644571333994, 0.02122727711574534], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 889.6666666666665, 116, 1663, 886.5, 1430.0, 1626.75, 1663.0, 0.0931246823090265, 0.029237876330421894, 0.042015237526142814], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d7332c06-7efa-42d5-bdd8-54cd0674837e", 3, 0, 0.0, 304.3333333333333, 188, 513, 212.0, 513.0, 513.0, 513.0, 0.0460964029440236, 0.029635545512515172, 0.029560518815015133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 346.6875, 205, 1010, 212.0, 737.7000000000003, 1010.0, 1010.0, 0.1535066679458889, 11.700995169936679, 0.3427853365153986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 121.38461538461539, 101, 316, 105.0, 232.79999999999993, 316.0, 316.0, 0.10389942535625514, 0.080664104646702, 0.036932998857106325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5118a67-068c-454b-a2f9-173d865c495f", 3, 0, 0.0, 401.6666666666667, 240, 494, 471.0, 494.0, 494.0, 494.0, 0.030325391450261304, 0.02528103108858047, 0.019446946991215745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 393.3333333333333, 203, 1207, 401.0, 970.3000000000004, 1207.0, 1207.0, 0.10679577088747286, 14.343218987694755, 0.23715011406381642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 102.8, 102, 103, 103.0, 103.0, 103.0, 103.0, 0.026914857539659044, 0.02000215487078177, 0.013509996850961669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 144.0, 102, 306, 103.0, 306.0, 306.0, 306.0, 0.026915147306601207, 0.0072019046503991515, 0.015350044948296001], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86067b71-baba-4e84-89b8-ffb17165842a", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 144.2, 102, 306, 103.0, 306.0, 306.0, 306.0, 0.026915002422350218, 0.007254434246649082, 0.015823077595951984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 103.2, 102, 106, 102.0, 106.0, 106.0, 106.0, 0.026915147306601207, 0.007254473297482357, 0.015849447095586455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 104.5, 103, 106, 104.5, 106.0, 106.0, 106.0, 0.031861339450710506, 0.009396605970815014, 0.019695535031542727], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1175.3454545454542, 792, 1843, 1108.0, 1617.8, 1795.0, 1843.0, 0.26036119198087526, 311.48250180477646, 0.5141116505716111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 889.6666666666665, 116, 1663, 886.5, 1430.0, 1626.75, 1663.0, 0.09315902245132442, 0.029248657927832808, 0.04203073083253113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 132.28571428571428, 101, 312, 103.0, 312.0, 312.0, 312.0, 0.0632659701384621, 0.01705215601388236, 0.03725525389989516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 159.42857142857142, 102, 303, 103.0, 303.0, 303.0, 303.0, 0.0631506775165545, 0.01702108104938383, 0.03712569127438067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 226.0769230769231, 100, 1108, 103.0, 787.1999999999997, 1108.0, 1108.0, 0.10155615274045372, 7.054528879542684, 0.05903256534747828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 219.0, 100, 804, 103.0, 607.1999999999998, 804.0, 804.0, 0.10155535938879298, 2.3222396716246516, 0.05913127934363991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 133.76923076923075, 98, 309, 103.0, 306.6, 309.0, 309.0, 0.10155456604952738, 0.07547170387079134, 0.05097563178657918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 131.42857142857142, 101, 305, 102.0, 305.0, 305.0, 305.0, 0.06314953810623557, 0.016897435001082563, 0.03601497095121247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 196.0, 99, 311, 103.0, 309.0, 311.0, 311.0, 0.10155535938879298, 0.038907176448530964, 0.05726220910248499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 105.0, 102, 115, 104.0, 115.0, 115.0, 115.0, 0.0632642547922673, 0.04701572060245646, 0.031755690393774794], "isController": false}, {"data": ["deleteAccount", 16, 2, 12.5, 623.25, 98, 1189, 528.5, 1164.5, 1189.0, 1189.0, 0.10140895060750299, 0.019422685974508327, 0.06901304927207388], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 106.42857142857143, 105, 110, 105.0, 110.0, 110.0, 110.0, 0.06294115002472689, 0.04954156925774401, 0.022373611922852133], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/748a6a8f-9c36-4af0-ac79-3cec69c0d64a", 3, 0, 0.0, 341.0, 208, 544, 271.0, 544.0, 544.0, 544.0, 0.033805102316776345, 0.033904140702470026, 0.021678402201838996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1252.8181818181815, 731, 2426, 1244.5, 1707.0, 2323.5499999999984, 2426.0, 0.09261481079215132, 0.04793540011703144, 0.042599195198343036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 267.2857142857143, 206, 427, 209.0, 427.0, 427.0, 427.0, 0.0630903453745764, 0.09777771299751244, 0.14189166542739204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96614116-be12-402f-b839-5e67ec52d0c2", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce38f2ad-0194-406c-9b7b-add57d663a72", 3, 0, 0.0, 319.3333333333333, 226, 383, 349.0, 383.0, 383.0, 383.0, 0.08955491208692798, 0.04052126556016597, 0.057429419534911486], "isController": false}, {"data": ["addBook", 58, 10, 17.24137931034483, 1080.2586206896551, 515, 2089, 848.5, 1896.3000000000002, 2006.75, 2089.0, 0.2869312700666373, 95.84116526097141, 1.0410582646718347], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 182.83636363636361, 101, 519, 105.0, 414.0, 419.0, 519.0, 0.26135591448434475, 0.19423032316658825, 0.12633904069311588], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 644.5636363636363, 500, 1007, 605.0, 817.4, 916.4, 1007.0, 0.2611809176472823, 76.79586181095725, 0.13135563729331093], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 149.30909090909094, 101, 318, 105.0, 306.8, 312.0, 318.0, 0.26179879572553966, 0.46326115024870884, 0.12732011745245972], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 988.8363636363638, 689, 1383, 1004.0, 1211.4, 1322.8, 1383.0, 0.260938048562943, 234.7925147770996, 0.130978668907571], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 117.27777777777779, 101, 312, 104.0, 148.20000000000027, 312.0, 312.0, 0.10385773797846684, 0.07758903276711633, 0.03691818029703313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 10, 5.847953216374269, 165.10526315789477, 102, 1456, 108.0, 277.20000000000005, 373.20000000000005, 1133.4400000000005, 0.7539516324596018, 1.6603134093714864, 0.36178948463437755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 106.4, 104, 110, 106.0, 110.0, 110.0, 110.0, 0.027780247133078497, 0.021513414039581295, 0.009875009723086496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 112.83333333333334, 103, 145, 106.0, 132.40000000000003, 145.0, 145.0, 0.10104468982087021, 0.08200013402455386, 0.03591822958476246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 248.4, 206, 410, 207.0, 410.0, 410.0, 410.0, 0.02689979825151311, 0.04168943342299933, 0.06049827673167451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 440.3846153846154, 201, 1212, 409.0, 973.9999999999998, 1212.0, 1212.0, 0.10147212638743619, 9.483314177217165, 0.2262160678185054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/231f57c8-4d56-401a-9898-bd90884edb6f", 3, 0, 0.0, 292.6666666666667, 224, 399, 255.0, 399.0, 399.0, 399.0, 0.07741136398823346, 0.03638737291634412, 0.04964205307839191], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 108.8, 103, 141, 105.0, 126.60000000000001, 141.0, 141.0, 0.08229459269662921, 0.06823057539007638, 0.029253155997629916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74417efb-169a-4305-8b40-1068855ce344", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5149860a-fda5-42b8-98d3-eef4038ab0ef", 3, 0, 0.0, 780.6666666666666, 258, 1189, 895.0, 1189.0, 1189.0, 1189.0, 0.021096601337524522, 0.024935468573096208, 0.013528744998347433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 137.2380952380952, 102, 314, 108.0, 305.2, 313.2, 314.0, 0.09581778195523029, 0.07438978188907039, 0.034060227179398266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=780da55b-bf7a-497b-a108-6588fd31a1a5", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.3088274572649573, 1.1785523504273505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8cf59e4-b6cb-4ab6-ae4b-dc681807fa7a", 3, 0, 0.0, 510.3333333333333, 196, 693, 642.0, 693.0, 693.0, 693.0, 0.04138330597436994, 0.026874900852496105, 0.026538122646324474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f573abcb-4680-41c7-af4d-9f51cb87cfb5", 3, 0, 0.0, 261.6666666666667, 196, 377, 212.0, 377.0, 377.0, 377.0, 0.04435179846542777, 0.02851393293268875, 0.028441745760707262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 104.0, 100, 121, 103.5, 105.70000000000002, 121.0, 121.0, 0.10698492701250535, 0.07950735298487947, 0.053701418441823974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 169.94444444444443, 101, 308, 103.0, 307.1, 308.0, 308.0, 0.10698429113991763, 0.046480588294729834, 0.0600161442267116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 265.72222222222223, 99, 1105, 103.5, 868.3000000000004, 1105.0, 1105.0, 0.10698556289265188, 10.721831685706134, 0.06187424590037266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 179.33333333333331, 100, 600, 102.5, 597.3, 600.0, 600.0, 0.10685980587135267, 3.5167497180088456, 0.06190587061058506], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 28.0, 0.5376344086021505], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.15360983102918588], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.0, 0.15360983102918588], "isController": false}, {"data": ["401/Unauthorized", 14, 56.0, 1.075268817204301], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1302, 25, "401/Unauthorized", 14, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
