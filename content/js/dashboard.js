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

    var data = {"OkPercent": 98.47211611917494, "KoPercent": 1.5278838808250572};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7461895294897283, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f383d7b-e181-49b5-9a09-5dd91051aa48"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ae6e31e0-e8b5-4979-849f-991af9e94400"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f1a0b243-e520-4413-a771-1c3bd5fc17af"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.22807017543859648, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b7b973ca-2244-472a-b0c9-0d012d54e1fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae6e31e0-e8b5-4979-849f-991af9e94400"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/910ab36b-7262-4a99-bbc8-10e4c1d0aa03"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1a0b243-e520-4413-a771-1c3bd5fc17af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=910ab36b-7262-4a99-bbc8-10e4c1d0aa03"], "isController": false}, {"data": [0.3684210526315789, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0ec5e52c-8f1a-419f-9a63-d2e226a15eeb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cdcfd709-8c17-4afc-960f-48a1f21a84e9"], "isController": false}, {"data": [0.2833333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8f383d7b-e181-49b5-9a09-5dd91051aa48"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.2894736842105263, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9152542372881356, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e2f94a1-e477-4022-88b0-86935625242d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0e2f94a1-e477-4022-88b0-86935625242d"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=465efafa-757b-4c4c-8e62-fb913ebd1dd2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/42d775cd-4869-4bce-b6f6-3dd684e0db2e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ec5e52c-8f1a-419f-9a63-d2e226a15eeb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a98bb9e2-7eb2-4ef9-9b7b-be1fefd61322"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42d775cd-4869-4bce-b6f6-3dd684e0db2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a98bb9e2-7eb2-4ef9-9b7b-be1fefd61322"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d0bc2b8-a58f-4bb7-a93e-53320a7e5c59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ff4c12c4-3454-4c25-8402-eaf6fee34fde"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/465efafa-757b-4c4c-8e62-fb913ebd1dd2"], "isController": false}, {"data": [0.4117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff4c12c4-3454-4c25-8402-eaf6fee34fde"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4d0bc2b8-a58f-4bb7-a93e-53320a7e5c59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.2, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1309, 20, 1.5278838808250572, 471.82505729564605, 137, 4878, 154.0, 1310.0, 1666.5, 2126.7000000000003, 5.319213780380268, 732.6749671866683, 3.912103287580916], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f383d7b-e181-49b5-9a09-5dd91051aa48", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae6e31e0-e8b5-4979-849f-991af9e94400", 3, 0, 0.0, 775.3333333333334, 284, 1572, 470.0, 1572.0, 1572.0, 1572.0, 0.02265604349960352, 0.027176927179700185, 0.01452877789525356], "isController": false}, {"data": ["see books", 57, 0, 0.0, 2417.8947368421054, 1683, 5451, 2384.0, 2981.6, 3249.5, 5451.0, 0.25511688381440023, 306.9910785318023, 1.2544077246147511], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 505.3157894736842, 282, 1784, 296.0, 1518.0, 1784.0, 1784.0, 0.09572463549066433, 12.187469102039943, 0.2127088387216227], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 172.83333333333334, 143, 415, 150.0, 341.2000000000003, 415.0, 415.0, 0.0820950660865282, 0.06373591556522454, 0.029182230522945572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1a0b243-e520-4413-a771-1c3bd5fc17af", 3, 0, 0.0, 337.0, 256, 483, 272.0, 483.0, 483.0, 483.0, 0.05232406034708293, 0.02367527470131682, 0.033554166303305134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 422.85714285714283, 280, 861, 296.0, 785.0000000000002, 858.4, 861.0, 0.09451200302438409, 0.14647514531220465, 0.21255970992691073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 144.41666666666669, 140, 153, 143.5, 152.4, 153.0, 153.0, 0.05671157908666002, 0.0421460075048323, 0.02846655434623364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 141.91666666666666, 138, 150, 141.0, 148.8, 150.0, 150.0, 0.056710507039191685, 0.015174491141346213, 0.03234271104578901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 165.83333333333331, 139, 421, 142.0, 338.8000000000003, 421.0, 421.0, 0.05671345526726216, 0.015286048490004252, 0.03334130866298029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 140.5, 138, 147, 139.5, 145.8, 147.0, 147.0, 0.05671157908666002, 0.015285542800701333, 0.0333955880754453], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1707.0000000000002, 1106, 4878, 1555.0, 2389.8, 2660.3, 4878.0, 0.25329168092358145, 303.0249088205495, 0.5001521277612125], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 534.3636363636364, 462, 644, 502.0, 636.6, 644.0, 644.0, 0.058842724097165386, 0.010630765583960543, 0.0399946640347921], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 534.3636363636364, 462, 644, 502.0, 636.6, 644.0, 644.0, 0.05798751686909581, 0.01047626037185813, 0.039413390371963564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 7, 35.0, 1282.1499999999999, 187, 4631, 1103.0, 1775.6000000000001, 4488.5999999999985, 4631.0, 0.08140637656147606, 0.02539179362669478, 0.0367282675501972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7b973ca-2244-472a-b0c9-0d012d54e1fc", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 1.3034119897959184, 2.4354272959183674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 174.3529411764706, 137, 417, 143.0, 413.8, 417.0, 417.0, 0.12496875781054738, 0.03343890589852537, 0.0712712446888278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 248.6, 137, 414, 140.0, 414.0, 414.0, 414.0, 0.04706413900864098, 0.012685256217172763, 0.02771452717012745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 177.41176470588235, 139, 441, 146.0, 417.79999999999995, 441.0, 441.0, 0.12496692052103855, 0.09287092433252962, 0.06272753627716193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 196.4, 138, 420, 140.0, 420.0, 420.0, 420.0, 0.04718672731734017, 0.012718297597251845, 0.02774063461429569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 216.76470588235293, 137, 563, 146.0, 449.3999999999999, 563.0, 563.0, 0.12497427000323465, 0.033684471211809335, 0.07359324688667039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae6e31e0-e8b5-4979-849f-991af9e94400", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 206.94117647058823, 138, 419, 145.0, 416.6, 419.0, 419.0, 0.12497427000323465, 0.033684471211809335, 0.07347120170112036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/910ab36b-7262-4a99-bbc8-10e4c1d0aa03", 3, 0, 0.0, 375.6666666666667, 252, 563, 312.0, 563.0, 563.0, 563.0, 0.015602895897478573, 0.021509851603457603, 0.010005763319672132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 239.0, 140, 436, 146.0, 435.1, 436.0, 436.0, 0.08347303473173855, 0.022498591392538903, 0.04907301455908848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 139.91666666666666, 138, 142, 140.0, 141.7, 142.0, 142.0, 0.08364409437841983, 0.022544697312933466, 0.04925526260760464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 144.25, 139, 158, 142.5, 155.60000000000002, 158.0, 158.0, 0.08364001338240214, 0.062158252132820335, 0.041983366092338575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 200.8, 137, 435, 146.0, 435.0, 435.0, 435.0, 0.04705483770786475, 0.012590845246049746, 0.02683596213026661], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1a0b243-e520-4413-a771-1c3bd5fc17af", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 0.7112758366141733, 2.714382381889764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 186.74999999999997, 138, 416, 142.0, 415.1, 416.0, 416.0, 0.0834846492601173, 0.022338665915304822, 0.04761233903116065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 141.8, 139, 147, 141.0, 147.0, 147.0, 147.0, 0.04718672731734017, 0.035067479969234254, 0.023685525235461767], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 517.6363636363636, 452, 769, 483.0, 730.6000000000001, 769.0, 769.0, 0.058565777354211146, 0.010580731260282287, 0.03986361993738786], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 148.6, 143, 158, 148.0, 158.0, 158.0, 158.0, 0.050372758412250654, 0.039648870390892606, 0.017905941466854723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=910ab36b-7262-4a99-bbc8-10e4c1d0aa03", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1429.8421052631577, 1098, 1981, 1382.0, 1950.0, 1981.0, 1981.0, 0.08468193021317562, 0.04382951466111629, 0.03895038001016183], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 442.2727272727273, 231, 1572, 272.0, 1378.8000000000006, 1572.0, 1572.0, 0.05860727795833555, 0.14166373907773455, 0.03788868946134584], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 400.4, 282, 575, 294.0, 575.0, 575.0, 575.0, 0.04699336453692739, 0.07283053664072633, 0.10568917825053104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 143.47368421052633, 138, 149, 143.0, 148.0, 149.0, 149.0, 0.09592422995562243, 0.07128744042600454, 0.048149466989443286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ec5e52c-8f1a-419f-9a63-d2e226a15eeb", 3, 0, 0.0, 456.6666666666667, 266, 606, 498.0, 606.0, 606.0, 606.0, 0.025782498839787553, 0.025858033504357242, 0.016533698800254387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 200.89473684210526, 138, 439, 142.0, 420.0, 439.0, 439.0, 0.09579461634256155, 0.040777704181182914, 0.05378599860845715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 955.0, 821, 1135, 921.0, 1135.0, 1135.0, 1135.0, 0.05878837166008564, 17.28573322571795, 0.03352774321239259], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1663.6666666666665, 1249, 1943, 1699.0, 1943.0, 1943.0, 1943.0, 0.05854286801510406, 52.67697554737581, 0.03333055864531803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdcfd709-8c17-4afc-960f-48a1f21a84e9", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["addBook", 60, 13, 21.666666666666668, 1348.75, 724, 4383, 1120.0, 2407.9, 2920.35, 4383.0, 0.29731966323592807, 72.25769357213471, 1.0852700018706363], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 284.5, 140, 437, 282.5, 437.0, 437.0, 437.0, 0.05902026362384418, 0.10443820086563053, 0.032680165502655914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f383d7b-e181-49b5-9a09-5dd91051aa48", 3, 0, 0.0, 611.0, 408, 957, 468.0, 957.0, 957.0, 957.0, 0.07160075419461084, 0.03239747667008759, 0.04591584823026802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 163.78571428571428, 138, 426, 143.0, 288.5, 426.0, 426.0, 0.08418166403097886, 0.06256078742927237, 0.042255249328049936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 201.64285714285714, 138, 435, 141.5, 426.5, 435.0, 435.0, 0.08403411785184785, 0.022485691690826478, 0.04792570783738198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 183.92857142857144, 138, 452, 142.0, 436.5, 452.0, 452.0, 0.08418217021634818, 0.022689725566125092, 0.04948990866234531], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 315.80701754385956, 140, 3493, 147.0, 573.4, 608.0999999999992, 3493.0, 0.25511003298527973, 0.18958860849784948, 0.12331979133565767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 260.35714285714283, 139, 435, 144.0, 427.5, 435.0, 435.0, 0.08403411785184785, 0.02264982082725587, 0.04948493463346119], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 912.1754385964913, 684, 1304, 838.0, 1247.0, 1257.6, 1304.0, 0.25502442865579755, 74.98564963278719, 0.1282593562087263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 193.16666666666666, 141, 434, 147.5, 434.0, 434.0, 434.0, 0.05917918470809867, 0.04397984332310848, 0.033230499225739], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 212.12280701754395, 138, 603, 145.0, 424.40000000000003, 450.4999999999999, 603.0, 0.2554495912806539, 0.45202603457084467, 0.12423232075953679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 301.7894736842105, 139, 1642, 146.0, 1379.0, 1642.0, 1642.0, 0.09592471424532494, 9.108735948922615, 0.055525500196898094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 1031.941176470588, 138, 2088, 1368.0, 1975.1999999999998, 2088.0, 2088.0, 0.08519595068657913, 45.10325898002907, 0.045779120101232834], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1389.6315789473688, 957, 2082, 1388.0, 1838.2, 1903.1999999999998, 2082.0, 0.2541522684204659, 228.68665787676957, 0.12757252535949168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 200.85714285714286, 141, 424, 150.0, 421.8, 423.8, 424.0, 0.09826124389376556, 0.07340805818235414, 0.03492880154036197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 255.31578947368422, 139, 1310, 143.0, 841.0, 1310.0, 1310.0, 0.09592762008623389, 2.9921765345894804, 0.05562086154362687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 748.6470588235294, 139, 1308, 1091.0, 1188.0, 1308.0, 1308.0, 0.08519253512939243, 14.744416130454828, 0.045860480623709586], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 637.2727272727273, 254, 1361, 517.0, 1296.8000000000002, 1361.0, 1361.0, 0.057986294148655776, 0.010476039470216131, 0.03997883170795994], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 13, 7.344632768361582, 217.46892655367225, 140, 1978, 150.0, 366.4000000000003, 419.59999999999997, 1519.3599999999992, 0.7628422554271701, 1.5902479829933587, 0.3666439210199675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 172.33333333333334, 142, 416, 148.0, 340.40000000000026, 416.0, 416.0, 0.05843396961433581, 0.04525208779703934, 0.020771450136345928], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e2f94a1-e477-4022-88b0-86935625242d", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e2f94a1-e477-4022-88b0-86935625242d", 3, 0, 0.0, 442.6666666666667, 262, 566, 500.0, 566.0, 566.0, 566.0, 0.0243117741922413, 0.028735694040373752, 0.015590558319894324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 428.64285714285717, 283, 862, 296.0, 730.0, 862.0, 862.0, 0.08396154561210965, 0.1301239969593926, 0.1888314839303599], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 165.23529411764707, 142, 424, 149.0, 211.19999999999982, 424.0, 424.0, 0.12086138620900488, 0.09808184759734673, 0.0429624458789822], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 647.3157894736843, 181, 1210, 738.0, 1120.0, 1210.0, 1210.0, 0.08670177327942612, 0.053257241594491245, 0.039202071316771774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 143.6470588235294, 139, 151, 143.0, 148.6, 151.0, 151.0, 0.08519210820400001, 0.06331171322582423, 0.04276244493833595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=465efafa-757b-4c4c-8e62-fb913ebd1dd2", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 191.64705882352942, 137, 416, 146.0, 416.0, 416.0, 416.0, 0.08519381593124359, 0.09806489451001028, 0.04437830439249293], "isController": false}, {"data": ["login", 19, 0, 0.0, 2933.052631578947, 1841, 4758, 2535.0, 4407.0, 4758.0, 4758.0, 0.08592114247986506, 32.57651362528433, 0.17462889273649793], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 312.8333333333333, 284, 565, 288.5, 486.4000000000003, 565.0, 565.0, 0.0566714050258091, 0.08782960915621, 0.12745531813909997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42d775cd-4869-4bce-b6f6-3dd684e0db2e", 3, 0, 0.0, 357.3333333333333, 236, 577, 259.0, 577.0, 577.0, 577.0, 0.01971401535064662, 0.023301298742902956, 0.01264212572941857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ec5e52c-8f1a-419f-9a63-d2e226a15eeb", 1, 0, 0.0, 1361.0, 1361, 1361, 1361.0, 1361.0, 1361.0, 1361.0, 0.7347538574577516, 0.13274361682586333, 0.5065783431300515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 178.00000000000003, 141, 423, 149.0, 417.0, 423.0, 423.0, 0.0984114323007039, 0.07967097400125345, 0.03498218882564084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a98bb9e2-7eb2-4ef9-9b7b-be1fefd61322", 1, 0, 0.0, 950.0, 950, 950, 950.0, 950.0, 950.0, 950.0, 1.0526315789473684, 0.19017269736842107, 0.7257401315789475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 384.33333333333337, 280, 581, 294.5, 579.8, 581.0, 581.0, 0.08338834647857961, 0.1292356502553768, 0.18754234564469616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42d775cd-4869-4bce-b6f6-3dd684e0db2e", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a98bb9e2-7eb2-4ef9-9b7b-be1fefd61322", 3, 0, 0.0, 348.6666666666667, 231, 461, 354.0, 461.0, 461.0, 461.0, 0.022189513236044643, 0.026227253437525425, 0.014229603214520816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d0bc2b8-a58f-4bb7-a93e-53320a7e5c59", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.32435199730700176, 1.2377973518850987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 148.57142857142856, 141, 166, 145.5, 162.5, 166.0, 166.0, 0.08523955358828078, 0.07067224706684608, 0.030299997564584184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff4c12c4-3454-4c25-8402-eaf6fee34fde", 3, 0, 0.0, 371.0, 274, 453, 386.0, 453.0, 453.0, 453.0, 0.04416766043902655, 0.028395549924178847, 0.02832366245601637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/465efafa-757b-4c4c-8e62-fb913ebd1dd2", 3, 0, 0.0, 509.0, 252, 769, 506.0, 769.0, 769.0, 769.0, 0.03737153534724385, 0.024026296325132354, 0.02396547025848645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1178.2941176470586, 283, 2230, 1509.0, 2122.7999999999997, 2230.0, 2230.0, 0.08512897039014106, 59.96246911727517, 0.17864467011272078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 184.52941176470586, 141, 433, 151.0, 423.4, 433.0, 433.0, 0.08333986979370932, 0.0647023403183583, 0.029624719340732606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff4c12c4-3454-4c25-8402-eaf6fee34fde", 1, 0, 0.0, 1040.0, 1040, 1040, 1040.0, 1040.0, 1040.0, 1040.0, 0.9615384615384616, 0.17371544471153846, 0.6629356971153846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 444.8235294117647, 282, 976, 293.0, 880.8, 976.0, 976.0, 0.1248320274924183, 0.19346526135787875, 0.2807501555810931], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 0, 0.0, 1857.1666666666667, 1398, 2084, 1916.0, 2084.0, 2084.0, 2084.0, 0.05845845065619611, 69.93663043054649, 0.13181695563003595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 169.61904761904762, 139, 426, 142.0, 365.8000000000002, 425.2, 426.0, 0.09457414613056636, 0.07028410664586035, 0.04747178819444444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 194.42857142857144, 138, 433, 141.0, 417.6, 431.5, 433.0, 0.0945754239005607, 0.025306314598392218, 0.05393754644328853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d0bc2b8-a58f-4bb7-a93e-53320a7e5c59", 3, 0, 0.0, 476.0, 452, 499, 477.0, 499.0, 499.0, 499.0, 0.016029066039752085, 0.022097361548942082, 0.01027905602158581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 209.57142857142858, 138, 445, 141.0, 431.0, 443.9, 445.0, 0.09457712764759663, 0.025491491436266275, 0.05560100668345035], "isController": false}, {"data": ["register", 20, 7, 35.0, 1282.1499999999999, 187, 4631, 1103.0, 1775.6000000000001, 4488.5999999999985, 4631.0, 0.07996193811745608, 0.02494125296358933, 0.036076577549086636], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 235.76190476190482, 138, 437, 144.0, 432.0, 436.7, 437.0, 0.09457670170508281, 0.025491376631448105, 0.05569311633609857], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 35.0, 0.5347593582887701], "isController": false}, {"data": ["401/Unauthorized", 13, 65.0, 0.9931245225362872], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1309, 20, "401/Unauthorized", 13, "406/Not Acceptable", 7, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
