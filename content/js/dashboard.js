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

    var data = {"OkPercent": 98.72, "KoPercent": 1.28};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7453544390915348, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81a8adf0-0495-4bb8-88cd-1e1d8b8d5691"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9f8310c6-9913-446e-99b7-1c9d6c830991"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c91d8f4b-f46c-4bae-b473-ada42fc9efbe"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51fb5363-7162-46b1-93fb-6a4991e39822"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4aef6f3-59e3-4c9b-a21e-53d59d875c1a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/871fcacb-3819-43e3-8cac-55010da51484"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc15eaab-a06a-45f7-9c58-a2e94e29b49d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=46101071-4619-4f10-a488-7473239195f6"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aacb5466-ba56-4629-80e1-9b4e70ebfd9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/584af85a-0e2c-49fe-a08c-571c5f05a5e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb523ad1-b1f3-4c4f-9354-19d3ff9450a1"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b5fbbb7c-9045-44df-8888-eee5135781cb"], "isController": false}, {"data": [0.5952380952380952, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cc15eaab-a06a-45f7-9c58-a2e94e29b49d"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f45ca44c-94e3-45b8-9709-4dba8e044934"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8275e35-118f-4dd0-a9dc-f1ffd936ef97"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "register"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c91d8f4b-f46c-4bae-b473-ada42fc9efbe"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a4aef6f3-59e3-4c9b-a21e-53d59d875c1a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=871fcacb-3819-43e3-8cac-55010da51484"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/51fb5363-7162-46b1-93fb-6a4991e39822"], "isController": false}, {"data": [0.23529411764705882, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aacb5466-ba56-4629-80e1-9b4e70ebfd9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=584af85a-0e2c-49fe-a08c-571c5f05a5e9"], "isController": false}, {"data": [0.30833333333333335, 500, 1500, "addBook"], "isController": true}, {"data": [0.9019607843137255, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3627450980392157, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9385964912280702, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f8310c6-9913-446e-99b7-1c9d6c830991"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f45ca44c-94e3-45b8-9709-4dba8e044934"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/46101071-4619-4f10-a488-7473239195f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b3c417d1-95b3-4da0-a851-585918ae9db3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb523ad1-b1f3-4c4f-9354-19d3ff9450a1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e8275e35-118f-4dd0-a9dc-f1ffd936ef97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1250, 16, 1.28, 450.2624, 125, 2483, 150.0, 1275.6000000000004, 1534.9, 1943.3000000000006, 4.829014262976528, 668.6586237321424, 3.530239558946812], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/81a8adf0-0495-4bb8-88cd-1e1d8b8d5691", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["see books", 51, 0, 0.0, 2236.607843137255, 1700, 2776, 2215.0, 2668.0, 2726.4, 2776.0, 0.24144183382174017, 290.53582962787186, 1.1871676106371698], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9f8310c6-9913-446e-99b7-1c9d6c830991", 3, 0, 0.0, 427.6666666666667, 255, 557, 471.0, 557.0, 557.0, 557.0, 0.022304335219288787, 0.02236967995137655, 0.014303235801431939], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c91d8f4b-f46c-4bae-b473-ada42fc9efbe", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51fb5363-7162-46b1-93fb-6a4991e39822", 1, 0, 0.0, 747.0, 747, 747, 747.0, 747.0, 747.0, 747.0, 1.3386880856760375, 0.241852827978581, 0.9229626840696118], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 567.5384615384615, 145, 1188, 525.0, 1015.9999999999998, 1188.0, 1188.0, 0.06687724424598479, 0.012670102913790088, 0.045209459207453215], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 567.5384615384615, 145, 1188, 525.0, 1015.9999999999998, 1188.0, 1188.0, 0.06588015892321415, 0.012481201983499553, 0.04453542293795103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4aef6f3-59e3-4c9b-a21e-53d59d875c1a", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 156.57894736842104, 125, 380, 129.0, 380.0, 380.0, 380.0, 0.09584100481727156, 0.02564495636712149, 0.05465932305985018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 148.94736842105263, 128, 383, 137.0, 145.0, 383.0, 383.0, 0.09583907106719328, 0.07122415340052157, 0.04810672121927475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 213.78947368421052, 126, 565, 130.0, 423.0, 565.0, 565.0, 0.09584052137243626, 0.025832015526164463, 0.05643733826912018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 159.63157894736847, 126, 387, 134.0, 376.0, 387.0, 387.0, 0.09583375365681429, 0.025830191415313227, 0.056339765333400585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/871fcacb-3819-43e3-8cac-55010da51484", 3, 0, 0.0, 452.33333333333337, 249, 764, 344.0, 764.0, 764.0, 764.0, 0.1017984390906006, 0.046061142687478795, 0.06528090006786563], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 280.2307692307692, 144, 557, 246.0, 471.79999999999995, 557.0, 557.0, 0.06698165217973753, 0.1451688436777049, 0.04329755987129218], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc15eaab-a06a-45f7-9c58-a2e94e29b49d", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 153.85714285714286, 127, 378, 141.5, 261.5, 378.0, 378.0, 0.20155485171321624, 0.14978832241577889, 0.1011710876763605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 170.35714285714286, 126, 381, 141.0, 380.0, 381.0, 381.0, 0.20084930563525766, 0.07529046934178814, 0.11334199794846782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 855.5, 750, 1001, 812.0, 1001.0, 1001.0, 1001.0, 0.10523915598196902, 30.94380612754986, 0.06001920614596671], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=46101071-4619-4f10-a488-7473239195f6", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1480.1666666666667, 1374, 1681, 1387.0, 1681.0, 1681.0, 1681.0, 0.10452597470471413, 94.05265577636668, 0.0595103938016097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 262.6666666666667, 132, 398, 263.0, 398.0, 398.0, 398.0, 0.1063924106747052, 0.18826469545172445, 0.058910641457576025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aacb5466-ba56-4629-80e1-9b4e70ebfd9f", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 133.6923076923077, 126, 143, 130.0, 143.0, 143.0, 143.0, 0.08255750447715698, 0.061353770417105914, 0.041439997364510435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 233.07692307692312, 126, 416, 141.0, 402.8, 416.0, 416.0, 0.08255855306609765, 0.04116764387415536, 0.04601746272163796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 351.1538461538462, 125, 1420, 137.0, 1406.8, 1420.0, 1420.0, 0.08237702061326524, 11.422323915158005, 0.047339558871054614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 293.0769230769231, 125, 1053, 141.0, 930.1999999999999, 1053.0, 1053.0, 0.08255068929825564, 3.753079775716127, 0.04751997686993186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/584af85a-0e2c-49fe-a08c-571c5f05a5e9", 3, 0, 0.0, 462.0, 250, 818, 318.0, 818.0, 818.0, 818.0, 0.021527907343886793, 0.02544525767111098, 0.013805331206854484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 184.5, 127, 422, 140.0, 422.0, 422.0, 422.0, 0.10685282803818208, 0.07940918177446929, 0.06000036730659638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1174.8571428571427, 126, 1857, 1442.5, 1846.5, 1857.0, 1857.0, 0.06429982087907041, 41.33144584175355, 0.03385428627198824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 231.3571428571429, 126, 1242, 139.5, 812.5, 1242.0, 1242.0, 0.2015809707563606, 13.006373760816981, 0.1172701796950368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 763.4285714285714, 139, 1396, 839.0, 1228.5, 1396.0, 1396.0, 0.06438143239489731, 13.526585651448121, 0.03396012777414993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 241.5, 126, 1120, 135.0, 772.0, 1120.0, 1120.0, 0.20158677590750046, 4.284253327981684, 0.1174704189405175], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 602.4166666666666, 376, 1073, 475.0, 1014.5000000000002, 1073.0, 1073.0, 0.06567281802062128, 0.011864718099428647, 0.04527832961187365], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fb523ad1-b1f3-4c4f-9354-19d3ff9450a1", 3, 0, 0.0, 367.6666666666667, 317, 456, 330.0, 456.0, 456.0, 456.0, 0.021957271150341434, 0.02595275115458651, 0.014080671929092653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 570.0769230769231, 266, 1562, 514.0, 1543.2, 1562.0, 1562.0, 0.08230973787514245, 15.257332936953906, 0.1818765729865772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5fbbb7c-9045-44df-8888-eee5135781cb", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.5068824404761905, 0.9471106150793651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 757.9523809523811, 203, 1336, 698.0, 1184.8, 1322.1, 1336.0, 0.09296889526389884, 0.057106870235344116, 0.04203574072967301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 139.5, 129, 147, 141.0, 145.0, 147.0, 147.0, 0.0643817284654615, 0.04784618687716426, 0.03231660979613986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 324.07142857142856, 126, 575, 379.5, 530.5, 575.0, 575.0, 0.06431163581239377, 0.08620343148513943, 0.032819749414304746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc15eaab-a06a-45f7-9c58-a2e94e29b49d", 3, 0, 0.0, 344.6666666666667, 229, 563, 242.0, 563.0, 563.0, 563.0, 0.05014374540349001, 0.03282521875208932, 0.03215598256669118], "isController": false}, {"data": ["login", 21, 0, 0.0, 2848.9047619047615, 1740, 4628, 2756.0, 3710.0, 4537.199999999999, 4628.0, 0.09302696453014737, 31.924393580474966, 0.18443166754156312], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 179.57142857142856, 129, 425, 144.0, 403.0, 425.0, 425.0, 0.2179293597546738, 0.1764291398795162, 0.0774670771002942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f45ca44c-94e3-45b8-9709-4dba8e044934", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8275e35-118f-4dd0-a9dc-f1ffd936ef97", 1, 0, 0.0, 864.0, 864, 864, 864.0, 864.0, 864.0, 864.0, 1.1574074074074074, 0.20910192418981483, 0.7979781539351852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1347.4999999999998, 285, 2000, 1580.5, 1989.5, 2000.0, 2000.0, 0.06425761797010185, 54.93877525553878, 0.13277337887209523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 392.9473684210526, 255, 807, 286.0, 707.0, 807.0, 807.0, 0.09576950799675392, 0.14842403241293795, 0.21538786808254323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 1, 14.285714285714286, 1448.0, 144, 1811, 1527.0, 1811.0, 1811.0, 1811.0, 0.10218083087612764, 104.78430379273348, 0.20691333149651125], "isController": false}, {"data": ["register", 21, 6, 28.571428571428573, 1171.2857142857144, 210, 2483, 1213.0, 2061.4, 2447.1999999999994, 2483.0, 0.09597323717728999, 0.030152306099784743, 0.043300425367097634], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 177.33333333333337, 128, 505, 143.5, 433.9000000000001, 505.0, 505.0, 0.08667722844746638, 0.06729335607005446, 0.030811046049685313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 445.2857142857143, 270, 1620, 284.5, 1086.5, 1620.0, 1620.0, 0.2004524498152974, 17.41781617347012, 0.4471588549869706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 481.3157894736842, 257, 1259, 532.0, 793.0, 1259.0, 1259.0, 0.10003948927208109, 6.445934661708569, 0.22364399598525733], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c91d8f4b-f46c-4bae-b473-ada42fc9efbe", 3, 0, 0.0, 340.6666666666667, 229, 448, 345.0, 448.0, 448.0, 448.0, 0.024535060601599684, 0.028999611017060046, 0.01573374654464563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4aef6f3-59e3-4c9b-a21e-53d59d875c1a", 3, 0, 0.0, 441.0, 246, 579, 498.0, 579.0, 579.0, 579.0, 0.027667364499082366, 0.027748421231013273, 0.017742417989320396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 132.77777777777777, 127, 143, 129.0, 143.0, 143.0, 143.0, 0.043339657713014415, 0.032208476093363254, 0.02175447662547794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=871fcacb-3819-43e3-8cac-55010da51484", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.4804895279255319, 1.8336519281914894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 205.88888888888889, 127, 507, 133.0, 507.0, 507.0, 507.0, 0.04333903161341584, 0.011596576818433535, 0.02471679146702622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 163.55555555555554, 127, 380, 141.0, 380.0, 380.0, 380.0, 0.04333736210292142, 0.011680773379303039, 0.02547762889253779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 130.77777777777774, 126, 140, 128.0, 140.0, 140.0, 140.0, 0.043340492540619675, 0.011681617130088896, 0.02552179394725944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51fb5363-7162-46b1-93fb-6a4991e39822", 3, 0, 0.0, 422.6666666666667, 321, 609, 338.0, 609.0, 609.0, 609.0, 0.019129237126023414, 0.022610110678577804, 0.012267121464279338], "isController": false}, {"data": ["https://demoqa.com/books", 51, 0, 0.0, 1536.686274509804, 1020, 2224, 1521.0, 2067.6000000000004, 2151.6, 2224.0, 0.23659525510535445, 283.0501789251617, 0.46718320881154957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, 28.571428571428573, 1171.2857142857144, 210, 2483, 1213.0, 2061.4, 2447.1999999999994, 2483.0, 0.0935712121482168, 0.02939765203094088, 0.042216699230933755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 245.0, 125, 422, 129.0, 422.0, 422.0, 422.0, 0.04225435431121177, 0.011388868935443797, 0.024882202782871773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 311.6, 128, 480, 383.0, 480.0, 480.0, 480.0, 0.042148209965522765, 0.011360259717269807, 0.024778537499262406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 236.72222222222223, 127, 1376, 141.0, 517.4000000000013, 1376.0, 1376.0, 0.0842984727926679, 4.235454013134171, 0.04915581518964815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 218.4444444444444, 126, 1117, 137.0, 490.600000000001, 1117.0, 1117.0, 0.08429531458543096, 1.398436951202379, 0.049236293230617935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 134.6111111111111, 126, 149, 131.5, 145.4, 149.0, 149.0, 0.08430360538419027, 0.0626514098607117, 0.04231645817136113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 135.6, 127, 143, 139.0, 143.0, 143.0, 143.0, 0.04224899869873084, 0.011304907854933838, 0.02409513207036993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aacb5466-ba56-4629-80e1-9b4e70ebfd9f", 3, 0, 0.0, 311.0, 236, 459, 238.0, 459.0, 459.0, 459.0, 0.04556016219417741, 0.02834162433368263, 0.029216640469573407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 134.38888888888889, 125, 143, 132.5, 143.0, 143.0, 143.0, 0.08430123641813414, 0.029591417080367177, 0.04768471630292244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 137.6, 127, 162, 129.0, 162.0, 162.0, 162.0, 0.04225435431121177, 0.03140191760823453, 0.02120970519136997], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 550.0000000000001, 448, 818, 484.5, 801.8000000000001, 818.0, 818.0, 0.06605746999889904, 0.011934210888472971, 0.0449629458879225], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 205.0, 136, 433, 148.0, 433.0, 433.0, 433.0, 0.043841189674523, 0.03450781140397026, 0.0155841728921156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1381.0, 991, 2347, 1335.0, 1995.8000000000004, 2321.2, 2347.0, 0.09299112598969127, 0.048130172631383174, 0.042772285489399015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 516.0, 269, 642, 555.0, 642.0, 642.0, 642.0, 0.04210278130973332, 0.06525108783061209, 0.09469014194952718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=584af85a-0e2c-49fe-a08c-571c5f05a5e9", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["addBook", 60, 8, 13.333333333333334, 1307.3166666666664, 654, 3375, 1075.5, 2372.9999999999995, 2549.7999999999993, 3375.0, 0.25919046179100613, 78.53220407738995, 0.9428643650913646], "isController": true}, {"data": ["https://demoqa.com/books-0", 51, 0, 0.0, 231.6666666666667, 128, 571, 143.0, 515.8, 566.2, 571.0, 0.23812636572474458, 0.17696695734036194, 0.1151099131188951], "isController": false}, {"data": ["https://demoqa.com/books-3", 51, 0, 0.0, 869.6666666666666, 625, 1392, 787.0, 1146.2, 1258.2, 1392.0, 0.23750424946328696, 69.83413522548933, 0.11944793796249295], "isController": false}, {"data": ["https://demoqa.com/books-1", 51, 0, 0.0, 209.45098039215688, 126, 424, 141.0, 418.40000000000003, 422.4, 424.0, 0.23858867779768617, 0.4221901212591868, 0.11603238431957784], "isController": false}, {"data": ["https://demoqa.com/books-2", 51, 0, 0.0, 1296.8431372549019, 878, 1753, 1286.0, 1575.6000000000001, 1658.8, 1753.0, 0.23719826984791406, 213.43142015923678, 0.11906241279475374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 146.4210526315789, 130, 185, 145.0, 162.0, 185.0, 185.0, 0.10038304054946506, 0.07499318947298904, 0.03568303394531766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 8, 4.678362573099415, 203.625730994152, 127, 1585, 146.0, 344.8, 396.0, 840.5200000000011, 0.6878021703979599, 1.4254502012123016, 0.33410474352219066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 138.33333333333331, 130, 147, 143.0, 147.0, 147.0, 147.0, 0.04363361339648895, 0.03379048381192943, 0.015510386012033181], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f8310c6-9913-446e-99b7-1c9d6c830991", 1, 0, 0.0, 878.0, 878, 878, 878.0, 878.0, 878.0, 878.0, 1.1389521640091116, 0.2057677249430524, 0.7852541287015945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 141.3157894736842, 130, 168, 142.0, 160.0, 168.0, 168.0, 0.09929967596947842, 0.08058401438538727, 0.03529793169227553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f45ca44c-94e3-45b8-9709-4dba8e044934", 3, 0, 0.0, 377.6666666666667, 229, 610, 294.0, 610.0, 610.0, 610.0, 0.025459760847979768, 0.025534349991089084, 0.016326734658372442], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46101071-4619-4f10-a488-7473239195f6", 3, 0, 0.0, 334.0, 249, 452, 301.0, 452.0, 452.0, 452.0, 0.031092271497714718, 0.025920347430223763, 0.019938728792479817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3c417d1-95b3-4da0-a851-585918ae9db3", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 1.1204769736842106, 2.0936129385964914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb523ad1-b1f3-4c4f-9354-19d3ff9450a1", 1, 0, 0.0, 1073.0, 1073, 1073, 1073.0, 1073.0, 1073.0, 1073.0, 0.9319664492078285, 0.16837284482758622, 0.6425471808014912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 344.3333333333333, 258, 635, 278.0, 635.0, 635.0, 635.0, 0.0433100421551077, 0.0671221063478085, 0.09740529988595022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 389.16666666666674, 256, 1503, 282.0, 659.7000000000013, 1503.0, 1503.0, 0.0842444211472218, 5.722509809502303, 0.18827019291972444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8275e35-118f-4dd0-a9dc-f1ffd936ef97", 3, 0, 0.0, 337.0, 225, 452, 334.0, 452.0, 452.0, 452.0, 0.026137413093101466, 0.02621398754552266, 0.016761296807750615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 161.99999999999997, 128, 385, 145.0, 304.99999999999994, 385.0, 385.0, 0.08488798051494355, 0.07038075728240925, 0.03017502432367134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 140.0714285714286, 128, 156, 142.5, 151.0, 156.0, 156.0, 0.06629980773055758, 0.051472995259563746, 0.02356750977922164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 147.42105263157896, 127, 394, 134.0, 148.0, 394.0, 394.0, 0.10011434111590607, 0.07440138045820753, 0.05025270638044504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 276.6842105263158, 125, 425, 380.0, 421.0, 425.0, 425.0, 0.1001153961671611, 0.03470282852340329, 0.056654528772637935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 257.8421052631579, 126, 1130, 140.0, 421.0, 1130.0, 1130.0, 0.10011856145435384, 4.7669783707680145, 0.058405924779343955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 247.1578947368421, 126, 1004, 141.0, 420.0, 1004.0, 1004.0, 0.10011117609555875, 1.5748266001981148, 0.058499381220724074], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 37.5, 0.48], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.08], "isController": false}, {"data": ["401/Unauthorized", 9, 56.25, 0.72], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1250, 16, "401/Unauthorized", 9, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
