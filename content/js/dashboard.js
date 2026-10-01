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

    var data = {"OkPercent": 99.12698412698413, "KoPercent": 0.873015873015873};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8067947838023336, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.375, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ebb35f71-92eb-4c4c-a0a7-51f15984ab2b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2b666e80-5769-4abb-b418-5009250f271d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e3ac457-6c15-405e-b8ad-259204ecfd73"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/54cdce00-185c-46ba-838a-d6aaa0f2794b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bb683cb4-9007-4f96-ac05-2b03a439d6e2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49986f92-54c0-47a6-88a0-651073328975"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f5575dfb-90bc-477d-959b-14ab28c09d0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6190476190476191, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9c5fb90c-5bd8-4464-922e-7dadc9d7ab31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d0fb1d4-7484-4055-a50f-ad5cc31f13ea"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a97d5f7-a064-49ae-a581-7d58c7bdcb24"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/12a3dbaa-ca1b-4030-b423-5467a9c29c98"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ddb9e72f-faf3-41a4-b284-592587bde619"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54cdce00-185c-46ba-838a-d6aaa0f2794b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e9adb1a-27e0-4a27-b7f9-39ec28639f12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ebb35f71-92eb-4c4c-a0a7-51f15984ab2b"], "isController": false}, {"data": [0.33636363636363636, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b666e80-5769-4abb-b418-5009250f271d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=546b3739-5dff-4ef4-bad0-68728ecf1d66"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/49986f92-54c0-47a6-88a0-651073328975"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7410714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5575dfb-90bc-477d-959b-14ab28c09d0c"], "isController": false}, {"data": [0.9457831325301205, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ddb9e72f-faf3-41a4-b284-592587bde619"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/546b3739-5dff-4ef4-bad0-68728ecf1d66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c5fb90c-5bd8-4464-922e-7dadc9d7ab31"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d0fb1d4-7484-4055-a50f-ad5cc31f13ea"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0e9adb1a-27e0-4a27-b7f9-39ec28639f12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b8df58e8-33e1-4946-8c1c-941128eb8334"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7e3ac457-6c15-405e-b8ad-259204ecfd73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db8bfc9a-ed3c-49b6-8500-4361e1c9f33e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1260, 11, 0.873015873015873, 334.06666666666723, 83, 3235, 100.5, 914.9000000000001, 1093.9, 1890.190000000002, 5.014606035038565, 736.4837043337538, 3.6669228899851154], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1400.678571428571, 1023, 1882, 1371.0, 1688.3, 1752.6, 1882.0, 0.2549069589599796, 306.7384732837024, 1.253375525745603], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ebb35f71-92eb-4c4c-a0a7-51f15984ab2b", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b666e80-5769-4abb-b418-5009250f271d", 3, 0, 0.0, 567.6666666666667, 191, 1250, 262.0, 1250.0, 1250.0, 1250.0, 0.0728208364686749, 0.03294953212612569, 0.046698257761487484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e3ac457-6c15-405e-b8ad-259204ecfd73", 1, 0, 0.0, 1031.0, 1031, 1031, 1031.0, 1031.0, 1031.0, 1031.0, 0.9699321047526673, 0.17523187439379245, 0.6687227206595538], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 815.7272727272726, 411, 1978, 744.0, 1799.4000000000005, 1978.0, 1978.0, 0.09176837661741764, 0.016579247728732677, 0.062373818482151046], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 815.7272727272726, 411, 1978, 744.0, 1799.4000000000005, 1978.0, 1978.0, 0.09543971680433123, 0.017242526961719996, 0.06486918251544388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 93.78947368421053, 83, 252, 85.0, 89.0, 252.0, 252.0, 0.10575472695799311, 0.03665758010920567, 0.059845782473658723], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54cdce00-185c-46ba-838a-d6aaa0f2794b", 3, 0, 0.0, 427.6666666666667, 273, 566, 444.0, 566.0, 566.0, 566.0, 0.025238503861491093, 0.025312444790772805, 0.016184847853885888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 88.42105263157895, 84, 110, 86.0, 93.0, 110.0, 110.0, 0.10574884093704605, 0.07858873823544145, 0.05308096117347819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 130.5263157894737, 84, 780, 85.0, 250.0, 780.0, 780.0, 0.10575472695799311, 1.6636040410829285, 0.0617971572155337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 129.52631578947367, 83, 746, 86.0, 263.0, 746.0, 746.0, 0.10575531559612603, 5.035363020775353, 0.061694224507402876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb683cb4-9007-4f96-ac05-2b03a439d6e2", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.534901067839196, 0.9994634631490787], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 276.2727272727273, 174, 566, 248.0, 527.0000000000001, 566.0, 566.0, 0.09208565640330169, 0.18062326816180288, 0.059531938026353245], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 95.82352941176471, 84, 251, 85.0, 122.19999999999989, 251.0, 251.0, 0.10142169350364222, 0.07537295776979662, 0.05090893599694542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49986f92-54c0-47a6-88a0-651073328975", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 136.41176470588235, 84, 264, 88.0, 259.2, 264.0, 264.0, 0.10141745812055553, 0.0540178464897628, 0.05633655905478929], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 512.8, 493, 576, 499.0, 576.0, 576.0, 576.0, 0.07272409931203003, 21.383299865096795, 0.041475462888892124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 894.2, 820, 999, 911.0, 999.0, 999.0, 999.0, 0.07219278360935041, 64.95919359307094, 0.04110194613696415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 265.6, 252, 303, 255.0, 303.0, 303.0, 303.0, 0.07297885072905873, 0.12913835695415468, 0.04040918785485966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 86.2, 85, 88, 86.0, 87.9, 88.0, 88.0, 0.061270380060167516, 0.04553394455643308, 0.030754858741138768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 102.2, 83, 253, 85.5, 236.60000000000005, 253.0, 253.0, 0.061270004656520355, 0.016394512964732988, 0.03494304953067177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 102.80000000000001, 84, 251, 86.0, 234.90000000000006, 251.0, 251.0, 0.061271130881262674, 0.01651448449534033, 0.036020723428242314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 86.39999999999999, 85, 90, 86.0, 89.7, 90.0, 90.0, 0.061270755468414935, 0.016514383309846208, 0.03608033744868574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 120.0, 84, 260, 85.0, 260.0, 260.0, 260.0, 0.07316038218983656, 0.05437016684225158, 0.0410812692960508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 685.4666666666666, 83, 1145, 915.0, 1106.0, 1145.0, 1145.0, 0.07575528014302597, 45.449962295965776, 0.04019567273213943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 264.0, 83, 1032, 87.0, 1003.1999999999999, 1032.0, 1032.0, 0.10142229858724704, 16.127211667964275, 0.05808710460218595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 471.6666666666667, 84, 670, 659.0, 668.8, 670.0, 670.0, 0.07575489755412688, 14.856442890907896, 0.0402694491230108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 198.29411764705878, 84, 669, 87.0, 661.8, 669.0, 669.0, 0.10141624807607412, 5.284818863869567, 0.058182678626824], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 549.4545454545455, 239, 1316, 437.0, 1259.0000000000002, 1316.0, 1316.0, 0.09595756930753528, 0.017336084298724637, 0.06615824602648429], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f5575dfb-90bc-477d-959b-14ab28c09d0c", 3, 0, 0.0, 545.6666666666666, 174, 926, 537.0, 926.0, 926.0, 926.0, 0.025082144021670975, 0.025155626865484462, 0.016084578034730408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 190.5, 172, 339, 174.0, 323.00000000000006, 339.0, 339.0, 0.06123773714313708, 0.09490653207632671, 0.1377251060943796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 739.5238095238095, 132, 2216, 764.0, 1740.8000000000002, 2173.1999999999994, 2216.0, 0.09060784922853889, 0.055656579262452106, 0.040968197453919435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 109.73333333333332, 84, 253, 87.0, 251.8, 253.0, 253.0, 0.07575451496909216, 0.056298033097147586, 0.03802521552159509], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c5fb90c-5bd8-4464-922e-7dadc9d7ab31", 3, 0, 0.0, 641.0, 192, 1231, 500.0, 1231.0, 1231.0, 1231.0, 0.06911486891213196, 0.031272678316361796, 0.04432170955628254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 163.66666666666669, 84, 255, 88.0, 255.0, 255.0, 255.0, 0.07575451496909216, 0.09612340473617227, 0.038962283089572135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d0fb1d4-7484-4055-a50f-ad5cc31f13ea", 3, 0, 0.0, 365.0, 345, 392, 358.0, 392.0, 392.0, 392.0, 0.042130097741826765, 0.02708559343753511, 0.027017022314908438], "isController": false}, {"data": ["login", 21, 0, 0.0, 2965.190476190476, 1542, 4737, 3077.0, 3909.8, 4654.5999999999985, 4737.0, 0.09199148421688964, 26.329786014392287, 0.17511492775383078], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 93.11764705882352, 87, 116, 90.0, 110.39999999999999, 116.0, 116.0, 0.09829885163812145, 0.07957983203906512, 0.03494216991823848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a97d5f7-a064-49ae-a581-7d58c7bdcb24", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.6666721033402923, 1.245677844467641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 829.6666666666666, 179, 1243, 1011.0, 1196.8, 1243.0, 1243.0, 0.07572162710632327, 60.432045321602374, 0.15738365529748505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12a3dbaa-ca1b-4030-b423-5467a9c29c98", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ddb9e72f-faf3-41a4-b284-592587bde619", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 230.15789473684208, 170, 867, 175.0, 374.0, 867.0, 867.0, 0.10569824819061288, 6.810550580088675, 0.23629447497176745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1015.0, 904, 1172, 1007.0, 1172.0, 1172.0, 1172.0, 0.07210533146820876, 86.26304430512091, 0.1625890726172793], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1241.9523809523812, 111, 2316, 1183.0, 1930.8, 2278.6999999999994, 2316.0, 0.09524241462197831, 0.030082146582611456, 0.04297069878452538], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 109.05555555555554, 85, 264, 90.5, 255.9, 264.0, 264.0, 0.10593095655653771, 0.08224131881098387, 0.03765514471345676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 411.5294117647059, 172, 1117, 339.0, 1089.0, 1117.0, 1117.0, 0.1013642434649876, 21.529408953294936, 0.22339379598657225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 328.6666666666667, 170, 836, 338.0, 538.1000000000005, 836.0, 836.0, 0.09037233401614653, 6.1387633848330125, 0.201964907920633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54cdce00-185c-46ba-838a-d6aaa0f2794b", 1, 0, 0.0, 542.0, 542, 542, 542.0, 542.0, 542.0, 542.0, 1.8450184501845017, 0.33332852859778594, 1.2720537361623616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 86.2, 84, 91, 85.5, 90.7, 91.0, 91.0, 0.05558458306004247, 0.04130846455926984, 0.027900855168810378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 102.69999999999999, 83, 253, 85.5, 236.80000000000007, 253.0, 253.0, 0.05558458306004247, 0.014873218514112925, 0.03170058252643047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 86.6, 84, 94, 85.5, 93.6, 94.0, 94.0, 0.05558365618173632, 0.014981532330233619, 0.03267711037246608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 119.5, 84, 251, 87.5, 251.0, 251.0, 251.0, 0.055583965137737064, 0.014981615603530694, 0.03273157322075728], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 952.267857142857, 669, 1522, 918.0, 1203.7000000000003, 1374.1999999999998, 1522.0, 0.2690936349744842, 321.92953951351717, 0.5313548143734443], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1241.9523809523812, 111, 2316, 1183.0, 1930.8, 2278.6999999999994, 2316.0, 0.09267922396596466, 0.029272567391035714, 0.041814259250269215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 85.75, 85, 86, 86.0, 86.0, 86.0, 86.0, 0.030507337014551997, 0.008222680679703468, 0.017964769745873882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 84.75, 84, 87, 84.0, 87.0, 87.0, 87.0, 0.030508035053732275, 0.008222868823076279, 0.017935387795260577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 168.66666666666669, 84, 910, 87.0, 322.3000000000009, 910.0, 910.0, 0.10414014949897017, 5.232370166522992, 0.06072582068223369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 152.16666666666669, 83, 499, 86.0, 384.70000000000016, 499.0, 499.0, 0.10414135453188461, 1.7276774995371493, 0.06082822389812661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 85.75, 85, 87, 85.5, 87.0, 87.0, 87.0, 0.030507337014551997, 0.008163096037096921, 0.017398715641111687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 116.16666666666667, 85, 268, 87.0, 256.3, 268.0, 268.0, 0.10413954699297058, 0.07739276881020568, 0.05227317104920594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 86.25, 85, 89, 85.5, 89.0, 89.0, 89.0, 0.03050687167284431, 0.022671610686557146, 0.015313019570158178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 122.38888888888891, 84, 252, 86.0, 251.1, 252.0, 252.0, 0.10404143161009896, 0.03652061971122723, 0.05885069259803014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e9adb1a-27e0-4a27-b7f9-39ec28639f12", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 0.5982253725165563, 2.282957367549669], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 87.75, 87, 88, 88.0, 88.0, 88.0, 88.0, 0.03273911833554322, 0.02576926697114047, 0.01163773347083763], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 703.1818181818182, 392, 1250, 606.0, 1246.2, 1250.0, 1250.0, 0.09235936188077246, 0.016686017527287995, 0.06286569846767423], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1716.3809523809523, 966, 3235, 1480.0, 2351.0, 3146.699999999999, 3235.0, 0.09092562284051646, 0.04706111338425168, 0.041822234724495366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 173.5, 171, 177, 173.0, 177.0, 177.0, 177.0, 0.030486410682438302, 0.04724798218069296, 0.06856465215005413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebb35f71-92eb-4c4c-a0a7-51f15984ab2b", 3, 0, 0.0, 357.6666666666667, 219, 558, 296.0, 558.0, 558.0, 558.0, 0.05435077993369204, 0.03381000665797054, 0.034853853017374134], "isController": false}, {"data": ["addBook", 55, 6, 10.909090909090908, 1023.6545454545459, 449, 3446, 850.0, 1654.6, 2044.5999999999945, 3446.0, 0.2732118285819312, 96.14952460365657, 0.9910720273311179], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b666e80-5769-4abb-b418-5009250f271d", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 0.5132501775568182, 1.9586736505681819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=546b3739-5dff-4ef4-bad0-68728ecf1d66", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49986f92-54c0-47a6-88a0-651073328975", 3, 0, 0.0, 369.6666666666667, 194, 606, 309.0, 606.0, 606.0, 606.0, 0.02532564559291557, 0.029934055712199367, 0.016240729758477762], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 144.53571428571425, 84, 353, 87.0, 342.3, 346.3, 353.0, 0.2700799629604622, 0.20071372247354663, 0.1305562320951453], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 546.1607142857144, 413, 799, 501.0, 698.3000000000001, 763.05, 799.0, 0.2699146394952596, 79.36386602112081, 0.13574808529302607], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 134.89285714285714, 83, 344, 89.0, 256.6, 261.3, 344.0, 0.27045692731953036, 0.47858198467088775, 0.1315308103565685], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 804.5892857142858, 582, 1169, 792.5, 996.1, 1029.3999999999999, 1169.0, 0.2695884924226377, 242.57619936791127, 0.13532078623558183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 111.05555555555554, 86, 261, 92.0, 259.2, 261.0, 261.0, 0.09046362608367886, 0.06758268940821711, 0.03215699208443272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5575dfb-90bc-477d-959b-14ab28c09d0c", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 6, 3.6144578313253013, 178.50602409638554, 84, 2157, 93.0, 349.50000000000017, 424.7500000000001, 1986.8200000000031, 0.6996573364972457, 1.5629799277898837, 0.33415075271117217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 110.39999999999999, 86, 262, 92.0, 246.40000000000006, 262.0, 262.0, 0.05484500800737117, 0.04247274545883334, 0.01949568644012022], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 109.3157894736842, 85, 264, 91.0, 253.0, 264.0, 264.0, 0.11231305787078087, 0.09114467879943253, 0.039923782290004144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ddb9e72f-faf3-41a4-b284-592587bde619", 3, 0, 0.0, 282.6666666666667, 194, 458, 196.0, 458.0, 458.0, 458.0, 0.019117534602737633, 0.026355064792511023, 0.012259616916469119], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/546b3739-5dff-4ef4-bad0-68728ecf1d66", 3, 0, 0.0, 466.33333333333337, 210, 941, 248.0, 941.0, 941.0, 941.0, 0.02482108137177843, 0.024893799383609815, 0.01591716481198031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 207.7, 170, 343, 174.0, 342.9, 343.0, 343.0, 0.05555679015089224, 0.08610217379830662, 0.1249485231616258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 320.2222222222223, 172, 1163, 182.0, 592.4000000000009, 1163.0, 1163.0, 0.10398853815223923, 7.063677588953529, 0.23239452384803808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c5fb90c-5bd8-4464-922e-7dadc9d7ab31", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d0fb1d4-7484-4055-a50f-ad5cc31f13ea", 1, 0, 0.0, 1316.0, 1316, 1316, 1316.0, 1316.0, 1316.0, 1316.0, 0.7598784194528876, 0.1372827222644377, 0.5239005509118541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e9adb1a-27e0-4a27-b7f9-39ec28639f12", 3, 0, 0.0, 420.0, 224, 665, 371.0, 665.0, 665.0, 665.0, 0.07672830507174097, 0.03471755991201821, 0.04920402376019847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 115.4, 87, 358, 88.0, 331.4000000000001, 358.0, 358.0, 0.06527159510724123, 0.05411678149028106, 0.02320201232327716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 91.93333333333334, 85, 145, 88.0, 114.40000000000002, 145.0, 145.0, 0.07564906901212402, 0.05873145494593614, 0.026890880000403464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8df58e8-33e1-4946-8c1c-941128eb8334", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.816715952685422, 1.526035006393862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e3ac457-6c15-405e-b8ad-259204ecfd73", 3, 0, 0.0, 366.0, 186, 653, 259.0, 653.0, 653.0, 653.0, 0.03351917855666418, 0.027943559988156556, 0.02149504614473581], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db8bfc9a-ed3c-49b6-8500-4361e1c9f33e", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 1.1049686418685123, 2.064635596885813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 115.66666666666666, 84, 252, 87.5, 252.0, 252.0, 252.0, 0.09041182586682339, 0.06719081980923104, 0.04538249853080783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 132.33333333333334, 83, 260, 86.0, 260.0, 260.0, 260.0, 0.09041227999678535, 0.031736515385156316, 0.05114140794523025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 173.77777777777777, 83, 752, 86.0, 387.50000000000057, 752.0, 752.0, 0.09041273413130943, 4.542656170731892, 0.05272114075755826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 187.0, 84, 668, 88.5, 371.9000000000005, 668.0, 668.0, 0.09041273413130943, 1.499923321839196, 0.05280943444323336], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 45.45454545454545, 0.3968253968253968], "isController": false}, {"data": ["401/Unauthorized", 6, 54.54545454545455, 0.47619047619047616], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1260, 11, "401/Unauthorized", 6, "406/Not Acceptable", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
