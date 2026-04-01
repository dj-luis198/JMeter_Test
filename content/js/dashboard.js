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

    var data = {"OkPercent": 97.53914988814317, "KoPercent": 2.460850111856823};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8047375160051217, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3474576271186441, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c7fa321f-9ff0-4890-a50e-10e5c7683928"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/83cd8506-c360-483a-bb26-af3e79eb878a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f3a19f53-e12b-4a79-85a4-25bcaa415d97"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acc818eb-dd8f-4d52-8dac-d2ef065c89d3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/72df203b-0903-4891-817b-2461b97ac632"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cbc8204e-f62e-47aa-bff6-ab9a682a2d35"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9fb9c74-5c88-4c3a-9aa1-02a2541eac4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dfe85af1-2de5-4771-8d89-1f3f31f61615"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e6ccb57-8b22-4917-926f-44fc12033f57"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3444afb-60cc-4382-9933-59613c1c9352"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=167e368f-5267-4cde-909c-314bda8ab6fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd313437-b4f4-4386-806a-a2bc67831caa"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d29e4417-fa70-4014-a2b8-0573042d0bff"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3a19f53-e12b-4a79-85a4-25bcaa415d97"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dfe85af1-2de5-4771-8d89-1f3f31f61615"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83cd8506-c360-483a-bb26-af3e79eb878a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e6ccb57-8b22-4917-926f-44fc12033f57"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cbc8204e-f62e-47aa-bff6-ab9a682a2d35"], "isController": false}, {"data": [0.3508771929824561, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.847457627118644, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9248554913294798, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3444afb-60cc-4382-9933-59613c1c9352"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/167e368f-5267-4cde-909c-314bda8ab6fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2f34d471-a8e6-498f-9819-efe23d4c339c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dd313437-b4f4-4386-806a-a2bc67831caa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/acc818eb-dd8f-4d52-8dac-d2ef065c89d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb710a5e-e02e-4cbf-abee-3b0aec58ec31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72df203b-0903-4891-817b-2461b97ac632"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7fa321f-9ff0-4890-a50e-10e5c7683928"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1341, 33, 2.460850111856823, 298.34153616703975, 78, 2460, 92.0, 807.0, 1034.0, 1442.699999999999, 5.210417727076687, 747.1021210062206, 3.815134926652005], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1362.3559322033896, 987, 1805, 1375.0, 1685.0, 1778.0, 1805.0, 0.2526636746719655, 304.03957257817586, 1.2423453144270957], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c7fa321f-9ff0-4890-a50e-10e5c7683928", 3, 0, 0.0, 451.33333333333337, 260, 782, 312.0, 782.0, 782.0, 782.0, 0.018669720203126555, 0.025737716490963857, 0.011972444270885195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83cd8506-c360-483a-bb26-af3e79eb878a", 3, 0, 0.0, 518.6666666666666, 159, 891, 506.0, 891.0, 891.0, 891.0, 0.06786409084739628, 0.03070673381441433, 0.043519615549925346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3a19f53-e12b-4a79-85a4-25bcaa415d97", 3, 0, 0.0, 323.3333333333333, 183, 499, 288.0, 499.0, 499.0, 499.0, 0.08261504144521246, 0.03738115482058767, 0.05297904676011345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acc818eb-dd8f-4d52-8dac-d2ef065c89d3", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 0.2523241096368715, 0.9629233589385475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72df203b-0903-4891-817b-2461b97ac632", 3, 0, 0.0, 533.6666666666667, 163, 1262, 176.0, 1262.0, 1262.0, 1262.0, 0.04077527387392285, 0.026214572233397668, 0.026148206227743498], "isController": false}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 384.1333333333333, 85, 691, 412.0, 660.4, 691.0, 691.0, 0.07316609190636691, 0.015447762763824733, 0.04879644827401189], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 384.1333333333333, 85, 691, 412.0, 660.4, 691.0, 691.0, 0.07400500273818511, 0.015624884367183222, 0.04935594062825314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 106.9230769230769, 80, 243, 83.0, 241.8, 243.0, 243.0, 0.09165385862744822, 0.035113782977763366, 0.05167922647668467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 82.69230769230771, 78, 86, 83.0, 85.6, 86.0, 86.0, 0.0916532124450962, 0.06811337370187324, 0.04600561640310493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 174.3846153846154, 78, 641, 83.0, 481.79999999999984, 641.0, 641.0, 0.0916532124450962, 2.0958098839176813, 0.05336568882676838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 165.15384615384616, 79, 993, 81.0, 700.1999999999998, 993.0, 993.0, 0.09165579722917475, 6.366807436898508, 0.053277686219903406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cbc8204e-f62e-47aa-bff6-ab9a682a2d35", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 161.13333333333335, 81, 312, 163.0, 268.20000000000005, 312.0, 312.0, 0.07372637684008748, 0.12496044887075765, 0.04764375107517633], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a9fb9c74-5c88-4c3a-9aa1-02a2541eac4b", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.804157838983051, 3.3710716807909606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 92.88235294117646, 81, 241, 83.0, 119.39999999999989, 241.0, 241.0, 0.09494766707996827, 0.07056169399204675, 0.0476592782022497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 125.29411764705883, 80, 330, 82.0, 263.59999999999997, 330.0, 330.0, 0.094948727687049, 0.042183677615558184, 0.05321230395880342], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 591.1428571428572, 408, 761, 639.0, 761.0, 761.0, 761.0, 0.039688164422395464, 11.669638111268604, 0.022634656272147412], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 806.5714285714286, 553, 969, 798.0, 969.0, 969.0, 969.0, 0.039641639578212956, 35.66961697504559, 0.02256941003329898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 162.14285714285717, 78, 320, 88.0, 320.0, 320.0, 320.0, 0.03981480428179781, 0.07045354038927504, 0.02204589260525328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 94.33333333333334, 81, 244, 83.0, 152.80000000000007, 244.0, 244.0, 0.08259002312520647, 0.061377937107697386, 0.04145632020151965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 125.33333333333331, 81, 244, 83.0, 243.4, 244.0, 244.0, 0.08259093261681111, 0.03036937418097325, 0.04664021806759242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 151.46666666666667, 80, 803, 82.0, 467.6000000000002, 803.0, 803.0, 0.08259138737012504, 4.975168598272739, 0.04808152251716524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 151.33333333333334, 80, 484, 83.0, 339.4000000000001, 484.0, 484.0, 0.08259138737012504, 1.6397509078169996, 0.048162178168893885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dfe85af1-2de5-4771-8d89-1f3f31f61615", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 105.28571428571429, 78, 240, 83.0, 240.0, 240.0, 240.0, 0.039814124913973056, 0.029588426815950676, 0.02235656428274854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 174.9411764705882, 81, 941, 83.0, 692.9999999999998, 941.0, 941.0, 0.094948727687049, 10.073761111095596, 0.05485950729988159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 596.9411764705883, 81, 1281, 795.0, 1153.8, 1281.0, 1281.0, 0.08414758496431152, 44.54824773482126, 0.04521579215051528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 171.0, 80, 716, 82.0, 661.5999999999999, 716.0, 716.0, 0.09494925799947498, 3.3070791653401694, 0.05495253758873567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 409.6470588235294, 80, 736, 483.0, 712.0, 736.0, 736.0, 0.08414841800974142, 14.563709014770522, 0.045298415967904807], "isController": false}, {"data": ["deleteBooks", 15, 4, 26.666666666666668, 346.79999999999995, 87, 716, 378.0, 630.2, 716.0, 716.0, 0.07414803903152775, 0.01565508402208623, 0.049712012105903175], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 289.8666666666666, 165, 884, 176.0, 647.0000000000001, 884.0, 884.0, 0.08255184255712587, 6.703456841208779, 0.18425291786366838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 535.1818181818181, 138, 1602, 552.5, 822.8, 1486.6499999999983, 1602.0, 0.09243891678396605, 0.05678132681358852, 0.04179611178806277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 96.88235294117646, 81, 244, 83.0, 144.7999999999999, 244.0, 244.0, 0.08414591892293224, 0.06253422294956194, 0.042237306959362474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 139.2941176470588, 81, 247, 83.0, 247.0, 247.0, 247.0, 0.08414716844778174, 0.09686011956322671, 0.043833095328842185], "isController": false}, {"data": ["login", 22, 0, 0.0, 2416.8636363636365, 1207, 3622, 2428.5, 3342.0, 3585.8499999999995, 3622.0, 0.08900252443523853, 33.99946607967142, 0.1812446649054955], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 87.64705882352942, 83, 96, 87.0, 94.4, 96.0, 96.0, 0.09449274073415301, 0.07649851764512974, 0.033589216432843454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e6ccb57-8b22-4917-926f-44fc12033f57", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3444afb-60cc-4382-9933-59613c1c9352", 3, 0, 0.0, 417.3333333333333, 159, 630, 463.0, 630.0, 630.0, 630.0, 0.030078806472959154, 0.0301669279762979, 0.019288817953036958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=167e368f-5267-4cde-909c-314bda8ab6fa", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.48696512803234504, 1.858364218328841], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd313437-b4f4-4386-806a-a2bc67831caa", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 0.9508634868421052, 3.6287006578947367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 704.5294117647059, 164, 1366, 878.0, 1239.6, 1366.0, 1366.0, 0.08411136344520145, 59.24569520670367, 0.1765092037004052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d29e4417-fa70-4014-a2b8-0573042d0bff", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.2329572876447876, 2.303782577220077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 299.2307692307692, 160, 1075, 174.0, 782.9999999999998, 1075.0, 1075.0, 0.09159961105395921, 8.560655236679303, 0.20420685526204535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, 50.0, 498.1428571428571, 81, 1172, 362.5, 1115.5, 1172.0, 1172.0, 0.07924692776642533, 47.41404052135987, 0.11550394501112286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3a19f53-e12b-4a79-85a4-25bcaa415d97", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 0.7720686431623931, 2.946380876068376], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 909.1249999999999, 184, 1682, 915.5, 1545.5, 1666.25, 1682.0, 0.0989788680116795, 0.03107588482983883, 0.04465648146620697], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dfe85af1-2de5-4771-8d89-1f3f31f61615", 3, 0, 0.0, 285.3333333333333, 178, 415, 263.0, 415.0, 415.0, 415.0, 0.0166725020423815, 0.022984390022619025, 0.010691676114417823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 316.7058823529412, 166, 1025, 170.0, 843.3999999999999, 1025.0, 1025.0, 0.09490367277213628, 13.487165019692513, 0.2105838791457553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 107.6, 84, 254, 88.0, 233.10000000000025, 253.54999999999998, 254.0, 0.1151138764022309, 0.08937063646462262, 0.040919385752355514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83cd8506-c360-483a-bb26-af3e79eb878a", 1, 0, 0.0, 542.0, 542, 542, 542.0, 542.0, 542.0, 542.0, 1.8450184501845017, 0.33332852859778594, 1.2720537361623616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 282.99999999999994, 167, 393, 324.0, 368.59999999999997, 393.0, 393.0, 0.10512781115810414, 0.1629275745194446, 0.23643491122765023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 98.09090909090908, 81, 245, 84.0, 213.40000000000012, 245.0, 245.0, 0.0507050303999705, 0.03768215638122808, 0.02545154846248519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 111.63636363636363, 78, 246, 83.0, 245.8, 246.0, 246.0, 0.05066766159529436, 0.013557557887803372, 0.028896400753566313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 97.0909090909091, 81, 244, 82.0, 212.2000000000001, 244.0, 244.0, 0.050705264128330416, 0.013666653222089056, 0.02980914941919425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 96.54545454545455, 78, 246, 82.0, 213.6000000000001, 246.0, 246.0, 0.05066766159529436, 0.013656518164356682, 0.029836523380822752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 87.75, 87, 90, 87.0, 90.0, 90.0, 90.0, 0.02854227467658035, 0.008417741164382096, 0.017643808467065782], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 951.3050847457625, 625, 1462, 890.0, 1335.0, 1432.0, 1462.0, 0.2649220724988438, 316.93890052288435, 0.5231176080006466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 909.1249999999999, 184, 1682, 915.5, 1545.5, 1666.25, 1682.0, 0.09790883056060964, 0.03073993068870703, 0.044173710663087555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 82.3, 81, 85, 82.0, 84.8, 85.0, 85.0, 0.06104894293755303, 0.016454597901137343, 0.03594971932748484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 98.9, 81, 244, 83.0, 228.00000000000006, 244.0, 244.0, 0.061048197551967276, 0.01645439699642868, 0.03588966301394951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 130.29999999999998, 81, 244, 83.5, 242.0, 243.9, 244.0, 0.12108663143045692, 0.032636631127740345, 0.07118569543079596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 89.74999999999999, 78, 243, 82.0, 83.9, 235.0499999999999, 243.0, 0.12108663143045692, 0.032636631127740345, 0.07130394409430227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 98.3, 80, 244, 82.5, 227.90000000000006, 244.0, 244.0, 0.06104857024248492, 0.01633526195941491, 0.034816762716417184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 115.94999999999999, 81, 245, 84.0, 243.60000000000002, 244.95, 245.0, 0.12108589833627975, 0.08998668811905165, 0.06077944506332793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 99.6, 82, 242, 84.0, 226.40000000000006, 242.0, 242.0, 0.06104745218458307, 0.04536827257076926, 0.030642959397339554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 113.74999999999999, 79, 246, 82.0, 241.9, 245.8, 246.0, 0.12108809764544194, 0.03240052612778427, 0.06905805568841611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 95.3, 83, 179, 85.5, 170.40000000000003, 179.0, 179.0, 0.05856275291788917, 0.04609529184747917, 0.020817228576280912], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 471.7142857142857, 82, 1262, 446.0, 1022.0, 1262.0, 1262.0, 0.07777604942112398, 0.015499872572276172, 0.05292308608419813], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1340.5000000000002, 637, 2306, 1191.0, 2160.1, 2288.2999999999997, 2306.0, 0.08987515523890449, 0.04651741433263612, 0.041339060661644556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 199.70000000000002, 165, 487, 168.0, 455.3000000000001, 487.0, 487.0, 0.061016163181626816, 0.09456313571215015, 0.13722678106180328], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e6ccb57-8b22-4917-926f-44fc12033f57", 3, 0, 0.0, 264.0, 174, 379, 239.0, 379.0, 379.0, 379.0, 0.024035187514521262, 0.02410560310294271, 0.015413189910028283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cbc8204e-f62e-47aa-bff6-ab9a682a2d35", 3, 0, 0.0, 272.3333333333333, 180, 394, 243.0, 394.0, 394.0, 394.0, 0.027213846405050892, 0.02729357447069069, 0.01745158770115568], "isController": false}, {"data": ["addBook", 57, 11, 19.29824561403509, 879.5964912280706, 420, 3672, 705.0, 1554.4, 1713.6999999999996, 3672.0, 0.2666180205716852, 79.38639265818166, 0.9696238902609583], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 162.271186440678, 81, 418, 85.0, 330.0, 334.0, 418.0, 0.26607498804917423, 0.1977373690482633, 0.128620233480802], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 508.96610169491527, 394, 730, 482.0, 649.0, 723.0, 730.0, 0.26593586888910925, 78.19397535529482, 0.1337470434354407], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 126.23728813559319, 80, 341, 85.0, 244.0, 248.0, 341.0, 0.266234674584516, 0.4711105765108818, 0.1294774101006728], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 787.406779661017, 540, 1216, 793.0, 1050.0, 1082.0, 1216.0, 0.2653653270964985, 238.7761877839184, 0.13320095520273462], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 85.76923076923077, 82, 91, 86.0, 90.6, 91.0, 91.0, 0.10507937534352874, 0.0785016817751948, 0.037352434204144976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 11, 6.358381502890174, 143.79190751445088, 81, 2460, 87.0, 244.6, 302.29999999999995, 1221.2399999999848, 0.7326472705712955, 1.633807714500487, 0.3487758663130479], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 103.81818181818181, 84, 245, 86.0, 219.8000000000001, 245.0, 245.0, 0.052195533960312415, 0.04042095549856225, 0.0185538812124548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 84.84615384615385, 82, 91, 84.0, 89.4, 91.0, 91.0, 0.09898879142300195, 0.08033172428956506, 0.03518742195114522], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3444afb-60cc-4382-9933-59613c1c9352", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/167e368f-5267-4cde-909c-314bda8ab6fa", 3, 0, 0.0, 601.6666666666666, 159, 1243, 403.0, 1243.0, 1243.0, 1243.0, 0.023248965421038766, 0.02331707762442071, 0.014909004518048946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 211.72727272727272, 164, 491, 168.0, 458.60000000000014, 491.0, 491.0, 0.050647598613176664, 0.07849388574131969, 0.1139076363341268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 247.45000000000002, 164, 487, 168.5, 485.9, 486.95, 487.0, 0.12102508244833743, 0.1875652400835073, 0.27218824695168076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f34d471-a8e6-498f-9819-efe23d4c339c", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 1.5063015919811322, 2.8145268278301887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd313437-b4f4-4386-806a-a2bc67831caa", 3, 0, 0.0, 324.33333333333337, 177, 601, 195.0, 601.0, 601.0, 601.0, 0.06259911526583758, 0.028324469472498122, 0.040143312849511725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acc818eb-dd8f-4d52-8dac-d2ef065c89d3", 3, 0, 0.0, 379.3333333333333, 176, 485, 477.0, 485.0, 485.0, 485.0, 0.019008997592193638, 0.022467991620200228, 0.012190014731973134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb710a5e-e02e-4cbf-abee-3b0aec58ec31", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 1.6719159031413613, 3.1239774214659684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 96.73333333333333, 84, 243, 85.0, 154.80000000000007, 243.0, 243.0, 0.08200754469411185, 0.06799258344267672, 0.029151119402985076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72df203b-0903-4891-817b-2461b97ac632", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 91.41176470588233, 83, 119, 87.0, 115.0, 119.0, 119.0, 0.0843090870317746, 0.06545480877955157, 0.029969245780826128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7fa321f-9ff0-4890-a50e-10e5c7683928", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 88.69230769230771, 80, 147, 84.0, 123.39999999999998, 147.0, 147.0, 0.10533394913180517, 0.07828040555596069, 0.05287270493530065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 156.07692307692307, 80, 244, 86.0, 243.6, 244.0, 244.0, 0.10533224219933722, 0.02818460386974453, 0.060072294379309506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 119.07692307692307, 79, 242, 82.0, 242.0, 242.0, 242.0, 0.10533138875384865, 0.02839010087506077, 0.06192333596661805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 156.53846153846152, 80, 245, 88.0, 244.2, 245.0, 245.0, 0.10519842040525669, 0.02835426174985434, 0.06194789795348612], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 21.21212121212121, 0.5219985085756897], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 12.121212121212121, 0.29828486204325133], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.090909090909092, 0.22371364653243847], "isController": false}, {"data": ["401/Unauthorized", 19, 57.57575757575758, 1.4168530947054436], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1341, 33, "401/Unauthorized", 19, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
