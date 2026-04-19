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

    var data = {"OkPercent": 97.73071104387292, "KoPercent": 2.26928895612708};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8035483870967742, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6083e9d1-f5d8-4edb-9d6f-70b18091f4a8"], "isController": false}, {"data": [0.3684210526315789, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/baa79c6e-7a31-4478-a9d5-2c70adff02f3"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ca63a304-8b0a-4cd4-bd07-7b7355bc7706"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/001519a8-02c4-46bc-8944-1bbb84cc0594"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93b5dce8-abfe-4363-8e58-7f025ade2d16"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83567c00-7d59-4a75-b4b0-29303cc7858e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=baf65e6c-f4b1-4f12-97dd-1114f4c5f630"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.71875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/464dd2f0-55a9-49b9-a178-1f6cc52fee00"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/baf65e6c-f4b1-4f12-97dd-1114f4c5f630"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5589cac3-43df-4950-a79d-ea5086cab7a8"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.02, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e88fe1a4-1a24-41ad-863a-0df85123f92b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f8719c3-50ce-4e1a-8cb2-9eb24529d0bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6ad5c830-e5e9-4d8b-8d08-f9a19e6e0073"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=baa79c6e-7a31-4478-a9d5-2c70adff02f3"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2639ac0-a838-4259-bdfb-5adc7f2ce4b2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a28ef267-922a-464c-9081-177c7f45e90f"], "isController": false}, {"data": [0.3269230769230769, 500, 1500, "register"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0fdd9fb-7ad7-4111-add9-21075d3c02e6"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/83567c00-7d59-4a75-b4b0-29303cc7858e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3269230769230769, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.71875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.38, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca63a304-8b0a-4cd4-bd07-7b7355bc7706"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=464dd2f0-55a9-49b9-a178-1f6cc52fee00"], "isController": false}, {"data": [0.35454545454545455, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e3f0929-b307-478c-9635-3386686ab2e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8070175438596491, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9341317365269461, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9e3f0929-b307-478c-9635-3386686ab2e7"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f8719c3-50ce-4e1a-8cb2-9eb24529d0bc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/93b5dce8-abfe-4363-8e58-7f025ade2d16"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4902acba-5c81-4967-ae9f-29ca351d88c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5589cac3-43df-4950-a79d-ea5086cab7a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0fdd9fb-7ad7-4111-add9-21075d3c02e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2639ac0-a838-4259-bdfb-5adc7f2ce4b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6083e9d1-f5d8-4edb-9d6f-70b18091f4a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ad5c830-e5e9-4d8b-8d08-f9a19e6e0073"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1322, 30, 2.26928895612708, 307.8434190620272, 76, 2120, 100.5, 869.0, 1041.5499999999997, 1419.0899999999997, 5.115643731401617, 753.2902957009921, 3.7301669646277613], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6083e9d1-f5d8-4edb-9d6f-70b18091f4a8", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1365.8421052631575, 949, 1895, 1377.0, 1602.0, 1747.4999999999993, 1895.0, 0.2330964201297161, 280.49351090364735, 1.1461332767120318], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/baa79c6e-7a31-4478-a9d5-2c70adff02f3", 3, 0, 0.0, 417.0, 159, 841, 251.0, 841.0, 841.0, 841.0, 0.04446222933617892, 0.028584929342107213, 0.02851256243238036], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 529.3749999999999, 84, 1150, 465.0, 962.4000000000002, 1150.0, 1150.0, 0.09360502190942545, 0.01891639572400559, 0.06278232334977271], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 529.3749999999999, 84, 1150, 465.0, 962.4000000000002, 1150.0, 1150.0, 0.0940910801656003, 0.019014621974383705, 0.06310833007444956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca63a304-8b0a-4cd4-bd07-7b7355bc7706", 3, 0, 0.0, 419.0, 261, 653, 343.0, 653.0, 653.0, 653.0, 0.033429908624916425, 0.027869139319144195, 0.021437799476264768], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/001519a8-02c4-46bc-8944-1bbb84cc0594", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 121.75, 79, 245, 81.5, 242.2, 245.0, 245.0, 0.09101820933050418, 0.03289854953950475, 0.051431065794788074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 82.0625, 80, 84, 82.0, 84.0, 84.0, 84.0, 0.09101613829902215, 0.06763992309136313, 0.045685835044626345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 150.75, 80, 703, 82.0, 383.10000000000036, 703.0, 703.0, 0.09101769156379771, 1.695637817139769, 0.0531084674896183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 164.0625, 78, 764, 82.0, 400.7000000000004, 764.0, 764.0, 0.09101769156379771, 5.1416162839894195, 0.053019583025200524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93b5dce8-abfe-4363-8e58-7f025ade2d16", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 215.88235294117646, 81, 448, 188.0, 411.99999999999994, 448.0, 448.0, 0.08804230173650493, 0.14725641414062945, 0.056902799680458235], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83567c00-7d59-4a75-b4b0-29303cc7858e", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 0.9981439917127072, 3.8091332872928176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 83.8, 80, 90, 83.0, 89.4, 90.0, 90.0, 0.07976771640981462, 0.05928050018346575, 0.04003965452602023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 124.73333333333335, 80, 244, 83.0, 241.6, 244.0, 244.0, 0.07970413823885737, 0.029307875831579844, 0.04501000619035474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 563.375, 470, 637, 589.5, 637.0, 637.0, 637.0, 0.0927536231884058, 27.27264492753623, 0.05289855072463768], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 906.75, 710, 1122, 890.0, 1122.0, 1122.0, 1122.0, 0.09223496858246383, 82.99318686228166, 0.05251268230818009], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 161.5, 80, 246, 160.5, 246.0, 246.0, 246.0, 0.09335542745116344, 0.16519534623194154, 0.051691921254696946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 94.00000000000001, 80, 240, 83.0, 164.0, 240.0, 240.0, 0.0643293663557414, 0.047807273238983594, 0.03229032647153426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 93.28571428571428, 79, 244, 81.0, 166.0, 244.0, 244.0, 0.064330844342332, 0.0241150919012062, 0.03630277139574957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 138.3571428571429, 78, 878, 81.0, 481.5, 878.0, 878.0, 0.0643293663557414, 4.1506486424780595, 0.03742375246978817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 133.07142857142858, 80, 631, 82.0, 438.0, 631.0, 631.0, 0.0643302531395461, 1.367188397464469, 0.03748709087107758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=baf65e6c-f4b1-4f12-97dd-1114f4c5f630", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 102.75, 82, 242, 83.0, 242.0, 242.0, 242.0, 0.09335324869305453, 0.06937677954630321, 0.05242003710791636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 566.7777777777777, 78, 1050, 828.0, 1038.3, 1050.0, 1050.0, 0.0898602672843728, 44.93100143339607, 0.0485378049632821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 141.33333333333337, 80, 638, 83.0, 401.60000000000014, 638.0, 638.0, 0.07970244420828905, 4.801143439492561, 0.046399691153028694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 392.61111111111103, 76, 732, 441.0, 723.9, 732.0, 732.0, 0.0898593700858157, 14.689452413223306, 0.0486250736347616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 118.33333333333333, 79, 620, 81.0, 305.6000000000002, 620.0, 620.0, 0.0797702616464582, 1.5837409095139332, 0.0465170724978728], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 384.62499999999994, 84, 903, 385.5, 876.4, 903.0, 903.0, 0.09402472850359644, 0.019001213139368152, 0.06356884262904894], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/464dd2f0-55a9-49b9-a178-1f6cc52fee00", 3, 0, 0.0, 345.3333333333333, 183, 454, 399.0, 454.0, 454.0, 454.0, 0.03118470701967755, 0.031276068466024265, 0.019998005478113534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/baf65e6c-f4b1-4f12-97dd-1114f4c5f630", 3, 0, 0.0, 481.3333333333333, 176, 898, 370.0, 898.0, 898.0, 898.0, 0.029291154071470416, 0.029376967999414177, 0.018783715338801014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 246.57142857142858, 163, 1119, 168.5, 722.0, 1119.0, 1119.0, 0.06430425097030522, 5.5875576656982755, 0.14344656431573388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5589cac3-43df-4950-a79d-ea5086cab7a8", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 478.4, 81, 1257, 428.0, 902.2000000000003, 1178.1, 1257.0, 0.10594926301692646, 0.0650801625367644, 0.04790479372737984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 101.0, 79, 246, 84.0, 239.70000000000002, 246.0, 246.0, 0.08985757574244821, 0.06677892103515927, 0.045104290948846076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 128.5, 81, 261, 83.0, 248.40000000000003, 261.0, 261.0, 0.0898589214932556, 0.09902421947542359, 0.047055029853130585], "isController": false}, {"data": ["login", 25, 0, 0.0, 2312.76, 1221, 3714, 2293.0, 3280.8000000000006, 3640.2, 3714.0, 0.10490713620303309, 40.303248174091294, 0.2139490888290685], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e88fe1a4-1a24-41ad-863a-0df85123f92b", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 0.9917265139751552, 1.8530425077639752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 87.0, 82, 104, 85.0, 99.8, 104.0, 104.0, 0.07705110028971214, 0.0623782833400111, 0.027389258306108614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f8719c3-50ce-4e1a-8cb2-9eb24529d0bc", 3, 0, 0.0, 370.6666666666667, 261, 448, 403.0, 448.0, 448.0, 448.0, 0.032257370809229906, 0.02689164278725189, 0.020685879067116837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ad5c830-e5e9-4d8b-8d08-f9a19e6e0073", 3, 0, 0.0, 247.0, 158, 420, 163.0, 420.0, 420.0, 420.0, 0.04266757690830738, 0.027042243567862778, 0.027361694827267424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=baa79c6e-7a31-4478-a9d5-2c70adff02f3", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 682.8333333333333, 164, 1135, 911.5, 1122.4, 1135.0, 1135.0, 0.08982080748905934, 59.76015349377991, 0.18924160362576659], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2639ac0-a838-4259-bdfb-5adc7f2ce4b2", 3, 0, 0.0, 238.0, 162, 347, 205.0, 347.0, 347.0, 347.0, 0.09122145528628334, 0.041275332958311796, 0.0584981337610606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 277.81250000000006, 162, 844, 245.5, 483.50000000000034, 844.0, 844.0, 0.09097370291400142, 6.934440520611229, 0.20314721037668798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, 42.857142857142854, 613.4285714285714, 81, 1205, 833.5, 1196.5, 1205.0, 1205.0, 0.1612568822133659, 110.25808840044691, 0.25357239786104263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a28ef267-922a-464c-9081-177c7f45e90f", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.8515625, 1.5911458333333333], "isController": false}, {"data": ["register", 26, 8, 30.76923076923077, 924.2692307692306, 156, 1579, 905.0, 1456.0, 1543.3, 1579.0, 0.10214865772734952, 0.03201353666154614, 0.04608660143558152], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 257.3333333333333, 162, 720, 174.0, 488.40000000000015, 720.0, 720.0, 0.07966392445735591, 6.468949242794398, 0.17780718243304247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 86.77777777777777, 82, 106, 85.0, 100.60000000000001, 106.0, 106.0, 0.09535565008714447, 0.07403099787039048, 0.03389595374191463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0fdd9fb-7ad7-4111-add9-21075d3c02e6", 3, 0, 0.0, 268.6666666666667, 180, 366, 260.0, 366.0, 366.0, 366.0, 0.02600216684723727, 0.026078345070422535, 0.016674566630552546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 231.06666666666672, 160, 505, 167.0, 399.4000000000001, 505.0, 505.0, 0.10684597796123628, 0.16559039748484566, 0.24029910863742884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83567c00-7d59-4a75-b4b0-29303cc7858e", 3, 0, 0.0, 441.3333333333333, 224, 741, 359.0, 741.0, 741.0, 741.0, 0.0713063320022818, 0.032264258295303286, 0.04572704233219243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 138.07692307692307, 78, 382, 84.0, 364.4, 382.0, 382.0, 0.05489447592666098, 0.040795601738465824, 0.027554453736624747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 143.6153846153846, 81, 247, 84.0, 245.8, 247.0, 247.0, 0.05489447592666098, 0.02103078630002787, 0.030952369013335132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 159.76923076923077, 80, 773, 82.0, 560.9999999999998, 773.0, 773.0, 0.05489447592666098, 3.8132073271985236, 0.03190906360580699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 160.76923076923077, 80, 645, 83.0, 484.1999999999998, 645.0, 645.0, 0.054895866763508605, 1.2552893355277603, 0.031963481316402885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 84.66666666666667, 84, 86, 84.0, 86.0, 86.0, 86.0, 0.09778994719342851, 0.028840394582436923, 0.060450231028750245], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 955.1929824561406, 620, 1490, 883.0, 1263.8, 1379.3999999999996, 1490.0, 0.23352042279487076, 279.3716104971527, 0.46111161610471546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, 30.76923076923077, 924.2692307692306, 156, 1579, 905.0, 1456.0, 1543.3, 1579.0, 0.10164071570700892, 0.03185434689976271, 0.04585743228187316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 133.66666666666666, 81, 238, 82.0, 238.0, 238.0, 238.0, 0.03300547890949898, 0.008896007987325896, 0.01943584353752723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 82.0, 81, 83, 82.0, 83.0, 83.0, 83.0, 0.03300511579294791, 0.00889591011606799, 0.019403398151713516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 199.94444444444443, 79, 949, 82.0, 877.0000000000001, 949.0, 949.0, 0.09472138756308181, 9.492746002625887, 0.05478135804158269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 151.88888888888886, 77, 631, 82.0, 495.1000000000002, 631.0, 631.0, 0.09472088911341248, 3.117258705112823, 0.054873570635471915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 90.44444444444444, 78, 236, 82.0, 100.10000000000022, 236.0, 236.0, 0.0947198922298115, 0.0703924199090689, 0.04754494590441711], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 135.0, 80, 238, 87.0, 238.0, 238.0, 238.0, 0.033003663406638135, 0.008831058372479345, 0.018822401786598313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 118.66666666666666, 78, 266, 82.0, 245.30000000000004, 266.0, 266.0, 0.0947223844781586, 0.04115325818690831, 0.05313744875782118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 90.33333333333333, 81, 105, 85.0, 105.0, 105.0, 105.0, 0.03300584203404003, 0.024528755652250447, 0.01656738555224275], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 422.125, 82, 1085, 392.0, 914.2000000000002, 1085.0, 1085.0, 0.09277836408549525, 0.018273668268059887, 0.06313390998469157], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 0.03131066441229883, 0.024644917496399275, 0.01112996274030935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1292.28, 753, 2120, 1229.0, 2043.0, 2097.7999999999997, 2120.0, 0.10546832153494376, 0.05458809610695331, 0.04851130804976417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 226.66666666666666, 164, 323, 193.0, 323.0, 323.0, 323.0, 0.03297391763115376, 0.05110313211000099, 0.07415911357865929], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca63a304-8b0a-4cd4-bd07-7b7355bc7706", 1, 0, 0.0, 903.0, 903, 903, 903.0, 903.0, 903.0, 903.0, 1.1074197120708749, 0.20007094407530454, 0.7635139811738648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=464dd2f0-55a9-49b9-a178-1f6cc52fee00", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.4949700342465754, 1.8889126712328768], "isController": false}, {"data": ["addBook", 55, 10, 18.181818181818183, 872.6363636363635, 421, 2041, 685.0, 1534.1999999999998, 1602.5999999999997, 2041.0, 0.2550287023212249, 89.8335841719334, 0.9235009528799696], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e3f0929-b307-478c-9635-3386686ab2e7", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 161.10526315789477, 79, 347, 85.0, 329.4, 333.79999999999995, 347.0, 0.23412854889589907, 0.17399592354470625, 0.11317737471041996], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 516.6315789473684, 387, 729, 480.0, 650.2, 710.1999999999999, 729.0, 0.23401608552672093, 68.8084992101957, 0.11769363676392704], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 136.21052631578945, 78, 337, 85.0, 246.2, 256.89999999999975, 337.0, 0.23439909530173744, 0.4147765241081525, 0.11399487251979026], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 792.6842105263157, 536, 1135, 774.0, 1025.6, 1053.6999999999996, 1135.0, 0.23387205967430238, 210.43849039816718, 0.11739281120370255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 91.60000000000001, 83, 116, 87.0, 113.0, 116.0, 116.0, 0.10861930382267536, 0.08114625725033853, 0.03861076815571663], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 10, 5.9880239520958085, 138.2994011976048, 80, 903, 88.0, 268.0, 328.5999999999999, 671.7999999999977, 0.6840505623960612, 1.6114557284626476, 0.3247008110812095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 100.92307692307692, 81, 236, 87.0, 182.79999999999995, 236.0, 236.0, 0.05551332746884848, 0.0429903014480438, 0.019733253123692233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 107.625, 81, 258, 85.5, 246.8, 258.0, 258.0, 0.08754555104452785, 0.07104526652148696, 0.031119707597859512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e3f0929-b307-478c-9635-3386686ab2e7", 3, 0, 0.0, 296.3333333333333, 200, 414, 275.0, 414.0, 414.0, 414.0, 0.03706266060486262, 0.023827719627149635, 0.023767396286321407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 336.6153846153846, 165, 852, 172.0, 761.5999999999999, 852.0, 852.0, 0.05487431670922944, 5.128407220193749, 0.12233361605917983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f8719c3-50ce-4e1a-8cb2-9eb24529d0bc", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93b5dce8-abfe-4363-8e58-7f025ade2d16", 3, 0, 0.0, 555.0, 278, 1085, 302.0, 1085.0, 1085.0, 1085.0, 0.03093644622730038, 0.025790442313839933, 0.019838801779876875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 301.1666666666667, 161, 1031, 168.0, 959.0000000000001, 1031.0, 1031.0, 0.09467804205809023, 12.715745944623865, 0.2102415506422327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4902acba-5c81-4967-ae9f-29ca351d88c5", 2, 0, 0.0, 195.0, 188, 202, 195.0, 202.0, 202.0, 202.0, 0.01255997387525434, 0.024825573362807406, 0.007807054073827527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5589cac3-43df-4950-a79d-ea5086cab7a8", 3, 0, 0.0, 249.66666666666669, 183, 382, 184.0, 382.0, 382.0, 382.0, 0.047999232012287806, 0.031171376257979874, 0.030780757507879876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 87.99999999999999, 82, 100, 86.5, 99.0, 100.0, 100.0, 0.06405856783344772, 0.053111058682223745, 0.02277081903454587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0fdd9fb-7ad7-4111-add9-21075d3c02e6", 1, 0, 0.0, 865.0, 865, 865, 865.0, 865.0, 865.0, 865.0, 1.1560693641618498, 0.20886018786127167, 0.7970556358381503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2639ac0-a838-4259-bdfb-5adc7f2ce4b2", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.069018121301775, 4.0796042899408285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6083e9d1-f5d8-4edb-9d6f-70b18091f4a8", 3, 0, 0.0, 357.3333333333333, 267, 403, 402.0, 403.0, 403.0, 403.0, 0.020577119614796323, 0.02432145876345229, 0.013195613815478109], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 86.44444444444444, 83, 99, 84.0, 97.2, 99.0, 99.0, 0.08945566229493532, 0.06945044094186872, 0.03179869245640279], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ad5c830-e5e9-4d8b-8d08-f9a19e6e0073", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 94.66666666666667, 79, 260, 82.0, 158.60000000000008, 260.0, 260.0, 0.10703353003717632, 0.07954347300614373, 0.053725814881942016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 123.46666666666668, 79, 245, 82.0, 242.6, 245.0, 245.0, 0.10690994618866043, 0.02860676294501265, 0.06097207868572039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 92.99999999999999, 80, 244, 82.0, 148.60000000000005, 244.0, 244.0, 0.10703429378772958, 0.028849086997473992, 0.06292445787130196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 114.06666666666666, 78, 245, 82.0, 244.4, 245.0, 245.0, 0.10690994618866043, 0.02881557143366238, 0.0629557593278928], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 26.666666666666668, 0.6051437216338881], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.22692889561270801], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.0, 0.22692889561270801], "isController": false}, {"data": ["401/Unauthorized", 16, 53.333333333333336, 1.2102874432677762], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1322, 30, "401/Unauthorized", 16, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
