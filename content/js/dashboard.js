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

    var data = {"OkPercent": 98.32134292565948, "KoPercent": 1.6786570743405276};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7231774415405777, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7607c2da-4864-4557-a9ce-40671635966e"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f5d898d-3d6f-451e-b002-c12d11d85b98"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4230769230769231, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36c54122-c006-49b0-84ab-85e9fc9924a0"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/16e85fdb-deca-41be-941f-5f0ec1889d7f"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ee86c48f-c5c6-4815-8df4-8df3a518d126"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2f0816ab-4b88-455e-bd68-56391f19168d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d721711e-1e73-4bed-a87b-143d21ef945b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4666370d-ec12-4e7d-89d2-cd8a058cd0df"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/ff8c9c2b-dbc8-401f-86b1-9c911d92f007"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f0816ab-4b88-455e-bd68-56391f19168d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/944440ed-5238-43cb-abea-dce827be01e4"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dfc74cdb-6369-494b-af6d-82c98b8d0ffe"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f3958e6-caa6-4f91-aa78-705360a2d97e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1f5d898d-3d6f-451e-b002-c12d11d85b98"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=163100da-7873-4ec1-8542-b367366262a9"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d3b3d1d6-b31e-493e-83bd-047049f2693d"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.21296296296296297, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7607c2da-4864-4557-a9ce-40671635966e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/87e00289-8fc8-443a-8589-eea5c52f99ee"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/36c54122-c006-49b0-84ab-85e9fc9924a0"], "isController": false}, {"data": [0.29464285714285715, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/05bb0299-5522-495a-9922-e6aa9e8c85ba"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9427710843373494, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4666370d-ec12-4e7d-89d2-cd8a058cd0df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3f3958e6-caa6-4f91-aa78-705360a2d97e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/163100da-7873-4ec1-8542-b367366262a9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee86c48f-c5c6-4815-8df4-8df3a518d126"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87e00289-8fc8-443a-8589-eea5c52f99ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dfc74cdb-6369-494b-af6d-82c98b8d0ffe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1251, 21, 1.6786570743405276, 502.1111111111112, 139, 4213, 162.0, 1389.1999999999998, 1697.1999999999996, 2408.8400000000006, 4.927408364384014, 691.1789934138748, 3.6013641457189447], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/7607c2da-4864-4557-a9ce-40671635966e", 3, 0, 0.0, 919.0, 273, 2050, 434.0, 2050.0, 2050.0, 2050.0, 0.02523510708097105, 0.02530903805874733, 0.016182669579919585], "isController": false}, {"data": ["see books", 54, 0, 0.0, 2377.0740740740744, 1695, 3252, 2423.0, 2902.0, 3097.5, 3252.0, 0.23727085786596833, 285.51716379351063, 1.1666589544483892], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f5d898d-3d6f-451e-b002-c12d11d85b98", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 0.7084865196078431, 2.703737745098039], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 717.2307692307692, 162, 2095, 530.0, 1806.1999999999998, 2095.0, 2095.0, 0.07535008810164148, 0.014937566293587128, 0.05065980232194195], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 717.2307692307692, 162, 2095, 530.0, 1806.1999999999998, 2095.0, 2095.0, 0.07487530382094434, 0.014843444019191115, 0.05034059263802974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 190.5, 140, 430, 144.0, 421.0, 430.0, 430.0, 0.10512299390286635, 0.02812861360291541, 0.05995295746022847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 177.83333333333334, 142, 453, 145.5, 426.00000000000006, 453.0, 453.0, 0.10513158970644923, 0.078130019303328, 0.05277112998937003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 189.88888888888889, 139, 431, 142.5, 425.6, 431.0, 431.0, 0.10512544970331261, 0.02833459386534598, 0.06190492790146242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 237.55555555555551, 140, 431, 145.0, 427.4, 431.0, 431.0, 0.10512483574244415, 0.028334428383705652, 0.061801905387647835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36c54122-c006-49b0-84ab-85e9fc9924a0", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 293.0, 145, 653, 263.0, 564.1999999999999, 653.0, 653.0, 0.07585659602278033, 0.16838090113259732, 0.04902870734525254], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 180.5, 140, 417, 146.0, 416.3, 417.0, 417.0, 0.10681620935977033, 0.07938196808865745, 0.053616730088790976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16e85fdb-deca-41be-941f-5f0ec1889d7f", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.5764186597472923, 1.0770391471119132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 206.81250000000003, 140, 573, 144.5, 481.30000000000007, 573.0, 573.0, 0.10651257846981367, 0.03849899229115213, 0.06018636788778899], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1048.2, 704, 1164, 1123.0, 1164.0, 1164.0, 1164.0, 0.044912331129634955, 13.205716581857214, 0.025614063847369934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1266.6, 975, 1544, 1278.0, 1544.0, 1544.0, 1544.0, 0.044799655938642394, 40.31080916298563, 0.025506054113504407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 314.4, 141, 435, 415.0, 435.0, 435.0, 435.0, 0.04520550422219409, 0.0799925523931794, 0.025030782123031302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee86c48f-c5c6-4815-8df4-8df3a518d126", 3, 0, 0.0, 584.0, 455, 653, 644.0, 653.0, 653.0, 653.0, 0.017483638228557773, 0.024102606737611384, 0.011211838317141542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f0816ab-4b88-455e-bd68-56391f19168d", 3, 0, 0.0, 1301.6666666666667, 383, 2907, 615.0, 2907.0, 2907.0, 2907.0, 0.030501133625466414, 0.025427540108990718, 0.019559646237685167], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d721711e-1e73-4bed-a87b-143d21ef945b", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.8294439935064934, 1.54981737012987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 168.53846153846155, 141, 434, 146.0, 321.9999999999999, 434.0, 434.0, 0.07213125669294834, 0.0536053577571618, 0.036206509707202586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 212.07692307692307, 141, 448, 146.0, 442.0, 448.0, 448.0, 0.07213485889311834, 0.02763580080791042, 0.04067339624787757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 311.92307692307696, 140, 1743, 147.0, 1218.5999999999995, 1743.0, 1743.0, 0.07213325787084818, 5.010687556527505, 0.04192962360311171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 195.84615384615384, 139, 831, 144.0, 557.7999999999997, 831.0, 831.0, 0.07213485889311834, 1.6494888308881466, 0.0420009984435517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 146.2, 141, 158, 144.0, 158.0, 158.0, 158.0, 0.045310376076121435, 0.033673043158133215, 0.02544283812868147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 899.7777777777778, 141, 1885, 1247.0, 1733.8000000000002, 1885.0, 1885.0, 0.08511966406105917, 42.56065404117427, 0.04597717965450874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 259.625, 141, 1278, 143.0, 785.9000000000005, 1278.0, 1278.0, 0.10651045133803755, 6.016806860354813, 0.06204441818665957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 671.8888888888888, 141, 1419, 840.0, 1269.6000000000001, 1419.0, 1419.0, 0.08511966406105917, 13.91464522242241, 0.04606030432644337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 224.00000000000003, 139, 1134, 144.5, 641.2000000000005, 1134.0, 1134.0, 0.10682120133793555, 1.9900534231187788, 0.06232975371036767], "isController": false}, {"data": ["deleteBooks", 12, 2, 16.666666666666668, 620.8333333333334, 150, 2385, 527.5, 1905.3000000000018, 2385.0, 2385.0, 0.0907248918861705, 0.018118398819064324, 0.061472611478210905], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4666370d-ec12-4e7d-89d2-cd8a058cd0df", 3, 0, 0.0, 1582.3333333333333, 235, 3304, 1208.0, 3304.0, 3304.0, 3304.0, 0.020948257803226032, 0.02476013153760212, 0.01343361584386565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 504.30769230769226, 287, 1895, 296.0, 1483.7999999999997, 1895.0, 1895.0, 0.07207287121686727, 6.735738234103774, 0.16067507505280726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff8c9c2b-dbc8-401f-86b1-9c911d92f007", 1, 0, 0.0, 2427.0, 2427, 2427, 2427.0, 2427.0, 2427.0, 2427.0, 0.4120313143798929, 0.13157640605686033, 0.24585071590440874], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f0816ab-4b88-455e-bd68-56391f19168d", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/944440ed-5238-43cb-abea-dce827be01e4", 2, 0, 0.0, 263.5, 248, 279, 263.5, 279.0, 279.0, 279.0, 0.013629455980264547, 0.026939471585991644, 0.008471824933045297], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 750.047619047619, 224, 2246, 644.0, 1283.4, 2151.299999999999, 2246.0, 0.09390091218028974, 0.05767936890761939, 0.042457150722142734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 160.38888888888889, 141, 436, 144.0, 179.5000000000004, 436.0, 436.0, 0.08511765150941969, 0.06325637968619958, 0.042725071167814176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 300.2777777777778, 140, 432, 419.0, 431.1, 432.0, 432.0, 0.08511845651865513, 0.09380024353336171, 0.04457266397124888], "isController": false}, {"data": ["login", 21, 0, 0.0, 3630.857142857143, 2176, 6113, 3341.0, 5023.6, 6006.0999999999985, 6113.0, 0.09218491415828589, 26.385149497317858, 0.1754831408607437], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dfc74cdb-6369-494b-af6d-82c98b8d0ffe", 3, 0, 0.0, 859.3333333333334, 244, 1887, 447.0, 1887.0, 1887.0, 1887.0, 0.024537669412159235, 0.024609557115515168, 0.015735419512354718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f3958e6-caa6-4f91-aa78-705360a2d97e", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 150.0625, 144, 163, 149.0, 163.0, 163.0, 163.0, 0.1073400465587452, 0.0868993150363279, 0.038156032175178954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1078.2222222222224, 287, 2028, 1390.5, 1881.3000000000002, 2028.0, 2028.0, 0.08505973083320732, 56.592483555118704, 0.17921058958207317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f5d898d-3d6f-451e-b002-c12d11d85b98", 3, 0, 0.0, 739.6666666666666, 231, 1514, 474.0, 1514.0, 1514.0, 1514.0, 0.06313264168017003, 0.02856587628106652, 0.04048545055661946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=163100da-7873-4ec1-8542-b367366262a9", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.7314334514170041, 2.791308198380567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 464.3333333333333, 286, 885, 435.0, 857.1, 885.0, 885.0, 0.10503404853740088, 0.1627822607703664, 0.23622403689612717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 870.8888888888889, 141, 1686, 1263.0, 1686.0, 1686.0, 1686.0, 0.08052466291481385, 53.52929392173003, 0.12458780040172861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3b3d1d6-b31e-493e-83bd-047049f2693d", 1, 0, 0.0, 340.0, 340, 340, 340.0, 340.0, 340.0, 340.0, 2.941176470588235, 0.9392233455882353, 1.7549402573529411], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1506.0909090909092, 243, 4213, 1373.0, 3484.3999999999987, 4171.749999999999, 4213.0, 0.09554043314558192, 0.030059951621798853, 0.04310515636060434], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 150.05882352941177, 142, 159, 149.0, 157.4, 159.0, 159.0, 0.07704649075895326, 0.05981636733727328, 0.027387619761971668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 477.9375, 289, 1695, 292.0, 1202.2000000000005, 1695.0, 1695.0, 0.10640844883083717, 8.110948940986539, 0.23761349541778617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 454.37500000000006, 288, 859, 447.5, 668.6000000000001, 859.0, 859.0, 0.07972137379857398, 0.12355255880696964, 0.17929523814269127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 193.0, 142, 431, 145.5, 431.0, 431.0, 431.0, 0.03903378373982682, 0.029008505298836144, 0.01959312972878026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 191.33333333333331, 141, 438, 142.0, 438.0, 438.0, 438.0, 0.03903581536059334, 0.020216791093328128, 0.021716213688559253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 431.1666666666667, 140, 1585, 142.5, 1585.0, 1585.0, 1585.0, 0.03903556139643215, 5.862812213332597, 0.022389537493656724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 311.33333333333337, 142, 858, 144.0, 858.0, 858.0, 858.0, 0.03903505347802327, 1.9217012736812658, 0.02242736633747105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 152.5, 150, 155, 152.5, 155.0, 155.0, 155.0, 0.05287088928835783, 0.015592781801839905, 0.032682883710479005], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1639.6111111111115, 1119, 2604, 1579.0, 2291.5, 2434.5, 2604.0, 0.2337065424848199, 279.59427435200536, 0.4614791297893612], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1506.0909090909092, 243, 4213, 1373.0, 3484.3999999999987, 4171.749999999999, 4213.0, 0.09306260575296108, 0.029280351099830796, 0.041987230329949235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 143.33333333333331, 142, 146, 143.0, 146.0, 146.0, 146.0, 0.029073148040469822, 0.007836121932782882, 0.0171202229183626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7607c2da-4864-4557-a9ce-40671635966e", 1, 0, 0.0, 2385.0, 2385, 2385, 2385.0, 2385.0, 2385.0, 2385.0, 0.4192872117400419, 0.07575013102725367, 0.2890788784067086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 238.0, 141, 435, 144.5, 435.0, 435.0, 435.0, 0.029073148040469822, 0.007836121932782882, 0.01709183117222933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 248.6470588235294, 140, 1376, 144.0, 620.7999999999993, 1376.0, 1376.0, 0.07993642702979749, 4.2512743174252, 0.046589785652821986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 244.35294117647058, 141, 1298, 144.0, 598.7999999999994, 1298.0, 1298.0, 0.07983094623150974, 1.4010129285043438, 0.046606267609767556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 178.94117647058823, 140, 432, 146.0, 430.4, 432.0, 432.0, 0.07993454771152092, 0.059404483211393966, 0.04012339601925952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 190.5, 140, 435, 142.0, 435.0, 435.0, 435.0, 0.029073429792512623, 0.007779413831199667, 0.016580940428542357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 210.17647058823533, 142, 442, 144.0, 427.59999999999997, 442.0, 442.0, 0.07983432030468533, 0.028415294612122607, 0.04513610871086357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 146.83333333333334, 142, 156, 144.5, 156.0, 156.0, 156.0, 0.029072866293887913, 0.021605909423485063, 0.014593216088924207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 198.16666666666669, 143, 439, 150.0, 439.0, 439.0, 439.0, 0.027827635624939128, 0.02190339288447357, 0.009891854851052581], "isController": false}, {"data": ["deleteAccount", 12, 2, 16.666666666666668, 812.8333333333333, 141, 2050, 626.5, 2001.1000000000001, 2050.0, 2050.0, 0.08962179602079225, 0.01748967015444823, 0.06098774888719604], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1827.2857142857147, 1231, 3641, 1454.0, 2754.8, 3552.4999999999986, 3641.0, 0.09384174706521109, 0.0485704354927362, 0.04316353795675236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 386.16666666666663, 285, 582, 297.5, 582.0, 582.0, 582.0, 0.029052594880932783, 0.045025847730508134, 0.06533996680741035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87e00289-8fc8-443a-8589-eea5c52f99ee", 3, 0, 0.0, 393.0, 263, 638, 278.0, 638.0, 638.0, 638.0, 0.03534026787923053, 0.029461727226142376, 0.022662867097032597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36c54122-c006-49b0-84ab-85e9fc9924a0", 3, 0, 0.0, 558.0, 431, 810, 433.0, 810.0, 810.0, 810.0, 0.016705274411974343, 0.023029569379788846, 0.010712692249866358], "isController": false}, {"data": ["addBook", 56, 7, 12.5, 1405.4821428571424, 738, 3005, 1163.0, 2387.2000000000007, 2627.7999999999997, 3005.0, 0.28528490282483, 86.42359474897476, 1.0380482023230342], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/05bb0299-5522-495a-9922-e6aa9e8c85ba", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 1.0824947033898307, 2.0226430084745766], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 269.25925925925924, 141, 827, 148.0, 582.5, 594.0, 827.0, 0.2347009735744089, 0.17442132899426285, 0.11345408390559805], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 946.425925925926, 696, 1308, 861.0, 1263.5, 1283.75, 1308.0, 0.23473055974544774, 69.01857835327819, 0.11805296705947813], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 216.12962962962962, 139, 562, 146.0, 428.5, 430.75, 562.0, 0.23543773979769794, 0.41661443800139514, 0.11449999455005232], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1368.6481481481485, 975, 2002, 1363.0, 1736.5, 1818.75, 2002.0, 0.23458677973170222, 211.08159676215942, 0.11775156717001459], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 153.6875, 145, 196, 151.0, 170.8, 196.0, 196.0, 0.07870800804789382, 0.05880041616859256, 0.02797823723577476], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 7, 4.216867469879518, 220.75903614457843, 141, 1138, 155.5, 373.20000000000005, 422.50000000000006, 1054.2500000000016, 0.7028567315468353, 1.5138684866668926, 0.33762626810597046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 250.33333333333334, 146, 462, 156.0, 462.0, 462.0, 462.0, 0.039965097148490315, 0.030949533240969555, 0.014206343127002417], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4666370d-ec12-4e7d-89d2-cd8a058cd0df", 1, 0, 0.0, 710.0, 710, 710, 710.0, 710.0, 710.0, 710.0, 1.4084507042253522, 0.25445642605633806, 0.9710607394366197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 168.55555555555554, 143, 476, 150.5, 191.60000000000045, 476.0, 476.0, 0.10936731011100782, 0.08875413545141357, 0.03887666101602231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f3958e6-caa6-4f91-aa78-705360a2d97e", 3, 0, 0.0, 454.6666666666667, 291, 547, 526.0, 547.0, 547.0, 547.0, 0.01964379256155055, 0.0270805538731011, 0.012597093537192247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/163100da-7873-4ec1-8542-b367366262a9", 3, 0, 0.0, 382.0, 265, 592, 289.0, 592.0, 592.0, 592.0, 0.06906872337976287, 0.03125179866467134, 0.04429211753194428], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee86c48f-c5c6-4815-8df4-8df3a518d126", 1, 0, 0.0, 660.0, 660, 660, 660.0, 660.0, 660.0, 660.0, 1.5151515151515151, 0.27373342803030304, 1.044625946969697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 626.5, 286, 1731, 291.5, 1731.0, 1731.0, 1731.0, 0.03899674377189505, 7.825974949060503, 0.0860416436477554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 479.9411764705883, 286, 1523, 292.0, 996.5999999999996, 1523.0, 1523.0, 0.07977512799215387, 5.730409486905148, 0.17821547291399772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87e00289-8fc8-443a-8589-eea5c52f99ee", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 173.84615384615384, 147, 429, 151.0, 326.9999999999999, 429.0, 429.0, 0.06998126655326113, 0.05802157744503779, 0.02487615334510454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 167.44444444444449, 144, 426, 152.0, 192.00000000000037, 426.0, 426.0, 0.08578209441749192, 0.06659840338076765, 0.03049285387496783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dfc74cdb-6369-494b-af6d-82c98b8d0ffe", 1, 0, 0.0, 786.0, 786, 786, 786.0, 786.0, 786.0, 786.0, 1.272264631043257, 0.22985249681933842, 0.8771668256997455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 166.18749999999997, 142, 431, 145.5, 255.30000000000018, 431.0, 431.0, 0.07977901213638222, 0.05928889476151061, 0.04004532445126998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 196.18749999999997, 140, 434, 143.5, 428.4, 434.0, 434.0, 0.07978259243561295, 0.021348076491560498, 0.04550100974843552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 267.18749999999994, 141, 430, 148.0, 429.3, 430.0, 430.0, 0.0797821946087182, 0.02150379464063108, 0.04690320425239097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 232.4375, 141, 431, 144.5, 430.3, 431.0, 431.0, 0.0797821946087182, 0.02150379464063108, 0.04698111655181355], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 28.571428571428573, 0.47961630695443647], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.523809523809524, 0.15987210231814547], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.523809523809524, 0.15987210231814547], "isController": false}, {"data": ["401/Unauthorized", 11, 52.38095238095238, 0.8792965627498002], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1251, 21, "401/Unauthorized", 11, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
