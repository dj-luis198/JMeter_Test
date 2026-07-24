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

    var data = {"OkPercent": 97.21595184349135, "KoPercent": 2.784048156508653};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7072072072072072, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.3125, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.3125, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b85651f1-382a-4194-9196-2bd99df38109"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/923a30e9-22c8-40d2-932a-b00d70d0d533"], "isController": false}, {"data": [0.65625, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d75795a8-bf21-413d-80d5-ae357fbf06cb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d4fce593-ab54-44a0-ab44-3f9c3877fbfb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f831adba-f6fd-428c-8785-13df746449cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5277777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f400e670-344f-413c-8787-66d079aa517a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9cf9f20c-2990-47a6-92e6-cac044f26c62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/06c69e78-5b97-48fe-b409-eac235bc8069"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b3393f4-13c3-4e2e-8286-3199d6623920"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/11c0a77c-0c4c-4805-97d1-5f4403a5410b"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0cf224c3-1b34-42ab-bdca-bcfd9c7b7883"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0f07a0a8-1879-4344-8528-f59aff07c5c4"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb3961ee-805d-4339-b4af-7756af888f81"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.10714285714285714, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a29f3b96-1b7f-4c28-b0db-149c59e2ade5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cfb36425-9afa-442e-bb00-5e5887f9c337"], "isController": false}, {"data": [0.16, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d75795a8-bf21-413d-80d5-ae357fbf06cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4fce593-ab54-44a0-ab44-3f9c3877fbfb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b85651f1-382a-4194-9196-2bd99df38109"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.20535714285714285, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.16, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.25833333333333336, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f400e670-344f-413c-8787-66d079aa517a"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.33035714285714285, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9005681818181818, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cfb36425-9afa-442e-bb00-5e5887f9c337"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11c0a77c-0c4c-4805-97d1-5f4403a5410b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e149334c-07dd-4f9d-84bc-601f8e4cc04b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cb3961ee-805d-4339-b4af-7756af888f81"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0cf224c3-1b34-42ab-bdca-bcfd9c7b7883"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f07a0a8-1879-4344-8528-f59aff07c5c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a29f3b96-1b7f-4c28-b0db-149c59e2ade5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5b3393f4-13c3-4e2e-8286-3199d6623920"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1329, 37, 2.784048156508653, 495.8848758465017, 140, 3921, 163.0, 1403.0, 1718.5, 2199.000000000001, 5.247675268010503, 711.9593093238534, 3.835780790359519], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2452.053571428572, 1796, 3114, 2498.0, 2918.2000000000003, 2953.9, 3114.0, 0.24777116563059973, 298.15187010541337, 1.2182888856934275], "isController": true}, {"data": ["deleteBook", 16, 4, 25.0, 801.8125, 149, 1859, 650.5, 1714.8000000000002, 1859.0, 1859.0, 0.08130824973828907, 0.017012004400809015, 0.05429151929546401], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 801.8125, 149, 1859, 650.5, 1714.8000000000002, 1859.0, 1859.0, 0.08320203012953516, 0.017408237260989168, 0.05555604306745085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b85651f1-382a-4194-9196-2bd99df38109", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.3141983695652174, 1.1990489130434783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 218.0555555555556, 141, 587, 148.0, 452.0000000000002, 587.0, 587.0, 0.1276867418599702, 0.044820595694119315, 0.0722255843441867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 184.44444444444446, 145, 480, 149.5, 453.90000000000003, 480.0, 480.0, 0.12768493034077688, 0.09489085155208125, 0.06409184979996027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 252.38888888888889, 142, 872, 147.5, 493.1000000000006, 872.0, 872.0, 0.12769127088284327, 2.1183643767956584, 0.07458356240910864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 269.2777777777778, 142, 1733, 150.5, 572.0000000000018, 1733.0, 1733.0, 0.12768402460045541, 6.4152978872727395, 0.07445463847687145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/923a30e9-22c8-40d2-932a-b00d70d0d533", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.5340065844481605, 0.9977921195652174], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 310.8125, 144, 539, 284.0, 532.7, 539.0, 539.0, 0.08179540923265682, 0.14351639582587802, 0.05285948443331118], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d75795a8-bf21-413d-80d5-ae357fbf06cb", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 0.5717217167721519, 2.181813686708861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4fce593-ab54-44a0-ab44-3f9c3877fbfb", 3, 0, 0.0, 591.3333333333334, 519, 725, 530.0, 725.0, 725.0, 725.0, 0.11051759071652238, 0.05000633173696813, 0.07087228310922822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 183.4375, 142, 433, 148.0, 427.4, 433.0, 433.0, 0.08573296325270861, 0.06371365726104615, 0.043033928820207255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 180.93750000000003, 140, 439, 144.0, 429.90000000000003, 439.0, 439.0, 0.08573434142629793, 0.03098869445352395, 0.04844534502714028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1006.0, 757, 1140, 1076.5, 1140.0, 1140.0, 1140.0, 0.039721946375372394, 11.679571127110227, 0.022653922542204566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1364.6666666666665, 999, 1708, 1377.5, 1708.0, 1708.0, 1708.0, 0.03961389655491146, 35.644653753911875, 0.02255361493311854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f831adba-f6fd-428c-8785-13df746449cc", 2, 0, 0.0, 433.0, 419, 447, 433.0, 447.0, 447.0, 447.0, 0.022411976960487683, 0.0319436331775701, 0.013930882163428136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 242.66666666666666, 145, 433, 150.0, 433.0, 433.0, 433.0, 0.03987903359808581, 0.07056719617161276, 0.02208145708019009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 168.64285714285717, 141, 427, 148.0, 296.5, 427.0, 427.0, 0.0683607101701205, 0.050803223085411825, 0.03431387209711127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 166.2142857142857, 141, 437, 146.0, 293.5, 437.0, 437.0, 0.06836237920611746, 0.018292277248511898, 0.03898791939098886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 270.7857142857142, 142, 444, 151.5, 443.5, 444.0, 444.0, 0.06836137777473948, 0.018425527603347754, 0.04018901310585271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 267.14285714285717, 143, 437, 148.5, 436.5, 437.0, 437.0, 0.06836237920611746, 0.018425797520398846, 0.04025636197391487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 147.16666666666666, 146, 149, 147.0, 149.0, 149.0, 149.0, 0.0399549840513022, 0.029693108264688448, 0.022435659989744887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 951.9444444444445, 143, 1819, 1334.0, 1758.7, 1819.0, 1819.0, 0.08465369583927085, 42.32766543036998, 0.04572548805207143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 286.62499999999994, 141, 1836, 147.0, 853.900000000001, 1836.0, 1836.0, 0.08560269648493928, 4.835721612340164, 0.04986524263014285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 724.8333333333334, 142, 1483, 813.5, 1285.9000000000003, 1483.0, 1483.0, 0.084652103369624, 13.838212341571237, 0.045807295953159174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 263.75, 144, 1134, 149.5, 644.7000000000005, 1134.0, 1134.0, 0.08560315447624245, 1.5947662866689138, 0.0499491062495653], "isController": false}, {"data": ["deleteBooks", 15, 4, 26.666666666666668, 485.4666666666667, 149, 1289, 510.0, 977.6000000000001, 1289.0, 1289.0, 0.08973868096104144, 0.018946780101344884, 0.06016464430578157], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f400e670-344f-413c-8787-66d079aa517a", 1, 0, 0.0, 1289.0, 1289, 1289, 1289.0, 1289.0, 1289.0, 1289.0, 0.7757951900698216, 0.14015831070597362, 0.5348744181536075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9cf9f20c-2990-47a6-92e6-cac044f26c62", 1, 0, 0.0, 740.0, 740, 740, 740.0, 740.0, 740.0, 740.0, 1.3513513513513513, 0.43153505067567566, 0.8063239020270271], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06c69e78-5b97-48fe-b409-eac235bc8069", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 0.9046343838526912, 1.6903107294617565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 462.64285714285717, 291, 871, 449.5, 733.0, 871.0, 871.0, 0.06831167690528586, 0.10586975707879752, 0.15363456241491535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b3393f4-13c3-4e2e-8286-3199d6623920", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 689.0909090909091, 190, 1779, 585.5, 1340.1, 1718.249999999999, 1779.0, 0.09340279104521969, 0.05737339410883124, 0.042231926029235076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 161.88888888888889, 143, 437, 145.0, 180.5000000000004, 437.0, 437.0, 0.08465170526157377, 0.06291010517974378, 0.0424911879926259], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11c0a77c-0c4c-4805-97d1-5f4403a5410b", 3, 0, 0.0, 389.3333333333333, 288, 536, 344.0, 536.0, 536.0, 536.0, 0.04585403133358808, 0.02947972392051968, 0.02940509170806267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 251.22222222222229, 141, 587, 148.5, 459.2000000000002, 587.0, 587.0, 0.08465170526157377, 0.09328588526872214, 0.04432824756861491], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0cf224c3-1b34-42ab-bdca-bcfd9c7b7883", 3, 0, 0.0, 503.33333333333337, 277, 883, 350.0, 883.0, 883.0, 883.0, 0.016694212116659154, 0.023014319112646977, 0.010705598264914887], "isController": false}, {"data": ["login", 22, 0, 0.0, 3313.5454545454545, 1477, 5561, 3494.5, 4746.1, 5441.5999999999985, 5561.0, 0.09186647625251589, 30.099197851681573, 0.18015257403602836], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 193.3125, 148, 453, 153.5, 442.5, 453.0, 453.0, 0.08382493163029014, 0.06786217609522513, 0.0297971436654547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f07a0a8-1879-4344-8528-f59aff07c5c4", 3, 0, 0.0, 506.3333333333333, 255, 761, 503.0, 761.0, 761.0, 761.0, 0.03157562361856647, 0.026323298205452057, 0.020248690927270812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1144.9999999999998, 287, 1970, 1563.5, 1905.2, 1970.0, 1970.0, 0.08459322408275097, 56.282104303445294, 0.1782277161474366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb3961ee-805d-4339-b4af-7756af888f81", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 542.7222222222223, 292, 1881, 308.5, 1123.2000000000012, 1881.0, 1881.0, 0.12754830892200422, 8.66403304874117, 0.2850461122566839], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, 57.142857142857146, 740.7142857142858, 144, 1854, 149.5, 1721.0, 1854.0, 1854.0, 0.09234280286790363, 47.3601604291302, 0.12420158516314994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a29f3b96-1b7f-4c28-b0db-149c59e2ade5", 3, 0, 0.0, 385.3333333333333, 291, 505, 360.0, 505.0, 505.0, 505.0, 0.018541294553185702, 0.025560671364824695, 0.011890087978442656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cfb36425-9afa-442e-bb00-5e5887f9c337", 3, 0, 0.0, 487.6666666666667, 431, 539, 493.0, 539.0, 539.0, 539.0, 0.02731469257313509, 0.027394716086532947, 0.017516257932641967], "isController": false}, {"data": ["register", 25, 8, 32.0, 1213.6399999999999, 282, 2032, 1285.0, 1984.6000000000001, 2023.0, 2032.0, 0.10248337719621878, 0.032074094456879094, 0.046237617445950265], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 151.81250000000003, 146, 166, 151.0, 159.0, 166.0, 166.0, 0.08300994044036773, 0.06444619399423081, 0.02950743976591197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 509.9999999999999, 287, 2261, 300.5, 1285.200000000001, 2261.0, 2261.0, 0.08553405324494814, 6.519805017440928, 0.19100029736448199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 496.37500000000006, 291, 901, 440.0, 874.4, 901.0, 901.0, 0.15819499510584234, 0.245171344954074, 0.3557842516882372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d75795a8-bf21-413d-80d5-ae357fbf06cb", 3, 0, 0.0, 444.6666666666667, 298, 535, 501.0, 535.0, 535.0, 535.0, 0.08053258885428971, 0.03643889925373134, 0.051643619805648015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4fce593-ab54-44a0-ab44-3f9c3877fbfb", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 0.5610685170807453, 2.1411587732919255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b85651f1-382a-4194-9196-2bd99df38109", 3, 0, 0.0, 481.33333333333337, 255, 889, 300.0, 889.0, 889.0, 889.0, 0.031127758697614576, 0.031218953303173997, 0.01996148588356143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 212.11111111111114, 143, 434, 149.0, 434.0, 434.0, 434.0, 0.05688246187294986, 0.04227300145050278, 0.028552329494820537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 176.11111111111111, 142, 426, 145.0, 426.0, 426.0, 426.0, 0.05688030487843415, 0.015219925328799762, 0.03243954887598197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 241.44444444444446, 143, 437, 148.0, 437.0, 437.0, 437.0, 0.05678090142835512, 0.015304227338111341, 0.033380959628779086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 209.66666666666666, 142, 446, 145.0, 446.0, 446.0, 446.0, 0.0568813833552432, 0.015331310357467895, 0.033495580237511376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 157.75, 149, 165, 158.5, 165.0, 165.0, 165.0, 0.11966732483695326, 0.03529251181714833, 0.07397403966971818], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1689.0357142857147, 1133, 2481, 1605.0, 2236.2000000000003, 2318.2, 2481.0, 0.24948099043953204, 298.4659981912628, 0.4926275026061853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 1213.6399999999999, 282, 2032, 1285.0, 1984.6000000000001, 2023.0, 2032.0, 0.10177246932577774, 0.031851602509302, 0.04591687580909113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 212.0, 145, 433, 152.0, 433.0, 433.0, 433.0, 0.04849712789231482, 0.01307149150222548, 0.028558367303775232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 179.33333333333334, 142, 436, 149.0, 436.0, 436.0, 436.0, 0.048569100338364736, 0.01309089032557487, 0.028553318753608954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 263.375, 140, 1452, 146.0, 745.0000000000007, 1452.0, 1452.0, 0.08357840960733817, 4.721369048629575, 0.04868605598708713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 297.3125, 143, 1121, 148.0, 652.0000000000005, 1121.0, 1121.0, 0.08357753644764129, 1.5570295074410125, 0.04876716604244694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 147.12500000000003, 142, 153, 147.0, 152.3, 153.0, 153.0, 0.08357709987463435, 0.06211149707480151, 0.04195178646050982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 209.44444444444446, 144, 437, 147.0, 437.0, 437.0, 437.0, 0.04857014878655578, 0.012996309343277621, 0.027700162979832594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 162.56250000000003, 141, 432, 144.0, 235.30000000000018, 432.0, 432.0, 0.08357840960733817, 0.030209432476480513, 0.04722710669828716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 181.55555555555554, 143, 454, 147.0, 454.0, 454.0, 454.0, 0.048569100338364736, 0.03609480991942926, 0.024379411693280735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 188.55555555555554, 146, 463, 153.0, 463.0, 463.0, 463.0, 0.04763215276160637, 0.03749171399009251, 0.016931741801977263], "isController": false}, {"data": ["deleteAccount", 15, 4, 26.666666666666668, 563.3333333333333, 145, 1657, 505.0, 1196.2000000000003, 1657.0, 1657.0, 0.08698274262386342, 0.017730661924174242, 0.05918337520585915], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1778.2727272727273, 930, 3921, 1517.0, 3054.6999999999994, 3819.8999999999987, 3921.0, 0.09163344954120797, 0.04742746900082054, 0.04214780735733297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 427.1111111111111, 295, 892, 302.0, 892.0, 892.0, 892.0, 0.04845769912076197, 0.07509996924282153, 0.1089825010499168], "isController": false}, {"data": ["addBook", 60, 13, 21.666666666666668, 1427.0166666666667, 738, 3330, 1141.0, 2490.6, 2636.1499999999996, 3330.0, 0.2977534502181044, 78.31506498313972, 1.0853268340371895], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f400e670-344f-413c-8787-66d079aa517a", 3, 0, 0.0, 1124.3333333333333, 254, 2483, 636.0, 2483.0, 2483.0, 2483.0, 0.028076743097800658, 0.028158999181094994, 0.01800494267664951], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 275.1071428571429, 143, 602, 152.0, 590.6, 598.15, 602.0, 0.2509623959738461, 0.18650623372665714, 0.12131483008501352], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 942.7857142857144, 702, 1340, 866.5, 1222.5000000000002, 1294.1, 1340.0, 0.2508915610831347, 73.7704493423057, 0.1261808144119281], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 206.30357142857136, 141, 451, 150.5, 437.0, 442.6, 451.0, 0.25151583202335503, 0.44506512463507747, 0.12231922299573321], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1412.3571428571431, 986, 1956, 1378.0, 1749.8000000000002, 1845.0, 1956.0, 0.2501965830295232, 225.12732520864606, 0.12558695671599113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 153.5625, 143, 169, 152.5, 165.5, 169.0, 169.0, 0.14942378453090271, 0.11163007340443415, 0.05311548590746932], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 13, 7.386363636363637, 229.30113636363637, 143, 2739, 154.0, 341.90000000000003, 479.85000000000025, 1583.2299999999846, 0.7435855186720239, 1.5581323262713833, 0.35777296401215086], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 181.0, 146, 428, 148.0, 428.0, 428.0, 428.0, 0.057247174215872734, 0.044333016751159256, 0.020349581459548512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 153.66666666666669, 144, 169, 152.5, 162.70000000000002, 169.0, 169.0, 0.12871853546910755, 0.10445810837385583, 0.045755416905034325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cfb36425-9afa-442e-bb00-5e5887f9c337", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 487.8888888888889, 292, 872, 298.0, 872.0, 872.0, 872.0, 0.05672936311835006, 0.08791943287970853, 0.12758566724761736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11c0a77c-0c4c-4805-97d1-5f4403a5410b", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e149334c-07dd-4f9d-84bc-601f8e4cc04b", 1, 0, 0.0, 744.0, 744, 744, 744.0, 744.0, 744.0, 744.0, 1.3440860215053765, 0.4292149697580645, 0.8019888272849462], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb3961ee-805d-4339-b4af-7756af888f81", 3, 0, 0.0, 440.3333333333333, 266, 533, 522.0, 533.0, 533.0, 533.0, 0.02902280224829975, 0.029296780524732263, 0.018611627743864094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 484.9375, 288, 1599, 301.0, 897.6000000000007, 1599.0, 1599.0, 0.08351340912175212, 6.365782085134091, 0.1864881339189711], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0cf224c3-1b34-42ab-bdca-bcfd9c7b7883", 1, 0, 0.0, 672.0, 672, 672, 672.0, 672.0, 672.0, 672.0, 1.488095238095238, 0.26884533110119047, 1.025971912202381], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f07a0a8-1879-4344-8528-f59aff07c5c4", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 0.2956858633387889, 1.1284011865793782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 152.71428571428575, 147, 163, 152.5, 160.5, 163.0, 163.0, 0.07198498598863665, 0.059682864359719257, 0.025588412988148186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 157.33333333333334, 145, 249, 152.0, 168.90000000000012, 249.0, 249.0, 0.08378523052575232, 0.06504810377731747, 0.029783031163451018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a29f3b96-1b7f-4c28-b0db-149c59e2ade5", 1, 0, 0.0, 770.0, 770, 770, 770.0, 770.0, 770.0, 770.0, 1.2987012987012987, 0.2346286525974026, 0.8953936688311688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 186.6875, 142, 451, 151.0, 434.90000000000003, 451.0, 451.0, 0.15843152787404693, 0.11774061788295871, 0.07952520051490247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b3393f4-13c3-4e2e-8286-3199d6623920", 3, 0, 0.0, 768.6666666666667, 270, 1657, 379.0, 1657.0, 1657.0, 1657.0, 0.038444287819568136, 0.03204942093291472, 0.024653400717626707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 216.625, 141, 450, 145.5, 440.2, 450.0, 450.0, 0.15844407914281752, 0.04239616961438672, 0.09036263888613813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 200.1875, 142, 446, 146.5, 437.6, 446.0, 446.0, 0.15843466550481244, 0.04270309343684398, 0.09314225452529014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 289.1875, 142, 587, 147.0, 585.6, 587.0, 587.0, 0.1584393721839877, 0.04270436203396544, 0.09329974748725058], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 21.62162162162162, 0.6019563581640331], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.81081081081081, 0.3009781790820166], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.81081081081081, 0.3009781790820166], "isController": false}, {"data": ["401/Unauthorized", 21, 56.75675675675676, 1.580135440180587], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1329, 37, "401/Unauthorized", 21, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
