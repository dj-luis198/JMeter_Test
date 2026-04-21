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

    var data = {"OkPercent": 99.20159680638723, "KoPercent": 0.7984031936127745};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7693298969072165, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6bd2c7cd-0618-44ed-bcd6-69c313ce500c"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "see books"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0ddc98c2-c353-4816-b817-d738e6ef0c34"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5614b071-c58c-476d-9f13-3484d607102b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fbfa51b9-5c0a-4d3e-b480-9011929c8e4c"], "isController": false}, {"data": [0.4888888888888889, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.85, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.85, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6bd2c7cd-0618-44ed-bcd6-69c313ce500c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.55, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=290f0bac-2cad-424c-a858-7c280ba059d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bd64eb12-e158-4f3d-bc33-d67bb6c7b473"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/290f0bac-2cad-424c-a858-7c280ba059d0"], "isController": false}, {"data": [0.2441860465116279, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ad791f39-f85c-4e1a-be14-ca6512ca0054"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/00374e22-6cb5-47ed-8f6d-79d89fcaf16b"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8053435114503816, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd64eb12-e158-4f3d-bc33-d67bb6c7b473"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2e14537b-925b-4932-ac1a-3a2bd744fe74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ed2b744-6468-45a7-9acc-98da56ab796e"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e14537b-925b-4932-ac1a-3a2bd744fe74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad791f39-f85c-4e1a-be14-ca6512ca0054"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4ed2b744-6468-45a7-9acc-98da56ab796e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01347e67-ab06-402a-89b7-a145958db57d"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6279ef7d-d45d-4794-b3e8-bd92717b709b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fbfa51b9-5c0a-4d3e-b480-9011929c8e4c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d366f02b-c686-41b0-97bb-e769576cfa44"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6279ef7d-d45d-4794-b3e8-bd92717b709b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/01347e67-ab06-402a-89b7-a145958db57d"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d366f02b-c686-41b0-97bb-e769576cfa44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1002, 8, 0.7984031936127745, 1379.0359281437115, 78, 42002, 170.0, 1037.8000000000002, 1924.0499999999988, 33128.190000000024, 4.00337210185026, 585.7483592716819, 2.9229491957297364], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6bd2c7cd-0618-44ed-bcd6-69c313ce500c", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["see books", 45, 0, 0.0, 11528.42222222222, 979, 58604, 1584.0, 31550.199999999997, 47892.49999999993, 58604.0, 0.19886338527350345, 239.29886259810593, 0.977809711769619], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 2951.5833333333335, 83, 34317, 85.5, 24095.100000000035, 34317.0, 34317.0, 0.06017360083841884, 0.04671680924467087, 0.021389834673031696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 309.3125, 163, 862, 172.0, 813.7, 862.0, 862.0, 0.08727002983544145, 13.169007020464822, 0.19348123557999117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ddc98c2-c353-4816-b817-d738e6ef0c34", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.6557206108829569, 1.2252149640657084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 329.00000000000006, 166, 585, 325.5, 521.3000000000001, 585.0, 585.0, 0.08126447523465118, 0.12594406464589006, 0.1827657094388688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5614b071-c58c-476d-9f13-3484d607102b", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.5827298129562043, 1.0888315465328466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 112.5, 81, 262, 83.0, 262.0, 262.0, 262.0, 0.029588425008136816, 0.021989054132023553, 0.014852002396662425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 152.0, 80, 336, 84.5, 336.0, 336.0, 336.0, 0.029551700700375307, 0.007907388663967611, 0.016853704305682792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 110.0, 81, 245, 83.5, 245.0, 245.0, 245.0, 0.029588862752060123, 0.007975123163641205, 0.017395015016347846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 109.5, 80, 244, 81.5, 244.0, 244.0, 244.0, 0.02956509741699599, 0.0079687176631747, 0.017409915764109943], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fbfa51b9-5c0a-4d3e-b480-9011929c8e4c", 3, 0, 0.0, 374.3333333333333, 186, 555, 382.0, 555.0, 555.0, 555.0, 0.12497917013831028, 0.05793305282452924, 0.08014614751708048], "isController": false}, {"data": ["https://demoqa.com/books", 45, 0, 0.0, 933.1777777777778, 639, 1535, 834.0, 1269.4, 1428.4999999999998, 1535.0, 0.20889716224810484, 249.9136304527962, 0.41249029498600387], "isController": false}, {"data": ["deleteBook", 10, 0, 0.0, 668.2000000000002, 391, 2514, 430.0, 2338.000000000001, 2514.0, 2514.0, 0.06471696037380516, 0.011692028973783158, 0.0439873090040707], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 10, 0, 0.0, 668.2000000000002, 391, 2514, 430.0, 2338.000000000001, 2514.0, 2514.0, 0.06374461358015247, 0.011516360851883015, 0.043326417042759885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 18, 5, 27.77777777777778, 3438.666666666667, 104, 40134, 1517.5, 5844.000000000055, 40134.0, 40134.0, 0.07563692594724744, 0.023784267729505544, 0.03412525369885578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bd2c7cd-0618-44ed-bcd6-69c313ce500c", 3, 0, 0.0, 327.3333333333333, 165, 568, 249.0, 568.0, 568.0, 568.0, 0.01511875784285563, 0.01786985993730755, 0.009695297184383332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 133.5, 79, 242, 82.5, 242.0, 242.0, 242.0, 0.0342204022037939, 0.009223467781491326, 0.020151272000866916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 157.30769230769232, 80, 247, 90.0, 246.6, 247.0, 247.0, 0.08453799983092401, 0.032387605103494026, 0.047666934099377674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 134.33333333333334, 80, 243, 83.5, 243.0, 243.0, 243.0, 0.0342204022037939, 0.009223467781491326, 0.020117853639339774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 108.15384615384616, 80, 256, 83.0, 250.0, 256.0, 256.0, 0.08453690035700584, 0.06282478630047016, 0.042433561312012695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 149.6923076923077, 79, 637, 82.0, 479.39999999999986, 637.0, 637.0, 0.08453745009039004, 1.9330956191717932, 0.04922248915644631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 173.0769230769231, 79, 789, 82.0, 570.5999999999998, 789.0, 789.0, 0.08453745009039004, 5.872336308265812, 0.049139933052842415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 108.08333333333331, 79, 242, 82.0, 240.8, 242.0, 242.0, 0.06260989340665647, 0.01687532283226288, 0.036807769366022654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 139.75, 81, 316, 82.0, 293.80000000000007, 316.0, 316.0, 0.06255734423221286, 0.016861159187588622, 0.03683796735549253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 95.16666666666666, 79, 234, 83.5, 189.30000000000015, 234.0, 234.0, 0.06260858676767518, 0.04652845168964923, 0.03142657577986821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 108.16666666666666, 79, 242, 82.0, 242.0, 242.0, 242.0, 0.03422059737756156, 0.009156683282667838, 0.019516434441890575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 107.66666666666667, 78, 243, 81.0, 242.4, 243.0, 243.0, 0.06261022007492356, 0.016753125293485407, 0.035707391136479846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 82.83333333333334, 81, 85, 82.5, 85.0, 85.0, 85.0, 0.0342204022037939, 0.02543137312215543, 0.017177037824951235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 90.0, 81, 102, 88.5, 102.0, 102.0, 102.0, 0.03594708588957055, 0.028294288307611194, 0.012778065687308281], "isController": false}, {"data": ["deleteAccount", 10, 0, 0.0, 4365.7, 372, 36857, 528.5, 33365.90000000001, 36857.0, 36857.0, 0.07610465912723177, 0.013749376893103396, 0.05180170645671928], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 16, 0, 0.0, 3929.0625, 960, 42002, 1378.0, 14032.800000000028, 42002.0, 42002.0, 0.06965849920763457, 0.036053715410201484, 0.032040188600386606], "isController": false}, {"data": ["goToProfile", 10, 0, 0.0, 205.3, 165, 391, 186.0, 374.50000000000006, 391.0, 391.0, 0.06510882940835606, 0.13495458048753492, 0.042091840887042695], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 218.33333333333331, 165, 326, 167.5, 326.0, 326.0, 326.0, 0.03420440552743193, 0.05301014801956492, 0.07692650969694897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 93.0, 80, 241, 83.0, 133.9000000000001, 241.0, 241.0, 0.08730955603090758, 0.06488532435500065, 0.04382530449207666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=290f0bac-2cad-424c-a858-7c280ba059d0", 1, 0, 0.0, 38104.0, 38104, 38104, 38104.0, 38104.0, 38104.0, 38104.0, 0.026243963888305688, 0.004741341132164603, 0.01809398291517951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 122.06250000000001, 78, 247, 83.0, 244.2, 247.0, 247.0, 0.08731050891112882, 0.03975441873028693, 0.04887768479814902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd64eb12-e158-4f3d-bc33-d67bb6c7b473", 3, 0, 0.0, 364.6666666666667, 202, 502, 390.0, 502.0, 502.0, 502.0, 0.04406904149834741, 0.019940093646713182, 0.028260420492104296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 555.0, 396, 641, 628.0, 641.0, 641.0, 641.0, 0.07191140514885662, 21.144340797137925, 0.04101197324895728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 712.0, 639, 767, 730.0, 767.0, 767.0, 767.0, 0.07149495960534782, 64.33129032762565, 0.04070464985343533], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/290f0bac-2cad-424c-a858-7c280ba059d0", 3, 0, 0.0, 649.3333333333333, 166, 1610, 172.0, 1610.0, 1610.0, 1610.0, 0.020318457964496883, 0.016938662385116054, 0.013029740296243117], "isController": false}, {"data": ["addBook", 43, 3, 6.976744186046512, 10759.837209302328, 421, 65226, 1367.0, 33922.4, 39063.599999999984, 65226.0, 0.20645086949424338, 75.47380455794307, 0.7485438161963107], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 203.33333333333334, 85, 278, 247.0, 278.0, 278.0, 278.0, 0.07245151785929915, 0.12820522496196296, 0.04011719787717053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 6, 0, 0.0, 107.33333333333334, 80, 236, 82.0, 236.0, 236.0, 236.0, 0.032997492190593516, 0.0245225503486735, 0.016563194322231512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 6, 0, 0.0, 107.83333333333333, 78, 245, 81.0, 245.0, 245.0, 245.0, 0.03299731071917639, 0.008829358532279619, 0.018818778769530285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 6, 0, 0.0, 108.33333333333333, 80, 245, 81.5, 245.0, 245.0, 245.0, 0.03299767366400669, 0.008893904229751804, 0.019399022993878932], "isController": false}, {"data": ["https://demoqa.com/books-0", 45, 0, 0.0, 155.39999999999998, 80, 339, 83.0, 330.4, 335.5, 339.0, 0.20966900253466528, 0.15581846770398464, 0.10135366821744074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 6, 0, 0.0, 80.66666666666666, 79, 82, 81.0, 82.0, 82.0, 82.0, 0.032997492190593516, 0.008893855316995908, 0.019431140420828018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad791f39-f85c-4e1a-be14-ca6512ca0054", 3, 0, 0.0, 1147.6666666666667, 391, 2646, 406.0, 2646.0, 2646.0, 2646.0, 0.01736754353464246, 0.017418425009841608, 0.011137389571369026], "isController": false}, {"data": ["https://demoqa.com/books-3", 45, 0, 0.0, 517.7111111111109, 384, 735, 480.0, 651.6, 726.9, 735.0, 0.2096338395602348, 61.639309329288174, 0.10543108141945402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 82.0, 80, 85, 81.0, 85.0, 85.0, 85.0, 0.07245851749873199, 0.053848566227085, 0.04068715582204188], "isController": false}, {"data": ["https://demoqa.com/books-1", 45, 0, 0.0, 126.62222222222219, 78, 340, 83.0, 245.4, 306.7999999999996, 340.0, 0.20994191606988732, 0.3714987811705428, 0.10210065840117567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 754.7692307692307, 82, 1205, 879.0, 1157.8, 1205.0, 1205.0, 0.07399733609590055, 51.222243439140044, 0.03861068934210676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 183.62499999999997, 79, 773, 82.0, 730.3000000000001, 773.0, 773.0, 0.08731050891112882, 9.84085997099654, 0.05039112379538783], "isController": false}, {"data": ["https://demoqa.com/books-2", 45, 0, 0.0, 775.7333333333333, 547, 1204, 723.0, 989.8, 1095.9999999999998, 1204.0, 0.2092487968194183, 188.28243519826322, 0.10503308746599707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 7950.312499999998, 83, 34867, 86.5, 32347.000000000004, 34867.0, 34867.0, 0.0792134108304536, 0.059177987583297856, 0.028157892131137802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 475.23076923076934, 80, 815, 479.0, 780.5999999999999, 815.0, 815.0, 0.07393126667007888, 16.726327066236728, 0.03864841381889114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 175.5, 79, 698, 83.0, 656.0, 698.0, 698.0, 0.08731003246841833, 3.229597248369758, 0.05047611252080435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00374e22-6cb5-47ed-8f6d-79d89fcaf16b", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["deleteBooks", 10, 0, 0.0, 6953.6, 164, 38104, 439.0, 37095.3, 38104.0, 38104.0, 0.06376005814917303, 0.011519151130465831, 0.043959571341129065], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 131, 3, 2.2900763358778624, 3671.648854961831, 79, 36680, 97.0, 21898.6, 28364.39999999999, 36227.84000000001, 0.5611960759114082, 1.2689413716103328, 0.26751612501606475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 5892.666666666667, 83, 34914, 87.5, 34914.0, 34914.0, 34914.0, 0.02812161661800065, 0.02177777536921339, 0.009996355907179916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd64eb12-e158-4f3d-bc33-d67bb6c7b473", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 1.101610137195122, 4.203982469512195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e14537b-925b-4932-ac1a-3a2bd744fe74", 3, 0, 0.0, 802.0, 226, 1946, 234.0, 1946.0, 1946.0, 1946.0, 0.01427945852293281, 0.016877836554937835, 0.009157074638729699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 6, 0, 0.0, 217.0, 162, 482, 164.5, 482.0, 482.0, 482.0, 0.03298261816022956, 0.0511166162307464, 0.07417868127246942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 10812.923076923078, 83, 28057, 4452.0, 27069.8, 28057.0, 28057.0, 0.08166752522270106, 0.06627511080084432, 0.02903025310650702], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ed2b744-6468-45a7-9acc-98da56ab796e", 1, 0, 0.0, 28017.0, 28017, 28017, 28017.0, 28017.0, 28017.0, 28017.0, 0.03569261519791555, 0.006448372862904665, 0.024608385087625372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 16, 0, 0.0, 639.8124999999999, 89, 1751, 587.0, 1316.3000000000004, 1751.0, 1751.0, 0.06913418080316634, 0.042466210669132455, 0.03125891182799416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 95.3076923076923, 79, 254, 82.0, 185.99999999999994, 254.0, 254.0, 0.07399607251615108, 0.054991221860147425, 0.03714255983720864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e14537b-925b-4932-ac1a-3a2bd744fe74", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 181.15384615384616, 80, 250, 241.0, 248.8, 250.0, 250.0, 0.07399817850637523, 0.10529398266734973, 0.03742155481557377], "isController": false}, {"data": ["login", 16, 0, 0.0, 5120.875, 1657, 44135, 2411.5, 16619.40000000003, 44135.0, 44135.0, 0.06957943579774997, 15.704529668834502, 0.12661384880823473], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad791f39-f85c-4e1a-be14-ca6512ca0054", 1, 0, 0.0, 791.0, 791, 791, 791.0, 791.0, 791.0, 791.0, 1.2642225031605563, 0.22839957332490518, 0.8716221554993678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 266.66666666666663, 162, 508, 172.5, 508.0, 508.0, 508.0, 0.029539334084945277, 0.04578019843047672, 0.06643465468518454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ed2b744-6468-45a7-9acc-98da56ab796e", 3, 0, 0.0, 354.3333333333333, 186, 447, 430.0, 447.0, 447.0, 447.0, 0.04762660739799968, 0.021549799571360533, 0.030541802270201618], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01347e67-ab06-402a-89b7-a145958db57d", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 2817.4375, 83, 26088, 84.5, 20287.100000000006, 26088.0, 26088.0, 0.08811057877636434, 0.07133170879453714, 0.03132055729941076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 250.66666666666669, 164, 476, 169.0, 452.0000000000001, 476.0, 476.0, 0.06252963644227212, 0.09690872366590415, 0.1406306178970241], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6279ef7d-d45d-4794-b3e8-bd92717b709b", 3, 0, 0.0, 12445.666666666666, 170, 36857, 310.0, 36857.0, 36857.0, 36857.0, 0.024338796040889177, 0.01564750070988155, 0.015607886784033749], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fbfa51b9-5c0a-4d3e-b480-9011929c8e4c", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 1.101610137195122, 4.203982469512195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 6, 0, 0.0, 2716.3333333333335, 85, 15868, 86.0, 15868.0, 15868.0, 15868.0, 0.03293843805926723, 0.02730931046124793, 0.011708585403880149], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 864.3846153846154, 165, 1288, 963.0, 1240.0, 1288.0, 1288.0, 0.07389554580386985, 68.03009240673529, 0.15164906969771036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 1935.7692307692307, 80, 24097, 86.0, 14506.599999999991, 24097.0, 24097.0, 0.07081304267302894, 0.054976922778376965, 0.02517182376267826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d366f02b-c686-41b0-97bb-e769576cfa44", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6279ef7d-d45d-4794-b3e8-bd92717b709b", 1, 0, 0.0, 653.0, 653, 653, 653.0, 653.0, 653.0, 653.0, 1.5313935681470139, 0.2766677833078101, 1.055824081163859], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01347e67-ab06-402a-89b7-a145958db57d", 3, 0, 0.0, 243.66666666666669, 170, 372, 189.0, 372.0, 372.0, 372.0, 0.015513496742165683, 0.018336427952735546, 0.00994843378322474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 321.0, 165, 872, 325.0, 723.1999999999998, 872.0, 872.0, 0.08449129739636818, 7.896331209135459, 0.18835999345192445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 794.3333333333334, 720, 848, 815.0, 848.0, 848.0, 848.0, 0.07135721421435708, 85.36803598187527, 0.16090215587983445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 149.9375, 81, 344, 85.0, 276.80000000000007, 344.0, 344.0, 0.08129874749117147, 0.06041830746170067, 0.04080816036177942], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d366f02b-c686-41b0-97bb-e769576cfa44", 3, 0, 0.0, 250.33333333333331, 166, 394, 191.0, 394.0, 394.0, 394.0, 0.014169724965638416, 0.016748135205154002, 0.009086705137469949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 141.375, 79, 245, 84.5, 244.3, 245.0, 245.0, 0.08130081300813008, 0.021754319105691054, 0.046366869918699184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 141.18750000000003, 80, 245, 83.0, 242.9, 245.0, 245.0, 0.08129998678875215, 0.021912887064155853, 0.04779550004573124], "isController": false}, {"data": ["register", 18, 5, 27.77777777777778, 3438.666666666667, 104, 40134, 1517.5, 5844.000000000055, 40134.0, 40134.0, 0.07571232680805243, 0.02380797776581336, 0.03415927244660178], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 137.6875, 80, 331, 83.0, 270.1000000000001, 331.0, 331.0, 0.08130081300813008, 0.02191310975609756, 0.047875381097560975], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 62.5, 0.499001996007984], "isController": false}, {"data": ["401/Unauthorized", 3, 37.5, 0.2994011976047904], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1002, 8, "406/Not Acceptable", 5, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 18, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 131, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
