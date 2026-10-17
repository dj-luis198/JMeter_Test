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

    var data = {"OkPercent": 98.48714069591529, "KoPercent": 1.51285930408472};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8289817232375979, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3392857142857143, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9ab08e8-30a4-4fea-9387-2d80a1c9c2d0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9b10c375-a050-4c30-a3b7-d2aaa20763fe"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5416666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c1f8ac5-0ccf-49f3-a021-4644e40efde1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b86b10fc-b359-42e9-afad-ea74ddddf7c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a09a3d86-555c-4deb-8fd2-b2d232cfb964"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86cb8afa-8ebf-4cc7-b36b-0fc148e67ecd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/64fdb1b9-b7a8-4c7f-8fe3-92fc6a6d4050"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64fdb1b9-b7a8-4c7f-8fe3-92fc6a6d4050"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=46b25e7c-7b34-4bfc-b41b-e9b6008e9909"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7d833385-1150-4138-8db9-d07664bbfd6c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8bafb3b-6ffd-4465-976c-e0ba074e6c48"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b62246a7-0399-4acb-88a0-e31852203833"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38bca99f-483f-4643-b465-2943e5a1835a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c6a07ce-705b-4a0a-ae27-4111a16e2e13"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16c8a2f3-a611-41a5-a188-bbcdb3a8035e"], "isController": false}, {"data": [0.4772727272727273, 500, 1500, "register"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b10c375-a050-4c30-a3b7-d2aaa20763fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b86b10fc-b359-42e9-afad-ea74ddddf7c4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d9ab08e8-30a4-4fea-9387-2d80a1c9c2d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.4772727272727273, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a09a3d86-555c-4deb-8fd2-b2d232cfb964"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4523809523809524, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8bafb3b-6ffd-4465-976c-e0ba074e6c48"], "isController": false}, {"data": [0.4032258064516129, 500, 1500, "addBook"], "isController": true}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8035714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/86cb8afa-8ebf-4cc7-b36b-0fc148e67ecd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3f05bdab-e91c-4017-bcf9-6b59cad79cd8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/16c8a2f3-a611-41a5-a188-bbcdb3a8035e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/46b25e7c-7b34-4bfc-b41b-e9b6008e9909"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/38bca99f-483f-4643-b465-2943e5a1835a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d833385-1150-4138-8db9-d07664bbfd6c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/659d101f-93f8-4c8f-8926-ccdda02e6ff9"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1322, 20, 1.51285930408472, 280.73978819969756, 78, 3020, 85.0, 792.7, 952.5499999999997, 1337.0899999999997, 5.222179647720136, 712.2752676823812, 3.822902079687617], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1378.1785714285716, 964, 1941, 1350.5, 1681.6, 1771.95, 1941.0, 0.2497513635978468, 300.53507435259763, 1.2280255036280845], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9ab08e8-30a4-4fea-9387-2d80a1c9c2d0", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b10c375-a050-4c30-a3b7-d2aaa20763fe", 3, 0, 0.0, 340.0, 176, 662, 182.0, 662.0, 662.0, 662.0, 0.04080244814688881, 0.033616860761645696, 0.026165632437946274], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 817.4166666666666, 86, 3020, 573.0, 2603.9000000000015, 3020.0, 3020.0, 0.07586869657579283, 0.014429129548960598, 0.05126446839752668], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 817.4166666666666, 86, 3020, 573.0, 2603.9000000000015, 3020.0, 3020.0, 0.07677690550682355, 0.014601857761185435, 0.05187814505396777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 112.26666666666667, 80, 240, 81.0, 240.0, 240.0, 240.0, 0.09789972457544152, 0.03599854455742798, 0.055285300193188794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c1f8ac5-0ccf-49f3-a021-4644e40efde1", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 1.716859879032258, 3.207955309139785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 102.46666666666665, 80, 240, 82.0, 239.4, 240.0, 240.0, 0.09779823571982761, 0.0726801341628797, 0.04909013003905409], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 170.53333333333336, 80, 475, 81.0, 335.2000000000001, 475.0, 475.0, 0.09789972457544152, 1.9436792062616666, 0.057089051629051424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 190.6, 79, 948, 81.0, 522.6000000000003, 948.0, 948.0, 0.09789972457544152, 5.8973175169529695, 0.05699344642927072], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 184.61538461538458, 80, 278, 179.0, 276.4, 278.0, 278.0, 0.06864686468646865, 0.15185643564356435, 0.04436881188118812], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b86b10fc-b359-42e9-afad-ea74ddddf7c4", 3, 0, 0.0, 331.33333333333337, 182, 622, 190.0, 622.0, 622.0, 622.0, 0.020482569333497194, 0.024209703531877704, 0.013134980985348134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 98.77777777777777, 80, 240, 81.5, 239.1, 240.0, 240.0, 0.11040912715451144, 0.08205209547322578, 0.055420206403729376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a09a3d86-555c-4deb-8fd2-b2d232cfb964", 3, 0, 0.0, 364.33333333333337, 175, 636, 282.0, 636.0, 636.0, 636.0, 0.01729884328401241, 0.023847851988213722, 0.01109333374658348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 115.61111111111111, 78, 242, 80.5, 242.0, 242.0, 242.0, 0.11041048163505655, 0.03875628342984028, 0.062453324735628236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 568.4, 470, 636, 629.0, 636.0, 636.0, 636.0, 0.04717960331389534, 13.872369884551512, 0.026907117514955937], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86cb8afa-8ebf-4cc7-b36b-0fc148e67ecd", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 932.8, 785, 1070, 943.0, 1070.0, 1070.0, 1070.0, 0.0470402288036729, 42.32688056544707, 0.026781692766153616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 153.2, 79, 285, 81.0, 285.0, 285.0, 285.0, 0.04742483164184767, 0.08391972161623826, 0.026259647989187136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 90.8125, 80, 238, 81.0, 129.5000000000001, 238.0, 238.0, 0.08245297603710385, 0.061276088636949236, 0.04138752898737438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 110.31250000000001, 79, 241, 80.5, 240.3, 241.0, 241.0, 0.08245297603710385, 0.029802644292708062, 0.046591165292450394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 152.75, 79, 905, 81.0, 438.1000000000005, 905.0, 905.0, 0.08245297603710385, 4.65779297378253, 0.04803046895130121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 154.4375, 78, 631, 81.0, 358.0000000000003, 631.0, 631.0, 0.08245382585751979, 1.5360950480035866, 0.04811148530260554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 143.8, 80, 239, 81.0, 239.0, 239.0, 239.0, 0.04742438182318293, 0.035244096257267786, 0.0266299019026662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 128.55555555555554, 79, 627, 81.0, 279.60000000000053, 627.0, 627.0, 0.1104111588877916, 5.54744790165126, 0.0643825485962448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 504.59999999999997, 79, 1125, 474.0, 1043.5, 1121.0, 1125.0, 0.10342010279958218, 46.5427326208981, 0.05635587633024108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64fdb1b9-b7a8-4c7f-8fe3-92fc6a6d4050", 3, 0, 0.0, 316.3333333333333, 175, 500, 274.0, 500.0, 500.0, 500.0, 0.019991869972877694, 0.023629713499843396, 0.0128203072417217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 138.22222222222223, 79, 638, 81.0, 281.6000000000006, 638.0, 638.0, 0.11041048163505655, 1.831680658383836, 0.06448997641509434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 368.45000000000005, 80, 719, 432.5, 637.6, 714.9499999999999, 719.0, 0.10342117238241012, 15.218566912205768, 0.056457456407975844], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 511.41666666666663, 82, 1827, 420.5, 1441.8000000000013, 1827.0, 1827.0, 0.07700402987756359, 0.01464505353384327, 0.05263320694512179], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 274.9375, 162, 986, 165.0, 629.7000000000004, 986.0, 986.0, 0.08241814847629447, 6.282296203420868, 0.18404238160117858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64fdb1b9-b7a8-4c7f-8fe3-92fc6a6d4050", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 336.80952380952374, 150, 722, 323.0, 594.2, 712.0999999999999, 722.0, 0.09577277225690818, 0.058829173583589106, 0.04330350933100438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 81.05, 80, 83, 81.0, 82.0, 82.95, 83.0, 0.10342010279958218, 0.07685810374070512, 0.05191204378807153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 120.45, 80, 241, 81.0, 240.9, 241.0, 241.0, 0.10342010279958218, 0.1053390304882463, 0.054638941029857384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=46b25e7c-7b34-4bfc-b41b-e9b6008e9909", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["login", 21, 0, 0.0, 1820.9047619047617, 1099, 2953, 1651.0, 2782.2000000000003, 2937.7, 2953.0, 0.09528346831824679, 27.272017109904944, 0.1813815464847206], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7d833385-1150-4138-8db9-d07664bbfd6c", 3, 0, 0.0, 254.33333333333331, 174, 401, 188.0, 401.0, 401.0, 401.0, 0.02319378406587035, 0.027414267559627354, 0.014873618037032741], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 82.83333333333336, 81, 85, 83.0, 84.1, 85.0, 85.0, 0.1090354001599186, 0.08827182298102784, 0.03875867740059606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8bafb3b-6ffd-4465-976c-e0ba074e6c48", 3, 0, 0.0, 258.0, 178, 395, 201.0, 395.0, 395.0, 395.0, 0.03714986254550858, 0.03097031184213785, 0.023823316801644498], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b62246a7-0399-4acb-88a0-e31852203833", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 1.7642869475138123, 3.296572859116022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 587.0500000000001, 161, 1207, 558.5, 1125.6000000000001, 1203.0, 1207.0, 0.10337626894370129, 61.91708504442595, 0.2192707579548039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38bca99f-483f-4643-b465-2943e5a1835a", 1, 0, 0.0, 1827.0, 1827, 1827, 1827.0, 1827.0, 1827.0, 1827.0, 0.5473453749315819, 0.09888563902572524, 0.37736897920087575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c6a07ce-705b-4a0a-ae27-4111a16e2e13", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.783999650837989, 3.3334060754189947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 326.4666666666667, 162, 1029, 322.0, 699.6000000000001, 1029.0, 1029.0, 0.09774661470891059, 7.937317845110714, 0.21816713490010295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 703.25, 80, 1189, 1010.5, 1189.0, 1189.0, 1189.0, 0.062191955470559876, 46.50824055556852, 0.10296746729091844], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16c8a2f3-a611-41a5-a188-bbcdb3a8035e", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 574.8181818181818, 191, 1245, 518.0, 970.1999999999998, 1213.4999999999995, 1245.0, 0.09336354917288382, 0.029375037133229785, 0.0421230075369847], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 273.55555555555554, 161, 719, 165.5, 505.70000000000033, 719.0, 719.0, 0.11035429860647043, 7.4960875473603865, 0.2466207827798248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 93.5, 81, 241, 83.5, 135.30000000000013, 241.0, 241.0, 0.10467162548492402, 0.08126361548878377, 0.037207491871594084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b10c375-a050-4c30-a3b7-d2aaa20763fe", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.33832221441947563, 1.2911107209737827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 246.47058823529414, 162, 322, 317.0, 322.0, 322.0, 322.0, 0.07819903033202388, 0.12119322376652529, 0.17587145200649512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 81.4, 81, 83, 81.0, 83.0, 83.0, 83.0, 0.032138839787883657, 0.02388443074080026, 0.01613219106540254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 79.6, 79, 80, 80.0, 80.0, 80.0, 80.0, 0.032139046370216105, 0.00859970576703048, 0.01832929988301387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 112.4, 80, 241, 80.0, 241.0, 241.0, 241.0, 0.032139046370216105, 0.008662477341972308, 0.018894244057490326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b86b10fc-b359-42e9-afad-ea74ddddf7c4", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9ab08e8-30a4-4fea-9387-2d80a1c9c2d0", 3, 0, 0.0, 367.6666666666667, 242, 567, 294.0, 567.0, 567.0, 567.0, 0.040119824542634, 0.025793181468653045, 0.02572788227506152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 144.0, 80, 240, 81.0, 240.0, 240.0, 240.0, 0.032106026943377816, 0.0086535775745823, 0.018906185787946114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 3.596608231707317, 7.53858612804878], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 974.5357142857141, 631, 1607, 882.0, 1349.3, 1439.85, 1607.0, 0.24091616977706648, 288.2194950655206, 0.4757153274308872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 574.8181818181818, 191, 1245, 518.0, 970.1999999999998, 1213.4999999999995, 1245.0, 0.09284463294718406, 0.029211770167331348, 0.04188888713046781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 94.99999999999999, 78, 240, 81.0, 208.40000000000012, 240.0, 240.0, 0.0581106638350925, 0.015662639861802274, 0.03421946317632888], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a09a3d86-555c-4deb-8fd2-b2d232cfb964", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 80.54545454545455, 79, 82, 81.0, 81.8, 82.0, 82.0, 0.058110049868988246, 0.01566247437875074, 0.034162353536260674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 174.25, 79, 947, 81.0, 453.5000000000005, 947.0, 947.0, 0.10652321540325695, 6.017527906169692, 0.06205185350394802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 134.875, 78, 635, 80.0, 359.2000000000003, 635.0, 635.0, 0.10652605227766015, 1.9845548667425663, 0.06215753538662299], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 80.18181818181819, 78, 82, 80.0, 81.8, 82.0, 82.0, 0.058110049868988246, 0.015548978187600372, 0.03314088781590736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 80.56249999999999, 79, 82, 81.0, 82.0, 82.0, 82.0, 0.10652321540325695, 0.07916422550964701, 0.05346966085671296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 81.18181818181819, 80, 82, 81.0, 82.0, 82.0, 82.0, 0.05810974289080122, 0.043185072597558334, 0.02916836703698421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 130.1875, 79, 242, 80.5, 241.3, 242.0, 242.0, 0.10641127959563713, 0.03846237779329609, 0.060129127593774936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 82.45454545454547, 81, 86, 82.0, 85.6, 86.0, 86.0, 0.05856983121239551, 0.046100863239444116, 0.020819744688781214], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 500.0833333333333, 80, 768, 515.5, 736.2000000000002, 768.0, 768.0, 0.07692554248533608, 0.01445484029936857, 0.05235419204141158], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1000.2857142857142, 727, 2122, 866.0, 1655.2000000000003, 2083.5999999999995, 2122.0, 0.09355662180403897, 0.04842286089466861, 0.043032391474318706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 177.36363636363635, 161, 321, 163.0, 289.60000000000014, 321.0, 321.0, 0.05808488842420979, 0.09002023235275482, 0.13063427543062026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8bafb3b-6ffd-4465-976c-e0ba074e6c48", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["addBook", 62, 9, 14.516129032258064, 820.8870967741935, 405, 2895, 678.0, 1452.2, 1552.85, 2895.0, 0.28439062428328976, 77.91363319056465, 1.0365735445048392], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 157.0714285714286, 80, 609, 82.0, 326.20000000000005, 364.84999999999985, 609.0, 0.24173566205354444, 0.1796492566628392, 0.11685464132471143], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 513.9821428571428, 392, 729, 474.0, 709.3, 715.1, 729.0, 0.24174714112421056, 71.08168625106305, 0.1215818141396176], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 113.76785714285717, 79, 252, 81.5, 240.3, 242.15, 252.0, 0.24215902063973224, 0.4285079544914012, 0.11776874245955729], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 815.9821428571429, 551, 1130, 794.5, 1024.0, 1106.45, 1130.0, 0.24158444886390598, 217.37811174790664, 0.12126406905864032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 83.3529411764706, 81, 85, 83.0, 85.0, 85.0, 85.0, 0.07929659257877184, 0.05924013019800826, 0.028187460643235303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 9, 5.0, 138.42777777777778, 79, 2407, 83.5, 225.8, 275.79999999999995, 782.9499999999955, 0.7469127605895631, 1.5524212162644404, 0.3610443046345937], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 82.8, 82, 85, 82.0, 85.0, 85.0, 85.0, 0.03354308945271095, 0.02597624017187479, 0.011923520078893345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 93.33333333333333, 82, 242, 83.0, 147.80000000000007, 242.0, 242.0, 0.10289900805356236, 0.08350495673096711, 0.03657738176903975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86cb8afa-8ebf-4cc7-b36b-0fc148e67ecd", 3, 0, 0.0, 381.33333333333337, 179, 768, 197.0, 768.0, 768.0, 768.0, 0.018057168997044643, 0.021342962444098012, 0.011579629858130842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f05bdab-e91c-4017-bcf9-6b59cad79cd8", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.7740885416666667, 3.3148871527777777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16c8a2f3-a611-41a5-a188-bbcdb3a8035e", 3, 0, 0.0, 478.3333333333333, 190, 824, 421.0, 824.0, 824.0, 824.0, 0.024792159066492573, 0.024864792345007686, 0.015898617630530718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 258.6, 163, 324, 320.0, 324.0, 324.0, 324.0, 0.03208913076962571, 0.04973188528456641, 0.07216920718989064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 296.125, 160, 1027, 320.0, 534.9000000000005, 1027.0, 1027.0, 0.10635327900453331, 8.10674363915994, 0.2374902994177158], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46b25e7c-7b34-4bfc-b41b-e9b6008e9909", 3, 0, 0.0, 578.0, 178, 1138, 418.0, 1138.0, 1138.0, 1138.0, 0.0670331143584931, 0.030330738593198375, 0.04298673023640345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 93.1875, 81, 237, 83.0, 136.9000000000001, 237.0, 237.0, 0.08435259384226065, 0.06993686735554618, 0.029984711092366088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38bca99f-483f-4643-b465-2943e5a1835a", 3, 0, 0.0, 337.6666666666667, 204, 531, 278.0, 531.0, 531.0, 531.0, 0.017696818112103444, 0.02439649241691344, 0.01134854546902467], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 91.65, 81, 241, 83.0, 96.80000000000003, 233.8499999999999, 241.0, 0.10606984699424571, 0.08234914878947787, 0.037704515923735776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d833385-1150-4138-8db9-d07664bbfd6c", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 80.82352941176471, 79, 83, 81.0, 82.2, 83.0, 83.0, 0.0782285377705787, 0.05813663793301796, 0.039267058998122516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 127.05882352941177, 79, 241, 81.0, 240.2, 241.0, 241.0, 0.07822889775483063, 0.02093234178205429, 0.04461491825080185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 117.47058823529412, 78, 239, 81.0, 239.0, 239.0, 239.0, 0.07822889775483063, 0.021085132597981695, 0.04599003559414848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 154.8235294117647, 79, 242, 82.0, 239.6, 242.0, 242.0, 0.07822997772746516, 0.021085423684355845, 0.046067066962560056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/659d101f-93f8-4c8f-8926-ccdda02e6ff9", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 1.7076788101604279, 3.1908004679144386], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 30.0, 0.45385779122541603], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.0, 0.15128593040847202], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.07564296520423601], "isController": false}, {"data": ["401/Unauthorized", 11, 55.0, 0.8320726172465961], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1322, 20, "401/Unauthorized", 11, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
