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

    var data = {"OkPercent": 97.81078967943706, "KoPercent": 2.18921032056294};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7912751677852349, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0704787c-3a8b-4270-b847-6c28e69695bb"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c85c5aa5-b061-47c0-ace7-25ea9e49f431"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fb4bb739-b130-4e10-b68e-9d727aab8fc8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af20bd01-426e-4320-95f7-44c5cc35167a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d958fa95-d8a3-470a-b91d-660bbb68d823"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=94963713-29bc-4ec2-904b-ffe3d6dd9bcf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27666947-a6bd-466d-8ba1-75b4ef517176"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f4cf189-9af0-4115-b73a-06147f814619"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74809015-30a2-4d83-9ca4-7c827a6e8aa8"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1c999292-bf61-482c-999c-c87e7ceb47e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/496b0df4-a129-44bb-b045-67d2841ccc82"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cdb83c80-831d-4b52-adce-3b9a30a06110"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c85c5aa5-b061-47c0-ace7-25ea9e49f431"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f30eff6-ee3f-4085-af59-90d5971048d2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d958fa95-d8a3-470a-b91d-660bbb68d823"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/94963713-29bc-4ec2-904b-ffe3d6dd9bcf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb4bb739-b130-4e10-b68e-9d727aab8fc8"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2982456140350877, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59b72f06-fa49-4066-ab44-58049e5d315e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/af20bd01-426e-4320-95f7-44c5cc35167a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/27666947-a6bd-466d-8ba1-75b4ef517176"], "isController": false}, {"data": [0.6909090909090909, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9112426035502958, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cdb83c80-831d-4b52-adce-3b9a30a06110"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=496b0df4-a129-44bb-b045-67d2841ccc82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c999292-bf61-482c-999c-c87e7ceb47e5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/74809015-30a2-4d83-9ca4-7c827a6e8aa8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0f30eff6-ee3f-4085-af59-90d5971048d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f4cf189-9af0-4115-b73a-06147f814619"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1279, 28, 2.18921032056294, 319.70914777169645, 81, 2809, 97.0, 882.0, 1111.0, 1567.0000000000032, 5.044728081662275, 701.657094044095, 3.694287573905858], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1444.272727272727, 1085, 1854, 1411.0, 1732.8, 1830.2, 1854.0, 0.24197202803355933, 291.1739809128065, 1.1897745714345422], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0704787c-3a8b-4270-b847-6c28e69695bb", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 547.6428571428571, 86, 1528, 475.0, 1264.0, 1528.0, 1528.0, 0.09094097930443142, 0.017914154963428734, 0.06118978002026685], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 547.6428571428571, 86, 1528, 475.0, 1264.0, 1528.0, 1528.0, 0.08815121711644776, 0.017364609175282396, 0.05931268417307861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c85c5aa5-b061-47c0-ace7-25ea9e49f431", 3, 0, 0.0, 386.6666666666667, 189, 551, 420.0, 551.0, 551.0, 551.0, 0.03421962153098587, 0.028527490475538674, 0.02194422344272206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 104.70588235294116, 82, 254, 86.0, 246.79999999999998, 254.0, 254.0, 0.09634894186191496, 0.025780869209145213, 0.05494900590562338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 87.82352941176471, 84, 92, 88.0, 91.2, 92.0, 92.0, 0.09634511955295866, 0.07160023044902493, 0.04836073383810619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 85.47058823529412, 83, 89, 86.0, 88.2, 89.0, 89.0, 0.09634839579920994, 0.025968903555255805, 0.056736408854417573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 125.05882352941181, 83, 262, 87.0, 255.6, 262.0, 262.0, 0.09634839579920994, 0.025968903555255805, 0.056642318624144906], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 249.07142857142856, 83, 578, 225.5, 506.5, 578.0, 578.0, 0.09121590805436468, 0.18255270772794205, 0.05895693387498208], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fb4bb739-b130-4e10-b68e-9d727aab8fc8", 3, 0, 0.0, 404.0, 200, 784, 228.0, 784.0, 784.0, 784.0, 0.016640596398974937, 0.022940405517467077, 0.010671215789707237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af20bd01-426e-4320-95f7-44c5cc35167a", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 97.80000000000001, 83, 260, 87.0, 158.60000000000008, 260.0, 260.0, 0.08364980844193866, 0.06216553146905794, 0.0419882827530825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 119.73333333333333, 83, 258, 87.0, 257.4, 258.0, 258.0, 0.08357058092696489, 0.030729599028352712, 0.04719343873440712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 649.5, 493, 716, 669.5, 716.0, 716.0, 716.0, 0.03703589395389031, 10.88978252986019, 0.02112203327057807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 932.8333333333333, 782, 1005, 958.5, 1005.0, 1005.0, 1005.0, 0.03693444136657433, 33.2336752654663, 0.02102810480147738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 203.66666666666666, 85, 364, 212.0, 364.0, 364.0, 364.0, 0.03709061236601016, 0.06563299766329142, 0.020537477745632582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 109.00000000000001, 83, 260, 87.0, 257.6, 260.0, 260.0, 0.09228667934070396, 0.06858414353347238, 0.04632358709093929], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d958fa95-d8a3-470a-b91d-660bbb68d823", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 153.8, 82, 264, 87.0, 261.6, 264.0, 264.0, 0.09228667934070396, 0.03393458104923802, 0.052115537539144934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 170.6, 82, 819, 88.0, 484.20000000000016, 819.0, 819.0, 0.09228384048430559, 5.559025945986268, 0.05372409515694405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 138.8, 81, 514, 87.0, 359.80000000000007, 514.0, 514.0, 0.09228724713294285, 1.8322503360793916, 0.05381620264126101], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 117.66666666666667, 83, 253, 89.0, 253.0, 253.0, 253.0, 0.03712871287128713, 0.027592725092821783, 0.020848642481435645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 199.0, 82, 1120, 86.0, 605.8000000000003, 1120.0, 1120.0, 0.08356871855726965, 5.034041412826684, 0.048650487066347996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 619.0666666666667, 82, 1141, 885.0, 1135.0, 1141.0, 1141.0, 0.17799295147912142, 96.11421223657044, 0.09546262593001317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 165.9333333333333, 82, 784, 87.0, 469.0000000000002, 784.0, 784.0, 0.08365260745177427, 1.6608201336489825, 0.048781015946975405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 433.7333333333334, 83, 818, 506.0, 787.4, 818.0, 818.0, 0.17763251385533607, 31.357065222218274, 0.09544278234688076], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 506.07142857142856, 89, 869, 561.5, 846.0, 869.0, 869.0, 0.08796290478643864, 0.017327514168310736, 0.059750472015230156], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=94963713-29bc-4ec2-904b-ffe3d6dd9bcf", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27666947-a6bd-466d-8ba1-75b4ef517176", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 314.6, 168, 907, 203.0, 676.0000000000001, 907.0, 907.0, 0.09223674096848578, 7.489899596464258, 0.20586928324365872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f4cf189-9af0-4115-b73a-06147f814619", 3, 0, 0.0, 319.6666666666667, 202, 462, 295.0, 462.0, 462.0, 462.0, 0.03247913215758875, 0.026590174927192612, 0.020828089306787055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 575.05, 102, 1489, 413.0, 1283.5000000000002, 1479.1, 1489.0, 0.08837904002686722, 0.054287515797753406, 0.039960444855897975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 87.19999999999999, 84, 97, 86.0, 94.0, 97.0, 97.0, 0.1779950636035694, 0.13227953457257452, 0.08934517841038542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 129.53333333333333, 82, 259, 86.0, 258.4, 259.0, 259.0, 0.177999288002848, 0.20803666785332858, 0.09254572356710573], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74809015-30a2-4d83-9ca4-7c827a6e8aa8", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 0.8249500570776256, 3.148187785388128], "isController": false}, {"data": ["login", 20, 0, 0.0, 2685.95, 1620, 4109, 2829.5, 3645.9000000000005, 4086.5999999999995, 4109.0, 0.08831932736000282, 31.817891549937958, 0.1771906505160057], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 106.53333333333333, 86, 313, 92.0, 185.20000000000007, 313.0, 313.0, 0.08483683049601268, 0.0686813793761665, 0.030156842090379502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c999292-bf61-482c-999c-c87e7ceb47e5", 3, 0, 0.0, 416.0, 223, 702, 323.0, 702.0, 702.0, 702.0, 0.019495964335382577, 0.02304356982479627, 0.012502294837468645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/496b0df4-a129-44bb-b045-67d2841ccc82", 3, 0, 0.0, 294.3333333333333, 194, 454, 235.0, 454.0, 454.0, 454.0, 0.018999727670570055, 0.022457034886666626, 0.012184070153327804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 719.2666666666668, 170, 1230, 973.0, 1222.2, 1230.0, 1230.0, 0.17745179226310184, 127.48642771057612, 0.371851617029457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cdb83c80-831d-4b52-adce-3b9a30a06110", 1, 0, 0.0, 823.0, 823, 823, 823.0, 823.0, 823.0, 823.0, 1.215066828675577, 0.21951890947752128, 0.8377316221142164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 224.00000000000003, 168, 350, 177.0, 346.8, 350.0, 350.0, 0.09629982099562685, 0.1492459139844334, 0.21658055444621938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 664.7, 83, 1252, 926.0, 1238.1000000000001, 1252.0, 1252.0, 0.0615240743703011, 44.16909430410119, 0.0995440297038231], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1109.217391304348, 109, 2104, 1069.0, 1889.8000000000002, 2065.3999999999996, 2104.0, 0.09381628324359602, 0.0294131893457334, 0.0423272684165443], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c85c5aa5-b061-47c0-ace7-25ea9e49f431", 1, 0, 0.0, 869.0, 869, 869, 869.0, 869.0, 869.0, 869.0, 1.1507479861910241, 0.20789880609896433, 0.7933867951668585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f30eff6-ee3f-4085-af59-90d5971048d2", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.32435199730700176, 1.2377973518850987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 344.40000000000003, 172, 1212, 337.0, 790.2000000000003, 1212.0, 1212.0, 0.08352776741414739, 6.782704862290554, 0.1864311491054176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 100.46666666666665, 85, 251, 90.0, 158.00000000000006, 251.0, 251.0, 0.07949546875828077, 0.061717673498860565, 0.02825815491017012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d958fa95-d8a3-470a-b91d-660bbb68d823", 3, 0, 0.0, 918.0, 188, 2154, 412.0, 2154.0, 2154.0, 2154.0, 0.030598506792868508, 0.025508716112153728, 0.01962208931704133], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94963713-29bc-4ec2-904b-ffe3d6dd9bcf", 3, 0, 0.0, 536.6666666666666, 176, 999, 435.0, 999.0, 999.0, 999.0, 0.05423875901719369, 0.034870295917629406, 0.034782016687458193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb4bb739-b130-4e10-b68e-9d727aab8fc8", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 0.29472114600326266, 1.124719616639478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 384.764705882353, 170, 1121, 336.0, 987.3999999999999, 1121.0, 1121.0, 0.08668560152158726, 12.319259923270495, 0.19234861730091632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 131.125, 84, 269, 87.5, 269.0, 269.0, 269.0, 0.04151466245984754, 0.030852205206976537, 0.02083841455504066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 128.25, 83, 255, 86.5, 255.0, 255.0, 255.0, 0.041514231597519526, 0.011108300251680029, 0.023676085207960353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 87.25, 85, 91, 86.5, 91.0, 91.0, 91.0, 0.04151444702756559, 0.011189440800398538, 0.02440595420956493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 126.5, 82, 255, 87.0, 255.0, 255.0, 255.0, 0.04151530877010898, 0.011189673066943436, 0.02444700311364816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 94.5, 89, 100, 94.5, 100.0, 100.0, 100.0, 0.05514959327174962, 0.01626482145319178, 0.03409149662208741], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 993.2363636363636, 658, 1485, 879.0, 1370.8, 1475.2, 1485.0, 0.24211476239737637, 289.65342853762684, 0.47808207965575683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1109.217391304348, 109, 2104, 1069.0, 1889.8000000000002, 2065.3999999999996, 2104.0, 0.09463190247153842, 0.029668901488189528, 0.04269525287290113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 103.5, 82, 262, 86.0, 244.90000000000006, 262.0, 262.0, 0.06682660500798578, 0.01801185838105867, 0.039351994941226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 154.3, 84, 262, 90.0, 261.9, 262.0, 262.0, 0.06682526529630323, 0.01801149728689423, 0.03928594698083451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 108.86666666666667, 82, 249, 87.0, 248.4, 249.0, 249.0, 0.0761390400389832, 0.020521850635507186, 0.044761427835417845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 97.86666666666667, 82, 262, 86.0, 161.20000000000005, 262.0, 262.0, 0.0761390400389832, 0.020521850635507186, 0.04483578236670592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 88.86666666666666, 84, 109, 87.0, 101.2, 109.0, 109.0, 0.07613981300061927, 0.05658437274753053, 0.03821861707257647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 138.5, 84, 260, 89.0, 259.6, 260.0, 260.0, 0.06682526529630323, 0.017880979190612385, 0.038111284114297934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 98.86666666666667, 84, 267, 86.0, 164.40000000000006, 267.0, 267.0, 0.07606992347365699, 0.02035464749197462, 0.04338362823107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 106.0, 84, 270, 88.0, 252.40000000000006, 270.0, 270.0, 0.06682481873767918, 0.04966180376891977, 0.03354292659293662], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 599.4285714285714, 84, 1685, 460.0, 1550.0, 1685.0, 1685.0, 0.08798888826039683, 0.01698892596992037, 0.05987859890265287], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 127.0, 89, 273, 94.0, 271.4, 273.0, 273.0, 0.06447827404556035, 0.05075145398507973, 0.02292001147713278], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1424.25, 946, 1827, 1433.5, 1826.2, 1827.0, 1827.0, 0.08766969565465153, 0.04537591669625519, 0.0403246354036532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 264.2, 173, 525, 181.5, 507.70000000000005, 525.0, 525.0, 0.06678599097053402, 0.1035052418654663, 0.15020325898939438], "isController": false}, {"data": ["addBook", 57, 13, 22.80701754385965, 910.0701754385965, 432, 3179, 734.0, 1598.2, 1777.1999999999998, 3179.0, 0.27234937168522144, 75.38426514196809, 0.9913539526494338], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/59b72f06-fa49-4066-ab44-58049e5d315e", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.804157838983051, 3.3710716807909606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af20bd01-426e-4320-95f7-44c5cc35167a", 3, 0, 0.0, 395.0, 264, 471, 450.0, 471.0, 471.0, 471.0, 0.040385003701958674, 0.026436927879114225, 0.025897935316685737], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 157.7636363636364, 84, 379, 90.0, 342.8, 348.4, 379.0, 0.2429360813084979, 0.18054136511305363, 0.11743492211690085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27666947-a6bd-466d-8ba1-75b4ef517176", 3, 0, 0.0, 860.6666666666667, 319, 1685, 578.0, 1685.0, 1685.0, 1685.0, 0.020337604230221677, 0.024038359687478816, 0.013042018337739814], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 540.7636363636364, 400, 782, 508.0, 686.0, 749.8, 782.0, 0.24282560706401765, 71.39879104580574, 0.1221242066777042], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 112.63636363636364, 82, 355, 87.0, 254.39999999999998, 276.1999999999997, 355.0, 0.2432917820459512, 0.43051241119849953, 0.1183196361903161], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 832.3272727272727, 570, 1140, 792.0, 1073.8, 1110.6, 1140.0, 0.24256109231875173, 218.25689724533288, 0.12175429829281093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 110.94117647058822, 83, 260, 93.0, 253.6, 260.0, 260.0, 0.09086730166875127, 0.06788426345370578, 0.03230048614006393], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 13, 7.6923076923076925, 155.47928994082835, 84, 2809, 93.0, 264.0, 343.5, 1307.5000000000243, 0.6946528174542823, 1.5094216141840706, 0.3326711674380464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 91.87500000000001, 88, 101, 90.5, 101.0, 101.0, 101.0, 0.040398939527837394, 0.03128550688044439, 0.014360560535285949], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 92.47058823529412, 84, 114, 90.0, 105.19999999999999, 114.0, 114.0, 0.09132272915290111, 0.07411053508404378, 0.032462376378570315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 261.75, 170, 524, 178.0, 524.0, 524.0, 524.0, 0.04149571297415336, 0.06431025047849744, 0.09332483103464373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdb83c80-831d-4b52-adce-3b9a30a06110", 3, 0, 0.0, 383.3333333333333, 194, 521, 435.0, 521.0, 521.0, 521.0, 0.033330740942371144, 0.027287374176452942, 0.021374205617340873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=496b0df4-a129-44bb-b045-67d2841ccc82", 1, 0, 0.0, 730.0, 730, 730, 730.0, 730.0, 730.0, 730.0, 1.36986301369863, 0.2474850171232877, 0.9444563356164384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 223.0, 173, 372, 179.0, 364.2, 372.0, 372.0, 0.07603637580218377, 0.11784153163873597, 0.17100759128166915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c999292-bf61-482c-999c-c87e7ceb47e5", 1, 0, 0.0, 632.0, 632, 632, 632.0, 632.0, 632.0, 632.0, 1.5822784810126582, 0.28586085838607594, 1.0909068433544304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74809015-30a2-4d83-9ca4-7c827a6e8aa8", 3, 0, 0.0, 593.3333333333334, 211, 1111, 458.0, 1111.0, 1111.0, 1111.0, 0.09288500835965076, 0.04202804740231593, 0.059564930491052076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 92.6, 85, 106, 91.0, 102.4, 106.0, 106.0, 0.09549395841556424, 0.07917419013165433, 0.0339451180305326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f30eff6-ee3f-4085-af59-90d5971048d2", 3, 0, 0.0, 676.6666666666667, 298, 1415, 317.0, 1415.0, 1415.0, 1415.0, 0.018639097370644665, 0.022030782080993093, 0.011952806582086585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 89.59999999999998, 84, 96, 89.0, 95.4, 96.0, 96.0, 0.16586131782345723, 0.1287692848336411, 0.05895851532005706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f4cf189-9af0-4115-b73a-06147f814619", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 106.47058823529412, 83, 255, 87.0, 252.6, 255.0, 255.0, 0.08672318978094742, 0.06444955803056737, 0.043530976120514625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 147.23529411764707, 83, 302, 86.0, 266.79999999999995, 302.0, 302.0, 0.08672628673751014, 0.03853062394461761, 0.048604185053489714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 241.2941176470588, 83, 1034, 89.0, 897.9999999999999, 1034.0, 1034.0, 0.08672717162286946, 9.20147989396328, 0.05010925391675212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 209.88235294117646, 81, 711, 88.0, 673.4, 711.0, 711.0, 0.08672628673751014, 3.020673378601054, 0.050193436286788524], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.0, 0.547302580140735], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.142857142857143, 0.1563721657544957], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.142857142857143, 0.1563721657544957], "isController": false}, {"data": ["401/Unauthorized", 17, 60.714285714285715, 1.3291634089132134], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1279, 28, "401/Unauthorized", 17, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
