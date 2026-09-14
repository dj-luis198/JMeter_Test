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

    var data = {"OkPercent": 98.73134328358209, "KoPercent": 1.2686567164179106};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7315586914688903, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dcb3ee53-a4c8-447a-a872-e090430d0c8e"], "isController": false}, {"data": [0.4, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02eb5890-a8f6-494c-b112-b1dec1d95038"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/70eba7cf-e7af-49d3-ac04-2525802046bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28e2b234-7691-474c-a279-6ba82a3edf47"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/28e2b234-7691-474c-a279-6ba82a3edf47"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8eaaeade-28cd-4f2a-b775-816843ba8650"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e3ed55d0-93c3-48c7-bb32-cf30e4bb6941"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5989aefe-6c9d-4a95-85f1-aabf1ebb2470"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e80095b-f784-4c19-ac5a-e484bc8f9ece"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/af3756c0-4b9e-47f7-95f1-97c32a400d4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b90db1e7-fb34-4b0a-860f-ba389437773b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c184d054-d915-49aa-a930-c7d3be478894"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=594256a2-2aa3-4104-9f96-2d92afd178eb"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/13363cd3-fce0-4b96-89e1-6985ef407782"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e8d5ef3-dc8b-4835-bf97-abd20b110dee"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91b88371-d79a-430c-b501-f1faacd0341a"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2627118644067797, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dcb3ee53-a4c8-447a-a872-e090430d0c8e"], "isController": false}, {"data": [0.30833333333333335, 500, 1500, "addBook"], "isController": true}, {"data": [0.9152542372881356, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e8f6154c-f03c-4c6e-922a-f7ca6c73e7b2"], "isController": false}, {"data": [0.9915254237288136, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3220338983050847, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9636871508379888, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70eba7cf-e7af-49d3-ac04-2525802046bd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02eb5890-a8f6-494c-b112-b1dec1d95038"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6e80095b-f784-4c19-ac5a-e484bc8f9ece"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c184d054-d915-49aa-a930-c7d3be478894"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af3756c0-4b9e-47f7-95f1-97c32a400d4b"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d66b1667-9256-491f-be75-f20b2a941a2c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5989aefe-6c9d-4a95-85f1-aabf1ebb2470"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/594256a2-2aa3-4104-9f96-2d92afd178eb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3ed55d0-93c3-48c7-bb32-cf30e4bb6941"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13363cd3-fce0-4b96-89e1-6985ef407782"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0e8d5ef3-dc8b-4835-bf97-abd20b110dee"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1340, 17, 1.2686567164179106, 498.0111940298508, 131, 5925, 158.0, 1337.7000000000003, 1702.4000000000005, 2510.7999999999984, 5.212628565204537, 729.3984964885265, 3.808133329508146], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 2350.3050847457625, 1663, 3330, 2310.0, 2846.0, 3082.0, 3330.0, 0.2535714899688838, 305.1312459103539, 1.2468090351497363], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dcb3ee53-a4c8-447a-a872-e090430d0c8e", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 0.6229795258620691, 2.3774245689655173], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 718.8666666666666, 148, 2963, 558.0, 1737.8000000000006, 2963.0, 2963.0, 0.07310689690465398, 0.014321526874095302, 0.04922340675702679], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 718.8666666666666, 148, 2963, 558.0, 1737.8000000000006, 2963.0, 2963.0, 0.07205268492321586, 0.014115008394137792, 0.04851359814296213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 159.99999999999997, 133, 418, 141.0, 260.80000000000007, 418.0, 418.0, 0.0919585328322615, 0.033813918843529495, 0.051930228762176844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 146.66666666666666, 142, 153, 147.0, 151.8, 153.0, 153.0, 0.09195289559668234, 0.0683360874502688, 0.046156043297553434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 265.73333333333335, 135, 1136, 144.0, 710.0000000000002, 1136.0, 1136.0, 0.09195909659383507, 1.8257353087679933, 0.0536248455853503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 264.46666666666664, 137, 1647, 146.0, 913.2000000000005, 1647.0, 1647.0, 0.09195402298850575, 5.539158285440613, 0.05353208812260536], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 431.5, 142, 2519, 264.0, 1081.9000000000015, 2519.0, 2519.0, 0.07459311785246414, 0.14685064796943545, 0.04821417956894502], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/02eb5890-a8f6-494c-b112-b1dec1d95038", 3, 0, 0.0, 366.3333333333333, 261, 475, 363.0, 475.0, 475.0, 475.0, 0.0253324889170361, 0.02540670519316023, 0.016245118218281614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70eba7cf-e7af-49d3-ac04-2525802046bd", 3, 0, 0.0, 421.6666666666667, 323, 598, 344.0, 598.0, 598.0, 598.0, 0.03329338127580237, 0.027755322085719358, 0.02135024775824566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 183.66666666666666, 136, 450, 146.0, 429.0, 450.0, 450.0, 0.09235998226688341, 0.06863861963388504, 0.046360381723806715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 256.06666666666666, 140, 433, 149.0, 433.0, 433.0, 433.0, 0.09235941357929672, 0.052457260681366184, 0.05112237853197791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 1083.3333333333333, 833, 1266, 1151.0, 1266.0, 1266.0, 1266.0, 0.054055028018522855, 15.893973033297897, 0.030828258166813814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1511.6666666666667, 1416, 1601, 1518.0, 1601.0, 1601.0, 1601.0, 0.05379814934366258, 48.407669346486976, 0.03062921979233914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 239.66666666666666, 144, 423, 152.0, 423.0, 423.0, 423.0, 0.05505395287381634, 0.09741969004624533, 0.030483975858841668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 197.99999999999997, 139, 445, 149.0, 443.4, 445.0, 445.0, 0.0860746419041736, 0.0639675805557384, 0.043205435487055896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 190.52941176470588, 134, 418, 144.0, 417.2, 418.0, 418.0, 0.08596147914422819, 0.023001411411639184, 0.04902490607444264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 227.64705882352942, 135, 435, 146.0, 433.4, 435.0, 435.0, 0.08607987199416683, 0.023201215498427775, 0.05060554974657073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 243.88235294117644, 136, 446, 145.0, 445.2, 446.0, 446.0, 0.08594670293280483, 0.023165322274857555, 0.050611193230938795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 145.0, 141, 150, 144.0, 150.0, 150.0, 150.0, 0.05505597357313268, 0.04091562098550192, 0.03091521953569462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 833.6500000000001, 131, 1911, 659.0, 1852.6000000000004, 1908.85, 1911.0, 0.09469652132328919, 42.61681000859371, 0.05160220595546423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 444.8666666666667, 133, 1682, 145.0, 1603.4, 1682.0, 1682.0, 0.0923673758428523, 16.642382145001385, 0.052714350041565314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 640.9999999999999, 136, 1208, 629.0, 1178.0, 1206.6, 1208.0, 0.0946996600282205, 13.935184445344092, 0.05169639644118678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 343.20000000000005, 139, 1183, 147.0, 989.2, 1183.0, 1183.0, 0.0923639632760882, 5.451530374659023, 0.05280260166193557], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 543.6428571428571, 153, 1222, 496.0, 1037.5, 1222.0, 1222.0, 0.07024903282135168, 0.013838118630545283, 0.04771798839385622], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28e2b234-7691-474c-a279-6ba82a3edf47", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 0.30466115092748736, 1.1626528246205734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 479.88235294117646, 287, 888, 303.0, 878.4, 888.0, 888.0, 0.08588027279616064, 0.1330976493432685, 0.19314674633745896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28e2b234-7691-474c-a279-6ba82a3edf47", 3, 0, 0.0, 354.3333333333333, 265, 494, 304.0, 494.0, 494.0, 494.0, 0.026192409439744362, 0.026269145014274863, 0.016796564647231896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8eaaeade-28cd-4f2a-b775-816843ba8650", 2, 0, 0.0, 266.0, 263, 269, 266.0, 269.0, 269.0, 269.0, 0.01862700356707118, 0.03150583025211649, 0.011578210713321102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 675.6500000000001, 152, 1339, 709.0, 1088.7, 1326.6999999999998, 1339.0, 0.09470235051233972, 0.05817165866431805, 0.04281951981173173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 145.50000000000006, 133, 179, 144.5, 150.8, 177.59999999999997, 179.0, 0.09469741807489619, 0.07037571792480078, 0.04753366493212562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 213.1, 132, 456, 144.5, 432.9, 454.84999999999997, 456.0, 0.09470055683927422, 0.09645769607750293, 0.05003222778324937], "isController": false}, {"data": ["login", 20, 0, 0.0, 3932.35, 2331, 6960, 3413.5, 6734.200000000002, 6951.9, 6960.0, 0.09230243816890424, 16.69339621485008, 0.16222333786384469], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e3ed55d0-93c3-48c7-bb32-cf30e4bb6941", 3, 0, 0.0, 351.0, 245, 516, 292.0, 516.0, 516.0, 516.0, 0.024987298123453912, 0.025060503098424967, 0.01602375563255345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 150.20000000000002, 138, 168, 149.0, 163.2, 168.0, 168.0, 0.08819379115710255, 0.07139907506761524, 0.03135013670037629], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5989aefe-6c9d-4a95-85f1-aabf1ebb2470", 1, 0, 0.0, 853.0, 853, 853, 853.0, 853.0, 853.0, 853.0, 1.1723329425556857, 0.21179843200468934, 0.8082686107854631], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e80095b-f784-4c19-ac5a-e484bc8f9ece", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 0.705718994140625, 2.69317626953125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af3756c0-4b9e-47f7-95f1-97c32a400d4b", 3, 0, 0.0, 439.3333333333333, 254, 667, 397.0, 667.0, 667.0, 667.0, 0.03759162959714304, 0.031338594856212015, 0.024106611427855397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b90db1e7-fb34-4b0a-860f-ba389437773b", 2, 0, 0.0, 364.0, 261, 467, 364.0, 467.0, 467.0, 467.0, 0.016397340351395007, 0.02802279845209107, 0.010192292122717696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c184d054-d915-49aa-a930-c7d3be478894", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=594256a2-2aa3-4104-9f96-2d92afd178eb", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 982.9500000000003, 272, 2058, 821.0, 1997.9000000000003, 2055.75, 2058.0, 0.09463020880155572, 56.678643425684534, 0.20071954445017484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13363cd3-fce0-4b96-89e1-6985ef407782", 3, 0, 0.0, 472.33333333333337, 259, 816, 342.0, 816.0, 816.0, 816.0, 0.06636580833554553, 0.030028799995575613, 0.042558802871427305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e8d5ef3-dc8b-4835-bf97-abd20b110dee", 1, 0, 0.0, 643.0, 643, 643, 643.0, 643.0, 643.0, 643.0, 1.5552099533437014, 0.2809705482115085, 1.072244362363919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 468.2, 288, 1792, 297.0, 1061.8000000000004, 1792.0, 1792.0, 0.09186729463066286, 7.4598994474182225, 0.20504469152493585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 3, 50.0, 900.0, 141, 1743, 853.0, 1743.0, 1743.0, 1743.0, 0.07633005114113427, 45.66885101805206, 0.11112830525023536], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1635.0000000000002, 640, 3365, 1573.0, 3230.6, 3359.6, 3365.0, 0.08809761215426692, 0.02785899276398249, 0.0397471648586634], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/91b88371-d79a-430c-b501-f1faacd0341a", 1, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 1.040182206840391, 1.9435820439739413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 706.5999999999999, 285, 1967, 555.0, 1884.2, 1967.0, 1967.0, 0.09227532496293608, 22.193080734757658, 0.20280746714998432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 166.52941176470594, 141, 434, 150.0, 215.5999999999998, 434.0, 434.0, 0.09476242502619903, 0.07357043739826975, 0.03368508077103169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 557.1052631578948, 278, 1914, 297.0, 1478.0, 1914.0, 1914.0, 0.1329917545112203, 16.932244146175435, 0.29551976371214983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 220.54545454545456, 137, 429, 145.0, 429.0, 429.0, 429.0, 0.054150913673597985, 0.040243012993757876, 0.027181220340067737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 247.27272727272725, 135, 443, 145.0, 440.6, 443.0, 443.0, 0.054150913673597985, 0.01448959994781821, 0.03088294295447385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 195.45454545454547, 140, 422, 145.0, 418.2, 422.0, 422.0, 0.05415118024958771, 0.014595435301646689, 0.031834971201417775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 243.63636363636365, 135, 443, 145.0, 441.4, 443.0, 443.0, 0.054151446828202075, 0.014595507152913842, 0.031888010192779155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 157.0, 153, 161, 157.0, 161.0, 161.0, 161.0, 0.16718214494691966, 0.04930567165426733, 0.10334599389785172], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1611.7457627118645, 1087, 2696, 1451.0, 2259.0, 2469.0, 2696.0, 0.26220124612253237, 313.68384626452104, 0.5177450387302349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1635.0000000000002, 640, 3365, 1573.0, 3230.6, 3359.6, 3365.0, 0.08880564480971372, 0.028082893005344486, 0.04006660927938256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 205.2, 142, 448, 145.0, 448.0, 448.0, 448.0, 0.02468136359597595, 0.006652398781727893, 0.014534045164427245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 201.8, 141, 424, 145.0, 424.0, 424.0, 424.0, 0.024681972780720415, 0.00665256297605355, 0.014510300404290714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 158.58823529411765, 134, 422, 143.0, 208.3999999999998, 422.0, 422.0, 0.09057150620414818, 0.02441185128158681, 0.053246139389548044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 191.58823529411765, 140, 422, 145.0, 412.4, 422.0, 422.0, 0.09057198874776233, 0.02441198134217032, 0.05333487228017646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 147.2, 143, 156, 146.0, 156.0, 156.0, 156.0, 0.02468160726626518, 0.006604258194293612, 0.01407622914404186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 162.47058823529412, 135, 435, 146.0, 210.9999999999998, 435.0, 435.0, 0.09056619856372665, 0.06730554404980076, 0.0454599863884331], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 203.4, 143, 434, 146.0, 434.0, 434.0, 434.0, 0.024680876269831085, 0.018341940274747514, 0.012388642971380055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 176.41176470588232, 135, 423, 145.0, 413.4, 423.0, 423.0, 0.09057005860415557, 0.024234566462440064, 0.051653236547682474], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 557.3846153846155, 141, 816, 521.0, 807.6, 816.0, 816.0, 0.06732960430909467, 0.012614185182307851, 0.045823784182722184], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 154.0, 148, 163, 150.0, 163.0, 163.0, 163.0, 0.02503868476796651, 0.01970818351853614, 0.008900469976113094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 2341.6, 1163, 5925, 1851.5, 5196.600000000004, 5898.15, 5925.0, 0.09557579638532337, 0.04946794148849745, 0.04396113290770245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 412.0, 288, 882, 292.0, 882.0, 882.0, 882.0, 0.02466322368064085, 0.038223179669118194, 0.055468168102066284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dcb3ee53-a4c8-447a-a872-e090430d0c8e", 3, 0, 0.0, 1784.0, 557, 2519, 2276.0, 2519.0, 2519.0, 2519.0, 0.08316699933466401, 0.03763090139166112, 0.05333300413062763], "isController": false}, {"data": ["addBook", 60, 5, 8.333333333333334, 1418.9833333333333, 738, 3184, 1204.0, 2500.7, 2713.5499999999997, 3184.0, 0.2786925603021027, 89.97055874374684, 1.0133495550789398], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 244.62711864406776, 141, 606, 150.0, 572.0, 581.0, 606.0, 0.26401045302403836, 0.19620308081180976, 0.12762224047548731], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 913.6440677966103, 668, 1320, 860.0, 1185.0, 1265.0, 1320.0, 0.26371072274616725, 77.53970850746435, 0.13262795138112904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8f6154c-f03c-4c6e-922a-f7ca6c73e7b2", 1, 0, 0.0, 312.0, 312, 312, 312.0, 312.0, 312.0, 312.0, 3.205128205128205, 1.0235126201923077, 1.9124348958333333], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 191.06779661016944, 132, 589, 146.0, 426.0, 432.0, 589.0, 0.26421972333060156, 0.4675450572998536, 0.1284974826353902], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 1365.2542372881355, 941, 2092, 1304.0, 1749.0, 1911.0, 2092.0, 0.26290694876433734, 236.56413463927163, 0.13196696451647402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 182.6315789473684, 143, 456, 151.0, 438.0, 456.0, 456.0, 0.13499495545166468, 0.10085072355519872, 0.04798648807070893], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 5, 2.793296089385475, 216.56424581005592, 134, 877, 152.0, 384.0, 466.0, 625.7999999999964, 0.7665296334361082, 1.6575885496959575, 0.36795479910714285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 179.36363636363635, 138, 430, 153.0, 381.20000000000016, 430.0, 430.0, 0.054369315935152235, 0.04210436282868723, 0.019326592773823648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70eba7cf-e7af-49d3-ac04-2525802046bd", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02eb5890-a8f6-494c-b112-b1dec1d95038", 1, 0, 0.0, 1222.0, 1222, 1222, 1222.0, 1222.0, 1222.0, 1222.0, 0.8183306055646482, 0.14784293166939444, 0.5642005932896891], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e80095b-f784-4c19-ac5a-e484bc8f9ece", 3, 0, 0.0, 493.66666666666663, 288, 795, 398.0, 795.0, 795.0, 795.0, 0.06524292114305598, 0.029520722782828062, 0.041838722217389414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 167.60000000000002, 141, 436, 147.0, 270.4000000000001, 436.0, 436.0, 0.09381156383876918, 0.07613028276368866, 0.033347079333312483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 497.09090909090907, 278, 872, 303.0, 872.0, 872.0, 872.0, 0.05411255411255411, 0.08386389001623376, 0.12170040246212122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c184d054-d915-49aa-a930-c7d3be478894", 3, 0, 0.0, 383.3333333333333, 270, 521, 359.0, 521.0, 521.0, 521.0, 0.0182178121622114, 0.02511472477440276, 0.011682646471209784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af3756c0-4b9e-47f7-95f1-97c32a400d4b", 1, 0, 0.0, 791.0, 791, 791, 791.0, 791.0, 791.0, 791.0, 1.2642225031605563, 0.22839957332490518, 0.8716221554993678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 374.8235294117647, 277, 857, 296.0, 627.3999999999997, 857.0, 857.0, 0.09049532884405526, 0.1402500848393708, 0.20352611555455005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d66b1667-9256-491f-be75-f20b2a941a2c", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.5672041518650089, 1.0598218250444051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5989aefe-6c9d-4a95-85f1-aabf1ebb2470", 3, 0, 0.0, 1342.3333333333333, 413, 3098, 516.0, 3098.0, 3098.0, 3098.0, 0.03345078274831631, 0.027886541216939478, 0.021451185551491905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/594256a2-2aa3-4104-9f96-2d92afd178eb", 3, 0, 0.0, 445.3333333333333, 287, 630, 419.0, 630.0, 630.0, 630.0, 0.018570102135561747, 0.025600384942742183, 0.01190856159083875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3ed55d0-93c3-48c7-bb32-cf30e4bb6941", 1, 0, 0.0, 715.0, 715, 715, 715.0, 715.0, 715.0, 715.0, 1.3986013986013985, 0.2526770104895105, 0.9642701048951049], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 149.94117647058823, 144, 159, 149.0, 157.4, 159.0, 159.0, 0.08548641771680864, 0.07087692250153373, 0.030387750047771823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13363cd3-fce0-4b96-89e1-6985ef407782", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e8d5ef3-dc8b-4835-bf97-abd20b110dee", 3, 0, 0.0, 1349.6666666666667, 466, 3063, 520.0, 3063.0, 3063.0, 3063.0, 0.05634014423076923, 0.03622128413273738, 0.03612958467923678], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 183.24999999999997, 141, 505, 149.0, 429.5000000000006, 502.7, 505.0, 0.09023845511764839, 0.07005817560403366, 0.03207695084260158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 171.26315789473682, 133, 433, 143.0, 402.0, 433.0, 433.0, 0.13339511633458304, 0.09913445657286885, 0.0669580955038825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 217.68421052631578, 135, 440, 144.0, 438.0, 440.0, 440.0, 0.13312500437911198, 0.05666844604583703, 0.07474596771368314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 336.6842105263157, 134, 1764, 145.0, 1338.0, 1764.0, 1764.0, 0.13340448239060834, 12.667707316709262, 0.07722046056142223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 302.4210526315789, 132, 1142, 146.0, 1077.0, 1142.0, 1142.0, 0.13313806417254692, 4.152845563349193, 0.07719626346271083], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 29.41176470588235, 0.373134328358209], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.764705882352942, 0.14925373134328357], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.07462686567164178], "isController": false}, {"data": ["401/Unauthorized", 9, 52.94117647058823, 0.6716417910447762], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1340, 17, "401/Unauthorized", 9, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
