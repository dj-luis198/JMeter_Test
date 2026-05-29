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

    var data = {"OkPercent": 98.52255054432348, "KoPercent": 1.4774494556765163};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7717536813922357, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.026785714285714284, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/93b80799-d8ea-46cc-9956-10f2481be5d3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/24c937cd-7d8e-4389-932a-61ba57974446"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ed75bc9-a529-49c3-876a-f87e6f79c2ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cba9474a-e2f8-4399-97aa-deb0d238946f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34b885ad-28ab-4f23-b1bf-0cbfec59747f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/884adc23-a8ef-4673-967f-87c88bde5370"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/34b885ad-28ab-4f23-b1bf-0cbfec59747f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2ed75bc9-a529-49c3-876a-f87e6f79c2ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76b0017b-9157-48b3-9416-60f0dc2ce056"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8bdce84-6bf8-4a6b-9a54-7d5c8470455d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bec6b3de-e1e3-4bda-a87b-dd60355c14aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=221f06b8-cbf6-46cf-8923-330c4172053d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6c975f6b-c592-48c1-8288-f69ea52f8891"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79405b79-529d-49a1-abf3-26e20145edee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96a6a427-9511-4755-a73d-363191323ec0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cba9474a-e2f8-4399-97aa-deb0d238946f"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24c937cd-7d8e-4389-932a-61ba57974446"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93b80799-d8ea-46cc-9956-10f2481be5d3"], "isController": false}, {"data": [0.225, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b8bdce84-6bf8-4a6b-9a54-7d5c8470455d"], "isController": false}, {"data": [0.27586206896551724, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cb880ef2-8460-4099-9f6e-a5794f40176e"], "isController": false}, {"data": [0.9127906976744186, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/79405b79-529d-49a1-abf3-26e20145edee"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/64743ec5-71ce-4437-90c2-f8c71eb45cde"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/221f06b8-cbf6-46cf-8923-330c4172053d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/96a6a427-9511-4755-a73d-363191323ec0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=884adc23-a8ef-4673-967f-87c88bde5370"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c975f6b-c592-48c1-8288-f69ea52f8891"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/76b0017b-9157-48b3-9416-60f0dc2ce056"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4f9e078-a8a0-462d-97ca-2988b36cb1d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1286, 19, 1.4774494556765163, 414.1555209953344, 101, 4660, 137.0, 1129.3, 1412.6499999999999, 2044.9099999999873, 5.050148048663635, 707.9642777988855, 3.691797878230956], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1923.1250000000002, 1290, 2544, 1885.0, 2346.8, 2396.75, 2544.0, 0.24486975989645504, 294.65968962074703, 1.2040226963658704], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/93b80799-d8ea-46cc-9956-10f2481be5d3", 3, 0, 0.0, 395.3333333333333, 330, 475, 381.0, 475.0, 475.0, 475.0, 0.020363142711691838, 0.024068545307992534, 0.013058395554047175], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 576.9230769230769, 114, 939, 577.0, 923.8, 939.0, 939.0, 0.07666495644840744, 0.01452441557713969, 0.05182601735871534], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 576.9230769230769, 114, 939, 577.0, 923.8, 939.0, 939.0, 0.07604206881222289, 0.014406407567940665, 0.051404941199007945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 114.72222222222224, 107, 123, 115.0, 123.0, 123.0, 123.0, 0.12217470983506414, 0.04288576240412679, 0.06910772161134866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 131.7222222222222, 106, 361, 116.0, 171.1000000000003, 361.0, 361.0, 0.121975184826287, 0.09064757387969181, 0.06122582519600735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 175.55555555555554, 107, 952, 119.5, 403.00000000000085, 952.0, 952.0, 0.12218549115173402, 2.0270249487499745, 0.07136767565861374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 234.77777777777777, 107, 1364, 120.0, 446.90000000000146, 1364.0, 1364.0, 0.12218466175212804, 6.138990408928304, 0.07124787025346528], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 282.23076923076917, 107, 539, 247.0, 510.2, 539.0, 539.0, 0.07698913268780906, 0.1550366346125374, 0.049766487889017205], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 139.14285714285714, 107, 392, 120.5, 264.0, 392.0, 392.0, 0.11550202128537249, 0.0858369513653989, 0.057976600528009244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 165.42857142857142, 108, 359, 120.0, 340.0, 359.0, 359.0, 0.11550583304456875, 0.04329857329670148, 0.0651815143227233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 717.5, 597, 864, 704.5, 864.0, 864.0, 864.0, 0.03221908981071284, 9.473482178815948, 0.018374949657672168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24c937cd-7d8e-4389-932a-61ba57974446", 3, 0, 0.0, 1082.3333333333333, 228, 2414, 605.0, 2414.0, 2414.0, 2414.0, 0.017940545033758123, 0.0247324896542857, 0.011504841704590986], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1150.0, 1017, 1293, 1145.0, 1293.0, 1293.0, 1293.0, 0.03217943251570759, 28.955109943042405, 0.018320907379548362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ed75bc9-a529-49c3-876a-f87e6f79c2ae", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 345.5, 331, 356, 347.5, 356.0, 356.0, 356.0, 0.03235800901170551, 0.057258508133994516, 0.017916983505504906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cba9474a-e2f8-4399-97aa-deb0d238946f", 3, 0, 0.0, 375.0, 328, 450, 347.0, 450.0, 450.0, 450.0, 0.02046245140167792, 0.02418592481754314, 0.01312207983766455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 120.45454545454545, 109, 145, 120.0, 141.0, 145.0, 145.0, 0.05261823556705716, 0.03910398170559619, 0.02641188777487049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 196.27272727272728, 106, 385, 119.0, 375.00000000000006, 385.0, 385.0, 0.05262578759275295, 0.02126709740076451, 0.029611349588322816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 190.18181818181816, 108, 938, 115.0, 775.6000000000006, 938.0, 938.0, 0.05262603936427744, 4.317713304400972, 0.030527214240606254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 224.63636363636363, 108, 901, 118.0, 786.6000000000004, 901.0, 901.0, 0.05262528405693099, 1.419583856596101, 0.030578167982298766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 172.75, 117, 333, 120.5, 333.0, 333.0, 333.0, 0.03241307219201504, 0.02408823040832368, 0.018200699717195946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 241.78571428571428, 106, 1180, 117.5, 771.0, 1180.0, 1180.0, 0.115516316679731, 7.453324510602748, 0.06720187507735469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 722.4999999999999, 113, 1517, 646.5, 1439.7, 1513.2, 1517.0, 0.12378842083111545, 55.70920175423666, 0.06745501838258049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 256.2857142857143, 108, 952, 130.0, 655.5, 952.0, 952.0, 0.11551059809737543, 2.454906390005033, 0.0673113515977591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 501.80000000000007, 106, 1181, 402.0, 1062.4000000000003, 1175.6499999999999, 1181.0, 0.12378612233782471, 18.21529714085004, 0.06757465076840236], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 412.3846153846155, 121, 594, 441.0, 566.8, 594.0, 594.0, 0.07616056991540318, 0.014428857972254117, 0.05209149557389919], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 371.54545454545456, 235, 1048, 245.0, 928.6000000000004, 1048.0, 1048.0, 0.05258804912679935, 5.793509215458018, 0.11704855998384113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34b885ad-28ab-4f23-b1bf-0cbfec59747f", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/884adc23-a8ef-4673-967f-87c88bde5370", 3, 0, 0.0, 317.6666666666667, 218, 501, 234.0, 501.0, 501.0, 501.0, 0.05405210623040611, 0.03506700772044251, 0.034662320727181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34b885ad-28ab-4f23-b1bf-0cbfec59747f", 3, 0, 0.0, 570.6666666666666, 238, 978, 496.0, 978.0, 978.0, 978.0, 0.05905860582317853, 0.026722481150461642, 0.03787286896863988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ed75bc9-a529-49c3-876a-f87e6f79c2ae", 3, 0, 0.0, 334.6666666666667, 216, 541, 247.0, 541.0, 541.0, 541.0, 0.084290972436852, 0.038139469950268325, 0.05405378115253856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76b0017b-9157-48b3-9416-60f0dc2ce056", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 0.7590926995798319, 2.8968618697478994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 499.85, 119, 963, 519.5, 884.8, 959.0999999999999, 963.0, 0.08968971841912902, 0.05509261023987515, 0.04055306604302415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 119.10000000000001, 107, 128, 121.0, 124.80000000000001, 127.85, 128.0, 0.12378459005638387, 0.09199225882119935, 0.06213406180564582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 194.95000000000002, 105, 361, 121.5, 356.20000000000005, 360.8, 361.0, 0.12379378431408959, 0.12609073929647993, 0.06540277081437741], "isController": false}, {"data": ["login", 20, 0, 0.0, 3397.95, 1654, 5933, 3138.5, 5385.600000000002, 5909.7, 5933.0, 0.0881670942770739, 21.21801394252387, 0.16226533776813817], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8bdce84-6bf8-4a6b-9a54-7d5c8470455d", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bec6b3de-e1e3-4bda-a87b-dd60355c14aa", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=221f06b8-cbf6-46cf-8923-330c4172053d", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 126.49999999999999, 112, 159, 124.0, 152.0, 159.0, 159.0, 0.11423535747507221, 0.09248155404964342, 0.04060709972746707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 844.1500000000002, 232, 1637, 760.0, 1562.8, 1633.35, 1637.0, 0.12369195754892016, 74.08514094312025, 0.2623622380822799], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c975f6b-c592-48c1-8288-f69ea52f8891", 3, 0, 0.0, 379.6666666666667, 252, 557, 330.0, 557.0, 557.0, 557.0, 0.05042186291976201, 0.03241639950082356, 0.03233433266664426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79405b79-529d-49a1-abf3-26e20145edee", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96a6a427-9511-4755-a73d-363191323ec0", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 369.4444444444444, 226, 1472, 241.0, 781.7000000000011, 1472.0, 1472.0, 0.12187525390677897, 8.27867681348685, 0.2723679176935785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 918.0, 107, 1567, 1156.0, 1567.0, 1567.0, 1567.0, 0.044964702708373924, 35.86628832304142, 0.07752459241370525], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1138.0000000000002, 123, 3572, 1113.5, 2261.1, 3379.099999999997, 3572.0, 0.0851442614702866, 0.026788997039301817, 0.038414696093039456], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 466.3571428571429, 233, 1301, 447.0, 1027.5, 1301.0, 1301.0, 0.11538683436219926, 10.026251470667018, 0.2573989231935779], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 137.0588235294118, 117, 363, 122.0, 180.59999999999985, 363.0, 363.0, 0.11021855691491775, 0.08557007104234338, 0.03917925265334967], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cba9474a-e2f8-4399-97aa-deb0d238946f", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 471.99999999999994, 235, 1453, 452.0, 1389.8, 1453.0, 1453.0, 0.08488159018169654, 12.06288419061659, 0.1883456562470354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 156.41666666666669, 104, 357, 120.5, 352.8, 357.0, 357.0, 0.05616347314917954, 0.041738674869653936, 0.028191430858084263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 136.41666666666669, 103, 341, 119.5, 277.4000000000002, 341.0, 341.0, 0.056163210289100124, 0.01502804650313812, 0.032030580868002416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 151.5, 111, 325, 117.5, 323.2, 325.0, 325.0, 0.05616399887672002, 0.015137952822240943, 0.033018288402134235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 133.83333333333334, 105, 316, 118.0, 259.6000000000002, 316.0, 316.0, 0.05616399887672002, 0.015137952822240943, 0.03307313605728728], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 121.0, 121, 121, 121.0, 121.0, 121.0, 121.0, 8.264462809917356, 2.4373708677685952, 5.108793904958678], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1340.4821428571431, 834, 2031, 1296.5, 1839.6, 1900.8999999999999, 2031.0, 0.23984718308049444, 286.94061533651416, 0.47360449627808565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1138.0000000000002, 123, 3572, 1113.5, 2261.1, 3379.099999999997, 3572.0, 0.08639444562255053, 0.027182343331526904, 0.038978744021111664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 163.4, 108, 358, 118.0, 358.0, 358.0, 358.0, 0.08012178511337233, 0.021595324893838634, 0.04718109025719093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 158.6, 119, 314, 120.0, 314.0, 314.0, 314.0, 0.08012178511337233, 0.021595324893838634, 0.047102846326416155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 113.17647058823529, 101, 120, 114.0, 119.2, 120.0, 120.0, 0.11289005173020605, 0.0304273967554071, 0.06636700306795316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 183.35294117647058, 105, 358, 119.0, 358.0, 358.0, 358.0, 0.11289529957099786, 0.030428811212495518, 0.06648033754034346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 207.4, 115, 338, 129.0, 338.0, 338.0, 338.0, 0.08011023167879001, 0.021435745585926234, 0.04568786650430993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 117.23529411764704, 107, 129, 116.0, 124.19999999999999, 129.0, 129.0, 0.11287880799978751, 0.08388747352327959, 0.056659870421768344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 169.4, 118, 359, 122.0, 359.0, 359.0, 359.0, 0.07981610369708192, 0.059316459876444676, 0.04006394267607433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 159.17647058823533, 109, 357, 119.0, 356.2, 357.0, 357.0, 0.11288555396925529, 0.03020570487067964, 0.0643800424980909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24c937cd-7d8e-4389-932a-61ba57974446", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 475.6923076923077, 107, 605, 496.0, 599.0, 605.0, 605.0, 0.07633453315561088, 0.014301256437056306, 0.051952439181928683], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 175.8, 117, 363, 134.0, 363.0, 363.0, 363.0, 0.08708677326087713, 0.06854681567213572, 0.03095662643257742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93b80799-d8ea-46cc-9956-10f2481be5d3", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1919.85, 1026, 4660, 1553.5, 3783.600000000001, 4617.9, 4660.0, 0.08876855817669382, 0.0459446639000466, 0.040830069239475374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 382.6, 238, 718, 259.0, 718.0, 718.0, 718.0, 0.07965081084525441, 0.12344320001115111, 0.17913654040685634], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8bdce84-6bf8-4a6b-9a54-7d5c8470455d", 3, 0, 0.0, 393.0, 219, 493, 467.0, 493.0, 493.0, 493.0, 0.01809070680391483, 0.024939499776881285, 0.011601136850166737], "isController": false}, {"data": ["addBook", 58, 9, 15.517241379310345, 1295.672413793103, 611, 3377, 1008.0, 2139.3, 2824.7, 3377.0, 0.2821601794149554, 88.3480473557821, 1.0261704706602062], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 224.26785714285717, 111, 496, 122.5, 470.20000000000005, 478.9, 496.0, 0.2409037331474933, 0.17903099699730704, 0.11645248819141522], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 748.4285714285714, 521, 1075, 707.0, 956.3, 1062.5, 1075.0, 0.2404950762927684, 70.71353761815394, 0.12095211356521067], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 194.83928571428572, 103, 434, 123.5, 359.3, 365.59999999999997, 434.0, 0.2411018353877219, 0.42663723215092975, 0.11725460353816944], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1114.6785714285716, 714, 1546, 1079.5, 1413.8, 1459.65, 1546.0, 0.24039596649910494, 216.30871322692948, 0.12066750662162104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 121.88235294117646, 110, 131, 122.0, 127.8, 131.0, 131.0, 0.0836597704769591, 0.062499730873900115, 0.02973843403673156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb880ef2-8460-4099-9f6e-a5794f40176e", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 1.0539139851485149, 1.969239892739274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 9, 5.232558139534884, 224.45930232558143, 107, 2349, 126.0, 362.70000000000005, 548.8499999999998, 1852.600000000007, 0.7261029799772882, 1.5338414251248518, 0.3488491782266201], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 185.25, 118, 379, 124.0, 373.90000000000003, 379.0, 379.0, 0.057978576915829604, 0.04489942528735632, 0.0206095722630488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 126.11111111111111, 111, 154, 123.0, 151.3, 154.0, 154.0, 0.1185153971253432, 0.09617802247183614, 0.04212852007189934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79405b79-529d-49a1-abf3-26e20145edee", 3, 0, 0.0, 1279.6666666666667, 539, 2710, 590.0, 2710.0, 2710.0, 2710.0, 0.033847438313043675, 0.02176064149357463, 0.021705551261945327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 313.8333333333333, 221, 685, 242.5, 684.1, 685.0, 685.0, 0.0561322100654408, 0.08699396227915483, 0.12624265603584978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64743ec5-71ce-4437-90c2-f8c71eb45cde", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 1.4384501689189189, 2.68774634009009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 319.94117647058823, 222, 480, 240.0, 479.2, 480.0, 480.0, 0.11278819041300381, 0.17479966619671589, 0.2536632837120584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/221f06b8-cbf6-46cf-8923-330c4172053d", 3, 0, 0.0, 1556.3333333333333, 249, 3881, 539.0, 3881.0, 3881.0, 3881.0, 0.0338089120292109, 0.028185098862893592, 0.02168084527914892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96a6a427-9511-4755-a73d-363191323ec0", 3, 0, 0.0, 556.0, 203, 1058, 407.0, 1058.0, 1058.0, 1058.0, 0.0177191863349635, 0.024427328817894018, 0.011362889674439483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 120.81818181818183, 108, 142, 122.0, 138.4, 142.0, 142.0, 0.052656521510189035, 0.04365760425991259, 0.01871774788057501], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 150.24999999999997, 109, 363, 124.0, 326.7000000000004, 362.09999999999997, 363.0, 0.12216650072383652, 0.09484606257368167, 0.04342637330417626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=884adc23-a8ef-4673-967f-87c88bde5370", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c975f6b-c592-48c1-8288-f69ea52f8891", 1, 0, 0.0, 594.0, 594, 594, 594.0, 594.0, 594.0, 594.0, 1.6835016835016834, 0.3041482533670034, 1.1606954966329968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76b0017b-9157-48b3-9416-60f0dc2ce056", 3, 0, 0.0, 402.6666666666667, 196, 589, 423.0, 589.0, 589.0, 589.0, 0.08671522719389525, 0.04025257616487456, 0.05560839764712684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4f9e078-a8a0-462d-97ca-2988b36cb1d5", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 1.3884171195652173, 2.594259510869565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 118.23529411764706, 110, 124, 120.0, 124.0, 124.0, 124.0, 0.0849320543565148, 0.06311845055205835, 0.042631910096922465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 200.9411764705882, 107, 466, 119.0, 385.19999999999993, 466.0, 466.0, 0.08493375167369452, 0.03773423916844861, 0.047599591068966204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 266.4117647058824, 107, 1342, 116.0, 1271.6, 1342.0, 1342.0, 0.08493884403229675, 9.011743966219322, 0.04907599340974498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 276.70588235294116, 109, 702, 338.0, 657.1999999999999, 702.0, 702.0, 0.08493714651158144, 2.958357690309171, 0.04915795904780462], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 31.57894736842105, 0.4665629860031104], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.07776049766718507], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.07776049766718507], "isController": false}, {"data": ["401/Unauthorized", 11, 57.89473684210526, 0.8553654743390358], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1286, 19, "401/Unauthorized", 11, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
