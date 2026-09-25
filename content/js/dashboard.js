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

    var data = {"OkPercent": 95.8872810357959, "KoPercent": 4.112718964204113};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7652994791666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=692aa60d-ade7-459a-9b42-013d8bfe2723"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e64d27d0-5d9c-4436-8e9f-5b1fe6aa742e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7868d562-12ca-477c-bfbc-0d338ddb746e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2f6fcfc8-a3ca-4be5-932e-3fd872d9f6f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2d915c5f-cfb1-479e-ad25-3e4b3b29abb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e64d27d0-5d9c-4436-8e9f-5b1fe6aa742e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7868d562-12ca-477c-bfbc-0d338ddb746e"], "isController": false}, {"data": [0.4636363636363636, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.53125, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/692aa60d-ade7-459a-9b42-013d8bfe2723"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ef8d83c6-07ee-4b76-81f4-d266e6f9ba9b"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea62685d-b16b-4b01-afc6-a9054823abec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.55, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.21052631578947367, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6545454545454545, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8431952662721893, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6739130434782609, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ea62685d-b16b-4b01-afc6-a9054823abec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9fdac94-9ae0-41bb-8c8a-12880f595dc6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e41e574f-92cb-4240-b5bf-de33f642670c"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e41e574f-92cb-4240-b5bf-de33f642670c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9fdac94-9ae0-41bb-8c8a-12880f595dc6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef8d83c6-07ee-4b76-81f4-d266e6f9ba9b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/91c888d6-7467-4870-a769-0310def5759f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf324998-ac4b-42b1-850a-23771dcdb60d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cf324998-ac4b-42b1-850a-23771dcdb60d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=91c888d6-7467-4870-a769-0310def5759f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6db7a5f8-9d62-4a65-9c58-414422274e90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83ab9d28-8c4d-48fd-8303-d5026b4a24b0"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/83ab9d28-8c4d-48fd-8303-d5026b4a24b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6db7a5f8-9d62-4a65-9c58-414422274e90"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1313, 54, 4.112718964204113, 321.75704493526285, 82, 2565, 97.0, 890.0000000000034, 1129.6999999999996, 1555.1599999999994, 5.082980724934479, 707.2225263960293, 3.7278463409700637], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=692aa60d-ade7-459a-9b42-013d8bfe2723", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1456.1999999999998, 1056, 1904, 1396.0, 1849.6, 1892.6, 1904.0, 0.24514719975039556, 294.9939958088186, 1.2053868659601972], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 102.35294117647061, 87, 253, 91.0, 140.9999999999999, 253.0, 253.0, 0.08711604882598313, 0.0676340418131412, 0.03096703298111119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 290.83333333333337, 175, 1306, 178.0, 602.2000000000011, 1306.0, 1306.0, 0.09544565165518668, 6.483380981592245, 0.21330280398114418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e64d27d0-5d9c-4436-8e9f-5b1fe6aa742e", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7868d562-12ca-477c-bfbc-0d338ddb746e", 1, 0, 0.0, 907.0, 907, 907, 907.0, 907.0, 907.0, 907.0, 1.1025358324145536, 0.1991886025358324, 0.7601467750826901], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f6fcfc8-a3ca-4be5-932e-3fd872d9f6f5", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.9150026862464185, 1.709683918338109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d915c5f-cfb1-479e-ad25-3e4b3b29abb4", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 1.1323969414893618, 2.115885416666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 242.49999999999997, 173, 358, 181.5, 353.1, 358.0, 358.0, 0.11314937131380565, 0.175359426049814, 0.254475588023139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 88.41666666666666, 84, 96, 88.0, 94.5, 96.0, 96.0, 0.05738139981924859, 0.04264379420160955, 0.028802772956146264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 86.58333333333334, 84, 94, 85.0, 92.80000000000001, 94.0, 94.0, 0.057383046179006414, 0.01535444790336695, 0.03272626852396459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 101.75, 85, 262, 87.5, 210.40000000000018, 262.0, 262.0, 0.057383594986586586, 0.015466672086228416, 0.033735277521411255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 101.08333333333333, 85, 255, 87.0, 205.20000000000016, 255.0, 255.0, 0.057383594986586586, 0.015466672086228416, 0.03379131618839034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 90.6, 88, 96, 90.0, 96.0, 96.0, 96.0, 0.13531433520067115, 0.03990715745176044, 0.08364645916213363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e64d27d0-5d9c-4436-8e9f-5b1fe6aa742e", 3, 0, 0.0, 353.6666666666667, 221, 560, 280.0, 560.0, 560.0, 560.0, 0.021053813547427223, 0.024884894853746176, 0.013501306213682172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7868d562-12ca-477c-bfbc-0d338ddb746e", 3, 0, 0.0, 334.6666666666667, 226, 408, 370.0, 408.0, 408.0, 408.0, 0.030491523356506893, 0.0251217596404033, 0.01955348340244745], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 998.9454545454547, 674, 1544, 919.0, 1374.8, 1520.2, 1544.0, 0.26088606394080255, 312.11043114386683, 0.5151480676643583], "isController": false}, {"data": ["deleteBook", 16, 5, 31.25, 382.125, 89, 682, 447.5, 653.3000000000001, 682.0, 682.0, 0.07585958391018226, 0.016413710019628668, 0.0504264360574826], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 5, 31.25, 382.125, 89, 682, 447.5, 653.3000000000001, 682.0, 682.0, 0.0779537149817296, 0.016866816382460414, 0.051818475943970765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 11, 45.833333333333336, 963.8333333333334, 180, 2394, 962.0, 1864.5, 2340.25, 2394.0, 0.09513465517651443, 0.02931150752752959, 0.04292208075346647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 87.2, 85, 91, 87.0, 91.0, 91.0, 91.0, 0.029041738786984655, 0.007827656157429457, 0.017101727039601316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 114.3076923076923, 85, 262, 88.0, 258.4, 262.0, 262.0, 0.08177386381506525, 0.02188089715364051, 0.046636656707029406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 88.2, 85, 91, 89.0, 91.0, 91.0, 91.0, 0.029041401421867015, 0.007827565226987594, 0.017073167632777286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 102.07692307692308, 85, 265, 88.0, 196.19999999999993, 265.0, 265.0, 0.0818639798488665, 0.06083836783690176, 0.04109188051007556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/692aa60d-ade7-459a-9b42-013d8bfe2723", 3, 0, 0.0, 278.6666666666667, 189, 448, 199.0, 448.0, 448.0, 448.0, 0.06674230794900889, 0.030199156265990346, 0.04280024305323812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 148.8461538461538, 83, 352, 89.0, 316.4, 352.0, 352.0, 0.08186552642682167, 0.022065317669729276, 0.0482079223001694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 153.3846153846154, 85, 263, 89.0, 261.4, 263.0, 263.0, 0.08177540698991016, 0.022041027665249225, 0.04807499512492766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 106.11764705882354, 84, 252, 87.0, 250.4, 252.0, 252.0, 0.08616582359321623, 0.023224382140359056, 0.050656079885855625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 145.7058823529412, 84, 253, 90.0, 253.0, 253.0, 253.0, 0.08616582359321623, 0.023224382140359056, 0.05074022619795837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 118.94117647058825, 86, 256, 90.0, 253.6, 256.0, 256.0, 0.08616363995762777, 0.06403372071069797, 0.04325010833810612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 86.4, 83, 90, 86.0, 90.0, 90.0, 90.0, 0.029041907472482795, 0.0077709791479104355, 0.016562962855400345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 107.47058823529413, 84, 262, 87.0, 259.6, 262.0, 262.0, 0.08616320324379118, 0.023055388367967562, 0.049139951849974654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 87.2, 85, 90, 86.0, 90.0, 90.0, 90.0, 0.029041401421867015, 0.021582525861367965, 0.014577422198085591], "isController": false}, {"data": ["deleteAccount", 16, 5, 31.25, 431.87499999999994, 88, 1222, 441.5, 1009.9000000000002, 1222.0, 1222.0, 0.07805030342055455, 0.016220781442076917, 0.05310221754326913], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 91.4, 87, 100, 90.0, 100.0, 100.0, 100.0, 0.028492788475236917, 0.022426940928750933, 0.010128295903306873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef8d83c6-07ee-4b76-81f4-d266e6f9ba9b", 3, 0, 0.0, 436.33333333333337, 189, 919, 201.0, 919.0, 919.0, 919.0, 0.02033677702757667, 0.02403738196195667, 0.013041487872501967], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1543.1739130434783, 959, 2565, 1398.0, 2362.2, 2524.9999999999995, 2565.0, 0.09826750122834377, 0.05086110903420136, 0.0451992119907714], "isController": false}, {"data": ["goToProfile", 16, 5, 31.25, 199.37500000000003, 87, 466, 200.0, 372.9000000000001, 466.0, 466.0, 0.07577982172796938, 0.11106572626670708, 0.04896734452111889], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 176.6, 171, 181, 178.0, 181.0, 181.0, 181.0, 0.02902690213289677, 0.04498602898916716, 0.06528218321490357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea62685d-b16b-4b01-afc6-a9054823abec", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.32728996829710144, 1.2490092844202898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 110.6111111111111, 86, 265, 89.0, 265.0, 265.0, 265.0, 0.0954912227651075, 0.07096564504320978, 0.047932117677016856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 603.1, 421, 701, 661.0, 700.7, 701.0, 701.0, 0.05205053065516003, 15.304584252892708, 0.029685068264270954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 105.55555555555554, 85, 254, 88.0, 249.5, 254.0, 254.0, 0.09549071618037135, 0.03351914787798409, 0.054014008620689655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 860.3, 749, 962, 853.0, 960.8, 962.0, 962.0, 0.05200451399181449, 46.79375310401943, 0.02960803872776157], "isController": false}, {"data": ["addBook", 57, 23, 40.35087719298246, 884.4385964912279, 433, 3292, 700.0, 1699.4, 2118.699999999999, 3292.0, 0.2659859914044527, 62.4725893342534, 0.9689385525695647], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 190.70000000000002, 84, 264, 252.5, 263.9, 264.0, 264.0, 0.05216211986855146, 0.09230250117364769, 0.028882736294403005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 115.66666666666669, 85, 256, 88.5, 255.4, 256.0, 256.0, 0.08579517831097892, 0.06375989325649899, 0.043065157863128097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 142.74999999999997, 84, 261, 87.5, 259.5, 261.0, 261.0, 0.08569469835466179, 0.022930026708180985, 0.04887275765539305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 129.75, 83, 264, 87.0, 262.8, 264.0, 264.0, 0.0858006992756991, 0.023125969726653272, 0.05044142672262779], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 159.54545454545453, 85, 438, 91.0, 356.0, 357.0, 438.0, 0.26211195516455865, 0.19479218542991125, 0.12670450957661772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 179.0, 82, 349, 176.0, 323.2000000000001, 349.0, 349.0, 0.08563782337198929, 0.02308206958073149, 0.050429304192685105], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 564.6727272727273, 410, 790, 519.0, 761.0, 781.5999999999999, 790.0, 0.26172155681499143, 76.9548276771736, 0.13162754078097713], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 106.7, 85, 261, 87.5, 244.90000000000006, 261.0, 261.0, 0.052207598293855684, 0.03879881084142986, 0.02931579005758498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 576.263157894737, 83, 1087, 798.0, 1086.0, 1087.0, 1087.0, 0.09028229849228561, 42.767405996526506, 0.048992624767760666], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 122.3090909090909, 84, 413, 89.0, 262.4, 302.9999999999995, 413.0, 0.26249725571050847, 0.46449709701898567, 0.12765979818733714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 150.05555555555554, 84, 1040, 88.0, 338.00000000000114, 1040.0, 1040.0, 0.09549223595070479, 4.797868343063815, 0.05568308116309543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 393.6315789473683, 83, 716, 522.0, 699.0, 716.0, 716.0, 0.09028272748871466, 13.983168507959135, 0.04908102429318128], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 835.5818181818181, 574, 1196, 778.0, 1047.0, 1163.3999999999999, 1196.0, 0.26137330285562216, 235.18415735474773, 0.13119714615995096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 150.1111111111111, 85, 698, 88.0, 308.30000000000064, 698.0, 698.0, 0.09549172935521862, 1.5841825079045933, 0.05577603940094855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 91.5, 87, 97, 91.0, 96.3, 97.0, 97.0, 0.11968880909634949, 0.08941595601436265, 0.04254563135846798], "isController": false}, {"data": ["deleteBooks", 16, 5, 31.25, 408.93750000000006, 88, 1883, 326.5, 1199.8000000000006, 1883.0, 1883.0, 0.07808801495385487, 0.016895874817591278, 0.052098394254186255], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 23, 13.609467455621301, 157.62721893491118, 85, 1959, 93.0, 270.0, 450.5, 1281.400000000011, 0.747665205254007, 1.6253474956533664, 0.35650361583501816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 96.25, 86, 136, 92.5, 125.80000000000004, 136.0, 136.0, 0.05857115663391563, 0.04535832735419443, 0.020820215834712198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 311.24999999999994, 172, 521, 339.0, 519.5, 521.0, 521.0, 0.08558102383431514, 0.13263387189947085, 0.19247372840862087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 116.3076923076923, 88, 373, 92.0, 266.9999999999999, 373.0, 373.0, 0.08552462780339862, 0.06940523994592213, 0.030401332539489356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 704.0434782608696, 222, 1258, 702.0, 1186.6, 1244.9999999999998, 1258.0, 0.09815846189957962, 0.06029460208480038, 0.04438219517529821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 99.42105263157896, 85, 259, 89.0, 113.0, 259.0, 259.0, 0.09028101152745968, 0.06709360329335627, 0.04531683586436941], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea62685d-b16b-4b01-afc6-a9054823abec", 3, 0, 0.0, 653.6666666666666, 208, 1262, 491.0, 1262.0, 1262.0, 1262.0, 0.01806488908158104, 0.024903907962400943, 0.011584580563383674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 123.73684210526316, 84, 266, 88.0, 263.0, 266.0, 266.0, 0.09028229849228561, 0.09552587360003041, 0.04749843787865109], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9fdac94-9ae0-41bb-8c8a-12880f595dc6", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e41e574f-92cb-4240-b5bf-de33f642670c", 1, 0, 0.0, 1883.0, 1883, 1883, 1883.0, 1883.0, 1883.0, 1883.0, 0.5310674455655868, 0.09594480217737653, 0.36614610993096125], "isController": false}, {"data": ["login", 23, 0, 0.0, 2980.0869565217395, 1551, 4833, 2897.0, 3992.2000000000007, 4706.199999999998, 4833.0, 0.0958457134046481, 49.98003973950802, 0.21371168645741742], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 192.5, 170, 349, 179.5, 300.4000000000002, 349.0, 349.0, 0.057358086534233216, 0.08889383137678528, 0.12899968094564365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 101.72222222222221, 87, 256, 92.0, 120.10000000000022, 256.0, 256.0, 0.09782821365681862, 0.07919881750146741, 0.03477487282332224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 267.1176470588236, 176, 515, 183.0, 507.8, 515.0, 515.0, 0.08612435343408195, 0.1334759266600469, 0.1936956894127839], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e41e574f-92cb-4240-b5bf-de33f642670c", 3, 0, 0.0, 360.66666666666663, 181, 618, 283.0, 618.0, 618.0, 618.0, 0.02077447232840286, 0.024554722989723565, 0.013322171382471886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9fdac94-9ae0-41bb-8c8a-12880f595dc6", 3, 0, 0.0, 275.3333333333333, 192, 418, 216.0, 418.0, 418.0, 418.0, 0.05831130461825533, 0.037488550332374436, 0.037393642610013995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef8d83c6-07ee-4b76-81f4-d266e6f9ba9b", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91c888d6-7467-4870-a769-0310def5759f", 3, 0, 0.0, 578.0, 192, 1107, 435.0, 1107.0, 1107.0, 1107.0, 0.10781671159029649, 0.04878425426774483, 0.06914027403414195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf324998-ac4b-42b1-850a-23771dcdb60d", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.0323660714285714, 3.9397321428571432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf324998-ac4b-42b1-850a-23771dcdb60d", 3, 0, 0.0, 650.6666666666667, 264, 1222, 466.0, 1222.0, 1222.0, 1222.0, 0.08835483300936561, 0.03997826102962832, 0.05665983757436532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=91c888d6-7467-4870-a769-0310def5759f", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 0.9926596840659341, 3.7882039835164836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6db7a5f8-9d62-4a65-9c58-414422274e90", 3, 0, 0.0, 1003.3333333333333, 197, 2328, 485.0, 2328.0, 2328.0, 2328.0, 0.05519474546023219, 0.024974184957592037, 0.03539506788953691], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 106.08333333333334, 86, 265, 90.0, 217.60000000000016, 265.0, 265.0, 0.08239324924644507, 0.06831237168967956, 0.02928822531807227], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83ab9d28-8c4d-48fd-8303-d5026b4a24b0", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 677.8947368421052, 171, 1185, 900.0, 1176.0, 1185.0, 1185.0, 0.09024413413128146, 56.8890700327135, 0.1908086423601216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 117.36842105263158, 86, 262, 91.0, 262.0, 262.0, 262.0, 0.08913074072336634, 0.06919818249519163, 0.031683192991509124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83ab9d28-8c4d-48fd-8303-d5026b4a24b0", 3, 0, 0.0, 328.0, 189, 462, 333.0, 462.0, 462.0, 462.0, 0.027826474107465842, 0.02790799698082756, 0.017844451169175685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6db7a5f8-9d62-4a65-9c58-414422274e90", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 0.7140872035573123, 2.7251111660079053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 10, 50.0, 528.3000000000001, 87, 1212, 463.5, 1049.1000000000001, 1203.9499999999998, 1212.0, 0.1039619914959091, 62.201251409984515, 0.1516535398408342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 292.0769230769231, 174, 618, 341.0, 512.8, 618.0, 618.0, 0.08172913706604971, 0.12666419973029383, 0.18381074478819578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 88.81250000000001, 86, 93, 88.0, 92.3, 93.0, 93.0, 0.1132206316295987, 0.08414150456066856, 0.05683144986095091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 131.18750000000003, 83, 264, 89.5, 263.3, 264.0, 264.0, 0.11322303522651683, 0.030296007472720328, 0.06457251227762288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 130.125, 84, 266, 89.0, 261.8, 266.0, 266.0, 0.11322143281723229, 0.030516714314019644, 0.0665618189023182], "isController": false}, {"data": ["register", 24, 11, 45.833333333333336, 963.8333333333334, 180, 2394, 962.0, 1864.5, 2340.25, 2394.0, 0.09769202588838687, 0.03009944742947857, 0.044075894492612046], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 117.9375, 84, 254, 88.0, 252.6, 254.0, 254.0, 0.11322463768115942, 0.030517578124999997, 0.06667427394701086], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 20.37037037037037, 0.8377760853008378], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 9.25925925925926, 0.38080731150038083], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 9.25925925925926, 0.38080731150038083], "isController": false}, {"data": ["401/Unauthorized", 33, 61.111111111111114, 2.5133282559025134], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1313, 54, "401/Unauthorized", 33, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 23, "401/Unauthorized", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
