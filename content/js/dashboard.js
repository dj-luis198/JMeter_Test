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

    var data = {"OkPercent": 99.38271604938272, "KoPercent": 0.6172839506172839};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7778145695364238, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6c52e53f-5b12-4bc0-b45d-2b3208c1c3da"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a165183f-bd1a-431f-89be-80f9b2ea2556"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e133ab57-a092-4a86-ae5b-747f1430f3f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92137aea-210e-4334-ac56-e824f9cadbf1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c41e572d-de13-437e-a947-c14503eb9617"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=118aa078-f151-423d-a700-f72163a46d64"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/38dc7206-84f5-4556-96cb-51027d830a33"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b6e14456-c4a2-411a-b9a4-b40be411d02c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cae984f1-f327-4cc5-8ac9-4225c2048b9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6a7d56e-4643-4302-95d2-bd86fc905ed6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/07fecfb7-7c9e-46a0-bff9-c6c292f27e82"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98b75c5e-2e95-47c4-8695-07b022d5d7cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f5a0b89-50fa-4ab3-b317-2d694e434129"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2adc1f4c-e4a9-434e-87e1-ed7a64405110"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a704901-d878-4000-9926-4a4257a4b8f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ff94fb7d-e91f-4477-a1d3-534356eb7476"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/6f954822-ad2a-4974-8324-f550ce04af76"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "register"], "isController": true}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e6a7d56e-4643-4302-95d2-bd86fc905ed6"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a165183f-bd1a-431f-89be-80f9b2ea2556"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/98b75c5e-2e95-47c4-8695-07b022d5d7cc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/118aa078-f151-423d-a700-f72163a46d64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=848a9519-a5b0-49a2-9152-01889a817bce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.39473684210526316, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c52e53f-5b12-4bc0-b45d-2b3208c1c3da"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/202cdaf2-21ac-48cb-84d3-0b840dc68313"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4772727272727273, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2719298245614035, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92137aea-210e-4334-ac56-e824f9cadbf1"], "isController": false}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f5a0b89-50fa-4ab3-b317-2d694e434129"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cae984f1-f327-4cc5-8ac9-4225c2048b9b"], "isController": false}, {"data": [0.9619883040935673, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07fecfb7-7c9e-46a0-bff9-c6c292f27e82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c41e572d-de13-437e-a947-c14503eb9617"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2adc1f4c-e4a9-434e-87e1-ed7a64405110"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff94fb7d-e91f-4477-a1d3-534356eb7476"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/848a9519-a5b0-49a2-9152-01889a817bce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1296, 8, 0.6172839506172839, 420.4891975308642, 131, 2312, 155.0, 1100.7999999999988, 1270.1499999999999, 1563.3599999999997, 5.073280721533258, 743.2609901203632, 3.690474705037267], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2038.9824561403505, 1621, 2935, 1994.0, 2420.0, 2505.2, 2935.0, 0.24505694349502793, 294.8855161538743, 1.2049430766576812], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6c52e53f-5b12-4bc0-b45d-2b3208c1c3da", 3, 0, 0.0, 551.0, 224, 1009, 420.0, 1009.0, 1009.0, 1009.0, 0.036209144015835464, 0.030186073510597208, 0.023220056546613237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a165183f-bd1a-431f-89be-80f9b2ea2556", 3, 0, 0.0, 382.6666666666667, 227, 630, 291.0, 630.0, 630.0, 630.0, 0.07054839619979306, 0.03192131208258866, 0.045240996260935], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 589.0, 415, 1277, 467.0, 1078.5, 1277.0, 1277.0, 0.06805763509440566, 0.012295568840297899, 0.04625792385322885], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 589.0, 415, 1277, 467.0, 1078.5, 1277.0, 1277.0, 0.0664641093809343, 0.012007676011203951, 0.04517482434485378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e133ab57-a092-4a86-ae5b-747f1430f3f1", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.6176710589941973, 1.1541193181818181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 12, 0, 0.0, 163.66666666666669, 133, 425, 141.5, 341.3000000000003, 425.0, 425.0, 0.08311976172334973, 0.022241029992380687, 0.04740423910784789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 12, 0, 0.0, 142.5, 134, 151, 143.0, 149.5, 151.0, 151.0, 0.08311688311688312, 0.06176948051948052, 0.04172077922077922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 12, 0, 0.0, 223.91666666666666, 134, 573, 142.5, 528.9000000000002, 573.0, 573.0, 0.08295657223443527, 0.022359388610062633, 0.048850403376332494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 12, 0, 0.0, 221.83333333333334, 134, 572, 143.0, 527.6000000000001, 572.0, 572.0, 0.0829737802854298, 0.022364026717557252, 0.048779507550614006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92137aea-210e-4334-ac56-e824f9cadbf1", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 0.8138020833333334, 3.1056447072072073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c41e572d-de13-437e-a947-c14503eb9617", 3, 0, 0.0, 309.0, 224, 466, 237.0, 466.0, 466.0, 466.0, 0.040714402041148685, 0.033544320171271916, 0.026109170579773085], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 255.33333333333331, 224, 471, 231.0, 376.20000000000005, 471.0, 471.0, 0.07271493322345299, 0.1352990098649926, 0.047009068158130746], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=118aa078-f151-423d-a700-f72163a46d64", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 178.0, 133, 510, 143.5, 434.4000000000001, 510.0, 510.0, 0.08404773911581778, 0.062461259245251304, 0.04218802529836948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 215.38888888888886, 133, 427, 142.0, 426.1, 427.0, 427.0, 0.08404891646938518, 0.04352924026783588, 0.04675768172076148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 926.6666666666666, 702, 1092, 986.0, 1092.0, 1092.0, 1092.0, 0.03717103632849284, 10.92951887514249, 0.02119910665609357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38dc7206-84f5-4556-96cb-51027d830a33", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 924.6666666666666, 919, 930, 925.0, 930.0, 930.0, 930.0, 0.03724579743252303, 33.51383400091252, 0.02120537099918059], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 230.0, 142, 398, 150.0, 398.0, 398.0, 398.0, 0.03761378168961107, 0.0665587621304446, 0.020827162322274884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6e14456-c4a2-411a-b9a4-b40be411d02c", 2, 0, 0.0, 267.0, 253, 281, 267.0, 281.0, 281.0, 281.0, 0.02035519820874256, 0.029012120884433362, 0.012652425449086561], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cae984f1-f327-4cc5-8ac9-4225c2048b9b", 3, 0, 0.0, 388.0, 222, 471, 471.0, 471.0, 471.0, 471.0, 0.0351671023479902, 0.023021172793557386, 0.022551820190605695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 162.3076923076923, 134, 425, 143.0, 313.7999999999999, 425.0, 425.0, 0.07257299168201864, 0.053933639326187686, 0.036428239965388264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 185.0, 133, 428, 143.0, 427.2, 428.0, 428.0, 0.072457709779004, 0.02775948917314606, 0.04085543641835967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 312.0, 133, 1261, 143.0, 927.3999999999996, 1261.0, 1261.0, 0.07212285295814655, 5.0099647863637875, 0.041923575434956284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 223.0769230769231, 132, 663, 143.0, 566.5999999999999, 663.0, 663.0, 0.07236333071712062, 1.6547132359489893, 0.04213402767340759], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6a7d56e-4643-4302-95d2-bd86fc905ed6", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 0.7622956223628692, 2.9090849156118144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 139.0, 133, 143, 141.0, 143.0, 143.0, 143.0, 0.03761755485893417, 0.02795601489028213, 0.021123138714733543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 385.27777777777777, 131, 1271, 143.0, 1258.4, 1271.0, 1271.0, 0.08405362621352423, 12.624146002024291, 0.04821044576439769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 808.8124999999998, 133, 1405, 985.5, 1312.6000000000001, 1405.0, 1405.0, 0.07651694850409366, 43.03903686981119, 0.04087379964037034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 312.27777777777777, 132, 980, 143.0, 733.4000000000004, 980.0, 980.0, 0.08404930892790437, 4.137759516833209, 0.04829004891202839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 682.8125000000001, 142, 1136, 926.5, 1133.2, 1136.0, 1136.0, 0.07651585073670418, 14.069109206052405, 0.040947935745814346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07fecfb7-7c9e-46a0-bff9-c6c292f27e82", 3, 0, 0.0, 409.3333333333333, 236, 573, 419.0, 573.0, 573.0, 573.0, 0.025626350722235985, 0.025701427921617538, 0.01643356475351722], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 386.99999999999994, 222, 561, 414.0, 549.0, 561.0, 561.0, 0.074243713556331, 0.01341317090617308, 0.051187560323017266], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98b75c5e-2e95-47c4-8695-07b022d5d7cc", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f5a0b89-50fa-4ab3-b317-2d694e434129", 3, 0, 0.0, 305.6666666666667, 234, 425, 258.0, 425.0, 425.0, 425.0, 0.026003744539213645, 0.026079927384543376, 0.016675578366618128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 478.2307692307693, 277, 1396, 288.0, 1178.7999999999997, 1396.0, 1396.0, 0.07206528005676527, 6.7350287845359, 0.16065815176116457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2adc1f4c-e4a9-434e-87e1-ed7a64405110", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 488.2727272727272, 154, 906, 447.5, 899.4, 906.0, 906.0, 0.10484178421654594, 0.06439988503145254, 0.047404048918223404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 141.12500000000003, 133, 145, 142.0, 145.0, 145.0, 145.0, 0.07651585073670418, 0.056863830479132696, 0.03840737038932222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 245.87500000000003, 133, 427, 143.5, 425.6, 427.0, 427.0, 0.07651585073670418, 0.09230098107667367, 0.03962161118470448], "isController": false}, {"data": ["login", 22, 0, 0.0, 2136.5000000000005, 1101, 2759, 2188.0, 2748.5, 2757.65, 2759.0, 0.10615711252653928, 17.467722168439973, 0.18417278879559928], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4a704901-d878-4000-9926-4a4257a4b8f4", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 1.0073688880126184, 1.882270307570978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 159.88888888888886, 137, 406, 145.5, 177.40000000000038, 406.0, 406.0, 0.08546318673231505, 0.06918845879012615, 0.03037949215875262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff94fb7d-e91f-4477-a1d3-534356eb7476", 3, 0, 0.0, 284.0, 224, 395, 233.0, 395.0, 395.0, 395.0, 0.10317787866281469, 0.046685303171000135, 0.06616550161645343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 970.9999999999999, 285, 1551, 1134.0, 1450.9, 1551.0, 1551.0, 0.07646356033452807, 57.21756459080048, 0.15974089008363201], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 12, 0, 0.0, 415.08333333333326, 270, 717, 291.0, 674.4000000000001, 717.0, 717.0, 0.08287235585389603, 0.12843596556653616, 0.18638187063625253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1140.3333333333333, 1059, 1233, 1129.0, 1233.0, 1233.0, 1233.0, 0.037109423319561616, 44.395771613146636, 0.08367740082506618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f954822-ad2a-4974-8324-f550ce04af76", 2, 0, 0.0, 800.0, 313, 1287, 800.0, 1287.0, 1287.0, 1287.0, 0.024205748865355523, 0.027869704992435705, 0.015045858547655068], "isController": false}, {"data": ["register", 23, 3, 13.043478260869565, 1028.782608695652, 172, 1575, 1037.0, 1528.2, 1572.6, 1575.0, 0.0976139749259407, 0.031200662501803735, 0.04404068009353965], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 613.6666666666666, 276, 1416, 539.0, 1405.2, 1416.0, 1416.0, 0.08399165682875502, 16.855679184825973, 0.18531752929209033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 160.89473684210526, 135, 426, 145.0, 165.0, 426.0, 426.0, 0.0933014471545514, 0.07243618211705895, 0.03316574879321944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6a7d56e-4643-4302-95d2-bd86fc905ed6", 3, 0, 0.0, 292.3333333333333, 227, 413, 237.0, 413.0, 413.0, 413.0, 0.07007217433956976, 0.03170583409244855, 0.044935606591455866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 565.0624999999999, 285, 1410, 549.5, 1407.9, 1410.0, 1410.0, 0.08026849812623225, 12.112479133325976, 0.17795855260847537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a165183f-bd1a-431f-89be-80f9b2ea2556", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 0.7434735082304527, 2.837255658436214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98b75c5e-2e95-47c4-8695-07b022d5d7cc", 3, 0, 0.0, 535.0, 231, 824, 550.0, 824.0, 824.0, 824.0, 0.02871995175048106, 0.02880409223412505, 0.01841741697540615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/118aa078-f151-423d-a700-f72163a46d64", 3, 0, 0.0, 503.3333333333333, 229, 865, 416.0, 865.0, 865.0, 865.0, 0.01636214889555495, 0.022556543155167714, 0.0104926540769021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 138.88888888888886, 133, 144, 140.0, 144.0, 144.0, 144.0, 0.04644250417982538, 0.034514400078952255, 0.02331196010588891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 171.44444444444446, 132, 425, 142.0, 425.0, 425.0, 425.0, 0.04637358560563903, 0.01240855708588388, 0.02644743554071601], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=848a9519-a5b0-49a2-9152-01889a817bce", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 170.11111111111111, 134, 426, 140.0, 426.0, 426.0, 426.0, 0.04644322315968728, 0.012517899992259463, 0.02730353549036303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 170.00000000000003, 133, 427, 141.0, 427.0, 427.0, 427.0, 0.0464434628245882, 0.01251796458943979, 0.02734903133127606], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1324.7894736842104, 1061, 2312, 1136.0, 1840.6, 1929.6, 2312.0, 0.24327473399828428, 291.0411578436896, 0.48037257045364334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c52e53f-5b12-4bc0-b45d-2b3208c1c3da", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, 13.043478260869565, 1028.782608695652, 172, 1575, 1037.0, 1528.2, 1572.6, 1575.0, 0.09614982651226955, 0.03073267212909159, 0.043380097508465366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/202cdaf2-21ac-48cb-84d3-0b840dc68313", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 189.63636363636363, 131, 423, 143.0, 417.6, 423.0, 423.0, 0.050984463643442474, 0.013741906216396604, 0.03002307771190997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 165.27272727272725, 133, 423, 142.0, 367.0000000000002, 423.0, 423.0, 0.05104479412706441, 0.013758167167060329, 0.030008755922356224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 327.00000000000006, 141, 1193, 143.0, 1190.0, 1193.0, 1193.0, 0.09433353358522042, 13.423750072922303, 0.054177780853271636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 322.6315789473683, 140, 986, 143.0, 983.0, 986.0, 986.0, 0.09433353358522042, 4.4009677100038225, 0.05426990344466345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 192.45454545454544, 135, 423, 142.0, 422.8, 423.0, 423.0, 0.050978084058226236, 0.013640620148392568, 0.029073438564457155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 142.10526315789474, 135, 145, 142.0, 144.0, 145.0, 145.0, 0.09433353358522042, 0.0701052920491726, 0.04735101197539384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 141.9090909090909, 133, 147, 143.0, 146.6, 147.0, 147.0, 0.051043609804085344, 0.03793377642666889, 0.025621499452441274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 198.68421052631578, 134, 426, 142.0, 424.0, 426.0, 426.0, 0.0943340019462594, 0.0476130704724644, 0.05254892645423311], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 185.8181818181818, 144, 576, 146.0, 492.0000000000003, 576.0, 576.0, 0.0530307047780665, 0.04174096489367344, 0.018850758339078327], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 516.923076923077, 395, 1009, 466.0, 857.3999999999999, 1009.0, 1009.0, 0.0750499370735143, 0.013558826522070456, 0.05108379505882761], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1150.7727272727275, 682, 1532, 1164.5, 1499.7, 1527.1999999999998, 1532.0, 0.1056463153446471, 0.054680221809241175, 0.04859317824934452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 362.0, 278, 567, 288.0, 567.0, 567.0, 567.0, 0.05094337875012736, 0.07895228718403527, 0.11457285279447589], "isController": false}, {"data": ["addBook", 57, 5, 8.771929824561404, 1349.8596491228077, 678, 2216, 1183.0, 2023.0, 2138.5999999999995, 2216.0, 0.2721244324773349, 109.60984998693087, 0.9838075892281692], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/92137aea-210e-4334-ac56-e824f9cadbf1", 3, 0, 0.0, 300.3333333333333, 226, 449, 226.0, 449.0, 449.0, 449.0, 0.06472491909385113, 0.029286340345199568, 0.041506539913700104], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 244.33333333333337, 132, 859, 144.0, 572.2, 585.6999999999995, 859.0, 0.2443028154827981, 0.1815570728343841, 0.11809559928123539], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 777.1403508771931, 655, 1151, 705.0, 991.0, 1138.5, 1151.0, 0.2442127993213455, 71.80667162857804, 0.1228218668461845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f5a0b89-50fa-4ab3-b317-2d694e434129", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 206.35087719298244, 133, 448, 144.0, 425.2, 427.29999999999995, 448.0, 0.2447927850547563, 0.43316848292892424, 0.11904961616920764], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1076.561403508772, 917, 1419, 987.0, 1275.4, 1291.1999999999994, 1419.0, 0.24420547534381562, 219.7365159818024, 0.12257970149093869], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 147.18750000000006, 138, 163, 146.5, 156.0, 163.0, 163.0, 0.0835526590633747, 0.062419711116681285, 0.029700359276433972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cae984f1-f327-4cc5-8ac9-4225c2048b9b", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 5, 2.9239766081871346, 211.86549707602347, 133, 1469, 147.0, 346.4000000000001, 424.20000000000005, 1079.4800000000007, 0.6927311838411336, 1.5790547498166896, 0.331118733010869], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 145.55555555555554, 143, 154, 145.0, 154.0, 154.0, 154.0, 0.04719207173194903, 0.03654620398773006, 0.016775306748466258], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07fecfb7-7c9e-46a0-bff9-c6c292f27e82", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 12, 0, 0.0, 145.33333333333331, 135, 165, 144.0, 160.50000000000003, 165.0, 165.0, 0.079161416725488, 0.06424134501843802, 0.028139409851638313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 345.0, 279, 561, 286.0, 561.0, 561.0, 561.0, 0.04634087316503015, 0.07181930245400668, 0.1042217098623676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 520.3157894736843, 285, 1336, 289.0, 1333.0, 1336.0, 1336.0, 0.09426613811477647, 17.929617149243143, 0.2081985105330006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c41e572d-de13-437e-a947-c14503eb9617", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2adc1f4c-e4a9-434e-87e1-ed7a64405110", 3, 0, 0.0, 306.6666666666667, 227, 447, 246.0, 447.0, 447.0, 447.0, 0.038056577445135104, 0.03172620274641634, 0.024404771343397184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff94fb7d-e91f-4477-a1d3-534356eb7476", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 0.7140872035573123, 2.7251111660079053], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 148.3076923076923, 144, 170, 145.0, 165.6, 170.0, 170.0, 0.07091811685123561, 0.05879832149091702, 0.025209174349462658], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 144.49999999999997, 136, 150, 145.0, 149.3, 150.0, 150.0, 0.0767522294124137, 0.05958791248327042, 0.027283019048943938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/848a9519-a5b0-49a2-9152-01889a817bce", 3, 0, 0.0, 312.3333333333333, 230, 476, 231.0, 476.0, 476.0, 476.0, 0.04870287996363518, 0.030296615758628527, 0.031231990080846782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 177.375, 134, 425, 142.5, 423.6, 425.0, 425.0, 0.08032935033637915, 0.059697886333969274, 0.040321568430565315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 261.0, 136, 425, 145.5, 424.3, 425.0, 425.0, 0.08032693060757282, 0.036574640034942214, 0.044968176729288205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 334.81250000000006, 133, 1264, 143.0, 1068.0000000000002, 1264.0, 1264.0, 0.08032612406369861, 9.053642554395848, 0.04636009699379481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 279.5625, 132, 985, 142.5, 786.2000000000002, 985.0, 985.0, 0.08033338354169806, 2.9715310727017124, 0.04644273736004419], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 37.5, 0.23148148148148148], "isController": false}, {"data": ["401/Unauthorized", 5, 62.5, 0.38580246913580246], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1296, 8, "401/Unauthorized", 5, "406/Not Acceptable", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
