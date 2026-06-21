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

    var data = {"OkPercent": 99.89539748953975, "KoPercent": 0.10460251046025104};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5849909584086799, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5849d5d-227b-4b3c-9691-d6b279a13fff"], "isController": false}, {"data": [0.01020408163265306, 500, 1500, "see books"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/e899c3b6-a4b1-48e6-934d-876de745b66c"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4dc48a0f-99fa-4b68-8805-14f2295bb7e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b8aaed39-169e-4ee0-8361-01dadc5f0ba8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.05555555555555555, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.05555555555555555, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5849d5d-227b-4b3c-9691-d6b279a13fff"], "isController": false}, {"data": [0.17647058823529413, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.0625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.09375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/eb890cd4-b5f4-4453-805a-1f6293cc5506"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8aaed39-169e-4ee0-8361-01dadc5f0ba8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/1bc4becc-5fa3-4505-ac2e-616619f96b8e"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/72b1c54b-08a5-46b5-950b-ef4eb20b52a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/6aaffa85-5eff-4bde-a588-fa158dc27dd6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6aaffa85-5eff-4bde-a588-fa158dc27dd6"], "isController": false}, {"data": [0.826530612244898, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb890cd4-b5f4-4453-805a-1f6293cc5506"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.05555555555555555, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.18695652173913044, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f9c144e-3eb4-4274-8183-039efb97300c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c72107c-43a0-49d1-bbc9-56353e0d1fd5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4b2170df-7746-400f-a2ba-b013fc23ca5d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1f890254-4fcc-423c-92df-d4879bf2e196"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/1c72107c-43a0-49d1-bbc9-56353e0d1fd5"], "isController": false}, {"data": [0.21875, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f890254-4fcc-423c-92df-d4879bf2e196"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72b1c54b-08a5-46b5-950b-ef4eb20b52a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dd7adac9-9bc1-4891-875e-893e0efcd628"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/48eb3a0f-9556-4c2c-b72e-9b1f26a2ea45"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52aed563-5d9f-41fb-b8a7-4c6f5192abd8"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48eb3a0f-9556-4c2c-b72e-9b1f26a2ea45"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/52aed563-5d9f-41fb-b8a7-4c6f5192abd8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.17647058823529413, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 956, 1, 0.10460251046025104, 1556.0491631799157, 77, 24111, 321.0, 4943.600000000007, 7352.999999999999, 15600.88, 3.7018393030009684, 586.1203261132623, 2.6988292594385284], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5849d5d-227b-4b3c-9691-d6b279a13fff", 1, 0, 0.0, 15594.0, 15594, 15594, 15594.0, 15594.0, 15594.0, 15594.0, 0.06412722842118763, 0.01158548560343722, 0.044212718032576634], "isController": false}, {"data": ["see books", 49, 0, 0.0, 7452.387755102042, 1423, 12609, 7843.0, 10395.0, 10994.0, 12609.0, 0.20520122283177686, 246.92551509694712, 1.0089728095292936], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 394.33333333333326, 160, 1021, 315.0, 971.2, 1021.0, 1021.0, 0.11932509724995427, 28.69880456140072, 0.2622588514362764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e899c3b6-a4b1-48e6-934d-876de745b66c", 1, 0, 0.0, 6475.0, 6475, 6475, 6475.0, 6475.0, 6475.0, 6475.0, 0.15444015444015444, 0.049318291505791506, 0.0921513030888031], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 6, 0, 0.0, 1820.6666666666665, 1022, 3376, 1192.0, 3376.0, 3376.0, 3376.0, 0.03721114846007864, 0.02888951467359621, 0.01322740042916858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4dc48a0f-99fa-4b68-8805-14f2295bb7e6", 1, 0, 0.0, 1084.0, 1084, 1084, 1084.0, 1084.0, 1084.0, 1084.0, 0.9225092250922509, 0.29459034824723246, 0.5504425161439114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 8, 0, 0.0, 206.125, 160, 317, 169.5, 317.0, 317.0, 317.0, 0.04887525812245696, 0.07574710414095626, 0.10992160103126795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 104.42857142857143, 80, 233, 82.0, 233.0, 233.0, 233.0, 0.04240239876427295, 0.031511938925402064, 0.021284016567222945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 146.0, 79, 235, 82.0, 235.0, 235.0, 235.0, 0.042363905952128786, 0.01133565452234696, 0.024160665113323446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 124.71428571428571, 80, 235, 81.0, 235.0, 235.0, 235.0, 0.04240342619683671, 0.011429048467116143, 0.024928576728999705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 79.85714285714286, 78, 82, 79.0, 82.0, 82.0, 82.0, 0.04240419680393511, 0.011429256169810635, 0.024970440110129756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8aaed39-169e-4ee0-8361-01dadc5f0ba8", 3, 0, 0.0, 4045.0, 1042, 8107, 2986.0, 8107.0, 8107.0, 8107.0, 0.03634733513454572, 0.016446222603196142, 0.023308675200213236], "isController": false}, {"data": ["https://demoqa.com/books", 49, 0, 0.0, 889.8775510204081, 622, 1341, 851.0, 1246.0, 1334.0, 1341.0, 0.21258780093104782, 254.3289173912006, 0.41977786472908074], "isController": false}, {"data": ["deleteBook", 9, 0, 0.0, 5573.777777777777, 1006, 14014, 5265.0, 14014.0, 14014.0, 14014.0, 0.04991265285749938, 0.009017422635388071, 0.03392500623908161], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 9, 0, 0.0, 5573.777777777777, 1006, 14014, 5265.0, 14014.0, 14014.0, 14014.0, 0.04987614091672347, 0.009010826239837736, 0.03390018952933548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5849d5d-227b-4b3c-9691-d6b279a13fff", 3, 0, 0.0, 6780.333333333334, 1597, 11471, 7273.0, 11471.0, 11471.0, 11471.0, 0.01819549237002353, 0.015168833320192143, 0.011668333323224726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 17, 1, 5.882352941176471, 5202.117647058823, 1022, 15310, 4835.0, 12632.399999999998, 15310.0, 15310.0, 0.07089507112443753, 0.02283889929146632, 0.03198586216747084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 121.46666666666667, 78, 238, 80.0, 236.8, 238.0, 238.0, 0.07611547224576164, 0.020366835347010438, 0.04340960526516094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 131.25, 78, 236, 81.5, 235.7, 236.0, 236.0, 0.0882223202470225, 0.023778672254080282, 0.05195122959858844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 80.80000000000001, 79, 83, 81.0, 82.4, 83.0, 83.0, 0.07611469977825251, 0.05656570950317398, 0.038206011412130654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 132.33333333333331, 77, 246, 80.0, 242.70000000000002, 246.0, 246.0, 0.08822296884994008, 0.02377884707283541, 0.051865456296546805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 152.00000000000003, 77, 240, 82.0, 238.2, 240.0, 240.0, 0.07611508601004718, 0.020515394276145533, 0.04482167662505709], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 121.33333333333334, 78, 238, 80.0, 237.4, 238.0, 238.0, 0.07605410996410246, 0.02049895932626199, 0.04471149824061492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 6, 0, 0.0, 131.83333333333331, 79, 236, 80.0, 236.0, 236.0, 236.0, 0.03572449271220349, 0.009628867176336096, 0.021002094348385254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 6, 0, 0.0, 144.5, 79, 316, 80.0, 316.0, 316.0, 316.0, 0.03567415229295614, 0.009615298860210834, 0.02100733772719976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 132.58333333333334, 77, 247, 80.5, 244.0, 247.0, 247.0, 0.08811931355054743, 0.023578800696142578, 0.05025554600929659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 6, 0, 0.0, 81.33333333333333, 79, 83, 81.5, 83.0, 83.0, 83.0, 0.03572364190621353, 0.026548526846316894, 0.01793159369120484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 106.66666666666667, 78, 240, 80.5, 239.7, 240.0, 240.0, 0.08822037449548974, 0.06556221190533953, 0.04428249266668137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 6, 0, 0.0, 131.83333333333331, 78, 238, 80.0, 238.0, 238.0, 238.0, 0.0356909166617096, 0.009550108559871512, 0.02035497590863125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 2463.5, 82, 4913, 2874.0, 4871.900000000001, 4913.0, 4913.0, 0.08385216862671112, 0.06600082804016519, 0.029806825566526213], "isController": false}, {"data": ["deleteAccount", 8, 0, 0.0, 9987.875, 1490, 18363, 9912.5, 18363.0, 18363.0, 18363.0, 0.046389989040365086, 0.008381003879362834, 0.03157599839954538], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 16, 0, 0.0, 6577.562500000001, 999, 19942, 4336.5, 18128.300000000003, 19942.0, 19942.0, 0.06804717370316972, 0.03521972857683589, 0.03129904181073529], "isController": false}, {"data": ["goToProfile", 9, 0, 0.0, 2153.777777777778, 332, 3731, 1782.0, 3731.0, 3731.0, 3731.0, 0.05079465414484378, 0.07278582927916742, 0.03283795023817049], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 279.41666666666663, 161, 475, 312.5, 475.0, 475.0, 475.0, 0.08806628455684312, 0.13648554061690432, 0.19806313802188447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb890cd4-b5f4-4453-805a-1f6293cc5506", 2, 0, 0.0, 2203.0, 1250, 3156, 2203.0, 3156.0, 3156.0, 3156.0, 0.015406658757915172, 0.017874131449612522, 0.009576502245520514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8aaed39-169e-4ee0-8361-01dadc5f0ba8", 1, 0, 0.0, 939.0, 939, 939, 939.0, 939.0, 939.0, 939.0, 1.0649627263045793, 0.19240049254526093, 0.734241879659212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1bc4becc-5fa3-4505-ac2e-616619f96b8e", 1, 0, 0.0, 3433.0, 3433, 3433, 3433.0, 3433.0, 3433.0, 3433.0, 0.29129041654529564, 0.0930194982522575, 0.17380707471599185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72b1c54b-08a5-46b5-950b-ef4eb20b52a2", 3, 0, 0.0, 3714.666666666667, 1313, 8341, 1490.0, 8341.0, 8341.0, 8341.0, 0.025096412049623974, 0.016134574804038848, 0.016093727779218497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 80.39999999999999, 79, 82, 81.0, 81.4, 82.0, 82.0, 0.12014609765474818, 0.08928826202662438, 0.06030770917435602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 121.26666666666667, 78, 238, 80.0, 238.0, 238.0, 238.0, 0.11999424027646674, 0.06815297865702447, 0.06641868690302866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 479.6626478384992, 0.930362969004894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6aaffa85-5eff-4bde-a588-fa158dc27dd6", 3, 0, 0.0, 4003.0, 271, 9956, 1782.0, 9956.0, 9956.0, 9956.0, 0.019002736394040744, 0.01584179944828722, 0.012185999575605552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 1, 0, 0.0, 860.0, 860, 860, 860.0, 860.0, 860.0, 860.0, 1.1627906976744187, 1046.2811137354652, 0.6620185319767442], "isController": false}, {"data": ["addBook", 33, 0, 0.0, 15567.60606060606, 1671, 26448, 15184.0, 23514.600000000002, 25006.699999999993, 26448.0, 0.1523777860892934, 72.4167311674909, 0.5489333987865187], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 22.399129746835442, 7.008999208860759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 3, 0, 0.0, 80.33333333333333, 80, 81, 80.0, 81.0, 81.0, 81.0, 0.025589409396431128, 0.01901712944402743, 0.01284468401344297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 3, 0, 0.0, 133.0, 80, 238, 81.0, 238.0, 238.0, 238.0, 0.025589191125668515, 0.006847107781673021, 0.014593835563857828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 3, 0, 0.0, 79.66666666666667, 79, 80, 80.0, 80.0, 80.0, 80.0, 0.025589409396431128, 0.006897145501381828, 0.015043773883448769], "isController": false}, {"data": ["https://demoqa.com/books-0", 49, 0, 0.0, 149.73469387755097, 78, 329, 81.0, 323.0, 326.0, 329.0, 0.21309536234909368, 0.158364815183262, 0.10300996519804823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 3, 0, 0.0, 184.0, 79, 237, 236.0, 237.0, 237.0, 237.0, 0.02555518642508497, 0.0068879213411361835, 0.015048610756177966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6aaffa85-5eff-4bde-a588-fa158dc27dd6", 1, 0, 0.0, 3998.0, 3998, 3998, 3998.0, 3998.0, 3998.0, 3998.0, 0.2501250625312656, 0.04518860992996498, 0.1724495060030015], "isController": false}, {"data": ["https://demoqa.com/books-3", 49, 0, 0.0, 505.3265306122449, 387, 721, 469.0, 636.0, 703.0, 721.0, 0.21307034365202568, 62.64975563494962, 0.10715940134843088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 9.40714003164557, 7.107891613924051], "isController": false}, {"data": ["https://demoqa.com/books-1", 49, 0, 0.0, 125.18367346938777, 78, 331, 83.0, 239.0, 307.5, 331.0, 0.2133588783418967, 0.37754520269093444, 0.10376242325611774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 610.0625, 79, 1310, 812.0, 1027.2000000000003, 1310.0, 1310.0, 0.07687392196335997, 43.23982629196235, 0.04106448761128701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 261.0, 78, 939, 80.0, 890.4, 939.0, 939.0, 0.11940203461066977, 21.513378189526847, 0.06814311428366739], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb890cd4-b5f4-4453-805a-1f6293cc5506", 1, 0, 0.0, 3862.0, 3862, 3862, 3862.0, 3862.0, 3862.0, 3862.0, 0.2589331952356292, 0.04677992296737442, 0.17852230062143967], "isController": false}, {"data": ["https://demoqa.com/books-2", 49, 0, 0.0, 737.612244897959, 540, 1013, 704.0, 944.0, 1007.5, 1013.0, 0.2129249808802058, 191.59027207820213, 0.10687835954338455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 422.5625, 78, 696, 621.5, 695.3, 696.0, 696.0, 0.07693306342650248, 14.145822865227696, 0.041171209724339214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 207.60000000000002, 77, 612, 82.0, 527.4000000000001, 612.0, 612.0, 0.11978151851023731, 7.0697766024770825, 0.06847666107020794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 8, 0, 0.0, 3339.25, 1032, 5041, 3878.5, 5041.0, 5041.0, 5041.0, 0.05062874573611032, 0.037823232898558976, 0.017996936960882965], "isController": false}, {"data": ["deleteBooks", 9, 0, 0.0, 5621.777777777777, 939, 15594, 3998.0, 15594.0, 15594.0, 15594.0, 0.05281194254060652, 0.009541220087902544, 0.0364113588219416], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 115, 0, 0.0, 4855.373913043477, 80, 24111, 3362.0, 11458.400000000003, 15625.599999999999, 23510.84000000001, 0.45669353877923835, 1.1961407224196814, 0.2097431781402645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 1780.857142857143, 84, 4782, 1640.0, 4782.0, 4782.0, 4782.0, 0.04220528651360216, 0.03268436738797511, 0.015002660440382018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f9c144e-3eb4-4274-8183-039efb97300c", 1, 0, 0.0, 1983.0, 1983, 1983, 1983.0, 1983.0, 1983.0, 1983.0, 0.5042864346949067, 0.16103678139183056, 0.30089747226424607], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c72107c-43a0-49d1-bbc9-56353e0d1fd5", 1, 0, 0.0, 5602.0, 5602, 5602, 5602.0, 5602.0, 5602.0, 5602.0, 0.1785076758300607, 0.032249921902891825, 0.1230726749375223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 3, 0, 0.0, 266.3333333333333, 161, 320, 318.0, 320.0, 320.0, 320.0, 0.025537565759231832, 0.039578239120996984, 0.057434583929209866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b2170df-7746-400f-a2ba-b013fc23ca5d", 1, 0, 0.0, 1098.0, 1098, 1098, 1098.0, 1098.0, 1098.0, 1098.0, 0.9107468123861566, 0.2908341871584699, 0.5434241234061931], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f890254-4fcc-423c-92df-d4879bf2e196", 3, 0, 0.0, 6721.0, 332, 18363, 1468.0, 18363.0, 18363.0, 18363.0, 0.024277147920662278, 0.015607866908628908, 0.015568353321518456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 3546.6000000000004, 262, 8629, 3817.0, 7384.000000000001, 8629.0, 8629.0, 0.07545803024357853, 0.0612359600902478, 0.02682297168814705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c72107c-43a0-49d1-bbc9-56353e0d1fd5", 3, 0, 0.0, 4345.0, 372, 8932, 3731.0, 8932.0, 8932.0, 8932.0, 0.038590668776289895, 0.01746127265593846, 0.024747271318128608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 16, 0, 0.0, 2595.125, 156, 7198, 2169.0, 6059.100000000001, 7198.0, 7198.0, 0.06880447917159407, 0.042263688866145184, 0.031109837750437554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 90.875, 79, 238, 81.0, 130.2000000000001, 238.0, 238.0, 0.07693269350976564, 0.05717361304778482, 0.03861660592189409], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 154.06250000000003, 78, 317, 81.0, 267.30000000000007, 317.0, 317.0, 0.07684475438495379, 0.09269773716212322, 0.03979192481701343], "isController": false}, {"data": ["login", 16, 0, 0.0, 11867.0625, 1695, 25111, 12537.0, 22875.2, 25111.0, 25111.0, 0.0671690350748305, 5.11847807691904, 0.10830514945110303], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 252.57142857142856, 161, 468, 174.0, 468.0, 468.0, 468.0, 0.04234212436486814, 0.0656220228193806, 0.09522843009012824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 3582.666666666666, 431, 7267, 2707.0, 7055.8, 7267.0, 7267.0, 0.11058847815508929, 0.08952914881891505, 0.03931074809419189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f890254-4fcc-423c-92df-d4879bf2e196", 1, 0, 0.0, 10135.0, 10135, 10135, 10135.0, 10135.0, 10135.0, 10135.0, 0.0986679822397632, 0.01782575851011347, 0.06802694869264923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 6, 0, 0.0, 253.5, 161, 398, 240.0, 398.0, 398.0, 398.0, 0.035656344155033784, 0.05526036931058459, 0.08019195370023711], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72b1c54b-08a5-46b5-950b-ef4eb20b52a2", 1, 0, 0.0, 4780.0, 4780, 4780, 4780.0, 4780.0, 4780.0, 4780.0, 0.20920502092050208, 0.0377958289748954, 0.14423705543933055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd7adac9-9bc1-4891-875e-893e0efcd628", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.804157838983051, 3.3710716807909606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48eb3a0f-9556-4c2c-b72e-9b1f26a2ea45", 3, 0, 0.0, 4997.0, 1554, 9869, 3568.0, 9869.0, 9869.0, 9869.0, 0.041731001961357095, 0.018882191642671343, 0.02676109175256298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52aed563-5d9f-41fb-b8a7-4c6f5192abd8", 1, 0, 0.0, 3983.0, 3983, 3983, 3983.0, 3983.0, 3983.0, 3983.0, 0.25106703489831783, 0.045358790484559375, 0.1730989517951293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 3, 0, 0.0, 2288.0, 882, 4723, 1259.0, 4723.0, 4723.0, 4723.0, 0.026328491816227127, 0.021828993703102376, 0.009358956075299487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 716.5000000000001, 162, 1391, 893.5, 1109.6000000000004, 1391.0, 1391.0, 0.0768152401436445, 57.48072605104853, 0.16047558835672998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 3322.1875, 92, 8155, 1761.0, 7832.3, 8155.0, 8155.0, 0.07389412818783887, 0.05736897647395694, 0.02626705337927085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48eb3a0f-9556-4c2c-b72e-9b1f26a2ea45", 1, 0, 0.0, 1703.0, 1703, 1703, 1703.0, 1703.0, 1703.0, 1703.0, 0.5871990604815032, 0.10608576776277158, 0.4048462272460364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52aed563-5d9f-41fb-b8a7-4c6f5192abd8", 3, 0, 0.0, 6327.666666666666, 2933, 11715, 4335.0, 11715.0, 11715.0, 11715.0, 0.023085091647813843, 0.015112018002523969, 0.014803916193422287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 255.5333333333333, 161, 322, 315.0, 322.0, 322.0, 322.0, 0.0760225026607876, 0.11782003097916983, 0.1709763902615174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 1, 0, 0.0, 940.0, 940, 940, 940.0, 940.0, 940.0, 940.0, 1.0638297872340425, 1272.7102726063831, 2.3988115026595747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 8, 0, 0.0, 84.125, 80, 104, 81.0, 104.0, 104.0, 104.0, 0.04889915771200841, 0.03634009669808438, 0.024545085023410473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 8, 0, 0.0, 119.375, 79, 236, 80.5, 236.0, 236.0, 236.0, 0.0488997555012225, 0.01308450488997555, 0.027888141809290955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 8, 0, 0.0, 101.5, 77, 234, 80.5, 234.0, 234.0, 234.0, 0.04890035330505263, 0.013180173351752466, 0.028748059267228204], "isController": false}, {"data": ["register", 17, 1, 5.882352941176471, 5202.117647058823, 1022, 15310, 4835.0, 12632.399999999998, 15310.0, 15310.0, 0.07348300813500126, 0.02367260510231428, 0.03315346656090877], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 8, 0, 0.0, 83.37500000000001, 79, 98, 81.5, 98.0, 98.0, 98.0, 0.04889945660478848, 0.013179931663009395, 0.02879528548114009], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 1, 100.0, 0.10460251046025104], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 956, 1, "406/Not Acceptable", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 17, 1, "406/Not Acceptable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
