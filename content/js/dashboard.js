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

    var data = {"OkPercent": 95.96412556053812, "KoPercent": 4.0358744394618835};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7407994923857868, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.08181818181818182, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9220cf52-b3d3-4a65-a6da-ed5d9e9a47d1"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e8df0af2-d064-42ac-b1a9-97ba6060b7a5"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/62f6de34-1244-4b4c-a261-ac6d5fb81794"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7e5f205-2725-48e0-8b6b-893494e5afe7"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d4c633c-f09b-42b4-a012-02c5eb39e3c2"], "isController": false}, {"data": [0.6956521739130435, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/256cac02-0006-4fa7-8301-7db55a5db58f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4e86247-7063-4f11-96b3-c676f1b3e057"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d4406334-faea-4d43-9145-a0e7801e4818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa65f1b7-46d1-4774-8878-6b2cbc36a7a2"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88163ac8-bfec-4d30-8c40-532f1384cd48"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e74ef680-b2e7-4f4e-b239-b806332257cf"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/835b16d4-9682-4b16-b123-4f2a0cff78a0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.225, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b85c721a-87f5-4a90-b916-78cad10a2e4a"], "isController": false}, {"data": [0.19642857142857142, 500, 1500, "register"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9220cf52-b3d3-4a65-a6da-ed5d9e9a47d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.19642857142857142, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fbae9d4c-2380-46a0-a0d5-df202e27d875"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62f6de34-1244-4b4c-a261-ac6d5fb81794"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=256cac02-0006-4fa7-8301-7db55a5db58f"], "isController": false}, {"data": [0.2033898305084746, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b7e5f205-2725-48e0-8b6b-893494e5afe7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.509090909090909, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.861271676300578, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f4e86247-7063-4f11-96b3-c676f1b3e057"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e74ef680-b2e7-4f4e-b239-b806332257cf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fbae9d4c-2380-46a0-a0d5-df202e27d875"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4406334-faea-4d43-9145-a0e7801e4818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d4c633c-f09b-42b4-a012-02c5eb39e3c2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b85c721a-87f5-4a90-b916-78cad10a2e4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88163ac8-bfec-4d30-8c40-532f1384cd48"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fa65f1b7-46d1-4774-8878-6b2cbc36a7a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=835b16d4-9682-4b16-b123-4f2a0cff78a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1338, 54, 4.0358744394618835, 380.82511210762334, 100, 2879, 120.0, 1079.5000000000007, 1316.05, 1733.3199999999988, 5.268981920855008, 728.8902651387243, 3.8501341611568134], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1785.9272727272732, 1311, 2734, 1787.0, 2129.6, 2338.6, 2734.0, 0.2402281730865826, 289.07437491537416, 1.1812000502841244], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9220cf52-b3d3-4a65-a6da-ed5d9e9a47d1", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["deleteBook", 18, 5, 27.77777777777778, 525.9444444444445, 108, 1301, 486.5, 1251.5, 1301.0, 1301.0, 0.08604412151342049, 0.01827597307536031, 0.057339406713831594], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, 27.77777777777778, 525.9444444444445, 108, 1301, 486.5, 1251.5, 1301.0, 1301.0, 0.085927057475654, 0.01825110839936987, 0.057261395777639876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 149.0625, 100, 330, 110.0, 327.2, 330.0, 330.0, 0.08439263674244422, 0.030503735033493327, 0.0476871967139617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 107.9375, 102, 114, 107.5, 113.3, 114.0, 114.0, 0.08439219161247107, 0.06271724396200241, 0.04236092430547864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 195.56250000000003, 100, 646, 108.5, 427.60000000000025, 646.0, 646.0, 0.08439575278374115, 1.5722726820179025, 0.049244592078403655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 187.375, 100, 1402, 106.5, 499.0000000000009, 1402.0, 1402.0, 0.08439308187711313, 4.767390125811624, 0.04916061849579881], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8df0af2-d064-42ac-b1a9-97ba6060b7a5", 1, 0, 0.0, 1399.0, 1399, 1399, 1399.0, 1399.0, 1399.0, 1399.0, 0.7147962830593281, 0.2282601411722659, 0.4265044228020014], "isController": false}, {"data": ["goToProfile", 19, 6, 31.57894736842105, 233.7894736842105, 107, 584, 207.0, 549.0, 584.0, 584.0, 0.08416538941996758, 0.11332219064789631, 0.05438565356639763], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/62f6de34-1244-4b4c-a261-ac6d5fb81794", 3, 0, 0.0, 609.0, 209, 1406, 212.0, 1406.0, 1406.0, 1406.0, 0.01705650250730587, 0.023513765663554804, 0.010937926412562683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 137.86666666666667, 105, 333, 110.0, 318.0, 333.0, 333.0, 0.11089671080355756, 0.08241445011865949, 0.05566495054006698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 122.66666666666666, 103, 332, 107.0, 200.00000000000009, 332.0, 332.0, 0.11089671080355756, 0.05188175545796645, 0.062003968253968256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 711.5555555555554, 594, 867, 660.0, 867.0, 867.0, 867.0, 0.06457445434586077, 18.987033651362523, 0.03682761849412373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1201.6666666666667, 943, 1305, 1270.0, 1305.0, 1305.0, 1305.0, 0.06431465588086067, 57.87044041470447, 0.0366166449009197], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 200.44444444444446, 106, 325, 111.0, 325.0, 325.0, 325.0, 0.06473283321225895, 0.11454677127013012, 0.03584327776499105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 128.0909090909091, 102, 305, 108.0, 271.0000000000001, 305.0, 305.0, 0.10178682138263517, 0.07564430768768102, 0.05109221307683054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 125.90909090909089, 101, 319, 108.0, 277.40000000000015, 319.0, 319.0, 0.10181885500069422, 0.027244498310732633, 0.05806856574258342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 145.09090909090907, 101, 316, 110.0, 314.2, 316.0, 316.0, 0.10181414291003332, 0.027442093206219917, 0.059855580109218806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 164.54545454545453, 101, 334, 106.0, 332.0, 334.0, 334.0, 0.10181885500069422, 0.027443363261905863, 0.05995778277872912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 109.22222222222221, 101, 113, 111.0, 113.0, 113.0, 113.0, 0.06483449194971724, 0.048182664427475416, 0.03640608678817131], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7e5f205-2725-48e0-8b6b-893494e5afe7", 1, 0, 0.0, 1133.0, 1133, 1133, 1133.0, 1133.0, 1133.0, 1133.0, 0.88261253309797, 0.15945636584289496, 0.6085199691085613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 722.4705882352941, 101, 1517, 966.0, 1356.9999999999998, 1517.0, 1517.0, 0.07732791128214227, 40.93787064803064, 0.04155131446077428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 251.53333333333336, 104, 1040, 109.0, 858.8000000000001, 1040.0, 1040.0, 0.11072807399588092, 13.310307468793136, 0.06382723744528188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 565.7058823529412, 100, 994, 817.0, 951.5999999999999, 994.0, 994.0, 0.07725868023995637, 13.37129044719142, 0.0415895618410289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 227.46666666666664, 104, 862, 112.0, 771.4000000000001, 862.0, 862.0, 0.11072725662148994, 4.3668638534561675, 0.06393489837083297], "isController": false}, {"data": ["deleteBooks", 18, 5, 27.77777777777778, 425.1111111111111, 107, 1137, 416.5, 1133.4, 1137.0, 1137.0, 0.0860786854828297, 0.018283314543472127, 0.05764264403833371], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 315.1818181818182, 210, 624, 222.0, 587.0000000000001, 624.0, 624.0, 0.10168614110338707, 0.15759365813581572, 0.22869451461044962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d4c633c-f09b-42b4-a012-02c5eb39e3c2", 3, 0, 0.0, 461.33333333333337, 207, 872, 305.0, 872.0, 872.0, 872.0, 0.02528999190720259, 0.030040097809043702, 0.016217865904032912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 686.6086956521739, 138, 1897, 542.0, 1214.4, 1770.7999999999981, 1897.0, 0.09571727613601841, 0.05879508465776912, 0.043278416846656766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 122.8235294117647, 101, 358, 109.0, 165.19999999999982, 358.0, 358.0, 0.07732650434165578, 0.0574662791054688, 0.03881428049962019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 201.41176470588235, 102, 452, 110.0, 352.7999999999999, 452.0, 452.0, 0.07725516927970916, 0.08892687741422403, 0.04024298454896614], "isController": false}, {"data": ["login", 23, 0, 0.0, 2863.4782608695655, 1713, 4723, 2824.0, 3692.2000000000003, 4531.399999999997, 4723.0, 0.09277972077337948, 43.55657681530583, 0.20018627167717498], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/256cac02-0006-4fa7-8301-7db55a5db58f", 3, 0, 0.0, 418.6666666666667, 317, 484, 455.0, 484.0, 484.0, 484.0, 0.11764244539429826, 0.05323014293557115, 0.07544128171444257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 127.46666666666665, 109, 303, 114.0, 202.20000000000005, 303.0, 303.0, 0.11218476082208992, 0.0908214518764771, 0.03987817669847728], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4e86247-7063-4f11-96b3-c676f1b3e057", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4406334-faea-4d43-9145-a0e7801e4818", 3, 0, 0.0, 386.6666666666667, 205, 549, 406.0, 549.0, 549.0, 549.0, 0.07782101167315175, 0.03521198119325551, 0.04990475032425422], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa65f1b7-46d1-4774-8878-6b2cbc36a7a2", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 861.2941176470588, 213, 1623, 1079.0, 1467.8, 1623.0, 1623.0, 0.07721586831514975, 54.3887010261194, 0.16203888358345217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88163ac8-bfec-4d30-8c40-532f1384cd48", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e74ef680-b2e7-4f4e-b239-b806332257cf", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 0.555889423076923, 2.121394230769231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/835b16d4-9682-4b16-b123-4f2a0cff78a0", 3, 0, 0.0, 477.3333333333333, 310, 584, 538.0, 584.0, 584.0, 584.0, 0.03025688091900233, 0.03034552412481972, 0.019403012828917512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 368.25000000000006, 215, 1513, 222.5, 767.5000000000007, 1513.0, 1513.0, 0.08434236675223902, 6.42896910730194, 0.18833922302230327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 11, 55.0, 650.6999999999999, 104, 1417, 113.0, 1410.5, 1416.75, 1417.0, 0.13971358714635, 75.23627150279427, 0.1925632531435557], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b85c721a-87f5-4a90-b916-78cad10a2e4a", 3, 0, 0.0, 762.3333333333334, 220, 1844, 223.0, 1844.0, 1844.0, 1844.0, 0.04942583653228331, 0.0317760505049673, 0.031695604807486365], "isController": false}, {"data": ["register", 28, 10, 35.714285714285715, 1095.321428571429, 148, 1936, 1024.0, 1887.9, 1922.05, 1936.0, 0.11035917971598277, 0.03439486711572342, 0.04979095803592191], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 401.40000000000003, 211, 1349, 225.0, 1121.6000000000001, 1349.0, 1349.0, 0.11063660301374106, 17.796581870625243, 0.24504999161005758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 148.49999999999997, 108, 498, 114.5, 371.50000000000057, 492.99999999999994, 498.0, 0.11761523352504616, 0.09131260805899581, 0.041808540042106254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 291.1111111111111, 216, 637, 224.5, 634.3, 637.0, 637.0, 0.10845725579041238, 0.16808756341736764, 0.24392291023957002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 176.29999999999998, 103, 367, 109.0, 363.40000000000003, 367.0, 367.0, 0.059656972408650255, 0.04433491797166294, 0.029945003728560775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 152.30000000000004, 102, 340, 106.5, 340.0, 340.0, 340.0, 0.059732874584856516, 0.015983210582276062, 0.03406640503667598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9220cf52-b3d3-4a65-a6da-ed5d9e9a47d1", 3, 0, 0.0, 1103.6666666666667, 201, 1738, 1372.0, 1738.0, 1738.0, 1738.0, 0.044745398681502256, 0.02876697994660382, 0.02869415214927065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 171.6, 102, 323, 110.5, 322.5, 323.0, 323.0, 0.059656260626271426, 0.01607922649692472, 0.035071356344741594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 148.10000000000002, 101, 335, 106.0, 332.3, 335.0, 335.0, 0.059661599408156935, 0.016080665465479798, 0.03513275824523304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 113.8, 107, 117, 115.0, 117.0, 117.0, 117.0, 0.17431320596848418, 0.05140877754148654, 0.10775415954887742], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1220.8909090909092, 804, 2317, 1157.0, 1632.2, 1829.1999999999998, 2317.0, 0.24137310576969495, 288.7661493693579, 0.47661759752570626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 28, 10, 35.714285714285715, 1095.321428571429, 148, 1936, 1024.0, 1887.9, 1922.05, 1936.0, 0.11030483529124417, 0.03437792997218742, 0.04976643935991679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 135.57142857142858, 103, 312, 106.0, 312.0, 312.0, 312.0, 0.035487959442332066, 0.009565114068441065, 0.02089769486692015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 107.85714285714285, 103, 111, 110.0, 111.0, 111.0, 111.0, 0.035523978685612786, 0.009574822380106571, 0.02088421403197158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 172.45, 102, 333, 111.0, 323.8, 332.55, 333.0, 0.11878530150679155, 0.032016350796752406, 0.06983276514364112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 181.50000000000003, 102, 437, 110.0, 392.5000000000001, 435.09999999999997, 437.0, 0.11878318505232399, 0.032015780346134205, 0.06994752010405407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 136.28571428571428, 102, 312, 107.0, 312.0, 312.0, 312.0, 0.03548777952963483, 0.009495753506953069, 0.020239124262994863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 132.05, 100, 338, 110.0, 315.30000000000047, 337.95, 338.0, 0.11878530150679155, 0.08827696723307457, 0.059624653295401224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 108.14285714285715, 103, 114, 108.0, 114.0, 114.0, 114.0, 0.035525240683505634, 0.02640108218764432, 0.017832005577462787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 139.54999999999995, 100, 334, 108.0, 315.8, 333.15, 334.0, 0.11879165132274504, 0.03178604732659389, 0.06774836364500303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 146.57142857142858, 104, 361, 113.0, 361.0, 361.0, 361.0, 0.0363343801095222, 0.028599131219018453, 0.01291573667955672], "isController": false}, {"data": ["deleteAccount", 18, 5, 27.77777777777778, 685.7777777777777, 104, 1844, 496.5, 1748.6000000000001, 1844.0, 1844.0, 0.08645242475036861, 0.0177060494483855, 0.05882160692243777], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fbae9d4c-2380-46a0-a0d5-df202e27d875", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62f6de34-1244-4b4c-a261-ac6d5fb81794", 1, 0, 0.0, 1137.0, 1137, 1137, 1137.0, 1137.0, 1137.0, 1137.0, 0.8795074758135445, 0.15889539357959542, 0.6063791776605101], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1401.3043478260868, 818, 2879, 1293.0, 1798.2, 2666.9999999999973, 2879.0, 0.09344161727126102, 0.048363337064226894, 0.04297949388160541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 246.7142857142857, 208, 423, 221.0, 423.0, 423.0, 423.0, 0.03546907856400902, 0.05497014421980695, 0.07977078899698513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=256cac02-0006-4fa7-8301-7db55a5db58f", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 0.8562277843601896, 3.267550355450237], "isController": false}, {"data": ["addBook", 59, 23, 38.983050847457626, 1008.3728813559327, 554, 2559, 790.0, 1960.0, 2080.0, 2559.0, 0.2748494151297615, 73.56555500656843, 0.9991132903667609], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b7e5f205-2725-48e0-8b6b-893494e5afe7", 3, 0, 0.0, 621.6666666666667, 220, 1248, 397.0, 1248.0, 1248.0, 1248.0, 0.0472329371014721, 0.030366227465952925, 0.030289350940722663], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 201.25454545454545, 101, 453, 113.0, 427.4, 437.59999999999997, 453.0, 0.24236655517805128, 0.180118113760251, 0.11715961407532753], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 701.690909090909, 499, 1012, 653.0, 915.9999999999999, 985.5999999999999, 1012.0, 0.2422501960024313, 71.22960108825394, 0.12183481537231652], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 158.2545454545455, 101, 331, 109.0, 318.0, 323.79999999999995, 331.0, 0.24270559370201047, 0.42947513260551073, 0.11803455631211057], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1018.1818181818187, 693, 1904, 987.0, 1288.0, 1392.0, 1904.0, 0.24185285672197035, 217.61962561040363, 0.12139879722177027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 114.6111111111111, 109, 134, 114.0, 121.40000000000002, 134.0, 134.0, 0.10875804356363855, 0.08124990559197608, 0.038660085798012146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 23, 13.294797687861271, 162.86127167630045, 100, 1209, 114.0, 294.39999999999986, 353.29999999999984, 750.9399999999944, 0.7247560755924776, 1.5804127077389705, 0.34653299918098374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 117.39999999999999, 109, 151, 113.5, 147.70000000000002, 151.0, 151.0, 0.06112843083318051, 0.04733871645577358, 0.021729246897732136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 115.00000000000001, 109, 126, 114.0, 122.5, 126.0, 126.0, 0.08546552000427328, 0.06935727258159285, 0.030380321564019014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4e86247-7063-4f11-96b3-c676f1b3e057", 3, 0, 0.0, 478.0, 195, 1011, 228.0, 1011.0, 1011.0, 1011.0, 0.05478251342171579, 0.0352198776067346, 0.03513071335962894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 376.59999999999997, 212, 708, 220.5, 702.9, 708.0, 708.0, 0.05954188473881952, 0.0922782920708072, 0.13391109429052866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 349.4, 215, 663, 229.5, 646.0000000000002, 662.75, 663.0, 0.11870633832493487, 0.18397163957194493, 0.266973337072583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e74ef680-b2e7-4f4e-b239-b806332257cf", 3, 0, 0.0, 289.3333333333333, 221, 411, 236.0, 411.0, 411.0, 411.0, 0.09248127254231019, 0.0418453674589229, 0.05930602438422886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fbae9d4c-2380-46a0-a0d5-df202e27d875", 3, 0, 0.0, 472.0, 220, 782, 414.0, 782.0, 782.0, 782.0, 0.03240405698793489, 0.03249899074864173, 0.020779945399163974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4406334-faea-4d43-9145-a0e7801e4818", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 0.8856081495098039, 3.379672181372549], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 133.45454545454544, 107, 312, 114.0, 274.60000000000014, 312.0, 312.0, 0.10616940776773995, 0.08802522186993282, 0.03773990666743881], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d4c633c-f09b-42b4-a012-02c5eb39e3c2", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b85c721a-87f5-4a90-b916-78cad10a2e4a", 1, 0, 0.0, 919.0, 919, 919, 919.0, 919.0, 919.0, 919.0, 1.088139281828074, 0.19658766322089227, 0.7502210282916213], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 129.41176470588235, 107, 327, 115.0, 184.59999999999988, 327.0, 327.0, 0.07585289891931929, 0.0588897017977137, 0.026963335162726778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88163ac8-bfec-4d30-8c40-532f1384cd48", 3, 0, 0.0, 268.0, 198, 408, 198.0, 408.0, 408.0, 408.0, 0.033407944409180504, 0.027850828656221113, 0.02142371435093932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa65f1b7-46d1-4774-8878-6b2cbc36a7a2", 3, 0, 0.0, 389.0, 231, 674, 262.0, 674.0, 674.0, 674.0, 0.030796078632654107, 0.025372680670327975, 0.019748787404403837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=835b16d4-9682-4b16-b123-4f2a0cff78a0", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 132.88888888888886, 106, 324, 110.0, 304.20000000000005, 324.0, 324.0, 0.10866218736983176, 0.08075383260590036, 0.05454332451962258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 131.22222222222223, 101, 322, 108.5, 318.4, 322.0, 322.0, 0.10866153140318258, 0.029075448832492214, 0.06197102962837757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 130.44444444444446, 104, 312, 109.0, 303.0, 312.0, 312.0, 0.10852722526031461, 0.02925147868344417, 0.06380213828780214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 142.44444444444443, 104, 330, 109.5, 304.80000000000007, 330.0, 330.0, 0.10853769574471935, 0.029254300806193883, 0.06391428763092359], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 18.51851851851852, 0.7473841554559043], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 6, 11.11111111111111, 0.4484304932735426], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 9.25925925925926, 0.37369207772795215], "isController": false}, {"data": ["401/Unauthorized", 33, 61.111111111111114, 2.4663677130044843], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1338, 54, "401/Unauthorized", 33, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 11, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 28, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 23, "401/Unauthorized", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
