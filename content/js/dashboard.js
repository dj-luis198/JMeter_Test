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

    var data = {"OkPercent": 98.98832684824903, "KoPercent": 1.0116731517509727};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8235294117647058, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.46226415094339623, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50a6eac4-be6f-42f2-8bb5-fd1491d627bf"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31923d75-6204-4ec5-8649-e6eeb5a3e7b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f5ad4b5-5626-4f3e-b2b7-766a8e4b4ac4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8d9dde4-d708-4650-9070-4c9939c87381"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb26c43b-06c1-4880-abd5-a80f715201db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77b1f7a4-54a2-47c1-aeab-b5b51cad4355"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5cf812f6-1cba-4179-b4aa-841bb5f070e4"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57640b08-25af-4ea2-b412-2d8ef475e658"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bd062258-771a-425f-b637-ff50e587b288"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df202673-46a0-4a21-8306-8c11d6742ca6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8b59a36-d061-4b80-a43e-632d22c1ea57"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d5bdf74c-cb19-4c8d-86a9-103ed71bf27f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a85e9e4-0572-4537-b8d8-e8761601bbdc"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f5d982d-5b72-4640-85f8-f68a1c479410"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31923d75-6204-4ec5-8649-e6eeb5a3e7b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/44ab4644-f88e-4738-9b95-e81c3721fb62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/50a6eac4-be6f-42f2-8bb5-fd1491d627bf"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b8d9dde4-d708-4650-9070-4c9939c87381"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/77b1f7a4-54a2-47c1-aeab-b5b51cad4355"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38bd4095-357f-4ffc-b063-8cc96fc319ce"], "isController": false}, {"data": [0.4262295081967213, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f5ad4b5-5626-4f3e-b2b7-766a8e4b4ac4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/df202673-46a0-4a21-8306-8c11d6742ca6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/987dcdac-09fc-4877-9c56-d4632bb9c6e9"], "isController": false}, {"data": [0.7641509433962265, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9485714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=987dcdac-09fc-4877-9c56-d4632bb9c6e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5cf812f6-1cba-4179-b4aa-841bb5f070e4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0f5d982d-5b72-4640-85f8-f68a1c479410"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a8b59a36-d061-4b80-a43e-632d22c1ea57"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/38bd4095-357f-4ffc-b063-8cc96fc319ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/57640b08-25af-4ea2-b412-2d8ef475e658"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1285, 13, 1.0116731517509727, 294.5455252918285, 80, 3964, 93.0, 734.4000000000001, 912.4000000000001, 1634.2400000000016, 5.038524124139824, 706.8669266595762, 3.674254422187151], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 1228.0000000000002, 994, 1635, 1189.0, 1457.8, 1571.2, 1635.0, 0.23923660952071427, 287.8803479467969, 1.17632453997734], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50a6eac4-be6f-42f2-8bb5-fd1491d627bf", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.3261084160649819, 1.2445002256317688], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 624.3076923076923, 253, 1455, 492.0, 1363.0, 1455.0, 1455.0, 0.0857090113135895, 0.016237840034019888, 0.05793985823399879], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 624.3076923076923, 253, 1455, 492.0, 1363.0, 1455.0, 1455.0, 0.08412170469399112, 0.015937119834603785, 0.056866828466137775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31923d75-6204-4ec5-8649-e6eeb5a3e7b7", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 140.79999999999998, 82, 254, 88.0, 252.8, 254.0, 254.0, 0.11114816049794375, 0.05199939331629061, 0.06214455744507428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 86.46666666666667, 83, 90, 86.0, 90.0, 90.0, 90.0, 0.11114651333387672, 0.08260009438191425, 0.05579033970079359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 209.13333333333333, 84, 673, 86.0, 633.4, 673.0, 673.0, 0.11100914715372547, 4.3779810581391905, 0.06409766446005151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 184.00000000000003, 84, 588, 85.0, 574.8, 588.0, 588.0, 0.11101079024881219, 13.34429198705614, 0.06399020422285046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f5ad4b5-5626-4f3e-b2b7-766a8e4b4ac4", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8d9dde4-d708-4650-9070-4c9939c87381", 1, 0, 0.0, 913.0, 913, 913, 913.0, 913.0, 913.0, 913.0, 1.095290251916758, 0.1978795865279299, 0.7551512869660459], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 192.23076923076923, 87, 294, 186.0, 266.4, 294.0, 294.0, 0.08609841711371614, 0.19106320161931253, 0.05565481364659911], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 85.38461538461539, 83, 91, 85.0, 89.4, 91.0, 91.0, 0.0751597143930853, 0.055855998684705, 0.037726653513716644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 83.46153846153847, 80, 86, 84.0, 85.6, 86.0, 86.0, 0.0751610180270811, 0.02011144427677756, 0.04286526809356969], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 554.6, 434, 595, 581.0, 595.0, 595.0, 595.0, 0.0442290000707664, 13.004794561823296, 0.025224351602858963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 704.2, 578, 866, 745.0, 866.0, 866.0, 866.0, 0.04410726887791108, 39.68779806865297, 0.02511185327717008], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 184.4, 84, 254, 250.0, 254.0, 254.0, 254.0, 0.04430110575559966, 0.07839219104408846, 0.024530006800219734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 86.69230769230771, 84, 98, 85.0, 94.8, 98.0, 98.0, 0.061758306492223206, 0.04589655394588072, 0.030999774938479226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 138.69230769230768, 82, 295, 85.0, 278.2, 295.0, 295.0, 0.0617594800801923, 0.023660858504280406, 0.03482321645747622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 128.6923076923077, 84, 574, 85.0, 405.9999999999999, 574.0, 574.0, 0.061758599885033995, 4.290019016007354, 0.035899041910336014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 178.6923076923077, 82, 587, 87.0, 471.39999999999986, 587.0, 587.0, 0.0617594800801923, 1.41223777459215, 0.03595986554248577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb26c43b-06c1-4880-abd5-a80f715201db", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 1.7261402027027026, 3.2252956081081083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77b1f7a4-54a2-47c1-aeab-b5b51cad4355", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 118.6, 83, 252, 85.0, 252.0, 252.0, 252.0, 0.04429992823411626, 0.03292211463492429, 0.024875447983024268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 426.33333333333337, 84, 758, 574.5, 752.6, 758.0, 758.0, 0.1872912482961699, 93.64743284178051, 0.10116491254539212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 98.84615384615384, 84, 251, 85.0, 188.59999999999994, 251.0, 251.0, 0.07508851781041882, 0.020238702066089447, 0.04414383566589075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 355.66666666666663, 83, 652, 413.5, 592.6000000000001, 652.0, 652.0, 0.18695859905689774, 30.562415933546603, 0.1011678096242132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 85.15384615384616, 82, 95, 85.0, 91.8, 95.0, 95.0, 0.07516188714153561, 0.02025847739361702, 0.04426036908822849], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 552.0769230769231, 86, 1828, 454.0, 1461.9999999999995, 1828.0, 1828.0, 0.08413640452783297, 0.015939904764062107, 0.057546721997139366], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5cf812f6-1cba-4179-b4aa-841bb5f070e4", 3, 0, 0.0, 356.33333333333337, 191, 644, 234.0, 644.0, 644.0, 644.0, 0.04001760774740886, 0.025987997218776263, 0.02566233309322769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 279.53846153846155, 169, 672, 178.0, 556.3999999999999, 672.0, 672.0, 0.061731912549622965, 5.769299829524949, 0.1376215421225331], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 537.3636363636364, 113, 1632, 361.0, 1309.8999999999999, 1588.9499999999994, 1632.0, 0.0917706734298872, 0.05637085311269439, 0.04149396659964626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 85.27777777777777, 82, 87, 85.0, 87.0, 87.0, 87.0, 0.18728345350688266, 0.1391823321472048, 0.09400751474857195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 140.44444444444446, 81, 254, 86.0, 253.1, 254.0, 254.0, 0.18696830887164625, 0.20603842718103726, 0.09790679889480955], "isController": false}, {"data": ["login", 22, 0, 0.0, 2556.045454545454, 1171, 4687, 2497.0, 4002.6999999999994, 4616.799999999999, 4687.0, 0.09462609787779469, 25.859021664268756, 0.1784320240522336], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57640b08-25af-4ea2-b412-2d8ef475e658", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 88.38461538461539, 85, 95, 87.0, 94.6, 95.0, 95.0, 0.07198148414746237, 0.05827407261547491, 0.025587168193043266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd062258-771a-425f-b637-ff50e587b288", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 1.7545930631868132, 3.2784598214285716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df202673-46a0-4a21-8306-8c11d6742ca6", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8b59a36-d061-4b80-a43e-632d22c1ea57", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5bdf74c-cb19-4c8d-86a9-103ed71bf27f", 1, 0, 0.0, 840.0, 840, 840, 840.0, 840.0, 840.0, 840.0, 1.1904761904761907, 0.38016183035714285, 0.7103329613095238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a85e9e4-0572-4537-b8d8-e8761601bbdc", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 1.4992297535211268, 2.80131308685446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 526.7777777777776, 169, 845, 667.0, 840.5, 845.0, 845.0, 0.1867878712408941, 124.2748998609468, 0.3935395069319054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f5d982d-5b72-4640-85f8-f68a1c479410", 1, 0, 0.0, 1828.0, 1828, 1828, 1828.0, 1828.0, 1828.0, 1828.0, 0.5470459518599562, 0.09883154403719913, 0.3771625410284464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 351.8666666666667, 169, 764, 337.0, 719.6, 764.0, 764.0, 0.11093854004881296, 17.845150310165668, 0.24571875462243917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 613.5714285714286, 83, 1119, 669.0, 1119.0, 1119.0, 1119.0, 0.061612667564451246, 52.654832083476364, 0.11089936340911692], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 865.6956521739131, 238, 2922, 667.0, 1543.2000000000003, 2663.199999999996, 2922.0, 0.0980596970381708, 0.03089346773196448, 0.04424177737464347], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/31923d75-6204-4ec5-8649-e6eeb5a3e7b7", 3, 0, 0.0, 318.0, 186, 443, 325.0, 443.0, 443.0, 443.0, 0.05453355631498582, 0.035059822175161785, 0.03497106313168036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 185.3846153846154, 169, 335, 172.0, 272.99999999999994, 335.0, 335.0, 0.07505080362091263, 0.11631408725233235, 0.16879101634664234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 98.17647058823529, 85, 255, 87.0, 125.39999999999989, 255.0, 255.0, 0.14077509108976483, 0.10929316153941702, 0.050041145660814836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44ab4644-f88e-4738-9b95-e81c3721fb62", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 1.0105567642405062, 1.8882268591772151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 236.42857142857142, 168, 363, 174.0, 346.2, 361.4, 363.0, 0.116991643454039, 0.18131419742339833, 0.26311694811977715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 103.11111111111111, 82, 249, 85.0, 249.0, 249.0, 249.0, 0.05430191866779293, 0.040355234478701575, 0.027257017768794495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 103.88888888888889, 82, 243, 86.0, 243.0, 243.0, 243.0, 0.054301263409395326, 0.023591824944793716, 0.0304619717693765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 177.33333333333334, 82, 750, 87.0, 750.0, 750.0, 750.0, 0.054301263409395326, 5.4419399296044455, 0.031404702036900725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 176.55555555555554, 82, 403, 91.0, 403.0, 403.0, 403.0, 0.05430191866779293, 1.7870728437613128, 0.03145811021781103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 11.627906976744185, 3.429324127906977, 7.18795421511628], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 820.3018867924527, 652, 1276, 751.0, 1107.2, 1222.6, 1276.0, 0.2496678945930413, 298.68960053725704, 0.4929965652999312], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50a6eac4-be6f-42f2-8bb5-fd1491d627bf", 3, 0, 0.0, 327.3333333333333, 179, 565, 238.0, 565.0, 565.0, 565.0, 0.05376536793433456, 0.03456595106455428, 0.034478442327682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 865.6956521739131, 238, 2922, 667.0, 1543.2000000000003, 2663.199999999996, 2922.0, 0.09381704859723118, 0.029556831716688832, 0.04232761372257891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 106.12500000000001, 83, 254, 85.0, 254.0, 254.0, 254.0, 0.06096678072535227, 0.016432452617380106, 0.0359013366966674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 84.5, 82, 86, 85.0, 86.0, 86.0, 86.0, 0.06097003322866811, 0.016433329268664452, 0.035843710941072464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8d9dde4-d708-4650-9070-4c9939c87381", 3, 0, 0.0, 282.6666666666667, 177, 466, 205.0, 466.0, 466.0, 466.0, 0.03095623819793419, 0.025162020436276585, 0.0198514938964617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 258.94117647058823, 82, 891, 87.0, 855.8, 891.0, 891.0, 0.14634482283667918, 23.270365267531247, 0.08381536556075893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 178.41176470588235, 83, 438, 88.0, 421.2, 438.0, 438.0, 0.14635238210024276, 7.626448861679781, 0.08396261718951772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 85.625, 84, 89, 85.0, 89.0, 89.0, 89.0, 0.060968174612852095, 0.01631374984757956, 0.03477091208389221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 96.94117647058822, 85, 266, 86.0, 125.19999999999987, 266.0, 266.0, 0.1463460826597109, 0.10875914932035158, 0.0734588735225502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 87.125, 84, 94, 86.5, 94.0, 94.0, 94.0, 0.06096724534743709, 0.045308665731835576, 0.03060269932478776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 107.6470588235294, 83, 254, 84.0, 250.0, 254.0, 254.0, 0.14634860237084735, 0.07794946238410481, 0.08129543801275815], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 546.3846153846154, 83, 898, 537.0, 830.0, 898.0, 898.0, 0.08385365601940244, 0.015709962298106197, 0.05706987105887816], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 109.0, 85, 253, 87.5, 253.0, 253.0, 253.0, 0.06308402002917636, 0.04965402357765249, 0.022424397744746284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1344.8636363636363, 780, 3964, 1037.5, 2392.0, 3728.1999999999966, 3964.0, 0.09306063746536664, 0.04816615025062922, 0.04280425805291766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 194.75, 171, 349, 172.5, 349.0, 349.0, 349.0, 0.06092592169495914, 0.09442327903310563, 0.13702382584325284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77b1f7a4-54a2-47c1-aeab-b5b51cad4355", 3, 0, 0.0, 551.3333333333334, 221, 896, 537.0, 896.0, 896.0, 896.0, 0.030144088744197266, 0.030232401504190026, 0.01933068190952754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38bd4095-357f-4ffc-b063-8cc96fc319ce", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 0.8481880868544601, 3.236869131455399], "isController": false}, {"data": ["addBook", 61, 3, 4.918032786885246, 989.1311475409834, 436, 3154, 769.0, 1507.8000000000002, 2084.2, 3154.0, 0.2800580316970599, 94.42749438162268, 1.0178646034194625], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8f5ad4b5-5626-4f3e-b2b7-766a8e4b4ac4", 3, 0, 0.0, 281.3333333333333, 177, 439, 228.0, 439.0, 439.0, 439.0, 0.020736706043367366, 0.024510084519357718, 0.01329795276869587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df202673-46a0-4a21-8306-8c11d6742ca6", 3, 0, 0.0, 556.0, 213, 1047, 408.0, 1047.0, 1047.0, 1047.0, 0.017482619362583697, 0.024101202148613922, 0.011211184942802698], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 152.5283018867925, 83, 388, 88.0, 338.6, 340.3, 388.0, 0.2503720150223209, 0.18606748382029903, 0.12102944085551645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/987dcdac-09fc-4877-9c56-d4632bb9c6e9", 3, 0, 0.0, 779.0, 181, 1455, 701.0, 1455.0, 1455.0, 1455.0, 0.01888990334666121, 0.02604125672952807, 0.01211364244561282], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 508.4528301886794, 401, 674, 438.0, 659.6, 672.6, 674.0, 0.2501061771506772, 73.5395203889623, 0.1257858215162097], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 128.90566037735854, 82, 348, 87.0, 253.2, 261.99999999999994, 348.0, 0.25048087602141844, 0.4432337376472757, 0.12181589478385392], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 661.433962264151, 559, 1024, 590.0, 802.6000000000001, 879.9999999999998, 1024.0, 0.25010145625112074, 225.04172996622452, 0.12553920753230086], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 104.57142857142857, 86, 253, 88.0, 219.4000000000001, 252.39999999999998, 253.0, 0.11254863708959945, 0.08408174548197614, 0.040007523340443545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 3, 1.7142857142857142, 195.13142857142847, 83, 2642, 88.0, 287.6, 521.4, 2353.9600000000037, 0.7312874001270351, 1.502722152053455, 0.35555993239770334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 117.44444444444443, 87, 327, 91.0, 327.0, 327.0, 327.0, 0.05377789728421619, 0.041646359908577575, 0.019116361925248723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=987dcdac-09fc-4877-9c56-d4632bb9c6e9", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 88.93333333333332, 83, 114, 86.0, 104.4, 114.0, 114.0, 0.11119924681043494, 0.09024079501901507, 0.0395278572646468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5cf812f6-1cba-4179-b4aa-841bb5f070e4", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f5d982d-5b72-4640-85f8-f68a1c479410", 3, 0, 0.0, 1078.6666666666667, 294, 2044, 898.0, 2044.0, 2044.0, 2044.0, 0.036012676462114666, 0.03611818235018727, 0.02309406661144723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 320.77777777777777, 168, 834, 181.0, 834.0, 834.0, 834.0, 0.054274084124830396, 7.289287464194181, 0.12052073910749285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 377.7058823529412, 170, 1011, 337.0, 987.0, 1011.0, 1011.0, 0.1462353012017101, 31.059863866762434, 0.322283854009858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8b59a36-d061-4b80-a43e-632d22c1ea57", 3, 0, 0.0, 945.0, 225, 1916, 694.0, 1916.0, 1916.0, 1916.0, 0.0274333369911116, 0.02751370809557775, 0.01759234175536779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38bd4095-357f-4ffc-b063-8cc96fc319ce", 3, 0, 0.0, 290.3333333333333, 182, 497, 192.0, 497.0, 497.0, 497.0, 0.0781677479871805, 0.035368870345762006, 0.05012710401521666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 87.92307692307693, 84, 99, 87.0, 95.8, 99.0, 99.0, 0.06104547418246022, 0.050612898028231185, 0.02169975840079641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57640b08-25af-4ea2-b412-2d8ef475e658", 3, 0, 0.0, 365.66666666666663, 183, 728, 186.0, 728.0, 728.0, 728.0, 0.017796972141806273, 0.024534562832210144, 0.011412771848749465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 96.77777777777777, 85, 255, 87.5, 107.40000000000023, 255.0, 255.0, 0.18681307276369183, 0.1450355398897803, 0.0664062094589686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 85.1904761904762, 83, 93, 85.0, 86.0, 92.29999999999998, 93.0, 0.11704706964300644, 0.08698517577961709, 0.05875214237939972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 124.57142857142857, 81, 263, 85.0, 252.0, 261.9, 263.0, 0.1170464172649039, 0.03131906086971062, 0.06675303484639052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 108.6190476190476, 80, 262, 85.0, 250.0, 260.9, 262.0, 0.1170464172649039, 0.03154766715343113, 0.06881049139987515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 132.85714285714283, 82, 269, 84.0, 257.0, 267.9, 269.0, 0.11704772202838129, 0.03154801882796215, 0.06892556287413469], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 46.15384615384615, 0.4669260700389105], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.6923076923076925, 0.07782101167315175], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.6923076923076925, 0.07782101167315175], "isController": false}, {"data": ["401/Unauthorized", 5, 38.46153846153846, 0.38910505836575876], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1285, 13, "406/Not Acceptable", 6, "401/Unauthorized", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
