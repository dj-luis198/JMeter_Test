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

    var data = {"OkPercent": 97.76785714285714, "KoPercent": 2.232142857142857};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.811104020421187, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e75958f-332e-4dfe-87f4-5354a1224aa8"], "isController": false}, {"data": [0.3392857142857143, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5905086-a65e-4fc2-a9ee-1ab72d6220e8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=476270b5-4ae3-4f15-a872-c4b9fa105b1e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe2a79e6-917e-49ef-a733-2363a3270952"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1151fb2-62f3-4512-9ba1-c6d8269e42d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=057ed86a-e7ed-436c-bd8f-c50546986a9c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbb7017a-7c89-4d7e-820b-aa85ec5d4268"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/221e7942-0c24-412e-b626-02552f63d8fb"], "isController": false}, {"data": [0.8478260869565217, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.08695652173913043, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/54b2e47b-b80e-45f5-aa88-fdb90747c2a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/089f0df2-334d-4582-a66d-278ede27ff32"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/93294a57-aa24-4ca6-b007-0e3e4099cbcd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/566ae74b-3485-45db-aee7-4f0eb02e6345"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2e75958f-332e-4dfe-87f4-5354a1224aa8"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/476270b5-4ae3-4f15-a872-c4b9fa105b1e"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/78a35a19-33a6-4f09-91a4-d795a09fc10e"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe2a79e6-917e-49ef-a733-2363a3270952"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4782608695652174, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a5905086-a65e-4fc2-a9ee-1ab72d6220e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/412e1c51-e098-4794-a7bb-af727123ee40"], "isController": false}, {"data": [0.36885245901639346, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dbb7017a-7c89-4d7e-820b-aa85ec5d4268"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9269662921348315, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=566ae74b-3485-45db-aee7-4f0eb02e6345"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=089f0df2-334d-4582-a66d-278ede27ff32"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/057ed86a-e7ed-436c-bd8f-c50546986a9c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54b2e47b-b80e-45f5-aa88-fdb90747c2a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1151fb2-62f3-4512-9ba1-c6d8269e42d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78a35a19-33a6-4f09-91a4-d795a09fc10e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a29f70aa-458f-48ad-aeb2-d250105ec716"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93294a57-aa24-4ca6-b007-0e3e4099cbcd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1344, 30, 2.232142857142857, 297.44791666666674, 77, 2866, 88.0, 841.0, 1012.75, 1379.3999999999996, 5.29085948910138, 747.5160767615039, 3.8710623336764782], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e75958f-332e-4dfe-87f4-5354a1224aa8", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 0.8174844457013575, 3.1196973981900453], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1382.1607142857147, 966, 2382, 1362.5, 1648.7000000000003, 1777.6499999999999, 2382.0, 0.24975247745537907, 300.5360836930029, 1.2280309804568685], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5905086-a65e-4fc2-a9ee-1ab72d6220e8", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=476270b5-4ae3-4f15-a872-c4b9fa105b1e", 1, 0, 0.0, 913.0, 913, 913, 913.0, 913.0, 913.0, 913.0, 1.095290251916758, 0.1978795865279299, 0.7551512869660459], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe2a79e6-917e-49ef-a733-2363a3270952", 3, 0, 0.0, 282.0, 204, 428, 214.0, 428.0, 428.0, 428.0, 0.05055015417797024, 0.032498878418454176, 0.032416602776888466], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 474.3999999999999, 82, 952, 493.0, 849.4000000000001, 952.0, 952.0, 0.09155217558486581, 0.018632298234263708, 0.06135068641243645], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 474.3999999999999, 82, 952, 493.0, 849.4000000000001, 952.0, 952.0, 0.08893579428557877, 0.01809982375890099, 0.05959740433473061], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1151fb2-62f3-4512-9ba1-c6d8269e42d4", 3, 0, 0.0, 311.0, 224, 474, 235.0, 474.0, 474.0, 474.0, 0.0389347453667653, 0.03245829520972849, 0.02496791939209884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 113.8421052631579, 78, 242, 81.0, 241.0, 242.0, 242.0, 0.11108317791432563, 0.0472857154341306, 0.06237009845477453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 99.36842105263159, 79, 242, 82.0, 233.0, 242.0, 242.0, 0.11107928137551229, 0.08255013000660628, 0.05575659240919269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 187.1578947368421, 77, 637, 82.0, 632.0, 637.0, 637.0, 0.11108317791432563, 3.4649090433399787, 0.06440837428307501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 176.0, 78, 834, 81.0, 824.0, 834.0, 834.0, 0.11108447682134692, 10.548263555960267, 0.06430064648242234], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 189.99999999999997, 81, 331, 191.0, 279.90000000000003, 331.0, 331.0, 0.09334453467749462, 0.17406955371102867, 0.060328691265868574], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 93.5, 79, 242, 81.5, 164.5, 242.0, 242.0, 0.07124972009038535, 0.052950231434358654, 0.03576401965474422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 109.85714285714285, 78, 242, 81.5, 240.5, 242.0, 242.0, 0.07125080793326853, 0.02670911285110108, 0.040207801072833595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 516.5, 392, 641, 477.5, 641.0, 641.0, 641.0, 0.07146621881169544, 21.013441232434943, 0.040758077916045056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=057ed86a-e7ed-436c-bd8f-c50546986a9c", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 827.125, 557, 924, 856.0, 924.0, 924.0, 924.0, 0.07117564369472767, 64.04396930995213, 0.04052285183010374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 201.875, 78, 243, 242.0, 243.0, 243.0, 243.0, 0.07156211144009804, 0.126631392509236, 0.039624723814976164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 81.5, 80, 84, 81.0, 83.3, 84.0, 84.0, 0.07865577284212803, 0.05845414368443304, 0.03948151097739629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 100.5625, 79, 242, 81.0, 239.9, 242.0, 242.0, 0.0786561595146915, 0.02104666768264206, 0.04485859097322249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 125.06249999999999, 78, 325, 81.0, 265.50000000000006, 325.0, 325.0, 0.0785962706069597, 0.021184151062032107, 0.04620601064979467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 115.43750000000003, 78, 323, 80.5, 264.20000000000005, 323.0, 323.0, 0.07856269548608213, 0.021175101517733073, 0.04626299353330813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbb7017a-7c89-4d7e-820b-aa85ec5d4268", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 101.0, 79, 239, 82.0, 239.0, 239.0, 239.0, 0.07166403898523721, 0.05325813834742726, 0.04024103751612441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 180.21428571428572, 78, 870, 82.0, 611.5, 870.0, 870.0, 0.07125189580937064, 4.597302932842544, 0.04145094943151166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 492.95238095238085, 78, 1195, 239.0, 1051.6000000000001, 1182.9999999999998, 1195.0, 0.0986958054282693, 42.3028195129832, 0.05398344789096463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 123.85714285714286, 79, 634, 81.0, 380.0, 634.0, 634.0, 0.07125080793326853, 1.514268530935574, 0.04151989742428329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 366.5714285714285, 79, 914, 240.0, 645.2, 887.1999999999996, 914.0, 0.09869673313813314, 13.83303743896077, 0.054080338847034164], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 479.5, 85, 1129, 438.5, 1021.0, 1129.0, 1129.0, 0.09034472967566243, 0.01779670177204734, 0.06136837176210942], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 234.0, 162, 407, 166.5, 406.3, 407.0, 407.0, 0.07853069077558873, 0.12170723267662044, 0.17661736411736412], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/221e7942-0c24-412e-b626-02552f63d8fb", 2, 0, 0.0, 316.5, 178, 455, 316.5, 455.0, 455.0, 455.0, 0.018186612834292678, 0.02589461085195188, 0.011304471747096962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 464.65217391304344, 95, 1621, 370.0, 1020.2000000000005, 1526.5999999999985, 1621.0, 0.09724212867247584, 0.05973173724119853, 0.0439678765384339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 81.95238095238095, 80, 84, 82.0, 83.8, 84.0, 84.0, 0.09869395006086126, 0.07334579687140179, 0.049539736651643254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 127.52380952380953, 79, 249, 82.0, 244.0, 248.5, 249.0, 0.0986958054282693, 0.09699763541299494, 0.05234035365996945], "isController": false}, {"data": ["login", 23, 0, 0.0, 2189.739130434782, 1152, 3515, 2229.0, 3061.8, 3428.9999999999986, 3515.0, 0.0956428446677035, 39.9271597219912, 0.199468447997322], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/54b2e47b-b80e-45f5-aa88-fdb90747c2a2", 3, 0, 0.0, 698.6666666666666, 331, 1304, 461.0, 1304.0, 1304.0, 1304.0, 0.032012292720404636, 0.026687331268540452, 0.020528716360415734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 84.0, 82, 86, 84.0, 86.0, 86.0, 86.0, 0.07211327966044946, 0.05838077035010997, 0.025634017379300395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 592.1904761904763, 162, 1279, 330.0, 1134.2, 1266.7999999999997, 1279.0, 0.09865593039589216, 56.28332298571603, 0.20985947842723657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/089f0df2-334d-4582-a66d-278ede27ff32", 3, 0, 0.0, 294.0, 186, 465, 231.0, 465.0, 465.0, 465.0, 0.01866600298656048, 0.02573259200783972, 0.011970060508959681], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93294a57-aa24-4ca6-b007-0e3e4099cbcd", 3, 0, 0.0, 539.6666666666666, 178, 994, 447.0, 994.0, 994.0, 994.0, 0.01808612613264365, 0.024933184951740187, 0.011598199375425779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/566ae74b-3485-45db-aee7-4f0eb02e6345", 3, 0, 0.0, 318.3333333333333, 210, 410, 335.0, 410.0, 410.0, 410.0, 0.0641409390233473, 0.041236443545283503, 0.04113204748567519], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e75958f-332e-4dfe-87f4-5354a1224aa8", 3, 0, 0.0, 375.0, 194, 581, 350.0, 581.0, 581.0, 581.0, 0.09124087591240876, 0.04235334930048661, 0.058510587743309], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/476270b5-4ae3-4f15-a872-c4b9fa105b1e", 3, 0, 0.0, 811.0, 209, 1966, 258.0, 1966.0, 1966.0, 1966.0, 0.07309585302860484, 0.03307396995760441, 0.04687461929243214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 324.89473684210526, 163, 1077, 167.0, 917.0, 1077.0, 1077.0, 0.11102605606231483, 14.13561536008964, 0.24670998569809094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, 38.46153846153846, 602.6923076923077, 80, 1110, 880.0, 1067.6, 1110.0, 1110.0, 0.11557507490153893, 85.09987589570683, 0.18967613141330536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78a35a19-33a6-4f09-91a4-d795a09fc10e", 3, 0, 0.0, 388.0, 180, 693, 291.0, 693.0, 693.0, 693.0, 0.028694679050014826, 0.023641351782417813, 0.018401210198088932], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 872.8333333333333, 146, 2866, 634.5, 2319.5, 2732.0, 2866.0, 0.09387100559314741, 0.029334689247858568, 0.04235195760159581], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 293.0, 162, 1113, 170.0, 774.0, 1113.0, 1113.0, 0.07121927397037278, 6.188421359614093, 0.1588722364378154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 96.66666666666667, 80, 244, 83.5, 196.90000000000015, 244.0, 244.0, 0.1151808339092375, 0.08942262007601935, 0.04094318705367427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 231.77777777777777, 160, 871, 166.0, 396.7000000000007, 871.0, 871.0, 0.10669575113808802, 7.247571699174293, 0.2384446278689302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 137.20000000000002, 81, 314, 82.5, 307.0, 314.0, 314.0, 0.04958644901521312, 0.036850866895094904, 0.0248900730408394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 115.9, 78, 263, 83.0, 260.7, 263.0, 263.0, 0.04958718667096422, 0.020716209431482904, 0.02786373751022736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe2a79e6-917e-49ef-a733-2363a3270952", 1, 0, 0.0, 600.0, 600, 600, 600.0, 600.0, 600.0, 600.0, 1.6666666666666667, 0.30110677083333337, 1.1490885416666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 178.7, 78, 894, 80.5, 828.6000000000003, 894.0, 894.0, 0.04958718667096422, 4.473892539917686, 0.028725702278531228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 153.4, 80, 473, 83.0, 449.9000000000001, 473.0, 473.0, 0.049586940783275316, 1.4700494102873067, 0.02877398458342011], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 85.5, 85, 86, 85.5, 86.0, 86.0, 86.0, 0.09457159069415548, 0.027891230849252886, 0.05846075870058635], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 981.9821428571427, 622, 2042, 907.0, 1314.8000000000004, 1441.3999999999999, 2042.0, 0.24753350542805616, 296.13612906220163, 0.48878198044485305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 872.8333333333333, 146, 2866, 634.5, 2319.5, 2732.0, 2866.0, 0.09447963373395322, 0.029524885541860384, 0.042626553501060926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 105.14285714285714, 81, 242, 83.0, 242.0, 242.0, 242.0, 0.04607536613460589, 0.012418751028467992, 0.027132271268718117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 104.14285714285714, 80, 240, 82.0, 240.0, 240.0, 240.0, 0.04602719549722522, 0.012405767536361485, 0.02705895672786092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 121.41666666666667, 80, 242, 82.0, 241.4, 242.0, 242.0, 0.11383147250495641, 0.030681139073601534, 0.06692045551560914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 119.75, 78, 240, 81.5, 239.1, 240.0, 240.0, 0.11400342010260309, 0.030727484324529736, 0.06713287336120083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 124.85714285714286, 77, 239, 81.0, 239.0, 239.0, 239.0, 0.0460268928559687, 0.012315789689975999, 0.02624971233191965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 82.08333333333333, 79, 86, 82.0, 85.7, 86.0, 86.0, 0.1139947562412129, 0.08471680615191701, 0.057220024128890074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 132.0, 81, 244, 83.0, 244.0, 244.0, 244.0, 0.04606475388260069, 0.03423366963345617, 0.023122347163727297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 120.08333333333331, 78, 242, 82.0, 241.1, 242.0, 242.0, 0.11400342010260309, 0.030504821394641838, 0.06501757552726581], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 87.28571428571429, 83, 100, 85.0, 100.0, 100.0, 100.0, 0.04302767294051117, 0.03386748475591016, 0.01529499311557233], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 537.5, 80, 1966, 455.0, 1329.5, 1966.0, 1966.0, 0.08845084660096032, 0.017078121051301492, 0.060192972896133436], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1056.5217391304348, 764, 1766, 1017.0, 1440.8000000000002, 1712.3999999999992, 1766.0, 0.09523770087908538, 0.049292950650307865, 0.04380562218168869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5905086-a65e-4fc2-a9ee-1ab72d6220e8", 3, 0, 0.0, 685.0, 246, 1383, 426.0, 1383.0, 1383.0, 1383.0, 0.02431059212498886, 0.024381814562855035, 0.015589800288485693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 261.7142857142857, 165, 485, 167.0, 485.0, 485.0, 485.0, 0.04599181345720462, 0.0712783280826013, 0.10343666639838109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/412e1c51-e098-4794-a7bb-af727123ee40", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["addBook", 61, 12, 19.672131147540984, 854.9180327868854, 409, 1843, 726.0, 1472.0, 1647.0, 1843.0, 0.2879042458796655, 85.81658888188139, 1.0470590330547112], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dbb7017a-7c89-4d7e-820b-aa85ec5d4268", 3, 0, 0.0, 663.3333333333334, 188, 1239, 563.0, 1239.0, 1239.0, 1239.0, 0.01902237665573937, 0.026223881880552156, 0.012198594404884947], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 176.82142857142864, 80, 797, 84.0, 330.3, 419.39999999999964, 797.0, 0.24814335596164416, 0.18441122449883907, 0.11995211054786509], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 514.7142857142858, 385, 762, 478.0, 645.4000000000001, 717.05, 762.0, 0.24862479410759236, 73.10394458774901, 0.1250407900052833], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 135.58928571428567, 79, 438, 84.0, 246.20000000000002, 325.3, 438.0, 0.24896966571376491, 0.4405596037825606, 0.12108095070845208], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 803.4642857142856, 538, 1210, 786.5, 1033.3, 1105.45, 1210.0, 0.2484472049689441, 223.55323175465838, 0.12470885093167701], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 92.33333333333333, 81, 244, 84.0, 100.90000000000023, 244.0, 244.0, 0.1128894686669008, 0.08433637063494054, 0.0401286783151874], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 12, 6.741573033707865, 141.4775280898875, 80, 1038, 84.5, 283.1, 359.7499999999998, 662.7500000000038, 0.720280342821071, 1.5302874975720886, 0.3469178551629533], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 99.2, 81, 243, 83.0, 227.30000000000007, 243.0, 243.0, 0.05161263683800342, 0.03996955177005538, 0.018346679501009027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 92.78947368421053, 80, 245, 84.0, 95.0, 245.0, 245.0, 0.10743993259557913, 0.08719002342473267, 0.03819153853983477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=566ae74b-3485-45db-aee7-4f0eb02e6345", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=089f0df2-334d-4582-a66d-278ede27ff32", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 334.30000000000007, 162, 1208, 167.0, 1135.9, 1208.0, 1208.0, 0.049566294919454766, 5.99898834417596, 0.11020755885997521], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/057ed86a-e7ed-436c-bd8f-c50546986a9c", 3, 0, 0.0, 295.0, 216, 449, 220.0, 449.0, 449.0, 449.0, 0.024140206318296668, 0.024210929578994803, 0.015480535952813942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54b2e47b-b80e-45f5-aa88-fdb90747c2a2", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 244.0, 161, 326, 247.5, 325.1, 326.0, 326.0, 0.11373437337099204, 0.17626606498023864, 0.255791271360737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1151fb2-62f3-4512-9ba1-c6d8269e42d4", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 94.25, 81, 242, 84.0, 134.9000000000001, 242.0, 242.0, 0.0812979213137744, 0.06740423358925242, 0.02889887046700575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78a35a19-33a6-4f09-91a4-d795a09fc10e", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 84.52380952380953, 81, 89, 84.0, 87.8, 88.9, 89.0, 0.10197144799456152, 0.07916728628484025, 0.036247663154316795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a29f70aa-458f-48ad-aeb2-d250105ec716", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 1.1960147471910112, 2.234755383895131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 82.94444444444444, 79, 96, 82.0, 87.9, 96.0, 96.0, 0.1067514352137401, 0.07933383027114864, 0.05358421650377188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93294a57-aa24-4ca6-b007-0e3e4099cbcd", 1, 0, 0.0, 1129.0, 1129, 1129, 1129.0, 1129.0, 1129.0, 1129.0, 0.8857395925597874, 0.16002131310894596, 0.6106759300265722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 118.77777777777779, 77, 283, 81.0, 248.80000000000007, 283.0, 283.0, 0.1067489028584984, 0.03747099617483098, 0.060382164778792546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 147.2777777777778, 78, 788, 81.0, 301.10000000000076, 788.0, 788.0, 0.1067489028584984, 5.363443180301862, 0.06224702733958012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 113.66666666666666, 79, 666, 81.0, 145.8000000000008, 666.0, 666.0, 0.1067489028584984, 1.7709360359091448, 0.06235127431502787], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 26.666666666666668, 0.5952380952380952], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.22321428571428573], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.666666666666667, 0.1488095238095238], "isController": false}, {"data": ["401/Unauthorized", 17, 56.666666666666664, 1.2648809523809523], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1344, 30, "401/Unauthorized", 17, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
