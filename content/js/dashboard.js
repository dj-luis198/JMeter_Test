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

    var data = {"OkPercent": 97.79299847792998, "KoPercent": 2.207001522070015};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7963565387117761, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3392857142857143, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fe07fa5f-34f8-4813-aeb9-96a371454add"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=06af64fb-6d66-4232-8a30-16d29a888ea5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26649b46-ca71-4710-811a-56fcb168c788"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1f3da62-22c6-4ad0-94c1-55fa24db582c"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abf100ba-38af-4555-824d-d63b4ede1fdf"], "isController": false}, {"data": [0.84375, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf35f4fc-f485-421c-993e-f5fab985625f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ef0f7dc-6faa-4520-a306-eeadb5905c4c"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a99a52dd-3aa2-4b25-8711-bfe1bc5a57f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6b25316-260c-4e9a-8760-757b42d0e577"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8fd944db-a925-426e-aaea-e9d01d4534a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3bb22031-a65e-4240-9723-908ebd3083b9"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60bcd8f5-d302-4957-a441-67fbddbe1c9f"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ef8711e-453e-4a0d-aa88-76c511bde1da"], "isController": false}, {"data": [0.24, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a99a52dd-3aa2-4b25-8711-bfe1bc5a57f5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3bb22031-a65e-4240-9723-908ebd3083b9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bf35f4fc-f485-421c-993e-f5fab985625f"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a1f3da62-22c6-4ad0-94c1-55fa24db582c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/26649b46-ca71-4710-811a-56fcb168c788"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe07fa5f-34f8-4813-aeb9-96a371454add"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.24, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/abf100ba-38af-4555-824d-d63b4ede1fdf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2bd734f-9482-4a1a-ac1f-6433012b9d36"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/06af64fb-6d66-4232-8a30-16d29a888ea5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4ef0f7dc-6faa-4520-a306-eeadb5905c4c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8fd944db-a925-426e-aaea-e9d01d4534a6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e2bd734f-9482-4a1a-ac1f-6433012b9d36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b6b25316-260c-4e9a-8760-757b42d0e577"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/60bcd8f5-d302-4957-a441-67fbddbe1c9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0ef8711e-453e-4a0d-aa88-76c511bde1da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1314, 29, 2.207001522070015, 318.6643835616436, 79, 2740, 98.0, 875.0, 1113.0, 1655.9499999999975, 5.1005356726962185, 727.7320816209436, 3.732844008374738], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1373.8571428571427, 978, 1834, 1377.5, 1655.4000000000005, 1769.85, 1834.0, 0.2599681539011471, 312.8299832935644, 1.278261381730738], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fe07fa5f-34f8-4813-aeb9-96a371454add", 3, 0, 0.0, 465.66666666666663, 221, 897, 279.0, 897.0, 897.0, 897.0, 0.029435717299371056, 0.024539346355367603, 0.018876420273359694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=06af64fb-6d66-4232-8a30-16d29a888ea5", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26649b46-ca71-4710-811a-56fcb168c788", 1, 0, 0.0, 1314.0, 1314, 1314, 1314.0, 1314.0, 1314.0, 1314.0, 0.76103500761035, 0.13749167617960426, 0.5246979642313546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1f3da62-22c6-4ad0-94c1-55fa24db582c", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["deleteBook", 16, 2, 12.5, 560.6875, 90, 1267, 489.0, 1168.3000000000002, 1267.0, 1267.0, 0.08673544064314329, 0.016908752283581525, 0.05843419151727391], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 560.6875, 90, 1267, 489.0, 1168.3000000000002, 1267.0, 1267.0, 0.08848382958014422, 0.017249594218687783, 0.05961209173008007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 117.2, 80, 263, 86.0, 245.60000000000002, 262.15, 263.0, 0.10792259791277696, 0.03698246055429046, 0.06109641602542656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 92.0, 81, 238, 82.0, 93.80000000000001, 230.7999999999999, 238.0, 0.10791852151625522, 0.08020116686901389, 0.05417003912046405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 142.35000000000002, 79, 641, 83.0, 246.5, 621.2999999999997, 641.0, 0.10792143319663285, 1.6142580232840493, 0.06308766592920355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 145.80000000000004, 80, 714, 82.0, 241.9, 690.3999999999996, 714.0, 0.10792201555156244, 4.883054902964618, 0.06298261376329464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abf100ba-38af-4555-824d-d63b4ede1fdf", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.0323660714285714, 3.9397321428571432], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 263.125, 88, 539, 215.5, 493.50000000000006, 539.0, 539.0, 0.08667154194090085, 0.15823481216651772, 0.05602121759973999], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 83.0625, 81, 91, 82.0, 87.5, 91.0, 91.0, 0.09509714767992677, 0.07067278260197683, 0.04773431045652574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 112.8125, 80, 245, 82.5, 241.5, 245.0, 245.0, 0.09509884336031764, 0.04330062081713681, 0.05323770698857625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 663.3749999999999, 476, 787, 638.5, 787.0, 787.0, 787.0, 0.0708472444849848, 20.831442228500077, 0.040405069120342904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 840.375, 715, 949, 866.0, 949.0, 949.0, 949.0, 0.07079646017699115, 63.702779314159294, 0.04030696902654867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 143.5, 81, 242, 88.5, 242.0, 242.0, 242.0, 0.07109657581116749, 0.125807612665855, 0.03936695164544138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 97.70588235294116, 80, 241, 82.0, 203.39999999999998, 241.0, 241.0, 0.0900466653601072, 0.0669194456435953, 0.045199205073335066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf35f4fc-f485-421c-993e-f5fab985625f", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 100.29411764705881, 79, 238, 81.0, 238.0, 238.0, 238.0, 0.09004761929985328, 0.024094773132968553, 0.05135528288194757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 91.76470588235294, 79, 239, 81.0, 121.39999999999989, 239.0, 239.0, 0.09004761929985328, 0.02427064738941358, 0.052938151189952806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 129.0, 79, 240, 82.0, 240.0, 240.0, 240.0, 0.08997184410525648, 0.024250223606494908, 0.05298146679245083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 118.87499999999999, 79, 342, 90.0, 342.0, 342.0, 342.0, 0.07118957784580338, 0.05290553587954723, 0.03997461646614935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 718.076923076923, 79, 1032, 866.0, 1031.2, 1032.0, 1032.0, 0.06450076408597455, 44.648551074061764, 0.033655521885605416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 177.25, 80, 873, 82.5, 705.7000000000002, 873.0, 873.0, 0.09509771290000475, 10.718563983672912, 0.05488549641006134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ef0f7dc-6faa-4520-a306-eeadb5905c4c", 1, 0, 0.0, 621.0, 621, 621, 621.0, 621.0, 621.0, 621.0, 1.6103059581320451, 0.29092441626409016, 1.1102304750402576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 520.9230769230769, 81, 802, 632.0, 770.4, 802.0, 802.0, 0.06449372426452349, 14.591162499379868, 0.033714830765987004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 141.68750000000003, 80, 701, 82.0, 487.5000000000002, 701.0, 701.0, 0.09509375650054977, 3.51751712430537, 0.05497607797688033], "isController": false}, {"data": ["deleteBooks", 16, 2, 12.5, 601.75, 91, 1622, 445.0, 1406.4000000000003, 1622.0, 1622.0, 0.08805820647447964, 0.017166620573699214, 0.05992730726260058], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a99a52dd-3aa2-4b25-8711-bfe1bc5a57f5", 3, 0, 0.0, 637.0, 179, 1141, 591.0, 1141.0, 1141.0, 1141.0, 0.028699071106731845, 0.02392523473448576, 0.0184040267188352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 228.94117647058823, 163, 481, 171.0, 443.4, 481.0, 481.0, 0.08993233914014104, 0.1393775607572303, 0.20225993851537577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6b25316-260c-4e9a-8760-757b42d0e577", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 0.7112758366141733, 2.714382381889764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 646.0454545454544, 134, 1270, 553.5, 1188.8, 1257.9999999999998, 1270.0, 0.0955636736413669, 0.05870073312540995, 0.04320896571870399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 95.84615384615384, 80, 244, 82.0, 183.99999999999994, 244.0, 244.0, 0.06454784236423851, 0.04796963675701709, 0.03239999118673691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 161.30769230769232, 81, 273, 97.0, 269.0, 273.0, 273.0, 0.06455136799245245, 0.09185186392075079, 0.03264421644570237], "isController": false}, {"data": ["login", 22, 0, 0.0, 2868.272727272727, 1948, 4106, 2848.5, 3769.1, 4061.899999999999, 4106.0, 0.0897252368542332, 39.153451949076846, 0.18947924441154518], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8fd944db-a925-426e-aaea-e9d01d4534a6", 1, 0, 0.0, 874.0, 874, 874, 874.0, 874.0, 874.0, 874.0, 1.1441647597254005, 0.20670945366132723, 0.7888479691075515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 90.75, 82, 106, 91.0, 101.10000000000001, 106.0, 106.0, 0.09014795533168814, 0.0729811083691108, 0.03204478099681102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 818.4615384615386, 162, 1113, 959.0, 1113.0, 1113.0, 1113.0, 0.06446398198975518, 59.34715826186509, 0.13229353395268342], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3bb22031-a65e-4240-9723-908ebd3083b9", 3, 0, 0.0, 348.3333333333333, 210, 457, 378.0, 457.0, 457.0, 457.0, 0.03421923120793886, 0.028527165079274552, 0.0219439731379035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60bcd8f5-d302-4957-a441-67fbddbe1c9f", 1, 0, 0.0, 1622.0, 1622, 1622, 1622.0, 1622.0, 1622.0, 1622.0, 0.6165228113440198, 0.11138351572133168, 0.4250635789149198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 265.45000000000005, 163, 797, 181.5, 466.8000000000003, 781.1499999999997, 797.0, 0.10787079236490532, 6.611368207848139, 0.24122395257460613], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 671.25, 88, 1292, 876.5, 1194.8000000000004, 1292.0, 1292.0, 0.10610736296676186, 84.63699400051284, 0.1829419426931817], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ef8711e-453e-4a0d-aa88-76c511bde1da", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["register", 25, 8, 32.0, 1148.8799999999999, 102, 2740, 1176.0, 1876.0000000000011, 2577.9999999999995, 2740.0, 0.099072679717841, 0.031006652730443052, 0.0446988066695728], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a99a52dd-3aa2-4b25-8711-bfe1bc5a57f5", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3bb22031-a65e-4240-9723-908ebd3083b9", 1, 0, 0.0, 841.0, 841, 841, 841.0, 841.0, 841.0, 841.0, 1.1890606420927465, 0.21482052615933414, 0.8198015755053508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf35f4fc-f485-421c-993e-f5fab985625f", 3, 0, 0.0, 373.3333333333333, 169, 620, 331.0, 620.0, 620.0, 620.0, 0.0432919173990216, 0.02743794374215334, 0.02776206942580487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 282.875, 163, 956, 172.5, 788.0000000000002, 956.0, 956.0, 0.09504686998776271, 14.342528592029133, 0.21072280916964678], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 124.41666666666666, 82, 366, 86.5, 330.60000000000014, 366.0, 366.0, 0.08445113797908427, 0.06556509247399608, 0.030019740453502614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1f3da62-22c6-4ad0-94c1-55fa24db582c", 3, 0, 0.0, 283.0, 182, 482, 185.0, 482.0, 482.0, 482.0, 0.04513585893539554, 0.02901800826738483, 0.028944544955315503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26649b46-ca71-4710-811a-56fcb168c788", 2, 0, 0.0, 285.0, 241, 329, 285.0, 329.0, 329.0, 329.0, 0.015283041936667073, 0.03020788757794351, 0.009499664250672453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 282.27777777777777, 163, 1040, 191.5, 409.100000000001, 1040.0, 1040.0, 0.1124191987009337, 7.636350972348, 0.25123544015239047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 86.90909090909092, 80, 97, 85.0, 96.4, 97.0, 97.0, 0.0532948318548055, 0.039606803751471666, 0.026751507395869165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 112.36363636363636, 81, 241, 83.0, 241.0, 241.0, 241.0, 0.05325432328279014, 0.014249691972152829, 0.03037160624721625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 111.18181818181817, 79, 241, 82.0, 240.8, 241.0, 241.0, 0.05325458110430636, 0.014353773813270073, 0.03130786896952385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 81.27272727272728, 80, 83, 82.0, 83.0, 83.0, 83.0, 0.05329586472540517, 0.014364901039269361, 0.0313841859662298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 92.5, 91, 94, 92.5, 94.0, 94.0, 94.0, 0.05448106782892945, 0.016067658676110052, 0.03367823821846908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe07fa5f-34f8-4813-aeb9-96a371454add", 1, 0, 0.0, 1162.0, 1162, 1162, 1162.0, 1162.0, 1162.0, 1162.0, 0.8605851979345955, 0.15547681798623064, 0.5933331540447505], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 953.357142857143, 639, 1439, 918.5, 1309.3000000000004, 1401.8, 1439.0, 0.24767473231226478, 296.3050855141241, 0.48906084837441344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 1148.8799999999999, 102, 2740, 1176.0, 1876.0000000000011, 2577.9999999999995, 2740.0, 0.0976398495565198, 0.030558221665892057, 0.04405235399913296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 110.83333333333334, 81, 238, 84.5, 238.0, 238.0, 238.0, 0.030117911624007992, 0.008117718367408404, 0.01773544991140314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 109.33333333333333, 80, 239, 83.5, 239.0, 239.0, 239.0, 0.030118062806200305, 0.008117759115733675, 0.01770612676692635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 122.0833333333333, 80, 241, 83.5, 240.7, 241.0, 241.0, 0.08242833886290107, 0.022217013209141306, 0.0484588476518227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 122.0, 79, 242, 82.5, 241.4, 242.0, 242.0, 0.08233784590472139, 0.022192622529006934, 0.048486055742721676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 113.5, 79, 241, 85.5, 241.0, 241.0, 241.0, 0.030118062806200305, 0.008058934774315315, 0.01717670769416111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 83.0, 79, 95, 81.5, 92.30000000000001, 95.0, 95.0, 0.08241984669908514, 0.06125146810351933, 0.04137089961262672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 112.83333333333333, 81, 248, 87.0, 248.0, 248.0, 248.0, 0.030116097556078684, 0.022381201406421754, 0.015116869281078556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abf100ba-38af-4555-824d-d63b4ede1fdf", 3, 0, 0.0, 292.6666666666667, 200, 400, 278.0, 400.0, 400.0, 400.0, 0.07196660749412272, 0.03256301576068704, 0.04615046118600969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 120.91666666666666, 79, 240, 81.0, 240.0, 240.0, 240.0, 0.08233784590472139, 0.022031806423724275, 0.046958302742536415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 90.83333333333334, 83, 106, 86.0, 106.0, 106.0, 106.0, 0.02881401513696262, 0.022679781445695185, 0.010242481943217181], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 533.4666666666666, 89, 1377, 457.0, 1089.0000000000002, 1377.0, 1377.0, 0.08590130512716257, 0.01651474961201244, 0.058458746256134786], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1662.3181818181818, 1041, 2352, 1629.5, 2172.9, 2331.2999999999997, 2352.0, 0.09422245064028438, 0.04876747933530344, 0.04333864673005268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 256.16666666666663, 165, 490, 189.5, 490.0, 490.0, 490.0, 0.030103556233443043, 0.04665463256100987, 0.06770360352111263], "isController": false}, {"data": ["addBook", 57, 13, 22.80701754385965, 865.175438596491, 422, 2311, 721.0, 1537.4000000000005, 1983.6, 2311.0, 0.27588343198989396, 82.16709782275942, 1.0027290755121994], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2bd734f-9482-4a1a-ac1f-6433012b9d36", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06af64fb-6d66-4232-8a30-16d29a888ea5", 3, 0, 0.0, 411.66666666666663, 219, 720, 296.0, 720.0, 720.0, 720.0, 0.025351969848057196, 0.029965170090591037, 0.016257610872614802], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ef0f7dc-6faa-4520-a306-eeadb5905c4c", 3, 0, 0.0, 343.33333333333337, 197, 631, 202.0, 631.0, 631.0, 631.0, 0.05160313747075822, 0.03210077985241502, 0.033091855734828673], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 149.62500000000003, 80, 390, 85.0, 342.1000000000001, 362.0, 390.0, 0.24846043267609633, 0.1846468645180755, 0.1201053849361989], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 529.3392857142857, 395, 724, 518.5, 646.6, 721.15, 724.0, 0.24845822796042416, 73.05496860996496, 0.1249570189449399], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 118.08928571428571, 79, 326, 87.5, 243.3, 248.0, 326.0, 0.24880374271915834, 0.44026599785851067, 0.12100025768959068], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 800.2321428571427, 555, 1086, 791.0, 1039.4, 1052.6, 1086.0, 0.24810707592519574, 223.2471830432105, 0.12453812209526426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 104.94444444444446, 82, 245, 85.5, 243.2, 245.0, 245.0, 0.11055356627379205, 0.08259128730415129, 0.03929833801138702], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 13, 7.647058823529412, 149.95294117647046, 81, 1084, 91.0, 284.40000000000003, 418.34999999999997, 821.299999999997, 0.698057347464204, 1.5453300669211154, 0.3335100504859711], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 109.09090909090908, 82, 243, 95.0, 217.8000000000001, 243.0, 243.0, 0.053424770637746054, 0.04137289366770764, 0.018990836437636296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 90.75, 83, 107, 90.5, 103.9, 106.85, 107.0, 0.10546020195628675, 0.08558342561101004, 0.037487806164148804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fd944db-a925-426e-aaea-e9d01d4534a6", 3, 0, 0.0, 303.3333333333333, 210, 401, 299.0, 401.0, 401.0, 401.0, 0.026852125345721112, 0.026930793681694907, 0.01721962465204121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2bd734f-9482-4a1a-ac1f-6433012b9d36", 3, 0, 0.0, 373.0, 190, 509, 420.0, 509.0, 509.0, 509.0, 0.05094070501935746, 0.032749964978265295, 0.032667053674522856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 200.72727272727272, 163, 329, 175.0, 327.8, 329.0, 329.0, 0.0532326751838947, 0.08250024952816493, 0.1197215341294038], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6b25316-260c-4e9a-8760-757b42d0e577", 3, 0, 0.0, 409.3333333333333, 352, 474, 402.0, 474.0, 474.0, 474.0, 0.07287390385502951, 0.03297354373648796, 0.046732288604950566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 234.58333333333331, 162, 326, 180.0, 325.7, 326.0, 326.0, 0.0822836454397718, 0.12752357940714634, 0.18505784711698678], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 106.23529411764707, 81, 245, 87.0, 243.4, 245.0, 245.0, 0.09515386940411288, 0.07889222180087094, 0.033824227014743254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60bcd8f5-d302-4957-a441-67fbddbe1c9f", 3, 0, 0.0, 651.6666666666667, 202, 1377, 376.0, 1377.0, 1377.0, 1377.0, 0.02050889402370828, 0.024601326327267258, 0.013151862378484803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 89.46153846153847, 81, 108, 86.0, 105.6, 108.0, 108.0, 0.06317364978472365, 0.04904594880747587, 0.022456258321913482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ef8711e-453e-4a0d-aa88-76c511bde1da", 3, 0, 0.0, 409.3333333333333, 264, 539, 425.0, 539.0, 539.0, 539.0, 0.01880924913477454, 0.022231895705848423, 0.01206192083187039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 86.77777777777779, 81, 110, 84.0, 100.10000000000002, 110.0, 110.0, 0.11247891020433669, 0.08359028385302755, 0.05645914047366119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 121.27777777777777, 80, 267, 83.5, 248.10000000000002, 267.0, 267.0, 0.11249718757031074, 0.03948875887477813, 0.06363366306467338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 167.94444444444443, 81, 958, 86.0, 319.900000000001, 958.0, 958.0, 0.11249718757031074, 5.652257375206245, 0.06559894596385091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 132.05555555555551, 80, 484, 83.0, 265.30000000000035, 484.0, 484.0, 0.11249718757031074, 1.8662985573798156, 0.06570880649858754], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 27.586206896551722, 0.60882800608828], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.896551724137931, 0.15220700152207], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.896551724137931, 0.15220700152207], "isController": false}, {"data": ["401/Unauthorized", 17, 58.62068965517241, 1.2937595129375952], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1314, 29, "401/Unauthorized", 17, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
