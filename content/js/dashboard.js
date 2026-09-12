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

    var data = {"OkPercent": 98.19102749638205, "KoPercent": 1.808972503617945};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8104838709677419, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3508771929824561, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87831a98-6f3e-4e9d-a41a-e30cf500c25f"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/25c153e4-90a5-4ac5-a7d8-f0ea78c5552f"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e81785c-52a5-4690-92e2-f159dda6e692"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81ac8e99-4619-4782-a6b0-6007f7fbc312"], "isController": false}, {"data": [0.78125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3f446c88-f478-469c-8919-7e64afb532d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c32a887-048d-49c1-ae0e-ede06f6246f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6425f7ac-dd94-4b79-886f-179e4e062aa3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b1eefd9-6519-4908-88fd-963326f92f34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59db083d-70a4-4c1c-960d-7514fc490924"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7e3536e-8c2a-45c4-a336-fd8d2f894aee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a03ac5bf-1dff-4ed4-b14e-9f2f2f86599a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3572285b-6669-4e33-a315-30bb70ebf207"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b1f1c6c-b528-4d7c-ba99-07de3257af77"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25c153e4-90a5-4ac5-a7d8-f0ea78c5552f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1673b015-b03e-4ae4-858e-c2f055b1e59f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39d3ee53-d9f1-4619-b264-d2d054e9d96b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/007adc60-17ab-4bf2-bdf1-edc4f71fe251"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87831a98-6f3e-4e9d-a41a-e30cf500c25f"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d7e3536e-8c2a-45c4-a336-fd8d2f894aee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1e81785c-52a5-4690-92e2-f159dda6e692"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f446c88-f478-469c-8919-7e64afb532d7"], "isController": false}, {"data": [0.3923076923076923, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c32a887-048d-49c1-ae0e-ede06f6246f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59db083d-70a4-4c1c-960d-7514fc490924"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9491978609625669, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4b1eefd9-6519-4908-88fd-963326f92f34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/815dceae-1f2c-4525-b4a2-9c7cbdeac4c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1673b015-b03e-4ae4-858e-c2f055b1e59f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2b1f1c6c-b528-4d7c-ba99-07de3257af77"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39d3ee53-d9f1-4619-b264-d2d054e9d96b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3572285b-6669-4e33-a315-30bb70ebf207"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=007adc60-17ab-4bf2-bdf1-edc4f71fe251"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1382, 25, 1.808972503617945, 310.10853835021675, 78, 4071, 99.5, 816.4000000000001, 1036.3999999999996, 1693.0500000000047, 5.420500631476557, 744.903737055466, 3.9602264147428206], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1371.578947368421, 1041, 1931, 1307.0, 1669.4, 1785.3, 1931.0, 0.2559899400444614, 308.04354355197273, 1.2587005352772103], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/87831a98-6f3e-4e9d-a41a-e30cf500c25f", 2, 0, 0.0, 189.5, 180, 199, 189.5, 199.0, 199.0, 199.0, 0.012964871680182545, 0.02562587918036081, 0.008058731273863466], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 462.9375, 83, 940, 479.5, 809.8000000000002, 940.0, 940.0, 0.07863219300271772, 0.01589057562451162, 0.052739817438163146], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 462.9375, 83, 940, 479.5, 809.8000000000002, 940.0, 940.0, 0.07828937711014337, 0.015821296851299113, 0.052509885562949554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 106.47619047619047, 79, 245, 83.0, 242.8, 244.8, 245.0, 0.12925622276386733, 0.0438307466701135, 0.07319951082674743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 99.42857142857143, 81, 245, 85.0, 212.80000000000013, 244.9, 245.0, 0.12925304052390565, 0.09605621468622286, 0.06487896760672608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 149.57142857142858, 79, 645, 85.0, 249.4, 605.5999999999995, 645.0, 0.12925542718918684, 1.842959753091359, 0.07558533281733747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25c153e4-90a5-4ac5-a7d8-f0ea78c5552f", 3, 0, 0.0, 392.6666666666667, 206, 491, 481.0, 491.0, 491.0, 491.0, 0.018560221732782302, 0.02193755374730877, 0.011902225525254275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 142.00000000000003, 80, 793, 84.0, 250.4, 738.8999999999992, 793.0, 0.1292570183483415, 5.571546115903537, 0.07546003573033293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e81785c-52a5-4690-92e2-f159dda6e692", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81ac8e99-4619-4782-a6b0-6007f7fbc312", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.858429939516129, 1.6039776545698925], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 231.125, 81, 563, 200.5, 480.4000000000001, 563.0, 563.0, 0.07826678211017027, 0.16671818210723527, 0.050583920639928774], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 101.31578947368419, 81, 251, 84.0, 250.0, 251.0, 251.0, 0.11137358804668311, 0.08276884814797446, 0.05590432056249523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 121.84210526315789, 80, 332, 83.0, 253.0, 332.0, 332.0, 0.11137619949235901, 0.04741044840644106, 0.06253462187780273], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 552.1666666666666, 395, 664, 560.0, 664.0, 664.0, 664.0, 0.08400302410886792, 24.69967825091703, 0.04790797468708873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 872.6666666666666, 719, 1009, 897.5, 1009.0, 1009.0, 1009.0, 0.08369017895749933, 75.3045701376006, 0.047647826496310657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 163.16666666666669, 78, 245, 165.0, 245.0, 245.0, 245.0, 0.0846871515476577, 0.14985656113706614, 0.04689220207765812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 96.25, 80, 248, 83.0, 150.0000000000001, 248.0, 248.0, 0.09394909133613223, 0.06981958838554359, 0.047158039987082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 113.75000000000001, 78, 253, 83.5, 246.0, 253.0, 253.0, 0.0938691698445292, 0.03392902977412731, 0.05304203945438545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 158.6875, 79, 717, 83.5, 445.40000000000026, 717.0, 717.0, 0.09361433235428344, 5.28830128931802, 0.0545321770012989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 147.875, 80, 634, 83.5, 359.60000000000025, 634.0, 634.0, 0.0936598158413871, 1.7448599602823844, 0.054650136684793744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f446c88-f478-469c-8919-7e64afb532d7", 3, 0, 0.0, 417.0, 192, 655, 404.0, 655.0, 655.0, 655.0, 0.022388393856624726, 0.026462323598113405, 0.014357140591650623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 108.83333333333334, 82, 235, 84.0, 235.0, 235.0, 235.0, 0.08469193309337285, 0.06294000105864916, 0.047556505399110736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 639.7142857142857, 84, 982, 798.0, 976.0, 982.0, 982.0, 0.06831734382167222, 43.91387965960884, 0.035969539004323516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 172.68421052631575, 81, 886, 84.0, 796.0, 886.0, 886.0, 0.11137619949235901, 10.575964704735833, 0.06446950856717451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 505.0714285714286, 82, 801, 643.5, 775.0, 801.0, 801.0, 0.06831834396334233, 14.353733627996856, 0.03603678271838691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 174.57894736842104, 80, 670, 84.0, 496.0, 670.0, 670.0, 0.11137685237291314, 3.474069343814481, 0.0645786529409351], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 370.74999999999994, 84, 559, 451.5, 529.6, 559.0, 559.0, 0.07828363138195073, 0.015820135712014093, 0.052926500538199965], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c32a887-048d-49c1-ae0e-ede06f6246f2", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6425f7ac-dd94-4b79-886f-179e4e062aa3", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.6882240032327586, 1.2859476023706895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b1eefd9-6519-4908-88fd-963326f92f34", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 0.5962510313531353, 2.2754228547854787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59db083d-70a4-4c1c-960d-7514fc490924", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 277.25, 164, 800, 186.0, 643.9000000000002, 800.0, 800.0, 0.09355466808557913, 7.131173740154833, 0.20891058878045643], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 498.17391304347825, 90, 1838, 389.0, 1099.6000000000006, 1727.9999999999984, 1838.0, 0.09887327455388809, 0.0607336813421832, 0.044705396600049005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 87.64285714285715, 82, 102, 85.5, 99.0, 102.0, 102.0, 0.06831701044762283, 0.05077074702211031, 0.034291936884841924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 143.21428571428572, 80, 257, 84.0, 254.0, 257.0, 257.0, 0.06831801057953192, 0.09157358337725205, 0.03486429725166403], "isController": false}, {"data": ["login", 23, 0, 0.0, 2815.173913043478, 1737, 4633, 2618.0, 4218.4000000000015, 4610.0, 4633.0, 0.10232682297459625, 32.0752185567469, 0.1986535889464786], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 99.6842105263158, 83, 247, 87.0, 132.0, 247.0, 247.0, 0.10434572484581547, 0.08447520107146585, 0.03709164437878597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7e3536e-8c2a-45c4-a336-fd8d2f894aee", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a03ac5bf-1dff-4ed4-b14e-9f2f2f86599a", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 1.6545903497409327, 3.091604598445596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3572285b-6669-4e33-a315-30bb70ebf207", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b1f1c6c-b528-4d7c-ba99-07de3257af77", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 0.8770100121359223, 3.3468598300970878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 728.8571428571429, 172, 1079, 884.0, 1066.5, 1079.0, 1079.0, 0.06828835244594245, 58.38495988669011, 0.14110195146161464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25c153e4-90a5-4ac5-a7d8-f0ea78c5552f", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.3231915250447227, 1.2333687388193202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1673b015-b03e-4ae4-858e-c2f055b1e59f", 3, 0, 0.0, 390.6666666666667, 282, 448, 442.0, 448.0, 448.0, 448.0, 0.019604767879548304, 0.027026755198530948, 0.012572067943590547], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39d3ee53-d9f1-4619-b264-d2d054e9d96b", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/007adc60-17ab-4bf2-bdf1-edc4f71fe251", 3, 0, 0.0, 1161.3333333333333, 191, 2796, 497.0, 2796.0, 2796.0, 2796.0, 0.028038431343227782, 0.028120575185053648, 0.017980374266327714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 273.47619047619054, 164, 882, 177.0, 495.4, 843.4999999999994, 882.0, 0.1291854549481105, 7.550236224831906, 0.28896714883087166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 533.0, 80, 1245, 446.5, 1181.4000000000003, 1245.0, 1245.0, 0.15833850132608496, 94.73513143744968, 0.2309747425349994], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1128.695652173913, 122, 2421, 1152.0, 1713.0000000000002, 2286.599999999998, 2421.0, 0.10508280982295831, 0.03310608223872073, 0.04741040833809252], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 313.2105263157895, 165, 1137, 172.0, 878.0, 1137.0, 1137.0, 0.11131942816967424, 14.172966909933793, 0.24736188517986876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 89.8, 83, 106, 89.0, 101.2, 106.0, 106.0, 0.10080374183489692, 0.078260717537835, 0.03583258010537351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 351.2, 164, 1115, 325.0, 751.4000000000002, 1115.0, 1115.0, 0.08833193965161884, 7.172818035468218, 0.19715389889820628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 98.33333333333333, 81, 242, 85.0, 197.00000000000017, 242.0, 242.0, 0.06194379632879768, 0.04603440332638187, 0.03109288214160352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 122.66666666666666, 79, 244, 84.0, 243.4, 244.0, 244.0, 0.06189459350725714, 0.016561639278309042, 0.03529926035960759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 81.66666666666666, 79, 83, 82.0, 83.0, 83.0, 83.0, 0.06194507536650837, 0.016696133594879207, 0.0364169290728887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 123.66666666666666, 80, 249, 84.0, 247.5, 249.0, 249.0, 0.06189395502372602, 0.016682355064988653, 0.03644731921807304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 88.0, 84, 92, 88.0, 92.0, 92.0, 92.0, 0.07805995004163198, 0.023021586828684427, 0.048253855836282264], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 936.0701754385968, 651, 1546, 840.0, 1312.6000000000001, 1421.0, 1546.0, 0.27262422337967945, 326.15335067725596, 0.5383263473376092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87831a98-6f3e-4e9d-a41a-e30cf500c25f", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1128.695652173913, 122, 2421, 1152.0, 1713.0000000000002, 2286.599999999998, 2421.0, 0.10267857142857144, 0.0323486328125, 0.04632568359375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7e3536e-8c2a-45c4-a336-fd8d2f894aee", 3, 0, 0.0, 396.0, 234, 491, 463.0, 491.0, 491.0, 491.0, 0.022388728021731995, 0.03086466900131347, 0.014357354883727871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 115.3, 81, 245, 84.0, 244.7, 245.0, 245.0, 0.0810103612252007, 0.021834823923979875, 0.04770434357304299], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e81785c-52a5-4690-92e2-f159dda6e692", 3, 0, 0.0, 487.0, 210, 1025, 226.0, 1025.0, 1025.0, 1025.0, 0.05097272958966953, 0.03336789036615411, 0.03268759026420865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 146.39999999999998, 81, 559, 82.5, 527.6000000000001, 559.0, 559.0, 0.08111484239386123, 0.02186298486397041, 0.047686655391703574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 182.0, 80, 1000, 83.0, 598.0000000000002, 1000.0, 1000.0, 0.09710120534962907, 5.849216039258017, 0.05652857931226453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 134.33333333333334, 79, 494, 83.0, 350.6000000000001, 494.0, 494.0, 0.0972018818284322, 1.9298243926502416, 0.056682112990707495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 97.0, 81, 253, 83.0, 170.20000000000005, 253.0, 253.0, 0.09719999222400062, 0.07223554109615671, 0.048789839846812816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 115.60000000000001, 81, 246, 83.5, 245.8, 246.0, 246.0, 0.08111418443743257, 0.02170438138267239, 0.04626043331197326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 84.86666666666666, 80, 108, 83.0, 95.4, 108.0, 108.0, 0.09719999222400062, 0.035741247140700226, 0.05489015185878785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 100.0, 82, 243, 84.5, 227.30000000000007, 243.0, 243.0, 0.08111221063218857, 0.06027967997177295, 0.04071452760248528], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 475.21428571428567, 80, 1025, 473.0, 982.5, 1025.0, 1025.0, 0.07384550465490414, 0.014716560184086293, 0.050248528034918374], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 90.7, 83, 121, 88.5, 117.80000000000001, 121.0, 121.0, 0.08033612635265952, 0.06323331820336286, 0.02855698241442194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1672.6956521739128, 974, 4071, 1563.0, 2062.2, 3669.7999999999943, 4071.0, 0.09961237792069988, 0.051557187790987245, 0.04581780273500942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 280.4, 167, 643, 170.5, 627.6, 643.0, 643.0, 0.08095330613302248, 0.12546181331358072, 0.18206588283628003], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f446c88-f478-469c-8919-7e64afb532d7", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["addBook", 65, 7, 10.76923076923077, 925.1846153846153, 429, 4119, 734.0, 1526.6, 1611.8, 4119.0, 0.29706137745075634, 88.62837800203373, 1.0813462593117316], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6c32a887-048d-49c1-ae0e-ede06f6246f2", 3, 0, 0.0, 350.6666666666667, 184, 445, 423.0, 445.0, 445.0, 445.0, 0.0293166293693993, 0.029402517932004962, 0.01880005203701713], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 149.63157894736847, 81, 442, 86.0, 331.8, 349.29999999999995, 442.0, 0.2735584191202937, 0.20329878608451515, 0.1322377123677201], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59db083d-70a4-4c1c-960d-7514fc490924", 3, 0, 0.0, 396.3333333333333, 328, 442, 419.0, 442.0, 442.0, 442.0, 0.057750057750057746, 0.03712772267459767, 0.03703372843997844], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 532.4385964912282, 390, 913, 489.0, 707.2, 747.8999999999996, 913.0, 0.2731886871126832, 80.32654472925563, 0.13739470103811702], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 110.78947368421053, 81, 256, 85.0, 245.8, 251.1, 256.0, 0.2737265711665074, 0.48436772163448377, 0.1331209301180866], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 781.8771929824562, 564, 1144, 746.0, 1017.0000000000001, 1084.4, 1144.0, 0.2731114582235297, 245.74617018826723, 0.1370891499286077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 89.33333333333333, 82, 116, 87.0, 104.0, 116.0, 116.0, 0.0924430858734639, 0.06906148505195302, 0.03286062818158287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 187, 7, 3.7433155080213902, 168.58288770053466, 81, 2930, 94.0, 295.6, 397.9999999999999, 996.64000000001, 0.7943014182740298, 1.6525657369375646, 0.3851338140378971], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 101.58333333333333, 84, 256, 87.5, 206.80000000000018, 256.0, 256.0, 0.06189299732312786, 0.04793080749730507, 0.022001026392205608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b1eefd9-6519-4908-88fd-963326f92f34", 3, 0, 0.0, 952.3333333333334, 563, 1354, 940.0, 1354.0, 1354.0, 1354.0, 0.07128261179489617, 0.03225352551917502, 0.04571183113149266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 103.76190476190476, 83, 256, 87.0, 218.2000000000001, 255.1, 256.0, 0.13119834065336772, 0.10647052840131699, 0.04663691015412682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/815dceae-1f2c-4525-b4a2-9c7cbdeac4c4", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1673b015-b03e-4ae4-858e-c2f055b1e59f", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 223.3333333333333, 166, 486, 171.5, 440.40000000000015, 486.0, 486.0, 0.061866512687790635, 0.09588101136281615, 0.13913923703123227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b1f1c6c-b528-4d7c-ba99-07de3257af77", 3, 0, 0.0, 325.6666666666667, 195, 542, 240.0, 542.0, 542.0, 542.0, 0.06885945784653522, 0.0311571114605091, 0.044157920559138794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 293.46666666666664, 163, 1084, 177.0, 784.0000000000002, 1084.0, 1084.0, 0.09704780574911201, 7.8805724647878215, 0.21660741695942756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39d3ee53-d9f1-4619-b264-d2d054e9d96b", 2, 0, 0.0, 240.5, 213, 268, 240.5, 268.0, 268.0, 268.0, 0.014739262447307137, 0.02896754460469298, 0.009161660691124016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 111.50000000000001, 85, 250, 93.0, 248.6, 250.0, 250.0, 0.09542553825967674, 0.07911746287350152, 0.033920796803244474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 91.28571428571428, 83, 113, 86.0, 112.5, 113.0, 113.0, 0.06595777759979647, 0.05120745428890449, 0.023445928756177653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3572285b-6669-4e33-a315-30bb70ebf207", 3, 0, 0.0, 273.0, 176, 455, 188.0, 455.0, 455.0, 455.0, 0.022061094524436338, 0.026075466867912876, 0.014147251371464711], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=007adc60-17ab-4bf2-bdf1-edc4f71fe251", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 106.33333333333334, 80, 257, 84.0, 249.20000000000002, 257.0, 257.0, 0.08887098303156697, 0.06604572078810789, 0.04460906765451702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 136.2, 79, 253, 84.0, 250.0, 253.0, 253.0, 0.08887256266996878, 0.03267918189843643, 0.050187539622350855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 222.13333333333333, 79, 1030, 239.0, 563.2000000000003, 1030.0, 1030.0, 0.08837565545277794, 5.323603342440936, 0.05144890045955341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 184.80000000000004, 81, 647, 86.0, 409.40000000000015, 647.0, 647.0, 0.08857552835302662, 1.7585587026932865, 0.05165175829805074], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 24.0, 0.4341534008683068], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 12.0, 0.2170767004341534], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 12.0, 0.2170767004341534], "isController": false}, {"data": ["401/Unauthorized", 13, 52.0, 0.9406657018813314], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1382, 25, "401/Unauthorized", 13, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 187, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
