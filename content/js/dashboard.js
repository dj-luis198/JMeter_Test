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

    var data = {"OkPercent": 98.33711262282691, "KoPercent": 1.6628873771730914};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8309399477806788, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4732142857142857, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0de2e68-17fe-46d7-8e3c-01ef9afe0e77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=32bb21ba-c424-44d7-93e9-faeb0d21165f"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/224355ce-b2d7-4ab6-b22d-31c824821fe8"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=275f1da3-e3e4-4f24-85d1-9bc24cdbb35f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ba6ef86-b539-4ef3-9234-ffc3adbcddf5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c18ee4d-a77e-47c1-967a-86169f6c2497"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6b42cd6a-eb0f-4ae2-8c92-7752769643c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54eeb08a-0d02-4390-b953-9f23b31909ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.05, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/55cd83cd-4bc3-4ef0-80e8-139f98dde426"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b0de2e68-17fe-46d7-8e3c-01ef9afe0e77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=936bbc54-8666-4f71-b9dc-ba6f7493d62f"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=663143bc-012d-459f-b9bd-07a813b96757"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b4453a2-e8a3-46fa-a6be-e4721c1c20e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/275f1da3-e3e4-4f24-85d1-9bc24cdbb35f"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/32bb21ba-c424-44d7-93e9-faeb0d21165f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b42cd6a-eb0f-4ae2-8c92-7752769643c7"], "isController": false}, {"data": [0.3951612903225806, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1ba6ef86-b539-4ef3-9234-ffc3adbcddf5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=224355ce-b2d7-4ab6-b22d-31c824821fe8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/acee16d3-54b5-44e8-b5b0-8ecd6869a080"], "isController": false}, {"data": [0.8035714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0c18ee4d-a77e-47c1-967a-86169f6c2497"], "isController": false}, {"data": [0.9138888888888889, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/54eeb08a-0d02-4390-b953-9f23b31909ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3b4453a2-e8a3-46fa-a6be-e4721c1c20e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/00fdad13-848f-4e92-a527-d83290b58b1c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/936bbc54-8666-4f71-b9dc-ba6f7493d62f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/663143bc-012d-459f-b9bd-07a813b96757"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1323, 22, 1.6628873771730914, 265.25170068027217, 77, 2354, 91.0, 642.6000000000001, 814.3999999999999, 1479.8, 5.1570302054626325, 712.1820716032497, 3.7813204377531253], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1173.8571428571431, 943, 1602, 1147.0, 1375.2000000000003, 1502.65, 1602.0, 0.2447498961998208, 294.51673419369115, 1.2034333275059548], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0de2e68-17fe-46d7-8e3c-01ef9afe0e77", 1, 0, 0.0, 362.0, 362, 362, 362.0, 362.0, 362.0, 362.0, 2.7624309392265194, 0.4990719958563536, 1.9045666436464088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=32bb21ba-c424-44d7-93e9-faeb0d21165f", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 513.9166666666666, 85, 1311, 428.0, 1180.5000000000005, 1311.0, 1311.0, 0.07427121371541746, 0.014125311397536672, 0.05018504943677663], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 513.9166666666666, 85, 1311, 428.0, 1180.5000000000005, 1311.0, 1311.0, 0.07253604134554356, 0.013795306691449814, 0.04901259369238674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 128.47058823529414, 78, 251, 82.0, 245.4, 251.0, 251.0, 0.1062646113840653, 0.037822583417719935, 0.06007906165222718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 91.70588235294119, 79, 237, 83.0, 119.39999999999989, 237.0, 237.0, 0.1062652756333723, 0.07897253394237921, 0.05334018718315758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 146.29411764705884, 78, 565, 82.0, 308.9999999999998, 565.0, 565.0, 0.1062652756333723, 1.864928728035905, 0.062038947395563114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/224355ce-b2d7-4ab6-b22d-31c824821fe8", 3, 0, 0.0, 312.3333333333333, 160, 405, 372.0, 405.0, 405.0, 405.0, 0.03469290992564153, 0.028199282579533497, 0.02224773195101361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 117.52941176470586, 79, 537, 81.0, 300.1999999999998, 537.0, 537.0, 0.10626394714306253, 5.651455864910394, 0.06193439842104276], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 273.2307692307692, 81, 1481, 178.0, 972.9999999999995, 1481.0, 1481.0, 0.07014060493574042, 0.16147829923870466, 0.0453395361682727], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=275f1da3-e3e4-4f24-85d1-9bc24cdbb35f", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 90.05263157894738, 79, 235, 82.0, 84.0, 235.0, 235.0, 0.10851190204230822, 0.08064214595136382, 0.054467888329830495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 421.83333333333337, 383, 552, 399.0, 552.0, 552.0, 552.0, 0.028190454712034504, 8.288929696529756, 0.01607736870295718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 116.36842105263158, 78, 268, 81.0, 246.0, 268.0, 268.0, 0.108511282317801, 0.037613080178415394, 0.06140569584287566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 658.6666666666666, 538, 729, 703.0, 729.0, 729.0, 729.0, 0.02814932277420959, 25.328810113465227, 0.016026421071644717], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ba6ef86-b539-4ef3-9234-ffc3adbcddf5", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.49361765710382516, 1.8837517076502732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 192.0, 82, 254, 239.5, 254.0, 254.0, 254.0, 0.02820755116144592, 0.04991414326615235, 0.015618829598183434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c18ee4d-a77e-47c1-967a-86169f6c2497", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 81.49999999999999, 79, 84, 82.0, 84.0, 84.0, 84.0, 0.07022436685209243, 0.052188225756291354, 0.035249340392554215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 116.85714285714286, 79, 245, 82.0, 245.0, 245.0, 245.0, 0.07022648039928771, 0.018791069950590655, 0.04005103960271877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 104.07142857142856, 78, 244, 82.5, 238.5, 244.0, 244.0, 0.07022542360978741, 0.018927946207325515, 0.04128486817684768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 113.78571428571428, 77, 242, 81.5, 238.5, 242.0, 242.0, 0.07017156948739668, 0.01891343083839989, 0.0413217347665041], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 81.5, 78, 83, 82.0, 83.0, 83.0, 83.0, 0.02823011306160281, 0.020979605507695058, 0.015851870127364862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 427.99999999999994, 79, 730, 544.0, 724.0, 730.0, 730.0, 0.07007413843846791, 37.83925463452833, 0.037582731279693915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 121.73684210526315, 78, 542, 80.0, 244.0, 542.0, 542.0, 0.10851190204230822, 5.166613288210467, 0.06330232772307763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 338.73333333333335, 79, 565, 405.0, 563.2, 565.0, 565.0, 0.07007381108100533, 12.36997110915164, 0.037650987164813604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 144.1578947368421, 78, 563, 82.0, 328.0, 563.0, 563.0, 0.10841716643176282, 1.705486283088634, 0.06335293817653738], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 382.4166666666667, 92, 641, 382.5, 609.8000000000001, 641.0, 641.0, 0.07255928698407323, 0.013799727675926037, 0.04959517019687753], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6b42cd6a-eb0f-4ae2-8c92-7752769643c7", 3, 0, 0.0, 248.0, 174, 392, 178.0, 392.0, 392.0, 392.0, 0.08134490238611713, 0.03680644997288503, 0.052164537011930585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54eeb08a-0d02-4390-b953-9f23b31909ff", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 221.64285714285714, 162, 327, 167.5, 326.0, 327.0, 327.0, 0.0701416862061364, 0.10870591407142427, 0.1577502962233712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 377.45, 94, 956, 372.0, 685.0000000000001, 942.7499999999998, 956.0, 0.09129877066205304, 0.05608098315081187, 0.041280596500518116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 82.2, 80, 87, 82.0, 85.2, 87.0, 87.0, 0.07007250168174005, 0.052075365019340014, 0.03517311119571717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 155.53333333333333, 79, 247, 84.0, 245.8, 247.0, 247.0, 0.0700198389543704, 0.08183568677792041, 0.0364048459563543], "isController": false}, {"data": ["login", 20, 0, 0.0, 2303.1499999999996, 1253, 3957, 2255.5, 3142.1, 3916.3499999999995, 3957.0, 0.09141352737378076, 32.9326070195305, 0.18339838929364768], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 85.94736842105262, 81, 93, 85.0, 92.0, 93.0, 93.0, 0.1045547344034602, 0.08464440900436378, 0.037165940744979996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 525.0666666666666, 164, 811, 644.0, 807.4, 811.0, 811.0, 0.06999206756567589, 50.284297206733235, 0.14666892439690168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55cd83cd-4bc3-4ef0-80e8-139f98dde426", 2, 0, 0.0, 174.5, 167, 182, 174.5, 182.0, 182.0, 182.0, 0.03406980903872034, 0.030110524589884672, 0.021177181106587395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0de2e68-17fe-46d7-8e3c-01ef9afe0e77", 3, 0, 0.0, 308.0, 193, 496, 235.0, 496.0, 496.0, 496.0, 0.03125227881199671, 0.03134383822257873, 0.020041337649620287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=936bbc54-8666-4f71-b9dc-ba6f7493d62f", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 576.0, 81, 815, 710.5, 815.0, 815.0, 815.0, 0.037517293127300864, 33.66530397800548, 0.06966254220695477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 260.29411764705884, 161, 653, 169.0, 516.1999999999998, 653.0, 653.0, 0.10620818052891674, 7.629149342758789, 0.23726619557611692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=663143bc-012d-459f-b9bd-07a813b96757", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 881.5909090909092, 89, 1890, 879.0, 1588.1, 1845.2999999999993, 1890.0, 0.09115468120721945, 0.028680059499146458, 0.04112642843528846], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 261.00000000000006, 162, 644, 167.0, 479.0, 644.0, 644.0, 0.10836584308625921, 6.982434128539, 0.24225803582631808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 88.23529411764706, 81, 127, 85.0, 106.19999999999999, 127.0, 127.0, 0.10988016598368602, 0.0853073554267875, 0.03905896525201339], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b4453a2-e8a3-46fa-a6be-e4721c1c20e3", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 250.2, 162, 337, 318.0, 332.2, 337.0, 337.0, 0.08043801178684999, 0.12466320772044036, 0.18090697377452689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 82.46666666666667, 78, 89, 82.0, 88.4, 89.0, 89.0, 0.06867911742755498, 0.051039851916376305, 0.03447369761500318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 81.4, 78, 84, 81.0, 84.0, 84.0, 84.0, 0.06867911742755498, 0.025253883804090528, 0.03878402764105546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 128.66666666666666, 77, 802, 81.0, 370.0000000000002, 802.0, 802.0, 0.06867943188373946, 4.137135405220095, 0.03998251822294259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 144.13333333333335, 78, 631, 81.0, 447.4000000000001, 631.0, 631.0, 0.0686027898467871, 1.362024425451635, 0.040004895094900524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 3.205672554347826, 6.719174592391305], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 764.9821428571428, 620, 1145, 650.0, 993.3000000000002, 1071.9499999999998, 1145.0, 0.24678518231255342, 295.2408744568522, 0.4873043346054522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/275f1da3-e3e4-4f24-85d1-9bc24cdbb35f", 3, 0, 0.0, 724.6666666666666, 272, 1481, 421.0, 1481.0, 1481.0, 1481.0, 0.016802957320488403, 0.023164233155035286, 0.010775333958776745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 881.5909090909092, 89, 1890, 879.0, 1588.1, 1845.2999999999993, 1890.0, 0.0890551251224508, 0.028019474736680185, 0.04017916777985573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 107.66666666666666, 79, 242, 81.5, 242.0, 242.0, 242.0, 0.03395297512944572, 0.009151387827858416, 0.019993792971734148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 132.66666666666666, 79, 240, 81.5, 240.0, 240.0, 240.0, 0.033983936925813064, 0.009159732999535554, 0.01997883791927682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 182.58823529411762, 78, 728, 81.0, 700.0, 728.0, 728.0, 0.1105921232386578, 11.73347613405717, 0.06389795355781366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 147.41176470588235, 80, 405, 82.0, 389.8, 405.0, 405.0, 0.11059068436117617, 3.851869470465782, 0.06400512091790268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 134.83333333333334, 81, 245, 83.5, 245.0, 245.0, 245.0, 0.03395432012133011, 0.009085433313715282, 0.019364573194196075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 101.05882352941177, 79, 245, 83.0, 238.6, 245.0, 245.0, 0.11058996493647583, 0.08218648761392393, 0.05551097849350446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 83.66666666666667, 81, 86, 84.0, 86.0, 86.0, 86.0, 0.03398335948164049, 0.025255211489773843, 0.017058053489807826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 127.17647058823529, 78, 380, 82.0, 275.9999999999999, 380.0, 380.0, 0.11037742586857295, 0.049038316387152066, 0.06185903991117864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 85.16666666666667, 80, 91, 84.5, 91.0, 91.0, 91.0, 0.03357920775455838, 0.0264305092286856, 0.011936359006503174], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 487.3333333333333, 81, 1344, 425.0, 1098.6000000000008, 1344.0, 1344.0, 0.07334515005195281, 0.01378205985269849, 0.04991743895544282], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1383.65, 810, 2354, 1332.0, 1997.7000000000003, 2337.1, 2354.0, 0.09258059140481789, 0.04791768891069676, 0.04258345561686448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32bb21ba-c424-44d7-93e9-faeb0d21165f", 3, 0, 0.0, 263.6666666666667, 172, 355, 264.0, 355.0, 355.0, 355.0, 0.028677672520098268, 0.02876168913880949, 0.01839030431790156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 246.5, 165, 329, 245.5, 329.0, 329.0, 329.0, 0.03393684353418289, 0.0525954791882307, 0.07632475650314764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b42cd6a-eb0f-4ae2-8c92-7752769643c7", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 0.7002483042635659, 2.672298934108527], "isController": false}, {"data": ["addBook", 62, 12, 19.35483870967742, 824.4354838709678, 418, 1852, 692.0, 1310.0, 1451.0499999999997, 1852.0, 0.2855826807922616, 78.24025326750346, 1.0404326563219715], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1ba6ef86-b539-4ef3-9234-ffc3adbcddf5", 3, 0, 0.0, 622.6666666666667, 162, 1344, 362.0, 1344.0, 1344.0, 1344.0, 0.023786492443824234, 0.02385617943340575, 0.015253707719509681], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=224355ce-b2d7-4ab6-b22d-31c824821fe8", 1, 0, 0.0, 641.0, 641, 641, 641.0, 641.0, 641.0, 641.0, 1.5600624024960998, 0.28184721138845553, 1.0755898985959438], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 155.98214285714283, 79, 340, 83.0, 322.0, 332.3, 340.0, 0.24757618493941014, 0.18398972337782335, 0.11967794096192189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acee16d3-54b5-44e8-b5b0-8ecd6869a080", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.8381520669291338, 1.5660884186351707], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 463.96428571428567, 383, 647, 402.5, 588.3000000000003, 643.0, 647.0, 0.24753131713181928, 72.782426050019, 0.12449084797156926], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 137.01785714285717, 79, 391, 84.0, 245.60000000000002, 249.2, 391.0, 0.24769992922859163, 0.4383127653927813, 0.12046344214437367], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 603.607142857143, 537, 848, 561.5, 725.5, 785.3, 848.0, 0.24717514124293785, 222.40862657794844, 0.12407033456920903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 98.13333333333334, 82, 247, 86.0, 167.20000000000005, 247.0, 247.0, 0.07801082790291293, 0.05827957357981288, 0.027730411481113576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c18ee4d-a77e-47c1-967a-86169f6c2497", 3, 0, 0.0, 714.0, 211, 1526, 405.0, 1526.0, 1526.0, 1526.0, 0.05869118654015455, 0.03773277780494962, 0.03763725178519026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 12, 6.666666666666667, 155.0944444444444, 79, 1323, 86.0, 280.0, 434.79999999999995, 1131.8399999999995, 0.7551729346020238, 1.5697985300873483, 0.3645946412613905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 100.86666666666666, 83, 255, 85.0, 171.60000000000005, 255.0, 255.0, 0.07199424046076314, 0.05575335223182146, 0.025591702663786898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54eeb08a-0d02-4390-b953-9f23b31909ff", 3, 0, 0.0, 296.6666666666667, 189, 508, 193.0, 508.0, 508.0, 508.0, 0.0232725918685564, 0.02750741571442978, 0.0149241555927917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 101.6470588235294, 81, 237, 85.0, 227.39999999999998, 237.0, 237.0, 0.10327566096423017, 0.08381061939577664, 0.03671127010837869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 240.26666666666668, 162, 883, 165.0, 598.0000000000002, 883.0, 883.0, 0.06857675796519044, 5.568638119876745, 0.15306100216931143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 322.29411764705884, 161, 973, 169.0, 812.1999999999998, 973.0, 973.0, 0.110317259459705, 15.67765545202497, 0.24478543090246008], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 112.92857142857142, 82, 278, 86.5, 259.5, 278.0, 278.0, 0.07066852423930382, 0.05859138386637591, 0.025120451975690027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b4453a2-e8a3-46fa-a6be-e4721c1c20e3", 3, 0, 0.0, 324.0, 191, 526, 255.0, 526.0, 526.0, 526.0, 0.026603291713961405, 0.026681231045154654, 0.017060053605632803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 98.60000000000001, 83, 236, 87.0, 157.40000000000003, 236.0, 236.0, 0.06626231926952418, 0.05144389044850756, 0.02355418380283868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00fdad13-848f-4e92-a527-d83290b58b1c", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.8995378521126761, 1.6807878521126762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/936bbc54-8666-4f71-b9dc-ba6f7493d62f", 3, 0, 0.0, 310.3333333333333, 200, 486, 245.0, 486.0, 486.0, 486.0, 0.019544483243863032, 0.026943647961510397, 0.012533408851044977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 81.86666666666667, 80, 85, 81.0, 84.4, 85.0, 85.0, 0.0804738299105131, 0.059805258361230934, 0.040394090404300524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/663143bc-012d-459f-b9bd-07a813b96757", 3, 0, 0.0, 725.0, 163, 1583, 429.0, 1583.0, 1583.0, 1583.0, 0.016934514233459215, 0.023345594980045497, 0.010859698255180551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 134.13333333333333, 79, 245, 81.0, 243.8, 245.0, 245.0, 0.08047469339141818, 0.021533267567625566, 0.04589572357479318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 145.0666666666667, 79, 253, 82.0, 248.2, 253.0, 253.0, 0.08047426164864938, 0.021690328334987526, 0.047310063977038005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 122.8, 78, 245, 82.0, 242.6, 245.0, 245.0, 0.0804738299105131, 0.021690211968067984, 0.04738839788675723], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.45351473922902497], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.545454545454546, 0.07558578987150416], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.07558578987150416], "isController": false}, {"data": ["401/Unauthorized", 14, 63.63636363636363, 1.0582010582010581], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1323, 22, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
