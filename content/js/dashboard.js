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

    var data = {"OkPercent": 98.08429118773947, "KoPercent": 1.9157088122605364};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.73993399339934, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/48c72eec-53d6-4c17-afc9-2d1a87fa534a"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9e729f24-9c3a-441c-b44a-6dc9392d039c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f481a3c8-fef0-4016-8b11-de29ff5a2aee"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15270e6a-29d8-474c-b51b-392de8b3a1cf"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ae4ce95a-2484-468a-8b64-838e0f09ff74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=774eaef5-5f50-40c2-8266-79b3abb83d3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd34063b-f3ed-4f3a-9885-c7ddd2813b73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.40625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/89261302-a933-4687-b6af-98226b2347cd"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0598a02a-4a8d-4949-862b-bb97d2aeaebf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.40625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4713e3b5-79b1-484b-b7c9-379b2148a538"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbe6ab06-613d-41ed-bde5-f5025d06022d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7bb4f233-3daf-4c2d-b28c-18bfa17b21eb"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.05555555555555555, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "register"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/774eaef5-5f50-40c2-8266-79b3abb83d3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e4c48b1f-5234-4d3a-a91b-be37125c89a4"], "isController": false}, {"data": [0.2719298245614035, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/221e5acc-93f5-4df6-8e19-1c50656edbcd"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fd34063b-f3ed-4f3a-9885-c7ddd2813b73"], "isController": false}, {"data": [0.2672413793103448, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9824561403508771, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9248554913294798, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89261302-a933-4687-b6af-98226b2347cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e729f24-9c3a-441c-b44a-6dc9392d039c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5a327cb3-3ee6-4f29-afea-0002bc43f549"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7bb4f233-3daf-4c2d-b28c-18bfa17b21eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dbe6ab06-613d-41ed-bde5-f5025d06022d"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f481a3c8-fef0-4016-8b11-de29ff5a2aee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=221e5acc-93f5-4df6-8e19-1c50656edbcd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/15270e6a-29d8-474c-b51b-392de8b3a1cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/38cf67cc-1598-4c2c-ae57-7cfb3ec7b102"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0598a02a-4a8d-4949-862b-bb97d2aeaebf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4713e3b5-79b1-484b-b7c9-379b2148a538"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1305, 25, 1.9157088122605364, 468.79999999999984, 138, 2816, 158.0, 1303.4, 1610.0, 2054.82, 5.112674732025324, 715.7211212844959, 3.7412603379850187], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/48c72eec-53d6-4c17-afc9-2d1a87fa534a", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.9504045758928571, 1.7758324032738093], "isController": false}, {"data": ["see books", 57, 0, 0.0, 2399.2807017543864, 1770, 3404, 2352.0, 2866.2000000000003, 3088.8999999999996, 3404.0, 0.2537336686772463, 305.32809404838747, 1.2476064665917335], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9e729f24-9c3a-441c-b44a-6dc9392d039c", 3, 0, 0.0, 485.66666666666663, 322, 798, 337.0, 798.0, 798.0, 798.0, 0.018726007303142847, 0.022133506678942604, 0.012008539839580536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f481a3c8-fef0-4016-8b11-de29ff5a2aee", 1, 0, 0.0, 610.0, 610, 610, 610.0, 610.0, 610.0, 610.0, 1.639344262295082, 0.2961705942622951, 1.130251024590164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15270e6a-29d8-474c-b51b-392de8b3a1cf", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 551.7692307692308, 151, 1202, 551.0, 1028.7999999999997, 1202.0, 1202.0, 0.07527678695511188, 0.014923034913952842, 0.05061052007574003], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 551.7692307692308, 151, 1202, 551.0, 1028.7999999999997, 1202.0, 1202.0, 0.07267685633462662, 0.014407618980399611, 0.048862519846372306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae4ce95a-2484-468a-8b64-838e0f09ff74", 1, 0, 0.0, 608.0, 608, 608, 608.0, 608.0, 608.0, 608.0, 1.644736842105263, 0.5252235814144737, 0.9813810649671053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 213.70588235294122, 139, 468, 145.0, 444.0, 468.0, 468.0, 0.09813146152380843, 0.026257832478050303, 0.055965599150296995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 165.35294117647058, 143, 443, 148.0, 212.5999999999998, 443.0, 443.0, 0.09812239903493734, 0.07292104068905013, 0.049252844828083786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 246.58823529411765, 140, 438, 148.0, 437.2, 438.0, 438.0, 0.09812749647895454, 0.026448426785343215, 0.05778406286797811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 193.52941176470588, 139, 436, 145.0, 432.0, 436.0, 436.0, 0.09812806289431608, 0.02644857945198363, 0.05768856822497879], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 279.3076923076923, 146, 471, 252.0, 455.4, 471.0, 471.0, 0.07508851781041882, 0.1501657542930416, 0.04853227217854895], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 163.56249999999997, 141, 437, 146.0, 235.4000000000002, 437.0, 437.0, 0.09323248686004638, 0.06928703369188993, 0.04679833813092172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 179.93750000000003, 139, 437, 145.0, 426.5, 437.0, 437.0, 0.09323140033563304, 0.024946683292933057, 0.053171033003915714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1050.4, 856, 1155, 1129.0, 1155.0, 1155.0, 1155.0, 0.03283964401825884, 9.655945720173394, 0.018728859479163248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1367.8, 1129, 1601, 1306.0, 1601.0, 1601.0, 1601.0, 0.0326925591735321, 29.41682221173336, 0.018613048826337127], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 257.0, 145, 429, 151.0, 429.0, 429.0, 429.0, 0.03299328256766922, 0.05838264454357093, 0.018268741421746535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=774eaef5-5f50-40c2-8266-79b3abb83d3e", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 0.7720686431623931, 2.946380876068376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 184.11764705882354, 145, 477, 147.0, 446.59999999999997, 477.0, 477.0, 0.0879698625600265, 0.06537604043767595, 0.0441567474178258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 179.23529411764707, 140, 437, 145.0, 435.4, 437.0, 437.0, 0.08797031777983616, 0.023538932687182722, 0.05017057185881281], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd34063b-f3ed-4f3a-9885-c7ddd2813b73", 1, 0, 0.0, 1602.0, 1602, 1602, 1602.0, 1602.0, 1602.0, 1602.0, 0.6242197253433208, 0.11277407147315854, 0.43037024032459426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 212.35294117647058, 139, 436, 147.0, 432.8, 436.0, 436.0, 0.08797304919763403, 0.0237114859165498, 0.05171853087595282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 212.64705882352945, 139, 438, 147.0, 437.2, 438.0, 438.0, 0.08797031777983616, 0.023710749714096466, 0.051802833614493365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 261.8, 141, 441, 157.0, 441.0, 441.0, 441.0, 0.03299458888742247, 0.024520392718094235, 0.018527234970964764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1094.375, 142, 1990, 1558.5, 1873.8000000000002, 1990.0, 1990.0, 0.09512937595129375, 53.50810244021713, 0.050816180317732114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 162.3125, 139, 435, 145.5, 234.1000000000002, 435.0, 435.0, 0.09323194359467411, 0.025128922297002008, 0.05481018558983772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 773.75, 143, 1308, 1047.0, 1298.2, 1308.0, 1308.0, 0.09512881035477101, 17.491508081489716, 0.05090877741642042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 178.62499999999997, 139, 423, 145.0, 418.8, 423.0, 423.0, 0.09323248686004638, 0.025129068723996877, 0.05490155232090622], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 521.0, 151, 1602, 465.0, 1314.3999999999996, 1602.0, 1602.0, 0.07281281505544976, 0.014434571734625295, 0.04940244483029013], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/89261302-a933-4687-b6af-98226b2347cd", 3, 0, 0.0, 404.6666666666667, 283, 471, 460.0, 471.0, 471.0, 471.0, 0.019277603922349812, 0.026575733271859196, 0.012362265536142295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 433.11764705882354, 290, 914, 298.0, 882.8, 914.0, 914.0, 0.08790345098606989, 0.13623318038563761, 0.19769692150480367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 551.3809523809523, 165, 1108, 537.0, 1025.8000000000002, 1102.5, 1108.0, 0.08838086259721895, 0.05428863532583078, 0.03996126892823474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 147.0, 140, 165, 146.5, 158.0, 165.0, 165.0, 0.09511806529855182, 0.07068832782441206, 0.04774481012056215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 195.93749999999997, 139, 425, 146.0, 417.3, 425.0, 425.0, 0.09513050716451632, 0.11475581931149295, 0.04926069474998514], "isController": false}, {"data": ["login", 21, 0, 0.0, 2500.6666666666665, 1593, 4117, 2343.0, 3856.8, 4103.2, 4117.0, 0.0899685110211426, 25.750770991313754, 0.1712639973330763], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0598a02a-4a8d-4949-862b-bb97d2aeaebf", 3, 0, 0.0, 381.3333333333333, 280, 432, 432.0, 432.0, 432.0, 432.0, 0.016863122038414193, 0.01993163936246157, 0.010813916150936185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 150.75, 144, 162, 149.5, 160.6, 162.0, 162.0, 0.08920258464489009, 0.07221576432677138, 0.031708731260488274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1242.9375, 289, 2140, 1701.5, 2021.7, 2140.0, 2140.0, 0.0950344499881207, 71.1141327549596, 0.1985375460323117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4713e3b5-79b1-484b-b7c9-379b2148a538", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbe6ab06-613d-41ed-bde5-f5025d06022d", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 0.6948617788461539, 2.6517427884615383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7bb4f233-3daf-4c2d-b28c-18bfa17b21eb", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 483.6470588235294, 286, 882, 577.0, 665.9999999999998, 882.0, 882.0, 0.09803921568627451, 0.15194163602941177, 0.22049249387254902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 975.4444444444445, 146, 1758, 1297.0, 1758.0, 1758.0, 1758.0, 0.05428848903070919, 36.08862652384772, 0.08399517850356795], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 953.9545454545455, 247, 1839, 1005.5, 1447.8, 1784.999999999999, 1839.0, 0.09394803819414789, 0.02970906534513093, 0.04238671254462532], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 381.25000000000006, 284, 859, 294.0, 667.2000000000002, 859.0, 859.0, 0.09315215239692133, 0.14436764243546302, 0.20950137399424784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 152.33333333333331, 146, 174, 150.0, 167.4, 174.0, 174.0, 0.13952450050228818, 0.10832224404230384, 0.04959659978792276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 647.1999999999999, 289, 2064, 575.0, 1816.8000000000002, 2064.0, 2064.0, 0.07610736211882896, 12.242339912920492, 0.16857087022426304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 198.4545454545455, 141, 437, 148.0, 436.4, 437.0, 437.0, 0.05797376423651188, 0.04308401814842337, 0.029100112126530374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 274.27272727272725, 141, 440, 147.0, 439.6, 440.0, 440.0, 0.05788651086424561, 0.031296950564919726, 0.032129480284380646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 516.8181818181819, 145, 1607, 427.0, 1604.2, 1607.0, 1607.0, 0.0579746808757339, 9.497461219550116, 0.03317691698552741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 321.72727272727275, 138, 1125, 146.0, 1122.6, 1125.0, 1125.0, 0.05797437532610586, 3.112128700478025, 0.03323335773088295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 152.5, 151, 154, 152.5, 154.0, 154.0, 154.0, 0.05075369233111709, 0.014968374105466174, 0.031374108638278435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/774eaef5-5f50-40c2-8266-79b3abb83d3e", 3, 0, 0.0, 406.3333333333333, 283, 572, 364.0, 572.0, 572.0, 572.0, 0.07777460918258886, 0.03519098527467399, 0.049874993518782565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4c48b1f-5234-4d3a-a91b-be37125c89a4", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1636.5614035087717, 1115, 2816, 1465.0, 2271.4, 2471.8999999999996, 2816.0, 0.24404654866801961, 291.96451651488684, 0.4818966029362653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 953.9545454545455, 247, 1839, 1005.5, 1447.8, 1784.999999999999, 1839.0, 0.09063344538922946, 0.028660895994001716, 0.04089126149396876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 146.50000000000003, 140, 156, 146.0, 156.0, 156.0, 156.0, 0.03728665044697372, 0.010049917503285885, 0.021956884980005035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 183.5, 142, 438, 147.5, 438.0, 438.0, 438.0, 0.03728578153328455, 0.010049683303893102, 0.021919961409216114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 250.66666666666669, 139, 581, 147.0, 494.6, 581.0, 581.0, 0.13472610183496952, 0.03631289463520662, 0.07920421221157387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 219.60000000000002, 138, 440, 145.0, 434.0, 440.0, 440.0, 0.13474425540324464, 0.036317787589155784, 0.07934647071109034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 182.125, 140, 439, 146.5, 439.0, 439.0, 439.0, 0.03728595531278256, 0.009976906011428146, 0.021264646389321303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 206.5333333333333, 138, 440, 147.0, 440.0, 440.0, 440.0, 0.13507672357899286, 0.10038416664415388, 0.06780218351523665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 146.25, 141, 149, 147.0, 149.0, 149.0, 149.0, 0.03728630287663827, 0.02770984032140793, 0.018715976248625067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 202.46666666666667, 141, 439, 146.0, 437.8, 439.0, 439.0, 0.13507064194573762, 0.036141949114386826, 0.0770324754846785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 151.75, 147, 163, 150.0, 163.0, 163.0, 163.0, 0.03762439565814474, 0.029614514551235024, 0.013374296894106139], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 506.15384615384613, 151, 985, 475.0, 910.1999999999999, 985.0, 985.0, 0.07057392890490977, 0.013693844528349004, 0.04802653410077957], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1264.238095238095, 870, 1975, 1180.0, 1698.8000000000002, 1949.5999999999997, 1975.0, 0.08783376831961454, 0.04546083711855049, 0.040400102420447705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/221e5acc-93f5-4df6-8e19-1c50656edbcd", 3, 0, 0.0, 394.3333333333333, 243, 561, 379.0, 561.0, 561.0, 561.0, 0.02494221719682735, 0.025015290098771178, 0.015994846314371706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 332.5, 289, 587, 298.0, 587.0, 587.0, 587.0, 0.03726094773220556, 0.05774719145606468, 0.0838007447531928], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd34063b-f3ed-4f3a-9885-c7ddd2813b73", 3, 0, 0.0, 516.0, 232, 985, 331.0, 985.0, 985.0, 985.0, 0.05436161345268728, 0.024066339288950096, 0.034860800293552714], "isController": false}, {"data": ["addBook", 58, 12, 20.689655172413794, 1387.6034482758625, 720, 2793, 1124.0, 2578.7, 2667.35, 2793.0, 0.259327982830699, 75.85681018896291, 0.9438059245825043], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 257.56140350877195, 142, 969, 149.0, 588.8, 593.3, 969.0, 0.24541462154482044, 0.18238332714414882, 0.11863304459442005], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 911.719298245614, 693, 1402, 868.0, 1180.6000000000001, 1303.2, 1402.0, 0.24525095196093194, 72.11192297452833, 0.12334398462878902], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 224.21052631578954, 140, 595, 149.0, 440.4, 503.49999999999943, 595.0, 0.24604281144919216, 0.4353804436972033, 0.11965753916181415], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1377.5789473684213, 966, 1901, 1314.0, 1745.0, 1890.1, 1901.0, 0.24510225494074547, 220.54343983949028, 0.12302984281205387], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 187.6, 141, 439, 150.0, 430.6, 439.0, 439.0, 0.080661206799202, 0.06025959297010696, 0.028672538354403834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 12, 6.936416184971098, 205.2658959537571, 141, 1610, 152.0, 341.4, 420.9, 751.5999999999894, 0.7003736675694604, 1.4899663818109314, 0.3354836993595427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 186.45454545454547, 149, 510, 152.0, 443.80000000000024, 510.0, 510.0, 0.05589856950478949, 0.04328863829814265, 0.01987019462865564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89261302-a933-4687-b6af-98226b2347cd", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e729f24-9c3a-441c-b44a-6dc9392d039c", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 150.23529411764707, 146, 159, 150.0, 155.8, 159.0, 159.0, 0.09424600424661408, 0.07648284133685186, 0.033501509322038596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a327cb3-3ee6-4f29-afea-0002bc43f549", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.9020789194915255, 1.6855358403954803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7bb4f233-3daf-4c2d-b28c-18bfa17b21eb", 3, 0, 0.0, 694.3333333333334, 226, 1413, 444.0, 1413.0, 1413.0, 1413.0, 0.03567097096382964, 0.02973742078071865, 0.02287493906209127], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbe6ab06-613d-41ed-bde5-f5025d06022d", 3, 0, 0.0, 348.6666666666667, 252, 451, 343.0, 451.0, 451.0, 451.0, 0.07533902561526871, 0.03408894713711703, 0.04831311212958312], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 742.5454545454545, 294, 1750, 580.0, 1747.2, 1750.0, 1750.0, 0.05784085352066759, 12.654756120285313, 0.12739468528002862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 479.3333333333333, 286, 1016, 294.0, 935.0, 1016.0, 1016.0, 0.1345544900833341, 0.20853317945532343, 0.3026162018182797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f481a3c8-fef0-4016-8b11-de29ff5a2aee", 3, 0, 0.0, 352.0, 223, 589, 244.0, 589.0, 589.0, 589.0, 0.032260145815859086, 0.026893956196098672, 0.020687658612383596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 184.76470588235293, 143, 439, 149.0, 428.59999999999997, 439.0, 439.0, 0.08808244516867789, 0.07302929291817141, 0.03131055668105347], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=221e5acc-93f5-4df6-8e19-1c50656edbcd", 1, 0, 0.0, 883.0, 883, 883, 883.0, 883.0, 883.0, 883.0, 1.1325028312570782, 0.20460256228765572, 0.7808076160815401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15270e6a-29d8-474c-b51b-392de8b3a1cf", 3, 0, 0.0, 332.6666666666667, 238, 509, 251.0, 509.0, 509.0, 509.0, 0.020475439710067773, 0.02420127655835159, 0.013130408928656743], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 167.25, 144, 446, 149.5, 240.9000000000002, 446.0, 446.0, 0.09390497989846525, 0.0729047451360155, 0.03338028582328257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38cf67cc-1598-4c2c-ae57-7cfb3ec7b102", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0598a02a-4a8d-4949-862b-bb97d2aeaebf", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4713e3b5-79b1-484b-b7c9-379b2148a538", 3, 0, 0.0, 360.0, 255, 475, 350.0, 475.0, 475.0, 475.0, 0.022273864589752536, 0.030706320487500646, 0.014283695716735838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 204.19999999999996, 144, 439, 149.0, 430.0, 439.0, 439.0, 0.07616416932818125, 0.05660247349486907, 0.03823084280730973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 260.0, 140, 439, 148.0, 437.8, 439.0, 439.0, 0.0761703575436583, 0.03563542899145369, 0.04258795772037354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 420.2666666666666, 141, 1639, 150.0, 1393.0000000000002, 1639.0, 1639.0, 0.07616881039551923, 9.156036489303359, 0.043906161929812976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 296.4666666666667, 139, 1163, 145.0, 968.6000000000001, 1163.0, 1163.0, 0.0761684236183048, 3.003931877500863, 0.04398032220512665], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 20.0, 0.3831417624521073], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.1532567049808429], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.0, 0.1532567049808429], "isController": false}, {"data": ["401/Unauthorized", 16, 64.0, 1.2260536398467432], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1305, 25, "401/Unauthorized", 16, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
