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

    var data = {"OkPercent": 97.46543778801843, "KoPercent": 2.5345622119815667};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7495056031641397, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8d16620-a631-431c-8df9-e5b315f35453"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a7bf7dc8-9063-4049-9fc5-dbf76227063f"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9e0257fa-c1ce-41c4-b118-8bb77f3852f6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/62c0f231-7e2c-43bd-a843-20bca7784296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/69904a2e-ec8a-4fd0-9faa-04a8265d3d09"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/651abba9-fdd0-4e64-908d-9d0ca6b3a600"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f263f3c-4fec-49fb-9322-a363a686893b"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b91df895-08af-49d3-9516-4b8a32b73333"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/93c265b8-fa59-48fe-bd03-42924762c526"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/10951bf9-d95f-44dc-b8cb-d216d66578a1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d196fc14-5733-47a1-9aca-d19b59b13675"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/faa253f8-0ed2-4367-862a-f7a8b4362a4b"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6e8e616c-31e5-417c-b171-3ee470830bd5"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "register"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dfddc937-69a9-426c-82c2-d559347c3a19"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e0257fa-c1ce-41c4-b118-8bb77f3852f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d196fc14-5733-47a1-9aca-d19b59b13675"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7bf7dc8-9063-4049-9fc5-dbf76227063f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8d16620-a631-431c-8df9-e5b315f35453"], "isController": false}, {"data": [0.2672413793103448, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9152046783625731, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69904a2e-ec8a-4fd0-9faa-04a8265d3d09"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93c265b8-fa59-48fe-bd03-42924762c526"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b91df895-08af-49d3-9516-4b8a32b73333"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1f263f3c-4fec-49fb-9322-a363a686893b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e8e616c-31e5-417c-b171-3ee470830bd5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dfddc937-69a9-426c-82c2-d559347c3a19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=faa253f8-0ed2-4367-862a-f7a8b4362a4b"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1302, 33, 2.5345622119815667, 435.0015360983105, 139, 2391, 159.0, 1160.0, 1334.0, 1836.6100000000004, 5.145512891446277, 721.9788243137834, 3.7690875754833306], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2147.5818181818186, 1730, 3001, 2101.0, 2514.4, 2546.6, 3001.0, 0.24593645896214816, 295.94388247032, 1.2092676473382968], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8d16620-a631-431c-8df9-e5b315f35453", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 507.64285714285717, 159, 998, 517.5, 884.0, 998.0, 998.0, 0.10115606936416185, 0.020751953125, 0.06771727104407514], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 507.64285714285717, 159, 998, 517.5, 884.0, 998.0, 998.0, 0.10204156006967981, 0.02093360966552234, 0.06831004826930225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 186.26666666666668, 140, 450, 149.0, 440.4, 450.0, 450.0, 0.06908335597732224, 0.01848519486111943, 0.03939910145581659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 146.86666666666667, 143, 152, 146.0, 152.0, 152.0, 152.0, 0.06908367414612579, 0.051340503930861064, 0.034676766124129545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 206.6, 140, 454, 148.0, 449.8, 454.0, 454.0, 0.06908494685064756, 0.018620552080838598, 0.04068185835052781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 204.9333333333333, 142, 447, 146.0, 443.4, 447.0, 447.0, 0.06908367414612579, 0.018620209047197966, 0.040613644371062234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7bf7dc8-9063-4049-9fc5-dbf76227063f", 3, 0, 0.0, 375.3333333333333, 236, 489, 401.0, 489.0, 489.0, 489.0, 0.06705708793419464, 0.030341586011891457, 0.04300210391613393], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 270.57142857142856, 146, 483, 246.5, 448.0, 483.0, 483.0, 0.10228011601487445, 0.18378458346422755, 0.06610109339270451], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9e0257fa-c1ce-41c4-b118-8bb77f3852f6", 3, 0, 0.0, 428.0, 356, 495, 433.0, 495.0, 495.0, 495.0, 0.0201950845164287, 0.02386990621066166, 0.012950623859819188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62c0f231-7e2c-43bd-a843-20bca7784296", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 0.5101213059105432, 0.9531624400958466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 153.875, 140, 228, 148.5, 189.50000000000003, 228.0, 228.0, 0.0881955736846457, 0.0655437808339994, 0.04427004382217568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 969.125, 738, 1163, 1007.0, 1163.0, 1163.0, 1163.0, 0.03371032715872507, 9.911955472871615, 0.019225420957710394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69904a2e-ec8a-4fd0-9faa-04a8265d3d09", 3, 0, 0.0, 388.0, 217, 523, 424.0, 523.0, 523.0, 523.0, 0.02400172812442496, 0.02836923008456609, 0.015391733204790745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 183.93750000000003, 140, 445, 150.0, 434.5, 445.0, 445.0, 0.08819654600276716, 0.03187865877858808, 0.049836646905128075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1092.5, 986, 1343, 1032.0, 1343.0, 1343.0, 1343.0, 0.033707770483790776, 30.330311133255243, 0.01919104510942385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 395.625, 143, 604, 442.0, 604.0, 604.0, 604.0, 0.03379491555495476, 0.05980115916560353, 0.01871261437466733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 172.86666666666667, 144, 442, 151.0, 302.2000000000001, 442.0, 442.0, 0.0816499828535036, 0.06067933296046507, 0.040984464049512545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 249.66666666666669, 143, 479, 151.0, 461.6, 479.0, 479.0, 0.0815212960799126, 0.029976059912717866, 0.0460361798305444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 268.59999999999997, 143, 1379, 149.0, 824.6000000000004, 1379.0, 1379.0, 0.08152794234343917, 4.91110842842662, 0.04746242580957247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 223.13333333333333, 142, 718, 148.0, 548.2, 718.0, 718.0, 0.08165220515388719, 1.6211045944334972, 0.04761450531011508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 148.625, 143, 156, 149.5, 156.0, 156.0, 156.0, 0.03383436387166626, 0.025144483306970725, 0.018998788306843845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 749.7222222222223, 141, 1497, 711.0, 1390.8000000000002, 1497.0, 1497.0, 0.09264739943896852, 41.69463212066037, 0.050485594616156676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 253.18749999999994, 143, 1276, 148.5, 682.4000000000005, 1276.0, 1276.0, 0.08819362911271697, 4.982084161871137, 0.05137451148997624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 572.6666666666667, 143, 1215, 445.5, 1181.7, 1215.0, 1215.0, 0.09264358468910357, 13.632630148152533, 0.05057398812618056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 258.1875, 139, 1027, 150.0, 623.1000000000004, 1027.0, 1027.0, 0.08819751834232764, 1.6430986647722574, 0.051462907431192154], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 477.42857142857144, 148, 1049, 496.0, 964.5, 1049.0, 1049.0, 0.10219201880333147, 0.02096447595567786, 0.06889549816784309], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/651abba9-fdd0-4e64-908d-9d0ca6b3a600", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 506.93333333333334, 296, 1533, 304.0, 1144.2000000000003, 1533.0, 1533.0, 0.0814535660371211, 6.614273498675022, 0.1818016018522541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 559.1818181818181, 189, 1375, 486.0, 1212.2, 1354.4499999999998, 1375.0, 0.09446073653612479, 0.05802324539181884, 0.042710274429907984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 167.27777777777777, 142, 428, 151.0, 220.10000000000034, 428.0, 428.0, 0.09264263105072183, 0.06884867405234309, 0.046502258164131866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 236.50000000000003, 139, 597, 150.0, 459.30000000000024, 597.0, 597.0, 0.09264692257805503, 0.09436595727432753, 0.04894725108860134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f263f3c-4fec-49fb-9322-a363a686893b", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 0.6593578923357664, 2.5162522810218975], "isController": false}, {"data": ["login", 22, 0, 0.0, 2599.409090909091, 1835, 4116, 2649.5, 3808.2, 4083.5999999999995, 4116.0, 0.095565749235474, 41.702079613870936, 0.20181307502345705], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 171.5, 145, 441, 152.5, 255.50000000000017, 441.0, 441.0, 0.08294152104381905, 0.0671469931106699, 0.02948311880854505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b91df895-08af-49d3-9516-4b8a32b73333", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 0.48828125, 1.8633868243243243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93c265b8-fa59-48fe-bd03-42924762c526", 3, 0, 0.0, 316.0, 244, 449, 255.0, 449.0, 449.0, 449.0, 0.01932267580414536, 0.026637868499529812, 0.01239116905409061], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10951bf9-d95f-44dc-b8cb-d216d66578a1", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d196fc14-5733-47a1-9aca-d19b59b13675", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/faa253f8-0ed2-4367-862a-f7a8b4362a4b", 3, 0, 0.0, 458.0, 362, 529, 483.0, 529.0, 529.0, 529.0, 0.022863239721068476, 0.02702357533437488, 0.014661647868002895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 929.611111111111, 291, 1650, 1008.0, 1543.8000000000002, 1650.0, 1650.0, 0.09257116408238833, 55.44538120516084, 0.1963521175653784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e8e616c-31e5-417c-b171-3ee470830bd5", 3, 0, 0.0, 600.6666666666666, 413, 939, 450.0, 939.0, 939.0, 939.0, 0.02575903283418052, 0.030446304759410632, 0.01651865061306498], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, 42.857142857142854, 786.3571428571429, 145, 1496, 1137.5, 1468.0, 1496.0, 1496.0, 0.05895059519047358, 40.306992461692644, 0.09269833059283245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 396.2666666666666, 291, 600, 301.0, 598.2, 600.0, 600.0, 0.06903598155358573, 0.1069922878179107, 0.15526354054483196], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1124.9166666666665, 283, 2117, 1035.5, 1922.0, 2089.5, 2117.0, 0.09672505098216229, 0.030226578431925714, 0.04363962261109275], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 500.75, 293, 1416, 450.0, 884.0000000000006, 1416.0, 1416.0, 0.08812368158710751, 6.717198584306825, 0.19678302090734348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 176.0769230769231, 144, 445, 153.0, 332.9999999999999, 445.0, 445.0, 0.13575889220743959, 0.10539874932120555, 0.04825804371436329], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dfddc937-69a9-426c-82c2-d559347c3a19", 3, 0, 0.0, 385.6666666666667, 255, 499, 403.0, 499.0, 499.0, 499.0, 0.03724024926140172, 0.023941892021897265, 0.023881279637031703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 497.9999999999999, 293, 1722, 310.0, 893.0, 1722.0, 1722.0, 0.09744589188634731, 6.278819061570418, 0.21784586079341473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 192.57142857142858, 148, 441, 152.0, 441.0, 441.0, 441.0, 0.03954511815516374, 0.029388510660233992, 0.019849795636478675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 146.00000000000003, 143, 151, 144.0, 151.0, 151.0, 151.0, 0.039610235284797596, 0.01059883248831498, 0.022590212310861127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 227.14285714285714, 143, 430, 147.0, 430.0, 430.0, 430.0, 0.03961202847538962, 0.010676679550007357, 0.023287540177914595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 230.71428571428572, 145, 449, 150.0, 449.0, 449.0, 449.0, 0.03961180431768667, 0.010676619132501486, 0.023326091800356507], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 151.0, 148, 154, 151.0, 154.0, 154.0, 154.0, 0.024242032452000777, 0.007149505664554917, 0.014985553263785636], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1397.0363636363631, 1137, 2391, 1195.0, 1908.8, 1937.3999999999999, 2391.0, 0.23269588762904045, 278.3851797840159, 0.45948348123624977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1124.9166666666665, 283, 2117, 1035.5, 1922.0, 2089.5, 2117.0, 0.0949239421913192, 0.02966373193478725, 0.042827012980849094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 215.6, 145, 460, 148.5, 458.6, 460.0, 460.0, 0.061861282260658706, 0.016673548734318165, 0.03642807929997773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 183.7, 143, 444, 149.5, 421.5000000000001, 444.0, 444.0, 0.061975147965665764, 0.016704239100120852, 0.03643460847200273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e0257fa-c1ce-41c4-b118-8bb77f3852f6", 1, 0, 0.0, 1049.0, 1049, 1049, 1049.0, 1049.0, 1049.0, 1049.0, 0.9532888465204957, 0.17222503574833176, 0.6572479742612012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d196fc14-5733-47a1-9aca-d19b59b13675", 3, 0, 0.0, 377.6666666666667, 314, 438, 381.0, 438.0, 438.0, 438.0, 0.03227923691883924, 0.026909871663133886, 0.020699901279333757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 261.0, 144, 1334, 147.0, 976.3999999999996, 1334.0, 1334.0, 0.12545114160538862, 8.714377982480265, 0.07292224562368517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 259.3076923076923, 142, 1026, 150.0, 792.3999999999999, 1026.0, 1026.0, 0.12509502410484888, 2.8605149885489936, 0.0728374047353278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 151.8, 142, 202, 145.5, 197.60000000000002, 202.0, 202.0, 0.06197553205994274, 0.016583296664476863, 0.03534542062793609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 148.23076923076923, 141, 157, 149.0, 155.0, 157.0, 157.0, 0.12544629933416965, 0.09322718143877257, 0.06296816197047188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 176.0, 143, 425, 149.0, 398.30000000000007, 425.0, 425.0, 0.06197399571139949, 0.04605684642224123, 0.031108040816073573], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7bf7dc8-9063-4049-9fc5-dbf76227063f", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 0.728484122983871, 2.780052923387097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 193.3846153846154, 139, 449, 148.0, 439.0, 449.0, 449.0, 0.12545598425044877, 0.048063816081527086, 0.07073862813881222], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 184.2, 150, 441, 156.5, 413.0000000000001, 441.0, 441.0, 0.06227348021571533, 0.04901604009166657, 0.022136276170430062], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 410.3571428571428, 145, 647, 449.5, 588.0, 647.0, 647.0, 0.10075349218800601, 0.020079012777701813, 0.06855819728613272], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1326.9545454545453, 791, 2243, 1283.0, 1842.0, 2189.149999999999, 2243.0, 0.09419582455599514, 0.04875369825652092, 0.04332639977136104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 394.7, 294, 887, 301.0, 857.9000000000001, 887.0, 887.0, 0.06180316926651998, 0.09578284143160862, 0.13899677619218315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8d16620-a631-431c-8df9-e5b315f35453", 3, 0, 0.0, 350.0, 247, 429, 374.0, 429.0, 429.0, 429.0, 0.027147847175718966, 0.02722738188424158, 0.017409263976616653], "isController": false}, {"data": ["addBook", 58, 13, 22.413793103448278, 1275.2068965517244, 767, 2324, 1136.5, 2162.8, 2309.55, 2324.0, 0.27156736509422924, 73.90602137715089, 0.9886566487182489], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 262.6181818181818, 143, 871, 151.0, 599.4, 608.7999999999998, 871.0, 0.2337153516991106, 0.1736888502373273, 0.11297763583111303], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 849.636363636364, 706, 1233, 746.0, 1149.2, 1183.2, 1233.0, 0.23359623527812817, 68.68504929676915, 0.11748248160960548], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 214.29090909090903, 141, 452, 152.0, 436.0, 446.2, 452.0, 0.2344625904279582, 0.41488888071822283, 0.11402575198547184], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1124.0363636363634, 986, 1480, 1037.0, 1324.4, 1341.2, 1480.0, 0.23361806419824405, 210.20994482233345, 0.11726531738075922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 183.6842105263158, 146, 452, 154.0, 432.0, 452.0, 452.0, 0.10156191535081624, 0.07587389183923283, 0.03610208709736046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 13, 7.60233918128655, 198.81871345029236, 145, 658, 155.0, 304.8, 411.0, 626.32, 0.7109891480603716, 1.5473425936031766, 0.3409502853311713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 193.00000000000003, 150, 435, 153.0, 435.0, 435.0, 435.0, 0.03910942257731095, 0.03028688682012459, 0.0139021775567785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69904a2e-ec8a-4fd0-9faa-04a8265d3d09", 1, 0, 0.0, 855.0, 855, 855, 855.0, 855.0, 855.0, 855.0, 1.1695906432748537, 0.2113029970760234, 0.8063779239766082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93c265b8-fa59-48fe-bd03-42924762c526", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 196.5333333333333, 150, 526, 153.0, 469.00000000000006, 526.0, 526.0, 0.06819700751531023, 0.055343469966037895, 0.024241905015207933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b91df895-08af-49d3-9516-4b8a32b73333", 3, 0, 0.0, 306.3333333333333, 221, 452, 246.0, 452.0, 452.0, 452.0, 0.059863511194476596, 0.028138968152612045, 0.03838903549906214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 425.7142857142857, 296, 873, 305.0, 873.0, 873.0, 873.0, 0.03951141315391389, 0.06123497331568491, 0.08886209423189813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 480.6923076923077, 292, 1483, 304.0, 1129.3999999999996, 1483.0, 1483.0, 0.12491352140825583, 11.674084407909909, 0.2784749530373203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f263f3c-4fec-49fb-9322-a363a686893b", 3, 0, 0.0, 378.33333333333337, 237, 647, 251.0, 647.0, 647.0, 647.0, 0.05803269174968566, 0.02569155624335042, 0.03721497485250024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 155.59999999999994, 152, 175, 154.0, 164.20000000000002, 175.0, 175.0, 0.08349289753751614, 0.06922409180600703, 0.02967911592153894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 184.16666666666666, 142, 462, 152.0, 436.80000000000007, 462.0, 462.0, 0.09065680857814869, 0.07038297150354317, 0.03222566242426379], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e8e616c-31e5-417c-b171-3ee470830bd5", 1, 0, 0.0, 880.0, 880, 880, 880.0, 880.0, 880.0, 880.0, 1.1363636363636362, 0.20530007102272727, 0.7834694602272727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 180.6315789473684, 144, 442, 150.0, 428.0, 442.0, 442.0, 0.09751991459308532, 0.07247329590365033, 0.048950425879732286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dfddc937-69a9-426c-82c2-d559347c3a19", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 238.05263157894737, 140, 444, 148.0, 443.0, 444.0, 444.0, 0.09751841301614186, 0.03380264069597352, 0.055184916082839326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=faa253f8-0ed2-4367-862a-f7a8b4362a4b", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 268.2105263157895, 142, 1294, 149.0, 444.0, 1294.0, 1294.0, 0.09752041512900925, 4.643271965511135, 0.056890250396497484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 237.42105263157896, 142, 709, 148.0, 451.0, 709.0, 709.0, 0.09752041512900925, 1.534071916815086, 0.0569854851768969], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 24.242424242424242, 0.6144393241167435], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.090909090909092, 0.2304147465437788], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.090909090909092, 0.2304147465437788], "isController": false}, {"data": ["401/Unauthorized", 19, 57.57575757575758, 1.4592933947772657], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1302, 33, "401/Unauthorized", 19, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
