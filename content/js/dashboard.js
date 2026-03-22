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

    var data = {"OkPercent": 97.29729729729729, "KoPercent": 2.7027027027027026};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8128930817610063, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/faf1f23f-a5c9-4d55-9471-b3e6c529a55c"], "isController": false}, {"data": [0.4915254237288136, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/799fbb44-0ec5-43c8-adc3-878edc5fd0d8"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1d32a4a2-0a48-49eb-a070-891eaccb1aa9"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f567ac93-480d-4d85-980e-0f9adabac49a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e79b001-e99b-4134-bf2c-b9f4045d4357"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4d41142-e468-4c7a-a371-0e34c9cc65bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75b0d2e0-3a19-4416-b2bf-5296bfd3ed8d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83b6f005-cb79-4fe4-8f7e-b13f81759de9"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a136df2a-82b8-4600-a088-34cacf8da6ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7246302-70f8-47ae-9673-a3da487823e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fefab869-53ab-4e4e-8dd7-c7b794179e0f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/01bfd95b-297f-403f-9d9c-12386540e7db"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a17a76e5-a6f5-4ebe-876b-fb7aa120e681"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4d41142-e468-4c7a-a371-0e34c9cc65bb"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/75b0d2e0-3a19-4416-b2bf-5296bfd3ed8d"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f567ac93-480d-4d85-980e-0f9adabac49a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=799fbb44-0ec5-43c8-adc3-878edc5fd0d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4772727272727273, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3360655737704918, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c7246302-70f8-47ae-9673-a3da487823e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1e79b001-e99b-4134-bf2c-b9f4045d4357"], "isController": false}, {"data": [0.847457627118644, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8867403314917127, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01bfd95b-297f-403f-9d9c-12386540e7db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/262c6b5f-4b5a-44a0-9763-31842ff8b114"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d32a4a2-0a48-49eb-a070-891eaccb1aa9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a136df2a-82b8-4600-a088-34cacf8da6ca"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4341d344-2dc8-4a55-ac97-a2bcf5e23807"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/83b6f005-cb79-4fe4-8f7e-b13f81759de9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a17a76e5-a6f5-4ebe-876b-fb7aa120e681"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1369, 37, 2.7027027027027026, 267.9525200876557, 77, 3704, 90.0, 652.0, 811.5, 1202.7999999999993, 5.374423397781921, 764.3296577497792, 3.936832153547944], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/faf1f23f-a5c9-4d55-9471-b3e6c529a55c", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 1.6719159031413613, 3.1239774214659684], "isController": false}, {"data": ["see books", 59, 0, 0.0, 1178.1016949152545, 953, 1528, 1162.0, 1395.0, 1438.0, 1528.0, 0.26429428945152217, 318.03624705888615, 1.2995329564339981], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/799fbb44-0ec5-43c8-adc3-878edc5fd0d8", 3, 0, 0.0, 306.0, 177, 506, 235.0, 506.0, 506.0, 506.0, 0.04275148561412509, 0.02748508596611232, 0.02741550346999558], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 469.35714285714283, 82, 1469, 414.5, 1118.0, 1469.0, 1469.0, 0.0812923155535426, 0.016676946152550838, 0.054419806945267046], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 469.35714285714283, 82, 1469, 414.5, 1118.0, 1469.0, 1469.0, 0.07988268656886743, 0.016387763755513332, 0.05347615394820178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 118.85714285714286, 80, 243, 82.0, 239.2, 242.7, 243.0, 0.11278558922414257, 0.046312162985917914, 0.06342091447629891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 102.19047619047619, 80, 328, 83.0, 216.6000000000001, 319.9999999999999, 328.0, 0.11278195488721805, 0.08381549577067669, 0.056611254699248124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 178.0, 78, 548, 83.0, 358.60000000000014, 531.8999999999997, 548.0, 0.11278619496973571, 3.185874334695719, 0.06549298812253951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 163.23809523809524, 78, 728, 82.0, 485.8000000000002, 709.9999999999998, 728.0, 0.11278680072183553, 9.692814994065266, 0.06538319651220245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d32a4a2-0a48-49eb-a070-891eaccb1aa9", 3, 0, 0.0, 257.3333333333333, 195, 368, 209.0, 368.0, 368.0, 368.0, 0.04631058968817536, 0.029773246951219513, 0.02969787164248225], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 176.33333333333334, 81, 259, 187.0, 246.4, 259.0, 259.0, 0.07983649485852974, 0.12444305728534628, 0.0515922557269379], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f567ac93-480d-4d85-980e-0f9adabac49a", 3, 0, 0.0, 376.66666666666663, 191, 655, 284.0, 655.0, 655.0, 655.0, 0.05070822487407458, 0.033194739655522124, 0.032517969727189754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e79b001-e99b-4134-bf2c-b9f4045d4357", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 1.0627297794117647, 4.055606617647059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 90.57894736842105, 80, 243, 82.0, 86.0, 243.0, 243.0, 0.09070121587366753, 0.06740588406236424, 0.045527758749087016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 537.5714285714286, 388, 621, 548.0, 621.0, 621.0, 621.0, 0.034103254912086683, 10.027489278789238, 0.019449512567049437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 114.4736842105263, 78, 244, 83.0, 243.0, 244.0, 244.0, 0.09070251484656953, 0.03144005757222784, 0.05132785199736485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 615.2857142857143, 545, 724, 569.0, 724.0, 724.0, 724.0, 0.03409976617303195, 30.68302954348938, 0.019414222342653935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 172.71428571428572, 79, 246, 238.0, 246.0, 246.0, 246.0, 0.03415283883275355, 0.060434515590770926, 0.01891080040837037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4d41142-e468-4c7a-a371-0e34c9cc65bb", 3, 0, 0.0, 296.6666666666667, 157, 474, 259.0, 474.0, 474.0, 474.0, 0.0325874429719748, 0.027166810368238106, 0.020897546437106236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 104.19999999999999, 81, 244, 83.0, 241.0, 244.0, 244.0, 0.09244137676023788, 0.06869910909623148, 0.046401237944103786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 125.93333333333332, 79, 245, 85.0, 242.0, 245.0, 245.0, 0.0923548643307043, 0.04320716504429955, 0.051636951489068265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 177.46666666666664, 79, 713, 82.0, 710.0, 713.0, 713.0, 0.09208555361834836, 11.069343011780813, 0.05308108670161825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 124.00000000000001, 78, 403, 82.0, 397.0, 403.0, 403.0, 0.09226113591910544, 3.6385966004846786, 0.053272396775165765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 104.42857142857143, 78, 246, 81.0, 246.0, 246.0, 246.0, 0.03418018818635039, 0.02540148750958266, 0.01919297676479636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 123.3157894736842, 78, 724, 82.0, 234.0, 724.0, 724.0, 0.09070251484656953, 4.318649011402261, 0.052912908280662224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 409.0625, 79, 736, 553.5, 724.1, 736.0, 736.0, 0.09541188116450201, 48.30287630483202, 0.05147955502283922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 122.57894736842107, 78, 393, 81.0, 240.0, 393.0, 393.0, 0.09070121587366753, 1.426800613068613, 0.05300072590808625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 337.375, 79, 570, 395.0, 567.2, 570.0, 570.0, 0.09541358808761352, 15.792055309318926, 0.05157365332665438], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 406.85714285714295, 82, 1036, 404.0, 853.5, 1036.0, 1036.0, 0.08002377849418112, 0.016416708464800967, 0.05395018269714429], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 294.3333333333333, 161, 956, 168.0, 855.8000000000001, 956.0, 956.0, 0.0920375267675807, 14.80480542308117, 0.20385473295311607], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75b0d2e0-3a19-4416-b2bf-5296bfd3ed8d", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83b6f005-cb79-4fe4-8f7e-b13f81759de9", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 0.5018446180555556, 1.9151475694444444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 562.8636363636364, 90, 2292, 409.5, 1663.2999999999993, 2245.7999999999993, 2292.0, 0.10845773106426614, 0.06662100863224941, 0.049038993635503146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 82.375, 79, 88, 82.5, 85.2, 88.0, 88.0, 0.09540789858140382, 0.07090372150434404, 0.04789029284261871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 131.56249999999997, 78, 252, 82.0, 251.3, 252.0, 252.0, 0.09541472607028488, 0.10614189436993482, 0.049908703761129235], "isController": false}, {"data": ["login", 22, 0, 0.0, 2184.545454545454, 1356, 3785, 2028.0, 3287.4999999999995, 3727.249999999999, 3785.0, 0.10007004903432402, 38.22732286890596, 0.20378256256652383], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 102.57894736842105, 82, 244, 85.0, 238.0, 244.0, 244.0, 0.08975176551170315, 0.07266036485273625, 0.031903947896738234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a136df2a-82b8-4600-a088-34cacf8da6ca", 1, 0, 0.0, 671.0, 671, 671, 671.0, 671.0, 671.0, 671.0, 1.4903129657228018, 0.2692459947839046, 1.0275009314456036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7246302-70f8-47ae-9673-a3da487823e0", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fefab869-53ab-4e4e-8dd7-c7b794179e0f", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 1.0470030737704918, 1.9563268442622952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01bfd95b-297f-403f-9d9c-12386540e7db", 3, 0, 0.0, 1355.0, 174, 3704, 187.0, 3704.0, 3704.0, 3704.0, 0.02432853250291942, 0.02439980750048657, 0.01560130502303101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 504.0625, 163, 820, 641.5, 811.6, 820.0, 820.0, 0.09536070185476565, 64.23721891874375, 0.20074405560124922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a17a76e5-a6f5-4ebe-876b-fb7aa120e681", 3, 0, 0.0, 290.3333333333333, 218, 432, 221.0, 432.0, 432.0, 432.0, 0.033727571165175156, 0.027414630598776815, 0.02162868333183433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, 50.0, 424.07142857142867, 79, 812, 432.5, 809.0, 812.0, 812.0, 0.06144689890668411, 36.76414766841937, 0.08956005529123635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 305.8095238095238, 160, 808, 317.0, 617.6, 790.1999999999998, 808.0, 0.11273351943311144, 13.002692729023513, 0.2507932866518145], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 827.2727272727273, 87, 1751, 828.0, 1170.2, 1665.4999999999989, 1751.0, 0.1014933360398223, 0.03177073001388613, 0.0457909387210917], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4d41142-e468-4c7a-a371-0e34c9cc65bb", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 257.15789473684214, 162, 806, 169.0, 487.0, 806.0, 806.0, 0.0906657250156279, 5.841946452942103, 0.20268841023616035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 90.33333333333334, 82, 115, 87.5, 110.20000000000002, 115.0, 115.0, 0.0955916325457645, 0.07421420690808864, 0.033979838131502224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75b0d2e0-3a19-4416-b2bf-5296bfd3ed8d", 3, 0, 0.0, 685.0, 194, 1105, 756.0, 1105.0, 1105.0, 1105.0, 0.019430051813471502, 0.026785894996761657, 0.012460026716321243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 280.4117647058824, 164, 651, 177.0, 517.3999999999999, 651.0, 651.0, 0.0935500024763236, 6.719886701316853, 0.20898816902009124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 99.77777777777777, 80, 247, 82.0, 247.0, 247.0, 247.0, 0.052228715347698164, 0.03881450427695147, 0.026216366883512556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f567ac93-480d-4d85-980e-0f9adabac49a", 1, 0, 0.0, 666.0, 666, 666, 666.0, 666.0, 666.0, 666.0, 1.5015015015015014, 0.2712673611111111, 1.0352149024024024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 116.33333333333333, 78, 243, 81.0, 243.0, 243.0, 243.0, 0.05222750300308142, 0.013974937326996395, 0.029785997806444874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 117.88888888888889, 78, 244, 83.0, 244.0, 244.0, 244.0, 0.052227199925721314, 0.014076862479979572, 0.030703881206332256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 101.11111111111111, 80, 242, 83.0, 242.0, 242.0, 242.0, 0.052226896851878715, 0.014076780792107937, 0.030754705861018427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 84.66666666666667, 82, 87, 85.0, 87.0, 87.0, 87.0, 0.03675659780930677, 0.010840324744541645, 0.022721607825479676], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 770.3559322033897, 620, 1177, 649.0, 1054.0, 1099.0, 1177.0, 0.2779138561254098, 332.48159041503374, 0.5487713057476354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 827.2727272727273, 87, 1751, 828.0, 1170.2, 1665.4999999999989, 1751.0, 0.10021637626693998, 0.03137099988611775, 0.04521481038606081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 80.81818181818183, 77, 86, 80.0, 85.4, 86.0, 86.0, 0.06208270545142593, 0.016733229203704646, 0.036558468151572106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 108.99999999999999, 78, 237, 82.0, 236.6, 237.0, 237.0, 0.06202774331792038, 0.01671841519115823, 0.03646552878651178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 121.83333333333333, 80, 243, 82.0, 242.4, 243.0, 243.0, 0.09667673716012085, 0.026057401812688823, 0.05683534743202417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 121.33333333333334, 78, 248, 81.0, 247.1, 248.0, 248.0, 0.09667362179667927, 0.026056562124886207, 0.056927923772849214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 95.0, 78, 241, 81.0, 209.80000000000013, 241.0, 241.0, 0.06202634428004331, 0.016596892903058463, 0.0353743994722122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 97.24999999999999, 80, 244, 83.0, 200.80000000000015, 244.0, 244.0, 0.09679761232556264, 0.0719365068161652, 0.048587863999354684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=799fbb44-0ec5-43c8-adc3-878edc5fd0d8", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 82.81818181818181, 79, 91, 82.0, 90.0, 91.0, 91.0, 0.06208165430677367, 0.04613685442134254, 0.03116208038445475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 94.66666666666666, 80, 245, 81.0, 196.70000000000016, 245.0, 245.0, 0.09680151655709272, 0.02590196829750333, 0.055207114911466945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 86.63636363636364, 81, 100, 85.0, 98.80000000000001, 100.0, 100.0, 0.061459380936417486, 0.04837525491675048, 0.02184688931724215], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 655.2142857142858, 79, 3704, 417.0, 2230.0, 3704.0, 3704.0, 0.07809667252391711, 0.015563769070928515, 0.053141255613198345], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1115.5909090909088, 647, 1899, 1020.0, 1487.7, 1837.7999999999993, 1899.0, 0.10338394447342328, 0.05350926813565853, 0.04755257602244371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 194.1818181818182, 161, 326, 166.0, 324.2, 326.0, 326.0, 0.061996979056293255, 0.09608320875228261, 0.13943265895180018], "isController": false}, {"data": ["addBook", 61, 17, 27.868852459016395, 844.3278688524592, 415, 3190, 734.0, 1317.8000000000002, 1627.9999999999998, 3190.0, 0.2930930930930931, 87.38458614864865, 1.0648367117117117], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c7246302-70f8-47ae-9673-a3da487823e0", 3, 0, 0.0, 372.33333333333337, 170, 736, 211.0, 736.0, 736.0, 736.0, 0.020517169451302497, 0.02425059969976542, 0.013157169211935523], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 156.7118644067796, 78, 386, 84.0, 331.0, 338.0, 386.0, 0.2786528316322916, 0.20708477038298234, 0.13470034341600035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e79b001-e99b-4134-bf2c-b9f4045d4357", 3, 0, 0.0, 544.0, 174, 1088, 370.0, 1088.0, 1088.0, 1088.0, 0.0971534052268532, 0.04395938582855662, 0.06230215113831406], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 458.96610169491515, 386, 733, 401.0, 634.0, 691.0, 733.0, 0.2786173026067246, 81.92273793150265, 0.14012491293209295], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 121.35593220338983, 78, 338, 83.0, 245.0, 248.0, 338.0, 0.2790284136052363, 0.4937494975123907, 0.13569936521035905], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 609.8644067796612, 539, 789, 565.0, 719.0, 756.0, 789.0, 0.278393809276648, 250.49923895124567, 0.13974064254706742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 86.94117647058825, 83, 99, 86.0, 92.6, 99.0, 99.0, 0.08935658006086761, 0.06675564819000362, 0.03176347181851153], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 17, 9.392265193370166, 158.82872928176798, 80, 2858, 87.0, 267.40000000000003, 331.80000000000007, 1303.280000000013, 0.7798093990728454, 1.7090054118126043, 0.37275128253873197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 85.77777777777777, 81, 93, 85.0, 93.0, 93.0, 93.0, 0.054427692810101784, 0.042149570701572964, 0.019347343928590867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 93.00000000000001, 82, 246, 85.0, 92.4, 230.6999999999998, 246.0, 0.11135089849570239, 0.09036386391594599, 0.03958176469964421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 237.22222222222223, 163, 487, 171.0, 487.0, 487.0, 487.0, 0.052201753978933695, 0.08090252301227321, 0.11740296817723077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01bfd95b-297f-403f-9d9c-12386540e7db", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/262c6b5f-4b5a-44a0-9763-31842ff8b114", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.8566042877906979, 3.4690679505813957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 246.91666666666669, 161, 490, 176.5, 442.60000000000014, 490.0, 490.0, 0.09660591228183164, 0.14972029569459652, 0.21726896092290848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d32a4a2-0a48-49eb-a070-891eaccb1aa9", 1, 0, 0.0, 1036.0, 1036, 1036, 1036.0, 1036.0, 1036.0, 1036.0, 0.9652509652509653, 0.1743861607142857, 0.6654952944015444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a136df2a-82b8-4600-a088-34cacf8da6ca", 3, 0, 0.0, 262.0, 169, 402, 215.0, 402.0, 402.0, 402.0, 0.03539071347678369, 0.0295037816451963, 0.022695216650151], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4341d344-2dc8-4a55-ac97-a2bcf5e23807", 1, 0, 0.0, 1214.0, 1214, 1214, 1214.0, 1214.0, 1214.0, 1214.0, 0.8237232289950577, 0.2630444295716639, 0.49149891886326197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 95.80000000000001, 81, 246, 85.0, 151.80000000000007, 246.0, 246.0, 0.09412414347029442, 0.07803847442019528, 0.03345819162420622], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 87.375, 83, 102, 85.0, 101.3, 102.0, 102.0, 0.09521599152577676, 0.07392257154589114, 0.03384630948767846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83b6f005-cb79-4fe4-8f7e-b13f81759de9", 3, 0, 0.0, 299.0, 208, 367, 322.0, 367.0, 367.0, 367.0, 0.039666798889329634, 0.03306857811053815, 0.025437367777337037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 102.35294117647058, 80, 238, 83.0, 237.2, 238.0, 238.0, 0.093674750246585, 0.06961570794692498, 0.04702033361986786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a17a76e5-a6f5-4ebe-876b-fb7aa120e681", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 137.99999999999997, 78, 251, 82.0, 247.0, 251.0, 251.0, 0.09359275041566192, 0.03331230937358923, 0.05291474319800923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 137.23529411764707, 78, 568, 81.0, 307.19999999999976, 568.0, 568.0, 0.09367629879433093, 4.982004550532853, 0.05459787037955432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 157.47058823529414, 79, 568, 82.0, 310.39999999999975, 568.0, 568.0, 0.09359429625347537, 1.6425562426019216, 0.05464147706939742], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 18.91891891891892, 0.5113221329437546], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.81081081081081, 0.2921840759678597], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.108108108108109, 0.2191380569758948], "isController": false}, {"data": ["401/Unauthorized", 23, 62.16216216216216, 1.6800584368151936], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1369, 37, "401/Unauthorized", 23, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
