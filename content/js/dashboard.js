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

    var data = {"OkPercent": 97.04769114307344, "KoPercent": 2.952308856926571};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8077922077922078, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.47368421052631576, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=94290cc1-3835-4e13-b278-aee23bcee7c6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fbc9222d-ab1d-4517-99aa-1974d4422911"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a7619582-77f5-4660-ac1c-6245856d5ace"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2b642073-82b1-4c41-bcc3-07953ede0247"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec740032-9f9c-4764-af54-99ee8bb16841"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb39c279-0c78-4a7b-b069-3cbc263f7873"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e47c19e9-332a-46e6-9b62-a62ff9c713df"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1fd2679a-9b92-4b93-bb63-1113d9054444"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/77de5bbb-6982-4ae1-a905-37baf6e826ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54fff932-a93e-4d59-b345-5d8698a6757b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f55856b0-5d28-4972-b385-2dbff872911d"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b642073-82b1-4c41-bcc3-07953ede0247"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c3301ff-0fea-4791-a87a-7578a5ddd93b"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c41cb7f-e15e-44cc-960a-64cf3c602e06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fbc9222d-ab1d-4517-99aa-1974d4422911"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ec740032-9f9c-4764-af54-99ee8bb16841"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/94290cc1-3835-4e13-b278-aee23bcee7c6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7619582-77f5-4660-ac1c-6245856d5ace"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/00802eaf-42a6-4d77-b0fe-ff7314dcd91f"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eb39c279-0c78-4a7b-b069-3cbc263f7873"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8245614035087719, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00802eaf-42a6-4d77-b0fe-ff7314dcd91f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1fd2679a-9b92-4b93-bb63-1113d9054444"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e47c19e9-332a-46e6-9b62-a62ff9c713df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f55856b0-5d28-4972-b385-2dbff872911d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c41cb7f-e15e-44cc-960a-64cf3c602e06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c3301ff-0fea-4791-a87a-7578a5ddd93b"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1321, 39, 2.952308856926571, 277.35806207418534, 82, 1999, 96.0, 718.9999999999998, 846.0, 1231.8199999999995, 5.097807672567158, 732.7419200496082, 3.733610184134666], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1250.6315789473692, 1018, 1594, 1208.0, 1459.8, 1529.6999999999998, 1594.0, 0.24353354354123408, 293.05271917084303, 1.197452530986439], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=94290cc1-3835-4e13-b278-aee23bcee7c6", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fbc9222d-ab1d-4517-99aa-1974d4422911", 1, 0, 0.0, 943.0, 943, 943, 943.0, 943.0, 943.0, 943.0, 1.0604453870625663, 0.19158437168610817, 0.7311273860021209], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 372.06666666666666, 84, 740, 398.0, 588.8000000000001, 740.0, 740.0, 0.07566242452673154, 0.015398485616573098, 0.050702691123284356], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 372.06666666666666, 84, 740, 398.0, 588.8000000000001, 740.0, 740.0, 0.07441325151182922, 0.01514425938971212, 0.049865598815837124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7619582-77f5-4660-ac1c-6245856d5ace", 3, 0, 0.0, 377.0, 201, 724, 206.0, 724.0, 724.0, 724.0, 0.03792331904888316, 0.03161511070448886, 0.02431931592652989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 109.53333333333333, 85, 262, 86.0, 256.6, 262.0, 262.0, 0.10290253757657664, 0.04814177311362498, 0.05753430942107032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 87.06666666666666, 84, 91, 87.0, 89.8, 91.0, 91.0, 0.10289830217801406, 0.07647032027096552, 0.051650124335448466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 176.13333333333335, 83, 585, 87.0, 585.0, 585.0, 585.0, 0.10290112573831557, 4.058216740641143, 0.059416021105020894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 185.66666666666666, 84, 760, 86.0, 752.2, 760.0, 760.0, 0.10290253757657664, 12.369621948939761, 0.05931634555358135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b642073-82b1-4c41-bcc3-07953ede0247", 3, 0, 0.0, 712.6666666666666, 349, 930, 859.0, 930.0, 930.0, 930.0, 0.020058571027400007, 0.023708551888180152, 0.01286308102994076], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 233.33333333333334, 82, 576, 185.0, 487.20000000000005, 576.0, 576.0, 0.07539734400289526, 0.11147615119178068, 0.04872847877062118], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec740032-9f9c-4764-af54-99ee8bb16841", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 101.19047619047619, 85, 254, 87.0, 153.8, 244.79999999999987, 254.0, 0.10470734297638101, 0.07781473437990816, 0.052558178017441254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 93.71428571428572, 82, 253, 86.0, 94.2, 237.29999999999978, 253.0, 0.10470838714181005, 0.03550658291657734, 0.05929774640127246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 498.625, 403, 641, 464.0, 641.0, 641.0, 641.0, 0.048633697072859354, 14.299921730143772, 0.027736405361865103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 712.25, 585, 756, 753.0, 756.0, 756.0, 756.0, 0.048585258018085865, 43.71710056844752, 0.027661333422406308], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 193.375, 85, 260, 252.5, 260.0, 260.0, 260.0, 0.048683714080547204, 0.0861473534315933, 0.026956704964521745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 101.1818181818182, 82, 255, 86.0, 221.6000000000001, 255.0, 255.0, 0.06157049541859541, 0.045756979505421, 0.03090550258316215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 146.27272727272728, 83, 257, 85.0, 256.4, 257.0, 257.0, 0.06151230805363873, 0.02485831199042645, 0.03461159520986881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 184.36363636363635, 82, 664, 86.0, 583.2000000000003, 664.0, 664.0, 0.061571529324840196, 5.051647711848042, 0.03571629728413581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 146.0909090909091, 84, 417, 86.0, 384.2000000000001, 417.0, 417.0, 0.06157187396797144, 1.6609209787968857, 0.035776625987249025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 87.5, 85, 94, 87.0, 94.0, 94.0, 94.0, 0.048732646609121535, 0.036216351630411606, 0.027364523242426643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 414.16666666666663, 83, 761, 448.5, 761.0, 761.0, 761.0, 0.08323429993017567, 37.45840181618399, 0.045356190782263696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 141.80952380952382, 83, 759, 86.0, 255.8, 708.7999999999993, 759.0, 0.10470786505649238, 4.513369612842669, 0.06112828022317734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb39c279-0c78-4a7b-b069-3cbc263f7873", 1, 0, 0.0, 769.0, 769, 769, 769.0, 769.0, 769.0, 769.0, 1.3003901170351106, 0.2349337613784135, 0.8965580299089727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 319.16666666666663, 84, 679, 254.5, 669.1, 679.0, 679.0, 0.08332137517300758, 12.260854272650684, 0.04548500851729613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 124.95238095238096, 83, 577, 86.0, 253.4, 544.6999999999996, 577.0, 0.1047089092323341, 1.4929686876732682, 0.061231144605496717], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 489.2, 87, 1063, 377.0, 991.0, 1063.0, 1063.0, 0.07465435035784318, 0.015193326772045431, 0.05040626741934842], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 318.0909090909091, 171, 750, 336.0, 703.0000000000002, 750.0, 750.0, 0.06148170919151552, 6.77330410041081, 0.13684374388676188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e47c19e9-332a-46e6-9b62-a62ff9c713df", 3, 0, 0.0, 415.66666666666663, 201, 715, 331.0, 715.0, 715.0, 715.0, 0.02619515389652914, 0.02627189751146038, 0.01679832460161537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 526.9090909090909, 95, 1470, 450.0, 1261.6999999999998, 1454.9999999999998, 1470.0, 0.09800122056065606, 0.060198015363918625, 0.04431109874959352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 95.61111111111111, 85, 253, 87.0, 103.60000000000024, 253.0, 253.0, 0.08332098948303955, 0.06192116503573544, 0.041823231049103834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 149.66666666666669, 83, 337, 86.5, 312.70000000000005, 337.0, 337.0, 0.08323506970937088, 0.08477947041686898, 0.04397477803981411], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1fd2679a-9b92-4b93-bb63-1113d9054444", 3, 0, 0.0, 457.3333333333333, 184, 794, 394.0, 794.0, 794.0, 794.0, 0.04346944098298896, 0.02794666209030052, 0.027875911047033936], "isController": false}, {"data": ["login", 22, 0, 0.0, 2244.2727272727275, 1592, 3850, 2175.5, 2952.2999999999997, 3721.1499999999983, 3850.0, 0.10196750944358184, 44.495619307779656, 0.21533213309077426], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/77de5bbb-6982-4ae1-a905-37baf6e826ab", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.6543769211065574, 1.2227042776639345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 126.19047619047618, 86, 265, 92.0, 260.8, 264.6, 265.0, 0.10265334454373032, 0.08310510022143792, 0.03649005606827914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54fff932-a93e-4d59-b345-5d8698a6757b", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f55856b0-5d28-4972-b385-2dbff872911d", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.5376906622023809, 2.051943824404762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 515.7222222222222, 172, 850, 622.0, 848.2, 850.0, 850.0, 0.08320005916448651, 49.83256981149409, 0.17647512549342256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b642073-82b1-4c41-bcc3-07953ede0247", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 309.33333333333337, 172, 846, 178.0, 837.0, 846.0, 846.0, 0.10283622303120052, 16.541842505895943, 0.2277728609208641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, 42.857142857142854, 494.00000000000006, 82, 844, 676.0, 844.0, 844.0, 844.0, 0.07874680091121299, 53.84248794189611, 0.12382736697415418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c3301ff-0fea-4791-a87a-7578a5ddd93b", 3, 0, 0.0, 261.6666666666667, 182, 419, 184.0, 419.0, 419.0, 419.0, 0.034764873571743106, 0.02864254394859434, 0.022293880513129534], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 862.608695652174, 104, 1999, 853.0, 1491.8000000000004, 1917.3999999999987, 1999.0, 0.0967036663303061, 0.030170624159098554, 0.04362997445761856], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6c41cb7f-e15e-44cc-960a-64cf3c602e06", 3, 0, 0.0, 372.6666666666667, 163, 483, 472.0, 483.0, 483.0, 483.0, 0.03958671469854717, 0.025450443206259978, 0.025386011704471977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 90.66666666666666, 87, 98, 90.0, 96.80000000000001, 98.0, 98.0, 0.06281078251766553, 0.04876423056791416, 0.022327270348076418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 260.28571428571433, 172, 1014, 176.0, 362.8, 949.299999999999, 1014.0, 0.10466246355503502, 6.116991452565476, 0.23411314915647038], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fbc9222d-ab1d-4517-99aa-1974d4422911", 3, 0, 0.0, 272.3333333333333, 192, 365, 260.0, 365.0, 365.0, 365.0, 0.022817505590288868, 0.02696951914008427, 0.014632319665647485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 257.6470588235294, 170, 674, 176.0, 477.1999999999998, 674.0, 674.0, 0.0832553834400145, 5.980403304993854, 0.18599026922097447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec740032-9f9c-4764-af54-99ee8bb16841", 3, 0, 0.0, 261.3333333333333, 161, 452, 171.0, 452.0, 452.0, 452.0, 0.03813106919518023, 0.024514603405104477, 0.02445254111800295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 86.1, 84, 88, 86.0, 87.9, 88.0, 88.0, 0.04770537162484496, 0.035452917779792, 0.023945860366377254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 85.8, 85, 88, 85.5, 87.9, 88.0, 88.0, 0.047705599206178825, 0.012764974787590819, 0.027207099547273864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 101.80000000000001, 82, 253, 85.5, 236.40000000000006, 253.0, 253.0, 0.04766762319697215, 0.0128479140648089, 0.028023348793532455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 119.29999999999998, 82, 258, 86.0, 257.5, 258.0, 258.0, 0.047666487122898504, 0.012847607857343738, 0.028069230210066208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 93.66666666666667, 87, 106, 88.0, 106.0, 106.0, 106.0, 0.0261926381225117, 0.00772478194628763, 0.016191347589404204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94290cc1-3835-4e13-b278-aee23bcee7c6", 3, 0, 0.0, 275.3333333333333, 183, 458, 185.0, 458.0, 458.0, 458.0, 0.046331330790258064, 0.02978658148136708, 0.029711172414325644], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 808.8947368421052, 662, 1236, 683.0, 1099.4, 1118.7999999999995, 1236.0, 0.2404464711316592, 287.65757219194376, 0.4747878560822411], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 862.608695652174, 104, 1999, 853.0, 1491.8000000000004, 1917.3999999999987, 1999.0, 0.09605907215289262, 0.0299695169063967, 0.04333915169398085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 136.3, 84, 254, 86.5, 253.8, 254.0, 254.0, 0.05411196848518955, 0.014584866505773748, 0.03186476269196221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 137.2, 83, 256, 87.0, 255.8, 256.0, 256.0, 0.05411196848518955, 0.014584866505773748, 0.03181191897273839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 156.91666666666669, 84, 271, 86.0, 268.6, 271.0, 271.0, 0.06150124540021936, 0.016576507549277874, 0.03615600559661333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 114.49999999999999, 83, 267, 86.0, 262.20000000000005, 267.0, 267.0, 0.06144865197019741, 0.01656233197634227, 0.03618509486135648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 87.33333333333333, 84, 101, 86.0, 97.4, 101.0, 101.0, 0.06149998462500385, 0.04570457841760539, 0.03087010946997263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 120.2, 84, 255, 86.0, 254.8, 255.0, 255.0, 0.05411138287050064, 0.014479022369645678, 0.030860398043332394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 127.0, 83, 250, 86.0, 249.7, 250.0, 250.0, 0.06144865197019741, 0.01644231507796298, 0.03504493432675321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 138.8, 85, 260, 88.0, 259.3, 260.0, 260.0, 0.05406048286823298, 0.04017580806906767, 0.027135828314718505], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 454.6, 82, 930, 419.0, 875.4000000000001, 930.0, 930.0, 0.07458085559157535, 0.014770505384737774, 0.05074994157832979], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 96.3, 88, 145, 89.5, 141.0, 145.0, 145.0, 0.052989958402882655, 0.04170889303976896, 0.018836274276024693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1175.2272727272725, 646, 1760, 1072.0, 1745.1, 1759.25, 1760.0, 0.10029587282483325, 0.05191094980191565, 0.04613218369189108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 310.9, 173, 516, 265.5, 515.2, 516.0, 516.0, 0.05403506875962499, 0.08374380285305164, 0.12152613608732067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7619582-77f5-4660-ac1c-6245856d5ace", 1, 0, 0.0, 711.0, 711, 711, 711.0, 711.0, 711.0, 711.0, 1.4064697609001406, 0.25409854078762306, 0.9696949718706048], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00802eaf-42a6-4d77-b0fe-ff7314dcd91f", 3, 0, 0.0, 757.0, 428, 1004, 839.0, 1004.0, 1004.0, 1004.0, 0.08409250175192712, 0.038049667133847234, 0.05392650665732306], "isController": false}, {"data": ["addBook", 57, 19, 33.333333333333336, 777.7368421052629, 436, 1376, 708.0, 1293.4, 1338.7999999999997, 1376.0, 0.25439500850214897, 75.7872097679315, 0.923454578217539], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/eb39c279-0c78-4a7b-b069-3cbc263f7873", 3, 0, 0.0, 386.6666666666667, 180, 576, 404.0, 576.0, 576.0, 576.0, 0.043437341634691956, 0.027530112032143634, 0.027855326504017956], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 151.57894736842107, 85, 439, 87.0, 345.2, 348.4, 439.0, 0.2413076333648021, 0.1793311611236469, 0.1166477329253682], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 486.1754385964913, 405, 682, 424.0, 607.8000000000002, 677.5, 682.0, 0.24126882002615863, 70.94104396648056, 0.12134125225924969], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 126.9122807017544, 84, 317, 88.0, 257.2, 260.5, 317.0, 0.24161244516033317, 0.4275407721001208, 0.11750292743149016], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 653.0877192982456, 576, 851, 590.0, 760.4, 831.5999999999999, 851.0, 0.2408376078487709, 216.70610288968157, 0.12088918987721507], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 109.11764705882354, 86, 258, 89.0, 255.6, 258.0, 258.0, 0.08298998262092129, 0.061999352250981236, 0.029500345384780614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 19, 11.11111111111111, 129.37426900584785, 84, 432, 92.0, 250.4000000000001, 298.20000000000005, 416.88, 0.7209805335255948, 1.6255989724973332, 0.3427646797012358], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 105.6, 87, 263, 88.0, 245.80000000000007, 263.0, 263.0, 0.048518252566615565, 0.03757321707551381, 0.017246722592039125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 106.46666666666665, 87, 263, 91.0, 180.80000000000004, 263.0, 263.0, 0.09923654021726187, 0.08053277824271934, 0.035275488905354806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00802eaf-42a6-4d77-b0fe-ff7314dcd91f", 1, 0, 0.0, 1063.0, 1063, 1063, 1063.0, 1063.0, 1063.0, 1063.0, 0.9407337723424272, 0.16995678504233303, 0.648591839134525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1fd2679a-9b92-4b93-bb63-1113d9054444", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 207.3, 172, 346, 174.0, 345.2, 346.0, 346.0, 0.04764650107919325, 0.07384277071550752, 0.10715809764197466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e47c19e9-332a-46e6-9b62-a62ff9c713df", 1, 0, 0.0, 720.0, 720, 720, 720.0, 720.0, 720.0, 720.0, 1.3888888888888888, 0.2509223090277778, 0.9575737847222222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 259.3333333333333, 171, 373, 254.0, 366.1, 373.0, 373.0, 0.06142065986262246, 0.0951900265644354, 0.13813650357775345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 88.36363636363636, 87, 92, 88.0, 91.6, 92.0, 92.0, 0.06390258921672853, 0.05298173656738528, 0.022715373510633973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 91.33333333333333, 87, 106, 90.0, 99.70000000000002, 106.0, 106.0, 0.0834592950471545, 0.06479505816649202, 0.0296671712862932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f55856b0-5d28-4972-b385-2dbff872911d", 3, 0, 0.0, 319.0, 225, 379, 353.0, 379.0, 379.0, 379.0, 0.08074500726705065, 0.03574648759218388, 0.051779838644560476], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c41cb7f-e15e-44cc-960a-64cf3c602e06", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.48696512803234504, 1.858364218328841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 86.52941176470588, 84, 92, 86.0, 89.6, 92.0, 92.0, 0.08329127940304651, 0.06189908557199061, 0.04180831798160732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 115.70588235294117, 85, 255, 86.0, 254.2, 255.0, 255.0, 0.08329168748958854, 0.02964586946722717, 0.04709080814984665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c3301ff-0fea-4791-a87a-7578a5ddd93b", 1, 0, 0.0, 620.0, 620, 620, 620.0, 620.0, 620.0, 620.0, 1.6129032258064515, 0.2913936491935484, 1.1120211693548387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 134.88235294117646, 84, 588, 86.0, 319.9999999999998, 588.0, 588.0, 0.08329127940304651, 4.429696074102291, 0.048545112639206675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 159.8235294117647, 83, 588, 87.0, 391.1999999999998, 588.0, 588.0, 0.08329127940304651, 1.461740901040161, 0.04862645177924871], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 20.512820512820515, 0.6056018168054504], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 7.6923076923076925, 0.22710068130204392], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.6923076923076925, 0.22710068130204392], "isController": false}, {"data": ["401/Unauthorized", 25, 64.1025641025641, 1.8925056775170326], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1321, 39, "401/Unauthorized", 25, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
