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

    var data = {"OkPercent": 68.73015873015873, "KoPercent": 31.26984126984127};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5128055878928988, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e1d086a3-6d1f-402b-a789-98247d06c946"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b1929a24-11ca-423c-8eb1-e1cdd2aa2728"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/863757e8-040d-400a-8730-6146d747f334"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=863757e8-040d-400a-8730-6146d747f334"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/29b1b6ff-e9a9-4103-b0b9-5e5d65d7a6d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62f0901d-6b4d-448d-8b7f-00f177e06999"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d9eb49e8-8c5f-4b31-93b3-ae93d42ebb6f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.59375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29b1b6ff-e9a9-4103-b0b9-5e5d65d7a6d1"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c672fd85-8d0a-4e9e-b9d5-ed260bbd4c25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1d086a3-6d1f-402b-a789-98247d06c946"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc90b567-56e2-4a78-a22e-a30378373c0e"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/62f0901d-6b4d-448d-8b7f-00f177e06999"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3668472-a112-4a0d-a207-cbc8c3631648"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f6fa142-8501-47f5-be4e-5440404cb986"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1929a24-11ca-423c-8eb1-e1cdd2aa2728"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9652caa2-bebe-41cc-a78c-6a59405f17f6"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9eb49e8-8c5f-4b31-93b3-ae93d42ebb6f"], "isController": false}, {"data": [0.9530386740331491, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0f6fa142-8501-47f5-be4e-5440404cb986"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9652caa2-bebe-41cc-a78c-6a59405f17f6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b9cd0daf-1407-4468-a2b1-f3a75a1eb812"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7074559-374f-479e-a7d5-ac295446ada9"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=faba4da2-a30e-4719-9762-bf4c70ed7dd3"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9f8141ac-95a3-421d-be33-c3ba7252a7a6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e3668472-a112-4a0d-a207-cbc8c3631648"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9cd0daf-1407-4468-a2b1-f3a75a1eb812"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/faba4da2-a30e-4719-9762-bf4c70ed7dd3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5b8c1dd4-c5ce-4ac6-8eb0-4ea1b1cedc48"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b8c1dd4-c5ce-4ac6-8eb0-4ea1b1cedc48"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5cd70410-92b1-4eb0-88ee-40e75f9c718e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac603b70-9d0d-42fb-92c5-f562ee7d40dc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c8f20122-61ff-4386-b24a-fb0b263606e4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a7074559-374f-479e-a7d5-ac295446ada9"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8f20122-61ff-4386-b24a-fb0b263606e4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 630, 197, 31.26984126984127, 280.59682539682547, 98, 2473, 107.0, 723.5999999999999, 1026.7999999999997, 1748.6299999999983, 2.458306343991197, 2.5309481685129978, 1.1840811738607897], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 57, 100.0, 570.8245614035086, 399, 935, 609.0, 724.2, 758.5999999999999, 935.0, 0.2355702867344999, 1.5179285906904276, 0.39545441689121613], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 107.00000000000001, 101, 124, 106.0, 116.2, 124.0, 124.0, 0.07768840733585734, 0.060314730304693934, 0.02761580104516804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 16, 100.0, 114.4375, 98, 309, 101.5, 166.90000000000015, 309.0, 309.0, 0.07795029694191241, 0.0387467784603842, 0.03912739514467088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1d086a3-6d1f-402b-a789-98247d06c946", 3, 0, 0.0, 373.0, 275, 490, 354.0, 490.0, 490.0, 490.0, 0.06920415224913495, 0.03131307670126874, 0.044378964821222604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1929a24-11ca-423c-8eb1-e1cdd2aa2728", 3, 0, 0.0, 321.3333333333333, 228, 438, 298.0, 438.0, 438.0, 438.0, 0.04808462894694662, 0.03091378325853502, 0.03083552051610835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/863757e8-040d-400a-8730-6146d747f334", 3, 0, 0.0, 393.0, 246, 675, 258.0, 675.0, 675.0, 675.0, 0.025903380391141043, 0.025979269200880714, 0.016611217243016882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 15, 100.0, 115.26666666666667, 99, 309, 101.0, 186.00000000000006, 309.0, 309.0, 0.08331481892912686, 0.04141332308098201, 0.04182013372028438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=863757e8-040d-400a-8730-6146d747f334", 1, 0, 0.0, 914.0, 914, 914, 914.0, 914.0, 914.0, 914.0, 1.0940919037199124, 0.19766308807439825, 0.7543250820568927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29b1b6ff-e9a9-4103-b0b9-5e5d65d7a6d1", 3, 0, 0.0, 293.3333333333333, 192, 379, 309.0, 379.0, 379.0, 379.0, 0.04656649695765553, 0.029937770667763562, 0.02986197884328821], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62f0901d-6b4d-448d-8b7f-00f177e06999", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9eb49e8-8c5f-4b31-93b3-ae93d42ebb6f", 3, 0, 0.0, 282.0, 176, 390, 280.0, 390.0, 390.0, 390.0, 0.03413396443240906, 0.028256077979041748, 0.021889293597606073], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 114.5, 111, 118, 114.5, 118.0, 118.0, 118.0, 0.018664028817260495, 0.005504430373840497, 0.011537431876294817], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, 100.0, 184.84210526315792, 100, 624, 103.0, 405.2, 410.2, 624.0, 0.2487583901404394, 0.12365041072410513, 0.1202494171089038], "isController": false}, {"data": ["deleteBook", 16, 2, 12.5, 612.625, 102, 1691, 502.0, 1262.6000000000004, 1691.0, 1691.0, 0.08464533604198408, 0.01650129414783308, 0.057026075392542744], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 612.625, 102, 1691, 502.0, 1262.6000000000004, 1691.0, 1691.0, 0.08600855785150623, 0.016767049180768486, 0.05794448617949986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29b1b6ff-e9a9-4103-b0b9-5e5d65d7a6d1", 1, 0, 0.0, 1086.0, 1086, 1086, 1086.0, 1086.0, 1086.0, 1086.0, 0.9208103130755064, 0.16635733195211785, 0.6348555478821363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, 20.833333333333332, 997.7083333333333, 487, 2173, 938.0, 1541.0, 2036.0, 2173.0, 0.09364976548537893, 0.029677098535161584, 0.042252140287348694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c672fd85-8d0a-4e9e-b9d5-ed260bbd4c25", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 1.1088053385416667, 2.071804470486111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1d086a3-6d1f-402b-a789-98247d06c946", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["deleteAccount", 16, 2, 12.5, 480.7499999999999, 99, 1179, 417.5, 862.6000000000004, 1179.0, 1179.0, 0.08597251028983482, 0.018932422920271245, 0.05760535998302043], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 159.8, 106, 367, 109.0, 367.0, 367.0, 367.0, 0.052427937799494596, 0.04126652135389906, 0.018636493514664093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc90b567-56e2-4a78-a22e-a30378373c0e", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1250.2727272727273, 787, 2473, 1096.5, 1845.8999999999999, 2384.6499999999987, 2473.0, 0.09797547050492995, 0.050709960319934445, 0.04506488926545118], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 246.81250000000003, 101, 396, 237.0, 375.0, 396.0, 396.0, 0.08397583595320447, 0.15315441614487932, 0.05339723260256861], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 5, 100.0, 102.0, 100, 104, 101.0, 104.0, 104.0, 104.0, 0.04711158850854133, 0.023417772022312048, 0.02364780907557641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62f0901d-6b4d-448d-8b7f-00f177e06999", 3, 0, 0.0, 315.0, 176, 396, 373.0, 396.0, 396.0, 396.0, 0.03132766650654748, 0.02546392684467743, 0.02008968197197218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3668472-a112-4a0d-a207-cbc8c3631648", 1, 0, 0.0, 627.0, 627, 627, 627.0, 627.0, 627.0, 627.0, 1.594896331738437, 0.2881404505582137, 1.099606259968102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f6fa142-8501-47f5-be4e-5440404cb986", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1929a24-11ca-423c-8eb1-e1cdd2aa2728", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["addBook", 62, 62, 100.0, 676.0806451612904, 414, 2447, 622.0, 841.2, 923.9499999999996, 2447.0, 0.2830572003816707, 0.9236899045595036, 0.5537154895634071], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 118.8, 101, 295, 105.0, 188.80000000000007, 295.0, 295.0, 0.0847505508785807, 0.06331462052940844, 0.030126172382620487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9652caa2-bebe-41cc-a78c-6a59405f17f6", 3, 0, 0.0, 411.6666666666667, 204, 540, 491.0, 540.0, 540.0, 540.0, 0.05736686107658476, 0.03688136413615068, 0.03678799359403385], "isController": false}, {"data": ["deleteBooks", 16, 2, 12.5, 536.0000000000001, 111, 1086, 529.0, 1043.3, 1086.0, 1086.0, 0.08598267449109005, 0.016762003315706885, 0.058514820591775756], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9eb49e8-8c5f-4b31-93b3-ae93d42ebb6f", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.3021138168896321, 1.1529316471571907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 5, 2.7624309392265194, 188.44751381215474, 100, 2114, 110.0, 350.80000000000024, 437.40000000000003, 1403.0600000000059, 0.7701373908085591, 1.6493565257442888, 0.371809521036239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 103.14285714285714, 100, 106, 104.0, 106.0, 106.0, 106.0, 0.04426681506589431, 0.03428084408911542, 0.01573546941795462], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f6fa142-8501-47f5-be4e-5440404cb986", 3, 0, 0.0, 417.33333333333337, 185, 727, 340.0, 727.0, 727.0, 727.0, 0.05894604472039926, 0.036668584459857746, 0.03780068623020395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9652caa2-bebe-41cc-a78c-6a59405f17f6", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.48696512803234504, 1.858364218328841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 22, 22, 100.0, 130.04545454545456, 100, 315, 102.5, 297.0, 312.29999999999995, 315.0, 0.10504602926009396, 0.05221526259119905, 0.05272818265594561], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9cd0daf-1407-4468-a2b1-f3a75a1eb812", 3, 0, 0.0, 380.66666666666663, 175, 726, 241.0, 726.0, 726.0, 726.0, 0.028555926782603727, 0.028639586724349637, 0.018312231693271272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 23, 0, 0.0, 159.13043478260872, 102, 320, 105.0, 315.8, 319.8, 320.0, 0.1219253604749788, 0.09894528765108143, 0.04334065548134012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7074559-374f-479e-a7d5-ac295446ada9", 1, 0, 0.0, 586.0, 586, 586, 586.0, 586.0, 586.0, 586.0, 1.7064846416382253, 0.30830044795221845, 1.1765411689419796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 613.5000000000001, 133, 1294, 636.0, 1062.5, 1265.7999999999997, 1294.0, 0.09751384031665403, 0.05989863824138221, 0.044090730533799624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=faba4da2-a30e-4719-9762-bf4c70ed7dd3", 1, 0, 0.0, 1025.0, 1025, 1025, 1025.0, 1025.0, 1025.0, 1025.0, 0.975609756097561, 0.17625762195121952, 0.6726371951219513], "isController": false}, {"data": ["login", 22, 3, 13.636363636363637, 2198.0909090909086, 1206, 3873, 2195.5, 2926.3, 3731.849999999998, 3873.0, 0.09583843382573959, 0.14140082845791604, 0.144140528004426], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9f8141ac-95a3-421d-be33-c3ba7252a7a6", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 1.5966796875, 2.9833984375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 7, 100.0, 100.57142857142858, 99, 102, 101.0, 102.0, 102.0, 102.0, 0.042478821273393697, 0.02111496096499745, 0.02132237708449644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3668472-a112-4a0d-a207-cbc8c3631648", 3, 0, 0.0, 314.3333333333333, 188, 389, 366.0, 389.0, 389.0, 389.0, 0.024542085586433136, 0.029439318159507195, 0.015738251499112395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 142.5625, 102, 312, 106.0, 308.5, 312.0, 312.0, 0.08128883447053026, 0.06580902712506795, 0.0288956403781963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, 100.0, 102.26666666666667, 99, 107, 102.0, 106.4, 107.0, 107.0, 0.0795844629905719, 0.03955907388886825, 0.03994766989956441], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9cd0daf-1407-4468-a2b1-f3a75a1eb812", 1, 0, 0.0, 739.0, 739, 739, 739.0, 739.0, 739.0, 739.0, 1.3531799729364007, 0.2444709912043302, 0.9329541610284168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/faba4da2-a30e-4719-9762-bf4c70ed7dd3", 3, 0, 0.0, 558.3333333333334, 295, 980, 400.0, 980.0, 980.0, 980.0, 0.03704115272067267, 0.030879684934128484, 0.023753603795483448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 22, 0, 0.0, 133.86363636363635, 102, 311, 104.5, 306.3, 310.7, 311.0, 0.10680233800027186, 0.08854998531467853, 0.03796489358603414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, 100.0, 114.9375, 99, 304, 102.5, 165.40000000000015, 304.0, 304.0, 0.0823464624474398, 0.04093198182201842, 0.04133406415818756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b8c1dd4-c5ce-4ac6-8eb0-4ea1b1cedc48", 3, 0, 0.0, 276.3333333333333, 189, 403, 237.0, 403.0, 403.0, 403.0, 0.019135093761959435, 0.02637927151103457, 0.01227087718458987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 116.875, 101, 295, 104.5, 169.0000000000001, 295.0, 295.0, 0.07839179237933788, 0.06086081537263048, 0.027865832447342764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b8c1dd4-c5ce-4ac6-8eb0-4ea1b1cedc48", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5cd70410-92b1-4eb0-88ee-40e75f9c718e", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 1.0574037665562914, 1.9757605546357617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac603b70-9d0d-42fb-92c5-f562ee7d40dc", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 1.6209946065989846, 3.0288309010152283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8f20122-61ff-4386-b24a-fb0b263606e4", 3, 0, 0.0, 550.6666666666667, 200, 1179, 273.0, 1179.0, 1179.0, 1179.0, 0.030810311184142958, 0.025685288718291052, 0.019757914398685426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7074559-374f-479e-a7d5-ac295446ada9", 3, 0, 0.0, 805.0, 195, 1788, 432.0, 1788.0, 1788.0, 1788.0, 0.034364261168384876, 0.02864807058991982, 0.0220369773768614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 23, 23, 100.0, 136.3913043478261, 99, 301, 102.0, 301.0, 301.0, 301.0, 0.12071843212999801, 0.06000554878336815, 0.0605949942527529], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, 100.0, 100.85714285714285, 99, 102, 101.0, 102.0, 102.0, 102.0, 0.05019864320238659, 0.0249522552636863, 0.028677935813863433], "isController": false}, {"data": ["register", 24, 5, 20.833333333333332, 997.7083333333333, 487, 2173, 938.0, 1541.0, 2036.0, 2173.0, 0.0958600443352705, 0.030377523815229762, 0.04324935594032712], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8f20122-61ff-4386-b24a-fb0b263606e4", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 0.5117962110481586, 1.953125], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 2.5380710659898478, 0.7936507936507936], "isController": false}, {"data": ["401/Unauthorized", 9, 4.568527918781726, 1.4285714285714286], "isController": false}, {"data": ["404/Not Found", 183, 92.89340101522842, 29.047619047619047], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 630, 197, "404/Not Found", 183, "401/Unauthorized", 9, "406/Not Acceptable", 5, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, "404/Not Found", 57, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 5, "404/Not Found", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 22, 22, "404/Not Found", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 23, 23, "404/Not Found", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
