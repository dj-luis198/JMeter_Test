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

    var data = {"OkPercent": 98.51330203442879, "KoPercent": 1.486697965571205};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.828083109919571, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/899440ed-b068-4b2b-8036-ce10bc4dd0bc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34bc1bde-6ab7-4a3c-abf6-76c400845bec"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/67633742-fd58-4ed9-92b1-3399a96fc322"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb737631-e060-4e86-b1b8-4c52120b9309"], "isController": false}, {"data": [0.36538461538461536, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=241c5677-6397-4270-a04f-390f0f88d166"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bff8bb07-c843-4ba0-8b15-6715d6cfe4b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=915adf24-f76d-439b-a9e2-3a6377dc1ad6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5d23fba9-1b2e-4686-ae53-8384ef654591"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c225f1ee-2210-41f6-9f7b-49247dc624d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39e4b02b-b2c6-4423-9eb2-56bc61ea4e21"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ca65f5e-8ee7-4680-bffe-5f9b6f38e0af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b97e3d24-58b1-460f-9b7c-5d38d547d876"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/26bd12d1-4738-4684-9e7c-14f637e4485a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5945a180-0737-44b1-8561-706d861ded63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb09f9a8-c494-4fc8-bcff-4a486017a082"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d23fba9-1b2e-4686-ae53-8384ef654591"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0ca65f5e-8ee7-4680-bffe-5f9b6f38e0af"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49038461538461536, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bff8bb07-c843-4ba0-8b15-6715d6cfe4b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/15014aad-bcf7-4727-a803-5601a6e75976"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/915adf24-f76d-439b-a9e2-3a6377dc1ad6"], "isController": false}, {"data": [0.3629032258064516, 500, 1500, "addBook"], "isController": true}, {"data": [0.9903846153846154, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34bc1bde-6ab7-4a3c-abf6-76c400845bec"], "isController": false}, {"data": [0.8653846153846154, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c225f1ee-2210-41f6-9f7b-49247dc624d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9431818181818182, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67633742-fd58-4ed9-92b1-3399a96fc322"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39e4b02b-b2c6-4423-9eb2-56bc61ea4e21"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b97e3d24-58b1-460f-9b7c-5d38d547d876"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26bd12d1-4738-4684-9e7c-14f637e4485a"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/241c5677-6397-4270-a04f-390f0f88d166"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/03c937cb-1518-4431-87db-22f1893f80a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bb737631-e060-4e86-b1b8-4c52120b9309"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5945a180-0737-44b1-8561-706d861ded63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1278, 19, 1.486697965571205, 294.266823161189, 78, 1726, 98.5, 859.4000000000005, 1040.1, 1376.3100000000004, 5.220140429129854, 707.0309149337679, 3.8045573985687504], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/899440ed-b068-4b2b-8036-ce10bc4dd0bc", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.9364690249266862, 1.7497938049853372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34bc1bde-6ab7-4a3c-abf6-76c400845bec", 1, 0, 0.0, 935.0, 935, 935, 935.0, 935.0, 935.0, 935.0, 1.0695187165775402, 0.19322359625668448, 0.7373830213903743], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67633742-fd58-4ed9-92b1-3399a96fc322", 3, 0, 0.0, 336.0, 178, 558, 272.0, 558.0, 558.0, 558.0, 0.01816200508536142, 0.02503779021370626, 0.011646858729870443], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb737631-e060-4e86-b1b8-4c52120b9309", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["see books", 52, 0, 0.0, 1366.2115384615386, 961, 2113, 1333.5, 1657.1000000000001, 1728.3499999999995, 2113.0, 0.24063936026951607, 289.57097989822574, 1.1832218544502084], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=241c5677-6397-4270-a04f-390f0f88d166", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 576.6428571428572, 87, 1632, 431.5, 1344.0, 1632.0, 1632.0, 0.07870253253506479, 0.014861032057227986, 0.05322412478567614], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 576.6428571428572, 87, 1632, 431.5, 1344.0, 1632.0, 1632.0, 0.07898359397919347, 0.014914103578520976, 0.053414198076749485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 98.77777777777777, 78, 241, 81.5, 238.3, 241.0, 241.0, 0.0909936506652647, 0.024347910431916527, 0.051894816395033766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 91.11111111111111, 78, 251, 82.0, 100.70000000000024, 251.0, 251.0, 0.09099227071211562, 0.06762218555851561, 0.04567385463479241], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 97.66666666666666, 78, 238, 80.5, 235.3, 238.0, 238.0, 0.0909936506652647, 0.024525632405872123, 0.05358317514761192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 90.44444444444444, 78, 242, 82.0, 101.60000000000022, 242.0, 242.0, 0.09099549066790691, 0.02452612834408428, 0.05349539588093745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bff8bb07-c843-4ba0-8b15-6715d6cfe4b4", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=915adf24-f76d-439b-a9e2-3a6377dc1ad6", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 0.7344067581300813, 2.802654979674797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d23fba9-1b2e-4686-ae53-8384ef654591", 3, 0, 0.0, 238.33333333333331, 166, 371, 178.0, 371.0, 371.0, 371.0, 0.03410757529247246, 0.0284340821367259, 0.02187237087440454], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 265.07142857142856, 80, 440, 258.5, 421.5, 440.0, 440.0, 0.07901167679709238, 0.15873983782853338, 0.05107430307468297], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c225f1ee-2210-41f6-9f7b-49247dc624d8", 1, 0, 0.0, 687.0, 687, 687, 687.0, 687.0, 687.0, 687.0, 1.455604075691412, 0.262975345705968, 1.0035707787481805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 103.06249999999999, 80, 245, 82.0, 243.6, 245.0, 245.0, 0.09983776363409459, 0.0741958380132285, 0.05011387744914514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 111.9375, 79, 240, 82.0, 237.9, 240.0, 240.0, 0.09983714066429138, 0.04545807308078697, 0.05589027430254398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 498.25, 395, 634, 482.0, 634.0, 634.0, 634.0, 0.03570217247719524, 10.497624131990932, 0.020361395240900408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 902.0, 767, 1106, 867.5, 1106.0, 1106.0, 1106.0, 0.03561221855218526, 32.04393685285922, 0.020275315835863283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 122.25, 80, 242, 83.5, 242.0, 242.0, 242.0, 0.035830093695695016, 0.06340247048496031, 0.019839514770956124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 92.0, 79, 244, 81.0, 134.80000000000013, 244.0, 244.0, 0.08228759514503188, 0.06115318350133717, 0.04130451553178358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 130.24999999999997, 78, 244, 81.0, 242.6, 244.0, 244.0, 0.0822888647736799, 0.0297433262444905, 0.04649843201139701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 140.0625, 78, 880, 81.0, 430.6000000000005, 880.0, 880.0, 0.0822914041485154, 4.648665730066193, 0.0479363501704975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 133.68750000000003, 78, 460, 81.0, 304.60000000000014, 460.0, 460.0, 0.08228928799193565, 1.533029746934724, 0.04801547810076323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39e4b02b-b2c6-4423-9eb2-56bc61ea4e21", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.48696512803234504, 1.858364218328841], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ca65f5e-8ee7-4680-bffe-5f9b6f38e0af", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 0.6082965067340068, 2.3213909932659935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 123.0, 79, 245, 84.0, 245.0, 245.0, 245.0, 0.03583169851208872, 0.02662883063251906, 0.020120338519971692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 656.7333333333332, 78, 1195, 873.0, 1168.0, 1195.0, 1195.0, 0.07848800703252543, 47.08948278692599, 0.04164565477311734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 219.3125, 78, 894, 82.5, 869.5, 894.0, 894.0, 0.09983963259015208, 11.253030776346742, 0.057622287949980346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 441.99999999999994, 79, 735, 623.0, 688.8000000000001, 735.0, 735.0, 0.07848841772582427, 15.39251894187148, 0.041722521531989264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 210.75, 78, 629, 158.0, 620.6, 629.0, 629.0, 0.09971394561850691, 3.6884178746595704, 0.05764712481069931], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 445.92857142857144, 86, 935, 398.5, 901.0, 935.0, 935.0, 0.07875698968283434, 0.014871314946388992, 0.05389821608386494], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 263.6875, 162, 959, 164.0, 625.8000000000004, 959.0, 959.0, 0.08225206144228989, 6.269636273994468, 0.18367150390183215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b97e3d24-58b1-460f-9b7c-5d38d547d876", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.069018121301775, 4.0796042899408285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 426.33333333333326, 93, 918, 358.0, 782.0, 905.9999999999998, 918.0, 0.09397823285121007, 0.05772686373379995, 0.042492111142685814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 82.53333333333332, 78, 93, 82.0, 88.2, 93.0, 93.0, 0.07848718565882144, 0.05832885574840148, 0.0393968881139006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 123.59999999999998, 78, 258, 81.0, 249.0, 258.0, 258.0, 0.07848841772582427, 0.09959239983569758, 0.040368391929297635], "isController": false}, {"data": ["login", 21, 0, 0.0, 2162.095238095238, 1589, 3136, 2206.0, 2726.8, 3096.4999999999995, 3136.0, 0.08916326643257771, 20.442113469279008, 0.1626906196528577], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 100.1875, 80, 256, 86.5, 156.6000000000001, 256.0, 256.0, 0.10049367517931841, 0.08135669601919429, 0.035722361098898335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26bd12d1-4738-4684-9e7c-14f637e4485a", 3, 0, 0.0, 372.33333333333337, 177, 760, 180.0, 760.0, 760.0, 760.0, 0.03328303896334428, 0.027746700125366116, 0.02134361548105086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 740.7333333333335, 160, 1278, 956.0, 1249.2, 1278.0, 1278.0, 0.07845352413230403, 62.61232235997353, 0.16306176809399778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5945a180-0737-44b1-8561-706d861ded63", 3, 0, 0.0, 515.3333333333334, 239, 867, 440.0, 867.0, 867.0, 867.0, 0.03093517019499469, 0.031025800576425337, 0.019837983490930838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 209.44444444444443, 161, 490, 167.0, 342.4000000000002, 490.0, 490.0, 0.0909545681931875, 0.1409618161353404, 0.2045589556141707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 711.0, 80, 1186, 910.0, 1186.0, 1186.0, 1186.0, 0.051210269366016865, 40.84809140392954, 0.08829270563056911], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb09f9a8-c494-4fc8-bcff-4a486017a082", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 1.2876449092741935, 2.4059664818548385], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 979.7826086956522, 137, 1570, 1079.0, 1430.2000000000003, 1554.9999999999998, 1570.0, 0.09147129590964227, 0.028957624927916644, 0.041269276084233135], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 96.15789473684208, 81, 272, 85.0, 107.0, 272.0, 272.0, 0.10213296637137696, 0.07929268385277802, 0.036305077889825406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 376.8125, 163, 1138, 320.5, 1114.9, 1138.0, 1138.0, 0.09966301443245028, 15.039102647454545, 0.2209569907375686], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d23fba9-1b2e-4686-ae53-8384ef654591", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ca65f5e-8ee7-4680-bffe-5f9b6f38e0af", 3, 0, 0.0, 344.0, 247, 398, 387.0, 398.0, 398.0, 398.0, 0.10281719103434094, 0.04652210141202275, 0.06593420128178765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 314.2666666666667, 161, 1053, 321.0, 714.6000000000001, 1053.0, 1053.0, 0.12102630304986284, 9.827698256212683, 0.27012661116265935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 104.28571428571429, 80, 238, 82.0, 238.0, 238.0, 238.0, 0.04220528651360216, 0.03136545218442505, 0.02118507545702296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 127.85714285714285, 79, 257, 81.0, 257.0, 257.0, 257.0, 0.04220579545865641, 0.020349222810423624, 0.02356411738637597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 228.57142857142858, 80, 955, 80.0, 955.0, 955.0, 955.0, 0.04220604993578651, 5.435047574131912, 0.024294386444622645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 185.28571428571428, 80, 483, 81.0, 483.0, 483.0, 483.0, 0.04220579545865641, 1.782594273427231, 0.024335456561192372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 11.627906976744185, 3.429324127906977, 7.18795421511628], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 943.9038461538464, 624, 1726, 894.0, 1317.5000000000002, 1383.9499999999996, 1726.0, 0.23619722468260998, 282.5739961617951, 0.4663972542072631], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 979.7826086956522, 137, 1570, 1079.0, 1430.2000000000003, 1554.9999999999998, 1570.0, 0.09396077341972277, 0.029745733976624195, 0.042392458320226485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 80.75, 78, 83, 80.5, 83.0, 83.0, 83.0, 0.036746298958701754, 0.009904275891212582, 0.02163868971884488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 99.5, 79, 232, 80.5, 232.0, 232.0, 232.0, 0.036745117492513184, 0.009903957449153943, 0.02160211008837201], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 167.8421052631579, 78, 957, 81.0, 242.0, 957.0, 957.0, 0.1008888841689411, 4.803656002423988, 0.05885530609156463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 159.7368421052632, 79, 476, 82.0, 242.0, 476.0, 476.0, 0.1008888841689411, 1.5870605525790384, 0.05895383039251086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 82.375, 79, 92, 82.0, 92.0, 92.0, 92.0, 0.03674596138918107, 0.009832415449839465, 0.020956681104767328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 116.57894736842108, 79, 242, 83.0, 238.0, 242.0, 242.0, 0.1008888841689411, 0.0749769930200822, 0.05064149068636301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 82.125, 81, 86, 81.0, 86.0, 86.0, 86.0, 0.036745117492513184, 0.02730765079277591, 0.018444326553859157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 126.47368421052633, 78, 326, 81.0, 239.0, 326.0, 326.0, 0.10088727705239235, 0.034970384274328435, 0.05709133019874793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bff8bb07-c843-4ba0-8b15-6715d6cfe4b4", 3, 0, 0.0, 332.3333333333333, 179, 490, 328.0, 490.0, 490.0, 490.0, 0.05827279437473292, 0.027391248397498156, 0.03736894691348432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 107.125, 82, 245, 85.0, 245.0, 245.0, 245.0, 0.03800854241990887, 0.02991688006879546, 0.013510849063326983], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 450.07142857142856, 82, 867, 401.5, 813.5, 867.0, 867.0, 0.0805106676634654, 0.015045206380470414, 0.0547951021479096], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/15014aad-bcf7-4727-a803-5601a6e75976", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.7943680037313432, 1.48427782960199], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1305.2380952380952, 918, 1725, 1280.0, 1697.0, 1722.2, 1725.0, 0.09028180821564454, 0.0467278890178629, 0.04152610514606307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 185.5, 163, 314, 166.5, 314.0, 314.0, 314.0, 0.03673094582185491, 0.05692579201101928, 0.0826087580348944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/915adf24-f76d-439b-a9e2-3a6377dc1ad6", 3, 0, 0.0, 277.0, 182, 373, 276.0, 373.0, 373.0, 373.0, 0.054373436763693044, 0.024602564160655382, 0.034868382299633884], "isController": false}, {"data": ["addBook", 62, 10, 16.129032258064516, 859.4677419354837, 413, 1804, 710.0, 1508.2, 1566.8999999999999, 1804.0, 0.31347645387345663, 97.9640284979169, 1.139823257108837], "isController": true}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 153.34615384615387, 79, 592, 83.0, 330.1, 337.54999999999995, 592.0, 0.23715919767219124, 0.17624819280130619, 0.1146423855934909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34bc1bde-6ab7-4a3c-abf6-76c400845bec", 3, 0, 0.0, 353.6666666666667, 281, 403, 377.0, 403.0, 403.0, 403.0, 0.023694623689884765, 0.027952251384160933, 0.01519479448863053], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 501.00000000000017, 389, 798, 469.0, 684.1000000000001, 729.7499999999999, 798.0, 0.23728798090744402, 69.77054508927961, 0.11933917008528677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c225f1ee-2210-41f6-9f7b-49247dc624d8", 3, 0, 0.0, 366.3333333333333, 190, 481, 428.0, 481.0, 481.0, 481.0, 0.024022100332305722, 0.028393309344597027, 0.01540479741362053], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 127.63461538461542, 78, 319, 84.0, 244.4, 258.54999999999995, 319.0, 0.23756007528827003, 0.42036997697494655, 0.11553214598980319], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 789.0961538461538, 541, 1101, 799.5, 990.3000000000001, 1047.6499999999996, 1101.0, 0.23686967612626975, 213.1357509508951, 0.118897474149319], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 96.06666666666666, 80, 247, 85.0, 155.20000000000005, 247.0, 247.0, 0.12646381870146953, 0.09447736455725017, 0.04495393555403799], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 10, 5.681818181818182, 136.14772727272742, 79, 434, 87.0, 273.3, 342.6, 411.66999999999973, 0.7478287472168873, 1.5106826181335724, 0.36381048622677903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 106.57142857142857, 82, 244, 84.0, 244.0, 244.0, 244.0, 0.04060678133248252, 0.03144646249673696, 0.014434441801780898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67633742-fd58-4ed9-92b1-3399a96fc322", 1, 0, 0.0, 867.0, 867, 867, 867.0, 867.0, 867.0, 867.0, 1.1534025374855825, 0.20837838811995388, 0.7952169838523645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 99.27777777777779, 82, 246, 87.5, 124.5000000000002, 246.0, 246.0, 0.08951037823107602, 0.07263976983400798, 0.0318181422618278], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39e4b02b-b2c6-4423-9eb2-56bc61ea4e21", 3, 0, 0.0, 258.6666666666667, 197, 381, 198.0, 381.0, 381.0, 381.0, 0.017687949200209895, 0.024384265905888318, 0.011342858048311685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 359.2857142857143, 161, 1039, 168.0, 1039.0, 1039.0, 1039.0, 0.04218443032940014, 7.265644303143343, 0.09333187508286228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b97e3d24-58b1-460f-9b7c-5d38d547d876", 3, 0, 0.0, 279.0, 176, 416, 245.0, 416.0, 416.0, 416.0, 0.10551491277433878, 0.04774275024620146, 0.06766418560073158], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26bd12d1-4738-4684-9e7c-14f637e4485a", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 332.6315789473685, 161, 1038, 319.0, 485.0, 1038.0, 1038.0, 0.1008439042513667, 6.4977662577623265, 0.22544231164747094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 88.62500000000001, 80, 111, 86.0, 106.10000000000001, 111.0, 111.0, 0.08216842472858743, 0.06812596933063547, 0.02920830722774006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/241c5677-6397-4270-a04f-390f0f88d166", 3, 0, 0.0, 435.3333333333333, 369, 563, 374.0, 563.0, 563.0, 563.0, 0.031247396050329137, 0.03133894115594534, 0.020038206451545706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 96.26666666666668, 81, 237, 84.0, 157.20000000000005, 237.0, 237.0, 0.07593052862834031, 0.0589499709565728, 0.026990930098355344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03c937cb-1518-4431-87db-22f1893f80a5", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.7676344651442308, 1.434326171875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb737631-e060-4e86-b1b8-4c52120b9309", 3, 0, 0.0, 351.6666666666667, 300, 442, 313.0, 442.0, 442.0, 442.0, 0.04121445253468883, 0.03435879327517516, 0.02642984098090397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 92.46666666666665, 79, 242, 82.0, 149.00000000000006, 242.0, 242.0, 0.12126209589406543, 0.09011763181189823, 0.06086788797807582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 113.26666666666667, 78, 247, 82.0, 242.8, 247.0, 247.0, 0.12126699759082898, 0.044590885572461075, 0.06848111569680017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 203.73333333333332, 79, 973, 83.0, 535.6000000000003, 973.0, 973.0, 0.12110838392972484, 7.295368777552158, 0.07050463340492184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5945a180-0737-44b1-8561-706d861ded63", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 153.33333333333334, 78, 462, 82.0, 375.6, 462.0, 462.0, 0.12126601721977445, 2.4075883473462953, 0.07071482527588019], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 26.31578947368421, 0.39123630672926446], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.0782472613458529], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.0782472613458529], "isController": false}, {"data": ["401/Unauthorized", 12, 63.1578947368421, 0.9389671361502347], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1278, 19, "401/Unauthorized", 12, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
