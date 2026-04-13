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

    var data = {"OkPercent": 98.29250185597624, "KoPercent": 1.7074981440237564};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8197823303457106, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.35344827586206895, 500, 1500, "see books"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d5e7462-43b3-4e21-9fdb-accf55c4d969"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bca2923b-90f2-47a8-b3f4-1bbfe77cc3ab"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0c63dd0-473c-4fea-9d30-2debba6ca7ac"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afc719d1-ee1e-4c32-8644-14428277f5fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4ce8f318-5deb-4898-b2d2-196954bba874"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e32bbeb-2af7-4400-9d86-128e7605ab0c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f117ced-6aa2-446b-888d-9b8777136f06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8cfcfb8-9042-46fd-953c-ed26ad51aeb1"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a1a02ff9-f372-44bd-95e4-ce66ba30877c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f769f227-8372-47f0-928c-0369ef5796d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4b7add57-59b6-4a41-ba21-93ed4d50e767"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bca2923b-90f2-47a8-b3f4-1bbfe77cc3ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d05e9837-e37f-4fa6-a566-e8c3d5365406"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f8dd91a8-04f1-4260-bcff-bfa57f144078"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63ea4079-0e31-49ae-aef8-c9e972549418"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2d5e7462-43b3-4e21-9fdb-accf55c4d969"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ce8f318-5deb-4898-b2d2-196954bba874"], "isController": false}, {"data": [0.3870967741935484, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c8cfcfb8-9042-46fd-953c-ed26ad51aeb1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a2886b9-a0a0-4043-991d-080bdd5333e2"], "isController": false}, {"data": [0.8189655172413793, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9395604395604396, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/afc719d1-ee1e-4c32-8644-14428277f5fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/63ea4079-0e31-49ae-aef8-c9e972549418"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0c63dd0-473c-4fea-9d30-2debba6ca7ac"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f769f227-8372-47f0-928c-0369ef5796d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d05e9837-e37f-4fa6-a566-e8c3d5365406"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9e32bbeb-2af7-4400-9d86-128e7605ab0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f117ced-6aa2-446b-888d-9b8777136f06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1347, 23, 1.7074981440237564, 298.4647364513732, 80, 2309, 95.0, 827.2000000000003, 1019.7999999999997, 1414.6399999999999, 5.388625080509339, 730.9829971526697, 3.9504113727192354], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1381.8793103448272, 996, 1794, 1351.5, 1698.4, 1755.55, 1794.0, 0.24888003982080636, 299.485994329397, 1.2237412114235937], "isController": true}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 480.23076923076917, 89, 1045, 413.0, 969.8, 1045.0, 1045.0, 0.08595495960116899, 0.017039899217809868, 0.057789730200605655], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 480.23076923076917, 89, 1045, 413.0, 969.8, 1045.0, 1045.0, 0.08668226947517219, 0.017184082718222613, 0.058278719336147165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d5e7462-43b3-4e21-9fdb-accf55c4d969", 1, 0, 0.0, 1047.0, 1047, 1047, 1047.0, 1047.0, 1047.0, 1047.0, 0.9551098376313276, 0.17255402340019102, 0.6585034622731615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 122.84615384615384, 82, 259, 84.0, 255.4, 259.0, 259.0, 0.09776861928147586, 0.0374564271586183, 0.05512704750050764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 86.07692307692308, 81, 98, 85.0, 94.0, 98.0, 98.0, 0.09775759125295153, 0.07264992865575792, 0.04906972842189169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 153.23076923076925, 81, 656, 85.0, 491.59999999999985, 656.0, 656.0, 0.09776714873391543, 2.235615655716746, 0.056925568647579514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 196.69230769230768, 84, 871, 87.0, 623.3999999999999, 871.0, 871.0, 0.09776714873391543, 6.791328300675346, 0.05683009291639405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bca2923b-90f2-47a8-b3f4-1bbfe77cc3ab", 3, 0, 0.0, 872.0, 197, 2221, 198.0, 2221.0, 2221.0, 2221.0, 0.021798365122615803, 0.025764929609445958, 0.013978769300635786], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 194.92307692307693, 85, 342, 182.0, 312.79999999999995, 342.0, 342.0, 0.08628299494912622, 0.21312133089860422, 0.0557676448724671], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 96.625, 84, 254, 86.0, 139.2000000000001, 254.0, 254.0, 0.07620680622038056, 0.05663415970088828, 0.038252244528589455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 126.18749999999999, 83, 257, 85.0, 253.5, 257.0, 257.0, 0.07620680622038056, 0.020391274320687765, 0.04346169417256079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 631.0, 488, 688, 660.0, 688.0, 688.0, 688.0, 0.05708870442894169, 16.7859746254981, 0.03255840174463081], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 832.6, 722, 977, 808.0, 977.0, 977.0, 977.0, 0.05693334244266813, 51.22872160805379, 0.03241419789460499], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 152.4, 83, 254, 88.0, 254.0, 254.0, 254.0, 0.057485801007151234, 0.10172292131343559, 0.03183051676860815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 113.33333333333334, 83, 258, 85.5, 248.10000000000002, 258.0, 258.0, 0.08403361344537816, 0.06245076155462185, 0.04218093487394958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 144.05555555555551, 81, 317, 86.0, 265.7000000000001, 317.0, 317.0, 0.08403518272983623, 0.02949802692393882, 0.04753422391174438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 176.7777777777778, 82, 992, 85.0, 403.40000000000094, 992.0, 992.0, 0.08403557506010878, 4.2222450993837395, 0.04900251523144798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 138.83333333333334, 80, 486, 84.5, 354.6000000000002, 486.0, 486.0, 0.08403635973164389, 1.3941409587381473, 0.04908503954377594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0c63dd0-473c-4fea-9d30-2debba6ca7ac", 3, 0, 0.0, 278.6666666666667, 182, 398, 256.0, 398.0, 398.0, 398.0, 0.0237309855478298, 0.028049221524794925, 0.015218112476961167], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afc719d1-ee1e-4c32-8644-14428277f5fc", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 83.8, 82, 86, 83.0, 86.0, 86.0, 86.0, 0.0574838183051471, 0.042719907939664986, 0.03227851125533163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 102.81250000000001, 83, 348, 85.0, 172.30000000000018, 348.0, 348.0, 0.0762071691894415, 0.020540213570591652, 0.044801480324261504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 606.5625000000001, 84, 1056, 823.5, 1053.9, 1056.0, 1056.0, 0.08803785627819963, 49.51928450327391, 0.047028034554858586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 95.68749999999999, 82, 246, 85.0, 138.9000000000001, 246.0, 246.0, 0.07620825811737024, 0.020540507070697447, 0.04487654262184986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 432.3125, 83, 680, 511.0, 676.5, 680.0, 680.0, 0.08795896714182834, 16.173175916559927, 0.047071791009494074], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 481.6923076923077, 92, 1047, 426.0, 987.4, 1047.0, 1047.0, 0.08667186697868538, 0.017182020504563605, 0.05880561167003353], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4ce8f318-5deb-4898-b2d2-196954bba874", 3, 0, 0.0, 396.6666666666667, 189, 590, 411.0, 590.0, 590.0, 590.0, 0.018183471224656786, 0.025067383019668453, 0.01166062445070764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 319.77777777777777, 169, 1250, 181.0, 651.5000000000009, 1250.0, 1250.0, 0.08399988800014933, 5.705899293175943, 0.18772370803505595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e32bbeb-2af7-4400-9d86-128e7605ab0c", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.3158462631118881, 1.2053376311188813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f117ced-6aa2-446b-888d-9b8777136f06", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.33149369266055045, 1.265051605504587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8cfcfb8-9042-46fd-953c-ed26ad51aeb1", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 632.1, 220, 1540, 516.0, 1454.1000000000013, 1538.7, 1540.0, 0.08808787646556204, 0.05410866630550638, 0.0398287957065969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 97.3125, 83, 250, 87.0, 140.1000000000001, 250.0, 250.0, 0.088036887455844, 0.06542585093154032, 0.0441903907737342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 169.625, 84, 263, 168.0, 259.5, 263.0, 263.0, 0.08795751651952106, 0.10610304910228359, 0.045546360482886766], "isController": false}, {"data": ["login", 20, 0, 0.0, 2436.350000000001, 1398, 3603, 2210.5, 3394.5000000000005, 3593.45, 3603.0, 0.08855121359438231, 26.605942844895907, 0.17031407731849216], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a1a02ff9-f372-44bd-95e4-ce66ba30877c", 1, 0, 0.0, 340.0, 340, 340, 340.0, 340.0, 340.0, 340.0, 2.941176470588235, 0.9392233455882353, 1.7549402573529411], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 89.50000000000001, 85, 106, 88.0, 99.7, 106.0, 106.0, 0.07545746085644219, 0.06108812016600642, 0.02682276928881343], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f769f227-8372-47f0-928c-0369ef5796d2", 3, 0, 0.0, 263.6666666666667, 170, 406, 215.0, 406.0, 406.0, 406.0, 0.02244265900623906, 0.0225084089837964, 0.01439193953199575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b7add57-59b6-4a41-ba21-93ed4d50e767", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bca2923b-90f2-47a8-b3f4-1bbfe77cc3ab", 1, 0, 0.0, 898.0, 898, 898, 898.0, 898.0, 898.0, 898.0, 1.1135857461024499, 0.20118492483296213, 0.7677651726057906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d05e9837-e37f-4fa6-a566-e8c3d5365406", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8dd91a8-04f1-4260-bcff-bfa57f144078", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 1.116559222027972, 2.0862926136363638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 725.3125, 171, 1145, 910.5, 1141.5, 1145.0, 1145.0, 0.08791546927629085, 65.78701043790146, 0.1836652027825246], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63ea4079-0e31-49ae-aef8-c9e972549418", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d5e7462-43b3-4e21-9fdb-accf55c4d969", 3, 0, 0.0, 379.3333333333333, 269, 467, 402.0, 467.0, 467.0, 467.0, 0.038442809913119255, 0.024715022649222176, 0.024652452971629206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 321.38461538461536, 167, 957, 332.0, 710.5999999999998, 957.0, 957.0, 0.09769514605424334, 9.130327673277371, 0.21779588712828873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 548.2222222222223, 85, 1063, 806.0, 1063.0, 1063.0, 1063.0, 0.09071300421311508, 60.30206013012277, 0.14035120736488801], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 989.913043478261, 178, 1552, 1009.0, 1408.6, 1523.3999999999996, 1552.0, 0.09104764166815113, 0.02868433683668824, 0.04107813520574788], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 241.43749999999997, 170, 500, 174.5, 453.80000000000007, 500.0, 500.0, 0.07617451581573384, 0.1180556216792672, 0.17131827140979985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 99.83333333333334, 84, 262, 89.0, 119.80000000000022, 262.0, 262.0, 0.09638915514905512, 0.07483337728857306, 0.03426333249439069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 260.21052631578954, 168, 606, 174.0, 428.0, 606.0, 606.0, 0.13798512665582152, 0.2138499960964734, 0.3103317838753486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 102.5, 83, 246, 86.5, 230.60000000000005, 246.0, 246.0, 0.0474732369626623, 0.03528040364119727, 0.023829339647273847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 100.6, 82, 248, 84.5, 231.80000000000007, 248.0, 248.0, 0.04747413846307224, 0.019833434018068658, 0.026676386007472432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 185.89999999999998, 82, 924, 86.0, 856.7000000000003, 924.0, 924.0, 0.047473687708587516, 4.283206843154057, 0.027501358934310657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 176.4, 84, 664, 87.0, 622.8000000000002, 664.0, 664.0, 0.0474743638435245, 1.4074201688900494, 0.027548112300607674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 92.5, 92, 93, 92.5, 93.0, 93.0, 93.0, 0.07137758743754462, 0.021050811920057103, 0.04412305942184154], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 941.2068965517242, 649, 1438, 899.0, 1338.8, 1407.1, 1438.0, 0.2550964308490753, 305.1840171640314, 0.5037158038836232], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 989.913043478261, 178, 1552, 1009.0, 1408.6, 1523.3999999999996, 1552.0, 0.0935263500325309, 0.029465247844827586, 0.04219645870608328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 117.19999999999999, 83, 248, 85.5, 247.8, 248.0, 248.0, 0.07023162389560772, 0.018929617378113016, 0.04135709883696431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 149.99999999999997, 82, 253, 86.0, 252.4, 253.0, 253.0, 0.07015180851362349, 0.01890810463843758, 0.04124159055195443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 130.88888888888889, 82, 253, 86.0, 253.0, 253.0, 253.0, 0.09428674695008564, 0.02541322476389027, 0.05543029459370269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 120.83333333333334, 82, 253, 85.0, 251.2, 253.0, 253.0, 0.09428773473717295, 0.025413491003378644, 0.055522953170425084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 94.77777777777777, 83, 255, 85.0, 105.60000000000024, 255.0, 255.0, 0.09428674695008564, 0.07007052190333513, 0.04732752727767971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 116.8, 82, 250, 84.0, 249.6, 250.0, 250.0, 0.07015033216182279, 0.01877069434798774, 0.04000761131103956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 121.49999999999999, 81, 254, 85.0, 253.1, 254.0, 254.0, 0.09428674695008564, 0.025229070961253385, 0.053772910369970714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 120.6, 83, 251, 87.0, 250.5, 251.0, 251.0, 0.070230144182486, 0.05219251926061704, 0.03525224034159942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 105.8, 86, 252, 89.0, 236.50000000000006, 252.0, 252.0, 0.0689445961225559, 0.0542669379636524, 0.024507649402939796], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 604.5384615384614, 87, 2221, 415.0, 1719.3999999999996, 2221.0, 2221.0, 0.08841793115643852, 0.01715621365512926, 0.06016962427480293], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1370.6000000000001, 962, 2309, 1224.5, 1923.9000000000005, 2290.8999999999996, 2309.0, 0.08863990923273295, 0.045878078020848104, 0.04077089575060275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 272.4, 169, 498, 186.0, 497.7, 498.0, 498.0, 0.07010705347064969, 0.10865224009562602, 0.15767240638955685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ce8f318-5deb-4898-b2d2-196954bba874", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["addBook", 62, 9, 14.516129032258064, 859.2258064516128, 431, 2328, 706.5, 1465.7, 1540.95, 2328.0, 0.29800385482405756, 75.87893112746394, 1.0876708865855007], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c8cfcfb8-9042-46fd-953c-ed26ad51aeb1", 3, 0, 0.0, 429.33333333333337, 197, 865, 226.0, 865.0, 865.0, 865.0, 0.023444826508283837, 0.02366614811269147, 0.015034605540794], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 152.84482758620686, 83, 350, 87.0, 341.1, 348.05, 350.0, 0.2560118648257354, 0.19025881751209436, 0.12375573543822169], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a2886b9-a0a0-4043-991d-080bdd5333e2", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 1.1915520055970148, 2.226416744402985], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 525.8275862068965, 405, 755, 495.0, 668.5, 737.5, 755.0, 0.255878590020735, 75.23680143490537, 0.12868893931706887], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 125.22413793103448, 83, 348, 87.0, 256.0, 259.1, 348.0, 0.25634339407493184, 0.45360764654665675, 0.12466700219659771], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 786.9310344827587, 565, 1096, 801.5, 1015.6, 1061.7, 1096.0, 0.25552799573532586, 229.92453973295122, 0.12826307598433348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 95.0, 84, 199, 88.0, 101.0, 199.0, 199.0, 0.13690634885178807, 0.10227866881993933, 0.048665928693409036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 9, 4.945054945054945, 146.29670329670316, 84, 1142, 90.0, 230.0, 294.2999999999999, 1053.1899999999987, 0.7789561986937504, 1.6219239990733847, 0.3755096518878988], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 89.4, 84, 94, 89.5, 93.8, 94.0, 94.0, 0.049076141633744755, 0.03800525421441366, 0.017445034721370208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afc719d1-ee1e-4c32-8644-14428277f5fc", 3, 0, 0.0, 471.33333333333337, 180, 967, 267.0, 967.0, 967.0, 967.0, 0.01663967341867637, 0.02293913311461407, 0.010670623904554833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 100.6923076923077, 84, 257, 87.0, 192.99999999999994, 257.0, 257.0, 0.09379441706769792, 0.07611636775708688, 0.03334098419203325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63ea4079-0e31-49ae-aef8-c9e972549418", 3, 0, 0.0, 348.6666666666667, 165, 453, 428.0, 453.0, 453.0, 453.0, 0.01994601279204287, 0.02749718885882212, 0.01279090013031395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0c63dd0-473c-4fea-9d30-2debba6ca7ac", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 307.4, 171, 1011, 176.5, 959.7000000000002, 1011.0, 1011.0, 0.047453637795873437, 5.7432943190284345, 0.10551019778676234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 254.3333333333333, 169, 510, 175.0, 358.80000000000024, 510.0, 510.0, 0.09424429167561114, 0.14606024500897938, 0.21195762082903563], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f769f227-8372-47f0-928c-0369ef5796d2", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.4804895279255319, 1.8336519281914894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d05e9837-e37f-4fa6-a566-e8c3d5365406", 3, 0, 0.0, 261.6666666666667, 177, 415, 193.0, 415.0, 415.0, 415.0, 0.044057392096103855, 0.028324658004493852, 0.028252950009545766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 97.11111111111109, 85, 249, 87.0, 115.80000000000021, 249.0, 249.0, 0.08536874555371117, 0.07077936032724685, 0.030345921271045767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 90.0, 85, 106, 88.5, 99.7, 106.0, 106.0, 0.08601040725927837, 0.06677565797961553, 0.03057401195544661], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e32bbeb-2af7-4400-9d86-128e7605ab0c", 3, 0, 0.0, 358.66666666666663, 177, 631, 268.0, 631.0, 631.0, 631.0, 0.02178570131803493, 0.025749961421153912, 0.013970648306161721], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f117ced-6aa2-446b-888d-9b8777136f06", 3, 0, 0.0, 291.3333333333333, 171, 361, 342.0, 361.0, 361.0, 361.0, 0.021444654919761247, 0.02956318801601201, 0.013751943421852103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 99.2105263157895, 82, 354, 85.0, 88.0, 354.0, 354.0, 0.13823811879747389, 0.10273360195788832, 0.06938905572451326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 128.00000000000003, 81, 254, 85.0, 253.0, 254.0, 254.0, 0.13823711302702898, 0.03698922750918549, 0.07883835352322748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 128.10526315789474, 81, 252, 85.0, 252.0, 252.0, 252.0, 0.138069354416766, 0.03721400568264396, 0.08116967906141906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 124.36842105263159, 82, 339, 84.0, 255.0, 339.0, 339.0, 0.1380703577475638, 0.037214276111648056, 0.08130510324392673], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 26.08695652173913, 0.44543429844098], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.14847809948032664], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.695652173913043, 0.14847809948032664], "isController": false}, {"data": ["401/Unauthorized", 13, 56.52173913043478, 0.9651076466221232], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1347, 23, "401/Unauthorized", 13, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
