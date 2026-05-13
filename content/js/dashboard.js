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

    var data = {"OkPercent": 96.83357879234168, "KoPercent": 3.166421207658321};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7894570707070707, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4051724137931034, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/06aa62af-a94f-4ffd-9ffe-dc4b2cde0eed"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca44c3b8-ff49-4c8c-9b3d-74550c8f7c1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28b7829f-20cd-4d94-b031-8ab161b0083c"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85176816-dd30-4a78-9653-f7969a959fa2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3539234f-8da1-49c6-87e7-821fb765bb82"], "isController": false}, {"data": [0.71875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78cd57ef-c30a-40b6-af1f-769c2184f055"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2eabe93d-cf47-42da-9825-6e33268559a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aaeb0c55-d374-4196-a24e-047574bca9ed"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d68fe758-c458-47a4-8895-f952939f2e93"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=06aa62af-a94f-4ffd-9ffe-dc4b2cde0eed"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/015c5e39-76eb-4e17-8fdf-010e25f84c77"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b6361771-122a-4419-8e36-ca009a799312"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.29411764705882354, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/86686b71-9ee3-46cc-83fa-d3f69b25d77b"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "register"], "isController": true}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/85176816-dd30-4a78-9653-f7969a959fa2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3539234f-8da1-49c6-87e7-821fb765bb82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/28b7829f-20cd-4d94-b031-8ab161b0083c"], "isController": false}, {"data": [0.28448275862068967, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8189655172413793, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8764367816091954, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d68fe758-c458-47a4-8895-f952939f2e93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aaeb0c55-d374-4196-a24e-047574bca9ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2eabe93d-cf47-42da-9825-6e33268559a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f37ef50f-25b4-4400-ab1b-3d01503b7343"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/78cd57ef-c30a-40b6-af1f-769c2184f055"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b0ce6b2-1c8a-4106-9a1a-6f8b7e9c2b85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ca44c3b8-ff49-4c8c-9b3d-74550c8f7c1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6361771-122a-4419-8e36-ca009a799312"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86686b71-9ee3-46cc-83fa-d3f69b25d77b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=015c5e39-76eb-4e17-8fdf-010e25f84c77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1358, 43, 3.166421207658321, 299.57437407952847, 77, 3031, 93.0, 842.2000000000003, 1016.0999999999999, 1629.2800000000007, 5.238187078109933, 760.1958586969624, 3.8382880303760847], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1292.4999999999995, 953, 1748, 1292.0, 1570.8, 1613.5499999999997, 1748.0, 0.2548823146829791, 306.7088473894887, 1.2532543500281248], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/06aa62af-a94f-4ffd-9ffe-dc4b2cde0eed", 3, 0, 0.0, 270.0, 166, 446, 198.0, 446.0, 446.0, 446.0, 0.05323018506361007, 0.03422188004577796, 0.03413524237477599], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 582.1249999999999, 81, 1702, 470.5, 1654.4, 1702.0, 1702.0, 0.09226315759123961, 0.019304083509690515, 0.061606380862314535], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 582.1249999999999, 81, 1702, 470.5, 1654.4, 1702.0, 1702.0, 0.09323411669415131, 0.019507235841525312, 0.06225471415002535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca44c3b8-ff49-4c8c-9b3d-74550c8f7c1b", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 115.63636363636364, 78, 238, 80.0, 236.7, 237.85, 238.0, 0.09927708233680202, 0.033342081186090375, 0.05623997357875831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 90.68181818181817, 80, 243, 81.0, 101.39999999999999, 222.2999999999997, 243.0, 0.09927708233680202, 0.07377915982256478, 0.049832441719840075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 104.63636363636364, 78, 625, 80.0, 83.4, 543.8499999999988, 625.0, 0.09927842634668928, 1.3524129593319465, 0.05807400134928407], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28b7829f-20cd-4d94-b031-8ab161b0083c", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 132.13636363636363, 78, 759, 80.0, 235.7, 680.5499999999988, 759.0, 0.09927753033605444, 4.086001029158262, 0.05797652650484429], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85176816-dd30-4a78-9653-f7969a959fa2", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 0.7854959239130435, 2.9976222826086953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3539234f-8da1-49c6-87e7-821fb765bb82", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 0.2899904695024077, 1.1066663322632424], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 230.25000000000003, 79, 1205, 172.0, 603.7000000000006, 1205.0, 1205.0, 0.09152846821387915, 0.1382870911966775, 0.059149378750522], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78cd57ef-c30a-40b6-af1f-769c2184f055", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.8287342316513762, 3.162629013761468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 108.17647058823529, 79, 332, 81.0, 290.4, 332.0, 332.0, 0.08753997229617347, 0.06505656144276173, 0.0439409626564777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 98.82352941176471, 78, 241, 80.0, 237.8, 241.0, 241.0, 0.08754132465472672, 0.031158435636528422, 0.049493435044337106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 546.2, 399, 709, 548.0, 701.7, 709.0, 709.0, 0.08351497841137807, 24.55617661121272, 0.04762963612523906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 750.8000000000001, 529, 944, 809.5, 941.9, 944.0, 944.0, 0.08336390009670212, 75.0109838451182, 0.04746206421521224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 112.19999999999999, 78, 236, 82.5, 235.7, 236.0, 236.0, 0.08379209505375262, 0.1482727307005857, 0.04639659950730248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 111.19999999999999, 79, 234, 81.0, 233.9, 234.0, 234.0, 0.05829714052525724, 0.04332433978488355, 0.02926243186521701], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2eabe93d-cf47-42da-9825-6e33268559a7", 3, 0, 0.0, 795.6666666666666, 194, 1670, 523.0, 1670.0, 1670.0, 1670.0, 0.0685166152792052, 0.031001984126984128, 0.043938063834646574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 110.89999999999999, 79, 234, 80.0, 233.8, 234.0, 234.0, 0.05829782024450106, 0.024355280762302298, 0.03275836500848234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 212.0, 77, 938, 80.5, 868.2000000000003, 938.0, 938.0, 0.05805886007234134, 5.2382302443842566, 0.03363331620596961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 166.20000000000005, 78, 474, 81.5, 450.70000000000005, 474.0, 474.0, 0.058216028036839104, 1.7258664546147846, 0.033781214706533], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 111.5, 78, 238, 80.0, 238.0, 238.0, 238.0, 0.08379279717115516, 0.062271795553954186, 0.04705161950528733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 614.0666666666667, 79, 1002, 844.0, 967.2, 1002.0, 1002.0, 0.10670156993576566, 64.01642659554413, 0.05661574186044857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 159.94117647058823, 78, 943, 81.0, 378.1999999999995, 943.0, 943.0, 0.08754222625030897, 4.655774994914826, 0.051022715276633435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aaeb0c55-d374-4196-a24e-047574bca9ed", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 406.79999999999995, 79, 697, 468.0, 659.2, 697.0, 697.0, 0.10658178019994742, 20.901963858118336, 0.056656265321130904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 141.76470588235293, 78, 623, 81.0, 319.7999999999997, 623.0, 623.0, 0.08754177545019645, 1.5363360323235131, 0.051107942549422476], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 409.5333333333333, 79, 1095, 407.0, 811.8000000000002, 1095.0, 1095.0, 0.09684041990006069, 0.019708538581223286, 0.06538619757705269], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 340.30000000000007, 159, 1021, 239.0, 966.0000000000002, 1021.0, 1021.0, 0.057980089637218575, 7.017306467896423, 0.12891510555275318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d68fe758-c458-47a4-8895-f952939f2e93", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.3109536359724613, 1.186666308089501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 522.5833333333333, 86, 1402, 417.5, 1130.0, 1336.25, 1402.0, 0.1093184903116488, 0.06714973672463584, 0.04942818458427089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 82.26666666666667, 79, 91, 81.0, 91.0, 91.0, 91.0, 0.10669018592543067, 0.07928831200122338, 0.05355347223210095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 159.66666666666666, 78, 319, 82.0, 274.6, 319.0, 319.0, 0.10670081092616304, 0.13539054719732535, 0.054878672286242706], "isController": false}, {"data": ["login", 24, 0, 0.0, 2666.75, 1501, 4522, 2590.5, 3613.0, 4306.75, 4522.0, 0.10710508347502443, 53.5307250037933, 0.2355998052026294], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 103.70588235294117, 81, 240, 85.0, 238.4, 240.0, 240.0, 0.08847392881491775, 0.07162586619879571, 0.03144971688342779], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=06aa62af-a94f-4ffd-9ffe-dc4b2cde0eed", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 0.29861828512396693, 1.1395919421487604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/015c5e39-76eb-4e17-8fdf-010e25f84c77", 3, 0, 0.0, 311.6666666666667, 172, 507, 256.0, 507.0, 507.0, 507.0, 0.037082818294190356, 0.03091441980840544, 0.023780322929542644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 708.0666666666667, 163, 1094, 925.0, 1052.6, 1094.0, 1094.0, 0.10651064041297725, 85.0041935790948, 0.22137709604064448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6361771-122a-4419-8e36-ca009a799312", 3, 0, 0.0, 792.3333333333334, 207, 1385, 785.0, 1385.0, 1385.0, 1385.0, 0.019411696194013433, 0.022943967734525644, 0.012448255697332834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 238.45454545454547, 160, 1002, 166.5, 318.0, 899.3999999999985, 1002.0, 0.09924080782017565, 5.543472231463396, 0.22204073496840082], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 7, 41.1764705882353, 540.1764705882354, 78, 1161, 621.0, 1104.2, 1161.0, 1161.0, 0.12003869482633225, 84.48852648530232, 0.19184952708284786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86686b71-9ee3-46cc-83fa-d3f69b25d77b", 3, 0, 0.0, 283.0, 165, 426, 258.0, 426.0, 426.0, 426.0, 0.022264442201508045, 0.02631581693804548, 0.014277653364899365], "isController": false}, {"data": ["register", 24, 10, 41.666666666666664, 933.3749999999999, 130, 2068, 944.5, 1899.0, 2049.0, 2068.0, 0.10879222498232126, 0.0336788430853475, 0.049083992130695725], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 297.52941176470586, 160, 1223, 174.0, 700.5999999999996, 1223.0, 1223.0, 0.08750392480839214, 6.285584661334075, 0.19548139544310444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 87.07142857142857, 80, 107, 84.0, 102.5, 107.0, 107.0, 0.08026970621287526, 0.06231876605394124, 0.028533372130358003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 278.84999999999997, 159, 919, 166.0, 514.0000000000001, 898.9999999999998, 919.0, 0.10099326879863457, 6.189846870534204, 0.22584422482616534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 82.09090909090907, 79, 86, 82.0, 85.6, 86.0, 86.0, 0.05091461156779974, 0.037837909573335556, 0.025556748384618234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 109.63636363636363, 79, 237, 81.0, 236.6, 237.0, 237.0, 0.05087905124445534, 0.013614121133770276, 0.029016958912853434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 94.54545454545455, 79, 237, 80.0, 206.2000000000001, 237.0, 237.0, 0.05091696831113045, 0.013723714115109378, 0.029933608323535674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85176816-dd30-4a78-9653-f7969a959fa2", 3, 0, 0.0, 1003.6666666666666, 346, 2168, 497.0, 2168.0, 2168.0, 2168.0, 0.07375719132615431, 0.033373208314894036, 0.04729871969808723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 93.81818181818181, 78, 235, 79.0, 205.0000000000001, 235.0, 235.0, 0.05088069863824748, 0.013713938304840141, 0.029961973905139876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 85.33333333333333, 79, 95, 82.0, 95.0, 95.0, 95.0, 0.07868233319345362, 0.023205141234788083, 0.04863859073384389], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 893.0689655172414, 623, 1397, 853.5, 1208.1000000000001, 1259.2499999999998, 1397.0, 0.2519898508915227, 301.46746751286014, 0.49758152197525285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, 41.666666666666664, 933.3749999999999, 130, 2068, 944.5, 1899.0, 2049.0, 2068.0, 0.10768512868372877, 0.03333611893822463, 0.04858450141785419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 102.71428571428571, 77, 236, 79.0, 236.0, 236.0, 236.0, 0.030926377549217118, 0.008335625198812428, 0.01821152896697063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 80.57142857142857, 78, 93, 78.0, 93.0, 93.0, 93.0, 0.030926104282823642, 0.00833555154497981, 0.018181166775644367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 112.92857142857142, 78, 241, 79.0, 239.5, 241.0, 241.0, 0.07555641905748764, 0.020364816074088465, 0.04441891042246832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 103.78571428571429, 77, 238, 80.0, 235.5, 238.0, 238.0, 0.07555519576890904, 0.020364486359588766, 0.044491975633449365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3539234f-8da1-49c6-87e7-821fb765bb82", 3, 0, 0.0, 656.6666666666666, 169, 1205, 596.0, 1205.0, 1205.0, 1205.0, 0.02394961002051683, 0.024019774893623815, 0.015358311113417369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 103.57142857142857, 79, 235, 80.0, 235.0, 235.0, 235.0, 0.03092596765143784, 0.00827511243798239, 0.01763746592621064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 91.71428571428572, 78, 232, 81.0, 159.0, 232.0, 232.0, 0.07555560352736732, 0.05615020926203762, 0.037925371301823045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 80.71428571428571, 79, 83, 81.0, 83.0, 83.0, 83.0, 0.030925557764523964, 0.02298276314336205, 0.01552318036227082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 124.07142857142858, 78, 239, 80.0, 237.0, 239.0, 239.0, 0.07555560352736732, 0.020217026725096333, 0.04309030513670167], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 85.42857142857143, 82, 98, 83.0, 98.0, 98.0, 98.0, 0.031535651053516, 0.02482200659095107, 0.011209938460429515], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 456.7333333333334, 78, 785, 497.0, 734.0, 785.0, 785.0, 0.09678418417385021, 0.019167805225055488, 0.06585861282454963], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1438.958333333333, 876, 3031, 1269.0, 2075.5, 2800.25, 3031.0, 0.1092478286994046, 0.05654428633855902, 0.050249733708417545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 185.71428571428572, 159, 317, 163.0, 317.0, 317.0, 317.0, 0.030914631453429316, 0.04791164073885969, 0.06952773070043722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28b7829f-20cd-4d94-b031-8ab161b0083c", 3, 0, 0.0, 375.3333333333333, 219, 496, 411.0, 496.0, 496.0, 496.0, 0.02608650284342881, 0.02616292814472792, 0.016728649284360273], "isController": false}, {"data": ["addBook", 58, 19, 32.758620689655174, 846.4310344827585, 409, 1730, 725.0, 1541.5, 1580.2499999999998, 1730.0, 0.2696946870146658, 79.01433130829822, 0.9789464862385961], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 143.53448275862067, 79, 365, 82.0, 321.2, 326.05, 365.0, 0.25299670231884563, 0.1880180570943765, 0.1222982105935826], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 503.65517241379297, 389, 727, 468.0, 627.9, 699.5999999999999, 727.0, 0.2527211091842337, 74.30839723074308, 0.12710094846668002], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 136.0689655172413, 77, 332, 83.0, 240.60000000000002, 324.15, 332.0, 0.2533105062716187, 0.4482408568009504, 0.12319202355787709], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 748.0517241379308, 539, 1165, 738.5, 933.1, 995.0499999999998, 1165.0, 0.2523878940841148, 227.09907074748156, 0.12668689214769044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 95.6, 79, 274, 83.0, 105.80000000000001, 265.5999999999999, 274.0, 0.10456914896398116, 0.07812050679438046, 0.03717106467079018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 19, 10.919540229885058, 141.0344827586207, 79, 593, 89.0, 296.0, 362.5, 578.75, 0.7221175474564032, 1.6583786775081135, 0.34300340334207624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 85.45454545454547, 81, 93, 84.0, 92.8, 93.0, 93.0, 0.05267114531011334, 0.04078927561613269, 0.018722946184454352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d68fe758-c458-47a4-8895-f952939f2e93", 3, 0, 0.0, 381.3333333333333, 172, 608, 364.0, 608.0, 608.0, 608.0, 0.08332638946754438, 0.038679502402577566, 0.05343521720412188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aaeb0c55-d374-4196-a24e-047574bca9ed", 3, 0, 0.0, 354.6666666666667, 187, 455, 422.0, 455.0, 455.0, 455.0, 0.019956760352569432, 0.027512005238649596, 0.012797792283385998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 104.45454545454544, 79, 342, 84.0, 202.1999999999999, 327.1499999999998, 342.0, 0.1019642012958723, 0.08274633913756825, 0.03624508717939211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2eabe93d-cf47-42da-9825-6e33268559a7", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 0.9033203125, 3.447265625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f37ef50f-25b4-4400-ab1b-3d01503b7343", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78cd57ef-c30a-40b6-af1f-769c2184f055", 3, 0, 0.0, 381.33333333333337, 161, 692, 291.0, 692.0, 692.0, 692.0, 0.06383657835939995, 0.028884389296733697, 0.040936868283859985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b0ce6b2-1c8a-4106-9a1a-6f8b7e9c2b85", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 1.6460615335051545, 3.0756684922680413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 192.72727272727272, 160, 320, 165.0, 319.6, 320.0, 320.0, 0.05085929083654286, 0.07882196734139993, 0.11438373710601389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 240.14285714285717, 159, 468, 165.0, 396.0, 468.0, 468.0, 0.07552258934592043, 0.11704526298044504, 0.16985207349966286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca44c3b8-ff49-4c8c-9b3d-74550c8f7c1b", 3, 0, 0.0, 350.66666666666663, 174, 700, 178.0, 700.0, 700.0, 700.0, 0.04857591606081705, 0.03179888255153095, 0.031150571171813014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 102.5, 80, 236, 84.0, 223.70000000000005, 236.0, 236.0, 0.06085797574201087, 0.05045744277828831, 0.021633108564542924], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6361771-122a-4419-8e36-ca009a799312", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 85.2, 80, 99, 82.0, 97.8, 99.0, 99.0, 0.10995777621393385, 0.08536760946296622, 0.0390865532635468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86686b71-9ee3-46cc-83fa-d3f69b25d77b", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.31148976293103453, 1.1887122844827587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 98.30000000000001, 78, 284, 80.0, 219.20000000000033, 281.49999999999994, 284.0, 0.10111325695911991, 0.07514373881434595, 0.050754115309558236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 126.05, 78, 237, 80.0, 234.9, 236.9, 237.0, 0.10103765673466501, 0.03462315795722066, 0.05719875938387237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 156.25, 77, 837, 80.0, 238.0, 807.0499999999996, 837.0, 0.1010386776057875, 4.571610412856667, 0.05896554075900255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 129.19999999999996, 77, 618, 80.0, 233.9, 598.7999999999997, 618.0, 0.10111683544751783, 1.5124767905263636, 0.05910990009656658], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=015c5e39-76eb-4e17-8fdf-010e25f84c77", 1, 0, 0.0, 1095.0, 1095, 1095, 1095.0, 1095.0, 1095.0, 1095.0, 0.91324200913242, 0.1649900114155251, 0.6296375570776256], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 23.25581395348837, 0.7363770250368189], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 9.30232558139535, 0.29455081001472755], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 6.976744186046512, 0.22091310751104565], "isController": false}, {"data": ["401/Unauthorized", 26, 60.46511627906977, 1.914580265095729], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1358, 43, "401/Unauthorized", 26, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
