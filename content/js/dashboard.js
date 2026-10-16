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

    var data = {"OkPercent": 98.73617693522907, "KoPercent": 1.263823064770932};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7760736196319018, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.12264150943396226, 500, 1500, "see books"], "isController": true}, {"data": [0.5909090909090909, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/112fdf08-7517-465e-a35e-c27bbda37d23"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/be75f0a9-53de-46e1-8f5b-cd462882f42d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bd10d82a-5cdf-4b57-94ab-6391afdd6783"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0d53ab39-b993-4696-b6ba-e02b31f7cb08"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c939efe6-0eb2-4d2c-9f0a-b46b0b31c8dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b02dfb4-6d68-428c-9458-c55ba0e78a96"], "isController": false}, {"data": [0.5476190476190477, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea035e7f-6550-47cf-9813-34d03a65ec9e"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e1f36a7-9fc5-460c-88d7-c8ae0387123e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2c76571b-19d8-41d2-b39f-619c95a11024"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/db4bff72-7a56-4c27-9e1b-d403c34ebbbe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb12b543-fb41-4693-9544-6e613eab3262"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa7f9a04-0fba-48c2-ab7f-d7e97abcace9"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c762d9c1-a2fd-4a22-90ca-71fe45080abb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd10d82a-5cdf-4b57-94ab-6391afdd6783"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be75f0a9-53de-46e1-8f5b-cd462882f42d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.42452830188679247, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3b02dfb4-6d68-428c-9458-c55ba0e78a96"], "isController": false}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d53ab39-b993-4696-b6ba-e02b31f7cb08"], "isController": false}, {"data": [0.6037735849056604, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.46226415094339623, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9277456647398844, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=112fdf08-7517-465e-a35e-c27bbda37d23"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c9f9081-8f79-41dc-aca1-af293726c23b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7e1f36a7-9fc5-460c-88d7-c8ae0387123e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc0052c4-d70a-46a4-8887-0d5302a7faa2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c76571b-19d8-41d2-b39f-619c95a11024"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/47a900ec-06b2-4d62-aec0-48636bcbe4fc"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ea035e7f-6550-47cf-9813-34d03a65ec9e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db4bff72-7a56-4c27-9e1b-d403c34ebbbe"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aa7f9a04-0fba-48c2-ab7f-d7e97abcace9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bb12b543-fb41-4693-9544-6e613eab3262"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1266, 16, 1.263823064770932, 399.0205371248028, 90, 6035, 127.0, 1060.6, 1295.549999999999, 2499.409999999987, 4.968212856133742, 698.060464555863, 3.629676094890511], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 1770.566037735849, 1274, 3958, 1687.0, 2258.0000000000005, 2469.2999999999997, 3958.0, 0.2569497638971037, 309.19613224701357, 1.2634199816620286], "isController": true}, {"data": ["deleteBook", 11, 0, 0.0, 716.7272727272726, 476, 2441, 526.0, 2110.4000000000015, 2441.0, 2441.0, 0.08420794769920922, 0.015213349926126666, 0.05723508945180626], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 716.7272727272726, 476, 2441, 526.0, 2110.4000000000015, 2441.0, 2441.0, 0.08512087163772557, 0.01537828247361253, 0.0578555924412666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 144.21428571428567, 91, 303, 101.5, 301.5, 303.0, 303.0, 0.17996940520111582, 0.08677096322196655, 0.1004795702587703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 117.07142857142858, 95, 293, 101.5, 219.0, 293.0, 293.0, 0.17997171872991388, 0.13374851362643012, 0.0903373666281013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 203.42857142857142, 94, 733, 101.5, 616.5, 733.0, 733.0, 0.1799740323181941, 7.601341851032922, 0.10377129960534266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 218.14285714285717, 91, 998, 97.5, 932.0, 998.0, 998.0, 0.17998097343995062, 23.176894179222483, 0.10359953912015016], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 331.00000000000006, 102, 1012, 249.0, 787.1999999999998, 1012.0, 1012.0, 0.06953507777231006, 0.13670913878131755, 0.04494811780579388], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/112fdf08-7517-465e-a35e-c27bbda37d23", 3, 0, 0.0, 611.6666666666666, 215, 1063, 557.0, 1063.0, 1063.0, 1063.0, 0.041550095565219804, 0.026712707923603224, 0.026645080814935874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be75f0a9-53de-46e1-8f5b-cd462882f42d", 3, 0, 0.0, 792.6666666666666, 475, 1012, 891.0, 1012.0, 1012.0, 1012.0, 0.06249609399412537, 0.028277855029893963, 0.04007724777618066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 10, 0, 0.0, 101.9, 98, 108, 102.5, 107.6, 108.0, 108.0, 0.110695388430118, 0.08226483456574199, 0.05556389614558658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 10, 0, 0.0, 118.3, 93, 294, 99.5, 275.20000000000005, 294.0, 294.0, 0.1106941630967799, 0.06287082544637422, 0.06127094887036607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 790.2, 572, 1024, 798.0, 1024.0, 1024.0, 1024.0, 0.04542274952987454, 13.3557965390136, 0.025905161841256574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1162.6, 1044, 1425, 1105.0, 1425.0, 1425.0, 1425.0, 0.04528206196397359, 40.74487895255798, 0.025780705200191996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 136.2, 91, 292, 100.0, 292.0, 292.0, 292.0, 0.045695902905345503, 0.08086032818797467, 0.025302321237627837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 113.20000000000002, 97, 290, 101.0, 178.40000000000006, 290.0, 290.0, 0.10986033089931667, 0.08164424981873045, 0.05514473640844606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 139.06666666666666, 94, 303, 101.0, 298.2, 303.0, 303.0, 0.10986113552469678, 0.04039685504189371, 0.06204007093367317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 218.80000000000004, 92, 1113, 101.0, 628.2000000000003, 1113.0, 1113.0, 0.10985791709389191, 6.617659259649187, 0.06395504522484254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 196.73333333333332, 96, 763, 102.0, 487.00000000000017, 763.0, 763.0, 0.10985952628572265, 2.1811264309203295, 0.06406326672794387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 137.6, 94, 294, 99.0, 294.0, 294.0, 294.0, 0.04569799111631053, 0.03396110472608624, 0.025660493058475148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 579.0909090909091, 95, 1198, 346.0, 1175.6, 1196.35, 1198.0, 0.11291663672664935, 46.19959531254812, 0.0619718260159931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 10, 0, 0.0, 350.79999999999995, 97, 1209, 101.5, 1199.0, 1209.0, 1209.0, 0.11045940064729208, 19.902130382134295, 0.06303952513503662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 408.18181818181813, 94, 810, 360.0, 792.2, 807.5999999999999, 810.0, 0.11302395594120698, 15.122432718637137, 0.06214110077626908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 10, 0, 0.0, 312.0, 90, 820, 200.5, 818.0, 820.0, 820.0, 0.1104459808707561, 6.518772020167436, 0.06313972382982483], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 589.7272727272727, 203, 1136, 437.0, 1134.8, 1136.0, 1136.0, 0.08606794673176534, 0.015549384907594324, 0.05933981483654915], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bd10d82a-5cdf-4b57-94ab-6391afdd6783", 3, 0, 0.0, 397.0, 219, 599, 373.0, 599.0, 599.0, 599.0, 0.12497917013831028, 0.05654981982169638, 0.08014614751708048], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d53ab39-b993-4696-b6ba-e02b31f7cb08", 3, 0, 0.0, 339.0, 224, 509, 284.0, 509.0, 509.0, 509.0, 0.03785202382154033, 0.031555674806954676, 0.024273596005349753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 375.2, 200, 1214, 392.0, 839.6000000000003, 1214.0, 1214.0, 0.10977591077413973, 8.914132710842933, 0.24501611647590055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c939efe6-0eb2-4d2c-9f0a-b46b0b31c8dd", 2, 0, 0.0, 227.0, 217, 237, 227.0, 237.0, 237.0, 237.0, 0.015464674816550296, 0.026157047638930772, 0.009612563985092054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b02dfb4-6d68-428c-9458-c55ba0e78a96", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 0.889970751231527, 3.3963208128078817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 985.1428571428571, 178, 2744, 885.0, 1971.4000000000003, 2675.999999999999, 2744.0, 0.09429853118811658, 0.05792360948957552, 0.042636933535251935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 122.77272727272728, 97, 307, 103.5, 244.8999999999999, 304.74999999999994, 307.0, 0.11301292456900981, 0.08398714413771138, 0.056727190652803745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 171.09090909090912, 96, 320, 102.5, 304.7, 318.2, 320.0, 0.11302105273973306, 0.10740210835636566, 0.060142772560543324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea035e7f-6550-47cf-9813-34d03a65ec9e", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 0.6948617788461539, 2.6517427884615383], "isController": false}, {"data": ["login", 21, 0, 0.0, 3902.904761904762, 1963, 8111, 4017.0, 5712.6, 7891.799999999997, 8111.0, 0.09316067554798439, 26.66443174621923, 0.17734059958876217], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 10, 0, 0.0, 106.19999999999999, 98, 112, 106.0, 111.9, 112.0, 112.0, 0.1148105625717566, 0.0929472230195178, 0.04081156716417911], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e1f36a7-9fc5-460c-88d7-c8ae0387123e", 1, 0, 0.0, 1018.0, 1018, 1018, 1018.0, 1018.0, 1018.0, 1018.0, 0.9823182711198427, 0.17746960952848723, 0.6772624017681729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c76571b-19d8-41d2-b39f-619c95a11024", 3, 0, 0.0, 744.3333333333334, 313, 1462, 458.0, 1462.0, 1462.0, 1462.0, 0.024686278543509566, 0.029178345505040115, 0.01583071898786258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db4bff72-7a56-4c27-9e1b-d403c34ebbbe", 3, 0, 0.0, 400.0, 339, 508, 353.0, 508.0, 508.0, 508.0, 0.017211308977418762, 0.023727178880002753, 0.011037200092941069], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb12b543-fb41-4693-9544-6e613eab3262", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 717.9999999999999, 199, 1298, 656.5, 1278.7, 1296.95, 1298.0, 0.1128506063155303, 61.46292456834643, 0.2406791650850483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa7f9a04-0fba-48c2-ab7f-d7e97abcace9", 3, 0, 0.0, 365.0, 253, 466, 376.0, 466.0, 466.0, 466.0, 0.025619566516934533, 0.025694623840714616, 0.01642921420519565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 382.7857142857143, 193, 1101, 206.5, 1035.5, 1101.0, 1101.0, 0.17973604477995173, 30.956875786345197, 0.3976609841190366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, 16.666666666666668, 1100.8333333333333, 102, 1528, 1218.0, 1528.0, 1528.0, 1528.0, 0.047744851513511787, 47.601663584802814, 0.09485248332908934], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1713.2380952380954, 195, 4130, 1352.0, 3414.2000000000003, 4065.7999999999993, 4130.0, 0.09573609661139806, 0.0302380751573947, 0.04319343421334561], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c762d9c1-a2fd-4a22-90ca-71fe45080abb", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.8294439935064934, 1.54981737012987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 119.42857142857142, 101, 292, 106.0, 202.0, 292.0, 292.0, 0.06968155529231412, 0.05409847310291966, 0.024769615357814787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 10, 0, 0.0, 525.1, 201, 1310, 398.5, 1299.8, 1310.0, 1310.0, 0.11032413230069946, 26.53398810705854, 0.24247606655854903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 334.88235294117646, 198, 598, 401.0, 453.1999999999999, 598.0, 598.0, 0.09017276040036705, 0.13975016675330326, 0.20280065156449742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd10d82a-5cdf-4b57-94ab-6391afdd6783", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 130.5, 95, 298, 103.0, 297.0, 298.0, 298.0, 0.07304144580324722, 0.05428177759401478, 0.03666338197545808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be75f0a9-53de-46e1-8f5b-cd462882f42d", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 113.92857142857143, 92, 298, 101.0, 201.0, 298.0, 298.0, 0.07304068366079906, 0.019544089182674747, 0.041656014900299465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 141.85714285714286, 91, 303, 100.5, 302.5, 303.0, 303.0, 0.07304144580324722, 0.019686952189156476, 0.04294038122417463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 128.7857142857143, 92, 309, 101.0, 305.0, 309.0, 309.0, 0.07304182688043576, 0.01968705490136745, 0.0430119351649441], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1221.3396226415095, 771, 3133, 1096.0, 1816.8000000000004, 2037.1, 3133.0, 0.24957971717438085, 298.58410968910846, 0.492822449342381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1713.2380952380954, 195, 4130, 1352.0, 3414.2000000000003, 4065.7999999999993, 4130.0, 0.09399842440736231, 0.02968923449473609, 0.04240944538691542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 124.71428571428571, 92, 286, 98.0, 286.0, 286.0, 286.0, 0.0499226199390944, 0.013455706155459038, 0.02939779279616594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 160.42857142857142, 100, 306, 102.0, 306.0, 306.0, 306.0, 0.04992119582658803, 0.013455322312635054, 0.029348203015240226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 212.57142857142856, 95, 1092, 101.5, 699.0, 1092.0, 1092.0, 0.06867693877450909, 4.431161984677685, 0.03995296242880899], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 151.21428571428572, 94, 601, 102.0, 453.0, 601.0, 601.0, 0.06867491746746525, 1.4595240307025934, 0.040018851878013725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 103.0, 98, 107, 103.0, 106.0, 107.0, 107.0, 0.06867458059452565, 0.05103648030511135, 0.03447142033748651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 123.14285714285714, 93, 282, 97.0, 282.0, 282.0, 282.0, 0.0499229759799167, 0.013358296307126148, 0.028471697238546242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 142.92857142857142, 93, 306, 101.0, 305.0, 306.0, 306.0, 0.06867559122325943, 0.025743765850571726, 0.0387545712190408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 101.57142857142857, 94, 109, 103.0, 109.0, 109.0, 109.0, 0.049917635900763736, 0.03709699308640743, 0.02505631333300055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 115.57142857142857, 103, 143, 108.0, 143.0, 143.0, 143.0, 0.0504242843353359, 0.03968942692800853, 0.017924257322326432], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 566.7272727272727, 429, 891, 509.0, 852.0000000000001, 891.0, 891.0, 0.08209200274635063, 0.014831074714916861, 0.05587707608809218], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 2127.999999999999, 1053, 6035, 1767.0, 4241.800000000001, 5874.799999999997, 6035.0, 0.0955405319332854, 0.04944968937953249, 0.043944912637282646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 263.28571428571433, 197, 410, 207.0, 410.0, 410.0, 410.0, 0.049881709089872585, 0.0773069065679959, 0.11218513284568025], "isController": false}, {"data": ["addBook", 60, 10, 16.666666666666668, 1074.8999999999996, 514, 2304, 917.5, 1761.4, 1860.6, 2304.0, 0.2874044978803918, 92.80430635223817, 1.043936962613465], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3b02dfb4-6d68-428c-9458-c55ba0e78a96", 3, 0, 0.0, 800.0, 204, 1713, 483.0, 1713.0, 1713.0, 1713.0, 0.058219643307652, 0.02634287246016806, 0.037334862407576316], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 188.0377358490566, 93, 651, 105.0, 408.6, 423.49999999999994, 651.0, 0.2508923245883946, 0.18645415919117994, 0.12128095768677276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d53ab39-b993-4696-b6ba-e02b31f7cb08", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 634.811320754717, 458, 937, 601.0, 841.0000000000001, 909.3, 937.0, 0.2508412648079171, 73.75566056739821, 0.1261555189219505], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 156.30188679245276, 95, 402, 105.0, 303.8, 310.0, 402.0, 0.25158426886288654, 0.44518622576127975, 0.12235250575558351], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1030.9056603773583, 634, 3027, 951.0, 1318.6000000000001, 1637.2999999999997, 3027.0, 0.25038384315578127, 225.29582219942128, 0.12568095252155426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 128.11764705882354, 100, 448, 106.0, 195.99999999999977, 448.0, 448.0, 0.08886333342045424, 0.06638715826821044, 0.03158813805180209], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 10, 5.780346820809249, 185.10982658959537, 93, 1142, 112.0, 353.2, 433.9999999999993, 866.7199999999966, 0.6890728186663055, 1.4487519517091394, 0.3332639821040221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 122.14285714285714, 103, 316, 105.5, 221.0, 316.0, 316.0, 0.0757309387931734, 0.05864710396776025, 0.026919982149135855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=112fdf08-7517-465e-a35e-c27bbda37d23", 1, 0, 0.0, 1130.0, 1130, 1130, 1130.0, 1130.0, 1130.0, 1130.0, 0.8849557522123894, 0.15987970132743365, 0.6101355088495576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c9f9081-8f79-41dc-aca1-af293726c23b", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 1.0609167358803988, 1.9823245431893688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e1f36a7-9fc5-460c-88d7-c8ae0387123e", 3, 0, 0.0, 497.0, 249, 638, 604.0, 638.0, 638.0, 638.0, 0.017673465059559575, 0.024364298348709245, 0.011333569715928504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 122.28571428571428, 100, 302, 109.5, 212.5, 302.0, 302.0, 0.17581092790496164, 0.14267468856349913, 0.06249529077871683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc0052c4-d70a-46a4-8887-0d5302a7faa2", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.6451231060606061, 1.2054135101010102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c76571b-19d8-41d2-b39f-619c95a11024", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.33149369266055045, 1.265051605504587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 276.57142857142856, 198, 608, 207.0, 603.0, 608.0, 608.0, 0.07300259680665784, 0.11313976673063085, 0.16418455121653613], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47a900ec-06b2-4d62-aec0-48636bcbe4fc", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 334.7857142857143, 201, 1200, 206.5, 806.0, 1200.0, 1200.0, 0.06863990037408746, 5.964293117808132, 0.15311830454543227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea035e7f-6550-47cf-9813-34d03a65ec9e", 3, 0, 0.0, 397.0, 195, 567, 429.0, 567.0, 567.0, 567.0, 0.10101690349518486, 0.046825543807663815, 0.06477972001481581], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db4bff72-7a56-4c27-9e1b-d403c34ebbbe", 1, 0, 0.0, 1136.0, 1136, 1136, 1136.0, 1136.0, 1136.0, 1136.0, 0.8802816901408451, 0.15903526628521128, 0.6069129621478874], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aa7f9a04-0fba-48c2-ab7f-d7e97abcace9", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 123.53333333333332, 101, 315, 110.0, 199.20000000000007, 315.0, 315.0, 0.1133298578843582, 0.09396196224982434, 0.04028522291983046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 111.54545454545455, 99, 152, 107.5, 129.4, 148.69999999999996, 152.0, 0.11060167310167311, 0.08586750987874034, 0.03931543848536036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb12b543-fb41-4693-9544-6e613eab3262", 3, 0, 0.0, 872.0, 450, 1470, 696.0, 1470.0, 1470.0, 1470.0, 0.022928417480625487, 0.022995590578713254, 0.014703444803656316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 112.76470588235294, 95, 292, 103.0, 143.9999999999999, 292.0, 292.0, 0.09031935862629568, 0.06712210147911232, 0.045336084310464826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 171.52941176470588, 95, 310, 100.0, 306.0, 310.0, 310.0, 0.09022396773166332, 0.024141960115698972, 0.05145585659696423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 157.76470588235293, 96, 308, 101.0, 305.6, 308.0, 308.0, 0.09032271775744631, 0.0243447950205617, 0.05309987899412371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 170.0, 94, 309, 101.0, 307.4, 309.0, 309.0, 0.0902225312196494, 0.02431779161779613, 0.05312908820844589], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 31.25, 0.3949447077409163], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07898894154818326], "isController": false}, {"data": ["401/Unauthorized", 10, 62.5, 0.7898894154818326], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1266, 16, "401/Unauthorized", 10, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
