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

    var data = {"OkPercent": 69.32907348242811, "KoPercent": 30.670926517571885};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5228070175438596, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4bcfaa1d-55ab-4037-979f-1a17b0ff89ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43ed75e7-1c29-4393-98b3-a9ab80453970"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ffdfb0e2-a65f-407a-8818-f574e9b8c00e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d03a8567-f3fe-4395-bae2-8a30d4439efa"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64636a3c-b688-4ced-b030-392e16c05e7e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=066e4c70-7c85-4815-ba9c-c428e67fcdd2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.59375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c791624-22ca-444d-9e3c-a2b7ef10e18d"], "isController": false}, {"data": [0.36, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39ca1022-988c-4ce6-a85e-8bd891e4a4fb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1395f9b5-98ad-472d-b51a-34a962b2d676"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/64636a3c-b688-4ced-b030-392e16c05e7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1395f9b5-98ad-472d-b51a-34a962b2d676"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c791624-22ca-444d-9e3c-a2b7ef10e18d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39ca1022-988c-4ce6-a85e-8bd891e4a4fb"], "isController": false}, {"data": [0.43478260869565216, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5fd3fabc-d5aa-4beb-868f-b3fe2633a275"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa0a9b1d-3929-40a1-9d68-43b90c83268c"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8810c2d0-434d-4c81-944c-196d5dc5ceb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4bcfaa1d-55ab-4037-979f-1a17b0ff89ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc6168ba-223f-42df-879a-6fc4b1c1d68e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d03a8567-f3fe-4395-bae2-8a30d4439efa"], "isController": false}, {"data": [0.9714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5fd3fabc-d5aa-4beb-868f-b3fe2633a275"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fa0a9b1d-3929-40a1-9d68-43b90c83268c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/10d9cca7-cc89-4291-af23-4aaf5d363c1d"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5684d9be-7b55-4378-bd69-c3cad965a76e"], "isController": false}, {"data": [0.08695652173913043, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a4a8cd6-3b82-4e38-9486-86e37e6c5654"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5684d9be-7b55-4378-bd69-c3cad965a76e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8810c2d0-434d-4c81-944c-196d5dc5ceb4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4a4a8cd6-3b82-4e38-9486-86e37e6c5654"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2347349f-7080-4ef9-9c7b-1e8c129ec5a5"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/066e4c70-7c85-4815-ba9c-c428e67fcdd2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10d9cca7-cc89-4291-af23-4aaf5d363c1d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/17bf2a43-406a-43e7-af56-68efbbb1cbd8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30c77a36-612c-4f71-90d4-08614c70a46c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/30c77a36-612c-4f71-90d4-08614c70a46c"], "isController": false}, {"data": [0.36, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17bf2a43-406a-43e7-af56-68efbbb1cbd8"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 626, 192, 30.670926517571885, 295.83067092651766, 117, 1669, 132.5, 726.7000000000027, 999.65, 1444.340000000001, 2.4717388643426004, 2.6036075579042337, 1.189012261956938], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 59, 100.0, 687.3220338983053, 491, 977, 747.0, 902.0, 915.0, 977.0, 0.2618753828263012, 1.6850338912240677, 0.43961306941251144], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 16, 100.0, 141.6875, 120, 376, 126.5, 203.80000000000018, 376.0, 376.0, 0.07837451260849972, 0.03895764347434214, 0.03934033152418834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 176.80952380952385, 120, 384, 129.0, 377.4, 383.5, 384.0, 0.10542009909489314, 0.0818447058402735, 0.0374735508501378], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4bcfaa1d-55ab-4037-979f-1a17b0ff89ea", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43ed75e7-1c29-4393-98b3-a9ab80453970", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.8470449270557029, 1.5827047413793103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, 100.0, 126.125, 121, 137, 126.5, 131.4, 137.0, 137.0, 0.09436243431489923, 0.046904764713167686, 0.04736551878697091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffdfb0e2-a65f-407a-8818-f574e9b8c00e", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 1.5279231459330145, 2.854926734449761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d03a8567-f3fe-4395-bae2-8a30d4439efa", 3, 0, 0.0, 380.3333333333333, 276, 458, 407.0, 458.0, 458.0, 458.0, 0.07839448102853559, 0.03470589003867461, 0.0502725024824919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64636a3c-b688-4ced-b030-392e16c05e7e", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=066e4c70-7c85-4815-ba9c-c428e67fcdd2", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 131.0, 131, 131, 131.0, 131.0, 131.0, 131.0, 7.633587786259541, 2.2513120229007635, 4.71880963740458], "isController": false}, {"data": ["https://demoqa.com/books", 59, 59, 100.0, 212.13559322033893, 117, 516, 127.0, 505.0, 513.0, 516.0, 0.27332403722766035, 0.1358612645985148, 0.13212441252704288], "isController": false}, {"data": ["deleteBook", 16, 1, 6.25, 630.0625, 127, 1167, 602.5, 1025.6000000000001, 1167.0, 1167.0, 0.09123515290441407, 0.017134433928642705, 0.061738533950881275], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 1, 6.25, 630.0625, 127, 1167, 602.5, 1025.6000000000001, 1167.0, 1167.0, 0.08987350304446491, 0.01687870903734244, 0.06081710987878312], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c791624-22ca-444d-9e3c-a2b7ef10e18d", 3, 0, 0.0, 272.0, 213, 386, 217.0, 386.0, 386.0, 386.0, 0.024582305656388533, 0.02465432412999123, 0.015764043666368948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 5, 20.0, 937.1600000000001, 339, 1615, 949.0, 1486.4, 1588.3, 1615.0, 0.0997673425571567, 0.03164495396734814, 0.045012219005279686], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39ca1022-988c-4ce6-a85e-8bd891e4a4fb", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 0.8325532834101382, 3.1772033410138247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1395f9b5-98ad-472d-b51a-34a962b2d676", 3, 0, 0.0, 659.6666666666666, 376, 1115, 488.0, 1115.0, 1115.0, 1115.0, 0.07613633479684288, 0.034449708778519404, 0.0488244074055275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64636a3c-b688-4ced-b030-392e16c05e7e", 3, 0, 0.0, 390.33333333333337, 207, 670, 294.0, 670.0, 670.0, 670.0, 0.039336008181889696, 0.03270317867726116, 0.02522523962184984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 157.625, 122, 368, 129.5, 368.0, 368.0, 368.0, 0.04272682603772779, 0.03363068533828965, 0.01518805144309855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1395f9b5-98ad-472d-b51a-34a962b2d676", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 0.6895574904580153, 2.6315004770992365], "isController": false}, {"data": ["deleteAccount", 16, 1, 6.25, 545.4999999999999, 120, 1000, 482.0, 993.0, 1000.0, 1000.0, 0.08945694046081507, 0.017930700224201457, 0.06041510291741447], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c791624-22ca-444d-9e3c-a2b7ef10e18d", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39ca1022-988c-4ce6-a85e-8bd891e4a4fb", 3, 0, 0.0, 294.3333333333333, 200, 467, 216.0, 467.0, 467.0, 467.0, 0.08449990141678168, 0.038234004872827645, 0.05418776230177731], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1154.3478260869565, 677, 1669, 1081.0, 1628.4, 1661.1999999999998, 1669.0, 0.09818695650317827, 0.05081942084637156, 0.0451621645634736], "isController": false}, {"data": ["goToProfile", 16, 1, 6.25, 320.4375, 121, 1115, 226.0, 700.6000000000004, 1115.0, 1115.0, 0.09134036273541551, 0.16476833622102083, 0.05856509463717895], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, 100.0, 158.875, 122, 383, 128.5, 383.0, 383.0, 383.0, 0.04046412349650491, 0.02011351451144629, 0.020311093239456568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5fd3fabc-d5aa-4beb-868f-b3fe2633a275", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa0a9b1d-3929-40a1-9d68-43b90c83268c", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["addBook", 58, 58, 100.0, 761.8103448275864, 502, 1355, 740.5, 945.0, 1025.5499999999995, 1355.0, 0.27033703570779366, 0.930639979235319, 0.5285391283728041], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8810c2d0-434d-4c81-944c-196d5dc5ceb4", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4bcfaa1d-55ab-4037-979f-1a17b0ff89ea", 3, 0, 0.0, 318.3333333333333, 217, 427, 311.0, 427.0, 427.0, 427.0, 0.04612191559689446, 0.029651947690060725, 0.029576879468060573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc6168ba-223f-42df-879a-6fc4b1c1d68e", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.9150026862464185, 1.709683918338109], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 161.625, 123, 379, 130.0, 378.3, 379.0, 379.0, 0.09871607406173456, 0.0737478482980732, 0.03509047945163221], "isController": false}, {"data": ["deleteBooks", 16, 1, 6.25, 467.50000000000006, 131, 915, 453.0, 840.1000000000001, 915.0, 915.0, 0.08989673113011427, 0.01688307139205088, 0.061579041349687044], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d03a8567-f3fe-4395-bae2-8a30d4439efa", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 3, 1.7142857142857142, 197.50857142857132, 117, 873, 132.0, 366.80000000000007, 440.7999999999999, 841.8400000000004, 0.7336664877917896, 1.6749335704298867, 0.3504895127616045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 172.8181818181818, 122, 382, 128.0, 378.2, 382.0, 382.0, 0.07629563866385528, 0.05908441548870825, 0.02712071530629231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5fd3fabc-d5aa-4beb-868f-b3fe2633a275", 3, 0, 0.0, 290.0, 214, 425, 231.0, 425.0, 425.0, 425.0, 0.021838988418056475, 0.025812944969389018, 0.014004820046735434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa0a9b1d-3929-40a1-9d68-43b90c83268c", 3, 0, 0.0, 603.6666666666666, 293, 912, 606.0, 912.0, 912.0, 912.0, 0.033576952779612076, 0.027991723980659678, 0.021532095369738213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, 100.0, 179.71428571428572, 121, 373, 129.0, 372.5, 373.0, 373.0, 0.0676181506435799, 0.033610975271076336, 0.03394114202226569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 147.05882352941177, 123, 381, 130.0, 205.79999999999984, 381.0, 381.0, 0.088251631357362, 0.0716182672441092, 0.031370697084062274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10d9cca7-cc89-4291-af23-4aaf5d363c1d", 3, 0, 0.0, 311.6666666666667, 215, 472, 248.0, 472.0, 472.0, 472.0, 0.021600915878833265, 0.0255315512877746, 0.01385214983115284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 482.60869565217394, 145, 1092, 367.0, 984.2000000000003, 1088.2, 1092.0, 0.09958391243543281, 0.06117019621278051, 0.04502671040781777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5684d9be-7b55-4378-bd69-c3cad965a76e", 3, 0, 0.0, 587.0, 221, 1000, 540.0, 1000.0, 1000.0, 1000.0, 0.03669275929549902, 0.029824811185176124, 0.0235301874388454], "isController": false}, {"data": ["login", 23, 4, 17.391304347826086, 1982.9565217391303, 1175, 2885, 1998.0, 2705.0000000000005, 2871.7999999999997, 2885.0, 0.0995201398474313, 0.1474970279175627, 0.14954641938435975], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 11, 100.0, 170.00000000000003, 120, 374, 127.0, 373.4, 374.0, 374.0, 0.0771112715648681, 0.03832972385402135, 0.038706243734709184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 211.00000000000003, 119, 413, 134.0, 395.5, 413.0, 413.0, 0.07659863750173544, 0.062011982899354175, 0.02722842192444502], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a4a8cd6-3b82-4e38-9486-86e37e6c5654", 1, 0, 0.0, 915.0, 915, 915, 915.0, 915.0, 915.0, 915.0, 1.092896174863388, 0.19744706284153005, 0.7535006830601093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5684d9be-7b55-4378-bd69-c3cad965a76e", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 21, 100.0, 161.23809523809524, 118, 383, 126.0, 377.6, 382.6, 383.0, 0.10563008344776592, 0.05250557858878209, 0.05302135048061688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8810c2d0-434d-4c81-944c-196d5dc5ceb4", 3, 0, 0.0, 431.0, 210, 754, 329.0, 754.0, 754.0, 754.0, 0.04571916242494438, 0.02939301620744308, 0.029318603508183733], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a4a8cd6-3b82-4e38-9486-86e37e6c5654", 3, 0, 0.0, 578.6666666666666, 223, 990, 523.0, 990.0, 990.0, 990.0, 0.04945924558164073, 0.02237902062450541, 0.03171702923041414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2347349f-7080-4ef9-9c7b-1e8c129ec5a5", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 1.4852834302325582, 2.7752543604651163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 160.64285714285717, 122, 583, 129.0, 362.5, 583.0, 583.0, 0.06781861427194295, 0.056228519059452704, 0.024107398041979724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 14, 100.0, 144.57142857142856, 118, 392, 127.0, 260.5, 392.0, 392.0, 0.07864682519619573, 0.039093001977405895, 0.03947701967855919], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/066e4c70-7c85-4815-ba9c-c428e67fcdd2", 3, 0, 0.0, 566.0, 381, 832, 485.0, 832.0, 832.0, 832.0, 0.047838497233340244, 0.030755544282502274, 0.030677682145078218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10d9cca7-cc89-4291-af23-4aaf5d363c1d", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 132.2857142857143, 119, 143, 132.5, 140.5, 143.0, 143.0, 0.07805661334656579, 0.060600593369648244, 0.027746686775537058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17bf2a43-406a-43e7-af56-68efbbb1cbd8", 3, 0, 0.0, 361.0, 261, 501, 321.0, 501.0, 501.0, 501.0, 0.021319234213107066, 0.02557336525888657, 0.013671514127545872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, 100.0, 168.6470588235294, 122, 378, 127.0, 369.2, 378.0, 378.0, 0.09301562115284656, 0.04623530387382705, 0.04668948171148743], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 6, 100.0, 165.16666666666666, 120, 376, 123.5, 376.0, 376.0, 376.0, 0.04937458854509546, 0.02454264215766952, 0.0280062566861422], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30c77a36-612c-4f71-90d4-08614c70a46c", 1, 0, 0.0, 808.0, 808, 808, 808.0, 808.0, 808.0, 808.0, 1.2376237623762376, 0.22359413675742573, 0.8532835705445544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30c77a36-612c-4f71-90d4-08614c70a46c", 3, 0, 0.0, 513.3333333333334, 248, 813, 479.0, 813.0, 813.0, 813.0, 0.02237303303751212, 0.026444167629950034, 0.01434729006637333], "isController": false}, {"data": ["register", 25, 5, 20.0, 937.1600000000001, 339, 1615, 949.0, 1486.4, 1588.3, 1615.0, 0.10046010729139458, 0.03186469028148922, 0.04532477496935967], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17bf2a43-406a-43e7-af56-68efbbb1cbd8", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 2.6041666666666665, 0.7987220447284346], "isController": false}, {"data": ["401/Unauthorized", 5, 2.6041666666666665, 0.7987220447284346], "isController": false}, {"data": ["404/Not Found", 182, 94.79166666666667, 29.073482428115017], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 626, 192, "404/Not Found", 182, "406/Not Acceptable", 5, "401/Unauthorized", 5, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 59, 59, "404/Not Found", 59, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 11, "404/Not Found", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 21, "404/Not Found", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
