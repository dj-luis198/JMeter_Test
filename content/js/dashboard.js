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

    var data = {"OkPercent": 98.49056603773585, "KoPercent": 1.509433962264151};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8181522446324008, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3508771929824561, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/990bcac7-ba5b-4c09-92b2-c153208041dc"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f7c0ceb-d473-4266-992f-24c545ea9e8c"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b20efa64-051c-4f74-baf5-776bfaad025d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/68d17bb6-47ee-4f8c-be04-1cb342126777"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a9ad6a4e-ca80-477c-83df-654ad7ada7c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe240b4a-91ad-4a40-8963-e9acc5396657"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e98a5f95-3537-46c1-b26b-c440f40f9212"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d222fc67-aa8a-4607-b8fc-09e238ffd446"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5fb7ef10-710a-46a3-8996-9fc1104be997"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0157aae-ac9a-4ee2-bd05-ef30fbeac4fe"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d26e3e22-ffa1-4db2-b198-0ff46c283536"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a263a57-be6a-450e-bf4c-8d38e42b1cec"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa58412c-c7ec-4f6d-bbd8-3ea5148600b4"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dca6d051-d829-4d9a-b7c3-94862eb36085"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9ad6a4e-ca80-477c-83df-654ad7ada7c0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5a4985c9-cafc-46d9-b9b4-5c16ac175a66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e98a5f95-3537-46c1-b26b-c440f40f9212"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2f7c0ceb-d473-4266-992f-24c545ea9e8c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b20efa64-051c-4f74-baf5-776bfaad025d"], "isController": false}, {"data": [0.38333333333333336, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7543859649122807, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.940677966101695, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d222fc67-aa8a-4607-b8fc-09e238ffd446"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68d17bb6-47ee-4f8c-be04-1cb342126777"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5fb7ef10-710a-46a3-8996-9fc1104be997"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d26e3e22-ffa1-4db2-b198-0ff46c283536"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a4985c9-cafc-46d9-b9b4-5c16ac175a66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5a263a57-be6a-450e-bf4c-8d38e42b1cec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dca6d051-d829-4d9a-b7c3-94862eb36085"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa58412c-c7ec-4f6d-bbd8-3ea5148600b4"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1325, 20, 1.509433962264151, 303.6286792452829, 90, 2394, 105.0, 766.4000000000001, 894.8000000000006, 1441.18, 5.27732859635008, 727.7145274525637, 3.869007649388228], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1401.7719298245613, 1107, 1941, 1385.0, 1648.2, 1744.1999999999994, 1941.0, 0.24434156378600824, 294.02493030773104, 1.2014255602173354], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/990bcac7-ba5b-4c09-92b2-c153208041dc", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 0.8870442708333334, 1.6574435763888888], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 450.7692307692308, 98, 628, 455.0, 595.6, 628.0, 628.0, 0.08590497588052601, 0.016274966133615277, 0.0580723315766867], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 450.7692307692308, 98, 628, 455.0, 595.6, 628.0, 628.0, 0.08858965272856131, 0.016783586552090717, 0.05988719087322139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 157.25, 93, 302, 97.5, 300.6, 302.0, 302.0, 0.0752360531166535, 0.03425665016175752, 0.04211822993078283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 133.625, 93, 294, 97.5, 290.5, 294.0, 294.0, 0.07523003935471434, 0.05590826166888438, 0.03776195334797184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 204.50000000000003, 92, 675, 101.0, 536.4000000000001, 675.0, 675.0, 0.0752346380273478, 2.7829285259183325, 0.043495025109560444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 236.1875, 91, 823, 101.5, 693.5000000000001, 823.0, 823.0, 0.07517066089105422, 8.472564837631372, 0.043384629479114305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f7c0ceb-d473-4266-992f-24c545ea9e8c", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 218.0769230769231, 97, 316, 211.0, 301.2, 316.0, 316.0, 0.0859407537665188, 0.19826671341072408, 0.055552898599826796], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 108.8125, 93, 279, 98.0, 155.80000000000013, 279.0, 279.0, 0.09144215712048648, 0.06795652496942403, 0.04589967652336919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b20efa64-051c-4f74-baf5-776bfaad025d", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68d17bb6-47ee-4f8c-be04-1cb342126777", 3, 0, 0.0, 1082.0, 263, 2394, 589.0, 2394.0, 2394.0, 2394.0, 0.023630047968997377, 0.027929916723772617, 0.015153383625952095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 109.375, 92, 285, 97.5, 156.90000000000015, 285.0, 285.0, 0.09144372496013625, 0.024468340467848956, 0.0521514993913277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 572.0, 458, 797, 530.5, 797.0, 797.0, 797.0, 0.0764779361154307, 22.48705252440921, 0.04361632294083157], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 800.1666666666667, 638, 949, 839.0, 949.0, 949.0, 949.0, 0.07629510948348212, 68.65047362573435, 0.04343754768444343], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9ad6a4e-ca80-477c-83df-654ad7ada7c0", 3, 0, 0.0, 551.3333333333334, 211, 991, 452.0, 991.0, 991.0, 991.0, 0.01830529572205239, 0.025235327924118447, 0.011738747582175524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 225.0, 96, 388, 196.0, 388.0, 388.0, 388.0, 0.07685312087715028, 0.13599399905214485, 0.04255441361068771], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe240b4a-91ad-4a40-8963-e9acc5396657", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 1.144573252688172, 2.1386368727598564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 99.06250000000001, 93, 113, 98.5, 107.4, 113.0, 113.0, 0.07704234439854005, 0.05725510164774314, 0.038671645528173426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 134.875, 92, 301, 99.0, 293.3, 301.0, 301.0, 0.07704234439854005, 0.020614846059765598, 0.04393821203979237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 143.87500000000003, 92, 291, 97.5, 290.3, 291.0, 291.0, 0.0770412315040856, 0.02076501942883557, 0.045291817739706565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e98a5f95-3537-46c1-b26b-c440f40f9212", 1, 0, 0.0, 595.0, 595, 595, 595.0, 595.0, 595.0, 595.0, 1.680672268907563, 0.3036370798319328, 1.1587447478991597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 121.375, 93, 290, 97.5, 287.2, 290.0, 290.0, 0.07704197343014942, 0.020765219401094957, 0.045367490213261814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d222fc67-aa8a-4607-b8fc-09e238ffd446", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 130.5, 95, 291, 98.5, 291.0, 291.0, 291.0, 0.07685312087715028, 0.057114477526866575, 0.04315482861754044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 144.24999999999997, 92, 305, 98.0, 293.1, 305.0, 305.0, 0.09144477021643835, 0.024647223222399397, 0.053759523115523324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 564.0625, 92, 1332, 661.5, 1028.9000000000003, 1332.0, 1332.0, 0.08658102360415156, 48.69984937945757, 0.0462498241322958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 146.31249999999997, 92, 301, 100.0, 296.1, 301.0, 301.0, 0.09143902160246885, 0.024645673791290436, 0.05384543947879758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 503.1250000000001, 92, 810, 664.5, 794.6, 810.0, 810.0, 0.08648087691609194, 15.901396767506972, 0.04628078178712732], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 574.9230769230769, 98, 1447, 440.0, 1208.9999999999998, 1447.0, 1447.0, 0.0888591172871995, 0.016834637454801467, 0.06077691277794106], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 260.06250000000006, 196, 403, 201.5, 398.8, 403.0, 403.0, 0.07700563584997377, 0.1193436954042074, 0.17318747984618124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5fb7ef10-710a-46a3-8996-9fc1104be997", 1, 0, 0.0, 1447.0, 1447, 1447, 1447.0, 1447.0, 1447.0, 1447.0, 0.691085003455425, 0.12485422425708362, 0.4764707152729786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 508.42857142857144, 107, 1851, 433.0, 789.2, 1747.4999999999986, 1851.0, 0.08962523846715235, 0.05505300292562386, 0.04052391153348783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 108.81249999999999, 92, 287, 97.0, 158.20000000000013, 287.0, 287.0, 0.08657821259280103, 0.06434181619445467, 0.043458204367870824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 146.0625, 93, 298, 97.0, 298.0, 298.0, 298.0, 0.08657914957630329, 0.10444032667395375, 0.04483261138948713], "isController": false}, {"data": ["login", 21, 0, 0.0, 2542.3333333333326, 1357, 4246, 2297.0, 3575.2, 4179.299999999999, 4246.0, 0.08573178199632578, 29.420879898958972, 0.16996852036129823], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 102.5625, 97, 130, 100.0, 113.20000000000002, 130.0, 130.0, 0.09085282410325422, 0.07355174920077906, 0.032295339817953655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0157aae-ac9a-4ee2-bd05-ef30fbeac4fe", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 1.3034119897959184, 2.4354272959183674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d26e3e22-ffa1-4db2-b198-0ff46c283536", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a263a57-be6a-450e-bf4c-8d38e42b1cec", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 704.0624999999999, 191, 1436, 774.5, 1129.4000000000003, 1436.0, 1436.0, 0.08643509264761493, 64.67924688360974, 0.18057253119766625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 399.24999999999994, 193, 922, 382.5, 814.9000000000001, 922.0, 922.0, 0.07513148009015778, 11.337305494576446, 0.16656957292449284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa58412c-c7ec-4f6d-bbd8-3ea5148600b4", 3, 0, 0.0, 293.3333333333333, 220, 415, 245.0, 415.0, 415.0, 415.0, 0.02221284346609209, 0.026254828979616018, 0.01424456433209682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 723.375, 97, 1154, 845.0, 1154.0, 1154.0, 1154.0, 0.09190120620333142, 82.4654921740379, 0.17064321869615165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dca6d051-d829-4d9a-b7c3-94862eb36085", 3, 0, 0.0, 266.6666666666667, 192, 414, 194.0, 414.0, 414.0, 414.0, 0.05776228892696921, 0.03713558614282689, 0.03704157200069315], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 705.5000000000001, 111, 1303, 751.0, 1135.6, 1284.9999999999998, 1303.0, 0.0884827619491948, 0.027839391721231038, 0.03992093361379687], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9ad6a4e-ca80-477c-83df-654ad7ada7c0", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.3062102754237288, 1.168564618644068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 306.1875, 193, 565, 294.5, 449.5000000000001, 565.0, 565.0, 0.09138836054992945, 0.14163410956322076, 0.20553456479149174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 123.05555555555554, 95, 310, 103.0, 286.6, 310.0, 310.0, 0.10117247658981306, 0.07854699110244276, 0.03596365378778511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 305.05263157894734, 191, 1150, 200.0, 692.0, 1150.0, 1150.0, 0.09751340809361288, 6.283169394262106, 0.21799679713361902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 127.71428571428571, 93, 305, 99.0, 305.0, 305.0, 305.0, 0.04590464948521215, 0.03411468579906879, 0.023041982261131876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 125.57142857142858, 91, 302, 97.0, 302.0, 302.0, 302.0, 0.04596735004793738, 0.012299857337045743, 0.026215754324214285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 183.14285714285714, 97, 303, 100.0, 303.0, 303.0, 303.0, 0.045908262175526966, 0.012373711289497501, 0.026989036943034405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 149.71428571428572, 92, 294, 99.0, 294.0, 294.0, 294.0, 0.04590796109628211, 0.012373630139232287, 0.027033691934627062], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 3.009406887755102, 6.307796556122449], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 885.3333333333336, 726, 1518, 795.0, 1229.6, 1341.2999999999993, 1518.0, 0.25553089906529486, 305.70379219622083, 0.50457370889651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 705.5000000000001, 111, 1303, 751.0, 1135.6, 1284.9999999999998, 1303.0, 0.08887739766979623, 0.02796355622707367, 0.0400989821518026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 117.33333333333333, 90, 277, 98.0, 277.0, 277.0, 277.0, 0.04776486946922615, 0.012874124974127363, 0.028127164345647823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 137.99999999999997, 94, 286, 97.0, 286.0, 286.0, 286.0, 0.047766136993280896, 0.012874466611470242, 0.028081264130815527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a4985c9-cafc-46d9-b9b4-5c16ac175a66", 3, 0, 0.0, 899.6666666666666, 197, 1810, 692.0, 1810.0, 1810.0, 1810.0, 0.028510064052610574, 0.023767667330317602, 0.01828282102332123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 118.55555555555556, 92, 287, 98.0, 281.6, 287.0, 287.0, 0.09906493706624693, 0.026701096318636864, 0.05823934776746157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 130.38888888888889, 90, 308, 97.0, 306.2, 308.0, 308.0, 0.0989603663732675, 0.026672911249044758, 0.05827451262019562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 119.0, 93, 276, 99.0, 276.0, 276.0, 276.0, 0.04776486946922615, 0.01278083421344528, 0.02724090211916804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 109.16666666666667, 91, 287, 99.0, 122.30000000000027, 287.0, 287.0, 0.09906384664916539, 0.07362069072267076, 0.049725407400069345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 138.55555555555557, 97, 283, 100.0, 283.0, 283.0, 283.0, 0.04776486946922615, 0.03549713443953233, 0.02397572549529516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 161.2777777777778, 92, 307, 99.0, 293.5, 307.0, 307.0, 0.0989603663732675, 0.02647962928347197, 0.05643833394725413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 123.66666666666669, 96, 304, 101.0, 304.0, 304.0, 304.0, 0.04898732316937095, 0.03855838132276659, 0.017413462532862328], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 495.9230769230769, 103, 877, 469.0, 802.9999999999999, 877.0, 877.0, 0.09023140885933617, 0.016904832759554116, 0.06141049911850854], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1254.3809523809525, 790, 2165, 1087.0, 2071.0, 2159.2, 2165.0, 0.08868018546827361, 0.0458989241193213, 0.040789421245661005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 281.55555555555554, 196, 570, 202.0, 570.0, 570.0, 570.0, 0.047739533107366214, 0.07398695218885759, 0.10736732885377381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e98a5f95-3537-46c1-b26b-c440f40f9212", 3, 0, 0.0, 428.33333333333337, 194, 877, 214.0, 877.0, 877.0, 877.0, 0.03536192934686517, 0.035465528749248555, 0.022676758077254028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f7c0ceb-d473-4266-992f-24c545ea9e8c", 3, 0, 0.0, 353.3333333333333, 241, 503, 316.0, 503.0, 503.0, 503.0, 0.034348129744335425, 0.02863462248543067, 0.022026632681100517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b20efa64-051c-4f74-baf5-776bfaad025d", 3, 0, 0.0, 914.3333333333334, 195, 1992, 556.0, 1992.0, 1992.0, 1992.0, 0.039149158293096696, 0.025169136597938145, 0.025105417264778808], "isController": false}, {"data": ["addBook", 60, 10, 16.666666666666668, 881.5166666666669, 475, 1914, 796.5, 1373.8, 1556.1499999999999, 1914.0, 0.2806046093983837, 73.82492618052697, 1.0230696083578081], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 157.14035087719304, 94, 484, 102.0, 388.4, 408.1, 484.0, 0.2563110987202432, 0.19048119738877448, 0.12390038463527381], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 548.3508771929825, 450, 860, 497.0, 693.2000000000002, 756.3, 860.0, 0.25604743615659326, 75.28644780506704, 0.12877385705141162], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 148.05263157894737, 92, 398, 101.0, 294.20000000000005, 304.2, 398.0, 0.2567128149235716, 0.45426134828272635, 0.12484666194525261], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 720.3684210526316, 629, 1068, 677.0, 871.0, 923.6999999999998, 1068.0, 0.2560934516455127, 230.43333795490284, 0.12854690834550153], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 113.78947368421053, 98, 309, 103.0, 109.0, 309.0, 309.0, 0.09526292567486262, 0.07116810365358389, 0.03386299311098632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 10, 5.649717514124294, 148.33898305084747, 92, 1244, 102.0, 274.40000000000003, 297.4, 605.9599999999991, 0.7333990768287326, 1.5656715560801684, 0.3525007756109587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 102.42857142857143, 100, 106, 102.0, 106.0, 106.0, 106.0, 0.04914418905067468, 0.038057951091001, 0.017469223451607018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d222fc67-aa8a-4607-b8fc-09e238ffd446", 3, 0, 0.0, 581.0, 279, 1043, 421.0, 1043.0, 1043.0, 1043.0, 0.018912887241366267, 0.026072941883849652, 0.01212838146663136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 101.43749999999999, 94, 110, 101.5, 107.9, 110.0, 110.0, 0.07351927583513303, 0.05966261544823784, 0.026133805082019942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68d17bb6-47ee-4f8c-be04-1cb342126777", 1, 0, 0.0, 852.0, 852, 852, 852.0, 852.0, 852.0, 852.0, 1.1737089201877935, 0.21204702171361503, 0.8092172828638498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 341.2857142857143, 190, 609, 388.0, 609.0, 609.0, 609.0, 0.04581601597015414, 0.07100587631311975, 0.10304129372975096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5fb7ef10-710a-46a3-8996-9fc1104be997", 3, 0, 0.0, 292.0, 228, 419, 229.0, 419.0, 419.0, 419.0, 0.017144032733673167, 0.023634433146844356, 0.01099405744965369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 294.8333333333334, 189, 575, 206.0, 429.2000000000002, 575.0, 575.0, 0.09890598985664126, 0.15328496670165007, 0.22244188929672346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d26e3e22-ffa1-4db2-b198-0ff46c283536", 3, 0, 0.0, 318.3333333333333, 202, 537, 216.0, 537.0, 537.0, 537.0, 0.06618279688499636, 0.02929967570429526, 0.04244144201283946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a4985c9-cafc-46d9-b9b4-5c16ac175a66", 1, 0, 0.0, 825.0, 825, 825, 825.0, 825.0, 825.0, 825.0, 1.2121212121212122, 0.21898674242424243, 0.8357007575757576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 117.12500000000001, 98, 356, 100.5, 182.40000000000018, 356.0, 356.0, 0.08216631489213103, 0.06812422006193286, 0.029207557246812205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a263a57-be6a-450e-bf4c-8d38e42b1cec", 3, 0, 0.0, 346.6666666666667, 194, 469, 377.0, 469.0, 469.0, 469.0, 0.0300486788597528, 0.030332341518259583, 0.019269497836495123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 124.25000000000001, 96, 294, 101.0, 284.90000000000003, 294.0, 294.0, 0.08724005190783088, 0.06773031373703668, 0.031011112201611762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dca6d051-d829-4d9a-b7c3-94862eb36085", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 117.10526315789474, 93, 289, 98.0, 282.0, 289.0, 289.0, 0.09756247849774323, 0.07250492786795175, 0.04897179096468751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 148.94736842105263, 93, 306, 99.0, 290.0, 306.0, 306.0, 0.09756147656727378, 0.033817567741041034, 0.05520928541353229], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa58412c-c7ec-4f6d-bbd8-3ea5148600b4", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 146.8421052631579, 92, 860, 97.0, 276.0, 860.0, 860.0, 0.09756247849774323, 4.6452747426789625, 0.056914788802908386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 158.57894736842107, 92, 572, 96.0, 409.0, 572.0, 572.0, 0.09756448242042076, 1.5347651295553628, 0.057011235641332425], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 30.0, 0.4528301886792453], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.0, 0.07547169811320754], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.07547169811320754], "isController": false}, {"data": ["401/Unauthorized", 12, 60.0, 0.9056603773584906], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1325, 20, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
