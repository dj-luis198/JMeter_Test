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

    var data = {"OkPercent": 98.75389408099689, "KoPercent": 1.2461059190031152};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8194259012016022, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.33636363636363636, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19de21c4-c103-4599-b3a4-eaa74989831d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d1cd1e3-e98c-4370-a3ba-c5444bb10590"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e983517-4718-47fa-bd7d-95a26dc6d2cc"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/821d2315-5b2a-40a7-b639-3ec9c9d53b02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34bc7db8-5fbf-46ce-9834-97dac27d559e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd5458f8-6308-4826-adab-2db477e84690"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9be85110-25f0-4f70-b3b4-fbd7a6262050"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25903d82-91de-48ce-911c-e3367a279462"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8c7edc18-b2a3-43cb-b3f7-d4969a0b6081"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/cbb06132-fcd0-4051-8458-f49e98ef5c89"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/25bf4330-47c2-41cb-9977-efb7c2c15810"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8468549a-e1c1-4306-a817-302af3cc372f"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/33f5c161-151c-4fca-91e3-61b492bdb126"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c3561bd-b708-4f28-be50-7ba7dde69692"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/25903d82-91de-48ce-911c-e3367a279462"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f9879436-a24b-4b65-8ae3-87e50c17df95"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34bc7db8-5fbf-46ce-9834-97dac27d559e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9be85110-25f0-4f70-b3b4-fbd7a6262050"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=821d2315-5b2a-40a7-b639-3ec9c9d53b02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19de21c4-c103-4599-b3a4-eaa74989831d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d1cd1e3-e98c-4370-a3ba-c5444bb10590"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dd5458f8-6308-4826-adab-2db477e84690"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54edc80a-0e99-45f2-805e-cf7f4ea45606"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8468549a-e1c1-4306-a817-302af3cc372f"], "isController": false}, {"data": [0.423728813559322, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c7edc18-b2a3-43cb-b3f7-d4969a0b6081"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8090909090909091, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9653179190751445, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8ccbbb41-8df2-4ccb-9bf3-f7244ee86bfc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9879436-a24b-4b65-8ae3-87e50c17df95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25bf4330-47c2-41cb-9977-efb7c2c15810"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33f5c161-151c-4fca-91e3-61b492bdb126"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c3561bd-b708-4f28-be50-7ba7dde69692"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1284, 16, 1.2461059190031152, 310.67834890965713, 80, 2206, 95.0, 895.0, 1057.5, 1629.0500000000043, 5.032057813798184, 697.16531038004, 3.671256372127338], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1421.236363636364, 995, 2237, 1357.0, 1701.8, 1847.2, 2237.0, 0.25472987055091123, 306.5272629709608, 1.252504783421717], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/19de21c4-c103-4599-b3a4-eaa74989831d", 3, 0, 0.0, 482.66666666666663, 212, 979, 257.0, 979.0, 979.0, 979.0, 0.024832381425378695, 0.024905132542835856, 0.015924411265623706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d1cd1e3-e98c-4370-a3ba-c5444bb10590", 3, 0, 0.0, 329.3333333333333, 258, 403, 327.0, 403.0, 403.0, 403.0, 0.032265350240376856, 0.026898294910678754, 0.020690996085137504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e983517-4718-47fa-bd7d-95a26dc6d2cc", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.8566042877906979, 3.4690679505813957], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 553.0, 86, 1921, 431.0, 1336.6000000000004, 1921.0, 1921.0, 0.08381714451752058, 0.01641964764669397, 0.05643469457032537], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 553.0, 86, 1921, 431.0, 1336.6000000000004, 1921.0, 1921.0, 0.084290972436852, 0.016512469795734876, 0.056753726363406476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/821d2315-5b2a-40a7-b639-3ec9c9d53b02", 3, 0, 0.0, 390.0, 244, 664, 262.0, 664.0, 664.0, 664.0, 0.0371540033438603, 0.03097376385534708, 0.02382597219642083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 130.00000000000003, 81, 250, 85.0, 249.1, 250.0, 250.0, 0.10343400910219279, 0.027676678216797684, 0.05898970831609433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 84.88888888888889, 83, 94, 84.0, 86.80000000000001, 94.0, 94.0, 0.10343282038316114, 0.07686755499178283, 0.051918427418891425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34bc7db8-5fbf-46ce-9834-97dac27d559e", 2, 0, 0.0, 201.5, 194, 209, 201.5, 209.0, 209.0, 209.0, 0.03631016139866742, 0.030601239538134744, 0.022569743877199032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd5458f8-6308-4826-adab-2db477e84690", 1, 0, 0.0, 709.0, 709, 709, 709.0, 709.0, 709.0, 709.0, 1.4104372355430184, 0.2548153208744711, 0.9724303596614952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 152.77777777777777, 83, 330, 86.5, 260.7000000000001, 330.0, 330.0, 0.10333721804727104, 0.02785260955180352, 0.060851896955570736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 102.22222222222223, 82, 247, 84.0, 245.2, 247.0, 247.0, 0.10333721804727104, 0.02785260955180352, 0.06075098170357145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9be85110-25f0-4f70-b3b4-fbd7a6262050", 3, 0, 0.0, 336.6666666666667, 183, 423, 404.0, 423.0, 423.0, 423.0, 0.1222892548508071, 0.05533270320397848, 0.0784211692890918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25903d82-91de-48ce-911c-e3367a279462", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 192.4, 83, 275, 185.0, 269.6, 275.0, 275.0, 0.08422518445315395, 0.17491530982234102, 0.054439298909564615], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 100.29411764705881, 82, 342, 85.0, 141.19999999999982, 342.0, 342.0, 0.09694066660964275, 0.0720428196190802, 0.04865967054429333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 103.47058823529413, 81, 249, 84.0, 247.4, 249.0, 249.0, 0.09694232501910334, 0.04306939003318849, 0.0543295796694837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 599.0, 489, 658, 650.0, 658.0, 658.0, 658.0, 0.04077638231936063, 11.98961030521122, 0.023255280541510357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 815.3333333333334, 737, 902, 807.0, 902.0, 902.0, 902.0, 0.0406393931183961, 36.56739736436603, 0.023137466980493092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 137.33333333333334, 84, 242, 86.0, 242.0, 242.0, 242.0, 0.04100097035629843, 0.07255249832579372, 0.022702685734395715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c7edc18-b2a3-43cb-b3f7-d4969a0b6081", 3, 0, 0.0, 549.3333333333334, 266, 995, 387.0, 995.0, 995.0, 995.0, 0.031928140398676044, 0.026617176940432734, 0.020474751492640563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 94.23529411764706, 82, 246, 84.0, 123.5999999999999, 246.0, 246.0, 0.08857349776742685, 0.06582464043067561, 0.04445974399654042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 113.23529411764706, 82, 259, 84.0, 251.0, 259.0, 259.0, 0.08857349776742685, 0.023700330457299756, 0.050514572945485614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 102.41176470588235, 81, 250, 83.0, 246.0, 250.0, 250.0, 0.08857395925597875, 0.02387344995571302, 0.052071800265721876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 122.52941176470588, 81, 255, 83.0, 253.4, 255.0, 255.0, 0.08849833935469094, 0.02385306802919404, 0.05211376819421742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 85.33333333333333, 83, 89, 84.0, 89.0, 89.0, 89.0, 0.04100209110664644, 0.03047128059781049, 0.023023635142892285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cbb06132-fcd0-4051-8458-f49e98ef5c89", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.5764186597472923, 1.0770391471119132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 686.9999999999999, 85, 1228, 889.0, 1132.6000000000001, 1228.0, 1228.0, 0.06854040914054896, 41.12134501128632, 0.03636746969371576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 198.35294117647058, 81, 735, 87.0, 724.6, 735.0, 735.0, 0.09694232501910334, 10.285275512226137, 0.056011368626042134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 496.59999999999997, 82, 734, 650.0, 734.0, 734.0, 734.0, 0.0685410355179646, 13.441718129560835, 0.03643473665391803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 195.05882352941174, 82, 817, 84.0, 755.4, 817.0, 817.0, 0.09685119668199194, 3.373323619728019, 0.056053297712032914], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 542.0666666666666, 85, 2206, 401.0, 1586.2000000000003, 2206.0, 2206.0, 0.08445517963616708, 0.01654463772950695, 0.0574251234453209], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 228.17647058823528, 166, 500, 170.0, 374.39999999999986, 500.0, 500.0, 0.08845919689456185, 0.1370944779996774, 0.1989468070782968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25bf4330-47c2-41cb-9977-efb7c2c15810", 3, 0, 0.0, 473.66666666666663, 181, 816, 424.0, 816.0, 816.0, 816.0, 0.022172949002217293, 0.02620767507390983, 0.014218980968218772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 497.45, 120, 1013, 449.0, 949.1000000000005, 1011.0, 1013.0, 0.08625560122310443, 0.05298317692317645, 0.039000335318649756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 85.33333333333333, 82, 92, 85.0, 90.2, 92.0, 92.0, 0.06859055553777281, 0.05097403590258312, 0.03442924369767112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 107.2, 81, 257, 85.0, 252.2, 257.0, 257.0, 0.06859181013786954, 0.08703479033770034, 0.03527833984955529], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8468549a-e1c1-4306-a817-302af3cc372f", 3, 0, 0.0, 300.3333333333333, 174, 551, 176.0, 551.0, 551.0, 551.0, 0.01691312853413915, 0.023316113067083106, 0.010845984118572306], "isController": false}, {"data": ["login", 20, 0, 0.0, 2452.7, 1403, 3596, 2378.5, 3250.6000000000004, 3579.3999999999996, 3596.0, 0.08527548244604194, 15.422533186819395, 0.14987332593568523], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/33f5c161-151c-4fca-91e3-61b492bdb126", 3, 0, 0.0, 619.6666666666666, 186, 1219, 454.0, 1219.0, 1219.0, 1219.0, 0.024755947616414843, 0.02482847480669731, 0.01587539609516186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 98.76470588235293, 84, 253, 87.0, 136.1999999999999, 253.0, 253.0, 0.09560229445506692, 0.07739677939770555, 0.03398362810707457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c3561bd-b708-4f28-be50-7ba7dde69692", 3, 0, 0.0, 289.0, 185, 433, 249.0, 433.0, 433.0, 433.0, 0.07464729154743835, 0.033775955485331806, 0.04786951964467889], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25903d82-91de-48ce-911c-e3367a279462", 3, 0, 0.0, 239.33333333333331, 164, 375, 179.0, 375.0, 375.0, 375.0, 0.027614901000579915, 0.033125296284875316, 0.01770877440466876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9879436-a24b-4b65-8ae3-87e50c17df95", 3, 0, 0.0, 284.0, 169, 500, 183.0, 500.0, 500.0, 500.0, 0.018566424477974033, 0.02559531499486329, 0.011906203197138296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 783.8666666666667, 172, 1310, 975.0, 1217.6000000000001, 1310.0, 1310.0, 0.0685131727993569, 54.67910981262789, 0.1424012396887675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34bc7db8-5fbf-46ce-9834-97dac27d559e", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 248.44444444444446, 167, 415, 178.0, 347.5000000000001, 415.0, 415.0, 0.10328681601175174, 0.1600743916119629, 0.23229446999517997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, 57.142857142857146, 433.7142857142857, 83, 986, 84.0, 986.0, 986.0, 986.0, 0.08897023310201073, 45.630459356491016, 0.11966546000788023], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1124.8571428571427, 501, 1961, 1064.0, 1883.2, 1953.8, 1961.0, 0.08861956044698018, 0.028138688557104757, 0.03998265324853989], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 344.35294117647067, 167, 900, 331.0, 839.1999999999999, 900.0, 900.0, 0.09680321614449873, 13.757117216238454, 0.21479881836015352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 87.89473684210526, 84, 102, 86.0, 93.0, 102.0, 102.0, 0.11880643305570146, 0.09223741628836196, 0.042231974250268874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 380.92857142857144, 168, 1067, 254.0, 986.0, 1067.0, 1067.0, 0.10377596252205239, 26.73039612999051, 0.22770484633744978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 84.0, 82, 85, 85.0, 85.0, 85.0, 85.0, 0.026263262947788635, 0.019517913186784325, 0.013182926909339216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 83.4, 80, 86, 84.0, 86.0, 86.0, 86.0, 0.026263814766567216, 0.007027622310585368, 0.014978581859057864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 84.6, 82, 89, 84.0, 89.0, 89.0, 89.0, 0.026263814766567216, 0.00707891882380132, 0.01544025047800143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 84.8, 83, 89, 84.0, 89.0, 89.0, 89.0, 0.02626367680969865, 0.007078881640114089, 0.015465817496336217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 86.0, 85, 87, 86.0, 87.0, 87.0, 87.0, 0.0502108857200241, 0.014808288561960233, 0.031038565098413337], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 986.709090909091, 656, 1885, 980.0, 1355.8, 1491.3999999999999, 1885.0, 0.2401977482552909, 287.3600131617448, 0.47429672555878727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1124.8571428571427, 501, 1961, 1064.0, 1883.2, 1953.8, 1961.0, 0.09033851130737033, 0.028684493824717477, 0.040758195531254975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 137.55555555555554, 82, 248, 84.0, 248.0, 248.0, 248.0, 0.03912856341653226, 0.010546370608362209, 0.02304152709000874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 119.22222222222223, 81, 247, 84.0, 247.0, 247.0, 247.0, 0.03912856341653226, 0.010546370608362209, 0.02300331560229728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 143.57894736842104, 82, 738, 84.0, 248.0, 738.0, 738.0, 0.1210476354300058, 5.763481331985882, 0.07061526840720425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 139.7894736842105, 81, 660, 84.0, 247.0, 660.0, 660.0, 0.1210476354300058, 1.904173376050407, 0.07073347898867886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9be85110-25f0-4f70-b3b4-fbd7a6262050", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.0036892361111112, 3.830295138888889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=821d2315-5b2a-40a7-b639-3ec9c9d53b02", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 120.66666666666667, 83, 251, 84.0, 251.0, 251.0, 251.0, 0.03912856341653226, 0.010469947632939295, 0.02231550882349105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 102.57894736842105, 82, 251, 85.0, 248.0, 251.0, 251.0, 0.12104609307807472, 0.08995710628165514, 0.060759464689580475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 120.77777777777777, 82, 249, 86.0, 249.0, 249.0, 249.0, 0.03912788296415451, 0.02907843646066561, 0.01964036312849162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 108.63157894736844, 81, 247, 83.0, 246.0, 247.0, 247.0, 0.12104917782124221, 0.04195906945037302, 0.06850079398704136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 88.77777777777777, 84, 97, 87.0, 97.0, 97.0, 97.0, 0.04002864271767798, 0.03150691995160982, 0.014228931591049595], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 505.64285714285717, 83, 979, 443.5, 953.0, 979.0, 979.0, 0.07996572897329715, 0.015439811509353136, 0.054418642010566905], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19de21c4-c103-4599-b3a4-eaa74989831d", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d1cd1e3-e98c-4370-a3ba-c5444bb10590", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd5458f8-6308-4826-adab-2db477e84690", 3, 0, 0.0, 463.33333333333337, 188, 927, 275.0, 927.0, 927.0, 927.0, 0.022024329542701504, 0.02641915832189292, 0.014123674869505849], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1510.3500000000001, 949, 2136, 1498.0, 2031.1000000000001, 2131.0, 2136.0, 0.08767084856614328, 0.04537651341802337, 0.040325165697903786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 278.6666666666667, 167, 498, 174.0, 498.0, 498.0, 498.0, 0.03911359892915658, 0.06061843896540185, 0.08796740071664806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54edc80a-0e99-45f2-805e-cf7f4ea45606", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8468549a-e1c1-4306-a817-302af3cc372f", 1, 0, 0.0, 1173.0, 1173, 1173, 1173.0, 1173.0, 1173.0, 1173.0, 0.8525149190110827, 0.15401880861040068, 0.5877690750213128], "isController": false}, {"data": ["addBook", 59, 4, 6.779661016949152, 932.2203389830507, 421, 2320, 767.0, 1488.0, 1653.0, 2320.0, 0.2787805477328999, 91.48982233203472, 1.0136664854396227], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c7edc18-b2a3-43cb-b3f7-d4969a0b6081", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 145.6363636363636, 82, 628, 85.0, 338.0, 340.4, 628.0, 0.2407992784777983, 0.1789533700406294, 0.11640199496729507], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 530.4545454545454, 405, 784, 491.0, 696.8, 742.6, 784.0, 0.240978636148548, 70.85572027145149, 0.12119531017236546], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 108.96363636363637, 82, 254, 85.0, 247.2, 250.2, 254.0, 0.24124288333494162, 0.42688682090128344, 0.11732319912187592], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 839.5272727272728, 570, 1223, 891.0, 1057.8, 1149.2, 1223.0, 0.24089419926768163, 216.7570239478946, 0.1209175961167855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 114.42857142857143, 84, 252, 87.0, 250.5, 252.0, 252.0, 0.10837423170410738, 0.08096317114613492, 0.03852365267606943], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 4, 2.3121387283236996, 158.16763005780345, 83, 1058, 90.0, 271.19999999999993, 393.0999999999999, 986.9599999999991, 0.7157544589847871, 1.504049197258619, 0.34563499677289894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 124.4, 85, 253, 90.0, 253.0, 253.0, 253.0, 0.026643220632510057, 0.020632884728105934, 0.00947083233421256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ccbbb41-8df2-4ccb-9bf3-f7244ee86bfc", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 1.716859879032258, 3.207955309139785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 124.22222222222226, 83, 411, 86.0, 264.30000000000024, 411.0, 411.0, 0.10831889081455805, 0.08790331862001734, 0.03850398071923744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9879436-a24b-4b65-8ae3-87e50c17df95", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.2937627032520325, 1.1210619918699187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 170.4, 166, 175, 172.0, 175.0, 175.0, 175.0, 0.026251680107526883, 0.040684976885395664, 0.05904064383558048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25bf4330-47c2-41cb-9977-efb7c2c15810", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33f5c161-151c-4fca-91e3-61b492bdb126", 1, 0, 0.0, 2206.0, 2206, 2206, 2206.0, 2206.0, 2206.0, 2206.0, 0.45330915684496825, 0.08189667384406166, 0.3125354147778785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 273.00000000000006, 166, 823, 171.0, 500.0, 823.0, 823.0, 0.1209805794333015, 7.795250815822985, 0.2704589999204075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 90.70588235294116, 83, 154, 86.0, 108.39999999999996, 154.0, 154.0, 0.09111275471374516, 0.07554172729684536, 0.0323877370271516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 102.93333333333332, 85, 248, 91.0, 167.00000000000006, 248.0, 248.0, 0.06925079869254493, 0.053764047813059775, 0.024616494847740575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c3561bd-b708-4f28-be50-7ba7dde69692", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 0.8029513888888888, 3.064236111111111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 84.64285714285714, 82, 88, 84.5, 87.0, 88.0, 88.0, 0.10453924328522039, 0.07768980873052024, 0.05247379985215164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 145.35714285714283, 82, 259, 90.5, 255.0, 259.0, 259.0, 0.10441215954177978, 0.061543160444199156, 0.057668490461203425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 271.42857142857144, 82, 984, 89.0, 901.5, 984.0, 984.0, 0.1038413896944838, 20.044133459828217, 0.05913512175402942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 230.28571428571428, 83, 662, 91.5, 656.0, 662.0, 662.0, 0.10422793159669747, 6.589174091355782, 0.059457032965805796], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 25.0, 0.3115264797507788], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 12.5, 0.1557632398753894], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 12.5, 0.1557632398753894], "isController": false}, {"data": ["401/Unauthorized", 8, 50.0, 0.6230529595015576], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1284, 16, "401/Unauthorized", 8, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
