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

    var data = {"OkPercent": 97.65329295987888, "KoPercent": 2.3467070401211205};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7457901554404145, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29729c07-b7b8-411f-9f71-ea5d8f50280b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/60f3661b-c384-44b7-901f-74d4b071a460"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abeb7ddf-40cc-46f7-a5d0-e6b9e0916765"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a821ebbc-b788-4785-88f1-297706d43303"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb579c90-aa26-4d63-ba21-785fec282336"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b8420780-7bdf-4ad2-aa8a-00a4b6649cc1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f10231cd-b94a-4bb5-945d-1290707fcbb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ffa14ff8-826b-4bec-8447-a2aac525099b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/28c4ca81-f297-4e5b-8580-aca3e09e5737"], "isController": false}, {"data": [0.6458333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cb579c90-aa26-4d63-ba21-785fec282336"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/073b0334-4262-47a1-945e-4a917d91d16a"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad9052ce-10fc-413c-a213-297c346e4ec0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9014fbbc-786d-431a-a47f-3832f34438b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cefdcbf4-fffd-4d64-9599-78df2fc11ebf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/abc3fb42-7d4a-4368-8893-f74ace9c07a5"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8249b5fe-3b78-47e7-a609-aebbfb5dc372"], "isController": false}, {"data": [0.3, 500, 1500, "register"], "isController": true}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d6ccec9c-a83a-4122-a43f-eb0ac840c97e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.33636363636363636, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a821ebbc-b788-4785-88f1-297706d43303"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3958333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ffa14ff8-826b-4bec-8447-a2aac525099b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60f3661b-c384-44b7-901f-74d4b071a460"], "isController": false}, {"data": [0.2542372881355932, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4818181818181818, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9161849710982659, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/29729c07-b7b8-411f-9f71-ea5d8f50280b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f10231cd-b94a-4bb5-945d-1290707fcbb4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/cefdcbf4-fffd-4d64-9599-78df2fc11ebf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=073b0334-4262-47a1-945e-4a917d91d16a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9014fbbc-786d-431a-a47f-3832f34438b0"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/abeb7ddf-40cc-46f7-a5d0-e6b9e0916765"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28c4ca81-f297-4e5b-8580-aca3e09e5737"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8249b5fe-3b78-47e7-a609-aebbfb5dc372"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1321, 31, 2.3467070401211205, 448.0340651021956, 137, 2276, 166.0, 1168.5999999999997, 1373.0, 1803.6999999999996, 5.224792649693671, 741.5140108849023, 3.816146057872192], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2205.8363636363633, 1744, 2891, 2188.0, 2567.0, 2762.2, 2891.0, 0.2446412447346532, 294.3850455811119, 1.2028990891005653], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29729c07-b7b8-411f-9f71-ea5d8f50280b", 1, 0, 0.0, 589.0, 589, 589, 589.0, 589.0, 589.0, 589.0, 1.697792869269949, 0.30673015704584045, 1.1705485993208828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60f3661b-c384-44b7-901f-74d4b071a460", 3, 0, 0.0, 542.0, 261, 924, 441.0, 924.0, 924.0, 924.0, 0.035277101633329803, 0.02940906812596277, 0.02262236009689444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abeb7ddf-40cc-46f7-a5d0-e6b9e0916765", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 476.0, 155, 800, 478.0, 734.6, 800.0, 800.0, 0.09184423218221895, 0.018691736315209404, 0.061546398558045556], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 476.0, 155, 800, 478.0, 734.6, 800.0, 800.0, 0.09488626299941803, 0.019310837118240935, 0.06358491569355533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 192.07142857142858, 142, 448, 151.0, 440.0, 448.0, 448.0, 0.0903995660820828, 0.03388722573417362, 0.051013706027068215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 150.49999999999997, 143, 157, 150.5, 156.5, 157.0, 157.0, 0.0903954802259887, 0.06717867231638418, 0.045374293785310736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 273.3571428571429, 138, 1001, 152.5, 732.5, 1001.0, 1001.0, 0.09040190102283294, 1.9212800223098976, 0.05267979081645831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 335.14285714285717, 137, 1279, 154.0, 876.5, 1279.0, 1279.0, 0.09022537008513408, 5.821506274288347, 0.05248881044294212], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 257.5333333333333, 150, 442, 244.0, 393.40000000000003, 442.0, 442.0, 0.09242884519400814, 0.16125102634530183, 0.05973575170839315], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a821ebbc-b788-4785-88f1-297706d43303", 3, 0, 0.0, 370.3333333333333, 259, 460, 392.0, 460.0, 460.0, 460.0, 0.038656804886220135, 0.032226587667190686, 0.024789682820915912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb579c90-aa26-4d63-ba21-785fec282336", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 168.47058823529412, 144, 427, 148.0, 225.3999999999998, 427.0, 427.0, 0.08361368510102501, 0.062138685900273466, 0.04197015052922544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 167.52941176470586, 142, 445, 148.0, 220.19999999999982, 445.0, 445.0, 0.08360587208301572, 0.022371102490963187, 0.0476814739223449], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 971.75, 724, 1185, 1017.5, 1185.0, 1185.0, 1185.0, 0.051824212271973466, 15.238039133758292, 0.02955599606135987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1161.625, 995, 1323, 1161.0, 1323.0, 1323.0, 1323.0, 0.051776248940204904, 46.588359809333966, 0.029478079230604942], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 305.5, 146, 477, 289.0, 477.0, 477.0, 477.0, 0.05207214595822512, 0.09214328952764055, 0.028832916756165665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8420780-7bdf-4ad2-aa8a-00a4b6649cc1", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 0.9979248046875, 1.8646240234375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f10231cd-b94a-4bb5-945d-1290707fcbb4", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 204.5, 149, 473, 157.0, 460.1, 473.0, 473.0, 0.0611262511779538, 0.04542683315080356, 0.03068251279830884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 200.00000000000003, 148, 434, 156.0, 432.8, 434.0, 434.0, 0.061127496676192376, 0.024007267167912138, 0.03443396256450224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 328.58333333333337, 147, 1387, 152.5, 1110.700000000001, 1387.0, 1387.0, 0.06074688292556988, 4.570021421185982, 0.03527748669896376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 277.75, 144, 1107, 151.0, 907.2000000000007, 1107.0, 1107.0, 0.060833417824191424, 1.5056171898763056, 0.03538714767312177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffa14ff8-826b-4bec-8447-a2aac525099b", 3, 0, 0.0, 439.6666666666667, 435, 442, 442.0, 442.0, 442.0, 442.0, 0.03279656292020596, 0.02734114506466389, 0.021031650049741453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 150.375, 144, 159, 149.5, 159.0, 159.0, 159.0, 0.05207824756696937, 0.0387026820297497, 0.02924315659278065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 899.0666666666668, 148, 1466, 1274.0, 1437.8, 1466.0, 1466.0, 0.07017740848865933, 42.103475346091585, 0.037236059842615465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 187.76470588235293, 144, 450, 155.0, 447.6, 450.0, 450.0, 0.08360751680756992, 0.022534838514540332, 0.04915207531070029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 758.3333333333333, 148, 1238, 1018.0, 1155.2, 1238.0, 1238.0, 0.07017511029188168, 13.762179767580035, 0.03730337080294361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 165.82352941176472, 143, 426, 149.0, 212.3999999999998, 426.0, 426.0, 0.08361245136952276, 0.022536168533191684, 0.0492366290779514], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 442.2666666666667, 153, 971, 440.0, 752.0000000000001, 971.0, 971.0, 0.09499202067026369, 0.019332360456721636, 0.06413816708146516], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 559.6666666666666, 301, 1548, 316.0, 1361.1000000000006, 1548.0, 1548.0, 0.06069741327857078, 6.137497384004714, 0.13521573820699842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28c4ca81-f297-4e5b-8580-aca3e09e5737", 3, 0, 0.0, 449.66666666666663, 221, 803, 325.0, 803.0, 803.0, 803.0, 0.019958751912713724, 0.023590569073913912, 0.01279906942319207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 646.625, 156, 1452, 548.5, 1306.0, 1444.5, 1452.0, 0.10057200326859012, 0.06177713872650701, 0.04547347413413791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 170.1333333333333, 144, 452, 151.0, 276.2000000000001, 452.0, 452.0, 0.07017773681477288, 0.05215357198832243, 0.035225934299602794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 229.53333333333333, 144, 473, 151.0, 455.6, 473.0, 473.0, 0.07017675184564857, 0.0890458915020632, 0.03609351169144685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb579c90-aa26-4d63-ba21-785fec282336", 3, 0, 0.0, 396.33333333333337, 257, 660, 272.0, 660.0, 660.0, 660.0, 0.03005108684764099, 0.02996304655414204, 0.01927104202143644], "isController": false}, {"data": ["login", 24, 0, 0.0, 2661.25, 1563, 4712, 2574.5, 3718.0, 4503.75, 4712.0, 0.0997348714666844, 39.9066427060564, 0.20560577506461988], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 172.41176470588235, 147, 443, 154.0, 223.7999999999998, 443.0, 443.0, 0.08227425396610301, 0.06660679349404237, 0.029245926214513177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/073b0334-4262-47a1-945e-4a917d91d16a", 3, 0, 0.0, 342.3333333333333, 238, 493, 296.0, 493.0, 493.0, 493.0, 0.07332453438920662, 0.03317744231803295, 0.0470212671701618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1098.4, 304, 1613, 1423.0, 1587.2, 1613.0, 1613.0, 0.07012655505635838, 55.96672067628881, 0.1457545748811355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad9052ce-10fc-413c-a213-297c346e4ec0", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 1.2005110432330826, 2.2431567199248117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9014fbbc-786d-431a-a47f-3832f34438b0", 3, 0, 0.0, 378.0, 255, 518, 361.0, 518.0, 518.0, 518.0, 0.06249609399412537, 0.04017896667916589, 0.04007724777618066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cefdcbf4-fffd-4d64-9599-78df2fc11ebf", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abc3fb42-7d4a-4368-8893-f74ace9c07a5", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 552.6428571428571, 301, 1435, 587.0, 1029.5, 1435.0, 1435.0, 0.09013359085787864, 7.831933798084662, 0.20106530661516178], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, 42.857142857142854, 815.6428571428571, 150, 1473, 1151.0, 1472.5, 1473.0, 1473.0, 0.09052231375033945, 61.89389956387643, 0.14234406521162826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8249b5fe-3b78-47e7-a609-aebbfb5dc372", 1, 0, 0.0, 971.0, 971, 971, 971.0, 971.0, 971.0, 971.0, 1.0298661174047374, 0.1860597966014418, 0.710044412976313], "isController": false}, {"data": ["register", 25, 8, 32.0, 988.6400000000001, 172, 1807, 959.0, 1491.0, 1720.2999999999997, 1807.0, 0.1029904301292324, 0.0322327861795082, 0.04646638546846227], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 376.235294117647, 291, 877, 311.0, 656.1999999999998, 877.0, 877.0, 0.08354629447611558, 0.1294804388023393, 0.18789757439306076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 154.5, 146, 161, 153.0, 161.0, 161.0, 161.0, 0.08837191319668826, 0.068609053702507, 0.031413453519135284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 584.8888888888888, 301, 1792, 451.5, 1500.4000000000005, 1792.0, 1792.0, 0.09454724998818159, 12.698179899779914, 0.20995111447570924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 220.78571428571428, 144, 471, 155.5, 468.0, 471.0, 471.0, 0.06093712594398137, 0.04528628207360334, 0.030587580796100022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6ccec9c-a83a-4122-a43f-eb0ac840c97e", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 1.101158405172414, 2.0575161637931036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 214.28571428571428, 142, 448, 156.5, 448.0, 448.0, 448.0, 0.0609344736784836, 0.016304732214750494, 0.03475169201976018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 170.85714285714286, 139, 427, 153.0, 295.5, 427.0, 427.0, 0.0609376564247877, 0.01642460270824356, 0.0358246769216037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 258.7142857142857, 144, 474, 156.5, 474.0, 474.0, 474.0, 0.0609376564247877, 0.01642460270824356, 0.03588418635170604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 157.0, 153, 160, 158.0, 160.0, 160.0, 160.0, 0.038122831763943425, 0.011243257024131753, 0.02356616455720331], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1417.127272727273, 1113, 2276, 1242.0, 1939.6, 2104.3999999999996, 2276.0, 0.23991903823000818, 287.02657907622444, 0.4737463821299576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 988.6400000000001, 172, 1807, 959.0, 1491.0, 1720.2999999999997, 1807.0, 0.10429573263580347, 0.03264130507336162, 0.04705530124779415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 151.625, 143, 159, 153.0, 159.0, 159.0, 159.0, 0.04541248729869496, 0.012240084467226376, 0.02674192367296197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 186.74999999999997, 143, 464, 148.5, 464.0, 464.0, 464.0, 0.0454119717310476, 0.012239945505633924, 0.026697272443447904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a821ebbc-b788-4785-88f1-297706d43303", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.29812551567656764, 1.1377114273927393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 223.5625, 144, 991, 155.0, 606.0000000000005, 991.0, 991.0, 0.09299568151303975, 5.253353520540421, 0.0541718008032502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 244.8125, 140, 1083, 150.5, 635.0000000000005, 1083.0, 1083.0, 0.09284350646713051, 1.729652311948379, 0.05417382335362351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 152.62499999999997, 144, 177, 150.5, 165.10000000000002, 177.0, 177.0, 0.09299243855234021, 0.06910863841633878, 0.04667784513271765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 188.75, 144, 450, 154.5, 450.0, 450.0, 450.0, 0.04541119840152581, 0.012151043322283275, 0.02589857408837019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 222.49999999999997, 143, 449, 151.5, 438.5, 449.0, 449.0, 0.09284027411090931, 0.03355713521025421, 0.05246064805412588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 188.125, 147, 428, 156.0, 428.0, 428.0, 428.0, 0.04540965182149466, 0.0337468213243725, 0.022793516636961185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 161.25, 157, 167, 161.5, 167.0, 167.0, 167.0, 0.047579964077127126, 0.03745063578726998, 0.016913190355541282], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 561.8666666666667, 150, 1692, 493.0, 1158.6000000000004, 1692.0, 1692.0, 0.09707292765478277, 0.019224989969130808, 0.06605509374009047], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1290.5000000000002, 881, 2219, 1171.5, 1873.5, 2135.5, 2219.0, 0.100203747620161, 0.05186326781121614, 0.04608980969638264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 383.75, 303, 892, 312.5, 892.0, 892.0, 892.0, 0.04536973498403553, 0.07031422794889099, 0.10203759733225957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ffa14ff8-826b-4bec-8447-a2aac525099b", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60f3661b-c384-44b7-901f-74d4b071a460", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["addBook", 59, 11, 18.64406779661017, 1369.5254237288132, 772, 2921, 1147.0, 2228.0, 2543.0, 2921.0, 0.2723650984899894, 83.93086762854247, 0.9896677261207362], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 276.25454545454545, 148, 808, 159.0, 626.0, 639.9999999999998, 808.0, 0.2409976426048778, 0.17910078713116406, 0.11649788387638137], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 852.5454545454544, 682, 1170, 761.0, 1113.0, 1148.2, 1170.0, 0.24113711494787055, 70.90231830044368, 0.1212750138653841], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 209.6, 139, 479, 157.0, 456.0, 470.2, 479.0, 0.24172317861584913, 0.4277367184100768, 0.11755678022528601], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1134.309090909091, 949, 1503, 1072.0, 1411.4, 1449.1999999999998, 1503.0, 0.24080138701598922, 216.6735113206752, 0.12087100871701022], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 174.88888888888889, 146, 434, 160.0, 218.00000000000034, 434.0, 434.0, 0.09896254267759652, 0.07393197768394663, 0.035178091342426894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 11, 6.358381502890174, 232.13872832369944, 140, 1594, 161.0, 420.5999999999998, 462.6999999999997, 1162.5799999999947, 0.7142503261605536, 1.5566812337951879, 0.3432515665512031], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 164.57142857142853, 138, 234, 162.0, 202.0, 234.0, 234.0, 0.06184100677159024, 0.04789054528307721, 0.021982545375838717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29729c07-b7b8-411f-9f71-ea5d8f50280b", 3, 0, 0.0, 369.6666666666667, 334, 433, 342.0, 433.0, 433.0, 433.0, 0.020055218702159944, 0.027647738022020633, 0.012860931264080435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f10231cd-b94a-4bb5-945d-1290707fcbb4", 3, 0, 0.0, 411.33333333333337, 232, 752, 250.0, 752.0, 752.0, 752.0, 0.03268828451882845, 0.02725087781664052, 0.02096221370510809], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cefdcbf4-fffd-4d64-9599-78df2fc11ebf", 3, 0, 0.0, 786.0, 237, 1592, 529.0, 1592.0, 1592.0, 1592.0, 0.04501260352898812, 0.02893876691723683, 0.028865504216180532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 183.07142857142858, 151, 448, 161.5, 325.0, 448.0, 448.0, 0.08598557899003796, 0.06977931263742337, 0.030565186281615052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=073b0334-4262-47a1-945e-4a917d91d16a", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 0.6002128322259136, 2.290541943521595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9014fbbc-786d-431a-a47f-3832f34438b0", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 485.1428571428571, 295, 940, 320.5, 926.5, 940.0, 940.0, 0.06089577687787352, 0.09437656045428248, 0.1369560294431081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 438.49999999999994, 292, 1227, 313.5, 794.4000000000004, 1227.0, 1227.0, 0.09275792500521764, 7.070442261452706, 0.20713143580571855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abeb7ddf-40cc-46f7-a5d0-e6b9e0916765", 3, 0, 0.0, 502.6666666666667, 244, 748, 516.0, 748.0, 748.0, 748.0, 0.04638147214792598, 0.02981881754301882, 0.029743326865694718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 157.0, 146, 164, 159.0, 163.4, 164.0, 164.0, 0.0652638563324976, 0.054110365260049274, 0.023199261430692505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28c4ca81-f297-4e5b-8580-aca3e09e5737", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 179.86666666666667, 146, 520, 156.0, 310.60000000000014, 520.0, 520.0, 0.06758766119657196, 0.052472842432885455, 0.024025301440968937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8249b5fe-3b78-47e7-a609-aebbfb5dc372", 3, 0, 0.0, 720.3333333333333, 229, 1692, 240.0, 1692.0, 1692.0, 1692.0, 0.0189456134589638, 0.02239307372053957, 0.012149368005911031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 185.8888888888889, 143, 460, 152.0, 449.20000000000005, 460.0, 460.0, 0.09477225700130049, 0.07043133552538054, 0.047571230565105906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 230.72222222222223, 143, 449, 158.0, 436.40000000000003, 449.0, 449.0, 0.09477425299460313, 0.041175793076214294, 0.05316654600500197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 362.11111111111114, 143, 1344, 156.0, 1318.8, 1344.0, 1344.0, 0.09462677622344536, 9.483264285357558, 0.05472664032888062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 277.88888888888886, 142, 1028, 150.0, 774.2000000000004, 1028.0, 1028.0, 0.09478074055351952, 3.1192284123699396, 0.054908243686549556], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 25.806451612903224, 0.6056018168054504], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.67741935483871, 0.22710068130204392], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.67741935483871, 0.22710068130204392], "isController": false}, {"data": ["401/Unauthorized", 17, 54.83870967741935, 1.2869038607115821], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1321, 31, "401/Unauthorized", 17, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
