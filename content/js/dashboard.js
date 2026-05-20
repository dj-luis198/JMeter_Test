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

    var data = {"OkPercent": 96.74556213017752, "KoPercent": 3.2544378698224854};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7692063492063492, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8e436702-bf96-4671-8cd7-db1d376e5430"], "isController": false}, {"data": [0.13157894736842105, 500, 1500, "see books"], "isController": true}, {"data": [0.9318181818181818, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6860664b-e4b6-4496-a1da-c2c944a48457"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ef9493f2-5f04-4ee4-bbe0-913998279b5b"], "isController": false}, {"data": [0.45614035087719296, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83873353-8764-4d2f-b145-5f02f9a880eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6860664b-e4b6-4496-a1da-c2c944a48457"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f2e3a5cd-e63e-4023-ae1c-8ca0aa8a8455"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/83873353-8764-4d2f-b145-5f02f9a880eb"], "isController": false}, {"data": [0.3958333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.29310344827586204, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5d4c68b6-732c-4a25-9997-20dd70f23250"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9190751445086706, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba382cb9-0bf5-4a94-9c3e-d95f4fcc587a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d4c68b6-732c-4a25-9997-20dd70f23250"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/be07c1e0-0dea-4c00-becd-3d236b9f1f5f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7bedd192-e0fa-4594-801e-c945b896ae67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be07c1e0-0dea-4c00-becd-3d236b9f1f5f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef9493f2-5f04-4ee4-bbe0-913998279b5b"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8afa3e17-9dba-420f-a5c4-1e4ac43d759c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e436702-bf96-4671-8cd7-db1d376e5430"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7eab9eb9-bf12-4722-b196-aacfd6da7011"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7eab9eb9-bf12-4722-b196-aacfd6da7011"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8afa3e17-9dba-420f-a5c4-1e4ac43d759c"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75205679-c369-45a7-a14a-4f1caca96a6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ba382cb9-0bf5-4a94-9c3e-d95f4fcc587a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.1875, 500, 1500, "register"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75205679-c369-45a7-a14a-4f1caca96a6b"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1352, 44, 3.2544378698224854, 348.0177514792902, 97, 2462, 110.0, 984.4000000000001, 1190.0999999999995, 1569.94, 5.308664274102985, 764.3802679879102, 3.9018633333071566], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/8e436702-bf96-4671-8cd7-db1d376e5430", 3, 0, 0.0, 480.3333333333333, 254, 662, 525.0, 662.0, 662.0, 662.0, 0.020350158392066154, 0.02405319828176829, 0.013050069020953878], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1645.526315789474, 1186, 2200, 1611.0, 1928.8000000000002, 1987.6, 2200.0, 0.2662419251626645, 320.3803011920165, 1.3091094660097808], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 299.59090909090907, 199, 746, 206.0, 591.7, 722.8999999999996, 746.0, 0.11173865344764536, 0.17317308888809882, 0.2513028504784446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 120.99999999999999, 101, 342, 104.0, 225.5, 342.0, 342.0, 0.0920114357070093, 0.07143465955768788, 0.032707190036475965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 345.66666666666663, 199, 978, 396.0, 631.8000000000002, 978.0, 978.0, 0.07137996507140376, 5.796266931922548, 0.159317665530139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6860664b-e4b6-4496-a1da-c2c944a48457", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 0.8988261815920398, 3.4301150497512434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 102.5, 99, 118, 100.0, 118.0, 118.0, 118.0, 0.052207053172883655, 0.03879840572711374, 0.02620549348717012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 124.24999999999999, 98, 298, 99.5, 298.0, 298.0, 298.0, 0.05220841599665866, 0.013969830061605931, 0.02977511224809439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 99.25, 97, 101, 100.0, 101.0, 101.0, 101.0, 0.05220773457587742, 0.014071615959904459, 0.03069243770964668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 99.5, 98, 100, 100.0, 100.0, 100.0, 100.0, 0.05220773457587742, 0.014071615959904459, 0.03074342182544344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 106.6, 101, 115, 103.0, 115.0, 115.0, 115.0, 0.09293680297397769, 0.02740909618959108, 0.057450191682156135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef9493f2-5f04-4ee4-bbe0-913998279b5b", 3, 0, 0.0, 429.0, 234, 547, 506.0, 547.0, 547.0, 547.0, 0.037418614513433285, 0.031194359299772993, 0.023995660999825377], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1139.9298245614034, 779, 1776, 1085.0, 1503.0, 1575.8999999999999, 1776.0, 0.2566399971184281, 307.0306590526382, 0.5067637443100211], "isController": false}, {"data": ["deleteBook", 15, 5, 33.333333333333336, 379.3333333333333, 101, 828, 466.0, 688.8000000000001, 828.0, 828.0, 0.10121525786273862, 0.02214083765747407, 0.06718030949938933], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 5, 33.333333333333336, 379.3333333333333, 101, 828, 466.0, 688.8000000000001, 828.0, 828.0, 0.0989733167937924, 0.021650413048642084, 0.06569225030681727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 12, 50.0, 901.0000000000001, 135, 2462, 952.5, 1593.0, 2250.75, 2462.0, 0.09984191696480572, 0.03061558781928613, 0.04504586488060571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 118.23809523809524, 98, 296, 100.0, 255.20000000000013, 295.7, 296.0, 0.11591323066732903, 0.0310158449246564, 0.06610676436496109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 99.85714285714286, 98, 102, 100.0, 102.0, 102.0, 102.0, 0.03737958433902215, 0.010074966091377063, 0.02201161069963902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 138.99999999999997, 100, 299, 101.0, 297.8, 298.9, 299.0, 0.11591067150915695, 0.08614064552584808, 0.05818172378486979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 100.42857142857143, 99, 105, 100.0, 105.0, 105.0, 105.0, 0.03737918513376408, 0.01007485849308485, 0.021974872510279273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 180.14285714285714, 98, 398, 102.0, 307.6, 389.1999999999999, 398.0, 0.1157898799644911, 0.031208991084179242, 0.06818486095565247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83873353-8764-4d2f-b145-5f02f9a880eb", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 155.76190476190473, 97, 300, 100.0, 296.0, 299.6, 300.0, 0.11578796466812963, 0.031208474851956814, 0.06807065891622464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 99.64285714285714, 98, 101, 100.0, 101.0, 101.0, 101.0, 0.08977121165486818, 0.024196146891351186, 0.05277565372678773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6860664b-e4b6-4496-a1da-c2c944a48457", 3, 0, 0.0, 274.0, 200, 418, 204.0, 418.0, 418.0, 418.0, 0.0667541888253488, 0.03020453205313633, 0.042807861974588905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 127.57142857142857, 98, 297, 100.0, 295.0, 297.0, 297.0, 0.08977178729216229, 0.024196302043590617, 0.052863659899583845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 99.14285714285714, 97, 102, 99.0, 102.0, 102.0, 102.0, 0.03737958433902215, 0.01000195909071491, 0.02131804419334857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 103.14285714285714, 99, 134, 100.0, 118.5, 134.0, 134.0, 0.08977063602495625, 0.06671431056151533, 0.045060651285964363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 100.71428571428571, 99, 105, 100.0, 105.0, 105.0, 105.0, 0.037378985534332596, 0.02777871874182335, 0.018762498598288043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 127.85714285714286, 98, 297, 100.0, 297.0, 297.0, 297.0, 0.08977063602495625, 0.024020658467615242, 0.05119731585798285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 107.00000000000001, 102, 118, 104.0, 118.0, 118.0, 118.0, 0.038881544597131654, 0.030604028266882924, 0.013821174056011644], "isController": false}, {"data": ["deleteAccount", 15, 5, 33.333333333333336, 408.59999999999997, 99, 858, 424.0, 819.6, 858.0, 858.0, 0.1016294589925133, 0.021305133981503438, 0.0691424379213388], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f2e3a5cd-e63e-4023-ae1c-8ca0aa8a8455", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 0.9917265139751552, 1.8530425077639752], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83873353-8764-4d2f-b145-5f02f9a880eb", 3, 0, 0.0, 387.0, 196, 699, 266.0, 699.0, 699.0, 699.0, 0.016766895441640024, 0.023114518943797367, 0.010752208339853792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1277.0, 713, 1879, 1232.0, 1792.0, 1863.0, 1879.0, 0.10029754939654308, 0.05191181755875764, 0.04613295484938651], "isController": false}, {"data": ["goToProfile", 15, 5, 33.333333333333336, 169.66666666666669, 98, 254, 188.0, 242.0, 254.0, 254.0, 0.10194441990226928, 0.18428975959806712, 0.06587228955273584], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 202.14285714285714, 199, 210, 201.0, 210.0, 210.0, 210.0, 0.03735883696603548, 0.05789890064951006, 0.08402089993435519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 135.04545454545453, 99, 448, 101.0, 296.7, 425.3499999999997, 448.0, 0.11179543468097648, 0.08308234940646787, 0.05611606779884952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 135.1818181818182, 97, 296, 100.0, 295.4, 296.0, 296.0, 0.11179941152855205, 0.02991507691291334, 0.06376060188737734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 12, 0, 0.0, 659.0, 577, 884, 589.0, 854.0000000000001, 884.0, 884.0, 0.0927787227462502, 27.28002503092624, 0.05291286531622081], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 12, 0, 0.0, 1040.5833333333333, 771, 1217, 1078.0, 1189.1000000000001, 1217.0, 1217.0, 0.09278374428800075, 83.48697620676857, 0.05282512003896917], "isController": false}, {"data": ["addBook", 58, 12, 20.689655172413794, 983.7068965517244, 506, 2734, 825.0, 1793.7, 1914.449999999998, 2734.0, 0.2739984882842026, 68.9019189490032, 0.9991265929114701], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 12, 0, 0.0, 264.08333333333337, 98, 301, 296.0, 300.7, 301.0, 301.0, 0.09312648905375727, 0.16479023258340642, 0.051565155560039426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 115.07142857142856, 98, 297, 100.5, 202.5, 297.0, 297.0, 0.07024621297648258, 0.052204461010843, 0.03526030612296098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d4c68b6-732c-4a25-9997-20dd70f23250", 3, 0, 0.0, 390.66666666666663, 187, 794, 191.0, 794.0, 794.0, 794.0, 0.02295684113865932, 0.027134209041169265, 0.014721672214569942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 141.35714285714286, 97, 299, 99.0, 298.0, 299.0, 299.0, 0.07024621297648258, 0.026332529892272413, 0.039640894460082586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 182.92857142857144, 98, 1067, 100.0, 682.0, 1067.0, 1067.0, 0.07024691791647641, 4.532459916920476, 0.04086630129906622], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 192.94736842105254, 98, 436, 102.0, 403.2, 408.1, 436.0, 0.2578812117702414, 0.1916480489815954, 0.1246593748303413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 190.5, 97, 783, 100.5, 539.5, 783.0, 783.0, 0.07024621297648258, 1.492918225254517, 0.04093449101601112], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 637.1228070175438, 482, 900, 590.0, 788.4, 887.3, 900.0, 0.25771447948457105, 75.77661389454052, 0.12961226263140047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 12, 0, 0.0, 149.33333333333334, 98, 496, 100.0, 434.8000000000002, 496.0, 496.0, 0.09326763146849885, 0.06931315190188245, 0.052371961029674646], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 160.0701754385965, 98, 421, 102.0, 302.0, 404.79999999999995, 421.0, 0.2580423189403062, 0.4566139471873387, 0.1254932371408911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 874.7857142857142, 99, 1261, 1168.0, 1255.0, 1261.0, 1261.0, 0.06744290235712944, 43.35179520059446, 0.035509139717606934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 145.3181818181818, 98, 308, 100.0, 297.1, 306.5, 308.0, 0.11179827525751716, 0.030133128878002676, 0.06572515791506381], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 945.140350877193, 677, 1364, 964.0, 1172.2, 1197.3999999999999, 1364.0, 0.2571505909952179, 231.3845538000203, 0.12907754274564648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 117.26666666666668, 101, 296, 104.0, 185.60000000000008, 296.0, 296.0, 0.07161887300541438, 0.05350433383705274, 0.025458271263643393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 596.7857142857142, 99, 896, 780.5, 890.0, 896.0, 896.0, 0.06750761871696949, 14.18339966559619, 0.035609138723334495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 118.54545454545452, 98, 300, 100.0, 241.49999999999986, 300.0, 300.0, 0.11179827525751716, 0.030133128878002676, 0.06583433591824497], "isController": false}, {"data": ["deleteBooks", 15, 5, 33.333333333333336, 349.6666666666667, 101, 700, 396.0, 674.8000000000001, 700.0, 700.0, 0.09921225469770027, 0.021702680715121932, 0.06604461616432195], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 12, 6.936416184971098, 163.97687861271666, 99, 1551, 105.0, 314.79999999999995, 342.9, 1178.7799999999954, 0.7173214470819944, 1.563054738519747, 0.34317258603711], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 154.25, 103, 301, 104.5, 301.0, 301.0, 301.0, 0.051011299002729105, 0.03950386729410564, 0.01813292269237636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 341.49999999999994, 201, 1166, 202.5, 880.0, 1166.0, 1166.0, 0.07021063189568705, 6.10077791969659, 0.15662221038114343], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 103.52380952380952, 100, 118, 102.0, 111.4, 117.5, 118.0, 0.12204973817425215, 0.09904622306914408, 0.04338486786662869], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba382cb9-0bf5-4a94-9c3e-d95f4fcc587a", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d4c68b6-732c-4a25-9997-20dd70f23250", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 507.41666666666663, 117, 1429, 426.5, 1064.5, 1379.5, 1429.0, 0.10131070727537517, 0.06223089343379978, 0.04580747799658076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 115.21428571428572, 100, 299, 101.5, 200.5, 299.0, 299.0, 0.06750631666248771, 0.0501682685353058, 0.03388500660597527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 142.07142857142858, 99, 297, 101.0, 296.0, 297.0, 297.0, 0.06744452687664396, 0.0904027642621087, 0.03441853785083197], "isController": false}, {"data": ["login", 24, 0, 0.0, 2620.916666666667, 1507, 3614, 2579.5, 3506.5, 3604.0, 3614.0, 0.0993299368013277, 59.544853545250994, 0.23222252802966653], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 227.875, 199, 417, 201.0, 417.0, 417.0, 417.0, 0.05217300568685762, 0.08085796877445608, 0.11733831259456357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be07c1e0-0dea-4c00-becd-3d236b9f1f5f", 3, 0, 0.0, 279.6666666666667, 193, 426, 220.0, 426.0, 426.0, 426.0, 0.03075093790360606, 0.025635791657270545, 0.019719839736361957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 106.63636363636363, 100, 131, 103.5, 121.8, 129.79999999999998, 131.0, 0.11531848869878811, 0.0933584249329056, 0.040992119029647334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 245.92857142857144, 199, 400, 202.5, 399.0, 400.0, 400.0, 0.08971253540441129, 0.13903690789726633, 0.20176559476206954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7bedd192-e0fa-4594-801e-c945b896ae67", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 1.6047032035175879, 2.998390389447236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be07c1e0-0dea-4c00-becd-3d236b9f1f5f", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 104.0, 102, 113, 103.0, 110.0, 113.0, 113.0, 0.0699727106428493, 0.058014483726346724, 0.024873111986325334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef9493f2-5f04-4ee4-bbe0-913998279b5b", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 991.3571428571429, 201, 1363, 1271.0, 1356.0, 1363.0, 1363.0, 0.06740913008517625, 57.63324512969035, 0.13928524353955712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8afa3e17-9dba-420f-a5c4-1e4ac43d759c", 3, 0, 0.0, 338.3333333333333, 208, 519, 288.0, 519.0, 519.0, 519.0, 0.017366035507753935, 0.023940481893013642, 0.011136422509855224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e436702-bf96-4671-8cd7-db1d376e5430", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 119.07142857142857, 99, 296, 104.0, 206.5, 296.0, 296.0, 0.06652127017613882, 0.051644931435576524, 0.023646232757924344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7eab9eb9-bf12-4722-b196-aacfd6da7011", 3, 0, 0.0, 488.33333333333337, 185, 858, 422.0, 858.0, 858.0, 858.0, 0.024811843519973533, 0.024884534467785956, 0.01591124079894136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7eab9eb9-bf12-4722-b196-aacfd6da7011", 1, 0, 0.0, 658.0, 658, 658, 658.0, 658.0, 658.0, 658.0, 1.5197568389057752, 0.2745654445288754, 1.0478011018237081], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8afa3e17-9dba-420f-a5c4-1e4ac43d759c", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 348.09523809523813, 201, 605, 393.0, 596.6, 604.2, 605.0, 0.11572160687716979, 0.17934588878326996, 0.26026060609191604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 22, 10, 45.45454545454545, 694.8636363636364, 98, 1574, 976.0, 1289.8, 1535.5999999999995, 1574.0, 0.1699629171817058, 110.93052886472498, 0.2602330833783993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75205679-c369-45a7-a14a-4f1caca96a6b", 3, 0, 0.0, 478.3333333333333, 200, 814, 421.0, 814.0, 814.0, 814.0, 0.043127614611635834, 0.035953717780077915, 0.027656705984675317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 100.19999999999999, 98, 103, 100.0, 102.4, 103.0, 103.0, 0.07141428857085726, 0.0530725328148656, 0.03584662531779358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba382cb9-0bf5-4a94-9c3e-d95f4fcc587a", 3, 0, 0.0, 768.3333333333334, 188, 1693, 424.0, 1693.0, 1693.0, 1693.0, 0.020871452722681007, 0.024669350532569904, 0.01338436258583385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 151.8, 98, 300, 100.0, 297.0, 300.0, 300.0, 0.07141564859692057, 0.026260129119492662, 0.04032938384958912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 204.6, 98, 878, 101.0, 530.0000000000002, 878.0, 878.0, 0.0714153085855484, 4.301940093565957, 0.04157524019348788], "isController": false}, {"data": ["register", 24, 12, 50.0, 901.0000000000001, 135, 2462, 952.5, 1593.0, 2250.75, 2462.0, 0.10258470718477643, 0.03145663872658183, 0.046283334686881554], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 211.4, 98, 784, 102.0, 493.00000000000017, 784.0, 784.0, 0.07141598861153034, 1.4178770436875408, 0.04164537825478368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75205679-c369-45a7-a14a-4f1caca96a6b", 1, 0, 0.0, 700.0, 700, 700, 700.0, 700.0, 700.0, 700.0, 1.4285714285714286, 0.25809151785714285, 0.9849330357142858], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 12, 27.272727272727273, 0.8875739644970414], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 11.363636363636363, 0.3698224852071006], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 11.363636363636363, 0.3698224852071006], "isController": false}, {"data": ["401/Unauthorized", 22, 50.0, 1.6272189349112427], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1352, 44, "401/Unauthorized", 22, "406/Not Acceptable", 12, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 12, "406/Not Acceptable", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 22, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
