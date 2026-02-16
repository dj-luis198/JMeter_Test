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

    var data = {"OkPercent": 69.00958466453675, "KoPercent": 30.990415335463258};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5251168224299065, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35541dbe-7cf0-4b7f-8ded-cf5db67bcbb7"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d94084be-4d0a-4f0c-8417-db2bde858147"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.78125, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.78125, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c3d2fce-3902-4061-bffd-88a7d871ddf7"], "isController": false}, {"data": [0.84375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f6134367-5105-4db0-846a-8201cf9762c7"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c3d2fce-3902-4061-bffd-88a7d871ddf7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eca0c6f8-5e87-4d0a-9773-120a43af9839"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/35541dbe-7cf0-4b7f-8ded-cf5db67bcbb7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b7ed167-a39c-4cae-b19b-9a7fd4725a02"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4b2a9d30-ca20-451d-80fc-d7a34abb0c8a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.71875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9431818181818182, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eca0c6f8-5e87-4d0a-9773-120a43af9839"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fcf4aeca-f639-4aea-9305-72d8a22f5f14"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8a6fd285-6021-4ab3-a68a-d977e889e908"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f3ada1a-44de-4dfe-9662-4df45e0a3396"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad2856f4-01e1-465e-a37e-89a808211b9a"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b2a9d30-ca20-451d-80fc-d7a34abb0c8a"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5b7ed167-a39c-4cae-b19b-9a7fd4725a02"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/301d212c-929b-4fe0-98a2-35d3e7b337aa"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f6134367-5105-4db0-846a-8201cf9762c7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0d8f6a4-68b0-444e-a7f6-df27c148bb63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d6ef92a8-ce94-4c95-9f94-cdc19db20b20"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=301d212c-929b-4fe0-98a2-35d3e7b337aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0d8f6a4-68b0-444e-a7f6-df27c148bb63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a339d6ba-f603-4953-b2f4-e76237959487"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a6fd285-6021-4ab3-a68a-d977e889e908"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a339d6ba-f603-4953-b2f4-e76237959487"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f3ada1a-44de-4dfe-9662-4df45e0a3396"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f86b05e-767d-4863-bcc9-ea18eb01a418"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d94084be-4d0a-4f0c-8417-db2bde858147"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/60125dea-6d47-4b30-9628-d254dcef64c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9ecaaf2-ac4c-4877-933d-012e9b628e35"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f86b05e-767d-4863-bcc9-ea18eb01a418"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20a17e48-50d1-4dae-9b8d-18bc95d0ecf4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9ecaaf2-ac4c-4877-933d-012e9b628e35"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/20a17e48-50d1-4dae-9b8d-18bc95d0ecf4"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 626, 194, 30.990415335463258, 259.6453674121405, 83, 2298, 94.0, 683.1000000000005, 993.4999999999998, 1620.73, 2.455306364185474, 2.4989946260756675, 1.1841257922873571], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 56, 100.0, 490.6607142857143, 340, 710, 515.5, 618.1, 641.65, 710.0, 0.24392049934010793, 1.5690854791622202, 0.40947201012270074], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 114.6, 84, 266, 95.0, 259.4, 266.0, 266.0, 0.07126127709710062, 0.05532491727753417, 0.025331157093109985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, 100.0, 125.9411764705882, 84, 258, 87.0, 254.8, 258.0, 258.0, 0.08999804121910288, 0.04473535447316735, 0.0451747980338075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35541dbe-7cf0-4b7f-8ded-cf5db67bcbb7", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.32493536420863306, 1.2400236061151078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 19, 100.0, 88.26315789473685, 83, 102, 87.0, 95.0, 102.0, 102.0, 0.1504664459825459, 0.07479240332530845, 0.0755271027685826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d94084be-4d0a-4f0c-8417-db2bde858147", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.3296789461678832, 1.2581261405109487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 3.3899066091954024, 7.105334051724139], "isController": false}, {"data": ["https://demoqa.com/books", 56, 56, 100.0, 158.6964285714286, 83, 378, 88.5, 343.3, 348.79999999999995, 378.0, 0.25026926291232976, 0.12440142072497644, 0.12097977064609693], "isController": false}, {"data": ["deleteBook", 16, 1, 6.25, 488.5, 93, 978, 416.5, 884.2, 978.0, 978.0, 0.09355302702513069, 0.017569742685322697, 0.06330703189865867], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 1, 6.25, 488.5, 93, 978, 416.5, 884.2, 978.0, 978.0, 0.09526304508323608, 0.017890892927314297, 0.06446419560777823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 5, 19.23076923076923, 974.5, 500, 1668, 949.0, 1630.8, 1663.8, 1668.0, 0.10314595152140278, 0.03274450053556552, 0.0465365523465704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c3d2fce-3902-4061-bffd-88a7d871ddf7", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["deleteAccount", 16, 1, 6.25, 418.31249999999994, 87, 804, 368.5, 722.8000000000001, 804.0, 804.0, 0.09789225733427147, 0.019621470525253145, 0.0661119279421212], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 111.75, 85, 257, 92.0, 257.0, 257.0, 257.0, 0.04795386837861977, 0.03774493936832767, 0.017046101650212496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1209.6666666666665, 681, 2094, 1168.5, 1840.0, 2087.25, 2094.0, 0.10207944332676906, 0.05283408687811289, 0.04695255645205881], "isController": false}, {"data": ["goToProfile", 16, 1, 6.25, 219.81250000000003, 86, 410, 192.5, 377.8, 410.0, 410.0, 0.09300216811304413, 0.1710640465243346, 0.05963060156418022], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f6134367-5105-4db0-846a-8201cf9762c7", 3, 0, 0.0, 293.0, 159, 364, 356.0, 364.0, 364.0, 364.0, 0.09209233791748526, 0.04166938466969548, 0.05905660992755403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, 100.0, 151.875, 84, 266, 89.5, 266.0, 266.0, 266.0, 0.04675491657169575, 0.023240480991204234, 0.023468776482276965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c3d2fce-3902-4061-bffd-88a7d871ddf7", 3, 0, 0.0, 290.0, 178, 478, 214.0, 478.0, 478.0, 478.0, 0.04228508605015011, 0.03500357220883194, 0.027116412603774648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eca0c6f8-5e87-4d0a-9773-120a43af9839", 3, 0, 0.0, 245.33333333333334, 168, 345, 223.0, 345.0, 345.0, 345.0, 0.02090548629645373, 0.024709577064590985, 0.013406187501306593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35541dbe-7cf0-4b7f-8ded-cf5db67bcbb7", 3, 0, 0.0, 449.0, 163, 688, 496.0, 688.0, 688.0, 688.0, 0.03345040976751965, 0.033548409014885434, 0.021450946367843005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b7ed167-a39c-4cae-b19b-9a7fd4725a02", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.5298066348973607, 2.021856671554252], "isController": false}, {"data": ["addBook", 60, 60, 100.0, 568.1166666666667, 347, 1352, 539.0, 678.7, 1141.7999999999986, 1352.0, 0.2777919245887522, 0.8995186459148382, 0.5429783171828195], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4b2a9d30-ca20-451d-80fc-d7a34abb0c8a", 3, 0, 0.0, 1091.0, 171, 2298, 804.0, 2298.0, 2298.0, 2298.0, 0.030334897265814592, 0.025288955695882544, 0.019453042842986573], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 111.10526315789474, 85, 255, 95.0, 252.0, 255.0, 255.0, 0.15103098519896344, 0.1128307653097725, 0.053686795519944035], "isController": false}, {"data": ["deleteBooks", 16, 1, 6.25, 445.93750000000006, 87, 1048, 417.5, 947.2, 1048.0, 1048.0, 0.09536411210051376, 0.01790987383625982, 0.06532418396631264], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 8, 4.545454545454546, 158.43749999999991, 85, 1072, 94.0, 292.0, 362.80000000000007, 948.0299999999984, 0.7401021845629823, 1.5880428554908432, 0.3564008588969954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 89.10000000000001, 85, 105, 88.0, 103.4, 105.0, 105.0, 0.048129217322667894, 0.03727194271179262, 0.017108432720167103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eca0c6f8-5e87-4d0a-9773-120a43af9839", 1, 0, 0.0, 327.0, 327, 327, 327.0, 327.0, 327.0, 327.0, 3.058103975535168, 0.5524894877675841, 2.108419342507645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fcf4aeca-f639-4aea-9305-72d8a22f5f14", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 1.1528373194945847, 2.1540782942238264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 11, 100.0, 86.45454545454545, 83, 91, 86.0, 91.0, 91.0, 91.0, 0.06063846794154452, 0.030141582209224766, 0.03043766847847059], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 99.89473684210526, 87, 250, 90.0, 108.0, 250.0, 250.0, 0.15775096933819316, 0.12801860890628763, 0.05607553988193585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a6fd285-6021-4ab3-a68a-d977e889e908", 3, 0, 0.0, 349.3333333333333, 177, 524, 347.0, 524.0, 524.0, 524.0, 0.05925925925925926, 0.026234567901234566, 0.038001543209876545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f3ada1a-44de-4dfe-9662-4df45e0a3396", 3, 0, 0.0, 277.6666666666667, 190, 358, 285.0, 358.0, 358.0, 358.0, 0.01990287397500199, 0.023524523243239656, 0.012763236240479791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad2856f4-01e1-465e-a37e-89a808211b9a", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.7884837962962963, 1.4732831790123455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 531.2916666666667, 156, 1387, 499.0, 871.5, 1267.5, 1387.0, 0.10024267079889232, 0.06157484368408522, 0.04532456697254603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b2a9d30-ca20-451d-80fc-d7a34abb0c8a", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.4804895279255319, 1.8336519281914894], "isController": false}, {"data": ["login", 24, 5, 20.833333333333332, 2103.1666666666674, 1366, 3464, 1887.0, 3019.5, 3354.5, 3464.0, 0.10138988635883571, 0.15088841567741118, 0.1522333498795995], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 10, 100.0, 103.10000000000001, 84, 253, 87.0, 236.60000000000005, 253.0, 253.0, 0.04925065133986397, 0.024481036652334726, 0.024721518348330154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 111.41176470588235, 85, 284, 88.0, 255.2, 284.0, 284.0, 0.09141996719636471, 0.07401089141190072, 0.03249694146433277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b7ed167-a39c-4cae-b19b-9a7fd4725a02", 3, 0, 0.0, 236.0, 175, 349, 184.0, 349.0, 349.0, 349.0, 0.030512922222561255, 0.030602315549385164, 0.01956720598256695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/301d212c-929b-4fe0-98a2-35d3e7b337aa", 3, 0, 0.0, 711.3333333333334, 163, 1621, 350.0, 1621.0, 1621.0, 1621.0, 0.02408361832281682, 0.02415417579837195, 0.015444247427066776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, 100.0, 109.86666666666666, 83, 419, 87.0, 224.6000000000001, 419.0, 419.0, 0.07415720338354599, 0.03686134425998527, 0.03722343997963149], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f6134367-5105-4db0-846a-8201cf9762c7", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.0323660714285714, 3.9397321428571432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0d8f6a4-68b0-444e-a7f6-df27c148bb63", 1, 0, 0.0, 1048.0, 1048, 1048, 1048.0, 1048.0, 1048.0, 1048.0, 0.9541984732824427, 0.17238937261450382, 0.6578751192748091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6ef92a8-ce94-4c95-9f94-cdc19db20b20", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.7846091830466831, 1.4660434582309583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=301d212c-929b-4fe0-98a2-35d3e7b337aa", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 120.81818181818181, 85, 258, 89.0, 257.8, 258.0, 258.0, 0.06557611598626478, 0.05436926022689336, 0.02331025997949256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0d8f6a4-68b0-444e-a7f6-df27c148bb63", 3, 0, 0.0, 355.3333333333333, 178, 478, 410.0, 478.0, 478.0, 478.0, 0.03775817149761494, 0.024520687544837827, 0.024213410758561666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a339d6ba-f603-4953-b2f4-e76237959487", 3, 0, 0.0, 234.66666666666669, 168, 364, 172.0, 364.0, 364.0, 364.0, 0.08460475478721904, 0.039272910262556755, 0.05425500225612679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 17, 100.0, 99.3529411764706, 84, 283, 87.0, 139.79999999999987, 283.0, 283.0, 0.10936766191239006, 0.05436341788418608, 0.05489743967086767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 91.11764705882354, 85, 122, 89.0, 100.39999999999998, 122.0, 122.0, 0.10929523858507671, 0.08485323698743748, 0.03885104184078898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a6fd285-6021-4ab3-a68a-d977e889e908", 1, 0, 0.0, 329.0, 329, 329, 329.0, 329.0, 329.0, 329.0, 3.0395136778115504, 0.5491308890577508, 2.0956022036474162], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a339d6ba-f603-4953-b2f4-e76237959487", 1, 0, 0.0, 158.0, 158, 158, 158.0, 158.0, 158.0, 158.0, 6.329113924050633, 1.1434434335443038, 4.363627373417722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f3ada1a-44de-4dfe-9662-4df45e0a3396", 1, 0, 0.0, 607.0, 607, 607, 607.0, 607.0, 607.0, 607.0, 1.6474464579901154, 0.2976343698517298, 1.1358371087314663], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f86b05e-767d-4863-bcc9-ea18eb01a418", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d94084be-4d0a-4f0c-8417-db2bde858147", 3, 0, 0.0, 275.0, 207, 358, 260.0, 358.0, 358.0, 358.0, 0.05810125111360732, 0.03735350616841616, 0.0372589403300151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 19, 100.0, 113.42105263157895, 84, 257, 86.0, 253.0, 257.0, 257.0, 0.1708156898706296, 0.08490740834389694, 0.08574146932959337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, 100.0, 85.42857142857143, 84, 87, 85.0, 87.0, 87.0, 87.0, 0.04034558878623178, 0.020054594425968728, 0.022851993648451592], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60125dea-6d47-4b30-9628-d254dcef64c1", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 1.144573252688172, 2.1386368727598564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9ecaaf2-ac4c-4877-933d-012e9b628e35", 3, 0, 0.0, 311.6666666666667, 254, 393, 288.0, 393.0, 393.0, 393.0, 0.026683032259786004, 0.026761205205859593, 0.01711118930721954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f86b05e-767d-4863-bcc9-ea18eb01a418", 3, 0, 0.0, 262.3333333333333, 187, 373, 227.0, 373.0, 373.0, 373.0, 0.0266545832555908, 0.02673267285497241, 0.01709294564241988], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20a17e48-50d1-4dae-9b8d-18bc95d0ecf4", 1, 0, 0.0, 163.0, 163, 163, 163.0, 163.0, 163.0, 163.0, 6.134969325153374, 1.108368481595092, 4.229773773006134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9ecaaf2-ac4c-4877-933d-012e9b628e35", 1, 0, 0.0, 904.0, 904, 904, 904.0, 904.0, 904.0, 904.0, 1.1061946902654867, 0.19984962665929204, 0.7626693860619469], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20a17e48-50d1-4dae-9b8d-18bc95d0ecf4", 3, 0, 0.0, 264.0, 172, 388, 232.0, 388.0, 388.0, 388.0, 0.08686587908269632, 0.0393045481526523, 0.05570500709404679], "isController": false}, {"data": ["register", 26, 5, 19.23076923076923, 974.5, 500, 1668, 949.0, 1630.8, 1663.8, 1668.0, 0.10487719284092148, 0.033294096825851424, 0.04731763973877512], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 2.577319587628866, 0.7987220447284346], "isController": false}, {"data": ["401/Unauthorized", 10, 5.154639175257732, 1.597444089456869], "isController": false}, {"data": ["404/Not Found", 179, 92.26804123711341, 28.594249201277954], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 626, 194, "404/Not Found", 179, "401/Unauthorized", 10, "406/Not Acceptable", 5, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 56, 56, "404/Not Found", 56, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 11, "404/Not Found", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
