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

    var data = {"OkPercent": 97.97449362340585, "KoPercent": 2.0255063765941483};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8044602456367163, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a4c492a7-5157-4406-8bcb-e7bc4999783e"], "isController": false}, {"data": [0.39473684210526316, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ab190e7-7019-4f76-a8b1-7e1906e65c89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fafbac93-5b5a-47ad-8ad8-124ba971dc03"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/40a9a5dd-6525-4032-bf94-937ff82daccb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/02bb2a46-37ae-45cc-8d47-9a55c94f2861"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fd7433fa-b0ff-4f03-ba03-8e64b76a1384"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fbb40d65-3fd4-4d7a-864e-d2854aab0020"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de37cfc7-78e1-4203-8d77-29fe0b99a401"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ed2bd9d2-8477-41f1-8110-d2e94b5cddc5"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7f12bceb-3dfa-454b-9d34-18fbc66bb71b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2e34c80-71a0-4a7b-93d8-8fee70330fa3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/90ef4113-e1e8-44a8-a957-942aad43d87b"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02bb2a46-37ae-45cc-8d47-9a55c94f2861"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d5c76b92-f2c1-4c39-9dde-f9c49f4d6c59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed2bd9d2-8477-41f1-8110-d2e94b5cddc5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ab190e7-7019-4f76-a8b1-7e1906e65c89"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd7433fa-b0ff-4f03-ba03-8e64b76a1384"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f99a836-ba7f-4a57-8fd7-f143eb2d2a06"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fafbac93-5b5a-47ad-8ad8-124ba971dc03"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3416666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4c492a7-5157-4406-8bcb-e7bc4999783e"], "isController": false}, {"data": [0.8070175438596491, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9350282485875706, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de37cfc7-78e1-4203-8d77-29fe0b99a401"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f9fd556-e884-46f3-b7da-2ee7da8b46cf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fbb40d65-3fd4-4d7a-864e-d2854aab0020"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f2e34c80-71a0-4a7b-93d8-8fee70330fa3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f12bceb-3dfa-454b-9d34-18fbc66bb71b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90ef4113-e1e8-44a8-a957-942aad43d87b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1333, 27, 2.0255063765941483, 307.81395348837293, 77, 3648, 94.0, 850.6000000000001, 1036.4999999999998, 1579.680000000004, 5.308176902063539, 756.1466365514073, 3.886751571447344], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/a4c492a7-5157-4406-8bcb-e7bc4999783e", 3, 0, 0.0, 1611.3333333333333, 344, 3648, 842.0, 3648.0, 3648.0, 3648.0, 0.02326320768616382, 0.023331361614931878, 0.01491813774145271], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1328.8947368421059, 972, 1853, 1291.0, 1599.6, 1649.0999999999992, 1853.0, 0.2553397362385321, 307.2598658570456, 1.255503488243173], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ab190e7-7019-4f76-a8b1-7e1906e65c89", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fafbac93-5b5a-47ad-8ad8-124ba971dc03", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 0.9981439917127072, 3.8091332872928176], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 523.4615384615383, 82, 903, 528.0, 885.0, 903.0, 903.0, 0.0797413925300717, 0.015808108089457575, 0.053612189238592386], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 523.4615384615383, 82, 903, 528.0, 885.0, 903.0, 903.0, 0.08122309484983099, 0.01610184399855048, 0.05460837581925987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40a9a5dd-6525-4032-bf94-937ff82daccb", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 107.72222222222221, 79, 249, 81.0, 241.8, 249.0, 249.0, 0.08854215344355192, 0.031080063627375264, 0.05008357702921399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 99.44444444444446, 79, 241, 82.0, 238.3, 241.0, 241.0, 0.0885408468440107, 0.0658003754377853, 0.04444335476349756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 119.88888888888889, 78, 467, 81.0, 263.6000000000003, 467.0, 467.0, 0.08847252190923702, 1.4677357147596741, 0.051676170294859256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 172.38888888888889, 78, 941, 81.5, 313.70000000000095, 941.0, 941.0, 0.08847165220810499, 4.4451293360325375, 0.051589264210759135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02bb2a46-37ae-45cc-8d47-9a55c94f2861", 3, 0, 0.0, 795.0, 181, 1431, 773.0, 1431.0, 1431.0, 1431.0, 0.027638561320754717, 0.023041131361475533, 0.017723947201135026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd7433fa-b0ff-4f03-ba03-8e64b76a1384", 3, 0, 0.0, 801.6666666666666, 226, 1454, 725.0, 1454.0, 1454.0, 1454.0, 0.037192695354632356, 0.03100601979271271, 0.023850784455932854], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 263.2307692307692, 79, 503, 226.0, 499.4, 503.0, 503.0, 0.0790504220076375, 0.16184196224430228, 0.05109298609928733], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 83.05000000000001, 79, 96, 82.0, 85.9, 95.5, 96.0, 0.11717079400788559, 0.08707712328125092, 0.05881424621098945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 95.9, 78, 238, 80.5, 220.70000000000033, 237.9, 238.0, 0.11717285339332584, 0.040152299077849646, 0.06633310850792089], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 602.0, 464, 637, 617.0, 637.0, 637.0, 637.0, 0.06388551715326135, 18.78446324187057, 0.03643470900146937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 831.7142857142857, 704, 945, 863.0, 945.0, 945.0, 945.0, 0.06365372374283895, 57.27573251511776, 0.03624035248249523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 168.85714285714283, 79, 238, 234.0, 238.0, 238.0, 238.0, 0.06401931554206068, 0.11328417945528708, 0.03544819522690275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 81.64285714285714, 78, 98, 80.0, 91.0, 98.0, 98.0, 0.08052641266335359, 0.05984433597344929, 0.040420484481409905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 127.71428571428571, 78, 243, 82.0, 243.0, 243.0, 243.0, 0.08052641266335359, 0.038825234676974046, 0.044959082516565434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 223.64285714285714, 78, 850, 86.0, 774.0, 850.0, 850.0, 0.0805268758448132, 10.369778784763165, 0.04635238417071698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 173.57142857142858, 78, 639, 83.0, 551.5, 639.0, 639.0, 0.0805268758448132, 3.401114614189986, 0.04643102369790918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 81.0, 79, 84, 81.0, 84.0, 84.0, 84.0, 0.06411019626878657, 0.04764439390678377, 0.035999377787648716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 131.39999999999998, 78, 924, 80.5, 231.90000000000035, 890.1999999999995, 924.0, 0.11717285339332584, 5.301619630920158, 0.06838134491001126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 572.764705882353, 78, 1180, 773.0, 1072.0, 1180.0, 1180.0, 0.08810070428739486, 46.641053357284626, 0.047339957944869684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 132.64999999999998, 78, 471, 82.5, 240.8, 459.49999999999983, 471.0, 0.11717079400788559, 1.752607324785724, 0.06849456766906281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 401.23529411764713, 78, 672, 486.0, 667.2, 672.0, 672.0, 0.08802953649859929, 15.235420755293424, 0.047387683049653836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fbb40d65-3fd4-4d7a-864e-d2854aab0020", 1, 0, 0.0, 880.0, 880, 880, 880.0, 880.0, 880.0, 880.0, 1.1363636363636362, 0.20530007102272727, 0.7834694602272727], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 458.9230769230769, 85, 880, 493.0, 825.1999999999999, 880.0, 880.0, 0.08141639475678418, 0.016140164194948424, 0.055239849567553685], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 320.2857142857142, 162, 930, 247.0, 854.0, 930.0, 930.0, 0.08048844990743828, 13.862945237670894, 0.1780784496487254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 654.2727272727273, 109, 3304, 521.0, 1218.1999999999998, 2996.349999999996, 3304.0, 0.0949470885770021, 0.05832199093255304, 0.04293017774526559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 82.47058823529413, 80, 88, 82.0, 87.2, 88.0, 88.0, 0.08810070428739486, 0.06547327730733153, 0.04422242383175875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 136.11764705882354, 78, 242, 80.0, 241.2, 242.0, 242.0, 0.0881011608623549, 0.1014114810064262, 0.04589276922678275], "isController": false}, {"data": ["login", 22, 0, 0.0, 3029.363636363636, 1659, 5745, 2665.5, 5590.9, 5743.8, 5745.0, 0.09253456376262362, 35.34872501435337, 0.18843730678152168], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de37cfc7-78e1-4203-8d77-29fe0b99a401", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.33210305606617646, 1.2673770680147058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 96.44999999999999, 82, 241, 85.5, 111.80000000000001, 234.5499999999999, 241.0, 0.1268480170483735, 0.10269238880185705, 0.04509050606016401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed2bd9d2-8477-41f1-8110-d2e94b5cddc5", 3, 0, 0.0, 335.6666666666667, 193, 416, 398.0, 416.0, 416.0, 416.0, 0.018369633770734726, 0.025324023118184102, 0.011780006031363088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 666.1764705882351, 162, 1262, 862.0, 1155.6, 1262.0, 1262.0, 0.08799217387253558, 61.97922968189535, 0.18465315393713216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f12bceb-3dfa-454b-9d34-18fbc66bb71b", 3, 0, 0.0, 907.3333333333334, 193, 2060, 469.0, 2060.0, 2060.0, 2060.0, 0.042003864355520705, 0.02700443753325306, 0.026936071868611914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2e34c80-71a0-4a7b-93d8-8fee70330fa3", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90ef4113-e1e8-44a8-a957-942aad43d87b", 3, 0, 0.0, 669.6666666666667, 263, 1243, 503.0, 1243.0, 1243.0, 1243.0, 0.022445345583504167, 0.026529638611231653, 0.014393662369629953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 282.3333333333333, 160, 1179, 168.5, 555.300000000001, 1179.0, 1179.0, 0.08843600917769251, 6.007233750804522, 0.1976375916909456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 626.0000000000001, 79, 1027, 824.0, 1025.0, 1027.0, 1027.0, 0.09995365784954248, 76.10565925116536, 0.1675093394199053], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1024.8260869565217, 94, 2547, 1014.0, 1916.6000000000008, 2462.199999999999, 2547.0, 0.09677405782039576, 0.03019258563452225, 0.04366173311818637], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 263.90000000000003, 162, 1007, 171.0, 330.20000000000005, 973.1999999999995, 1007.0, 0.11711316059142146, 7.177830158468745, 0.2618920180061484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 95.9411764705882, 80, 249, 85.0, 124.99999999999989, 249.0, 249.0, 0.09352581312442233, 0.07261037249405836, 0.033245503884072006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 240.40000000000003, 162, 339, 182.0, 331.8, 339.0, 339.0, 0.10370646920954929, 0.16072477210503391, 0.23323827987264845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02bb2a46-37ae-45cc-8d47-9a55c94f2861", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.3158462631118881, 1.2053376311188813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 97.54545454545455, 79, 239, 81.0, 210.6000000000001, 239.0, 239.0, 0.0717028114020507, 0.05328695261421932, 0.035991450254544984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 123.72727272727273, 77, 238, 82.0, 237.4, 238.0, 238.0, 0.07170327879538492, 0.019186228896421353, 0.04089327618799296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 109.72727272727273, 78, 240, 80.0, 238.8, 240.0, 240.0, 0.07177673520257352, 0.019346073160068648, 0.04219686971870045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 108.63636363636364, 78, 239, 80.0, 237.6, 239.0, 239.0, 0.0717772035601493, 0.019346199397071488, 0.0422672399870801], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 87.5, 85, 90, 87.5, 90.0, 90.0, 90.0, 0.8153281695882593, 0.24045811251528743, 0.5040065735833673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5c76b92-f2c1-4c39-9dde-f9c49f4d6c59", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 1.8674616228070173, 3.4893548976608186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed2bd9d2-8477-41f1-8110-d2e94b5cddc5", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 919.8421052631578, 628, 1497, 867.0, 1255.8, 1281.1999999999994, 1497.0, 0.2480255857972717, 296.7248282585993, 0.4897536469551596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ab190e7-7019-4f76-a8b1-7e1906e65c89", 3, 0, 0.0, 293.6666666666667, 191, 425, 265.0, 425.0, 425.0, 425.0, 0.05054674731681016, 0.033089032830112386, 0.03241441803844922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1024.8260869565217, 94, 2547, 1014.0, 1916.6000000000008, 2462.199999999999, 2547.0, 0.09675614506690897, 0.030186997025800234, 0.04365365138760932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 82.6, 79, 92, 81.0, 92.0, 92.0, 92.0, 0.025448659873571058, 0.0068592091065484495, 0.014985880765393896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 83.0, 80, 93, 81.0, 93.0, 93.0, 93.0, 0.025448400822492313, 0.006859139284187381, 0.014960876264785521], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd7433fa-b0ff-4f03-ba03-8e64b76a1384", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 155.58823529411762, 78, 896, 80.0, 374.3999999999995, 896.0, 896.0, 0.09004714232745378, 4.788994426677791, 0.05248266923565867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f99a836-ba7f-4a57-8fd7-f143eb2d2a06", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 1.3141396604938271, 2.455471965020576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 164.52941176470588, 79, 733, 81.0, 338.5999999999997, 733.0, 733.0, 0.09004571144057248, 1.5802794760663794, 0.052569770529098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 82.0, 79, 92, 80.0, 92.0, 92.0, 92.0, 0.025448659873571058, 0.006809504692732881, 0.014513688834145994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 111.35294117647061, 80, 249, 82.0, 246.6, 249.0, 249.0, 0.09004141905276428, 0.0669155467765172, 0.04519657167296957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 84.4, 81, 92, 83.0, 92.0, 92.0, 92.0, 0.025448271298930663, 0.018912240682115465, 0.012773839304346056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 90.23529411764706, 79, 244, 81.0, 115.19999999999989, 244.0, 244.0, 0.09004618839781346, 0.03204998755243866, 0.050909615476291366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 122.4, 84, 258, 93.0, 258.0, 258.0, 258.0, 0.026250577512705278, 0.020662075659414508, 0.009331259975219455], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 557.6153846153845, 80, 1243, 469.0, 1082.6, 1243.0, 1243.0, 0.08311595314817656, 0.016127441930719657, 0.056561554955628875], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fafbac93-5b5a-47ad-8ad8-124ba971dc03", 3, 0, 0.0, 378.0, 213, 494, 427.0, 494.0, 494.0, 494.0, 0.07236937328122738, 0.032745256790659524, 0.046408745235682926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1417.8181818181818, 1014, 2146, 1450.0, 1757.2, 2087.9499999999994, 2146.0, 0.09303505730113756, 0.04815291051719034, 0.04279249217659745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 168.6, 163, 185, 165.0, 185.0, 185.0, 185.0, 0.02543765485172391, 0.03942339672820883, 0.05720988195656266], "isController": false}, {"data": ["addBook", 60, 11, 18.333333333333332, 850.4500000000003, 418, 1672, 697.0, 1525.0, 1577.85, 1672.0, 0.2850017812611329, 86.35404142174326, 1.0362579414558841], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 152.82456140350874, 79, 506, 84.0, 328.0, 345.19999999999953, 506.0, 0.24895830603527347, 0.1850168661062921, 0.12034605614009801], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4c492a7-5157-4406-8bcb-e7bc4999783e", 1, 0, 0.0, 743.0, 743, 743, 743.0, 743.0, 743.0, 743.0, 1.3458950201884252, 0.24315486204576042, 0.927931527590848], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 520.5964912280702, 385, 807, 472.0, 661.0, 707.1, 807.0, 0.2491149862331192, 73.24807734856431, 0.12528732217778943], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 127.31578947368425, 79, 246, 85.0, 239.0, 241.49999999999997, 246.0, 0.24945841265673213, 0.44142445677148295, 0.12131864209282478], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 763.9824561403509, 543, 1062, 768.0, 941.8, 999.6999999999999, 1062.0, 0.248609748119071, 223.69948836686294, 0.12479043997383055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 84.93333333333334, 80, 92, 84.0, 91.4, 92.0, 92.0, 0.10379832677097245, 0.07754464841776751, 0.036897061469369115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 11, 6.214689265536723, 141.0, 80, 957, 88.0, 282.80000000000007, 330.29999999999984, 600.5399999999995, 0.73131429988018, 1.5797410509544272, 0.35113964436226913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 85.18181818181819, 81, 99, 83.0, 96.4, 99.0, 99.0, 0.07070635650144948, 0.05475599678286078, 0.02513390016262462], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 93.88888888888889, 80, 255, 84.5, 109.20000000000023, 255.0, 255.0, 0.08522767626740657, 0.06916425681466294, 0.030295775548179676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de37cfc7-78e1-4203-8d77-29fe0b99a401", 3, 0, 0.0, 301.3333333333333, 174, 432, 298.0, 432.0, 432.0, 432.0, 0.023965106804492656, 0.02832594492419038, 0.01536824882970395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f9fd556-e884-46f3-b7da-2ee7da8b46cf", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.8654090447154472, 1.617018123306233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fbb40d65-3fd4-4d7a-864e-d2854aab0020", 3, 0, 0.0, 484.0, 295, 818, 339.0, 818.0, 818.0, 818.0, 0.02014044604374505, 0.02380532538568954, 0.012915585516333901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 237.63636363636363, 162, 474, 170.0, 443.60000000000014, 474.0, 474.0, 0.07159127888057273, 0.11095249959323136, 0.16101046412300682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 296.4117647058824, 162, 978, 167.0, 590.7999999999996, 978.0, 978.0, 0.09000232947205691, 6.46505014320959, 0.20106276372006102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2e34c80-71a0-4a7b-93d8-8fee70330fa3", 3, 0, 0.0, 1374.0, 181, 3426, 515.0, 3426.0, 3426.0, 3426.0, 0.021185692595600436, 0.02504077142403164, 0.013585877087673458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 101.14285714285715, 80, 284, 86.0, 193.0, 284.0, 284.0, 0.08135136234477869, 0.06744854163155968, 0.028917867083495554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 95.6470588235294, 81, 236, 87.0, 122.39999999999989, 236.0, 236.0, 0.08551178805148817, 0.06638854638762996, 0.03039676840892743], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f12bceb-3dfa-454b-9d34-18fbc66bb71b", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90ef4113-e1e8-44a8-a957-942aad43d87b", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 83.8, 79, 100, 82.0, 94.60000000000001, 100.0, 100.0, 0.10376601455491298, 0.07711517292606325, 0.05208567527463405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 133.73333333333332, 78, 253, 81.0, 245.8, 253.0, 253.0, 0.10376673238559718, 0.02776570768911487, 0.05917946456366089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 112.2, 78, 245, 81.0, 239.0, 245.0, 245.0, 0.10376601455491298, 0.027968183610503884, 0.06100306715044688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 132.13333333333335, 79, 242, 81.0, 238.4, 242.0, 242.0, 0.10376601455491298, 0.027968183610503884, 0.06110440114903566], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 29.62962962962963, 0.6001500375093773], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.407407407407407, 0.15003750937734434], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.407407407407407, 0.15003750937734434], "isController": false}, {"data": ["401/Unauthorized", 15, 55.55555555555556, 1.1252813203300824], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1333, 27, "401/Unauthorized", 15, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
