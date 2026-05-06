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

    var data = {"OkPercent": 98.95522388059702, "KoPercent": 1.044776119402985};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8313915857605177, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e06ed5bd-f391-4621-84e9-ee3e2f0757c6"], "isController": false}, {"data": [0.3983050847457627, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b4e7dbec-cab0-46cb-946b-44bae7a85e57"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6c4e710-9b88-444c-9550-802ee11e5e86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d6fdede5-02e3-4f8a-948d-0e5b6d134fbf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cee8f080-e90d-414e-b4e6-f550dc7c55da"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4cb376f1-36e8-4faa-a4d2-6176b0297246"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ebdfad33-b803-4e2f-921a-9854443d85d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0b4b022-fccb-4f23-a8a5-21868cf54f4e"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e06ed5bd-f391-4621-84e9-ee3e2f0757c6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c4ae8b68-d63d-4e58-915f-1f7c8dc4bb76"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a77dfb7f-a6d1-40a6-87f8-222ed788b3ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8468a591-20bc-4c8f-8abe-c8ef1e1a7b0d"], "isController": false}, {"data": [0.35, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c89d145-f94d-42fb-8d3a-22c40c584c61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c61df785-1868-48a5-a955-959fc2471d30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b4e7dbec-cab0-46cb-946b-44bae7a85e57"], "isController": false}, {"data": [0.4915254237288136, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e4b5a85-410a-4926-b0bd-9c4020c3bdbb"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a6c4e710-9b88-444c-9550-802ee11e5e86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ec492d8b-e1ec-43dd-ad1c-fea5149f41cb"], "isController": false}, {"data": [0.3870967741935484, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1d186153-d2c8-4c58-b8f2-67299ee14d4e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.847457627118644, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4cb376f1-36e8-4faa-a4d2-6176b0297246"], "isController": false}, {"data": [0.9508196721311475, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cee8f080-e90d-414e-b4e6-f550dc7c55da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c0b4b022-fccb-4f23-a8a5-21868cf54f4e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ebdfad33-b803-4e2f-921a-9854443d85d4"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4ae8b68-d63d-4e58-915f-1f7c8dc4bb76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/08d95a2c-e14a-49ec-ba63-f8ce2eda06fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c61df785-1868-48a5-a955-959fc2471d30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4c89d145-f94d-42fb-8d3a-22c40c584c61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1340, 14, 1.044776119402985, 296.21641791044755, 77, 2350, 93.0, 848.0, 1017.9000000000001, 1546.5699999999981, 5.318980026039186, 744.2629976682326, 3.8928300570996477], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e06ed5bd-f391-4621-84e9-ee3e2f0757c6", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["see books", 59, 0, 0.0, 1322.1864406779662, 962, 1901, 1280.0, 1585.0, 1669.0, 1901.0, 0.26767202464397355, 322.09867999270705, 1.3161412539867252], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b4e7dbec-cab0-46cb-946b-44bae7a85e57", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["deleteBook", 11, 1, 9.090909090909092, 461.54545454545456, 83, 673, 459.0, 659.0, 673.0, 673.0, 0.05443119402246523, 0.010399141471621555, 0.03675941876144292], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, 9.090909090909092, 461.54545454545456, 83, 673, 459.0, 659.0, 673.0, 673.0, 0.053599185292383555, 0.010240185258274984, 0.03619753218387444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6c4e710-9b88-444c-9550-802ee11e5e86", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 101.64285714285714, 77, 241, 79.5, 236.5, 241.0, 241.0, 0.08909819894354992, 0.033399394609558965, 0.0502793268312862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 103.42857142857143, 78, 236, 81.0, 235.5, 236.0, 236.0, 0.08909706488811954, 0.06621373669908102, 0.04472255014891938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 168.7857142857143, 77, 463, 81.5, 396.5, 463.0, 463.0, 0.08909763191222611, 1.893560846522965, 0.05191975564974448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 186.07142857142858, 78, 1009, 80.0, 668.0, 1009.0, 1009.0, 0.08909819894354992, 5.748779125962579, 0.051833076115318524], "isController": false}, {"data": ["goToProfile", 11, 1, 9.090909090909092, 205.99999999999997, 80, 352, 177.0, 349.6, 352.0, 352.0, 0.0541682465738584, 0.12529773299732605, 0.03501411606039267], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 82.11111111111111, 79, 97, 80.5, 89.80000000000001, 97.0, 97.0, 0.09959828690946515, 0.07401786751767869, 0.049993671358852625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 463.0, 458, 468, 463.0, 468.0, 468.0, 468.0, 0.01334009231343881, 3.9224300729036043, 0.007608021397508071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 97.55555555555557, 78, 240, 80.0, 237.3, 240.0, 240.0, 0.0995971847195786, 0.034960600322030896, 0.05633681900424948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 906.3333333333334, 848, 936, 935.0, 936.0, 936.0, 936.0, 0.013317588983690393, 11.983189977349001, 0.007582182009269042], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 241.0, 235, 244, 244.0, 244.0, 244.0, 244.0, 0.013353928057938242, 0.02363019300877353, 0.007394216024268539], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 91.13333333333334, 78, 235, 81.0, 144.40000000000006, 235.0, 235.0, 0.07454971969305395, 0.05540267254532623, 0.037420464767802475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 132.39999999999998, 78, 241, 82.0, 238.6, 241.0, 241.0, 0.07449418448733101, 0.027392132420862345, 0.04206787475541076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 136.26666666666665, 78, 769, 80.0, 448.0000000000002, 769.0, 769.0, 0.07455194282362998, 4.490885753185853, 0.04340126775578772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 131.86666666666665, 77, 552, 80.0, 361.8000000000001, 552.0, 552.0, 0.07449455444806985, 1.478998200335722, 0.04344060704370844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6fdede5-02e3-4f8a-948d-0e5b6d134fbf", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 1.7545930631868132, 3.2784598214285716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 81.66666666666667, 79, 85, 81.0, 85.0, 85.0, 85.0, 0.013363028953229399, 0.009930922884187083, 0.007503653953229399], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cee8f080-e90d-414e-b4e6-f550dc7c55da", 3, 0, 0.0, 287.6666666666667, 177, 418, 268.0, 418.0, 418.0, 418.0, 0.020323688613992183, 0.024021911900197142, 0.01303309458644681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 526.5263157894736, 78, 1475, 234.0, 1098.0, 1475.0, 1475.0, 0.08847332296488074, 37.72181720858517, 0.04841113262151113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 138.05555555555557, 78, 659, 80.0, 283.7000000000006, 659.0, 659.0, 0.09959663363378318, 5.004087827977247, 0.058076422433588404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 331.4736842105263, 77, 701, 235.0, 701.0, 701.0, 701.0, 0.08853722524336088, 12.34392583667678, 0.04853256102078761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 109.83333333333331, 77, 472, 80.0, 257.80000000000035, 472.0, 472.0, 0.09959883801355651, 1.6523183531608798, 0.05817497233365611], "isController": false}, {"data": ["deleteBooks", 11, 1, 9.090909090909092, 376.45454545454544, 86, 535, 422.0, 525.6, 535.0, 535.0, 0.05364440586382124, 0.010248824699835166, 0.03663764331590703], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4cb376f1-36e8-4faa-a4d2-6176b0297246", 3, 0, 0.0, 339.0, 188, 524, 305.0, 524.0, 524.0, 524.0, 0.030399756801945583, 0.030488818589451284, 0.01949463570958099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 259.93333333333334, 159, 848, 165.0, 621.8000000000002, 848.0, 848.0, 0.07446275124973317, 6.046598401905253, 0.16619833991501318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebdfad33-b803-4e2f-921a-9854443d85d4", 3, 0, 0.0, 564.0, 173, 1330, 189.0, 1330.0, 1330.0, 1330.0, 0.020828126301757892, 0.024618140169818656, 0.01335657839012469], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0b4b022-fccb-4f23-a8a5-21868cf54f4e", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.069018121301775, 4.0796042899408285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 653.9000000000001, 146, 1176, 661.0, 994.2, 1167.0, 1176.0, 0.08671221948596997, 0.053263658258471784, 0.03920679455273837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 89.15789473684211, 79, 236, 80.0, 90.0, 236.0, 236.0, 0.08853640010997153, 0.06579707078485189, 0.04444112271145055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 129.78947368421052, 77, 240, 81.0, 240.0, 240.0, 240.0, 0.08847373494200314, 0.0866184057964266, 0.0469380084329439], "isController": false}, {"data": ["login", 20, 0, 0.0, 2535.6000000000004, 1740, 3336, 2638.5, 3242.6000000000004, 3332.2, 3336.0, 0.08630138168512078, 15.60807262450053, 0.1516763638854608], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 93.38888888888889, 81, 239, 83.5, 106.70000000000022, 239.0, 239.0, 0.1003221455562863, 0.08121783072867318, 0.03566138767821114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 617.0, 159, 1556, 472.0, 1181.0, 1556.0, 1556.0, 0.08843996555496078, 50.19027138559825, 0.18818493698652453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e06ed5bd-f391-4621-84e9-ee3e2f0757c6", 3, 0, 0.0, 583.3333333333333, 167, 1282, 301.0, 1282.0, 1282.0, 1282.0, 0.017898052691867127, 0.0246739105306176, 0.011477592383781977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4ae8b68-d63d-4e58-915f-1f7c8dc4bb76", 3, 0, 0.0, 373.0, 172, 559, 388.0, 559.0, 559.0, 559.0, 0.01584953508030431, 0.021849863627958578, 0.010163927118554522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 625.0, 80, 1018, 933.0, 1018.0, 1018.0, 1018.0, 0.022187904929264958, 15.929043634733834, 0.03589933680352166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 323.7142857142857, 160, 1244, 240.5, 857.5, 1244.0, 1244.0, 0.08905115989135759, 7.737878656265703, 0.19865067615273546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a77dfb7f-a6d1-40a6-87f8-222ed788b3ff", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 1.8352640086206897, 3.429193606321839], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8468a591-20bc-4c8f-8abe-c8ef1e1a7b0d", 1, 0, 0.0, 314.0, 314, 314, 314.0, 314.0, 314.0, 314.0, 3.1847133757961785, 1.0169934315286624, 1.9002537818471337], "isController": false}, {"data": ["register", 20, 3, 15.0, 1181.05, 715, 2106, 1067.0, 1782.2, 2089.85, 2106.0, 0.08816748295061298, 0.02812060540202168, 0.03977868859685859], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c89d145-f94d-42fb-8d3a-22c40c584c61", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 106.26666666666667, 82, 239, 86.0, 237.2, 239.0, 239.0, 0.07990964882372997, 0.06203922931139192, 0.028405382980310263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 238.94444444444443, 159, 740, 165.0, 363.8000000000006, 740.0, 740.0, 0.09955256652047188, 6.76235328959012, 0.2224809743983983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 0, 0.0, 261.1363636363637, 159, 1235, 166.0, 319.7, 1097.7499999999982, 1235.0, 0.10252538668381636, 5.726944858526617, 0.22938963025617368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c61df785-1868-48a5-a955-959fc2471d30", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 117.77777777777777, 80, 236, 84.0, 236.0, 236.0, 236.0, 0.043322967912121764, 0.03219607283312956, 0.02174609912776425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 116.66666666666667, 78, 241, 81.0, 241.0, 241.0, 241.0, 0.04332421920129395, 0.01882271849847884, 0.024304059599684215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 167.22222222222223, 80, 846, 81.0, 846.0, 846.0, 846.0, 0.04332380209687202, 4.341805581128633, 0.025055974954028632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 185.11111111111111, 80, 699, 82.0, 699.0, 699.0, 699.0, 0.04329150091633677, 1.4247206645966917, 0.025079570680590496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 11.627906976744185, 3.429324127906977, 7.18795421511628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4e7dbec-cab0-46cb-946b-44bae7a85e57", 3, 0, 0.0, 363.3333333333333, 164, 508, 418.0, 508.0, 508.0, 508.0, 0.04319281271596406, 0.027768816768889655, 0.0276985159669431], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 926.8983050847457, 621, 1571, 901.0, 1180.0, 1333.0, 1571.0, 0.2695664092840499, 322.49514195070134, 0.5322883589573719], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 3, 15.0, 1181.05, 715, 2106, 1067.0, 1782.2, 2089.85, 2106.0, 0.08688436993627031, 0.02771136252068934, 0.039199784092340706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 164.88888888888889, 78, 237, 230.0, 237.0, 237.0, 237.0, 0.061482549203117846, 0.016571468339902855, 0.03620505582957037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 115.44444444444443, 78, 245, 80.0, 245.0, 245.0, 245.0, 0.061482549203117846, 0.016571468339902855, 0.0361450142776142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 189.66666666666666, 78, 953, 80.0, 889.4000000000001, 953.0, 953.0, 0.07751737681196869, 9.318143830262784, 0.04468351915971164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 152.86666666666665, 77, 468, 81.0, 466.8, 468.0, 468.0, 0.0775169762177917, 3.0571161230142736, 0.044758988416379854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 110.86666666666667, 78, 347, 82.0, 280.40000000000003, 347.0, 347.0, 0.07751377161342332, 0.05760544941192885, 0.038908279891894125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 131.88888888888889, 77, 238, 81.0, 238.0, 238.0, 238.0, 0.061482969217526745, 0.016451497622658524, 0.03506450588187072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 132.20000000000002, 78, 238, 81.0, 238.0, 238.0, 238.0, 0.07751737681196869, 0.03626561652153691, 0.043341095837316865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 101.0, 78, 238, 81.0, 238.0, 238.0, 238.0, 0.06147037128104254, 0.0456825708446029, 0.030855244959429554], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 588.5454545454546, 80, 1330, 470.0, 1320.4, 1330.0, 1330.0, 0.052993915334993806, 0.00999281571125061, 0.036066348984202995], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 102.0, 81, 239, 85.0, 239.0, 239.0, 239.0, 0.059813779765662906, 0.04707998680773857, 0.021261929526075484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e4b5a85-410a-4926-b0bd-9c4020c3bdbb", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 1.2188394561068703, 2.27740338740458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1490.2999999999997, 899, 2350, 1458.5, 2070.9, 2336.1, 2350.0, 0.08899885191481029, 0.046063858901220174, 0.04093599536315981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 286.22222222222223, 160, 474, 317.0, 474.0, 474.0, 474.0, 0.061436802009666065, 0.09521504373958987, 0.13817280764478607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6c4e710-9b88-444c-9550-802ee11e5e86", 3, 0, 0.0, 390.3333333333333, 270, 601, 300.0, 601.0, 601.0, 601.0, 0.042246380893370135, 0.027655427075705515, 0.027091591914042697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec492d8b-e1ec-43dd-ad1c-fea5149f41cb", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.2096058238636362, 2.260150331439394], "isController": false}, {"data": ["addBook", 62, 7, 11.290322580645162, 923.8548387096777, 419, 3542, 707.0, 1637.7, 1875.6499999999992, 3542.0, 0.28991742029608986, 90.58032053264142, 1.0548960973374357], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1d186153-d2c8-4c58-b8f2-67299ee14d4e", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 1.4992297535211268, 2.80131308685446], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 150.30508474576268, 79, 357, 82.0, 321.0, 344.0, 357.0, 0.270518110958276, 0.20103933831957818, 0.13076803215268226], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 495.23728813559325, 383, 715, 466.0, 632.0, 701.0, 715.0, 0.2701997188091062, 79.4476888049158, 0.13589146014325165], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 131.86440677966104, 78, 332, 85.0, 239.0, 240.0, 332.0, 0.2706794513006377, 0.47897574780933155, 0.13163903002706795], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 773.6610169491526, 538, 1244, 776.0, 936.0, 1013.0, 1244.0, 0.2700167044232397, 242.96150527876938, 0.1355357285874465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 22, 0, 0.0, 93.0, 81, 245, 85.0, 96.89999999999999, 223.09999999999968, 245.0, 0.10329608413935581, 0.07716943785801485, 0.03671852990891163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4cb376f1-36e8-4faa-a4d2-6176b0297246", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.504648219273743, 1.925846717877095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 7, 3.8251366120218577, 154.32240437158472, 78, 2143, 88.0, 283.79999999999995, 331.1999999999997, 1216.4799999999962, 0.7747474661947622, 1.6238928824310137, 0.37316804505389367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 82.44444444444444, 81, 84, 82.0, 84.0, 84.0, 84.0, 0.044913989709705913, 0.03478202523417655, 0.015965519779622024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cee8f080-e90d-414e-b4e6-f550dc7c55da", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 114.78571428571428, 81, 330, 83.5, 284.5, 330.0, 330.0, 0.08634140625481816, 0.07006807480249404, 0.030691671754642394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 320.22222222222223, 161, 1080, 176.0, 1080.0, 1080.0, 1080.0, 0.04327380780659493, 5.81189401643443, 0.09609358471809518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0b4b022-fccb-4f23-a8a5-21868cf54f4e", 3, 0, 0.0, 372.0, 263, 501, 352.0, 501.0, 501.0, 501.0, 0.10215895934073418, 0.04622426871211605, 0.06551209306681197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ebdfad33-b803-4e2f-921a-9854443d85d4", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.3376898364485981, 1.288697429906542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 343.5333333333333, 158, 1195, 170.0, 1099.6000000000001, 1195.0, 1195.0, 0.07748133991063819, 12.463352738642527, 0.17161410580076966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 86.19999999999999, 80, 105, 83.0, 99.0, 105.0, 105.0, 0.07452712538940423, 0.06179055610898847, 0.026492064103264785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4ae8b68-d63d-4e58-915f-1f7c8dc4bb76", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 87.78947368421052, 81, 117, 85.0, 97.0, 117.0, 117.0, 0.08904343913880935, 0.06913040440952484, 0.031652160006373636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08d95a2c-e14a-49ec-ba63-f8ce2eda06fe", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 1.2282151442307692, 2.294921875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c61df785-1868-48a5-a955-959fc2471d30", 3, 0, 0.0, 336.6666666666667, 208, 462, 340.0, 462.0, 462.0, 462.0, 0.02149797918995614, 0.02540988360635767, 0.013786138998767449], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c89d145-f94d-42fb-8d3a-22c40c584c61", 3, 0, 0.0, 315.3333333333333, 183, 470, 293.0, 470.0, 470.0, 470.0, 0.023861982294409136, 0.02393189044566229, 0.015302117552078777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 22, 0, 0.0, 87.95454545454547, 78, 235, 81.0, 87.89999999999999, 213.2499999999997, 235.0, 0.10256410256410256, 0.07622195512820513, 0.05148237179487179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 22, 0, 0.0, 122.5909090909091, 78, 238, 80.0, 236.7, 237.85, 238.0, 0.10256505888166789, 0.03444634390530448, 0.05810259594495054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 22, 0, 0.0, 164.8181818181818, 79, 999, 82.5, 237.4, 884.8499999999984, 999.0, 0.10256458072065604, 4.221287344288318, 0.05989611256928937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 22, 0, 0.0, 111.27272727272727, 77, 459, 79.5, 235.0, 425.3999999999995, 459.0, 0.10256458072065604, 1.3971783522300805, 0.05999627329264939], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 21.428571428571427, 0.22388059701492538], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.142857142857143, 0.07462686567164178], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.142857142857143, 0.07462686567164178], "isController": false}, {"data": ["401/Unauthorized", 9, 64.28571428571429, 0.6716417910447762], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1340, 14, "401/Unauthorized", 9, "406/Not Acceptable", 3, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
