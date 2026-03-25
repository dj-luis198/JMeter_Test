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

    var data = {"OkPercent": 99.05956112852665, "KoPercent": 0.9404388714733543};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7701612903225806, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/24c81316-4051-45f8-9010-b6a6f977fc7b"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e3d910a4-7c17-429e-92f9-f3d98bcc6e1b"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9bfbdc97-b339-40cb-8af0-39136a83e8e7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/47d9a33e-0721-48d0-ae90-33ee8ad05164"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d5af4cc8-3183-4fc8-a48f-54593d876944"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ffb29e3-6c2a-4d46-8f11-39b5366d97fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d50959f-5a75-4f97-b76e-103fc9f23cb2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7144972-ec09-4cc5-a9d0-b0892d9c3602"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27eaacb5-60c0-4c82-9291-74e58d8d8701"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8d50959f-5a75-4f97-b76e-103fc9f23cb2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/73eee1ac-2943-4c23-9357-f77fab958946"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47d9a33e-0721-48d0-ae90-33ee8ad05164"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b364e8ee-30d9-44d5-b353-c3ee50f388e3"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c233cedb-ccc9-4ba9-baaa-d3e55a6d1ee0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/768498fb-6c61-4c43-a33b-96bdc032c86c"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4bd01ea8-eb06-4610-abed-343081dd0bd1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "register"], "isController": true}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c233cedb-ccc9-4ba9-baaa-d3e55a6d1ee0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b7144972-ec09-4cc5-a9d0-b0892d9c3602"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24c81316-4051-45f8-9010-b6a6f977fc7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d5af4cc8-3183-4fc8-a48f-54593d876944"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9bfbdc97-b339-40cb-8af0-39136a83e8e7"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=566b684d-f0a8-4ce0-8797-81af71f29be7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3d910a4-7c17-429e-92f9-f3d98bcc6e1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/2e76ad3b-f604-4a18-b405-7c95538143ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2807017543859649, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/27eaacb5-60c0-4c82-9291-74e58d8d8701"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9349112426035503, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4bd01ea8-eb06-4610-abed-343081dd0bd1"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/079c5c43-76d6-4688-965e-9baa3646b69e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/566b684d-f0a8-4ce0-8797-81af71f29be7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b364e8ee-30d9-44d5-b353-c3ee50f388e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=768498fb-6c61-4c43-a33b-96bdc032c86c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73eee1ac-2943-4c23-9357-f77fab958946"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/afaf7b56-8492-4c6a-8201-c1299bbefc6d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1276, 12, 0.9404388714733543, 434.58228840125395, 135, 2356, 159.5, 1136.6, 1323.0, 1819.2600000000011, 5.026333100924514, 719.5752097957363, 3.661365979140324], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2076.254545454545, 1650, 2965, 2043.0, 2501.2, 2543.4, 2965.0, 0.24142926122646063, 290.52213107276896, 1.1871057912844036], "isController": true}, {"data": ["deleteBook", 14, 0, 0.0, 533.7857142857143, 441, 888, 480.5, 781.5, 888.0, 888.0, 0.08949461114591457, 0.016168460021478707, 0.06082836851323881], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 533.7857142857143, 441, 888, 480.5, 781.5, 888.0, 888.0, 0.08859357696567, 0.016005675526024363, 0.06021594684385382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24c81316-4051-45f8-9010-b6a6f977fc7b", 2, 0, 0.0, 552.5, 270, 835, 552.5, 835.0, 835.0, 835.0, 0.06535306996046139, 0.037495047462667054, 0.04062229397444695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 275.7857142857142, 138, 575, 148.5, 510.5, 575.0, 575.0, 0.08963843696176921, 0.0336019084983641, 0.050584190500886785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 166.64285714285714, 140, 447, 145.0, 298.5, 447.0, 447.0, 0.08964073274896113, 0.06661777111519475, 0.04499544593063088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3d910a4-7c17-429e-92f9-f3d98bcc6e1b", 3, 0, 0.0, 729.0, 259, 1489, 439.0, 1489.0, 1489.0, 1489.0, 0.01596865884557242, 0.022014085355142973, 0.010240318335214087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 245.64285714285714, 137, 965, 145.0, 707.0, 965.0, 965.0, 0.0896430286537538, 1.9051519729470143, 0.052237574035537054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 225.0, 137, 989, 144.0, 709.5, 989.0, 989.0, 0.08964130671413387, 5.78382143491721, 0.05214903027314987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9bfbdc97-b339-40cb-8af0-39136a83e8e7", 3, 0, 0.0, 393.66666666666663, 233, 672, 276.0, 672.0, 672.0, 672.0, 0.0692952671332548, 0.03216635772526737, 0.0444373946134479], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47d9a33e-0721-48d0-ae90-33ee8ad05164", 3, 0, 0.0, 724.6666666666666, 298, 1417, 459.0, 1417.0, 1417.0, 1417.0, 0.02711790866688361, 0.02719735566493112, 0.017390065128177316], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 302.0714285714286, 227, 835, 255.0, 574.5, 835.0, 835.0, 0.09007617871113856, 0.18441237759290713, 0.058232842096458716], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d5af4cc8-3183-4fc8-a48f-54593d876944", 1, 0, 0.0, 739.0, 739, 739, 739.0, 739.0, 739.0, 739.0, 1.3531799729364007, 0.2444709912043302, 0.9329541610284168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ffb29e3-6c2a-4d46-8f11-39b5366d97fa", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 1.3195699896694215, 2.46561854338843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d50959f-5a75-4f97-b76e-103fc9f23cb2", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 158.95454545454547, 138, 435, 146.0, 150.0, 392.24999999999943, 435.0, 0.11723329425556858, 0.08712357121922626, 0.0588456184056272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 171.36363636363637, 136, 446, 145.5, 343.1999999999998, 442.99999999999994, 446.0, 0.11724266567188041, 0.0393757993818114, 0.06641738722054943], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 783.25, 688, 1033, 706.0, 1033.0, 1033.0, 1033.0, 0.04031404642162445, 11.853668200280183, 0.022991604599832696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1213.25, 1000, 1294, 1279.5, 1294.0, 1294.0, 1294.0, 0.0403274589668105, 36.28671846644755, 0.022959871657861838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 360.0, 144, 449, 423.5, 449.0, 449.0, 449.0, 0.04067851767481593, 0.07198190822926413, 0.02252414015783265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 144.0666666666667, 138, 152, 144.0, 151.4, 152.0, 152.0, 0.07379601796687052, 0.05484254850858247, 0.0370421418310268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 162.1333333333333, 137, 430, 143.0, 262.0000000000001, 430.0, 430.0, 0.07379892253573098, 0.01974697731913114, 0.042088448008659074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 205.13333333333333, 138, 480, 145.0, 456.6, 480.0, 480.0, 0.07379638102547452, 0.019890430823272427, 0.04338420056380435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 162.86666666666667, 136, 439, 144.0, 265.0000000000001, 439.0, 439.0, 0.0737985594521195, 0.019891017977329083, 0.04345755014612115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 143.75, 140, 147, 144.0, 147.0, 147.0, 147.0, 0.04067934506254449, 0.030231427336519883, 0.022842405674768636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 747.2631578947369, 144, 1491, 983.0, 1411.0, 1491.0, 1491.0, 0.10024163509934474, 47.485218892778384, 0.0543971619746547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 259.18181818181824, 135, 1297, 145.0, 429.7, 1166.949999999998, 1297.0, 0.117243915307259, 4.825449998467835, 0.06846861460326258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 615.2631578947369, 139, 1192, 704.0, 1158.0, 1192.0, 1192.0, 0.1002389908571489, 15.525214392736366, 0.05449361668873683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 222.00000000000006, 136, 737, 145.5, 431.1, 691.2499999999993, 737.0, 0.11723891692556927, 1.5970784028595637, 0.06858018675626562], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7144972-ec09-4cc5-a9d0-b0892d9c3602", 1, 0, 0.0, 815.0, 815, 815, 815.0, 815.0, 815.0, 815.0, 1.2269938650306749, 0.22167369631901843, 0.845954754601227], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 487.7857142857143, 227, 865, 462.0, 840.0, 865.0, 865.0, 0.08868449224960884, 0.016022100650564097, 0.06114380032053109], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27eaacb5-60c0-4c82-9291-74e58d8d8701", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 0.7958769273127753, 3.037238436123348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 352.40000000000003, 284, 633, 294.0, 604.8000000000001, 633.0, 633.0, 0.07374123708299331, 0.11428451489327186, 0.16584577050989607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 443.54545454545445, 185, 924, 426.0, 813.2999999999998, 919.05, 924.0, 0.0958451142952988, 0.058873610245842714, 0.043336218670628264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 162.57894736842107, 141, 430, 147.0, 159.0, 430.0, 430.0, 0.10023687556383243, 0.0744924436563247, 0.05031421292950183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d50959f-5a75-4f97-b76e-103fc9f23cb2", 3, 0, 0.0, 412.6666666666667, 234, 641, 363.0, 641.0, 641.0, 641.0, 0.018898828272647095, 0.022337775214186718, 0.012119365786821216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73eee1ac-2943-4c23-9357-f77fab958946", 3, 0, 0.0, 546.3333333333334, 314, 909, 416.0, 909.0, 909.0, 909.0, 0.03832347568375468, 0.03194870482620304, 0.02457592678938695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 201.42105263157902, 140, 594, 146.0, 435.0, 594.0, 594.0, 0.10024269283528543, 0.1060647653529598, 0.05273870291231403], "isController": false}, {"data": ["login", 22, 0, 0.0, 2537.0909090909095, 1446, 4071, 2431.0, 3615.2999999999997, 4012.0499999999993, 4071.0, 0.09645611466001412, 21.11529163725486, 0.17461262731111044], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 165.54545454545453, 146, 471, 151.0, 156.0, 423.7499999999993, 471.0, 0.11430768511350234, 0.09254010835848969, 0.040632809942690286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47d9a33e-0721-48d0-ae90-33ee8ad05164", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b364e8ee-30d9-44d5-b353-c3ee50f388e3", 3, 0, 0.0, 344.3333333333333, 251, 467, 315.0, 467.0, 467.0, 467.0, 0.02698157158660635, 0.027060619159613983, 0.017302635425004723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 912.6315789473682, 293, 1634, 1149.0, 1571.0, 1634.0, 1634.0, 0.1001576164595864, 63.138437882180384, 0.21176931888867218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c233cedb-ccc9-4ba9-baaa-d3e55a6d1ee0", 3, 0, 0.0, 375.6666666666667, 237, 449, 441.0, 449.0, 449.0, 449.0, 0.04063058670567203, 0.026121552325423913, 0.02605542181320765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/768498fb-6c61-4c43-a33b-96bdc032c86c", 3, 0, 0.0, 422.66666666666663, 234, 791, 243.0, 791.0, 791.0, 791.0, 0.0809192425958893, 0.037509440578302855, 0.05189157158655662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 527.3571428571429, 286, 1136, 562.5, 1012.0, 1136.0, 1136.0, 0.08955529399723658, 7.781684133280666, 0.1997752721841257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4bd01ea8-eb06-4610-abed-343081dd0bd1", 3, 0, 0.0, 388.6666666666667, 246, 574, 346.0, 574.0, 574.0, 574.0, 0.02797620157785777, 0.02789424004979764, 0.017940467808717386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1365.25, 1179, 1436, 1423.0, 1436.0, 1436.0, 1436.0, 0.04025643348127572, 48.160689844308244, 0.09077353994947818], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 973.6521739130434, 332, 1688, 1068.0, 1457.8000000000002, 1647.7999999999995, 1688.0, 0.09816935494197337, 0.03107807024657581, 0.04429125193671064], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 448.7272727272727, 281, 1443, 299.5, 784.4999999999998, 1356.5999999999988, 1443.0, 0.11714402858314298, 6.543524622543304, 0.26209728412219185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 170.58333333333334, 140, 428, 148.0, 345.2000000000003, 428.0, 428.0, 0.06307423837857157, 0.04896876905367618, 0.022420920673632865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c233cedb-ccc9-4ba9-baaa-d3e55a6d1ee0", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7144972-ec09-4cc5-a9d0-b0892d9c3602", 3, 0, 0.0, 474.66666666666663, 275, 760, 389.0, 760.0, 760.0, 760.0, 0.026292034389980984, 0.02636906183448288, 0.016860451740970877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 565.2857142857143, 279, 1461, 577.5, 1299.5, 1461.0, 1461.0, 0.10414729403012832, 17.937831272084804, 0.23042298214617815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 180.0, 143, 416, 145.5, 416.0, 416.0, 416.0, 0.04559417762351747, 0.03388395426903984, 0.02288613993992967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 212.875, 141, 425, 145.5, 425.0, 425.0, 425.0, 0.045595217061730225, 0.012200282690345784, 0.02600352223051802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 142.5, 137, 149, 141.0, 149.0, 149.0, 149.0, 0.04559625654733747, 0.01228961602252455, 0.026805611759274563], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24c81316-4051-45f8-9010-b6a6f977fc7b", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 0.5904054330065359, 2.2531147875816995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 248.75, 142, 444, 147.5, 444.0, 444.0, 444.0, 0.04552671564582491, 0.012270872576413747, 0.026809188998469163], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1370.3454545454545, 1088, 2348, 1180.0, 1890.0, 1920.2, 2348.0, 0.23578839063705737, 282.08488850960305, 0.4655899666680957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5af4cc8-3183-4fc8-a48f-54593d876944", 3, 0, 0.0, 353.3333333333333, 227, 524, 309.0, 524.0, 524.0, 524.0, 0.03825652273712668, 0.024595257944604553, 0.024532991468795427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9bfbdc97-b339-40cb-8af0-39136a83e8e7", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 0.719777141434263, 2.746825199203187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 973.6521739130434, 332, 1688, 1068.0, 1457.8000000000002, 1647.7999999999995, 1688.0, 0.09923845274308028, 0.03141652104502406, 0.04477359879619442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 178.125, 142, 406, 146.0, 406.0, 406.0, 406.0, 0.04252243058213207, 0.011461123867840286, 0.025040064102564104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 182.625, 140, 432, 145.0, 432.0, 432.0, 432.0, 0.042523108651857995, 0.011461306628821099, 0.024998936922283704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 431.3333333333333, 137, 1269, 150.0, 1200.0000000000002, 1269.0, 1269.0, 0.06003962615326115, 13.5180772043924, 0.034006819500870575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 408.83333333333337, 142, 1032, 149.0, 1024.8, 1032.0, 1032.0, 0.060038424591738714, 4.425459247043107, 0.034064770202929875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=566b684d-f0a8-4ce0-8797-81af71f29be7", 1, 0, 0.0, 865.0, 865, 865, 865.0, 865.0, 865.0, 865.0, 1.1560693641618498, 0.20886018786127167, 0.7970556358381503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3d910a4-7c17-429e-92f9-f3d98bcc6e1b", 1, 0, 0.0, 570.0, 570, 570, 570.0, 570.0, 570.0, 570.0, 1.7543859649122808, 0.3169544956140351, 1.2095668859649125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 146.49999999999997, 136, 166, 144.5, 166.0, 166.0, 166.0, 0.04252401277846584, 0.01137849560673793, 0.024251976037718802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 145.41666666666666, 139, 150, 145.0, 150.0, 150.0, 150.0, 0.060038724977610564, 0.044618622761681284, 0.030136625623527175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e76ad3b-f604-4a18-b405-7c95538143ec", 1, 0, 0.0, 1928.0, 1928, 1928, 1928.0, 1928.0, 1928.0, 1928.0, 0.5186721991701245, 0.16563067297717843, 0.30948116571576767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 181.375, 142, 426, 148.0, 426.0, 426.0, 426.0, 0.04252062250191343, 0.0315997985585509, 0.021343359341780763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 213.41666666666669, 137, 442, 145.5, 433.00000000000006, 442.0, 442.0, 0.06004022695205788, 0.03860985297649425, 0.032981081699738825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 187.125, 147, 425, 152.5, 425.0, 425.0, 425.0, 0.041881308372073545, 0.032965170456925076, 0.014887496335385518], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 562.9230769230769, 416, 791, 524.0, 778.6, 791.0, 791.0, 0.09738046547862499, 0.017593150501509395, 0.06628338324082188], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1381.7727272727273, 795, 2356, 1335.0, 1825.6, 2282.6499999999987, 2356.0, 0.09596133630522684, 0.04966748851735374, 0.04413846621070493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 367.375, 286, 859, 298.5, 859.0, 859.0, 859.0, 0.0424881033310673, 0.06584826170547246, 0.09555674020649217], "isController": false}, {"data": ["addBook", 57, 7, 12.280701754385966, 1387.526315789474, 738, 4179, 1182.0, 2070.0, 2278.6, 4179.0, 0.2685714824203474, 96.87718195924074, 0.9735302116413957], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 275.12727272727267, 139, 838, 150.0, 591.0, 599.4, 838.0, 0.236796445470084, 0.17597860840110735, 0.11446703174579256], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 827.2909090909092, 676, 1156, 735.0, 1036.4, 1098.8, 1156.0, 0.23695151110440946, 69.67161179533852, 0.11916994943239342], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27eaacb5-60c0-4c82-9291-74e58d8d8701", 3, 0, 0.0, 343.6666666666667, 244, 480, 307.0, 480.0, 480.0, 480.0, 0.0785360873321291, 0.035535534307180816, 0.05036331121233541], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 205.9818181818182, 138, 562, 148.0, 433.6, 440.19999999999993, 562.0, 0.23753276872514004, 0.42032165715815795, 0.115518866040156], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1092.8909090909092, 945, 1487, 1009.0, 1325.4, 1429.1999999999998, 1487.0, 0.23667111321485435, 212.95708369416715, 0.11879780487542493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 172.85714285714286, 142, 438, 153.0, 302.5, 438.0, 438.0, 0.1032874933600897, 0.07716301994186389, 0.03671547615534439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 7, 4.1420118343195265, 222.8520710059172, 137, 2153, 153.0, 379.0, 438.0, 1301.1000000000138, 0.7019380134738871, 1.5433866938615728, 0.336821217634012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 147.875, 139, 155, 149.5, 155.0, 155.0, 155.0, 0.04491253284228964, 0.034780897015562195, 0.015965001908782646], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 148.92857142857142, 140, 167, 147.5, 160.5, 167.0, 167.0, 0.08750984485754648, 0.07101629011388781, 0.031107015164205973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4bd01ea8-eb06-4610-abed-343081dd0bd1", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 431.5, 293, 831, 299.5, 831.0, 831.0, 831.0, 0.04548866195100871, 0.07049854151977619, 0.10230506686833307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 625.2500000000001, 288, 1410, 561.5, 1344.0000000000002, 1410.0, 1410.0, 0.05999430054144856, 18.013244796431838, 0.13109106197411247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/079c5c43-76d6-4688-965e-9baa3646b69e", 1, 0, 0.0, 547.0, 547, 547, 547.0, 547.0, 547.0, 547.0, 1.8281535648994516, 0.5837951325411335, 1.0908220978062155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/566b684d-f0a8-4ce0-8797-81af71f29be7", 3, 0, 0.0, 368.66666666666663, 225, 654, 227.0, 654.0, 654.0, 654.0, 0.019077780109506455, 0.026300260014244743, 0.012234123312411367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b364e8ee-30d9-44d5-b353-c3ee50f388e3", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=768498fb-6c61-4c43-a33b-96bdc032c86c", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 0.7590926995798319, 2.8968618697478994], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73eee1ac-2943-4c23-9357-f77fab958946", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afaf7b56-8492-4c6a-8201-c1299bbefc6d", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 1.1049686418685123, 2.064635596885813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 188.20000000000002, 146, 450, 149.0, 438.0, 450.0, 450.0, 0.07413264801818721, 0.061463494304141546, 0.026351839725214984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 150.84210526315792, 140, 170, 151.0, 160.0, 170.0, 170.0, 0.09852370013534045, 0.07649056797616763, 0.0350220965324843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 145.28571428571428, 138, 158, 144.5, 155.0, 158.0, 158.0, 0.10426286156870923, 0.07748441177127706, 0.052335069185855995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 268.35714285714283, 137, 473, 154.0, 458.0, 473.0, 473.0, 0.10426208509275602, 0.050269219598293086, 0.058211058111217864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 353.2142857142857, 137, 1323, 148.0, 1155.5, 1323.0, 1323.0, 0.10425975573428657, 13.425959864648496, 0.06001335828120345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 332.42857142857144, 137, 1038, 150.0, 1014.5, 1038.0, 1038.0, 0.10426363805622789, 4.403655045615341, 0.06011741295848073], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 41.666666666666664, 0.39184952978056425], "isController": false}, {"data": ["401/Unauthorized", 7, 58.333333333333336, 0.54858934169279], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1276, 12, "401/Unauthorized", 7, "406/Not Acceptable", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
