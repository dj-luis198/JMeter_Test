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

    var data = {"OkPercent": 99.53846153846153, "KoPercent": 0.46153846153846156};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7963576158940397, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/55229daf-3b17-4ce6-bab2-2d24921668ff"], "isController": false}, {"data": [0.12727272727272726, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6a30f6bb-4ed9-42bb-a08c-9bcae2e96f4b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16f5684a-6ac0-4ad2-902e-c794e4c03ed9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2d5e77d6-9133-4d08-8155-7f88bec3b258"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67216ad6-5f28-4449-a808-8683e221f3a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9648740a-1a76-4354-923c-228b102bab8c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b8a61cfe-c609-49b6-aa6b-5294bc7dbce0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f1e85db-a159-4322-89fc-9c9720f1425c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/37bdd911-d047-4689-8e66-88e46bb093c7"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c63c2b43-6102-4c07-8873-cf14aa63a5b0"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf754d18-0b6c-421e-9cc9-649d5a416c41"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85d02bb6-e6f0-4008-a531-cbd374d9ec99"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/512935a6-1714-4bc5-be7c-42f80eb46ad9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9648740a-1a76-4354-923c-228b102bab8c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/67216ad6-5f28-4449-a808-8683e221f3a4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/16f5684a-6ac0-4ad2-902e-c794e4c03ed9"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6d398580-d4a1-4fda-8f23-5fd2b5a763fa"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fdfdbc50-1584-41ef-8cf2-f26e483f0601"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37bdd911-d047-4689-8e66-88e46bb093c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.42727272727272725, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d5e77d6-9133-4d08-8155-7f88bec3b258"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8a61cfe-c609-49b6-aa6b-5294bc7dbce0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ccda196c-34cb-459f-9147-4a5567a827ae"], "isController": false}, {"data": [0.3442622950819672, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55229daf-3b17-4ce6-bab2-2d24921668ff"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a30f6bb-4ed9-42bb-a08c-9bcae2e96f4b"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6181818181818182, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c0f45a6-0580-409b-b19d-f7c89426f7bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.980225988700565, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f1e85db-a159-4322-89fc-9c9720f1425c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fdfdbc50-1584-41ef-8cf2-f26e483f0601"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/85d02bb6-e6f0-4008-a531-cbd374d9ec99"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=512935a6-1714-4bc5-be7c-42f80eb46ad9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d398580-d4a1-4fda-8f23-5fd2b5a763fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1300, 6, 0.46153846153846156, 375.7338461538458, 94, 3027, 122.5, 1040.0, 1269.95, 2007.7100000000003, 5.305212983896638, 745.5377109140984, 3.873526815045992], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/55229daf-3b17-4ce6-bab2-2d24921668ff", 3, 0, 0.0, 327.3333333333333, 206, 479, 297.0, 479.0, 479.0, 479.0, 0.019962072063080146, 0.027519327860398575, 0.012801198556076789], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1701.7090909090912, 1195, 2557, 1656.0, 2037.0, 2166.6, 2557.0, 0.24227260513529825, 291.5346871737579, 1.1912525066955337], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6a30f6bb-4ed9-42bb-a08c-9bcae2e96f4b", 3, 0, 0.0, 492.66666666666663, 223, 998, 257.0, 998.0, 998.0, 998.0, 0.03255420274757471, 0.027139099360852487, 0.020876230277578837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16f5684a-6ac0-4ad2-902e-c794e4c03ed9", 1, 0, 0.0, 960.0, 960, 960, 960.0, 960.0, 960.0, 960.0, 1.0416666666666667, 0.18819173177083334, 0.7181803385416667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d5e77d6-9133-4d08-8155-7f88bec3b258", 3, 0, 0.0, 887.3333333333334, 203, 2008, 451.0, 2008.0, 2008.0, 2008.0, 0.06284960090503425, 0.0284378077011711, 0.04030394328871012], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 655.8461538461539, 454, 985, 615.0, 960.1999999999999, 985.0, 985.0, 0.07478355912215606, 0.013510701599217648, 0.05082945034084045], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 655.8461538461539, 454, 985, 615.0, 960.1999999999999, 985.0, 985.0, 0.07228768273492107, 0.01305978643160195, 0.049133034358891665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 170.1764705882353, 97, 306, 101.0, 303.6, 306.0, 306.0, 0.11016784395048927, 0.029478505119564513, 0.06283009850301341], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67216ad6-5f28-4449-a808-8683e221f3a4", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 124.58823529411765, 95, 297, 102.0, 293.0, 297.0, 297.0, 0.11031081694893258, 0.08197903486146259, 0.05537085928881967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 124.17647058823528, 97, 311, 101.0, 295.8, 311.0, 311.0, 0.11031224855296286, 0.02973259824279077, 0.06495926355218418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 159.00000000000003, 95, 313, 101.0, 311.4, 313.0, 313.0, 0.11031224855296286, 0.02973259824279077, 0.06485153674695668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9648740a-1a76-4354-923c-228b102bab8c", 3, 0, 0.0, 406.0, 211, 668, 339.0, 668.0, 668.0, 668.0, 0.05633062320446138, 0.024938036314475092, 0.03612347907317348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8a61cfe-c609-49b6-aa6b-5294bc7dbce0", 3, 0, 0.0, 1051.6666666666667, 304, 2406, 445.0, 2406.0, 2406.0, 2406.0, 0.021127802074750162, 0.024972346788221956, 0.013548753283612573], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 279.7692307692308, 203, 543, 257.0, 461.79999999999995, 543.0, 543.0, 0.0752458513489266, 0.19262530966561903, 0.04864526718065371], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7f1e85db-a159-4322-89fc-9c9720f1425c", 3, 0, 0.0, 292.0, 198, 453, 225.0, 453.0, 453.0, 453.0, 0.026694428872694267, 0.02697249584011817, 0.01711849768203376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 104.33333333333333, 98, 149, 101.0, 123.80000000000001, 149.0, 149.0, 0.07079846508927685, 0.05261487493451142, 0.035537510796765925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 127.19999999999999, 97, 308, 100.0, 296.6, 308.0, 308.0, 0.07073769989295028, 0.026010841731470263, 0.039946537035901744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 788.75, 760, 834, 780.5, 834.0, 834.0, 834.0, 0.11656030538800012, 34.27259995046187, 0.06647579916659381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 813.0, 686, 965, 800.5, 965.0, 965.0, 965.0, 0.11681219519317816, 105.10781856875857, 0.06650538066174108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 251.0, 105, 303, 298.0, 303.0, 303.0, 303.0, 0.11882835244489334, 0.21027048303725268, 0.06579655843384231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 121.8, 100, 296, 102.0, 277.1000000000001, 296.0, 296.0, 0.06773094559173141, 0.05033520468291758, 0.033997759798974556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 163.20000000000002, 101, 311, 102.5, 310.6, 311.0, 311.0, 0.06763749010801706, 0.028257146746298537, 0.03800645684389944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 233.8, 98, 1053, 102.5, 977.1000000000003, 1053.0, 1053.0, 0.06773140434293765, 6.110913825757576, 0.03923659087522521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 253.39999999999998, 96, 851, 195.0, 796.8000000000002, 851.0, 851.0, 0.0677323218639935, 2.007985534916012, 0.039303267237875916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 98.5, 95, 101, 99.0, 101.0, 101.0, 101.0, 0.11886366337810532, 0.08833520295970522, 0.06674473285391655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 618.8571428571429, 95, 1296, 304.0, 1256.0, 1293.3999999999999, 1296.0, 0.09779677829470361, 41.91748011174446, 0.05349170881242112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 206.0, 96, 894, 103.0, 542.4000000000002, 894.0, 894.0, 0.07073503128846217, 4.260961314127201, 0.041179208970145105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 433.76190476190476, 95, 898, 302.0, 892.4, 898.0, 898.0, 0.09779860008289595, 13.707157809683924, 0.053588211717669414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 161.73333333333332, 95, 814, 100.0, 513.4000000000002, 814.0, 814.0, 0.0708028094554792, 1.405703122049883, 0.041287810175307756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37bdd911-d047-4689-8e66-88e46bb093c7", 3, 0, 0.0, 440.3333333333333, 314, 648, 359.0, 648.0, 648.0, 648.0, 0.020946210132380048, 0.024757711259984362, 0.013432302721610905], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 577.2307692307692, 224, 1035, 494.0, 1015.4, 1035.0, 1035.0, 0.07229331064435585, 0.013060803192583818, 0.04984284894034689], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c63c2b43-6102-4c07-8873-cf14aa63a5b0", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.8023516017587939, 1.499195194723618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 439.6, 203, 1156, 404.0, 1099.7000000000003, 1156.0, 1156.0, 0.06758994531973424, 8.180383359608925, 0.1502820190468466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf754d18-0b6c-421e-9cc9-649d5a416c41", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 1.6209946065989846, 3.0288309010152283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 607.7142857142856, 128, 1700, 520.0, 1055.6, 1636.1999999999991, 1700.0, 0.09162303664921466, 0.05628016606675393, 0.041427212859947646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 111.28571428571429, 97, 293, 102.0, 110.6, 274.7999999999997, 293.0, 0.09779814462948475, 0.07268006646781043, 0.04909008431597183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 165.9047619047619, 95, 305, 102.0, 301.8, 304.7, 305.0, 0.09779632285826054, 0.09611362943110482, 0.05186334011698303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85d02bb6-e6f0-4008-a531-cbd374d9ec99", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["login", 21, 0, 0.0, 3079.666666666667, 2031, 5478, 2732.0, 4395.0, 5375.699999999999, 5478.0, 0.09660946772783734, 22.14927492581773, 0.17627723610663845], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 107.93333333333332, 98, 123, 105.0, 122.4, 123.0, 123.0, 0.07478946764856928, 0.060547332695960875, 0.02658531857820236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/512935a6-1714-4bc5-be7c-42f80eb46ad9", 3, 0, 0.0, 305.0, 229, 431, 255.0, 431.0, 431.0, 431.0, 0.01922916680020255, 0.02649643979988847, 0.012331203970181972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9648740a-1a76-4354-923c-228b102bab8c", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 0.5117962110481586, 1.953125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67216ad6-5f28-4449-a808-8683e221f3a4", 3, 0, 0.0, 451.0, 376, 543, 434.0, 543.0, 543.0, 543.0, 0.036912627809973786, 0.03077253900434339, 0.023671183849494914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16f5684a-6ac0-4ad2-902e-c794e4c03ed9", 3, 0, 0.0, 1314.0, 205, 2379, 1358.0, 2379.0, 2379.0, 2379.0, 0.019091620687680177, 0.026319340368595557, 0.012242998943596988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 751.3333333333336, 200, 1397, 593.0, 1360.2, 1394.8, 1397.0, 0.09775080062560512, 55.76694539948658, 0.20793409937765325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 343.82352941176475, 197, 611, 394.0, 595.0, 611.0, 611.0, 0.11009435734037937, 0.17062475107341998, 0.24760478999501337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 936.75, 862, 1065, 910.0, 1065.0, 1065.0, 1065.0, 0.11623514369569639, 139.05764173422835, 0.26209662772789355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d398580-d4a1-4fda-8f23-5fd2b5a763fa", 3, 0, 0.0, 595.6666666666667, 212, 1235, 340.0, 1235.0, 1235.0, 1235.0, 0.02689473401108063, 0.026973527177128715, 0.01724694856830366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fdfdbc50-1584-41ef-8cf2-f26e483f0601", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1376.2857142857142, 118, 2603, 1368.0, 2471.4, 2592.5, 2603.0, 0.0915032679738562, 0.029054330065359478, 0.041283700980392156], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37bdd911-d047-4689-8e66-88e46bb093c7", 1, 0, 0.0, 986.0, 986, 986, 986.0, 986.0, 986.0, 986.0, 1.0141987829614605, 0.18322927231237324, 0.6992425202839757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 120.3888888888889, 100, 326, 106.5, 146.9000000000003, 326.0, 326.0, 0.0846871515476577, 0.06574832566444128, 0.030103635901706446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 326.93333333333334, 196, 994, 220.0, 644.8000000000002, 994.0, 994.0, 0.07069869160288074, 5.740945486006372, 0.15779708621234115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 460.00000000000006, 201, 1181, 405.0, 1087.9, 1181.0, 1181.0, 0.11462303349858155, 17.296562585071783, 0.2541239666017136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 101.25, 95, 113, 100.0, 111.80000000000001, 113.0, 113.0, 0.060527802437252844, 0.04498208755346623, 0.030382119582761682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 158.75000000000003, 98, 385, 101.5, 364.00000000000006, 385.0, 385.0, 0.06046680372475511, 0.02374778603317612, 0.03406178510601846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 187.0, 95, 931, 100.5, 741.7000000000007, 931.0, 931.0, 0.0602796977977817, 4.534874827009825, 0.03500617866902427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 196.49999999999997, 95, 853, 100.5, 688.0000000000006, 853.0, 853.0, 0.060303325728413924, 1.4924974967838227, 0.03507879006402203], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1159.4363636363637, 771, 2124, 1136.0, 1549.4, 1648.3999999999994, 2124.0, 0.24372410431391664, 291.5787609675847, 0.4812599012917378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1376.2857142857142, 118, 2603, 1368.0, 2471.4, 2592.5, 2603.0, 0.0971776824510988, 0.03085608332292144, 0.04384383719961685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 126.0, 96, 287, 101.0, 287.0, 287.0, 287.0, 0.034687465931953106, 0.009349356051971736, 0.020426310504851292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 127.42857142857143, 95, 308, 98.0, 308.0, 308.0, 308.0, 0.03468763782141813, 0.009349402381554106, 0.020392537078607144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 235.8888888888889, 95, 1264, 100.5, 1192.9, 1264.0, 1264.0, 0.08276775368316504, 8.294782024798138, 0.04786806935018117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 177.22222222222223, 96, 605, 102.0, 592.4, 605.0, 605.0, 0.08276851485694842, 2.723906794605332, 0.04794933819674996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 125.22222222222221, 96, 308, 104.5, 288.20000000000005, 308.0, 308.0, 0.08276432857438444, 0.06150747465342437, 0.041543813366439065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 99.57142857142857, 97, 101, 100.0, 101.0, 101.0, 101.0, 0.03468677839112811, 0.009281423124188577, 0.01978230330119025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 144.55555555555557, 95, 307, 101.5, 298.90000000000003, 307.0, 307.0, 0.08276775368316504, 0.03595942770696536, 0.046431129182070666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 130.85714285714286, 96, 309, 102.0, 309.0, 309.0, 309.0, 0.03468540339124144, 0.025776945293686265, 0.01741044662411924], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 163.28571428571428, 101, 305, 109.0, 305.0, 305.0, 305.0, 0.03430851194181277, 0.02700455139170028, 0.012195603854316256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d5e77d6-9133-4d08-8155-7f88bec3b258", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 0.8065359933035714, 3.077915736607143], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 656.5384615384615, 431, 1358, 478.0, 1308.8, 1358.0, 1358.0, 0.07287444853662502, 0.013165793925073855, 0.04960301819338636], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1741.2857142857142, 1248, 3027, 1571.0, 2555.0, 2986.5999999999995, 3027.0, 0.09454902366877226, 0.04893650639106377, 0.04348885756639818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 262.57142857142856, 197, 618, 204.0, 618.0, 618.0, 618.0, 0.03466805338880222, 0.05372871164846594, 0.0779692646039175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8a61cfe-c609-49b6-aa6b-5294bc7dbce0", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.3421667850378788, 1.305782433712121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ccda196c-34cb-459f-9147-4a5567a827ae", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["addBook", 61, 2, 3.278688524590164, 1093.2622950819673, 615, 2100, 862.0, 1892.0, 1967.6, 2100.0, 0.2988452814289704, 100.76126223397871, 1.0863186731759416], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55229daf-3b17-4ce6-bab2-2d24921668ff", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a30f6bb-4ed9-42bb-a08c-9bcae2e96f4b", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 179.4, 97, 710, 105.0, 408.4, 426.9999999999999, 710.0, 0.24469022217872174, 0.18184497956836645, 0.11828287107272194], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 638.3818181818183, 469, 908, 593.0, 837.4, 884.5999999999999, 908.0, 0.24494958492179428, 72.02331105869438, 0.1231924181979727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c0f45a6-0580-409b-b19d-f7c89426f7bb", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 1.116559222027972, 2.0862926136363638], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 150.5636363636364, 95, 444, 104.0, 307.4, 335.7999999999996, 444.0, 0.24538453988168002, 0.4342156115875041, 0.11933740318464517], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 978.4909090909089, 673, 1384, 967.0, 1223.4, 1296.5999999999997, 1384.0, 0.24452595309547628, 220.02488242608646, 0.12274056629987773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 123.62500000000003, 98, 400, 105.0, 198.4000000000002, 400.0, 400.0, 0.11227439863025233, 0.08387687007045218, 0.039910040138097506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 2, 1.1299435028248588, 175.728813559322, 98, 1049, 109.0, 326.6, 432.4, 732.3199999999995, 0.7519691395263869, 1.5672039559630728, 0.3645047266252305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 108.08333333333333, 98, 125, 106.5, 122.9, 125.0, 125.0, 0.06241969965721182, 0.048338693191571254, 0.022188252612524512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f1e85db-a159-4322-89fc-9c9720f1425c", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 104.41176470588235, 97, 112, 105.0, 111.2, 112.0, 112.0, 0.10934374457301267, 0.08873501146501321, 0.0388682842036881], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fdfdbc50-1584-41ef-8cf2-f26e483f0601", 3, 0, 0.0, 406.6666666666667, 261, 502, 457.0, 502.0, 502.0, 502.0, 0.019601437438745508, 0.02316823546226723, 0.012569932211695523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85d02bb6-e6f0-4008-a531-cbd374d9ec99", 3, 0, 0.0, 584.6666666666666, 211, 1065, 478.0, 1065.0, 1065.0, 1065.0, 0.03175846627780189, 0.03185150865947514, 0.020365943544033115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 347.3333333333333, 198, 1026, 219.0, 863.4000000000005, 1026.0, 1026.0, 0.06024489550020835, 6.091740464048859, 0.1342076635272382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 407.38888888888897, 198, 1573, 214.0, 1316.5000000000005, 1573.0, 1573.0, 0.08272629087483052, 11.110564549486407, 0.18370155628834708], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=512935a6-1714-4bc5-be7c-42f80eb46ad9", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 133.09999999999997, 97, 311, 108.5, 296.4000000000001, 311.0, 311.0, 0.07023113065097235, 0.05822874015886282, 0.024964972223587827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 117.99999999999999, 100, 288, 108.0, 122.8, 271.4999999999998, 288.0, 0.09614724263443444, 0.07464556434997596, 0.034177340155209124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 124.625, 95, 293, 102.5, 289.5, 293.0, 293.0, 0.11485754075648047, 0.08535799659734536, 0.05765310151253024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d398580-d4a1-4fda-8f23-5fd2b5a763fa", 1, 0, 0.0, 1035.0, 1035, 1035, 1035.0, 1035.0, 1035.0, 1035.0, 0.966183574879227, 0.1745546497584541, 0.6661382850241546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 183.875, 94, 306, 104.0, 301.8, 306.0, 306.0, 0.1147109642173486, 0.05223045611947147, 0.06421685570077645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 274.8125, 94, 1078, 103.5, 987.0000000000001, 1078.0, 1078.0, 0.11470849703191764, 12.928916242185483, 0.06620382982994465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 269.81250000000006, 95, 815, 194.5, 806.6, 815.0, 815.0, 0.11486331265793706, 4.248792813505054, 0.06640535263036987], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 66.66666666666667, 0.3076923076923077], "isController": false}, {"data": ["401/Unauthorized", 2, 33.333333333333336, 0.15384615384615385], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1300, 6, "406/Not Acceptable", 4, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
