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

    var data = {"OkPercent": 98.92802450229709, "KoPercent": 1.0719754977029097};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8185404339250493, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2ccbc9bd-b103-4a3a-ac18-721d0f368d6d"], "isController": false}, {"data": [0.4107142857142857, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54183d53-c203-49ee-be7f-2d1defef34b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b9ce0bf-4e09-40ef-8456-43a169e3a757"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f08acd7d-e549-41b2-8f11-b93b04436f62"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7698f592-631f-4d49-b9eb-69ffca28aaed"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95d004aa-6b5d-4bc6-9824-4ba01ef0f4b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/38c5fbe8-2299-444c-a512-7e6e709f7b0f"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a32e6214-d6c7-4246-8c7d-7c2aee329dee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a6a9d748-534c-4081-b01d-b6022eb9aba8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6df7ecfc-7c5e-447a-9edf-17b1d8aee9a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/61fb5645-2481-42aa-a2f1-41b6b1992ad8"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66eddf95-695f-48b5-abad-ee4f4b46283d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae9674b7-374d-4acf-9322-3fc8e02b1fdb"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc4f80dc-ee3a-4b4f-897e-de490a99b761"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/95d004aa-6b5d-4bc6-9824-4ba01ef0f4b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0e203f3-385e-44f1-9e25-a2edb3c68264"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54183d53-c203-49ee-be7f-2d1defef34b7"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0b9ce0bf-4e09-40ef-8456-43a169e3a757"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ccbc9bd-b103-4a3a-ac18-721d0f368d6d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3474576271186441, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a32e6214-d6c7-4246-8c7d-7c2aee329dee"], "isController": false}, {"data": [0.7678571428571429, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9195402298850575, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f08acd7d-e549-41b2-8f11-b93b04436f62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6a9d748-534c-4081-b01d-b6022eb9aba8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92254c38-5411-4164-ac7c-ba0e1eebea16"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61fb5645-2481-42aa-a2f1-41b6b1992ad8"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bc4f80dc-ee3a-4b4f-897e-de490a99b761"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ae9674b7-374d-4acf-9322-3fc8e02b1fdb"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6df7ecfc-7c5e-447a-9edf-17b1d8aee9a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0e203f3-385e-44f1-9e25-a2edb3c68264"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/66eddf95-695f-48b5-abad-ee4f4b46283d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7698f592-631f-4d49-b9eb-69ffca28aaed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1306, 14, 1.0719754977029097, 313.0643185298623, 77, 2938, 100.5, 853.0, 1098.6499999999999, 1703.810000000001, 5.07857006754576, 710.4116481376794, 3.7126759976318153], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/2ccbc9bd-b103-4a3a-ac18-721d0f368d6d", 3, 0, 0.0, 282.0, 178, 430, 238.0, 430.0, 430.0, 430.0, 0.05506709007140366, 0.03540283297233796, 0.03531320554709154], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1312.4642857142856, 959, 1801, 1285.5, 1616.6000000000001, 1750.9, 1801.0, 0.25667233484739455, 308.8625881308525, 1.262055865192023], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54183d53-c203-49ee-be7f-2d1defef34b7", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b9ce0bf-4e09-40ef-8456-43a169e3a757", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f08acd7d-e549-41b2-8f11-b93b04436f62", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7698f592-631f-4d49-b9eb-69ffca28aaed", 3, 0, 0.0, 636.0, 168, 950, 790.0, 950.0, 950.0, 950.0, 0.020019352040305628, 0.027598292933168733, 0.012837930833138701], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 813.0714285714284, 394, 2827, 513.5, 2087.0, 2827.0, 2827.0, 0.08864293990641839, 0.016014593635436912, 0.06024949821764374], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 813.0714285714284, 394, 2827, 513.5, 2087.0, 2827.0, 2827.0, 0.08915777742397707, 0.01610760627288648, 0.06059942684285941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 135.85714285714286, 77, 242, 81.0, 239.5, 242.0, 242.0, 0.07353790879198227, 0.01967713575097963, 0.04193958860792739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 93.14285714285714, 79, 233, 81.0, 163.0, 233.0, 233.0, 0.07353636373186541, 0.054649582812450755, 0.0369118075763465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 164.42857142857144, 79, 321, 156.0, 281.0, 321.0, 321.0, 0.07344454936522925, 0.019795601196096947, 0.04324908522190746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95d004aa-6b5d-4bc6-9824-4ba01ef0f4b3", 1, 0, 0.0, 567.0, 567, 567, 567.0, 567.0, 567.0, 567.0, 1.763668430335097, 0.3186315035273369, 1.2159667107583776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 123.85714285714288, 78, 241, 79.5, 238.0, 241.0, 241.0, 0.07347692824453123, 0.019804328315908806, 0.04319639726875761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38c5fbe8-2299-444c-a512-7e6e709f7b0f", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 0.8870442708333334, 1.6574435763888888], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 233.92857142857144, 161, 439, 191.0, 416.5, 439.0, 439.0, 0.08958394655677702, 0.20140765774773162, 0.0579146216997914], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a32e6214-d6c7-4246-8c7d-7c2aee329dee", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 80.94117647058823, 79, 83, 81.0, 83.0, 83.0, 83.0, 0.0905093011617135, 0.06726325994537498, 0.04543142655968822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 91.4705882352941, 78, 237, 79.0, 143.39999999999992, 237.0, 237.0, 0.09050833741508188, 0.024218051222394957, 0.05161803618203888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 608.8, 464, 700, 626.0, 700.0, 700.0, 700.0, 0.0380595708402792, 11.190777523730143, 0.021705848994846736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 833.8, 688, 924, 852.0, 924.0, 924.0, 924.0, 0.03799623077390723, 34.189075240611125, 0.02163261966912882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 180.4, 80, 254, 242.0, 254.0, 254.0, 254.0, 0.038220455587830604, 0.06763229055190338, 0.0211630842952148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 94.66666666666666, 79, 237, 81.0, 192.60000000000016, 237.0, 237.0, 0.07146643162151378, 0.05311128365622264, 0.03587279868501766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 107.08333333333334, 78, 254, 80.0, 248.3, 254.0, 254.0, 0.07139372449161718, 0.019103398936233505, 0.040716733499125426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 159.74999999999997, 79, 254, 159.5, 249.8, 254.0, 254.0, 0.071394149249469, 0.019242954289895944, 0.04197195102361362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 113.16666666666666, 79, 318, 80.0, 293.4000000000001, 318.0, 318.0, 0.07146813414568778, 0.01926289553145491, 0.04208523915024388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6a9d748-534c-4081-b01d-b6022eb9aba8", 3, 0, 0.0, 285.6666666666667, 182, 484, 191.0, 484.0, 484.0, 484.0, 0.02319163245900879, 0.023259576694728543, 0.01487223826310134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 111.2, 78, 237, 81.0, 237.0, 237.0, 237.0, 0.038220455587830604, 0.02840406904525302, 0.02146168160449473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 515.4, 78, 1161, 391.0, 1098.6, 1157.8999999999999, 1161.0, 0.09708549348556339, 43.69193263540999, 0.05290400914545349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 101.29411764705883, 79, 236, 81.0, 232.0, 236.0, 236.0, 0.09050978304272594, 0.024395214960734726, 0.05320985292160256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 349.65, 78, 717, 354.0, 635.4, 712.9499999999999, 717.0, 0.09708737864077671, 14.286540503640778, 0.052999848300970875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 107.6470588235294, 77, 240, 80.0, 236.8, 240.0, 240.0, 0.09051026492886959, 0.02439534484410938, 0.053298525148543316], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 476.64285714285717, 179, 811, 439.0, 783.5, 811.0, 811.0, 0.08914642299977714, 0.016105554936483173, 0.06146227991976822], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 275.58333333333337, 162, 474, 316.0, 451.2000000000001, 474.0, 474.0, 0.07135848720007136, 0.11059171795557934, 0.16048691017750424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6df7ecfc-7c5e-447a-9edf-17b1d8aee9a5", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61fb5645-2481-42aa-a2f1-41b6b1992ad8", 3, 0, 0.0, 369.0, 352, 400, 355.0, 400.0, 400.0, 400.0, 0.07455453664355477, 0.03300591465990706, 0.04781003814707125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 639.7619047619048, 101, 1952, 501.0, 1239.2000000000003, 1885.199999999999, 1952.0, 0.08493668172607516, 0.05217302031806765, 0.03840398792887969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 82.44999999999999, 78, 96, 81.0, 94.90000000000002, 96.0, 96.0, 0.09708360840355713, 0.07214904882334666, 0.04873142062444177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 120.65, 79, 238, 81.5, 237.0, 237.95, 238.0, 0.09708502220819883, 0.09888640445620252, 0.05129198927210505], "isController": false}, {"data": ["login", 21, 0, 0.0, 2807.333333333333, 1357, 5175, 2808.0, 4050.0000000000005, 5070.699999999999, 5175.0, 0.08566428574342322, 24.518816408942943, 0.1630704769767034], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 94.41176470588235, 79, 243, 83.0, 127.7999999999999, 243.0, 243.0, 0.08689696065101159, 0.07034919958953965, 0.030889153981414275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66eddf95-695f-48b5-abad-ee4f4b46283d", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae9674b7-374d-4acf-9322-3fc8e02b1fdb", 1, 0, 0.0, 756.0, 756, 756, 756.0, 756.0, 756.0, 756.0, 1.3227513227513228, 0.23897362764550265, 0.911975033068783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 607.6, 161, 1244, 551.0, 1180.4, 1240.85, 1244.0, 0.09704403858470974, 58.12440370987229, 0.20583950371678666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc4f80dc-ee3a-4b4f-897e-de490a99b761", 1, 0, 0.0, 698.0, 698, 698, 698.0, 698.0, 698.0, 698.0, 1.4326647564469914, 0.25883103510028654, 0.9877551934097422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 303.50000000000006, 161, 555, 318.0, 442.0, 555.0, 555.0, 0.07341219900998407, 0.11377457014535615, 0.16510575617186843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 945.4, 767, 1089, 934.0, 1089.0, 1089.0, 1089.0, 0.037973145391579075, 45.429083489656115, 0.08562499288003524], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 927.695652173913, 98, 1914, 972.0, 1698.2, 1872.1999999999994, 1914.0, 0.09659441684270649, 0.03043183478994914, 0.04358068416145547], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/95d004aa-6b5d-4bc6-9824-4ba01ef0f4b3", 3, 0, 0.0, 646.6666666666667, 176, 1483, 281.0, 1483.0, 1483.0, 1483.0, 0.029835605811976012, 0.02487271695458026, 0.01913285919583097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 208.58823529411762, 161, 322, 164.0, 320.4, 322.0, 322.0, 0.09046884146665958, 0.14020903457772338, 0.20346654482198925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 110.38461538461539, 81, 243, 86.0, 239.8, 243.0, 243.0, 0.07514624615598049, 0.05834107977930125, 0.026712142188258688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 332.05882352941177, 161, 1263, 176.0, 1004.5999999999998, 1263.0, 1263.0, 0.10452661739568858, 14.854722652839435, 0.23193644589517823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 16, 0, 0.0, 91.0625, 79, 234, 81.0, 132.5000000000001, 234.0, 234.0, 0.07273752210538757, 0.054055912424023383, 0.03651082652555587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0e203f3-385e-44f1-9e25-a2edb3c68264", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 16, 0, 0.0, 120.5625, 77, 395, 80.5, 285.8000000000001, 395.0, 395.0, 0.07274049827241316, 0.03312036847608656, 0.04072118226041098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54183d53-c203-49ee-be7f-2d1defef34b7", 3, 0, 0.0, 404.0, 394, 414, 404.0, 414.0, 414.0, 414.0, 0.017862778138341265, 0.021113199030051148, 0.011454971657725353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 16, 0, 0.0, 203.43750000000003, 78, 1094, 80.0, 931.6000000000001, 1094.0, 1094.0, 0.07274016757516105, 8.19862136071849, 0.041981874059492365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 16, 0, 0.0, 149.25, 77, 464, 81.0, 462.6, 464.0, 464.0, 0.07274049827241316, 2.6906703207401343, 0.04205310056373886], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 907.7142857142858, 627, 1460, 817.5, 1270.6, 1409.65, 1460.0, 0.25485939498200055, 304.9004398600093, 0.5032477506382862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b9ce0bf-4e09-40ef-8456-43a169e3a757", 3, 0, 0.0, 301.0, 192, 447, 264.0, 447.0, 447.0, 447.0, 0.01914926211509983, 0.026398803729637953, 0.012279963010008683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 927.695652173913, 98, 1914, 972.0, 1698.2, 1872.1999999999994, 1914.0, 0.09205191728134668, 0.029000731412516658, 0.041531236117170085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ccbc9bd-b103-4a3a-ac18-721d0f368d6d", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 79.5, 78, 82, 79.5, 82.0, 82.0, 82.0, 0.03436465480704246, 0.009262348365960663, 0.02023621762563145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 105.83333333333334, 79, 235, 80.0, 235.0, 235.0, 235.0, 0.03436465480704246, 0.009262348365960663, 0.020202658392421448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 158.76923076923077, 77, 943, 81.0, 660.5999999999997, 943.0, 943.0, 0.07780051946808383, 5.404360017789388, 0.045223889696817364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 109.46153846153847, 77, 468, 80.0, 313.59999999999985, 468.0, 468.0, 0.07780284758422158, 1.7790972363530813, 0.04530122232762181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 107.33333333333334, 78, 243, 80.5, 243.0, 243.0, 243.0, 0.034332406358361656, 0.00918660092010849, 0.019580200501253132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 92.61538461538461, 79, 238, 80.0, 175.99999999999994, 238.0, 238.0, 0.07780238194984739, 0.05781993424202526, 0.03905314875216949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 81.0, 80, 83, 81.0, 83.0, 83.0, 83.0, 0.034364457986586404, 0.025538430202922124, 0.017249347075298255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 129.00000000000003, 78, 249, 80.0, 245.0, 249.0, 249.0, 0.0778033132241693, 0.029807459243033612, 0.043869566485923585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 91.66666666666667, 81, 133, 84.0, 133.0, 133.0, 133.0, 0.034309633001292326, 0.02700543378812658, 0.012196002355928133], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 689.6428571428572, 378, 1483, 469.0, 1481.0, 1483.0, 1483.0, 0.08755143646892549, 0.015817398190186734, 0.05959311642464948], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1551.4285714285713, 940, 2938, 1385.0, 2488.8, 2898.3999999999996, 2938.0, 0.08584989350525114, 0.044434026911897566, 0.03948759750095048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 215.5, 161, 324, 163.5, 324.0, 324.0, 324.0, 0.03431650108954891, 0.05318387424718176, 0.07717861524338979], "isController": false}, {"data": ["addBook", 59, 8, 13.559322033898304, 1007.4745762711865, 411, 3325, 697.0, 1999.0, 2887.0, 3325.0, 0.2592392426699006, 79.82682822022373, 0.9431191959519133], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 148.51785714285714, 80, 337, 82.5, 325.0, 326.15, 337.0, 0.2556669025498208, 0.19000245394571644, 0.12358898121304815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a32e6214-d6c7-4246-8c7d-7c2aee329dee", 3, 0, 0.0, 915.6666666666666, 184, 1428, 1135.0, 1428.0, 1428.0, 1428.0, 0.021086962633902213, 0.029070080323755167, 0.013522563928641719], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 523.5892857142858, 387, 724, 477.5, 633.0, 707.2, 724.0, 0.25537193097661526, 75.08782685327058, 0.12843412544234065], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 126.14285714285714, 78, 253, 84.5, 241.3, 243.3, 253.0, 0.2559929784783046, 0.4529875751979374, 0.12449658523651923], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 757.6964285714287, 545, 1170, 705.0, 943.6, 1094.2, 1170.0, 0.25527647353785843, 229.69821961754113, 0.12813682363130782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 96.58823529411765, 80, 252, 84.0, 135.1999999999999, 252.0, 252.0, 0.10590778546820585, 0.07912056238591551, 0.0376469081156513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 8, 4.597701149425287, 186.5977011494253, 80, 2736, 87.0, 280.5, 553.25, 2226.0, 0.7151870378514795, 1.5136070499356742, 0.34418697311472174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 16, 0, 0.0, 102.87499999999999, 82, 240, 85.0, 177.70000000000007, 240.0, 240.0, 0.07640404368401196, 0.05916836586076318, 0.02715924990330113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f08acd7d-e549-41b2-8f11-b93b04436f62", 3, 0, 0.0, 284.6666666666667, 191, 378, 285.0, 378.0, 378.0, 378.0, 0.054514728062364855, 0.03540263101706311, 0.03495898902436809], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 85.07142857142857, 80, 104, 82.5, 98.0, 104.0, 104.0, 0.06980942028262842, 0.05665198071764084, 0.024815067366090574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6a9d748-534c-4081-b01d-b6022eb9aba8", 1, 0, 0.0, 811.0, 811, 811, 811.0, 811.0, 811.0, 811.0, 1.2330456226880395, 0.22276703144266335, 0.8501271578298396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92254c38-5411-4164-ac7c-ba0e1eebea16", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.7208486173814899, 1.346906743792325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 16, 0, 0.0, 306.0625, 159, 1177, 164.0, 1011.8000000000002, 1177.0, 1177.0, 0.07271041713057427, 10.971968217026962, 0.1612019770416858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61fb5645-2481-42aa-a2f1-41b6b1992ad8", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.009296438547486, 3.85169343575419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 276.61538461538464, 159, 1181, 162.0, 836.9999999999997, 1181.0, 1181.0, 0.07776282338866457, 7.267505981755645, 0.17335992410647524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc4f80dc-ee3a-4b4f-897e-de490a99b761", 3, 0, 0.0, 611.3333333333333, 173, 1479, 182.0, 1479.0, 1479.0, 1479.0, 0.025699453458289785, 0.021424576922747445, 0.016480443786728805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae9674b7-374d-4acf-9322-3fc8e02b1fdb", 3, 0, 0.0, 344.66666666666663, 165, 681, 188.0, 681.0, 681.0, 681.0, 0.0288176133252644, 0.024024058504557987, 0.018480045003506144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6df7ecfc-7c5e-447a-9edf-17b1d8aee9a5", 3, 0, 0.0, 481.0, 161, 702, 580.0, 702.0, 702.0, 702.0, 0.040203159968373516, 0.03271741533884564, 0.025781323287010362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0e203f3-385e-44f1-9e25-a2edb3c68264", 3, 0, 0.0, 396.3333333333333, 296, 454, 439.0, 454.0, 454.0, 454.0, 0.07701589094549842, 0.03479754447667702, 0.049388445690960896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 85.5, 81, 97, 83.0, 94.9, 97.0, 97.0, 0.0735181497932302, 0.06095401286567621, 0.0261334048093123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66eddf95-695f-48b5-abad-ee4f4b46283d", 3, 0, 0.0, 821.6666666666666, 194, 1883, 388.0, 1883.0, 1883.0, 1883.0, 0.02402383164098786, 0.024094213960248564, 0.015405907660399116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7698f592-631f-4d49-b9eb-69ffca28aaed", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 92.95, 80, 215, 83.0, 111.80000000000003, 209.89999999999992, 215.0, 0.09851828499369483, 0.07648636383787831, 0.03502017161885246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 100.47058823529413, 79, 246, 80.0, 244.4, 246.0, 246.0, 0.10460315409275223, 0.07773730494588325, 0.05250588008171352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 119.29411764705881, 78, 240, 81.0, 239.2, 240.0, 240.0, 0.10459221341733524, 0.04646807091967318, 0.05861682181178324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 219.0, 78, 1018, 81.0, 889.9999999999999, 1018.0, 1018.0, 0.10459671812415015, 11.097382524810957, 0.06043392640697968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 174.11764705882354, 78, 626, 81.0, 499.5999999999999, 626.0, 626.0, 0.10457934496419695, 3.642494740274121, 0.06052601680344004], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 42.857142857142854, 0.45941807044410415], "isController": false}, {"data": ["401/Unauthorized", 8, 57.142857142857146, 0.6125574272588055], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1306, 14, "401/Unauthorized", 8, "406/Not Acceptable", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
