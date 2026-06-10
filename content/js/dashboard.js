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

    var data = {"OkPercent": 99.09774436090225, "KoPercent": 0.9022556390977443};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7866839043309631, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.12280701754385964, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2023b0e-f409-45ae-89ce-33f93c878e7e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f7141f03-6225-41bc-b01b-2e8e9ddd9d35"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/03f3d55f-8276-46b1-8513-58636d03c3af"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/317aeb49-3c48-4901-b956-cd63c3b8dc6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80e568f6-03a5-4494-9637-91c2f420e07d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bdaa4bcd-2979-4059-9862-521808e469f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8b4f346-e835-4b4b-9da3-afa1eba4f118"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d9ffda4-bfbe-4f49-afd9-ca826c04801b"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b285cd7-c76f-496a-afa6-5210dfb22cfc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7d9ffda4-bfbe-4f49-afd9-ca826c04801b"], "isController": false}, {"data": [0.6739130434782609, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8b4f346-e835-4b4b-9da3-afa1eba4f118"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3bdaa617-2405-49d9-834b-fde3787c7b29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=317aeb49-3c48-4901-b956-cd63c3b8dc6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f3920af7-82e9-4fb4-83f2-dde6ea44b792"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e153b42-c6ef-48dd-b7b5-dab6dd7ae89e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f2023b0e-f409-45ae-89ce-33f93c878e7e"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d24a443-67f9-4c3d-b00c-d5992831b595"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b285cd7-c76f-496a-afa6-5210dfb22cfc"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03f3d55f-8276-46b1-8513-58636d03c3af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d97cd4fc-d53e-4a48-9207-66019d3fa9e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7141f03-6225-41bc-b01b-2e8e9ddd9d35"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bdaa4bcd-2979-4059-9862-521808e469f9"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3bdaa617-2405-49d9-834b-fde3787c7b29"], "isController": false}, {"data": [0.30833333333333335, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9491525423728814, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80e568f6-03a5-4494-9637-91c2f420e07d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a7a0553-e9e0-4f19-9130-8ef291e4b374"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/877acaf9-b964-49e1-8725-0b6aa884ac05"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e153b42-c6ef-48dd-b7b5-dab6dd7ae89e"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3242ff25-3d8f-4739-b3ce-96c2175e1e88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3920af7-82e9-4fb4-83f2-dde6ea44b792"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7d24a443-67f9-4c3d-b00c-d5992831b595"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02848e0c-e77f-4dd1-856d-da213b012041"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1330, 12, 0.9022556390977443, 377.08796992481206, 98, 2805, 125.0, 1013.0, 1243.9, 1855.4500000000003, 5.2715439678475455, 752.6226581512735, 3.8461810599469675], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1691.6491228070172, 1224, 2557, 1635.0, 2084.2000000000003, 2238.2999999999997, 2557.0, 0.25228718248330256, 303.58610790450047, 1.2404941052767857], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2023b0e-f409-45ae-89ce-33f93c878e7e", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7141f03-6225-41bc-b01b-2e8e9ddd9d35", 3, 0, 0.0, 625.3333333333334, 255, 1041, 580.0, 1041.0, 1041.0, 1041.0, 0.017976235416779018, 0.024781691728534876, 0.01152772909214019], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03f3d55f-8276-46b1-8513-58636d03c3af", 3, 0, 0.0, 1117.3333333333333, 233, 2585, 534.0, 2585.0, 2585.0, 2585.0, 0.016550993611316466, 0.022816880841121493, 0.010613755668715311], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 870.2307692307692, 465, 2222, 500.0, 2076.0, 2222.0, 2222.0, 0.09543946201509412, 0.01724248093046134, 0.06486900933838428], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 870.2307692307692, 465, 2222, 500.0, 2076.0, 2222.0, 2222.0, 0.0960969840331165, 0.01736127152942046, 0.06531591883500887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 153.49999999999997, 99, 320, 103.0, 308.8, 320.0, 320.0, 0.0808656669648588, 0.029228911118523795, 0.04569423490970843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 103.75, 102, 107, 104.0, 105.6, 107.0, 107.0, 0.080863623498969, 0.060094938947964256, 0.04058974851413092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 183.37500000000003, 101, 612, 103.0, 397.10000000000025, 612.0, 612.0, 0.08086525826341857, 1.5065004138026887, 0.04718456231678965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 190.375, 100, 1099, 103.0, 545.3000000000005, 1099.0, 1099.0, 0.08086403218388481, 4.568033066124035, 0.04710487812274149], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 289.53333333333336, 183, 1145, 220.0, 638.0000000000002, 1145.0, 1145.0, 0.080291619160792, 0.16954286301179217, 0.05190727723090264], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/317aeb49-3c48-4901-b956-cd63c3b8dc6a", 3, 0, 0.0, 292.3333333333333, 220, 422, 235.0, 422.0, 422.0, 422.0, 0.02757276913320405, 0.027653548730273984, 0.01768175624752994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80e568f6-03a5-4494-9637-91c2f420e07d", 3, 0, 0.0, 282.6666666666667, 196, 443, 209.0, 443.0, 443.0, 443.0, 0.04935590543408519, 0.0317310915469786, 0.03165075966964447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bdaa4bcd-2979-4059-9862-521808e469f9", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 0.8812881097560976, 3.363185975609756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 126.27777777777779, 99, 306, 104.0, 304.2, 306.0, 306.0, 0.08134196160659413, 0.06045042263927551, 0.04082985182205994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 126.05555555555556, 100, 319, 103.0, 302.8, 319.0, 319.0, 0.08134710811030668, 0.028554459064327485, 0.0460137233701203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 780.6, 588, 911, 803.0, 911.0, 911.0, 911.0, 0.0771855076490838, 22.6951020488893, 0.04401985983111811], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 978.4, 696, 1113, 1071.0, 1113.0, 1113.0, 1113.0, 0.07705703761924576, 69.33605790162127, 0.043871340753926055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 182.8, 102, 303, 104.0, 303.0, 303.0, 303.0, 0.07752659162092597, 0.13718572657921668, 0.042927321727602566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 107.16666666666667, 101, 147, 103.5, 135.00000000000006, 147.0, 147.0, 0.055824858809627925, 0.041487028861452, 0.02802146233217652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8b4f346-e835-4b4b-9da3-afa1eba4f118", 3, 0, 0.0, 381.6666666666667, 209, 473, 463.0, 473.0, 473.0, 473.0, 0.021074075374942925, 0.02490884364792245, 0.013514299638228373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 159.83333333333331, 101, 311, 106.5, 309.8, 311.0, 311.0, 0.05577270762552345, 0.028884888617255147, 0.031027199652350124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 315.08333333333337, 102, 1298, 109.0, 1267.1000000000001, 1298.0, 1298.0, 0.05582589763391237, 8.384579157052206, 0.03201993217153437], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d9ffda4-bfbe-4f49-afd9-ca826c04801b", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.8287342316513762, 3.162629013761468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 206.25, 98, 610, 107.5, 606.7, 610.0, 610.0, 0.05582719621863791, 2.748380865926336, 0.03207519574410674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 145.8, 102, 318, 103.0, 318.0, 318.0, 318.0, 0.07776775437832456, 0.05779420027529785, 0.04366841676517249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 169.16666666666669, 98, 698, 103.0, 347.00000000000057, 698.0, 698.0, 0.08134674048130155, 4.0871485213535195, 0.047434611908258956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 739.1874999999999, 99, 1303, 970.0, 1237.9, 1303.0, 1303.0, 0.09363789057242013, 52.669175960958846, 0.05001945912413458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 214.94444444444443, 98, 901, 105.5, 366.40000000000083, 901.0, 901.0, 0.08134710811030668, 1.3495269863382051, 0.047514266813995315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 569.625, 101, 904, 749.5, 843.1, 904.0, 904.0, 0.0936373425722178, 17.217269176635142, 0.050110609110913425], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 461.61538461538464, 205, 1196, 423.0, 947.9999999999998, 1196.0, 1196.0, 0.09623285389632019, 0.017385818330878162, 0.06634804184648639], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 443.75, 207, 1399, 216.0, 1370.2, 1399.0, 1399.0, 0.05574498527403306, 11.187058612948631, 0.12299463222245965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b285cd7-c76f-496a-afa6-5210dfb22cfc", 3, 0, 0.0, 319.6666666666667, 204, 457, 298.0, 457.0, 457.0, 457.0, 0.038394594041159004, 0.03163304606711375, 0.024621533288113034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d9ffda4-bfbe-4f49-afd9-ca826c04801b", 3, 0, 0.0, 1045.3333333333333, 210, 2486, 440.0, 2486.0, 2486.0, 2486.0, 0.06502937159950578, 0.029424097175557624, 0.04170177801140181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 569.8260869565217, 109, 1466, 579.0, 1030.2000000000003, 1396.599999999999, 1466.0, 0.10429420033555525, 0.06406352735455494, 0.047156459722033285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 118.56250000000001, 102, 304, 104.5, 172.40000000000015, 304.0, 304.0, 0.09362967124281685, 0.06958220685135119, 0.04699770607305455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 154.8125, 101, 310, 103.5, 308.6, 310.0, 310.0, 0.09363679457842959, 0.11295395556934097, 0.04848721711446513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8b4f346-e835-4b4b-9da3-afa1eba4f118", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["login", 23, 0, 0.0, 2877.4347826086955, 1471, 5522, 2752.0, 4133.400000000001, 5294.599999999997, 5522.0, 0.1029082774049217, 26.906123287192393, 0.19236315016778524], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3bdaa617-2405-49d9-834b-fde3787c7b29", 3, 0, 0.0, 299.0, 183, 432, 282.0, 432.0, 432.0, 432.0, 0.021256997094877064, 0.025125050928222207, 0.013631602954722597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=317aeb49-3c48-4901-b956-cd63c3b8dc6a", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 108.55555555555556, 103, 129, 106.5, 117.30000000000001, 129.0, 129.0, 0.08017031738537872, 0.06490350889890523, 0.02849804250808384], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3920af7-82e9-4fb4-83f2-dde6ea44b792", 3, 0, 0.0, 291.6666666666667, 226, 414, 235.0, 414.0, 414.0, 414.0, 0.02382824600281173, 0.028164180089911915, 0.01528048327654268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 886.9999999999999, 206, 1413, 1074.0, 1345.1000000000001, 1413.0, 1413.0, 0.09357327079519735, 70.02073461231424, 0.195484980027955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e153b42-c6ef-48dd-b7b5-dab6dd7ae89e", 3, 0, 0.0, 348.6666666666667, 246, 434, 366.0, 434.0, 434.0, 434.0, 0.03461285521442664, 0.028855313217495644, 0.022196394782688957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2023b0e-f409-45ae-89ce-33f93c878e7e", 3, 0, 0.0, 985.3333333333334, 218, 2438, 300.0, 2438.0, 2438.0, 2438.0, 0.0203069050246052, 0.024002074265736157, 0.013022331672679766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 357.75000000000006, 206, 1206, 304.5, 650.2000000000005, 1206.0, 1206.0, 0.08082114281095935, 6.160564972937546, 0.18047621648448234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1125.0, 799, 1430, 1176.0, 1430.0, 1430.0, 1430.0, 0.07693491306354824, 92.04090292737345, 0.17347921314817666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d24a443-67f9-4c3d-b00c-d5992831b595", 1, 0, 0.0, 339.0, 339, 339, 339.0, 339.0, 339.0, 339.0, 2.949852507374631, 0.5329323377581121, 2.033785029498525], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1232.4782608695652, 142, 2805, 1111.0, 2227.4, 2704.9999999999986, 2805.0, 0.10583325280803228, 0.033504277043847175, 0.047748987106748936], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 366.0, 206, 1004, 311.0, 664.7000000000005, 1004.0, 1004.0, 0.08130411805357941, 5.522782479583633, 0.18169917702164948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 132.11764705882354, 104, 306, 108.0, 304.4, 306.0, 306.0, 0.10099209885344264, 0.07840695174656924, 0.035899535139309685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b285cd7-c76f-496a-afa6-5210dfb22cfc", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 417.11764705882354, 206, 1415, 407.0, 779.7999999999995, 1415.0, 1415.0, 0.12449469799050912, 8.942707036513562, 0.2781177797652177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03f3d55f-8276-46b1-8513-58636d03c3af", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 127.11111111111111, 102, 304, 104.0, 304.0, 304.0, 304.0, 0.04838267470177457, 0.03595626508598677, 0.02428583476241419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 125.77777777777777, 102, 307, 103.0, 307.0, 307.0, 307.0, 0.04833045140641614, 0.020997735181346594, 0.027112460261628845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 225.33333333333331, 101, 1000, 103.0, 1000.0, 1000.0, 1000.0, 0.048151259155426916, 4.825601531276918, 0.0278478961912354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 180.0, 100, 805, 102.0, 805.0, 805.0, 805.0, 0.048201288581114735, 1.5863014783067422, 0.027923901880921392], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1134.2280701754387, 794, 1822, 1019.0, 1613.0, 1733.8, 1822.0, 0.25121752352409704, 300.54349547698274, 0.49605647711496503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1232.4782608695652, 142, 2805, 1111.0, 2227.4, 2704.9999999999986, 2805.0, 0.10325940558498697, 0.03268945856155158, 0.04658773962916404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d97cd4fc-d53e-4a48-9207-66019d3fa9e9", 2, 0, 0.0, 248.0, 196, 300, 248.0, 300.0, 300.0, 300.0, 0.05757218112208181, 0.03381803412591036, 0.03578583328535652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 170.08333333333334, 100, 307, 104.5, 305.8, 307.0, 307.0, 0.05369151539827919, 0.014471541259692437, 0.031617171665197605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 153.58333333333331, 101, 307, 104.0, 306.1, 307.0, 307.0, 0.053691275167785234, 0.014471476510067114, 0.03156459731543624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 204.05882352941177, 100, 1002, 106.0, 445.99999999999955, 1002.0, 1002.0, 0.09666835362421031, 5.141131575935835, 0.05634174608635327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 150.47058823529412, 98, 506, 103.0, 346.79999999999984, 506.0, 506.0, 0.09694232501910334, 1.7013133011998038, 0.056596096574514435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 118.66666666666666, 100, 302, 101.5, 243.20000000000022, 302.0, 302.0, 0.05374008607370453, 0.01437967146894047, 0.030648642838909616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 104.41176470588236, 99, 111, 104.0, 110.2, 111.0, 111.0, 0.09716451094815415, 0.07220917268705597, 0.04877202990952269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 153.50000000000003, 101, 309, 103.0, 307.8, 309.0, 309.0, 0.05374008607370453, 0.03993770068563393, 0.026975004142464967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 127.17647058823529, 101, 313, 103.0, 305.8, 313.0, 313.0, 0.09716617702534322, 0.03458419306347809, 0.05493505941425942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 126.75, 103, 315, 108.0, 256.8000000000002, 315.0, 315.0, 0.05417142547591854, 0.04263883684920932, 0.01925624889964292], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 695.9999999999999, 414, 2438, 457.0, 1879.1999999999994, 2438.0, 2438.0, 0.0954219485161887, 0.0172393168706005, 0.06495029112869485], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7141f03-6225-41bc-b01b-2e8e9ddd9d35", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1622.9130434782612, 948, 2733, 1519.0, 2611.2000000000003, 2723.6, 2733.0, 0.10162826149393545, 0.052600565031040804, 0.046745030433245696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bdaa4bcd-2979-4059-9862-521808e469f9", 3, 0, 0.0, 691.6666666666666, 209, 1145, 721.0, 1145.0, 1145.0, 1145.0, 0.0744158356898348, 0.032944510591853944, 0.04772109254849432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 325.5833333333333, 206, 613, 209.5, 612.1, 613.0, 613.0, 0.05366678294469638, 0.0831730317707355, 0.12069785265784742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3bdaa617-2405-49d9-834b-fde3787c7b29", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["addBook", 60, 7, 11.666666666666666, 1105.3166666666668, 524, 2763, 876.0, 1829.9, 1877.8, 2763.0, 0.26828112284592615, 91.97171621809692, 0.9738028374082256], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 177.26315789473685, 101, 423, 104.0, 411.2, 416.5, 423.0, 0.25232515416181567, 0.18751898663783373, 0.12197358526376832], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 663.7192982456137, 492, 936, 608.0, 821.2, 914.2, 936.0, 0.2519103199261063, 74.06999826811655, 0.12669317847846168], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 146.0701754385965, 101, 412, 105.0, 307.2, 311.5, 412.0, 0.25249393128621295, 0.4467959018463065, 0.12279490017630279], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 954.6491228070176, 689, 1409, 908.0, 1233.6000000000001, 1320.4, 1409.0, 0.2517123060821642, 226.49117547576935, 0.12634777863889882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 125.3529411764706, 103, 320, 105.0, 202.3999999999999, 320.0, 320.0, 0.12149713052365263, 0.09076689926815847, 0.04318843311582965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 7, 3.9548022598870056, 174.49717514124285, 101, 1496, 109.0, 304.2000000000001, 407.59999999999997, 1300.2199999999998, 0.7283291224662788, 1.5730193987067016, 0.3502849664845158], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 129.11111111111111, 103, 310, 105.0, 310.0, 310.0, 310.0, 0.046403712296983764, 0.0359356873549884, 0.016495069605568447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80e568f6-03a5-4494-9637-91c2f420e07d", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 105.625, 102, 111, 106.0, 108.9, 111.0, 111.0, 0.08560452847955657, 0.06947008121729639, 0.030429734732967374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 353.8888888888889, 205, 1305, 208.0, 1305.0, 1305.0, 1305.0, 0.048123710017217596, 6.463260722229946, 0.10686325146509962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 345.47058823529403, 207, 1105, 223.0, 555.3999999999995, 1105.0, 1105.0, 0.09661121940407927, 6.9397801313344285, 0.21582684463495166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a7a0553-e9e0-4f19-9130-8ef291e4b374", 2, 0, 0.0, 295.5, 186, 405, 295.5, 405.0, 405.0, 405.0, 0.08860927739134287, 0.05213582971512117, 0.055077934628505604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/877acaf9-b964-49e1-8725-0b6aa884ac05", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 160.24999999999997, 104, 731, 107.0, 547.1000000000006, 731.0, 731.0, 0.05657868680867917, 0.04690947763727404, 0.020111955076522674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e153b42-c6ef-48dd-b7b5-dab6dd7ae89e", 1, 0, 0.0, 1196.0, 1196, 1196, 1196.0, 1196.0, 1196.0, 1196.0, 0.8361204013377926, 0.15105690844481606, 0.5764658235785953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 168.375, 104, 914, 107.5, 417.7000000000005, 914.0, 914.0, 0.09214785122729419, 0.07154056809150282, 0.03275568149095223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3242ff25-3d8f-4739-b3ce-96c2175e1e88", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.79833984375, 1.49169921875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3920af7-82e9-4fb4-83f2-dde6ea44b792", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d24a443-67f9-4c3d-b00c-d5992831b595", 3, 0, 0.0, 436.33333333333337, 210, 799, 300.0, 799.0, 799.0, 799.0, 0.0776940408670655, 0.036520245772149275, 0.049823326988319996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02848e0c-e77f-4dd1-856d-da213b012041", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.7112158964365256, 1.3289079899777283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 128.7058823529412, 102, 315, 103.0, 306.2, 315.0, 315.0, 0.12477064220183486, 0.09272505733944954, 0.06262901376146789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 174.41176470588238, 101, 311, 104.0, 307.8, 311.0, 311.0, 0.12477338950582398, 0.044410381512987436, 0.07054341104758269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 209.0588235294118, 99, 1111, 103.0, 467.79999999999944, 1111.0, 1111.0, 0.12477522110903151, 6.635944495669565, 0.07272342563029836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 256.70588235294116, 100, 796, 304.0, 476.7999999999997, 796.0, 796.0, 0.12459141345294109, 2.1865478147032524, 0.07273796730941179], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 41.666666666666664, 0.37593984962406013], "isController": false}, {"data": ["401/Unauthorized", 7, 58.333333333333336, 0.5263157894736842], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1330, 12, "401/Unauthorized", 7, "406/Not Acceptable", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
