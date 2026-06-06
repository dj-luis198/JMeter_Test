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

    var data = {"OkPercent": 97.43396226415095, "KoPercent": 2.5660377358490565};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7664516129032258, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/199137ba-db86-485c-bfb1-03c0caebe4dc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0e917490-fde6-4ad5-a528-c6e4b58ca40d"], "isController": false}, {"data": [0.034482758620689655, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0faa59f-72a9-4fd2-80e7-c60d2b8b683a"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/99a204cc-b54f-4768-9d36-123d290c711f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db2e8d42-cf33-45f5-b0d6-f3de677a9f88"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a9155156-20cb-47ab-b577-f35f9a8bbae5"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af4f125f-d8b3-4288-a4b4-31fbf42e7fc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75083b87-5475-4918-97cb-4d717b12c964"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cfacf187-2a9b-437e-b9d0-569691153735"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/07a71883-44f6-45d5-b4a4-b97684d5d720"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cf68e59c-d109-4879-9cfe-830abf0c9525"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f58ce28-95b5-4f80-b193-06c95644cb86"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9bbe0629-b199-49fc-815c-adbd2ce698c2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.43103448275862066, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/af4f125f-d8b3-4288-a4b4-31fbf42e7fc4"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.25892857142857145, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0faa59f-72a9-4fd2-80e7-c60d2b8b683a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=199137ba-db86-485c-bfb1-03c0caebe4dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99a204cc-b54f-4768-9d36-123d290c711f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5bdee3e8-95b8-4543-89a2-7c0fea138dba"], "isController": false}, {"data": [0.5086206896551724, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9176470588235294, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75083b87-5475-4918-97cb-4d717b12c964"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87ede41c-b9da-41f5-bd90-093c325990e4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9155156-20cb-47ab-b577-f35f9a8bbae5"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db2e8d42-cf33-45f5-b0d6-f3de677a9f88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07a71883-44f6-45d5-b4a4-b97684d5d720"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c4a8da3-8067-44a6-b612-9494343383e1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e917490-fde6-4ad5-a528-c6e4b58ca40d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf68e59c-d109-4879-9cfe-830abf0c9525"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8db465af-a26e-44de-9d23-c9b1ea4eacb1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cfacf187-2a9b-437e-b9d0-569691153735"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9bbe0629-b199-49fc-815c-adbd2ce698c2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1325, 34, 2.5660377358490565, 386.40150943396316, 100, 3108, 124.0, 1105.8000000000002, 1300.9000000000003, 1696.4600000000003, 5.145331339921946, 746.6424968569793, 3.7535434829039085], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/199137ba-db86-485c-bfb1-03c0caebe4dc", 3, 0, 0.0, 415.66666666666663, 207, 814, 226.0, 814.0, 814.0, 814.0, 0.04770916493058317, 0.030237546914012182, 0.03059474443790652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e917490-fde6-4ad5-a528-c6e4b58ca40d", 3, 0, 0.0, 735.0, 203, 1580, 422.0, 1580.0, 1580.0, 1580.0, 0.021046576072849214, 0.02487634040381364, 0.013496664994633123], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1826.741379310345, 1275, 2405, 1834.5, 2193.8, 2393.55, 2405.0, 0.2543357670635182, 306.04959153483964, 1.2505669796531387], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a0faa59f-72a9-4fd2-80e7-c60d2b8b683a", 3, 0, 0.0, 278.3333333333333, 190, 405, 240.0, 405.0, 405.0, 405.0, 0.05509237154295368, 0.03541908652256951, 0.035329417949094645], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 414.875, 112, 1054, 451.5, 710.3000000000004, 1054.0, 1054.0, 0.08437038599451592, 0.01765269062434086, 0.05633618303100612], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 414.875, 112, 1054, 451.5, 710.3000000000004, 1054.0, 1054.0, 0.0842797244053012, 0.017633721634605255, 0.0562756460567624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 196.79999999999998, 104, 342, 114.0, 340.2, 342.0, 342.0, 0.1180080245456691, 0.067024870191173, 0.06531928546141137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 110.00000000000001, 101, 117, 110.0, 116.4, 117.0, 117.0, 0.11819399574501616, 0.08783753004097392, 0.059327845520447564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 302.06666666666666, 101, 911, 115.0, 845.6, 911.0, 911.0, 0.1179931721284395, 6.964224347301102, 0.06745429976952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 317.8666666666666, 100, 1092, 113.0, 1043.4, 1092.0, 1092.0, 0.11819306443097918, 21.29555080676616, 0.06745315122408617], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 199.0, 110, 273, 211.5, 272.3, 273.0, 273.0, 0.08419280151547043, 0.12723472689960008, 0.05440877578404547], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/99a204cc-b54f-4768-9d36-123d290c711f", 3, 0, 0.0, 333.3333333333333, 210, 475, 315.0, 475.0, 475.0, 475.0, 0.02557719196535143, 0.02565212514493742, 0.016402040420489036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 112.21428571428571, 105, 124, 110.5, 121.0, 124.0, 124.0, 0.06966005891250696, 0.05176885237540801, 0.034966084258816976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 820.3333333333334, 502, 992, 853.5, 992.0, 992.0, 992.0, 0.029066387629345422, 8.54648305792931, 0.01657692419486106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 158.0, 102, 342, 110.0, 341.0, 342.0, 342.0, 0.06965901910149816, 0.026112414107941625, 0.03930953296115514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1172.0, 946, 1470, 1156.5, 1470.0, 1470.0, 1470.0, 0.029046968948790195, 26.13651371924652, 0.016537483297992855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 185.83333333333334, 102, 345, 115.0, 345.0, 345.0, 345.0, 0.029131870266071083, 0.051549754806758594, 0.016130635196154593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 113.18181818181817, 107, 118, 115.0, 117.6, 118.0, 118.0, 0.06890244666324243, 0.05120582217844481, 0.03458579842276036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 172.18181818181822, 104, 344, 113.0, 343.4, 344.0, 344.0, 0.06889942562933363, 0.018435979123474035, 0.03929420367922933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 150.54545454545453, 101, 329, 113.0, 328.8, 329.0, 329.0, 0.06889726791015796, 0.018569966741409764, 0.04050405789249521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 132.45454545454544, 108, 343, 112.0, 297.20000000000016, 343.0, 343.0, 0.06890028875484651, 0.018570780953454723, 0.04057311925700434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 149.66666666666666, 102, 344, 114.5, 344.0, 344.0, 344.0, 0.029164155308848402, 0.021673752138704722, 0.01637635674080843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 788.0, 107, 1361, 1011.5, 1342.5, 1361.0, 1361.0, 0.07519321971995897, 43.50230400920848, 0.040051299231417876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 189.7142857142857, 102, 789, 111.5, 565.0, 789.0, 789.0, 0.06966075213709236, 4.494639426306388, 0.040525298048503786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 632.0, 112, 964, 823.5, 949.0, 964.0, 964.0, 0.07519079664649046, 14.219903457031144, 0.04012343710558399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 186.85714285714283, 101, 537, 113.0, 439.5, 537.0, 537.0, 0.06965797932153128, 1.4804167008737101, 0.040591710327292994], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 440.5, 111, 1006, 445.0, 935.3000000000001, 1006.0, 1006.0, 0.08447997296640866, 0.01767561934380181, 0.05673935684340581], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 289.5454545454545, 225, 453, 232.0, 452.8, 453.0, 453.0, 0.06885069414018001, 0.10670512851607977, 0.15484682480940876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 528.1739130434783, 109, 976, 491.0, 950.0, 972.0, 976.0, 0.09902141015098612, 0.06082467479001003, 0.04477237587881502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 131.71428571428572, 108, 339, 115.0, 235.0, 339.0, 339.0, 0.07518675853772495, 0.055876096921102236, 0.03774022840663147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 171.71428571428572, 108, 342, 115.0, 332.5, 342.0, 342.0, 0.07519160432029476, 0.09272022748145721, 0.038823120478433434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db2e8d42-cf33-45f5-b0d6-f3de677a9f88", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 0.8138020833333334, 3.1056447072072073], "isController": false}, {"data": ["login", 23, 0, 0.0, 2777.2173913043475, 1641, 5088, 2768.0, 4155.200000000001, 4949.199999999998, 5088.0, 0.09658549285897258, 30.275549487466982, 0.18750757854920191], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 116.0, 106, 129, 116.0, 125.5, 129.0, 129.0, 0.06750957189287196, 0.05465374521405357, 0.02399754313379433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9155156-20cb-47ab-b577-f35f9a8bbae5", 3, 0, 0.0, 320.3333333333333, 226, 502, 233.0, 502.0, 502.0, 502.0, 0.022899539719251644, 0.027469011674948664, 0.014684926187150305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 952.0714285714287, 230, 1481, 1127.0, 1461.5, 1481.0, 1481.0, 0.07514035144215803, 57.83057959879077, 0.15663324933715475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af4f125f-d8b3-4288-a4b4-31fbf42e7fc4", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75083b87-5475-4918-97cb-4d717b12c964", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, 57.142857142857146, 630.0714285714287, 108, 1572, 114.5, 1552.5, 1572.0, 1572.0, 0.0637702812269402, 32.70607622598366, 0.08577138411117892], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 474.9333333333333, 213, 1204, 433.0, 1157.8, 1204.0, 1204.0, 0.11789301601773111, 28.3543755992895, 0.2591113494624079], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cfacf187-2a9b-437e-b9d0-569691153735", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07a71883-44f6-45d5-b4a4-b97684d5d720", 3, 0, 0.0, 319.0, 268, 418, 271.0, 418.0, 418.0, 418.0, 0.02573450568303667, 0.025809899742654942, 0.016502921938666093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf68e59c-d109-4879-9cfe-830abf0c9525", 3, 0, 0.0, 395.66666666666663, 228, 687, 272.0, 687.0, 687.0, 687.0, 0.04497683692898157, 0.028915772439693562, 0.028842567952504464], "isController": false}, {"data": ["register", 24, 6, 25.0, 1094.9583333333333, 114, 1675, 1209.5, 1582.5, 1668.5, 1675.0, 0.09966115208291808, 0.031436086057404826, 0.0449643088499103], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 129.2105263157895, 105, 310, 119.0, 132.0, 310.0, 310.0, 0.09747888812501923, 0.07567941021424834, 0.034650698513190435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 383.3571428571429, 218, 899, 430.0, 679.5, 899.0, 899.0, 0.06962126034373012, 6.049565947184814, 0.15530747110717696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f58ce28-95b5-4f80-b193-06c95644cb86", 1, 0, 0.0, 314.0, 314, 314, 314.0, 314.0, 314.0, 314.0, 3.1847133757961785, 1.0169934315286624, 1.9002537818471337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9bbe0629-b199-49fc-815c-adbd2ce698c2", 3, 0, 0.0, 464.0, 218, 594, 580.0, 594.0, 594.0, 594.0, 0.027003915567757327, 0.022512053310229985, 0.017316964084792295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 0, 0.0, 328.0, 212, 1351, 228.5, 457.5, 1217.199999999998, 1351.0, 0.10248670002142904, 5.724783868069337, 0.2293030729705304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 129.66666666666669, 105, 316, 111.5, 259.3000000000002, 316.0, 316.0, 0.06817252192882789, 0.050663368347498065, 0.03421941042130618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 126.74999999999997, 103, 324, 110.0, 261.60000000000025, 324.0, 324.0, 0.06817871914912958, 0.01824313383482569, 0.038883175764737966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 129.75, 105, 342, 109.5, 274.2000000000003, 342.0, 342.0, 0.06817949388089042, 0.018376504210083747, 0.04008208526982035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 137.08333333333331, 102, 436, 111.5, 339.70000000000033, 436.0, 436.0, 0.06817871914912958, 0.018376295395663832, 0.04014821059270033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 114.0, 111, 121, 112.0, 121.0, 121.0, 121.0, 0.04830217842824711, 0.014245369028643193, 0.0298586708448051], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1272.0862068965523, 829, 1928, 1211.0, 1733.8, 1897.75, 1928.0, 0.25009486356893995, 299.2004038708648, 0.49383966224257475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af4f125f-d8b3-4288-a4b4-31fbf42e7fc4", 3, 0, 0.0, 365.6666666666667, 273, 518, 306.0, 518.0, 518.0, 518.0, 0.024575056317837393, 0.024647053553143557, 0.01575939483923817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1094.9583333333333, 114, 1675, 1209.5, 1582.5, 1668.5, 1675.0, 0.0974018068035162, 0.030723421481968494, 0.043944955803930166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 113.0, 106, 118, 113.0, 118.0, 118.0, 118.0, 0.04500999864970004, 0.012131601198551965, 0.026504911314227664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 142.71428571428572, 102, 341, 111.0, 341.0, 341.0, 341.0, 0.045013471889086804, 0.01213253734510543, 0.026462998122295175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 300.2631578947368, 102, 1242, 115.0, 1241.0, 1242.0, 1242.0, 0.09595523435803423, 9.111634051356251, 0.05554316659848795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 196.0, 100, 790, 110.0, 677.0, 790.0, 790.0, 0.09605856539060446, 2.9962609835385954, 0.05569678639861272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 112.68421052631581, 103, 126, 113.0, 126.0, 126.0, 126.0, 0.09606147934678194, 0.07138943924111432, 0.04821835975024016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 140.14285714285714, 103, 318, 111.0, 318.0, 318.0, 318.0, 0.04500826223099526, 0.01204322641727803, 0.025668774553614486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 154.73684210526318, 103, 344, 113.0, 324.0, 344.0, 344.0, 0.09605807974842895, 0.04088985487646425, 0.053933925944276206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 111.00000000000001, 103, 116, 111.0, 116.0, 116.0, 116.0, 0.04500941982857841, 0.03344938329057438, 0.0225926189373919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 118.57142857142857, 112, 127, 116.0, 127.0, 127.0, 127.0, 0.04299278949501898, 0.033840027668930954, 0.015282593140807526], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 429.3125, 108, 814, 445.0, 754.5000000000001, 814.0, 814.0, 0.08584888450105702, 0.017375177063324285, 0.058413291285265116], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1570.1739130434783, 877, 3108, 1416.0, 2879.0, 3067.7999999999993, 3108.0, 0.0993988530236699, 0.05144667197514165, 0.04571958962319191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 259.57142857142856, 221, 457, 227.0, 457.0, 457.0, 457.0, 0.04497442882475392, 0.06970158061023875, 0.10114854451504715], "isController": false}, {"data": ["addBook", 56, 12, 21.428571428571427, 1109.3392857142858, 568, 2586, 912.5, 1940.3, 2173.0499999999997, 2586.0, 0.2622815686311244, 90.71026620847404, 0.9504002062540103], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0faa59f-72a9-4fd2-80e7-c60d2b8b683a", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=199137ba-db86-485c-bfb1-03c0caebe4dc", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 194.4137931034482, 104, 467, 116.0, 444.90000000000003, 465.05, 467.0, 0.2511431342663156, 0.1866405519303381, 0.1214021986931897], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99a204cc-b54f-4768-9d36-123d290c711f", 1, 0, 0.0, 905.0, 905, 905, 905.0, 905.0, 905.0, 905.0, 1.1049723756906078, 0.19962879834254144, 0.7618266574585635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bdee3e8-95b8-4543-89a2-7c0fea138dba", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 1.5887360074626864, 2.96855565920398], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 711.0689655172412, 496, 1091, 673.0, 955.5, 1015.1, 1091.0, 0.25075876142465564, 73.73140183334918, 0.1261140255211891], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 168.5689655172414, 103, 343, 115.0, 336.4, 341.1, 343.0, 0.251362994166645, 0.44479467327144606, 0.1222448936474504], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1074.5689655172414, 713, 1455, 1024.0, 1361.8, 1433.8, 1455.0, 0.2506428123852121, 225.52884316728247, 0.1258109429355459], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 22, 0, 0.0, 121.00000000000001, 107, 138, 118.5, 134.7, 137.54999999999998, 138.0, 0.10311307755040823, 0.07703271906842021, 0.03665347678549668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 12, 7.0588235294117645, 175.71764705882362, 103, 2134, 118.0, 268.0, 344.7999999999997, 1291.9399999999905, 0.7051835136390788, 1.6162224421023594, 0.33500672905812373], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 159.25, 113, 363, 120.5, 357.90000000000003, 363.0, 363.0, 0.06776406810288844, 0.052477447271084506, 0.024088008583448624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75083b87-5475-4918-97cb-4d717b12c964", 3, 0, 0.0, 705.3333333333334, 213, 1491, 412.0, 1491.0, 1491.0, 1491.0, 0.05113171529860922, 0.03287276618318789, 0.03278954399031906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 117.13333333333333, 104, 154, 115.0, 136.0, 154.0, 154.0, 0.11486859033265943, 0.09321855328753906, 0.04083219421981253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87ede41c-b9da-41f5-bd90-093c325990e4", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 1.4992297535211268, 2.80131308685446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9155156-20cb-47ab-b577-f35f9a8bbae5", 1, 0, 0.0, 1006.0, 1006, 1006, 1006.0, 1006.0, 1006.0, 1006.0, 0.9940357852882703, 0.17958654324055665, 0.6853410785288271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 289.41666666666663, 220, 659, 227.0, 625.1000000000001, 659.0, 659.0, 0.06812917291184085, 0.10558691153426898, 0.1532241066562202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 438.2105263157895, 220, 1356, 420.0, 1346.0, 1356.0, 1356.0, 0.0959024419790226, 12.21010706845163, 0.21310394089633453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db2e8d42-cf33-45f5-b0d6-f3de677a9f88", 3, 0, 0.0, 321.3333333333333, 209, 468, 287.0, 468.0, 468.0, 468.0, 0.07066804861961745, 0.03197545168661076, 0.045317726491095826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 138.36363636363637, 115, 339, 118.0, 296.40000000000015, 339.0, 339.0, 0.07123198963898332, 0.059058553909664885, 0.02532074631698235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07a71883-44f6-45d5-b4a4-b97684d5d720", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 130.21428571428572, 106, 328, 116.0, 225.0, 328.0, 328.0, 0.07317047675792071, 0.056807157248581014, 0.026009817910042126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c4a8da3-8067-44a6-b612-9494343383e1", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.7788681402439025, 1.4553163109756098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e917490-fde6-4ad5-a528-c6e4b58ca40d", 1, 0, 0.0, 660.0, 660, 660, 660.0, 660.0, 660.0, 660.0, 1.5151515151515151, 0.27373342803030304, 1.044625946969697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf68e59c-d109-4879-9cfe-830abf0c9525", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8db465af-a26e-44de-9d23-c9b1ea4eacb1", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.5641977694346291, 1.0542043948763251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 22, 0, 0.0, 111.27272727272727, 102, 123, 110.5, 118.1, 122.39999999999999, 123.0, 0.10254115629136604, 0.07620490228293901, 0.05147085384156459], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cfacf187-2a9b-437e-b9d0-569691153735", 3, 0, 0.0, 393.66666666666663, 224, 729, 228.0, 729.0, 729.0, 729.0, 0.08161932745674176, 0.03788709666449015, 0.052340519234954835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 22, 0, 0.0, 129.22727272727272, 100, 340, 111.5, 262.29999999999984, 337.74999999999994, 340.0, 0.10254880390804169, 0.03444088469319262, 0.05809338758320437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 22, 0, 0.0, 203.0, 101, 1248, 114.0, 343.8, 1112.549999999998, 1248.0, 0.10255071599045346, 4.22071670859981, 0.05988801578348747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9bbe0629-b199-49fc-815c-adbd2ce698c2", 1, 0, 0.0, 666.0, 666, 666, 666.0, 666.0, 666.0, 666.0, 1.5015015015015014, 0.2712673611111111, 1.0352149024024024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 22, 0, 0.0, 181.68181818181824, 103, 866, 111.5, 327.4, 785.2999999999988, 866.0, 0.10254593591811241, 1.3969243647978447, 0.059985366811473956], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 17.647058823529413, 0.4528301886792453], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.764705882352942, 0.3018867924528302], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 11.764705882352942, 0.3018867924528302], "isController": false}, {"data": ["401/Unauthorized", 20, 58.8235294117647, 1.509433962264151], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1325, 34, "401/Unauthorized", 20, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
