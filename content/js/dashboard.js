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

    var data = {"OkPercent": 97.0917225950783, "KoPercent": 2.9082774049217};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.745697896749522, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e6b105b-49e6-47be-8680-b02bf693d6c5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2e4af01b-075d-45cb-a19b-96c518ad46b5"], "isController": false}, {"data": [0.4375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a999ece6-06d2-40ac-b308-b86821e854dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=350927d6-c998-43e4-b7b5-dfc25ee0836a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4df487ef-0d6d-4735-9ccb-40685f0b29ce"], "isController": false}, {"data": [0.6875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.45, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c728dcd7-229c-4851-9122-f1ef3063830e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7b159b3-10eb-4112-a91c-2b5592e42a62"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/70f63bf7-8d65-492d-8d0c-99bda521be7e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/43b2ee8e-7434-412f-a8f0-245c3bd3b66e"], "isController": false}, {"data": [0.0625, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1f9bf06b-bccc-48bc-a9ad-bcfa0ec35d55"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0098483b-c94f-43be-aa1e-202fccce6c98"], "isController": false}, {"data": [0.59375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/19623df3-0593-4f80-85e9-0e7b375fb8a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/072ab324-93cd-42ee-b0f3-02ac5e2e6514"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a999ece6-06d2-40ac-b308-b86821e854dd"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/350927d6-c998-43e4-b7b5-dfc25ee0836a"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8c0516a5-d0af-480c-a61a-7e89980af400"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4df487ef-0d6d-4735-9ccb-40685f0b29ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3958333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.275, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e4af01b-075d-45cb-a19b-96c518ad46b5"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d7b159b3-10eb-4112-a91c-2b5592e42a62"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c728dcd7-229c-4851-9122-f1ef3063830e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=072ab324-93cd-42ee-b0f3-02ac5e2e6514"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f9bf06b-bccc-48bc-a9ad-bcfa0ec35d55"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6e6b105b-49e6-47be-8680-b02bf693d6c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0098483b-c94f-43be-aa1e-202fccce6c98"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70f63bf7-8d65-492d-8d0c-99bda521be7e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43b2ee8e-7434-412f-a8f0-245c3bd3b66e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1341, 39, 2.9082774049217, 417.4093959731547, 133, 2157, 153.0, 1107.1999999999998, 1273.3999999999992, 1756.7599999999984, 5.207584977612433, 737.3769695610154, 3.8121505886687452], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2083.4363636363632, 1636, 2984, 2043.0, 2467.8, 2522.7999999999997, 2984.0, 0.2506654027053633, 301.63467846180316, 1.2325198267788129], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e6b105b-49e6-47be-8680-b02bf693d6c5", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e4af01b-075d-45cb-a19b-96c518ad46b5", 3, 0, 0.0, 443.0, 260, 801, 268.0, 801.0, 801.0, 801.0, 0.02191588682636043, 0.030212819241418103, 0.014054133153623062], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 484.81250000000006, 139, 1114, 507.0, 822.8000000000003, 1114.0, 1114.0, 0.08834556367230423, 0.018484411149210137, 0.05899050699310353], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 484.81250000000006, 139, 1114, 507.0, 822.8000000000003, 1114.0, 1114.0, 0.08920855287000641, 0.018664973098045778, 0.05956674611803407], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a999ece6-06d2-40ac-b308-b86821e854dd", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 249.90476190476193, 133, 451, 146.0, 438.8, 450.2, 451.0, 0.12389672912635107, 0.042013343972719115, 0.070164358598433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 197.57142857142858, 135, 450, 144.0, 435.8, 449.2, 450.0, 0.123901115110036, 0.09207885605345448, 0.06219255192046728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 269.76190476190476, 134, 979, 148.0, 534.4000000000001, 937.1999999999994, 979.0, 0.12369385182654588, 1.7636612680681376, 0.07233306299845677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 227.38095238095238, 133, 940, 142.0, 542.0000000000001, 902.6999999999995, 940.0, 0.1236945804103126, 5.331780570600155, 0.0722126935672928], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=350927d6-c998-43e4-b7b5-dfc25ee0836a", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4df487ef-0d6d-4735-9ccb-40685f0b29ce", 3, 0, 0.0, 362.3333333333333, 234, 526, 327.0, 526.0, 526.0, 526.0, 0.0467013294311778, 0.030024454956567765, 0.029948443678196705], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 300.5, 136, 553, 272.0, 548.1, 553.0, 553.0, 0.08791353703632478, 0.15177748465634047, 0.05681326477908976], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 160.8125, 134, 442, 143.0, 238.3000000000002, 442.0, 442.0, 0.08016634516621991, 0.05957674674950522, 0.04023974747601272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 160.43749999999997, 134, 415, 143.0, 230.2000000000002, 415.0, 415.0, 0.0801623287156492, 0.028974689370976227, 0.045296804153410655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 847.4, 663, 1003, 885.0, 1001.0, 1003.0, 1003.0, 0.06778558065128386, 19.931211404585017, 0.038658963965185325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 1160.0, 944, 1511, 1156.5, 1490.3000000000002, 1511.0, 1511.0, 0.06756711103303356, 60.79700527783596, 0.03846838450415876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 335.6, 134, 622, 424.5, 604.3000000000001, 622.0, 622.0, 0.06796987575106712, 0.1202748192001305, 0.0376356636238819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c728dcd7-229c-4851-9122-f1ef3063830e", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 146.08333333333334, 141, 149, 148.0, 149.0, 149.0, 149.0, 0.062168757091123864, 0.04620158608041529, 0.03120580189925553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 166.99999999999997, 139, 422, 145.5, 339.8000000000003, 422.0, 422.0, 0.062079990067201586, 0.024381350265650623, 0.03497051523805089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 287.25, 136, 1317, 141.5, 1054.200000000001, 1317.0, 1317.0, 0.06179387622686592, 4.6487873032251255, 0.03588550624633099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 285.8333333333333, 136, 735, 150.0, 647.1000000000004, 735.0, 735.0, 0.06197962936181642, 1.5339857388746565, 0.036053905491395165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 167.5, 135, 399, 141.5, 374.1000000000001, 399.0, 399.0, 0.06810272615212787, 0.05061149863454034, 0.03824127689206399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 880.0624999999999, 141, 1365, 1246.0, 1342.6, 1365.0, 1365.0, 0.08077258982164402, 45.432737966777225, 0.043147076789491486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 245.25, 133, 1250, 142.0, 673.2000000000006, 1250.0, 1250.0, 0.08005083227849685, 4.522095163241159, 0.04663117329504236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 698.3124999999999, 141, 1333, 934.0, 1176.9, 1333.0, 1333.0, 0.08077993022633527, 14.85315328875291, 0.04322988453518724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 248.625, 135, 1033, 142.0, 608.1000000000004, 1033.0, 1033.0, 0.08005083227849685, 1.4913278525613765, 0.046709347935939324], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 465.1875, 140, 1283, 452.0, 1236.1000000000001, 1283.0, 1283.0, 0.08888888888888889, 0.018598090277777778, 0.05970052083333333], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 482.0, 282, 1465, 301.0, 1202.800000000001, 1465.0, 1465.0, 0.061747452917567155, 6.243673499086652, 0.13755491342492537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7b159b3-10eb-4112-a91c-2b5592e42a62", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 0.6741196361940298, 2.572586287313433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 374.875, 152, 1045, 366.0, 600.0, 941.75, 1045.0, 0.0986683878818775, 0.06060782810322358, 0.04461275741143484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 162.12499999999994, 136, 442, 142.5, 241.1000000000002, 442.0, 442.0, 0.08089428633543827, 0.060117726466082544, 0.04060513982071804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 193.31249999999997, 135, 426, 142.0, 422.5, 426.0, 426.0, 0.08089633135137321, 0.09758514970877322, 0.041889921581118796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70f63bf7-8d65-492d-8d0c-99bda521be7e", 3, 0, 0.0, 596.3333333333333, 275, 1183, 331.0, 1183.0, 1183.0, 1183.0, 0.03716366879738368, 0.030981821546256377, 0.023832170420197214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43b2ee8e-7434-412f-a8f0-245c3bd3b66e", 3, 0, 0.0, 375.6666666666667, 243, 544, 340.0, 544.0, 544.0, 544.0, 0.02869385568903512, 0.02877791971937409, 0.018400682196419004], "isController": false}, {"data": ["login", 24, 0, 0.0, 2388.875, 1315, 4297, 2393.5, 3318.0, 4113.5, 4297.0, 0.09751935149631255, 48.7398115768676, 0.21451400316937894], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1f9bf06b-bccc-48bc-a9ad-bcfa0ec35d55", 3, 0, 0.0, 337.0, 239, 488, 284.0, 488.0, 488.0, 488.0, 0.019424893648707274, 0.023301019887853613, 0.012456718908838973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 148.375, 139, 168, 148.0, 157.5, 168.0, 168.0, 0.07918204942939436, 0.06410343650094523, 0.028146744133105025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0098483b-c94f-43be-aa1e-202fccce6c98", 3, 0, 0.0, 829.3333333333334, 506, 1429, 553.0, 1429.0, 1429.0, 1429.0, 0.01795719005889958, 0.024755436165182207, 0.011515515760427142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1043.9375, 287, 1506, 1386.5, 1488.5, 1506.0, 1506.0, 0.08071391457441067, 60.398098131094535, 0.16862035327471486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19623df3-0593-4f80-85e9-0e7b375fb8a6", 1, 0, 0.0, 1689.0, 1689, 1689, 1689.0, 1689.0, 1689.0, 1689.0, 0.5920663114268797, 0.18906805062166962, 0.3532739416814683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/072ab324-93cd-42ee-b0f3-02ac5e2e6514", 3, 0, 0.0, 405.0, 229, 498, 488.0, 498.0, 498.0, 498.0, 0.08685581933989577, 0.040317838013896934, 0.05569855602200348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 545.7619047619048, 287, 1391, 558.0, 986.4000000000001, 1352.8999999999994, 1391.0, 0.12359048000188329, 7.223238247133878, 0.2764520869870995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 8, 44.44444444444444, 805.3888888888888, 136, 1653, 1131.0, 1604.4, 1653.0, 1653.0, 0.12150586265787325, 80.77181325561459, 0.18799393398856495], "isController": false}, {"data": ["register", 25, 10, 40.0, 739.9200000000001, 163, 1466, 566.0, 1353.2, 1434.5, 1466.0, 0.09680467140622337, 0.030024573865836467, 0.04367554510710469], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a999ece6-06d2-40ac-b308-b86821e854dd", 3, 0, 0.0, 423.0, 250, 546, 473.0, 546.0, 546.0, 546.0, 0.03758174028512014, 0.024161437846065194, 0.02410026964898655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 445.625, 279, 1693, 294.0, 911.8000000000009, 1693.0, 1693.0, 0.07999520028798272, 6.097607776345919, 0.1786318602133872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 148.93333333333334, 141, 152, 150.0, 152.0, 152.0, 152.0, 0.08649720902338884, 0.06715359489608802, 0.030747054770032756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/350927d6-c998-43e4-b7b5-dfc25ee0836a", 3, 0, 0.0, 396.66666666666663, 245, 670, 275.0, 670.0, 670.0, 670.0, 0.039876648234793706, 0.03324352087542535, 0.025571939134942576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 446.64705882352945, 281, 1471, 296.0, 774.1999999999994, 1471.0, 1471.0, 0.0840074519551499, 6.034425914075202, 0.18767036989222338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 166.24999999999997, 135, 433, 142.0, 347.8000000000003, 433.0, 433.0, 0.094610362988426, 0.0703110217130783, 0.04748996735942477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 163.08333333333337, 135, 423, 140.0, 339.9000000000003, 423.0, 423.0, 0.09460588763974079, 0.025314466028602513, 0.05395492029453967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 191.66666666666666, 136, 441, 145.0, 435.3, 441.0, 441.0, 0.0946066335017857, 0.02549944418602818, 0.055618352898510734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 163.83333333333337, 134, 423, 140.0, 340.5000000000003, 423.0, 423.0, 0.0946073793755913, 0.025499645222327342, 0.05571118140964995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c0516a5-d0af-480c-a61a-7e89980af400", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 1.237736191860465, 2.3127119670542635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 145.5, 140, 151, 145.5, 151.0, 151.0, 151.0, 0.06600551146020693, 0.019466469200178214, 0.04080223511163182], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1333.6181818181817, 1075, 2042, 1175.0, 1852.8, 1916.3999999999996, 2042.0, 0.2478951448609083, 296.56877555010186, 0.48949607705933257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, 40.0, 739.9200000000001, 163, 1466, 566.0, 1353.2, 1434.5, 1466.0, 0.09708398541410203, 0.03011120485109258, 0.04380156373175306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 170.66666666666666, 142, 295, 147.5, 295.0, 295.0, 295.0, 0.029692974642199655, 0.008003184571530375, 0.01748521846606093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 167.16666666666666, 136, 298, 141.5, 298.0, 298.0, 298.0, 0.02969312158838405, 0.008003224178119139, 0.017456307808796093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 178.6, 134, 425, 143.0, 410.0, 425.0, 425.0, 0.083948959032908, 0.02262686786433848, 0.049352805993955674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 199.53333333333333, 134, 447, 144.0, 431.40000000000003, 447.0, 447.0, 0.08381901797638538, 0.022591844688947624, 0.049358269374766006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 168.66666666666669, 137, 301, 142.5, 301.0, 301.0, 301.0, 0.029692974642199655, 0.007945190480432329, 0.01693427460062949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 183.4, 136, 443, 148.0, 428.0, 443.0, 443.0, 0.0839461401564756, 0.062385754549880795, 0.04213702738323092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4df487ef-0d6d-4735-9ccb-40685f0b29ce", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 178.83333333333334, 137, 340, 146.0, 340.0, 340.0, 340.0, 0.02969370938766622, 0.022067297699232418, 0.014904850219980897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 200.99999999999997, 140, 442, 146.0, 430.6, 442.0, 442.0, 0.08394989870045558, 0.022463156488207837, 0.047877676602603565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 147.83333333333334, 142, 152, 149.5, 152.0, 152.0, 152.0, 0.029813368314352155, 0.02346638170055453, 0.010597720767992367], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 550.25, 137, 1183, 516.0, 1091.3000000000002, 1183.0, 1183.0, 0.087524000722073, 0.01771420815395472, 0.05955307373350036], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1115.458333333333, 806, 1925, 1000.5, 1778.0, 1896.75, 1925.0, 0.09847406234228763, 0.05096802054825434, 0.04529422203439207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 351.3333333333333, 286, 642, 292.5, 642.0, 642.0, 642.0, 0.029672710008605083, 0.04598690506216433, 0.06673462026349367], "isController": false}, {"data": ["addBook", 60, 13, 21.666666666666668, 1232.8666666666668, 706, 2305, 1119.0, 2033.0, 2069.55, 2305.0, 0.2745455127823815, 77.73900080590548, 0.9988514488567467], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e4af01b-075d-45cb-a19b-96c518ad46b5", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 254.01818181818183, 136, 595, 150.0, 564.2, 579.8, 595.0, 0.24906036317529323, 0.1850927113050763, 0.12039539040211927], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 808.4545454545454, 663, 1122, 705.0, 1075.8, 1118.0, 1122.0, 0.24857184178176295, 73.08837484577246, 0.1250141587086015], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 205.9818181818181, 135, 449, 147.0, 428.2, 442.59999999999997, 449.0, 0.24926918806227197, 0.4410896179383172, 0.1212266168505971], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7b159b3-10eb-4112-a91c-2b5592e42a62", 3, 0, 0.0, 499.66666666666663, 362, 772, 365.0, 772.0, 772.0, 772.0, 0.08958165367732689, 0.0405333654334259, 0.057446568276150384], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1074.7636363636364, 929, 1479, 988.0, 1334.0, 1415.3999999999999, 1479.0, 0.24864938176721896, 223.73515079313503, 0.12481033420737359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 199.23529411764707, 138, 426, 150.0, 421.2, 426.0, 426.0, 0.08516052759451566, 0.06362090196269969, 0.03027190629336299], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 13, 7.428571428571429, 198.2857142857141, 136, 585, 151.0, 324.0, 410.1999999999998, 583.48, 0.7598289299437726, 1.6392461140177583, 0.3655362289147472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 147.58333333333334, 142, 153, 149.5, 152.4, 153.0, 153.0, 0.09830505697597261, 0.07612881853705691, 0.03494437572192776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c728dcd7-229c-4851-9122-f1ef3063830e", 3, 0, 0.0, 531.6666666666667, 242, 1052, 301.0, 1052.0, 1052.0, 1052.0, 0.01751415727713235, 0.024144679709848797, 0.011231409451806878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 148.61904761904762, 141, 162, 150.0, 157.0, 161.5, 162.0, 0.116888104687213, 0.09485743651862696, 0.04155006846303275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=072ab324-93cd-42ee-b0f3-02ac5e2e6514", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 0.728484122983871, 2.780052923387097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 359.9166666666667, 276, 874, 291.5, 781.0000000000003, 874.0, 874.0, 0.09450455984501253, 0.1464636098379247, 0.21254297004205455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 425.4666666666667, 277, 866, 298.0, 852.8, 866.0, 866.0, 0.08374835294905866, 0.12979358997085558, 0.1883520086344552], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f9bf06b-bccc-48bc-a9ad-bcfa0ec35d55", 1, 0, 0.0, 1216.0, 1216, 1216, 1216.0, 1216.0, 1216.0, 1216.0, 0.8223684210526315, 0.14857241981907895, 0.5669844777960527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 194.66666666666666, 137, 423, 149.0, 422.1, 423.0, 423.0, 0.0628203181849116, 0.05208442396385738, 0.022330659979792798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e6b105b-49e6-47be-8680-b02bf693d6c5", 3, 0, 0.0, 1044.6666666666667, 245, 2157, 732.0, 2157.0, 2157.0, 2157.0, 0.053087949035568925, 0.03413043598478146, 0.03404402981773138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0098483b-c94f-43be-aa1e-202fccce6c98", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 182.625, 137, 429, 151.0, 414.3, 429.0, 429.0, 0.07733952049497293, 0.060043866009280744, 0.02749178267594741], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70f63bf7-8d65-492d-8d0c-99bda521be7e", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.3296789461678832, 1.2581261405109487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43b2ee8e-7434-412f-a8f0-245c3bd3b66e", 1, 0, 0.0, 1283.0, 1283, 1283, 1283.0, 1283.0, 1283.0, 1283.0, 0.779423226812159, 0.14081376656274358, 0.5373757794232269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 144.76470588235296, 136, 152, 145.0, 150.4, 152.0, 152.0, 0.08419384394423396, 0.06256983910308793, 0.04226136307357056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 175.76470588235293, 135, 424, 142.0, 420.8, 424.0, 424.0, 0.0841950948928246, 0.029967417736439635, 0.04760156961943817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 280.11764705882354, 134, 1322, 147.0, 622.7999999999994, 1322.0, 1322.0, 0.0840643636327673, 4.470811160842325, 0.048995693555724786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 242.76470588235296, 137, 975, 146.0, 552.5999999999997, 975.0, 975.0, 0.08408432173629178, 1.4756585935413349, 0.04908943944197687], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 25.641025641025642, 0.7457121551081283], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.256410256410257, 0.29828486204325133], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.256410256410257, 0.29828486204325133], "isController": false}, {"data": ["401/Unauthorized", 21, 53.84615384615385, 1.5659955257270695], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1341, 39, "401/Unauthorized", 21, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
