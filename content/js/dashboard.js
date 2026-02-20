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

    var data = {"OkPercent": 66.40746500777605, "KoPercent": 33.59253499222395};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5051428571428571, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ccb348ca-3b88-4823-90da-1915a1e64f9c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6dfb25fe-feb7-444b-bdbb-5e8b596977fa"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f1e9b74-6ea4-46d1-b97a-78a3225510e9"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c5b3106-e5ea-4a23-84c5-c3f86c79fbc3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9e500980-a7dc-478c-a8a1-cd63d4673fa4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=05afe33b-ce40-4c8c-9bdf-41bbc491450e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf78b12a-908e-46a0-a9ad-81ef81c50e3a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.34, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6c5b3106-e5ea-4a23-84c5-c3f86c79fbc3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3958333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=834b77aa-89ef-46a8-9c1a-ae3b8c1a72ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6efa31b8-b087-4b61-b307-8c0819bc69af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/be68cd88-75e4-4c2d-830e-6734818c6e31"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf78b12a-908e-46a0-a9ad-81ef81c50e3a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3743d83-d3f6-440f-97e8-9d70f73594ed"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/89420c0d-41f2-43fc-af79-1315dc82ec73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6efa31b8-b087-4b61-b307-8c0819bc69af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/834b77aa-89ef-46a8-9c1a-ae3b8c1a72ef"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89420c0d-41f2-43fc-af79-1315dc82ec73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3743d83-d3f6-440f-97e8-9d70f73594ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9194444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7291666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0556eadf-f253-47ba-b841-cdaf8b70e9c6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f47aba28-c5fd-4e0a-a9a6-066e4674bae9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9ecb3ba9-d108-4cba-9383-9c65310b5741"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f47aba28-c5fd-4e0a-a9a6-066e4674bae9"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be68cd88-75e4-4c2d-830e-6734818c6e31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3dd1d19-9479-4719-bd08-6fa210c40b96"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6dfb25fe-feb7-444b-bdbb-5e8b596977fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=739215d7-095a-44b2-b7ba-c0c2667b8eab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0556eadf-f253-47ba-b841-cdaf8b70e9c6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/05afe33b-ce40-4c8c-9bdf-41bbc491450e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e3dd1d19-9479-4719-bd08-6fa210c40b96"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/739215d7-095a-44b2-b7ba-c0c2667b8eab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ccb348ca-3b88-4823-90da-1915a1e64f9c"], "isController": false}, {"data": [0.34, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 643, 216, 33.59253499222395, 265.6143079315706, 98, 1939, 106.0, 592.4000000000002, 1000.5999999999997, 1621.7199999999993, 2.567173713418773, 2.7124474737493514, 1.2281871019982433], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ccb348ca-3b88-4823-90da-1915a1e64f9c", 1, 0, 0.0, 710.0, 710, 710, 710.0, 710.0, 710.0, 710.0, 1.4084507042253522, 0.25445642605633806, 0.9710607394366197], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6dfb25fe-feb7-444b-bdbb-5e8b596977fa", 3, 0, 0.0, 267.3333333333333, 187, 379, 236.0, 379.0, 379.0, 379.0, 0.07360698775670436, 0.03416782699904311, 0.047202397747626176], "isController": false}, {"data": ["see books", 62, 62, 100.0, 560.6935483870966, 402, 886, 606.5, 727.0, 737.4, 886.0, 0.2579206602768903, 1.6590358096316729, 0.43297423341403757], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 19, 100.0, 112.63157894736841, 100, 298, 102.0, 106.0, 298.0, 298.0, 0.08989997444948095, 0.04468660839334551, 0.045125573112337114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 114.58823529411762, 100, 298, 103.0, 144.39999999999986, 298.0, 298.0, 0.0948708361469047, 0.07365460423514573, 0.03372361753659503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f1e9b74-6ea4-46d1-b97a-78a3225510e9", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 1.580870977722772, 2.953859839108911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, 100.0, 101.12499999999999, 99, 105, 100.5, 104.3, 105.0, 105.0, 0.11934420360121134, 0.05932246057911775, 0.05990519594826429], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c5b3106-e5ea-4a23-84c5-c3f86c79fbc3", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 0.5004544667590027, 1.9098424515235457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e500980-a7dc-478c-a8a1-cd63d4673fa4", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 1.2188394561068703, 2.27740338740458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=05afe33b-ce40-4c8c-9bdf-41bbc491450e", 1, 0, 0.0, 900.0, 900, 900, 900.0, 900.0, 900.0, 900.0, 1.1111111111111112, 0.2007378472222222, 0.7660590277777778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 2.8357872596153846, 5.943885216346154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf78b12a-908e-46a0-a9ad-81ef81c50e3a", 1, 0, 0.0, 656.0, 656, 656, 656.0, 656.0, 656.0, 656.0, 1.524390243902439, 0.2754025342987805, 1.0509956173780488], "isController": false}, {"data": ["https://demoqa.com/books", 62, 62, 100.0, 174.93548387096777, 99, 570, 102.0, 406.4, 411.54999999999995, 570.0, 0.2647841368677745, 0.13161633365790745, 0.12799623803666835], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 539.2666666666667, 102, 1939, 468.0, 1111.6000000000004, 1939.0, 1939.0, 0.08314441075556096, 0.015654533587570466, 0.05624697735423399], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 539.2666666666667, 102, 1939, 468.0, 1111.6000000000004, 1939.0, 1939.0, 0.08320852055250458, 0.015666604260276253, 0.05629034746491374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 909.52, 149, 1520, 926.0, 1346.8000000000006, 1516.1, 1520.0, 0.10664892028633102, 0.03352775431501532, 0.0481169933323095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c5b3106-e5ea-4a23-84c5-c3f86c79fbc3", 3, 0, 0.0, 319.3333333333333, 200, 504, 254.0, 504.0, 504.0, 504.0, 0.03225355595454399, 0.03234804879425456, 0.020683432692204313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 155.55555555555554, 100, 344, 104.0, 344.0, 344.0, 344.0, 0.04378539319283087, 0.03446389347013836, 0.015564338986514098], "isController": false}, {"data": ["deleteAccount", 15, 1, 6.666666666666667, 468.26666666666665, 99, 1059, 414.0, 931.2, 1059.0, 1059.0, 0.08510541724349227, 0.01717068281494678, 0.05744615663935728], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1209.7916666666665, 796, 1720, 1124.0, 1682.5, 1716.75, 1720.0, 0.10404248401430584, 0.05385011379646689, 0.04785547848704887], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 232.58823529411765, 98, 533, 204.0, 425.7999999999999, 533.0, 533.0, 0.07965476686923967, 0.12328460384638813, 0.05030128976295679], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 9, 100.0, 124.33333333333333, 101, 298, 101.0, 298.0, 298.0, 298.0, 0.043761335401461626, 0.021752460663421843, 0.021966139058936796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=834b77aa-89ef-46a8-9c1a-ae3b8c1a72ef", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 0.6339089912280702, 2.419133771929825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6efa31b8-b087-4b61-b307-8c0819bc69af", 3, 0, 0.0, 317.3333333333333, 277, 395, 280.0, 395.0, 395.0, 395.0, 0.023432557194966685, 0.023501207264873817, 0.015026737524116008], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be68cd88-75e4-4c2d-830e-6734818c6e31", 3, 0, 0.0, 293.0, 186, 425, 268.0, 425.0, 425.0, 425.0, 0.03532362326178337, 0.022709686179043672, 0.022652193302641028], "isController": false}, {"data": ["addBook", 59, 59, 100.0, 620.1186440677965, 404, 1459, 586.0, 811.0, 920.0, 1459.0, 0.274785411223354, 0.9392215931848561, 0.5356987437882197], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bf78b12a-908e-46a0-a9ad-81ef81c50e3a", 3, 0, 0.0, 256.6666666666667, 177, 414, 179.0, 414.0, 414.0, 414.0, 0.026355785534187846, 0.02643299974962004, 0.016901333822379575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3743d83-d3f6-440f-97e8-9d70f73594ed", 3, 0, 0.0, 408.6666666666667, 250, 533, 443.0, 533.0, 533.0, 533.0, 0.13008976193573565, 0.05886222952170331, 0.08342344759550757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89420c0d-41f2-43fc-af79-1315dc82ec73", 3, 0, 0.0, 390.3333333333333, 267, 572, 332.0, 572.0, 572.0, 572.0, 0.02849273435274005, 0.028576209160414093, 0.018271707901984992], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6efa31b8-b087-4b61-b307-8c0819bc69af", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/834b77aa-89ef-46a8-9c1a-ae3b8c1a72ef", 3, 0, 0.0, 327.0, 207, 434, 340.0, 434.0, 434.0, 434.0, 0.07446940548591287, 0.034519672334615864, 0.04775544557527616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89420c0d-41f2-43fc-af79-1315dc82ec73", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3743d83-d3f6-440f-97e8-9d70f73594ed", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 0.9409586588541666, 3.590901692708333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 122.68749999999999, 101, 300, 103.5, 236.30000000000007, 300.0, 300.0, 0.11858088327935433, 0.08858825752803326, 0.04215179835320798], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 487.26666666666665, 104, 1302, 427.0, 1060.8000000000002, 1302.0, 1302.0, 0.08326995564487029, 0.015678171336260736, 0.057014981999811254], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 13, 7.222222222222222, 166.3611111111112, 100, 982, 107.0, 309.0, 384.79999999999995, 956.0799999999999, 0.7398425779403605, 1.7020433334532152, 0.350943556176658], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 122.91666666666667, 101, 311, 102.5, 257.0000000000002, 311.0, 311.0, 0.06967548642198959, 0.05395767649671654, 0.02476745806406661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 12, 100.0, 117.66666666666666, 99, 296, 100.5, 239.3000000000002, 296.0, 296.0, 0.0537480292389279, 0.02671654969005303, 0.026978991239071232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 138.2941176470588, 101, 302, 104.0, 301.2, 302.0, 302.0, 0.07736204527044861, 0.06278111290990507, 0.027499789529729778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 596.75, 115, 1875, 499.5, 1117.0, 1758.0, 1875.0, 0.10472255069225969, 0.0643266449076478, 0.04735013766651976], "isController": false}, {"data": ["login", 24, 7, 29.166666666666668, 2096.9166666666674, 1358, 3593, 2038.5, 2655.5, 3370.25, 3593.0, 0.10624075926729289, 0.15968103702047792, 0.1592055127887314], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 12, 100.0, 133.58333333333334, 99, 299, 101.0, 297.8, 299.0, 299.0, 0.06926886710767845, 0.034431497419734704, 0.03476972430990891], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0556eadf-f253-47ba-b841-cdaf8b70e9c6", 1, 0, 0.0, 1302.0, 1302, 1302, 1302.0, 1302.0, 1302.0, 1302.0, 0.7680491551459293, 0.13875888056835636, 0.5295338901689708], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f47aba28-c5fd-4e0a-a9a6-066e4674bae9", 1, 0, 0.0, 762.0, 762, 762, 762.0, 762.0, 762.0, 762.0, 1.3123359580052494, 0.23709194553805774, 0.9047941272965879], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 157.73684210526315, 101, 310, 108.0, 302.0, 310.0, 310.0, 0.08885189324678848, 0.07193185498201918, 0.03158407142756934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ecb3ba9-d108-4cba-9383-9c65310b5741", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.804157838983051, 3.3710716807909606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f47aba28-c5fd-4e0a-a9a6-066e4674bae9", 3, 0, 0.0, 418.33333333333337, 184, 846, 225.0, 846.0, 846.0, 846.0, 0.021140308225693932, 0.02498712863525217, 0.013556773178586277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, 100.0, 114.29411764705883, 99, 295, 102.0, 146.9999999999999, 295.0, 295.0, 0.09451112729536951, 0.04697867557943661, 0.04744015569318353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be68cd88-75e4-4c2d-830e-6734818c6e31", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3dd1d19-9479-4719-bd08-6fa210c40b96", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 0.6145036139455783, 2.345078656462585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 171.74999999999997, 101, 330, 104.5, 321.90000000000003, 330.0, 330.0, 0.054459062668766364, 0.045152093950959614, 0.019358494933038047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 19, 100.0, 102.31578947368422, 99, 113, 102.0, 105.0, 113.0, 113.0, 0.1231455256045473, 0.06121198489522909, 0.06181328140697004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 117.36842105263158, 100, 298, 107.0, 123.0, 298.0, 298.0, 0.1165050924989116, 0.09045073099280734, 0.041413919599222485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6dfb25fe-feb7-444b-bdbb-5e8b596977fa", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.0036892361111112, 3.830295138888889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=739215d7-095a-44b2-b7ba-c0c2667b8eab", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 0.9765625, 3.7267736486486487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0556eadf-f253-47ba-b841-cdaf8b70e9c6", 3, 0, 0.0, 331.3333333333333, 199, 434, 361.0, 434.0, 434.0, 434.0, 0.01600324332398033, 0.02206176285060439, 0.010262496532630614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05afe33b-ce40-4c8c-9bdf-41bbc491450e", 3, 0, 0.0, 793.6666666666666, 355, 1627, 399.0, 1627.0, 1627.0, 1627.0, 0.10414496979795876, 0.04712288672498785, 0.06678567399152954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, 100.0, 138.5294117647059, 100, 306, 104.0, 306.0, 306.0, 306.0, 0.07752468249082244, 0.03853521815217639, 0.03891375664090111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 11, 100.0, 118.54545454545453, 98, 297, 100.0, 258.60000000000014, 297.0, 297.0, 0.07878583860362845, 0.039162101415280155, 0.04448490176838396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3dd1d19-9479-4719-bd08-6fa210c40b96", 3, 0, 0.0, 445.0, 213, 761, 361.0, 761.0, 761.0, 761.0, 0.0768974444415964, 0.03564516955886499, 0.04931248878578935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/739215d7-095a-44b2-b7ba-c0c2667b8eab", 3, 0, 0.0, 492.0, 204, 1059, 213.0, 1059.0, 1059.0, 1059.0, 0.08575103615835358, 0.03880011076175504, 0.05499008503644419], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ccb348ca-3b88-4823-90da-1915a1e64f9c", 3, 0, 0.0, 274.0, 183, 377, 262.0, 377.0, 377.0, 377.0, 0.04530695461753379, 0.02912800630521785, 0.029054264517103374], "isController": false}, {"data": ["register", 25, 7, 28.0, 909.52, 149, 1520, 926.0, 1346.8000000000006, 1516.1, 1520.0, 0.10527423939362039, 0.03309558900936941, 0.04749677597641857], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 3.240740740740741, 1.088646967340591], "isController": false}, {"data": ["401/Unauthorized", 15, 6.944444444444445, 2.332814930015552], "isController": false}, {"data": ["404/Not Found", 194, 89.81481481481481, 30.171073094867808], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 643, 216, "404/Not Found", 194, "401/Unauthorized", 15, "406/Not Acceptable", 7, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 62, 62, "404/Not Found", 62, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 11, "404/Not Found", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
