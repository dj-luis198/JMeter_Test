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

    var data = {"OkPercent": 99.08883826879271, "KoPercent": 0.9111617312072893};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8220338983050848, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3793103448275862, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5874d446-bc20-47e2-a491-a48705795f24"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/44aabe48-ce9d-4dcd-bd95-908c8b2bed6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d6955b77-16d8-481b-9075-5caa35047c8c"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/945c666d-cdd3-4cd2-bd48-b14217cd87e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49639cf4-44e2-4e33-8204-d365c855e769"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f8c6e4d5-c590-4e38-bcb3-985a818ba937"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c866d4a8-80e2-44ec-8fe7-288bafc89e5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f416600e-c464-4956-bb23-9d3b620e8982"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=312e4a4d-8ad0-416b-ab1d-ad821f36ea0a"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=efb556af-e027-4bfe-8dad-62a2db1059eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d9bcaa14-480d-42f8-945b-5502a7b32541"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f26419f5-566a-44af-86a4-ac853dcaa1bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dda9e68a-19e2-4e33-b8c3-a65bbe1ccbe8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=945c666d-cdd3-4cd2-bd48-b14217cd87e0"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d6955b77-16d8-481b-9075-5caa35047c8c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3209091e-b971-4954-9613-2bc2646ce80c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5d1606c-8527-45c6-8c22-514a4e7f233b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e41c4c82-0b39-4e6e-a4e2-ac59bad31c89"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/71370cd2-6371-4ffd-8302-ae68c5007920"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44aabe48-ce9d-4dcd-bd95-908c8b2bed6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ed7bec6-461e-46fa-af27-c057d40bc5bb"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d974f55c-2788-4b33-a2c5-df32232376f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c866d4a8-80e2-44ec-8fe7-288bafc89e5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f416600e-c464-4956-bb23-9d3b620e8982"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5874d446-bc20-47e2-a491-a48705795f24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3793103448275862, 500, 1500, "addBook"], "isController": true}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7586206896551724, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f8c6e4d5-c590-4e38-bcb3-985a818ba937"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9482758620689655, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3209091e-b971-4954-9613-2bc2646ce80c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/efb556af-e027-4bfe-8dad-62a2db1059eb"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/312e4a4d-8ad0-416b-ab1d-ad821f36ea0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dda9e68a-19e2-4e33-b8c3-a65bbe1ccbe8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5d1606c-8527-45c6-8c22-514a4e7f233b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/49639cf4-44e2-4e33-8204-d365c855e769"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ed7bec6-461e-46fa-af27-c057d40bc5bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1317, 12, 0.9111617312072893, 305.7722095671978, 78, 2343, 100.0, 853.0, 1026.7999999999993, 1445.82, 5.150264943394013, 751.914183178783, 3.748256267964335], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1365.8103448275865, 994, 1987, 1352.5, 1640.2, 1734.2999999999997, 1987.0, 0.2583139226750633, 310.8384393594149, 1.2701275397157656], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5874d446-bc20-47e2-a491-a48705795f24", 3, 0, 0.0, 331.0, 193, 509, 291.0, 509.0, 509.0, 509.0, 0.028840330317916576, 0.02404299672662251, 0.0184946128666327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44aabe48-ce9d-4dcd-bd95-908c8b2bed6b", 3, 0, 0.0, 921.6666666666667, 170, 2204, 391.0, 2204.0, 2204.0, 2204.0, 0.04442075337597726, 0.028558264296079126, 0.028485964892797914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d6955b77-16d8-481b-9075-5caa35047c8c", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 619.5714285714286, 404, 1126, 520.0, 1058.5, 1126.0, 1126.0, 0.07468937223582635, 0.013493685413699098, 0.05076543269153822], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 619.5714285714286, 404, 1126, 520.0, 1058.5, 1126.0, 1126.0, 0.07509359880708455, 0.013566714628233048, 0.05104018043919028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 110.88235294117646, 78, 261, 81.0, 261.0, 261.0, 261.0, 0.08742202726538756, 0.03111597431849387, 0.04942598761178449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 110.11764705882354, 79, 240, 81.0, 238.4, 240.0, 240.0, 0.0874211281439466, 0.06496824073978844, 0.043881308462879444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 147.64705882352942, 79, 589, 81.0, 308.19999999999976, 589.0, 589.0, 0.08742157770235523, 1.5342265922297644, 0.05103776965699887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 184.05882352941177, 78, 856, 81.0, 379.1999999999996, 856.0, 856.0, 0.08742292640532354, 4.649430248396818, 0.05095318309446305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/945c666d-cdd3-4cd2-bd48-b14217cd87e0", 3, 0, 0.0, 430.66666666666663, 162, 789, 341.0, 789.0, 789.0, 789.0, 0.026851644663235624, 0.026930311590959946, 0.017219316401879615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49639cf4-44e2-4e33-8204-d365c855e769", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 217.64285714285714, 162, 327, 196.5, 317.5, 327.0, 327.0, 0.07445976779189559, 0.14393339041915532, 0.04813707644358875], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f8c6e4d5-c590-4e38-bcb3-985a818ba937", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 94.18750000000001, 78, 259, 81.0, 151.9000000000001, 259.0, 259.0, 0.07731634950855795, 0.057458732398449806, 0.038809183249412876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 101.1875, 78, 259, 79.0, 242.20000000000002, 259.0, 259.0, 0.07731634950855795, 0.035203855428090965, 0.04328280991775473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 544.3333333333334, 403, 620, 610.0, 620.0, 620.0, 620.0, 0.12276968407267966, 36.098363454534294, 0.07001708544770012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 883.3333333333334, 698, 1021, 931.0, 1021.0, 1021.0, 1021.0, 0.1212268153715602, 109.08010156534125, 0.06901878257970663], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 132.0, 79, 237, 80.0, 237.0, 237.0, 237.0, 0.12472456658213114, 0.22070401820978672, 0.069061356691473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c866d4a8-80e2-44ec-8fe7-288bafc89e5a", 3, 0, 0.0, 373.3333333333333, 280, 513, 327.0, 513.0, 513.0, 513.0, 0.037930990883918526, 0.024385972329342153, 0.024324235690533692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 93.25, 79, 235, 84.5, 132.1000000000001, 235.0, 235.0, 0.09761394903331685, 0.07254317892026771, 0.048997626760864124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 111.1875, 78, 240, 83.0, 239.3, 240.0, 240.0, 0.09761216247544444, 0.05360804675012507, 0.054132330825920914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 289.125, 79, 1199, 85.0, 1133.9, 1199.0, 1199.0, 0.09752054026379306, 16.474322717943167, 0.05576003547309652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 198.375, 79, 629, 86.5, 569.5000000000001, 629.0, 629.0, 0.09761097147319359, 5.402788718764489, 0.05590706520412894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 82.66666666666667, 78, 88, 82.0, 88.0, 88.0, 88.0, 0.12553877055697368, 0.09329590272837596, 0.07049296198267566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 685.1538461538461, 81, 995, 771.0, 973.4, 995.0, 995.0, 0.1001224574672099, 69.30650697295152, 0.05224238202878905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 194.0, 78, 1083, 80.5, 710.6000000000004, 1083.0, 1083.0, 0.07731448148559776, 8.714197128371032, 0.04462193218553542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 481.76923076923083, 81, 706, 619.0, 676.8, 706.0, 706.0, 0.10025526532941566, 22.681910286961415, 0.05240958469256337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 170.6875, 78, 631, 86.0, 516.2000000000002, 631.0, 631.0, 0.07731448148559776, 2.859861915128028, 0.044697434608861206], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 470.0714285714286, 184, 1186, 406.5, 993.0, 1186.0, 1186.0, 0.07513631874973166, 0.013574432586621442, 0.051802969762998585], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f416600e-c464-4956-bb23-9d3b620e8982", 3, 0, 0.0, 406.0, 235, 543, 440.0, 543.0, 543.0, 543.0, 0.028831183808407174, 0.024035371657985277, 0.018488747429219445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 413.0625, 161, 1278, 244.0, 1219.2, 1278.0, 1278.0, 0.09747123075704688, 21.987014576137213, 0.21453903342044822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=312e4a4d-8ad0-416b-ab1d-ad821f36ea0a", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 0.9818699048913043, 3.7470278532608696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 559.6818181818181, 102, 1237, 521.0, 1055.3999999999999, 1221.0999999999997, 1237.0, 0.1051097680418528, 0.0645644961897709, 0.04752521738611118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 98.38461538461539, 80, 262, 82.0, 199.99999999999994, 262.0, 262.0, 0.10025913129318854, 0.07450898331456689, 0.05032538426240129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 167.92307692307693, 80, 259, 235.0, 251.4, 259.0, 259.0, 0.1001224574672099, 0.14246691626681865, 0.05063284132130837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=efb556af-e027-4bfe-8dad-62a2db1059eb", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 0.6642061121323529, 2.5347541360294117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9bcaa14-480d-42f8-945b-5502a7b32541", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 1.1049686418685123, 2.064635596885813], "isController": false}, {"data": ["login", 22, 0, 0.0, 2340.1363636363635, 1770, 3765, 2143.0, 3159.4, 3680.9999999999986, 3765.0, 0.1040272740598535, 17.11726588987058, 0.180477715702917], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f26419f5-566a-44af-86a4-ac853dcaa1bb", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 1.6047032035175879, 2.998390389447236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 91.375, 81, 112, 90.0, 109.2, 112.0, 112.0, 0.08011135478314857, 0.06485577452659196, 0.028477083145572343], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dda9e68a-19e2-4e33-b8c3-a65bbe1ccbe8", 3, 0, 0.0, 318.3333333333333, 182, 498, 275.0, 498.0, 498.0, 498.0, 0.09704341075240991, 0.04390961619331047, 0.06223161431713786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=945c666d-cdd3-4cd2-bd48-b14217cd87e0", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 0.5117962110481586, 1.953125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 784.923076923077, 169, 1084, 858.0, 1060.0, 1084.0, 1084.0, 0.10005926587286315, 92.11706916067594, 0.20534247929542881], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6955b77-16d8-481b-9075-5caa35047c8c", 3, 0, 0.0, 247.66666666666669, 165, 391, 187.0, 391.0, 391.0, 391.0, 0.027278430944652064, 0.027535942174272802, 0.017493004219063985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3209091e-b971-4954-9613-2bc2646ce80c", 3, 0, 0.0, 310.6666666666667, 259, 396, 277.0, 396.0, 396.0, 396.0, 0.024729418941086278, 0.029229335994493583, 0.015858383891256503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5d1606c-8527-45c6-8c22-514a4e7f233b", 3, 0, 0.0, 326.0, 173, 425, 380.0, 425.0, 425.0, 425.0, 0.028109364166182562, 0.028191715819013176, 0.018025861786256394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e41c4c82-0b39-4e6e-a4e2-ac59bad31c89", 1, 0, 0.0, 359.0, 359, 359, 359.0, 359.0, 359.0, 359.0, 2.785515320334262, 0.8895151462395543, 1.6620604108635098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 326.47058823529414, 161, 1096, 322.0, 616.7999999999996, 1096.0, 1096.0, 0.08738472926154764, 6.277022603088279, 0.19521511582331835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 966.6666666666666, 780, 1100, 1020.0, 1100.0, 1100.0, 1100.0, 0.12082645293809659, 144.55044378549277, 0.2724494920254541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71370cd2-6371-4ffd-8302-ae68c5007920", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44aabe48-ce9d-4dcd-bd95-908c8b2bed6b", 1, 0, 0.0, 1186.0, 1186, 1186, 1186.0, 1186.0, 1186.0, 1186.0, 0.8431703204047217, 0.15233057546374368, 0.5813264123102867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ed7bec6-461e-46fa-af27-c057d40bc5bb", 3, 0, 0.0, 283.6666666666667, 187, 383, 281.0, 383.0, 383.0, 383.0, 0.030558611416697228, 0.030876930285621156, 0.019596505368129406], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 978.391304347826, 105, 1860, 926.0, 1590.0000000000005, 1825.1999999999996, 1860.0, 0.0951022349025202, 0.03025246025346813, 0.042907453637660485], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d974f55c-2788-4b33-a2c5-df32232376f2", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 0.9072043678977273, 1.6951127485795456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c866d4a8-80e2-44ec-8fe7-288bafc89e5a", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 96.46666666666665, 84, 124, 92.0, 123.4, 124.0, 124.0, 0.07901349023656638, 0.06134348118952176, 0.028086826607529456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 321.1875, 161, 1162, 182.5, 791.0000000000003, 1162.0, 1162.0, 0.07728385878306904, 11.662098440918905, 0.17134148476783445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f416600e-c464-4956-bb23-9d3b620e8982", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 299.57894736842104, 161, 1252, 172.0, 932.0, 1252.0, 1252.0, 0.11649009221110457, 14.831285512234524, 0.2588515705470129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 101.7, 80, 261, 84.0, 243.80000000000007, 261.0, 261.0, 0.05074467815187882, 0.03771162116560526, 0.025471449775454798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 81.7, 79, 88, 81.0, 87.7, 88.0, 88.0, 0.050745193161577766, 0.013578303638937802, 0.028940617974962324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 98.4, 79, 255, 80.5, 238.40000000000006, 255.0, 255.0, 0.05070196875744685, 0.013665765016655597, 0.029807212101545903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 95.9, 78, 238, 80.5, 222.40000000000006, 238.0, 238.0, 0.05070659642112842, 0.013667012316632272, 0.02985945082220746], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 952.9482758620688, 624, 1618, 930.5, 1295.8, 1373.7499999999998, 1618.0, 0.2504036679820055, 299.5698413066754, 0.49444943033165534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 978.391304347826, 105, 1860, 926.0, 1590.0000000000005, 1825.1999999999996, 1860.0, 0.09609198091529701, 0.030567303032328682, 0.04335399920201877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 98.10000000000002, 79, 239, 80.5, 224.20000000000005, 239.0, 239.0, 0.045924435933115654, 0.012378070622597577, 0.02704339342545775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 99.6, 78, 257, 82.0, 240.20000000000005, 257.0, 257.0, 0.04588713600029368, 0.012368017125079156, 0.026976617062672653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 158.6, 78, 759, 81.0, 456.6000000000002, 759.0, 759.0, 0.07764859352514263, 4.677422870681444, 0.045204018444129246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 140.26666666666668, 78, 466, 83.0, 340.00000000000006, 466.0, 466.0, 0.07764939744067585, 1.5416337465575434, 0.04528031594245662], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5874d446-bc20-47e2-a491-a48705795f24", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 95.89999999999999, 78, 238, 80.0, 222.60000000000005, 238.0, 238.0, 0.045924435933115654, 0.012288374458665713, 0.02619127986810502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 94.60000000000002, 78, 239, 83.0, 155.00000000000006, 239.0, 239.0, 0.07764577995185962, 0.05770355326500504, 0.03897454188989828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 84.29999999999998, 79, 94, 83.5, 93.4, 94.0, 94.0, 0.04592295964290306, 0.03412829325024339, 0.023051173102004077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 91.93333333333334, 78, 235, 80.0, 148.00000000000006, 235.0, 235.0, 0.07764939744067585, 0.028552330517248523, 0.043849666237006674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 124.3, 81, 275, 92.0, 272.8, 275.0, 275.0, 0.046120355680183, 0.036301764334206545, 0.01639434518319005], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 502.2857142857143, 369, 1048, 424.0, 918.5, 1048.0, 1048.0, 0.07426740509686593, 0.013417451116133001, 0.05055115366456596], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1308.9545454545453, 804, 2343, 1208.0, 1894.9999999999998, 2286.149999999999, 2343.0, 0.10464629552113855, 0.05416263342402679, 0.04813320819380494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 202.20000000000002, 159, 337, 174.0, 336.1, 337.0, 337.0, 0.04586861394222389, 0.07108739289678644, 0.1031595878017008], "isController": false}, {"data": ["addBook", 58, 8, 13.793103448275861, 918.2068965517243, 442, 2728, 726.5, 1532.0000000000002, 1660.1, 2728.0, 0.2758830636338556, 109.22175743754578, 0.9974098058591855], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 152.25862068965512, 80, 608, 88.0, 326.3, 357.04999999999995, 608.0, 0.25151668899961405, 0.18691816438350223, 0.12158277446758688], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 523.7931034482759, 387, 777, 474.5, 679.2, 712.55, 777.0, 0.2515395958018909, 73.96099306639778, 0.1265067303105213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8c6e4d5-c590-4e38-bcb3-985a818ba937", 3, 0, 0.0, 510.0, 174, 1048, 308.0, 1048.0, 1048.0, 1048.0, 0.03678769819372402, 0.0236509452905615, 0.02359106947969932], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 120.89655172413792, 78, 320, 85.5, 244.1, 256.19999999999993, 320.0, 0.25213444852110106, 0.4461597858596046, 0.1226200735971761], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 799.1034482758623, 543, 1354, 779.5, 1006.4, 1030.8999999999996, 1354.0, 0.2511094274272107, 225.94870420229464, 0.12604516181404915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 105.84210526315789, 79, 245, 90.0, 239.0, 245.0, 245.0, 0.12041778634082036, 0.0899605532721949, 0.04280475998833849], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 8, 4.597701149425287, 138.43678160919546, 80, 1541, 90.0, 249.5, 285.25, 661.25, 0.7089193461645019, 1.6091294628306254, 0.3385207649199003], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 119.7, 84, 244, 90.5, 243.8, 244.0, 244.0, 0.048531674197164774, 0.0375836109749528, 0.01725149356227342], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 111.94117647058825, 81, 337, 89.0, 258.5999999999999, 337.0, 337.0, 0.093806042212719, 0.07612580183473583, 0.03334511656780246], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3209091e-b971-4954-9613-2bc2646ce80c", 1, 0, 0.0, 800.0, 800, 800, 800.0, 800.0, 800.0, 800.0, 1.25, 0.225830078125, 0.86181640625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/efb556af-e027-4bfe-8dad-62a2db1059eb", 3, 0, 0.0, 270.6666666666667, 186, 369, 257.0, 369.0, 369.0, 369.0, 0.0727255096846137, 0.033711303968388645, 0.04663712697873991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 202.2, 162, 517, 167.0, 483.10000000000014, 517.0, 517.0, 0.050678843103369633, 0.0785423085986793, 0.11397790592486355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 269.2, 158, 846, 178.0, 635.4000000000001, 846.0, 846.0, 0.07761082826275922, 6.302231683197773, 0.17322474123256343], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/312e4a4d-8ad0-416b-ab1d-ad821f36ea0a", 3, 0, 0.0, 344.3333333333333, 229, 408, 396.0, 408.0, 408.0, 408.0, 0.09257830581700355, 0.04188927248881345, 0.05936824949853418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dda9e68a-19e2-4e33-b8c3-a65bbe1ccbe8", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 0.9033203125, 3.447265625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 89.375, 80, 101, 88.5, 100.3, 101.0, 101.0, 0.10291837929282209, 0.08532978908164644, 0.036584267639245355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5d1606c-8527-45c6-8c22-514a4e7f233b", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 88.07692307692307, 81, 110, 83.0, 109.2, 110.0, 110.0, 0.09519694783939543, 0.07390778665265563, 0.033839540052285094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49639cf4-44e2-4e33-8204-d365c855e769", 3, 0, 0.0, 299.6666666666667, 182, 517, 200.0, 517.0, 517.0, 517.0, 0.02108340595395384, 0.024919872076434375, 0.01352028311500295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ed7bec6-461e-46fa-af27-c057d40bc5bb", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 91.63157894736842, 79, 240, 82.0, 89.0, 240.0, 240.0, 0.11655154645499269, 0.08661692075414985, 0.05850341296666626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 108.10526315789474, 78, 257, 83.0, 241.0, 257.0, 257.0, 0.11655369137809404, 0.0496143951476858, 0.06544163880624483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 196.73684210526315, 79, 1011, 81.0, 843.0, 1011.0, 1011.0, 0.11655369137809404, 11.067604495751926, 0.06746647164371378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 156.89473684210523, 78, 682, 80.0, 620.0, 682.0, 682.0, 0.11654868668032535, 3.635389318619573, 0.06757739177841028], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 33.333333333333336, 0.30372057706909644], "isController": false}, {"data": ["401/Unauthorized", 8, 66.66666666666667, 0.6074411541381929], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1317, 12, "401/Unauthorized", 8, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
